import { NextResponse } from 'next/server'
import { getPublishedPosts, testSupabaseConnection } from '@/lib/supabase'

// Forçar revalidação a cada requisição
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface UrlEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}

export async function GET() {
  console.log('=== GERANDO SITEMAP ===')
  const baseUrl = 'https://cafecanastra.com'
  let posts: any[] = []
  
  // Testar conexão com Supabase
  console.log('Testando conexão com Supabase...')
  const connectionOk = await testSupabaseConnection()
  if (!connectionOk) {
    console.error('❌ Erro na conexão com Supabase')
    // Retornar sitemap básico mesmo com erro de conexão
  } else {
    console.log('✅ Conexão com Supabase OK')
  }
  
  try {
    console.log('Buscando posts publicados...')
    posts = await getPublishedPosts()
    console.log(`✅ ${posts.length} posts encontrados`)
  } catch (e) {
    console.error('❌ Erro ao buscar posts:', e)
    posts = []
  }

  const staticUrls: UrlEntry[] = [
    { loc: baseUrl, changefreq: 'weekly', priority: 1.0 },
    { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: 0.8 },
    { loc: `${baseUrl}/blog/receitas`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${baseUrl}/blog/noticias`, changefreq: 'weekly', priority: 0.7 },
  ]

  const dynamicUrls: UrlEntry[] = posts.map((post) => {
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

  const urls: UrlEntry[] = [...staticUrls, ...dynamicUrls]
  
  console.log(`📊 Total de URLs no sitemap: ${urls.length}`)
  console.log(`- URLs estáticas: ${staticUrls.length}`)
  console.log(`- URLs dinâmicas: ${dynamicUrls.length}`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `<url>\n  <loc>${url.loc}</loc>\n  ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}\n  <changefreq>${url.changefreq}</changefreq>\n  <priority>${url.priority}</priority>\n</url>`
    )
    .join('\n')}\n</urlset>`

  console.log('✅ Sitemap gerado com sucesso')
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
} 