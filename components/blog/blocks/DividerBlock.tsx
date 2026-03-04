import type { DividerData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface DividerBlockProps {
  data: DividerData
  settings?: BlockSettings
}

export function DividerBlock({ data }: DividerBlockProps) {
  const style = data.style || 'solid'

  if (style === 'ornamental') {
    return (
      <div className="my-8 flex items-center justify-center gap-2 text-amber-400">
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </div>
    )
  }

  const borderStyle: Record<string, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  return (
    <hr className={`my-8 border-t ${borderStyle[style] || 'border-solid'} border-gray-200`} />
  )
}
