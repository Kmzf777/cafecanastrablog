import Image from 'next/image'
import type { GalleryData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface GalleryBlockProps {
  data: GalleryData
  settings?: BlockSettings
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  const columns = data.columns || 3

  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4 my-6`}>
      {data.images.map((img, i) => (
        <figure key={i} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes={`(max-width: 768px) 100vw, ${Math.round(100 / columns)}vw`}
          />
          {img.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-center">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
