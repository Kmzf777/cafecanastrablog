// Story 1.1 — Zod validation schemas for all 16 block types, SEO, and GEO config

import { z } from 'zod'

// =====================
// Block Data Schemas (16 types)
// =====================

export const headingDataSchema = z.object({
  text: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  anchor: z.string().optional(),
})

export const paragraphDataSchema = z.object({
  text: z.string().min(1),
})

export const imageDataSchema = z.object({
  src: z.string().url(),
  alt: z.string().min(1),
  caption: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
})

export const galleryDataSchema = z.object({
  images: z.array(z.object({
    src: z.string().url(),
    alt: z.string().min(1),
    caption: z.string().optional(),
  })).min(1),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  layout: z.enum(['grid', 'masonry', 'carousel']).optional(),
})

export const quoteDataSchema = z.object({
  text: z.string().min(1),
  citation: z.string().optional(),
  url: z.string().url().optional(),
})

export const listDataSchema = z.object({
  style: z.enum(['ordered', 'unordered']),
  items: z.array(z.string().min(1)).min(1),
})

export const codeDataSchema = z.object({
  code: z.string().min(1),
  language: z.string().optional(),
  filename: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
})

export const embedDataSchema = z.object({
  url: z.string().url(),
  provider: z.string().optional(),
  html: z.string().optional(),
  caption: z.string().optional(),
})

export const dividerDataSchema = z.object({
  style: z.enum(['solid', 'dashed', 'dotted', 'ornamental']).optional(),
})

export const calloutDataSchema = z.object({
  text: z.string().min(1),
  variant: z.enum(['info', 'warning', 'success', 'error', 'tip']).optional(),
  title: z.string().optional(),
  icon: z.string().optional(),
})

export const tableDataSchema = z.object({
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())).min(1),
  caption: z.string().optional(),
})

export const faqDataSchema = z.object({
  items: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(1),
})

export const ctaDataSchema = z.object({
  text: z.string().min(1),
  buttonText: z.string().min(1),
  buttonUrl: z.string().url(),
  variant: z.enum(['primary', 'secondary', 'outline']).optional(),
  description: z.string().optional(),
})

export const videoDataSchema = z.object({
  url: z.string().url(),
  provider: z.enum(['youtube', 'vimeo', 'custom']).optional(),
  title: z.string().optional(),
  thumbnail: z.string().url().optional(),
})

export const accordionDataSchema = z.object({
  items: z.array(z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    defaultOpen: z.boolean().optional(),
  })).min(1),
})

export const productDataSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
  image: z.string().url().optional(),
  url: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional(),
  features: z.array(z.string()).optional(),
})

// =====================
// Discriminated union for block data by type
// =====================

export const blockDataSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), ...headingDataSchema.shape }),
  z.object({ type: z.literal('paragraph'), ...paragraphDataSchema.shape }),
  z.object({ type: z.literal('image'), ...imageDataSchema.shape }),
  z.object({ type: z.literal('gallery'), ...galleryDataSchema.shape }),
  z.object({ type: z.literal('quote'), ...quoteDataSchema.shape }),
  z.object({ type: z.literal('list'), ...listDataSchema.shape }),
  z.object({ type: z.literal('code'), ...codeDataSchema.shape }),
  z.object({ type: z.literal('embed'), ...embedDataSchema.shape }),
  z.object({ type: z.literal('divider'), ...dividerDataSchema.shape }),
  z.object({ type: z.literal('callout'), ...calloutDataSchema.shape }),
  z.object({ type: z.literal('table'), ...tableDataSchema.shape }),
  z.object({ type: z.literal('faq'), ...faqDataSchema.shape }),
  z.object({ type: z.literal('cta'), ...ctaDataSchema.shape }),
  z.object({ type: z.literal('video'), ...videoDataSchema.shape }),
  z.object({ type: z.literal('accordion'), ...accordionDataSchema.shape }),
  z.object({ type: z.literal('product'), ...productDataSchema.shape }),
])

// =====================
// Full ContentBlock schema
// =====================

export const blockSettingsSchema = z.object({
  width: z.enum(['narrow', 'default', 'wide', 'full']).optional(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
  css_class: z.string().optional(),
  spacing: z.enum(['none', 'small', 'medium', 'large']).optional(),
})

export const contentBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'heading', 'paragraph', 'image', 'gallery', 'quote', 'list',
    'code', 'embed', 'divider', 'callout', 'table', 'faq',
    'cta', 'video', 'accordion', 'product',
  ]),
  order: z.number().int().min(0),
  data: z.record(z.unknown()),
  settings: blockSettingsSchema.optional(),
})

// =====================
// SEO & GEO Config Schemas
// =====================

// Helper: accept empty string or valid URL (empty strings are stripped to undefined)
const optionalUrl = z
  .string()
  .transform((v) => (v.trim() === '' ? undefined : v))
  .pipe(z.string().url().optional())
  .optional()

export const seoConfigSchema = z.object({
  meta_title: z.string().max(70).optional(),
  meta_description: z.string().max(160).optional(),
  focus_keyword: z.string().optional(),
  secondary_keywords: z.array(z.string()).optional(),
  canonical_url: optionalUrl,
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: optionalUrl,
  twitter_card_type: z.enum(['summary', 'summary_large_image']).optional(),
  no_index: z.boolean().optional(),
  no_follow: z.boolean().optional(),
})

export const semanticEntitySchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  sameAs: z.array(z.string().url()).optional(),
  properties: z.record(z.string()).optional(),
})

export const geoConfigSchema = z.object({
  target_region: z.string().optional(),
  target_city: z.string().optional(),
  target_state: z.string().optional(),
  target_country: z.string().optional(),
  language: z.string().optional(),
  local_business_name: z.string().optional(),
  local_business_type: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  service_area: z.array(z.string()).optional(),
  semantic_entities: z.array(semanticEntitySchema).optional(),
  speakable_selectors: z.array(z.string()).optional(),
})
