import { MetadataRoute } from 'next'
import { getRecentPosts } from '@/lib/supabase'

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
  ]

  try {
    // Buscar posts do blog
    const posts = await getRecentPosts(1000) // Buscar muitos posts para o sitemap
    
    const blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...blogPosts]
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return staticPages
  }
} 