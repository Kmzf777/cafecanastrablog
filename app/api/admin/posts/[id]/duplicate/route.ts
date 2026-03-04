import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

  const { id } = await params
  const supabase = createServiceClient()

  // Fetch original post
  const { data: original, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !original) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  // Fetch original blocks
  const { data: blocks } = await supabase
    .from('blog_post_blocks')
    .select('*')
    .eq('post_id', id)
    .order('order', { ascending: true })

  // Create duplicate post
  const newPostId = randomUUID()
  const now = new Date().toISOString()
  const { data: newPost, error: insertError } = await supabase
    .from('blog_posts')
    .insert({
      id: newPostId,
      title: `Copy of ${original.title}`,
      slug: `${original.slug}-copy`,
      content: original.content || '',
      excerpt: original.excerpt,
      image_url: original.image_url,
      image_alt: original.image_alt,
      category: original.category,
      tags: original.tags || [],
      status: 'draft',
      scheduled_at: null,
      published_at: null,
      author: original.author,
      locale: original.locale || 'pt',
      seo_config: original.seo_config || {},
      geo_config: original.geo_config || {},
      reading_time_minutes: original.reading_time_minutes || 0,
      word_count: original.word_count || 0,
      seo_score: 0,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  // Copy blocks with new UUIDs
  if (blocks && blocks.length > 0) {
    const newBlocks = blocks.map((block) => ({
      id: randomUUID(),
      post_id: newPostId,
      type: block.type,
      order: block.order,
      data: block.data,
      settings: block.settings,
      created_at: now,
      updated_at: now,
    }))

    const { error: blocksError } = await supabase
      .from('blog_post_blocks')
      .insert(newBlocks)

    if (blocksError) {
      // Rollback: delete the duplicated post
      await supabase.from('blog_posts').delete().eq('id', newPostId)
      return Response.json({ error: blocksError.message }, { status: 500 })
    }
  }

  return Response.json({ post: newPost }, { status: 201 })
}
