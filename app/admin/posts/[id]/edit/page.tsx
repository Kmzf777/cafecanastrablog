'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PostEditor } from '@/components/admin/PostEditor'
import type { BlogPost, ContentBlock } from '@/lib/types/blog'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [post, setPost] = useState<(BlogPost & { blocks?: ContentBlock[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/posts/${id}`)
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        if (!res.ok) {
          setError('Post não encontrado')
          return
        }
        const json = await res.json()
        setPost(json.post)
      } catch {
        setError('Falha ao carregar post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500">{error || 'Post não encontrado'}</p>
      </div>
    )
  }

  return <PostEditor mode="edit" initialPost={post} />
}
