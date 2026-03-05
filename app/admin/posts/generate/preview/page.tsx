'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Loader2, ArrowLeft, Pencil, Check, Save, Trash2, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { BlockRenderer } from '@/components/blog/BlockRenderer'
import { SeoScoreGauge } from '@/components/admin/seo-panel/SeoScoreGauge'
import { calculateSeoScore } from '@/lib/seo/seo-scorer'
import type { BlogPost, ContentBlock, SeoConfig } from '@/lib/types/blog'

interface PostWithBlocks extends BlogPost {
  blocks: ContentBlock[]
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}

function PreviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const postId = searchParams.get('postId')

  const [post, setPost] = useState<PostWithBlocks | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!postId) {
      setError('ID do post nao informado.')
      setLoading(false)
      return
    }

    async function load() {
      try {
        const res = await fetch(`/api/admin/posts/${postId}`)
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        if (!res.ok) {
          setError('Post nao encontrado.')
          return
        }
        const json = await res.json()
        setPost(json.post)
      } catch {
        setError('Falha ao carregar o post.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId, router])

  const handlePublish = useCallback(async () => {
    if (!post) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          status: 'published',
          published_at: new Date().toISOString(),
          blocks: post.blocks,
        }),
      })
      if (!res.ok) {
        throw new Error('Falha ao publicar')
      }
      toast({
        title: 'Post publicado!',
        description: `"${post.title}" foi publicado com sucesso.`,
      })
      router.push('/admin')
    } catch {
      toast({
        title: 'Erro ao publicar',
        description: 'Nao foi possivel publicar o post. Ele permanece como rascunho.',
        variant: 'destructive',
      })
      setPublishing(false)
    }
  }, [post, router, toast])

  const handleSaveDraft = useCallback(() => {
    toast({
      title: 'Rascunho salvo',
      description: 'O post permanece como rascunho.',
    })
    router.push('/admin')
  }, [router, toast])

  const handleDiscard = useCallback(async () => {
    if (!post) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('Falha ao excluir')
      }
      toast({
        title: 'Rascunho descartado',
        description: 'O post foi excluido.',
      })
      router.push('/admin/posts/generate')
    } catch {
      toast({
        title: 'Erro ao descartar',
        description: 'Nao foi possivel excluir o post.',
        variant: 'destructive',
      })
      setDeleting(false)
    }
  }, [post, router, toast])

  // Calculate SEO score
  const seoResult = post
    ? calculateSeoScore(post.blocks, (post.seo_config as SeoConfig) || {}, post.slug)
    : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-red-500">{error || 'Post nao encontrado.'}</p>
        <Button variant="outline" onClick={() => router.push('/admin/posts/generate')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para geracao
        </Button>
      </div>
    )
  }

  const isActioning = publishing || deleting

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/posts/generate')}
            disabled={isActioning}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            {/* Edit */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
              disabled={isActioning}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Editar
            </Button>

            {/* Save as Draft */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isActioning}
            >
              <Save className="mr-1 h-4 w-4" />
              Salvar como Rascunho
            </Button>

            {/* Discard */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isActioning}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Descartar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Descartar rascunho</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza? O post &quot;{post.title}&quot; sera permanentemente excluido. Esta acao nao pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDiscard}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Publish */}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={handlePublish}
              disabled={isActioning}
            >
              {publishing ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1 h-4 w-4" />
              )}
              Aprovar e Publicar
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Sparkles className="mr-1 h-3 w-3" />
            Gerado por IA — Rascunho
          </Badge>
          {post.category && (
            <Badge variant="outline">{post.category}</Badge>
          )}
          {post.tags && post.tags.length > 0 && post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Post preview — mirrors public blog rendering */}
          <article className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Cover Image */}
            {post.image_url && (
              <div className="relative h-64 sm:h-80 w-full">
                <img
                  src={post.image_url}
                  alt={post.image_alt || post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            <div className="px-6 py-8 sm:px-10 sm:py-12">
              {/* Header */}
              <header className="mb-10 text-center">
                {post.category && (
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-amber-800 uppercase bg-amber-100 rounded-full">
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  {post.author && (
                    <span className="font-medium text-gray-900">{post.author}</span>
                  )}
                  {post.reading_time_minutes && (
                    <span>{post.reading_time_minutes} min de leitura</span>
                  )}
                </div>
              </header>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="mb-8 text-lg text-gray-600 italic border-l-4 border-amber-300 pl-4">
                  {post.excerpt}
                </p>
              )}

              {/* Block content */}
              {post.blocks && post.blocks.length > 0 ? (
                <div className="max-w-none">
                  <BlockRenderer blocks={post.blocks} />
                </div>
              ) : (
                <p className="text-gray-500">Nenhum bloco de conteudo encontrado.</p>
              )}

              {/* Tags footer */}
              {post.tags && post.tags.length > 0 && (
                <footer className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </footer>
              )}
            </div>
          </article>

          {/* Sidebar — SEO Score & Metadata */}
          <aside className="space-y-4">
            {/* SEO Score */}
            {seoResult && (
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">SEO Score</h3>
                <SeoScoreGauge score={seoResult.totalScore} maxScore={seoResult.maxScore} />
              </div>
            )}

            {/* Post info */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Informacoes</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Status</dt>
                  <dd className="font-medium text-gray-900 capitalize">{post.status}</dd>
                </div>
                {post.word_count && (
                  <div>
                    <dt className="text-gray-500">Palavras</dt>
                    <dd className="font-medium text-gray-900">{post.word_count.toLocaleString('pt-BR')}</dd>
                  </div>
                )}
                {post.reading_time_minutes && (
                  <div>
                    <dt className="text-gray-500">Tempo de leitura</dt>
                    <dd className="font-medium text-gray-900">{post.reading_time_minutes} min</dd>
                  </div>
                )}
                {post.blocks && (
                  <div>
                    <dt className="text-gray-500">Blocos</dt>
                    <dd className="font-medium text-gray-900">{post.blocks.length}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
