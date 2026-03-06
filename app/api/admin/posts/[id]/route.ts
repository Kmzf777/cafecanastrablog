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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const { id } = await params
    const supabase = createServiceClient()

    // Fetch post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !post) return Response.json({ error: 'Post not found' }, { status: 404 })

    // Fetch blocks ordered by order
    const { data: blocks } = await supabase
      .from('blog_post_blocks')
      .select('*')
      .eq('post_id', id)
      .order('order', { ascending: true })

    return Response.json({ post: { ...post, blocks: blocks || [] } })
  } catch (error) {
    console.error('[GET /api/admin/posts/[id]] Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const { id } = await params
    const supabase = createServiceClient()

    // Check existence
    const { data: existing } = await supabase.from('blog_posts').select('id').eq('id', id).single()
    if (!existing) return Response.json({ error: 'Post not found' }, { status: 404 })

  const body = await request.json()
  const {
    title, slug, content, excerpt, image_url, image_alt,
    category, tags, scheduled_at, status, published_at,
    blocks, seo_config, geo_config, locale, seo_score,
    translation_group_id, author,
  } = body

  if (title !== undefined && !title?.trim()) {
    return Response.json({ error: 'Titulo obrigatorio' }, { status: 400 })
  }

  // Filter out blocks with empty/default data
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
            return true
          default:
            return true
        }
      })
    : []

  const hasBlocks = validBlocks.length > 0
  if (hasBlocks) {
    const blockErrors = validateBlocks(validBlocks)
    if (blockErrors.length > 0) {
      return Response.json({ error: 'Block validation failed', details: blockErrors }, { status: 400 })
    }
  }

  // Validate configs (clean empty strings from URL fields)
  const cleanedSeoConfig = seo_config ? { ...seo_config } : undefined
  if (cleanedSeoConfig) {
    if (cleanedSeoConfig.canonical_url === '') delete cleanedSeoConfig.canonical_url
    if (cleanedSeoConfig.og_image === '') delete cleanedSeoConfig.og_image
  }

  const seoResult = validateSeoConfig(cleanedSeoConfig)
  if (!seoResult.valid) return Response.json({ error: seoResult.error }, { status: 400 })

  const geoResult = validateGeoConfig(geo_config)
  if (!geoResult.valid) return Response.json({ error: geoResult.error }, { status: 400 })

  // Build update object
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (title !== undefined) updates.title = title.trim()
  if (slug !== undefined) updates.slug = slug.trim()
  if (content !== undefined) updates.content = content
  if (excerpt !== undefined) updates.excerpt = excerpt
  if (image_url !== undefined) updates.image_url = image_url || null
  if (image_alt !== undefined) updates.image_alt = image_alt || null
  if (category !== undefined) updates.category = category || null
  if (tags !== undefined) updates.tags = tags
  if (scheduled_at !== undefined) updates.scheduled_at = scheduled_at || null
  if (status !== undefined) updates.status = status
  if (published_at !== undefined) updates.published_at = published_at || null
  if (locale !== undefined) updates.locale = locale
  if (author !== undefined) updates.author = author
  if (translation_group_id !== undefined) updates.translation_group_id = translation_group_id
  if (seo_config !== undefined) updates.seo_config = cleanedSeoConfig
  if (geo_config !== undefined) updates.geo_config = geo_config
  if (typeof seo_score === 'number') updates.seo_score = seo_score

  // Sanitize and sync blocks
  let sanitizedBlocks: ContentBlock[] = []
  if (hasBlocks) {
    sanitizedBlocks = validBlocks.map(sanitizeBlockData)

    // Calculate metrics from blocks
    const metrics = calculateMetrics(sanitizedBlocks)
    updates.reading_time_minutes = metrics.reading_time_minutes
    updates.word_count = metrics.word_count
  }

  // Update post metadata
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (postError) return Response.json({ error: postError.message }, { status: 500 })

  // Sync blocks: delete all existing, insert new (atomic pattern)
  if (hasBlocks) {
    const { error: deleteError } = await supabase
      .from('blog_post_blocks')
      .delete()
      .eq('post_id', id)

    if (deleteError) return Response.json({ error: deleteError.message }, { status: 500 })

    const blockRecords = blocksToDbRecords(sanitizedBlocks, id)
    const { error: insertError } = await supabase
      .from('blog_post_blocks')
      .insert(blockRecords)

    if (insertError) return Response.json({ error: insertError.message }, { status: 500 })
  }

  // Fetch final blocks for response
  const { data: finalBlocks } = await supabase
    .from('blog_post_blocks')
    .select('*')
    .eq('post_id', id)
    .order('order', { ascending: true })

  return Response.json({ post: { ...post, blocks: finalBlocks || [] } })
  } catch (error) {
    console.error('[PUT /api/admin/posts/[id]] Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const { id } = await params
    const supabase = createServiceClient()
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/posts/[id]] Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
