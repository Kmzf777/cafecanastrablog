import type { QuoteData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface QuoteBlockProps {
  data: QuoteData
  settings?: BlockSettings
}

export function QuoteBlock({ data, settings }: QuoteBlockProps) {
  const alignClass = settings?.alignment === 'center' ? 'text-center' : settings?.alignment === 'right' ? 'text-right' : ''

  return (
    <blockquote className={`border-l-4 border-amber-500 pl-6 py-3 my-6 bg-amber-50/50 rounded-r-lg ${alignClass}`}>
      <p className="text-lg italic text-gray-700" dangerouslySetInnerHTML={{ __html: data.text }} />
      {data.citation && (
        <cite className="block mt-2 text-sm text-gray-500 not-italic">
          — {data.url ? (
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">
              {data.citation}
            </a>
          ) : (
            data.citation
          )}
        </cite>
      )}
    </blockquote>
  )
}
