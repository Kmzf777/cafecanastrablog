import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://cafecanastra.com'
  
  // Buscar apenas posts de notícias
  let newsPosts: any[] = []
  try {
    const allPosts = await getPublishedPosts()
    newsPosts = allPosts.filter(post => post.post_type === "news")
    console.log(`✅ ${newsPosts.length} notícias encontradas para o sitemap de notícias`)
  } catch (e) {
    console.error('Erro ao buscar notícias para sitemap:', e)
    newsPosts = []
  }

  const newsUrls = newsPosts.map((post) => ({
    url: `${baseUrl}/blog/noticias/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at).toISOString(),
    changeFrequency: 'daily',
    priority: 0.8,
    // Metadados específicos para notícias
    title: post.titulo,
    description: post.resumo || "Notícia sobre café especial da Serra da Canastra",
    publishedTime: post.created_at,
    modifiedTime: post.updated_at || post.created_at,
    image: post.imagem_titulo,
    author: "Café Canastra"
  }))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
    <news:news>
      <news:publication>
        <news:name>Café Canastra</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${url.publishedTime}</news:publication_date>
      <news:title>${url.title}</news:title>
      <news:keywords>café especial, serra da canastra, café brasileiro, notícias café</news:keywords>
    </news:news>
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