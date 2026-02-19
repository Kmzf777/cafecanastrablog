import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'

function generateExcerpt(content: string): string {
  // Strip markdown and return first 200 chars
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
  if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ posts: data })
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const body = await request.json()
    const { title, slug, content, excerpt, image_url, image_alt, category, tags, scheduled_at, status, published_at } = body

    if (!title?.trim()) {
      return Response.json({ error: 'Título obrigatório' }, { status: 400 })
    }
    if (!content?.trim()) {
      return Response.json({ error: 'Conteúdo obrigatório' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const record = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: excerpt?.trim() || generateExcerpt(content),
      image_url: image_url || null,
      image_alt: image_alt || null,
      category: category || null,
      tags: tags || [],
      status: status || 'draft',
      scheduled_at: scheduled_at || null,
      published_at: published_at || null,
      author: 'Rafael',
    }

    const { data, error } = await supabase.from('blog_posts').insert(record).select().single()

    if (error) {
      console.error('Supabase Error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ post: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return Response.json({ error: message }, { status: 500 })
  }
}
