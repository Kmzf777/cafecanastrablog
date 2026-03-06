// Block validation schemas — mirrors lib/schemas/block-validation.ts
// Only includes types used by AI generation (heading, paragraph, callout, faq, cta, list, quote)

import { z } from 'zod'

export const headingDataSchema = z.object({
  text: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  anchor: z.string().optional(),
})

export const paragraphDataSchema = z.object({
  text: z.string().min(1),
})

export const calloutDataSchema = z.object({
  text: z.string().min(1),
  variant: z.enum(['info', 'warning', 'success', 'error', 'tip']).optional(),
  title: z.string().optional(),
  icon: z.string().optional(),
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
  buttonUrl: z.string().min(1),
  variant: z.enum(['primary', 'secondary', 'outline']).optional(),
  description: z.string().optional(),
})

export const listDataSchema = z.object({
  style: z.enum(['ordered', 'unordered']),
  items: z.array(z.string().min(1)).min(1),
})

export const quoteDataSchema = z.object({
  text: z.string().min(1),
  citation: z.string().optional(),
  url: z.string().url().optional(),
})

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
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  service_area: z.array(z.string()).optional(),
  semantic_entities: z.array(semanticEntitySchema).optional(),
  speakable_selectors: z.array(z.string()).optional(),
})
