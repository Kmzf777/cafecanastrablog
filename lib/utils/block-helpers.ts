// Story 1.2 — Shared block processing utilities for API routes

import { sanitizeHtml } from './html-sanitizer'
import { blockDataSchema, seoConfigSchema, geoConfigSchema } from '@/lib/schemas/block-validation'
import type { ContentBlock, BlockType } from '@/lib/types/blog'

// Sanitize rich text fields within block data based on block type
export function sanitizeBlockData(block: ContentBlock): ContentBlock {
  const data = { ...block.data } as Record<string, unknown>

  switch (block.type) {
    case 'paragraph':
    case 'quote':
    case 'callout':
      if (typeof data.text === 'string') {
        data.text = sanitizeHtml(data.text)
      }
      break
    case 'list':
      if (Array.isArray(data.items)) {
        data.items = (data.items as string[]).map((item) => sanitizeHtml(item))
      }
      break
    case 'faq':
      if (Array.isArray(data.items)) {
        data.items = (data.items as Array<{ question: string; answer: string }>).map((item) => ({
          ...item,
          answer: sanitizeHtml(item.answer),
        }))
      }
      break
    case 'accordion':
      if (Array.isArray(data.items)) {
        data.items = (data.items as Array<{ title: string; content: string; defaultOpen?: boolean }>).map((item) => ({
          ...item,
          content: sanitizeHtml(item.content),
        }))
      }
      break
  }

  return { ...block, data } as ContentBlock
}

// Validate a single block's data against its type-specific Zod schema
export function validateBlock(block: ContentBlock): { valid: boolean; error?: string } {
  const dataWithType = { type: block.type, ...block.data }
  const result = blockDataSchema.safeParse(dataWithType)
  if (!result.success) {
    return { valid: false, error: `Block "${block.id}" (${block.type}): ${result.error.issues.map((i) => i.message).join(', ')}` }
  }
  return { valid: true }
}

// Validate all blocks and return errors
export function validateBlocks(blocks: ContentBlock[]): string[] {
  const errors: string[] = []
  for (const block of blocks) {
    const result = validateBlock(block)
    if (!result.valid && result.error) {
      errors.push(result.error)
    }
  }
  return errors
}

// Validate seo_config if provided
export function validateSeoConfig(config: unknown): { valid: boolean; error?: string } {
  if (!config) return { valid: true }
  const result = seoConfigSchema.safeParse(config)
  if (!result.success) {
    return { valid: false, error: `seo_config: ${result.error.issues.map((i) => i.message).join(', ')}` }
  }
  return { valid: true }
}

// Validate geo_config if provided
export function validateGeoConfig(config: unknown): { valid: boolean; error?: string } {
  if (!config) return { valid: true }
  const result = geoConfigSchema.safeParse(config)
  if (!result.success) {
    return { valid: false, error: `geo_config: ${result.error.issues.map((i) => i.message).join(', ')}` }
  }
  return { valid: true }
}

// Extract text content from blocks for word count and reading time
function extractTextFromBlock(block: ContentBlock): string {
  const data = block.data as Record<string, unknown>
  const texts: string[] = []

  switch (block.type) {
    case 'heading':
    case 'paragraph':
    case 'quote':
    case 'callout':
      if (typeof data.text === 'string') texts.push(data.text)
      break
    case 'list':
      if (Array.isArray(data.items)) {
        texts.push(...(data.items as string[]))
      }
      break
    case 'faq':
      if (Array.isArray(data.items)) {
        for (const item of data.items as Array<{ question: string; answer: string }>) {
          texts.push(item.question, item.answer)
        }
      }
      break
    case 'accordion':
      if (Array.isArray(data.items)) {
        for (const item of data.items as Array<{ title: string; content: string }>) {
          texts.push(item.title, item.content)
        }
      }
      break
  }

  return texts.join(' ')
}

// Strip HTML tags for plain text word counting
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Calculate word count and reading time from blocks
export function calculateMetrics(blocks: ContentBlock[]): { word_count: number; reading_time_minutes: number } {
  const allText = blocks.map(extractTextFromBlock).join(' ')
  const plainText = stripHtml(allText)
  const words = plainText.split(/\s+/).filter((w) => w.length > 0)
  const word_count = words.length
  const reading_time_minutes = Math.max(1, Math.ceil(word_count / 200))
  return { word_count, reading_time_minutes }
}

// Convert blocks to DB insert format
export function blocksToDbRecords(blocks: ContentBlock[], postId: string) {
  return blocks.map((block) => ({
    id: block.id,
    post_id: postId,
    type: block.type,
    order: block.order,
    data: block.data,
    settings: block.settings || null,
  }))
}
