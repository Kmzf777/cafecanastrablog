'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { BlogPost } from '@/lib/types/blog'

export default function EditPostPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/admin/posts/${id}`)
                // Status 401 handling might need adjustment depending on how we handled the API auth
                if (res.status === 401) { router.push('/admin/login'); return }
                if (!res.ok) { setError('Post não encontrado'); return }
                const json = await res.json()
                setPost(json.post)
            } catch {
                setError('Erro ao carregar post')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, router])

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" /> Voltar ao painel
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Editar Post</h1>

                {loading && (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && post && <PostForm mode="edit" post={post} />}
            </div>
        </main>
    )
}
