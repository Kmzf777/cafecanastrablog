import type { VideoData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface VideoBlockProps {
  data: VideoData
  settings?: BlockSettings
}

function getVideoEmbedUrl(url: string, provider?: string): string | null {
  if (provider === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }
  if (provider === 'vimeo' || url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/)
    if (match) return `https://player.vimeo.com/video/${match[1]}`
  }
  return null
}

export function VideoBlock({ data }: VideoBlockProps) {
  const embedUrl = getVideoEmbedUrl(data.url, data.provider)

  if (embedUrl) {
    return (
      <figure className="my-6">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={data.title || 'Video'}
          />
        </div>
        {data.title && (
          <figcaption className="mt-2 text-center text-sm text-gray-500 italic">{data.title}</figcaption>
        )}
      </figure>
    )
  }

  // Direct video URL
  return (
    <figure className="my-6">
      <video
        src={data.url}
        controls
        preload="metadata"
        className="w-full rounded-lg"
        poster={data.thumbnail}
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
      {data.title && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">{data.title}</figcaption>
      )}
    </figure>
  )
}
