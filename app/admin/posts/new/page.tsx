import type { Metadata } from 'next'
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'Novo Post | Admin' }

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Novo Post</h1>
        <PostForm mode="create" />
      </div>
    </main>
  )
}
