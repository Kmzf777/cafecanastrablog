import { z } from 'zod'
import {
  headingDataSchema, paragraphDataSchema, calloutDataSchema,
  faqDataSchema, ctaDataSchema, listDataSchema, quoteDataSchema,
  seoConfigSchema, geoConfigSchema,
} from './schemas.js'
import { sanitizeHtml } from './html-sanitizer.js'
import type { ContentBlock, SeoConfig, GeoConfig } from './types.js'

const blockSchemaMap: Record<string, z.ZodTypeAny> = {
  heading: headingDataSchema,
  paragraph: paragraphDataSchema,
  callout: calloutDataSchema,
  faq: faqDataSchema,
  cta: ctaDataSchema,
  list: listDataSchema,
  quote: quoteDataSchema,
}

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

// Allowed CTA URLs — AI may invent URLs, so we map them to real pages
const CTA_URL_MAP: Record<string, string> = {
  loja: 'https://www.loja.cafecanastra.com',
  compra: 'https://www.loja.cafecanastra.com',
  produto: 'https://www.loja.cafecanastra.com',
  shop: 'https://www.loja.cafecanastra.com',
  store: 'https://www.loja.cafecanastra.com',
  contato: 'https://cafecanastra.com/#contato',
  contact: 'https://cafecanastra.com/#contato',
  fale: 'https://cafecanastra.com/#contato',
  whatsapp: 'https://cafecanastra.com/#contato',
}
const CTA_DEFAULT_URL = 'https://cafecanastra.com/'
const CTA_ALLOWED_URLS = [
  'https://cafecanastra.com/',
  'https://cafecanastra.com/#contato',
  'https://www.loja.cafecanastra.com',
]

function sanitizeCtaUrl(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) return CTA_DEFAULT_URL

  // Already an allowed URL
  if (CTA_ALLOWED_URLS.some(allowed => url.startsWith(allowed))) return url

  // Try to match by keyword in the URL
  const lower = url.toLowerCase()
  for (const [keyword, mappedUrl] of Object.entries(CTA_URL_MAP)) {
    if (lower.includes(keyword)) return mappedUrl
  }

  return CTA_DEFAULT_URL
}

function sanitizeBlockData(type: string, data: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...data }

  if (HTML_TEXT_BLOCKS.includes(type) && typeof sanitized.text === 'string') {
    sanitized.text = sanitizeHtml(sanitized.text)
  }

  if (type === 'faq' && Array.isArray(sanitized.items)) {
    sanitized.items = (sanitized.items as Array<{ question: string; answer: string }>).map(
      (item) => ({
        ...item,
        answer: typeof item.answer === 'string' ? sanitizeHtml(item.answer) : item.answer,
      })
    )
  }

  // Sanitize CTA buttonUrl to only allowed URLs
  if (type === 'cta') {
    sanitized.buttonUrl = sanitizeCtaUrl(sanitized.buttonUrl)
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
      result.error.issues.map((i: z.ZodIssue) => i.message).join(', ')
    )
    return null
  }

  return {
    id: generateBlockId(),
    type: block.type as ContentBlock['type'],
    order: index,
    data: result.data as Record<string, unknown>,
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
  const data: unknown = typeof json === 'string' ? JSON.parse(json as string) : json

  const raw = data as RawGeminiResponse
  if (!raw || !raw.post || !Array.isArray(raw.blocks)) {
    throw new Error('Invalid Gemini response: missing "post" or "blocks" fields')
  }

  const postResult = postSchema.safeParse(raw.post)
  if (!postResult.success) {
    throw new Error(
      `Invalid post metadata: ${postResult.error.issues.map((i) => i.message).join(', ')}`
    )
  }

  const seoResult = seoConfigSchema.safeParse(raw.post.seo_config ?? {})
  const seo_config: SeoConfig = seoResult.success ? seoResult.data : {}

  const geoResult = geoConfigSchema.safeParse(raw.post.geo_config ?? {})
  const geo_config: GeoConfig = geoResult.success ? geoResult.data : {}

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
