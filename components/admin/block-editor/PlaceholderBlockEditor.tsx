'use client'

import React, { useCallback } from 'react'
import type { BlockType, ContentBlock } from '@/lib/types/blog'
import type { BlockData, ParagraphData } from '@/lib/types/block-data'

interface PlaceholderBlockEditorProps {
  block: ContentBlock
  onUpdate: (id: string, data: BlockData) => void
  onSlashCommand?: (blockId: string) => void
}

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  image: 'Image',
  gallery: 'Gallery',
  quote: 'Quote',
  list: 'List',
  code: 'Code',
  embed: 'Embed',
  divider: 'Divider',
  callout: 'Callout',
  table: 'Table',
  faq: 'FAQ',
  cta: 'CTA',
  video: 'Video',
  accordion: 'Accordion',
  product: 'Product',
}

function PlaceholderBlockEditorInner({
  block,
  onUpdate,
  onSlashCommand,
}: PlaceholderBlockEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value

      // Detect slash command in empty paragraph
      if (block.type === 'paragraph' && value === '/') {
        onSlashCommand?.(block.id)
        return
      }

      // For paragraph, update text field; for others, store raw
      if (block.type === 'paragraph') {
        onUpdate(block.id, { text: value } as ParagraphData)
      } else {
        // Store raw text - Story 1.4 will replace with real editors
        onUpdate(block.id, { ...block.data, raw: value } as unknown as BlockData)
      }
    },
    [block.id, block.type, block.data, onUpdate, onSlashCommand]
  )

  // Get display value from block data
  const getValue = (): string => {
    const data = block.data as Record<string, unknown>
    if ('text' in data && typeof data.text === 'string') return data.text
    if ('code' in data && typeof data.code === 'string') return data.code
    if ('url' in data && typeof data.url === 'string') return data.url
    if ('name' in data && typeof data.name === 'string') return data.name
    if ('raw' in data && typeof data.raw === 'string') return data.raw
    return ''
  }

  if (block.type === 'divider') {
    return (
      <div className="py-4">
        <hr className="border-border" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <textarea
        className="w-full min-h-[60px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder={`${BLOCK_TYPE_LABELS[block.type]} content...`}
        value={getValue()}
        onChange={handleChange}
        rows={block.type === 'paragraph' ? 2 : 3}
      />
    </div>
  )
}

export const PlaceholderBlockEditor = React.memo(PlaceholderBlockEditorInner)
