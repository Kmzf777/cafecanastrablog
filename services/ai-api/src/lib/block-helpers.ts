import type { ContentBlock } from './types.js'

function extractTextFromBlock(block: ContentBlock): string {
  const data = block.data
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function calculateMetrics(blocks: ContentBlock[]): { word_count: number; reading_time_minutes: number } {
  const allText = blocks.map(extractTextFromBlock).join(' ')
  const plainText = stripHtml(allText)
  const words = plainText.split(/\s+/).filter((w) => w.length > 0)
  const word_count = words.length
  const reading_time_minutes = Math.max(1, Math.ceil(word_count / 200))
  return { word_count, reading_time_minutes }
}

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
