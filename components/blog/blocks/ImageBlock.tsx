import Image from 'next/image'
import type { ImageData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface ImageBlockProps {
  data: ImageData
  settings?: BlockSettings
}

const widthClasses: Record<string, string> = {
  narrow: 'max-w-lg mx-auto',
  default: 'max-w-2xl mx-auto',
  wide: 'max-w-4xl mx-auto',
  full: 'max-w-full',
}

export function ImageBlock({ data, settings }: ImageBlockProps) {
  const width = settings?.width || 'default'

  return (
    <figure className={`my-6 ${widthClasses[width]}`}>
      <div className="relative overflow-hidden rounded-lg">
        {data.width && data.height ? (
          <Image
            src={data.src}
            alt={data.alt}
            width={data.width}
            height={data.height}
            className="w-full h-auto"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          />
        ) : (
          <div className="relative aspect-video">
            <Image
              src={data.src}
              alt={data.alt}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>
        )}
      </div>
      {data.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
