// Story 1.5 — Reading time calculation utility

import type { ContentBlock } from '@/lib/types/blog'
import { extractTextFromBlocks, countWords } from '@/lib/seo/seo-scorer'

const WORDS_PER_MINUTE = 200

/** Calculate reading time in minutes from content blocks (200 wpm) */
export function calculateReadingTime(blocks: ContentBlock[]): number {
  const text = extractTextFromBlocks(blocks)
  const words = countWords(text)
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
