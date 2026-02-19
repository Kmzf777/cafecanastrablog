// Story 3.1 — Types for blog_posts table

export type BlogPostStatus = 'draft' | 'scheduled' | 'published'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  image_alt: string | null
  status: BlogPostStatus
  scheduled_at: string | null
  published_at: string | null
  author: string
  category: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export type CreateBlogPost = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>

export type UpdateBlogPost = Partial<CreateBlogPost>
