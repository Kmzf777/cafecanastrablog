// Story 1.1 — Parse, validate, and sanitize Gemini AI response

import { z } from 'zod'
import {
  headingDataSchema,
  paragraphDataSchema,
  calloutDataSchema,
  faqDataSchema,
  ctaDataSchema,
  listDataSchema,
  quoteDataSchema,
  seoConfigSchema,
  geoConfigSchema,
} from '@/lib/schemas/block-validation'
import { sanitizeHtml } from '@/lib/utils/html-sanitizer'
import type { ContentBlock, SeoConfig, GeoConfig } from '@/lib/types/blog'
import type { BlockData } from '@/lib/types/block-data'

// Map of block type to its Zod schema
const blockSchemaMap: Record<string, z.ZodTypeAny> = {
  heading: headingDataSchema,
  paragraph: paragraphDataSchema,
  callout: calloutDataSchema,
  faq: faqDataSchema,
  cta: ctaDataSchema,
  list: listDataSchema,
  quote: quoteDataSchema,
}

// Block types that contain HTML text fields needing sanitization
const HTML_TEXT_BLOCKS = ['paragraph', 'callout']

interface RawGeminiBlock {
  type: string
  data: Record<string, unknown>
}

interface RawGeminiPost {
  title: string
  excerpt: string
  slug: string
  category: string
  tags: string[]
  seo_config?: Record<string, unknown>
  geo_config?: Record<string, unknown>
}

interface RawGeminiResponse {
  post: RawGeminiPost
  blocks: RawGeminiBlock[]
}

export interface ParsedPost {
  title: string
  excerpt: string
  slug: string
  category: string
  tags: string[]
  seo_config: SeoConfig
  geo_config: GeoConfig
}

export interface ParsedResponse {
  post: ParsedPost
  blocks: ContentBlock[]
}

function generateBlockId(): string {
  return crypto.randomUUID()
}

function sanitizeBlockData(type: string, data: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...data }

  if (HTML_TEXT_BLOCKS.includes(type) && typeof sanitized.text === 'string') {
    sanitized.text = sanitizeHtml(sanitized.text)
  }

  // Sanitize FAQ answer fields
  if (type === 'faq' && Array.isArray(sanitized.items)) {
    sanitized.items = (sanitized.items as Array<{ question: string; answer: string }>).map(
      (item) => ({
        ...item,
        answer: typeof item.answer === 'string' ? sanitizeHtml(item.answer) : item.answer,
      })
    )
  }

  return sanitized
}

function validateBlock(block: RawGeminiBlock, index: number): ContentBlock | null {
  const schema = blockSchemaMap[block.type]
  if (!schema) {
    console.warn(`[response-parser] Unknown block type "${block.type}" at index ${index}, skipping`)
    return null
  }

  const sanitizedData = sanitizeBlockData(block.type, block.data)
  const result = schema.safeParse(sanitizedData)

  if (!result.success) {
    console.warn(
      `[response-parser] Invalid block at index ${index} (type: ${block.type}):`,
      result.error.issues.map((i) => i.message).join(', ')
    )
    return null
  }

  return {
    id: generateBlockId(),
    type: block.type as ContentBlock['type'],
    order: index,
    data: result.data as BlockData,
  }
}

const postSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1),
  seo_config: z.record(z.unknown()).optional(),
  geo_config: z.record(z.unknown()).optional(),
})

export function parseResponse(json: unknown): ParsedResponse {
  // Handle string input (double-encoded JSON)
  const data: unknown = typeof json === 'string' ? JSON.parse(json) : json

  const raw = data as RawGeminiResponse
  if (!raw || !raw.post || !Array.isArray(raw.blocks)) {
    throw new Error('Invalid Gemini response: missing "post" or "blocks" fields')
  }

  // Validate post metadata
  const postResult = postSchema.safeParse(raw.post)
  if (!postResult.success) {
    throw new Error(
      `Invalid post metadata: ${postResult.error.issues.map((i) => i.message).join(', ')}`
    )
  }

  // Parse SEO config
  const seoResult = seoConfigSchema.safeParse(raw.post.seo_config ?? {})
  const seo_config: SeoConfig = seoResult.success ? seoResult.data : {}

  // Parse GEO config
  const geoResult = geoConfigSchema.safeParse(raw.post.geo_config ?? {})
  const geo_config: GeoConfig = geoResult.success ? geoResult.data : {}

  // Validate and filter blocks (invalid blocks are skipped, not thrown)
  const validBlocks: ContentBlock[] = []
  let order = 0
  for (let i = 0; i < raw.blocks.length; i++) {
    const block = validateBlock(raw.blocks[i], order)
    if (block) {
      block.order = order
      validBlocks.push(block)
      order++
    }
  }

  if (validBlocks.length === 0) {
    throw new Error('No valid blocks found in Gemini response')
  }

  return {
    post: {
      title: postResult.data.title,
      excerpt: postResult.data.excerpt,
      slug: postResult.data.slug,
      category: postResult.data.category,
      tags: postResult.data.tags,
      seo_config,
      geo_config,
    },
    blocks: validBlocks,
  }
}
