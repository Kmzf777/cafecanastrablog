// Minimal type definitions for the AI API service
// Mirrors the main app's lib/types/blog.ts and lib/types/block-data.ts

export type BlockType =
  | 'heading' | 'paragraph' | 'image' | 'gallery' | 'quote' | 'list'
  | 'code' | 'embed' | 'divider' | 'callout' | 'table' | 'faq'
  | 'cta' | 'video' | 'accordion' | 'product'

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
  data: Record<string, unknown>
  settings?: BlockSettings
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
  semantic_entities?: Array<{
    name: string
    type: string
    description?: string
    sameAs?: string[]
    properties?: Record<string, string>
  }>
  speakable_selectors?: string[]
}
