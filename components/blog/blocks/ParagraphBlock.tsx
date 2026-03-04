import type { ParagraphData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface ParagraphBlockProps {
  data: ParagraphData
  settings?: BlockSettings
}

export function ParagraphBlock({ data, settings }: ParagraphBlockProps) {
  const alignClass = settings?.alignment === 'center' ? 'text-center' : settings?.alignment === 'right' ? 'text-right' : ''

  // Content was pre-sanitized on save (Story 1.2)
  return (
    <div
      className={`prose prose-lg prose-amber max-w-none text-gray-700 mb-4 ${alignClass}`}
      dangerouslySetInnerHTML={{ __html: data.text }}
    />
  )
}
