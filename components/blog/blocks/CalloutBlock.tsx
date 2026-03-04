import type { CalloutData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface CalloutBlockProps {
  data: CalloutData
  settings?: BlockSettings
}

const variantStyles: Record<string, { bg: string; border: string; icon: string }> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-400', icon: 'ℹ️' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: '⚠️' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-400', icon: '✅' },
  error: { bg: 'bg-red-50', border: 'border-red-400', icon: '❌' },
  tip: { bg: 'bg-green-50', border: 'border-green-400', icon: '💡' },
}

export function CalloutBlock({ data }: CalloutBlockProps) {
  const variant = data.variant || 'info'
  const style = variantStyles[variant] || variantStyles.info
  const icon = data.icon || style.icon

  return (
    <aside className={`${style.bg} border-l-4 ${style.border} rounded-r-lg p-4 my-6`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">{icon}</span>
        <div>
          {data.title && (
            <p className="font-semibold text-gray-900 mb-1">{data.title}</p>
          )}
          <div className="text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.text }} />
        </div>
      </div>
    </aside>
  )
}
