'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  CalendarClock,
  Send,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { BlockEditor } from '@/components/admin/block-editor/BlockEditor'
import { SeoPanel } from '@/components/admin/seo-panel/SeoPanel'
import { GeoPanel } from '@/components/admin/geo-panel/GeoPanel'
import { PostSettings } from '@/components/admin/post-settings/PostSettings'
import { calculateMetrics } from '@/lib/utils/block-helpers'
import type { BlogPost, ContentBlock, SeoConfig, GeoConfig } from '@/lib/types/blog'
import { calculateSeoScore } from '@/lib/seo/seo-scorer'
import { generateSlug } from '@/lib/utils/slug'

interface PostEditorProps {
  mode: 'create' | 'edit'
  initialPost?: BlogPost & { blocks?: ContentBlock[] }
  initialTranslationGroupId?: string
  initialLocale?: string
}

export function PostEditor({
  mode,
  initialPost,
  initialTranslationGroupId,
  initialLocale,
}: PostEditorProps) {
  const router = useRouter()
  const { toast } = useToast()

  // --- State ---
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: initialPost?.title || '',
    slug: initialPost?.slug || '',
    image_url: initialPost?.image_url || null,
    image_alt: initialPost?.image_alt || null,
    category: initialPost?.category || null,
    tags: initialPost?.tags || [],
    author: initialPost?.author || 'Cafe Canastra',
    locale: initialLocale || initialPost?.locale || 'pt',
    translation_group_id:
      initialTranslationGroupId ||
      initialPost?.translation_group_id ||
      undefined,
    id: initialPost?.id,
  })

  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialPost?.blocks || []
  )

  const [seoConfig, setSeoConfig] = useState<SeoConfig>(
    initialPost?.seo_config || {}
  )

  const [geoConfig, setGeoConfig] = useState<GeoConfig>(
    initialPost?.geo_config || {}
  )

  const [isLoading, setIsLoading] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showScheduleInput, setShowScheduleInput] = useState(false)
  const [scheduledAt, setScheduledAt] = useState(
    initialPost?.scheduled_at || ''
  )

  // --- Derived values ---
  const metrics = useMemo(() => calculateMetrics(blocks), [blocks])

  const seoScore = useMemo(() => {
    const result = calculateSeoScore(blocks, seoConfig, post.slug || '')
    return result.totalScore
  }, [blocks, seoConfig, post.slug])

  // --- Handlers ---
  const handlePostChange = useCallback(
    (field: string, value: unknown) => {
      setPost((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleBlocksChange = useCallback((newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks)
  }, [])

  const handleSeoConfigChange = useCallback((config: SeoConfig) => {
    setSeoConfig(config)
  }, [])

  const handleGeoConfigChange = useCallback((config: GeoConfig) => {
    setGeoConfig(config)
  }, [])

  // --- Save logic ---
  const savePost = useCallback(
    async (action: 'draft' | 'schedule' | 'publish') => {
      if (!post.title?.trim()) {
        toast({
          title: 'Erro',
          description: 'Título é obrigatório.',
          variant: 'destructive',
        })
        return
      }

      if (action === 'schedule') {
        if (!scheduledAt) {
          toast({
            title: 'Erro',
            description: 'Data de agendamento é obrigatória.',
            variant: 'destructive',
          })
          return
        }
        if (new Date(scheduledAt) <= new Date()) {
          toast({
            title: 'Erro',
            description: 'Data de agendamento deve ser no futuro.',
            variant: 'destructive',
          })
          return
        }
      }

      setIsLoading(true)
      try {
        // Ensure slug is generated if empty
        const finalSlug = post.slug?.trim() || generateSlug(post.title!.trim())

        const payload = {
          title: post.title!.trim(),
          slug: finalSlug,
          content: blocks.length === 0 ? post.title!.trim() : '', // fallback for empty blocks
          image_url: post.image_url || null,
          image_alt: post.image_alt || null,
          category: post.category || null,
          tags: post.tags || [],
          author: post.author || 'Cafe Canastra',
          locale: post.locale || 'pt',
          translation_group_id: post.translation_group_id || undefined,
          blocks,
          seo_config: seoConfig,
          geo_config: geoConfig,
          status:
            action === 'draft'
              ? 'draft'
              : action === 'schedule'
                ? 'scheduled'
                : 'published',
          scheduled_at: action === 'schedule' ? scheduledAt : null,
          published_at:
            action === 'publish' ? new Date().toISOString() : null,
          seo_score: seoScore,
        }

        const url =
          mode === 'edit' && initialPost
            ? `/api/admin/posts/${initialPost.id}`
            : '/api/admin/posts'
        const method = mode === 'edit' ? 'PUT' : 'POST'

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Falha ao salvar')

        const actionLabel =
          action === 'draft'
            ? 'Rascunho salvo'
            : action === 'schedule'
              ? 'Post agendado'
              : 'Post publicado'

        toast({
          title: mode === 'create' ? 'Post criado!' : 'Post atualizado!',
          description: `${actionLabel} com sucesso.`,
        })

        router.push('/admin')
      } catch (err) {
        toast({
          title: 'Erro',
          description:
            err instanceof Error ? err.message : 'Falha ao salvar post.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [
      post,
      blocks,
      seoConfig,
      geoConfig,
      seoScore,
      scheduledAt,
      mode,
      initialPost,
      router,
      toast,
    ]
  )

  const handlePublishClick = useCallback(() => {
    if (!post.title?.trim()) {
      toast({
        title: 'Erro',
        description: 'Título é obrigatório.',
        variant: 'destructive',
      })
      return
    }
    setShowPublishDialog(true)
  }, [post.title, toast])

  const confirmPublish = useCallback(() => {
    setShowPublishDialog(false)
    savePost('publish')
  }, [savePost])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[300px]">
              {post.title || (mode === 'create' ? 'Novo Post' : 'Editar Post')}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => savePost('draft')}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              Salvar Rascunho
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
              onClick={() => setShowScheduleInput(!showScheduleInput)}
              disabled={isLoading}
            >
              <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
              Agendar
            </Button>

            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handlePublishClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="mr-1.5 h-3.5 w-3.5" />
              )}
              Publicar Agora
            </Button>
          </div>
        </div>

        {/* Schedule input row */}
        {showScheduleInput && (
          <div className="mx-auto mt-2 flex max-w-[1400px] items-center gap-2">
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-8 w-64 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                savePost('schedule')
                setShowScheduleInput(false)
              }}
              disabled={isLoading || !scheduledAt}
            >
              Confirmar Agendamento
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowScheduleInput(false)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </header>

      {/* Main layout */}
      <div className="mx-auto max-w-[1400px] flex gap-4 p-4">
        {/* Left panel — Block Editor (70%) */}
        <div className="flex-[7] min-w-0">
          <BlockEditor
            initialBlocks={initialPost?.blocks || []}
            postId={initialPost?.id}
            onChange={handleBlocksChange}
          />
        </div>

        {/* Right panel — Sidebar (30%) */}
        <div className="flex-[3] min-w-[320px] max-w-[420px]">
          <div className="sticky top-[72px] rounded-lg border bg-white p-3">
            <Tabs defaultValue="settings">
              <TabsList className="w-full">
                <TabsTrigger value="seo" className="flex-1 text-xs">
                  SEO
                </TabsTrigger>
                <TabsTrigger value="geo" className="flex-1 text-xs">
                  GEO
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex-1 text-xs">
                  Configurações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seo" className="max-h-[calc(100vh-140px)] overflow-y-auto">
                <SeoPanel
                  blocks={blocks}
                  seoConfig={seoConfig}
                  slug={post.slug || ''}
                  onSeoConfigChange={handleSeoConfigChange}
                />
              </TabsContent>

              <TabsContent value="geo" className="max-h-[calc(100vh-140px)] overflow-y-auto">
                <GeoPanel
                  blocks={blocks}
                  geoConfig={geoConfig}
                  updatedAt={initialPost?.updated_at}
                  onGeoConfigChange={handleGeoConfigChange}
                />
              </TabsContent>

              <TabsContent value="settings" className="max-h-[calc(100vh-140px)] overflow-y-auto">
                <PostSettings
                  post={post}
                  seoScore={seoScore}
                  readingTime={metrics.reading_time_minutes}
                  wordCount={metrics.word_count}
                  onChange={handlePostChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publicar agora?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Pontuação SEO:{' '}
                  <span
                    className={`font-semibold ${
                      seoScore >= 70
                        ? 'text-green-600'
                        : seoScore >= 50
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}
                  >
                    {seoScore}/100
                  </span>
                </p>
                {seoScore < 50 && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      A pontuação SEO está baixa. Publicar com uma pontuação baixa pode afetar
                      a visibilidade nos mecanismos de busca. Deseja publicar mesmo assim?
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPublish}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Sim, Publicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
