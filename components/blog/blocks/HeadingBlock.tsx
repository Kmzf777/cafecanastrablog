'use client'

import type { HeadingData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface HeadingBlockProps {
  data: HeadingData
  settings?: BlockSettings
}

export function HeadingBlock({ data, settings }: HeadingBlockProps) {
  const Tag = `h${data.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const id = data.anchor || data.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const alignClass = settings?.alignment === 'center' ? 'text-center' : settings?.alignment === 'right' ? 'text-right' : ''

  const sizeClasses: Record<number, string> = {
    1: 'text-3xl sm:text-4xl font-bold mt-10 mb-4',
    2: 'text-2xl sm:text-3xl font-bold mt-8 mb-3',
    3: 'text-xl sm:text-2xl font-semibold mt-6 mb-3',
    4: 'text-lg sm:text-xl font-semibold mt-5 mb-2',
    5: 'text-base sm:text-lg font-medium mt-4 mb-2',
    6: 'text-sm sm:text-base font-medium mt-3 mb-1',
  }

  return (
    <Tag
      id={id}
      className={`group scroll-mt-24 text-gray-900 ${sizeClasses[data.level]} ${alignClass}`}
    >
      {data.text}
      <a
        href={`#${id}`}
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 hover:text-amber-700"
        aria-label={`Link to ${data.text}`}
      >
        #
      </a>
    </Tag>
  )
}
