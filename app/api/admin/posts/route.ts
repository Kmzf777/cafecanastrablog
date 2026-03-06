import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'
import {
  sanitizeBlockData,
  validateBlocks,
  validateSeoConfig,
  validateGeoConfig,
  calculateMetrics,
  blocksToDbRecords,
} from '@/lib/utils/block-helpers'
import type { ContentBlock } from '@/lib/types/blog'

function generateExcerpt(content: string): string {
  const plain = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return plain.slice(0, 200)
}

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ posts: data })
  } catch (error) {
    console.error('[GET /api/admin/posts] Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const body = await request.json()
    const {
      title, slug, content, excerpt, image_url, image_alt,
      category, tags, scheduled_at, status, published_at,
      blocks, seo_config, geo_config, locale, seo_score,
      translation_group_id, author,
    } = body

    if (!title?.trim()) {
      return Response.json({ error: 'Titulo obrigatorio' }, { status: 400 })
    }

    // Filter out blocks with empty/default data (user added block but didn't fill it)
    const validBlocks = Array.isArray(blocks)
      ? (blocks as ContentBlock[]).filter((block) => {
          const data = block.data as Record<string, unknown>
          switch (block.type) {
            case 'paragraph':
            case 'heading':
            case 'quote':
            case 'callout':
              return typeof data.text === 'string' && data.text.trim().length > 0
            case 'image':
              return typeof data.src === 'string' && data.src.trim().length > 0
            case 'embed':
            case 'video':
              return typeof data.url === 'string' && data.url.trim().length > 0
            case 'code':
              return typeof data.code === 'string' && data.code.trim().length > 0
            case 'list':
              return Array.isArray(data.items) && (data.items as string[]).some((i) => i.trim().length > 0)
            case 'faq':
              return Array.isArray(data.items) && (data.items as Array<{question: string; answer: string}>).some((i) => i.question.trim().length > 0)
            case 'cta':
              return typeof data.text === 'string' && data.text.trim().length > 0
            case 'table':
              return Array.isArray(data.headers) && (data.headers as string[]).some((h) => h.trim().length > 0)
            case 'accordion':
              return Array.isArray(data.items) && (data.items as Array<{title: string; content: string}>).some((i) => i.title.trim().length > 0)
            case 'product':
              return typeof data.name === 'string' && data.name.trim().length > 0
            case 'gallery':
              return Array.isArray(data.images) && (data.images as Array<{src: string}>).length > 0 && (data.images as Array<{src: string}>).some((img) => img.src.trim().length > 0)
            case 'divider':
              return true // Dividers are always valid
            default:
              return true
          }
        })
      : []

    // Validate non-empty blocks
    const hasBlocks = validBlocks.length > 0
    if (hasBlocks) {
      const blockErrors = validateBlocks(validBlocks)
      if (blockErrors.length > 0) {
        return Response.json({ error: 'Block validation failed', details: blockErrors }, { status: 400 })
      }
    }

    // Validate seo_config (clean empty strings from URL fields)
    const cleanedSeoConfig = seo_config ? { ...seo_config } : {}
    if (cleanedSeoConfig.canonical_url === '') delete cleanedSeoConfig.canonical_url
    if (cleanedSeoConfig.og_image === '') delete cleanedSeoConfig.og_image

    const seoResult = validateSeoConfig(cleanedSeoConfig)
    if (!seoResult.valid) {
      console.error('SEO validation failed:', seoResult.error)
      return Response.json({ error: seoResult.error }, { status: 400 })
    }

    // Validate geo_config
    const geoResult = validateGeoConfig(geo_config)
    if (!geoResult.valid) {
      console.error('GEO validation failed:', geoResult.error)
      return Response.json({ error: geoResult.error }, { status: 400 })
    }

    // Sanitize blocks
    const sanitizedBlocks = hasBlocks
      ? validBlocks.map(sanitizeBlockData)
      : []

    // Calculate metrics from blocks
    const metrics = hasBlocks
      ? calculateMetrics(sanitizedBlocks)
      : { word_count: 0, reading_time_minutes: 0 }

    // Content fallback: require blocks or content for publishing, but allow empty drafts
    if (!content?.trim() && !hasBlocks && status === 'published') {
      return Response.json({ error: 'Content or blocks required to publish' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Insert post
    const record = {
      title: title.trim(),
      slug: slug?.trim() || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      content: content || '',
      excerpt: excerpt?.trim() || generateExcerpt(content || title),
      image_url: image_url || null,
      image_alt: image_alt || null,
      category: category || null,
      tags: tags || [],
      status: status || 'draft',
      scheduled_at: scheduled_at || null,
      published_at: published_at || null,
      author: author || 'Cafe Canastra',
      locale: locale || 'pt',
      translation_group_id: translation_group_id || undefined,
      seo_config: cleanedSeoConfig,
      geo_config: geo_config || {},
      reading_time_minutes: metrics.reading_time_minutes,
      word_count: metrics.word_count,
      seo_score: typeof seo_score === 'number' ? seo_score : 0,
    }

    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert(record)
      .select()
      .single()

    if (postError) {
      console.error('Supabase Error (post insert):', postError)
      return Response.json({ error: postError.message }, { status: 500 })
    }

    // Insert blocks
    if (sanitizedBlocks.length > 0) {
      const blockRecords = blocksToDbRecords(sanitizedBlocks, post.id)
      const { error: blocksError } = await supabase
        .from('blog_post_blocks')
        .insert(blockRecords)

      if (blocksError) {
        // Rollback: delete the post if blocks fail
        await supabase.from('blog_posts').delete().eq('id', post.id)
        console.error('Supabase Error (blocks insert):', blocksError)
        return Response.json({ error: blocksError.message }, { status: 500 })
      }
    }

    // Return post with blocks
    return Response.json({ post: { ...post, blocks: sanitizedBlocks } }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return Response.json({ error: message }, { status: 500 })
  }
}
