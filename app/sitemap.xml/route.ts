import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://cafecanastra.com'
  let posts = []
  try {
    posts = await getPublishedPosts()
  } catch (e) {
    // fallback para sitemap só com páginas estáticas
    posts = []
  }

  const staticUrls = [
    { loc: baseUrl, changefreq: 'weekly', priority: 1.0 },
    { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: 0.8 },
    { loc: `${baseUrl}/blog/receitas`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${baseUrl}/blog/noticias`, changefreq: 'weekly', priority: 0.7 },
  ]

  const dynamicUrls = posts.map((post) => {
    let loc = `${baseUrl}/blog/${post.slug}`
    if (post.post_type === 'recipe') loc = `${baseUrl}/blog/receitas/${post.slug}`
    if (post.post_type === 'news') loc = `${baseUrl}/blog/noticias/${post.slug}`
    return {
      loc,
      lastmod: new Date(post.updated_at || post.created_at).toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
    }
  })

  const urls = [...staticUrls, ...dynamicUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `<url>\n  <loc>${url.loc}</loc>\n  ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}\n  <changefreq>${url.changefreq}</changefreq>\n  <priority>${url.priority}</priority>\n</url>`
    )
    .join('\n')}\n</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
} 