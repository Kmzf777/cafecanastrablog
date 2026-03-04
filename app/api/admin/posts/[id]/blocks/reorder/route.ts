import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'
import { z } from 'zod'

const reorderSchema = z.array(z.object({
  id: z.string().uuid(),
  order: z.number().int().min(0),
})).min(1)

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const { id: postId } = await params
    const body = await request.json()

    // Validate payload
    const parsed = reorderSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Invalid reorder payload', details: parsed.error.issues }, { status: 400 })
    }

    const items = parsed.data
    const supabase = createServiceClient()

    // Verify post exists
    const { data: post } = await supabase.from('blog_posts').select('id').eq('id', postId).single()
    if (!post) return Response.json({ error: 'Post not found' }, { status: 404 })

    // Verify all block IDs belong to this post
    const blockIds = items.map((item) => item.id)
    const { data: existingBlocks } = await supabase
      .from('blog_post_blocks')
      .select('id')
      .eq('post_id', postId)
      .in('id', blockIds)

    if (!existingBlocks || existingBlocks.length !== blockIds.length) {
      return Response.json({ error: 'Some block IDs do not belong to this post' }, { status: 400 })
    }

    // Update order for each block
    for (const item of items) {
      const { error } = await supabase
        .from('blog_post_blocks')
        .update({ order: item.order })
        .eq('id', item.id)
        .eq('post_id', postId)

      if (error) {
        return Response.json({ error: `Failed to update block ${item.id}: ${error.message}` }, { status: 500 })
      }
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Reorder API Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
