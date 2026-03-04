import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'
import { sanitizeBlockData } from '@/lib/utils/block-helpers'
import type { ContentBlock } from '@/lib/types/blog'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const { id: postId } = await params
    const body = await request.json()
    const supabase = createServiceClient()

    // Verify post exists
    const { data: existing } = await supabase.from('blog_posts').select('id').eq('id', postId).single()
    if (!existing) return Response.json({ error: 'Post not found' }, { status: 404 })

    // Build partial update — no required fields except post_id (already in URL)
    const updates: Record<string, unknown> = {
      status: 'draft',
      updated_at: new Date().toISOString(),
    }

    if (body.title !== undefined) updates.title = body.title
    if (body.slug !== undefined) updates.slug = body.slug
    if (body.content !== undefined) updates.content = body.content
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt
    if (body.image_url !== undefined) updates.image_url = body.image_url
    if (body.image_alt !== undefined) updates.image_alt = body.image_alt
    if (body.category !== undefined) updates.category = body.category
    if (body.tags !== undefined) updates.tags = body.tags
    if (body.seo_config !== undefined) updates.seo_config = body.seo_config
    if (body.geo_config !== undefined) updates.geo_config = body.geo_config

    // Update post metadata
    const { error: postError } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', postId)

    if (postError) return Response.json({ error: postError.message }, { status: 500 })

    // Save blocks without full validation (auto-save accepts incomplete blocks)
    if (Array.isArray(body.blocks)) {
      // Sanitize rich text even in auto-save
      const sanitizedBlocks = (body.blocks as ContentBlock[]).map(sanitizeBlockData)

      // Delete existing blocks and insert new ones
      await supabase.from('blog_post_blocks').delete().eq('post_id', postId)

      if (sanitizedBlocks.length > 0) {
        const blockRecords = sanitizedBlocks.map((block) => ({
          id: block.id,
          post_id: postId,
          type: block.type,
          order: block.order,
          data: block.data,
          settings: block.settings || null,
        }))

        const { error: blocksError } = await supabase
          .from('blog_post_blocks')
          .insert(blockRecords)

        if (blocksError) return Response.json({ error: blocksError.message }, { status: 500 })
      }
    }

    return Response.json({ saved: true, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Auto-save API Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
