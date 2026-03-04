import Image from 'next/image'
import type { ProductData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface ProductBlockProps {
  data: ProductData
  settings?: BlockSettings
}

function formatPrice(price: string, currency?: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
  }).format(num)
}

export function ProductBlock({ data }: ProductBlockProps) {
  return (
    <div className="my-6 rounded-xl border border-gray-200 overflow-hidden flex flex-col sm:flex-row bg-white shadow-sm">
      {data.image && (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>
      )}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">{data.name}</h4>
          {data.description && (
            <p className="text-gray-600 text-sm mb-3">{data.description}</p>
          )}
          {data.features && data.features.length > 0 && (
            <ul className="text-sm text-gray-500 mb-3 list-disc pl-4">
              {data.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          {data.price && (
            <span className="text-xl font-bold text-amber-700">
              {formatPrice(data.price, data.currency)}
            </span>
          )}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
            >
              Ver produto
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
