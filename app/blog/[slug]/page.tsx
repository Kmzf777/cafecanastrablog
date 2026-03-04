import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import SchemaOrg from '@/components/schema-org'
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateProductSchema,
  generateVideoSchema,
  generateHowToSchema,
  generateImageObjectSchema,
  detectHowToBlocks,
} from '@/lib/schemas/blog-schemas'
import { SITE_CONFIG } from '@/lib/site-config'
import type { BlogPost, ContentBlock } from '@/lib/types/blog'
import type {
  HeadingData,
  FaqData,
  ProductData,
  VideoData,
  ImageData,
} from '@/lib/types/block-data'
import { BlockRenderer } from '@/components/blog/BlockRenderer'
import { TableOfContents, type TocHeading } from '@/components/blog/TableOfContents'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PostWithBlocks extends BlogPost {
  blocks: ContentBlock[]
}

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

async function getPostBySlug(slug: string): Promise<PostWithBlocks | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !post) return null

    const { data: blocks } = await supabase
      .from('blog_post_blocks')
      .select('*')
      .eq('post_id', post.id)
      .order('order', { ascending: true })

    return { ...post, blocks: blocks || [] } as PostWithBlocks
  } catch {
    return null
  }
}

function extractHeadings(blocks: ContentBlock[]): TocHeading[] {
  return blocks
    .filter((b) => b.type === 'heading')
    .map((b) => {
      const data = b.data as HeadingData
      const id = data.anchor || data.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return { id, text: data.text, level: data.level }
    })
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

  const seo = post.seo_config
  const description = seo?.meta_description
    ?? (post.excerpt ? post.excerpt.slice(0, 160) : post.content.replace(/<[^>]+>/g, '').slice(0, 160))

  const ogImage = post.image_url
    ? [{ url: seo?.og_image ?? post.image_url, width: 1200, height: 630, alt: post.title }]
    : [{ url: '/banner-cafecanastra.png', width: 1200, height: 630, alt: post.title }]

  // AC8: hreflang — query translation peers
  let languages: Record<string, string> | undefined
  if (post.translation_group_id) {
    const supabase = getSupabase()
    if (supabase) {
      const { data: peers } = await supabase
        .from('blog_posts')
        .select('slug, locale')
        .eq('translation_group_id', post.translation_group_id)
        .eq('status', 'published')

      if (peers && peers.length > 1) {
        languages = {}
        for (const peer of peers) {
          if (peer.locale) {
            languages[peer.locale] = `${SITE_CONFIG.url}/blog/${peer.slug}`
          }
        }
        // x-default points to PT version
        const ptPeer = peers.find((p) => p.locale === 'pt')
        if (ptPeer) {
          languages['x-default'] = `${SITE_CONFIG.url}/blog/${ptPeer.slug}`
        }
      }
    }
  }

  return {
    title: seo?.meta_title ?? post.title,
    description,
    alternates: {
      canonical: seo?.canonical_url ?? `${SITE_CONFIG.url}/blog/${slug}`,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: 'article',
      url: `${SITE_CONFIG.url}/blog/${slug}`,
      title: seo?.og_title ?? post.title,
      description: seo?.og_description ?? description,
      images: ogImage,
      publishedTime: post.published_at ?? undefined,
      authors: [SITE_CONFIG.name],
    },
    ...(seo?.no_index || seo?.no_follow
      ? { robots: { index: !seo.no_index, follow: !seo.no_follow } }
      : {}),
  }
}

/**
 * Generate all applicable JSON-LD schemas based on block content.
 */
function collectSchemas(post: PostWithBlocks): Record<string, unknown>[] {
  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`
  const schemas: Record<string, unknown>[] = []

  // Article schema (always present)
  schemas.push(generateArticleSchema(post))

  // Breadcrumb schema (always present)
  schemas.push(
    generateBreadcrumbSchema([
      { name: 'Home', url: SITE_CONFIG.url },
      { name: 'Blog', url: `${SITE_CONFIG.url}/blog` },
      {
        name: post.category ?? 'Artigo',
        url: post.category
          ? `${SITE_CONFIG.url}/blog?category=${post.category}`
          : `${SITE_CONFIG.url}/blog`,
      },
      { name: post.title.slice(0, 110), url: postUrl },
    ])
  )

  // FAQPage — merge all FAQ blocks
  const faqBlocks = post.blocks
    .filter((b) => b.type === 'faq')
    .map((b) => b.data as FaqData)
  if (faqBlocks.length > 0) {
    const faqSchema = generateFaqSchema(faqBlocks)
    if (faqSchema) schemas.push(faqSchema)
  }

  // Product — one per product block
  for (const block of post.blocks) {
    if (block.type === 'product') {
      schemas.push(generateProductSchema(block.data as ProductData, postUrl))
    }
  }

  // VideoObject — one per video block
  for (const block of post.blocks) {
    if (block.type === 'video') {
      schemas.push(generateVideoSchema(block.data as VideoData))
    }
  }

  // HowTo — heading with "Como"/"How to" followed by list
  const howTos = detectHowToBlocks(post.blocks)
  for (const howTo of howTos) {
    const howToSchema = generateHowToSchema(howTo.title, howTo.steps)
    if (howToSchema) schemas.push(howToSchema)
  }

  // ImageObject — one per image block
  for (const block of post.blocks) {
    if (block.type === 'image') {
      schemas.push(generateImageObjectSchema(block.data as ImageData, postUrl))
    }
  }

  return schemas
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

  const hasBlocks = post.blocks.length > 0
  const headings = hasBlocks ? extractHeadings(post.blocks) : []
  const schemas = collectSchemas(post)

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {schemas.map((schema, i) => (
        <SchemaOrg key={i} schema={schema} />
      ))}

      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Article */}
        <article className="flex-1 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
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
                {post.reading_time_minutes && (
                  <span>{post.reading_time_minutes} min de leitura</span>
                )}
              </div>
            </header>

            {/* Content */}
            {hasBlocks ? (
              <div className="max-w-none">
                <BlockRenderer blocks={post.blocks} />
              </div>
            ) : (
              <div className="prose prose-lg prose-amber mx-auto max-w-none text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            )}

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

        {/* Table of Contents — desktop sidebar */}
        {hasBlocks && headings.length > 0 && (
          <TableOfContents headings={headings} />
        )}
      </div>

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
