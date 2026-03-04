// Story 4.2 / 1.8 — JSON-LD schema generators for blog pages
import type { BlogPost, ContentBlock } from '@/lib/types/blog'
import type {
  FaqData,
  ProductData,
  VideoData,
  ImageData,
  HeadingData,
  ListData,
} from '@/lib/types/block-data'
import { SITE_CONFIG } from '@/lib/site-config'

export function generateArticleSchema(post: BlogPost) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.slice(0, 110),
    description: post.excerpt ?? '',
    image: post.image_url ?? SITE_CONFIG.defaultImage,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
  }

  // AC1: speakable from geo_config
  if (post.geo_config?.speakable_selectors?.length) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: post.geo_config.speakable_selectors,
    }
  }

  // AC1: about from geo_config.semantic_entities
  if (post.geo_config?.semantic_entities?.length) {
    schema.about = post.geo_config.semantic_entities.map((entity) => ({
      '@type': entity.type,
      name: entity.name,
      ...(entity.sameAs?.length ? { sameAs: entity.sameAs } : {}),
    }))
  }

  // AC1: wordCount
  if (post.word_count) {
    schema.wordCount = post.word_count
  }

  // AC1: articleSection from category
  if (post.category) {
    schema.articleSection = post.category
  }

  return schema
}

export function generateFaqSchema(faqBlocks: FaqData[]) {
  const allItems = faqBlocks.flatMap((block) => block.items)
  if (allItems.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function generateProductSchema(
  product: ProductData,
  postUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? '',
    ...(product.image ? { image: product.image } : {}),
    url: product.url ?? postUrl,
    ...(product.price
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency ?? 'BRL',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }
}

export function generateVideoSchema(video: VideoData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title ?? '',
    ...(video.thumbnail ? { thumbnailUrl: video.thumbnail } : {}),
    contentUrl: video.url,
  }
}

export function generateHowToSchema(title: string, steps: string[]) {
  if (steps.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }
}

export function generateImageObjectSchema(image: ImageData, postUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: image.src,
    name: image.alt,
    ...(image.caption ? { caption: image.caption } : {}),
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    contentUrl: image.src,
    mainEntityOfPage: postUrl,
  }
}

/**
 * Detect HowTo patterns in blocks: a heading containing "Como" or "How to"
 * immediately followed by a list block.
 */
export function detectHowToBlocks(
  blocks: ContentBlock[]
): Array<{ title: string; steps: string[] }> {
  const results: Array<{ title: string; steps: string[] }> = []

  for (let i = 0; i < blocks.length - 1; i++) {
    const block = blocks[i]
    const next = blocks[i + 1]

    if (block.type === 'heading' && next.type === 'list') {
      const headingData = block.data as HeadingData
      const text = headingData.text
      if (/como\b/i.test(text) || /how\s+to\b/i.test(text)) {
        const listData = next.data as ListData
        results.push({ title: text, steps: listData.items })
      }
    }
  }

  return results
}

export function generateBlogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Café Canastra',
    description:
      'Dicas, receitas e curiosidades sobre café especial da Serra da Canastra',
    url: `${SITE_CONFIG.url}/blog`,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  }
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
