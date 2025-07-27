import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://cafecanastra.com'
  
  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/receitas`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/noticias`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politica-privacidade`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos-uso`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // URLs dinâmicas dos posts
  let posts: any[] = []
  try {
    posts = await getPublishedPosts()
    console.log(`✅ ${posts.length} posts encontrados para o sitemap`)
  } catch (e) {
    console.error('Erro ao buscar posts para sitemap:', e)
    posts = []
  }

  const dynamicUrls = posts.map((post) => {
    let url = `${baseUrl}/blog/${post.slug}`
    if (post.post_type === 'recipe') url = `${baseUrl}/blog/receitas/${post.slug}`
    if (post.post_type === 'news') url = `${baseUrl}/blog/noticias/${post.slug}`
    
    return {
      url,
      lastModified: new Date(post.updated_at || post.created_at).toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  })

  const allUrls = [...staticUrls, ...dynamicUrls]
  console.log(`📄 Sitemap gerado com ${allUrls.length} URLs`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
} 