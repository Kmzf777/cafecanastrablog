// Story 1.8 — Dynamic sitemap with published blog posts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface SitemapUrl {
  url: string
  lastModified: string
  changeFrequency: string
  priority: number
}

export async function GET() {
  const baseUrl = 'https://cafecanastra.com'

  // Static URLs
  const staticUrls: SitemapUrl[] = [
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
      priority: 0.9,
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

  // Dynamic blog post URLs
  const postUrls: SitemapUrl[] = []
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (posts) {
        for (const post of posts) {
          postUrls.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_at,
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      }
    } catch (error) {
      console.error('Sitemap: Error fetching posts:', error)
    }
  }

  const allUrls = [...staticUrls, ...postUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
