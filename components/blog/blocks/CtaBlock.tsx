import type { CtaData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface CtaBlockProps {
  data: CtaData
  settings?: BlockSettings
}

const buttonStyles: Record<string, string> = {
  primary: 'bg-amber-700 text-white hover:bg-amber-800',
  secondary: 'bg-gray-800 text-white hover:bg-gray-900',
  outline: 'border-2 border-amber-700 text-amber-700 hover:bg-amber-50',
}

export function CtaBlock({ data }: CtaBlockProps) {
  const variant = data.variant || 'primary'

  return (
    <div className="my-8 rounded-xl bg-amber-50 border border-amber-200 p-6 sm:p-8 text-center">
      <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{data.text}</p>
      {data.description && (
        <p className="text-gray-600 mb-4">{data.description}</p>
      )}
      <a
        href={data.buttonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${buttonStyles[variant]}`}
      >
        {data.buttonText}
      </a>
    </div>
  )
}
