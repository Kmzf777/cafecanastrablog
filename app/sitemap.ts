import { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cafecanastra.com'
  
  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/receitas`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/noticias`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  try {
    // Buscar todos os posts publicados
    const posts = await getPublishedPosts()

    const blogPosts = posts
      .filter((post) => !post.post_type)
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

    const receitas = posts
      .filter((post) => post.post_type === 'recipe')
      .map((post) => ({
        url: `${baseUrl}/blog/receitas/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))

    const noticias = posts
      .filter((post) => post.post_type === 'news')
      .map((post) => ({
        url: `${baseUrl}/blog/noticias/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))

    return [
      ...staticPages,
      ...blogPosts,
      ...receitas,
      ...noticias,
    ]
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return staticPages
  }
} 