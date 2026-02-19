import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import SchemaOrg from '@/components/schema-org'
import { generateBlogSchema, generateBreadcrumbSchema } from '@/lib/schemas/blog-schemas'
import { SITE_CONFIG } from '@/lib/site-config'
import { BlogPreviewCard } from '@/components/BlogPreviewCard'
import type { BlogPost } from '@/lib/types/blog'

export const metadata: Metadata = {
  title: 'Blog | Café Canastra — Dicas, Receitas e Curiosidades',
  description: 'Explore o blog do Café Canastra: dicas de preparo, receitas especiais, curiosidades sobre café e novidades da Serra da Canastra, Minas Gerais.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    type: 'website',
    url: `${SITE_CONFIG.url}/blog`,
    title: 'Blog | Café Canastra — Dicas, Receitas e Curiosidades',
    description: 'Explore o blog do Café Canastra: dicas de preparo, receitas especiais, curiosidades sobre café e novidades da Serra da Canastra.',
    images: [
      {
        url: '/banner-cafecanastra.png',
        width: 1200,
        height: 630,
        alt: 'Blog Café Canastra',
      },
    ],
  },
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return []

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (data as BlogPost[]) || []
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  const blogSchema = generateBlogSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Blog', url: `${SITE_CONFIG.url}/blog` },
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <SchemaOrg schema={blogSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-amber-900 text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/banner-cafecanastra.png')" }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Blog Café Canastra
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-amber-100 max-w-3xl mx-auto font-light">
            Dicas, receitas e curiosidades sobre café especial da Serra da Canastra.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPreviewCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Nenhum post publicado ainda.</p>
          </div>
        )}
      </section>
    </main>
  )
}
