import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/types/blog'

const FALLBACK_IMAGE = '/banner-cafecanastra.png'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function truncateExcerpt(excerpt: string | null): string {
  if (!excerpt) return ''
  return excerpt.length > 120 ? excerpt.slice(0, 120) + '...' : excerpt
}

interface BlogPreviewCardProps {
  post: Pick<BlogPost, 'id' | 'title' | 'slug' | 'excerpt' | 'image_url' | 'image_alt' | 'category' | 'published_at' | 'reading_time_minutes'>
}

export function BlogPreviewCard({ post }: BlogPreviewCardProps) {
  const imageUrl = post.image_url || FALLBACK_IMAGE
  const imageAlt = post.image_alt || post.title || 'Post do blog Café Canastra'
  const excerpt = truncateExcerpt(post.excerpt)
  const date = formatDate(post.published_at)

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          {post.category && (
            <span className="text-xs text-amber-700 uppercase tracking-wide font-medium">
              {post.category}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 leading-snug">
            {post.title}
          </h3>
          {excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed">{excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {date && (
              <p className="text-gray-400 text-xs">{date}</p>
            )}
            {post.reading_time_minutes && (
              <span className="text-gray-400 text-xs">{post.reading_time_minutes} min</span>
            )}
          </div>
          <span className="text-amber-600 text-sm font-medium mt-3 inline-block">
            Ler mais →
          </span>
        </div>
      </Link>
    </article>
  )
}
