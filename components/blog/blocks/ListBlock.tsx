import type { ListData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface ListBlockProps {
  data: ListData
  settings?: BlockSettings
}

export function ListBlock({ data, settings }: ListBlockProps) {
  const alignClass = settings?.alignment === 'center' ? 'text-center' : settings?.alignment === 'right' ? 'text-right' : ''
  const Tag = data.style === 'ordered' ? 'ol' : 'ul'

  return (
    <Tag className={`my-4 pl-6 text-gray-700 ${data.style === 'ordered' ? 'list-decimal' : 'list-disc'} ${alignClass}`}>
      {data.items.map((item, i) => (
        <li key={i} className="mb-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </Tag>
  )
}
