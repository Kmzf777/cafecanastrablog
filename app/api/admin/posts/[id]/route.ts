import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single()

  if (error || !data) return Response.json({ error: 'Post não encontrado' }, { status: 404 })
  return Response.json({ post: data })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

  const { id } = await params
  const supabase = createServiceClient()

  // Check existence
  const { data: existing } = await supabase.from('blog_posts').select('id').eq('id', id).single()
  if (!existing) return Response.json({ error: 'Post não encontrado' }, { status: 404 })

  const body = await request.json()
  const { title, slug, content, excerpt, image_url, image_alt, category, tags, scheduled_at, status, published_at } = body

  if (title !== undefined && !title?.trim()) {
    return Response.json({ error: 'Título obrigatório' }, { status: 400 })
  }
  if (content !== undefined && !content?.trim()) {
    return Response.json({ error: 'Conteúdo obrigatório' }, { status: 400 })
  }

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

  const { data, error } = await supabase.from('blog_posts').update(updates).eq('id', id).select().single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ post: data })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

  const { id } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
