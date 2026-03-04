// Story 3.1 — Types for blog_posts table
// Story 1.1 — Extended with block system, SEO, and GEO types

import type { BlockData } from './block-data'

export type BlogPostStatus = 'draft' | 'scheduled' | 'published'

// All 16 supported block types
export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'gallery'
  | 'quote'
  | 'list'
  | 'code'
  | 'embed'
  | 'divider'
  | 'callout'
  | 'table'
  | 'faq'
  | 'cta'
  | 'video'
  | 'accordion'
  | 'product'

export interface BlockSettings {
  width?: 'narrow' | 'default' | 'wide' | 'full'
  alignment?: 'left' | 'center' | 'right'
  css_class?: string
  spacing?: 'none' | 'small' | 'medium' | 'large'
}

export interface ContentBlock {
  id: string
  type: BlockType
  order: number
  data: BlockData
  settings?: BlockSettings
}

export interface SemanticEntity {
  name: string
  type: string
  description?: string
  sameAs?: string[]
  properties?: Record<string, string>
}

export interface SeoConfig {
  meta_title?: string
  meta_description?: string
  focus_keyword?: string
  secondary_keywords?: string[]
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_card_type?: 'summary' | 'summary_large_image'
  no_index?: boolean
  no_follow?: boolean
}

export interface GeoConfig {
  target_region?: string
  target_city?: string
  target_state?: string
  target_country?: string
  language?: string
  local_business_name?: string
  local_business_type?: string
  coordinates?: { lat: number; lng: number }
  service_area?: string[]
  semantic_entities?: SemanticEntity[]
  speakable_selectors?: string[]
}

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
  // Story 1.1 — Block system fields (optional for backward compatibility)
  locale?: string
  translation_group_id?: string
  seo_config?: SeoConfig
  geo_config?: GeoConfig
  reading_time_minutes?: number
  word_count?: number
  seo_score?: number
}

export type CreateBlogPost = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>

export type UpdateBlogPost = Partial<CreateBlogPost>

// Story 1.2 — API payload types for block-based post creation/update

export interface CreatePostPayload {
  title: string
  slug: string
  content?: string
  excerpt?: string | null
  image_url?: string | null
  image_alt?: string | null
  status?: BlogPostStatus
  scheduled_at?: string | null
  published_at?: string | null
  author?: string
  category?: string | null
  tags?: string[]
  locale?: string
  blocks: ContentBlock[]
  seo_config?: SeoConfig
  geo_config?: GeoConfig
}

export interface UpdatePostPayload {
  title?: string
  slug?: string
  content?: string
  excerpt?: string | null
  image_url?: string | null
  image_alt?: string | null
  status?: BlogPostStatus
  scheduled_at?: string | null
  published_at?: string | null
  author?: string
  category?: string | null
  tags?: string[]
  locale?: string
  blocks?: ContentBlock[]
  seo_config?: SeoConfig
  geo_config?: GeoConfig
}
