import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase-service'
import { BlogPreviewCard } from './BlogPreviewCard'
import type { BlogPost } from '@/lib/types/blog'

type PostPreview = Pick<
  BlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'image_url' | 'image_alt' | 'category' | 'published_at'
>

async function getRecentPosts(): Promise<PostPreview[]> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, image_url, image_alt, category, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('BlogPreviewSection: error fetching posts', error.message)
      return []
    }

    return (data as PostPreview[]) ?? []
  } catch {
    return []
  }
}

export async function BlogPreviewSection() {
  const posts = await getRecentPosts()

  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4 sm:px-6 bg-amber-50">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-900">
            Do Nosso Blog
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPreviewCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="text-amber-700 hover:text-amber-900 font-medium transition-colors duration-200"
          >
            Ver todos os posts →
          </Link>
        </div>
      </div>
    </section>
  )
}
