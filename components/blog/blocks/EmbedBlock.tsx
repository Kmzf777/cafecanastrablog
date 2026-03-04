import type { EmbedData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface EmbedBlockProps {
  data: EmbedData
  settings?: BlockSettings
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return url
}

export function EmbedBlock({ data }: EmbedBlockProps) {
  const embedUrl = getEmbedUrl(data.url)

  return (
    <figure className="my-6">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title={data.caption || 'Embedded content'}
        />
      </div>
      {data.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
