import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import SchemaOrg from '@/components/schema-org'
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemas/blog-schemas'
import { SITE_CONFIG } from '@/lib/site-config'
import type { BlogPost } from '@/lib/types/blog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return null

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('blog_posts')
      .select(
        'id, title, slug, content, excerpt, image_url, image_alt, published_at, updated_at, status, scheduled_at, author, category, tags, created_at'
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) return null
    return data as BlogPost
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
      robots: { index: false, follow: false },
    }
  }

  const description = post.excerpt
    ? post.excerpt.slice(0, 160)
    : post.content.replace(/<[^>]+>/g, '').slice(0, 160)

  const ogImage = post.image_url
    ? [{ url: post.image_url, width: 1200, height: 630, alt: post.title }]
    : [{ url: '/banner-cafecanastra.png', width: 1200, height: 630, alt: post.title }]

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      url: `${SITE_CONFIG.url}/blog/${slug}`,
      title: post.title,
      description,
      images: ogImage,
      publishedTime: post.published_at ?? undefined,
      authors: [SITE_CONFIG.name],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const articleSchema = generateArticleSchema(post)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Blog', url: `${SITE_CONFIG.url}/blog` },
    {
      name: post.category ?? 'Artigo',
      url: post.category
        ? `${SITE_CONFIG.url}/blog?category=${post.category}`
        : `${SITE_CONFIG.url}/blog`,
    },
    { name: post.title.slice(0, 110), url: `${SITE_CONFIG.url}/blog/${post.slug}` },
  ])

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src={post.image_url || '/banner-cafecanastra.png'}
            alt={post.image_alt || post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12">
          {/* Header */}
          <header className="mb-10 text-center">
            {post.category && (
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-amber-800 uppercase bg-amber-100 rounded-full">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              {post.author && (
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{post.author}</span>
                </div>
              )}
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              )}
              {/* Leitura estimada poderia ser calculada aqui baseada no tamanho do conteúdo */}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-amber mx-auto max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer / Tags */}
          {post.tags && post.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      </article>

      <div className="max-w-3xl mx-auto mt-8 flex justify-between items-center px-4">
        <a
          href="/blog"
          className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors"
        >
          ← Voltar para o Blog
        </a>
      </div>
    </main>
  )
}
