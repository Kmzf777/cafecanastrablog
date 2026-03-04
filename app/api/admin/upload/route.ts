import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase-service'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Convert File to ArrayBuffer for upload (ensures compatibility)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      // Provide more specific error messages
      if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
        return Response.json(
          { error: 'Bucket de imagens não configurado. Crie o bucket "blog-images" no Supabase Storage.' },
          { status: 500 }
        )
      }
      return Response.json({ error: `Falha no upload: ${error.message}` }, { status: 500 })
    }

    const { data } = supabase.storage.from('blog-images').getPublicUrl(filename)
    return Response.json({ url: data.publicUrl })
  } catch (err) {
    console.error('Upload API error:', err)
    const message = err instanceof Error ? err.message : 'Erro interno do servidor'
    return Response.json({ error: message }, { status: 500 })
  }
}
