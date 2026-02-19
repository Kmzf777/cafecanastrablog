'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { generateSlug } from '@/lib/utils/slug'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageIcon, Loader2, X } from 'lucide-react'
import type { BlogPost } from '@/lib/types/blog'

const CATEGORIES = [
  'Receitas',
  'Terroir & Origem',
  'Métodos de Preparo',
  'Notícias',
  'Curiosidades',
]

const postSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(80, 'Máximo 80 caracteres'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  content: z.string().min(1, 'Conteúdo obrigatório'),
  excerpt: z.string().max(300, 'Máximo 300 caracteres').optional(),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  image_alt: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  scheduled_at: z.string().optional().nullable(),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
  mode: 'create' | 'edit'
  post?: BlogPost
}

export default function PostForm({ mode, post }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(post?.image_url ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      content: post?.content ?? '',
      excerpt: post?.excerpt ?? '',
      image_url: post?.image_url ?? '',
      image_alt: post?.image_alt ?? '',
      category: post?.category ?? '',
      tags: post?.tags?.join(', ') ?? '',
      scheduled_at: post?.scheduled_at ?? '',
    },
  })

  const titleValue = watch('title')
  const slugValue = watch('slug')
  const titleRef = useRef(post?.title ?? '')

  // Auto-generate slug when title changes (only if slug matches previous auto-slug or is empty)
  useEffect(() => {
    if (mode === 'edit') return
    const prevSlug = generateSlug(titleRef.current)
    const currentSlug = watch('slug')
    if (currentSlug === prevSlug || currentSlug === '') {
      setValue('slug', generateSlug(titleValue), { shouldValidate: false })
    }
    titleRef.current = titleValue
  }, [titleValue, mode, setValue, watch])

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erro no upload')
    return json.url as string
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setImageError('')
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Arquivo muito grande (máx 5MB)')
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setImageError('Tipo não permitido. Use JPEG, PNG ou WebP.')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview('')
    setValue('image_url', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function savePost(extra: { status: string; scheduled_at?: string | null; published_at?: string | null }) {
    setIsLoading(true)
    try {
      const values = watch()

      // Upload image if a new file was selected
      let finalImageUrl = values.image_url || ''
      if (imageFile) {
        setIsUploading(true)
        finalImageUrl = await uploadImage(imageFile)
        setIsUploading(false)
        setValue('image_url', finalImageUrl)
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt || undefined,
        image_url: finalImageUrl || undefined,
        image_alt: values.image_alt || undefined,
        category: values.category || undefined,
        tags: values.tags ? values.tags.split(/[,\n]+/).map((t) => t.trim()).filter(Boolean) : [],
        scheduled_at: extra.scheduled_at ?? null,
        published_at: extra.published_at ?? null,
        status: extra.status,
      }

      const url = mode === 'edit' && post ? `/api/admin/posts/${post.id}` : '/api/admin/posts'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro ao salvar')

      toast({
        title: mode === 'create' ? 'Post criado!' : 'Post atualizado!',
        description:
          extra.status === 'draft'
            ? 'Rascunho salvo com sucesso.'
            : extra.status === 'scheduled'
            ? 'Post agendado com sucesso.'
            : 'Post publicado com sucesso.',
      })

      router.push('/admin')
    } catch (err) {
      toast({
        title: 'Erro',
        description: err instanceof Error ? err.message : 'Falha ao salvar post.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  const onSaveDraft = handleSubmit(() => {
    savePost({ status: 'draft', scheduled_at: null, published_at: null })
  })

  const onSchedule = handleSubmit((values) => {
    if (!values.scheduled_at) {
      setError('scheduled_at', { message: 'Data obrigatória para agendar' })
      return
    }
    if (new Date(values.scheduled_at) <= new Date()) {
      setError('scheduled_at', { message: 'Data deve ser no futuro' })
      return
    }
    savePost({ status: 'scheduled', scheduled_at: values.scheduled_at, published_at: null })
  })

  const onPublishNow = handleSubmit(() => {
    savePost({ status: 'published', scheduled_at: null, published_at: new Date().toISOString() })
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Título */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Título *</Label>
          <span className={`text-xs ${(titleValue?.length ?? 0) > 70 ? 'text-amber-600' : 'text-gray-400'}`}>
            {titleValue?.length ?? 0}/80
          </span>
        </div>
        <Input id="title" {...register('title')} placeholder="Título do post" maxLength={80} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register('slug')} placeholder="meu-post-slug" className="font-mono text-sm" />
        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
        <p className="text-xs text-gray-500">Gerado automaticamente a partir do título. Editável.</p>
      </div>

      {/* Categoria */}
      <div className="space-y-1">
        <Label>Categoria</Label>
        <Select
          onValueChange={(val) => setValue('category', val)}
          defaultValue={post?.category ?? ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conteúdo */}
      <div className="space-y-1">
        <Label htmlFor="content">Conteúdo * (Markdown)</Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="Escreva o conteúdo em Markdown..."
          rows={16}
          className="font-mono text-sm"
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      {/* Excerpt */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="excerpt">Resumo (opcional)</Label>
          <span className="text-xs text-gray-400">{watch('excerpt')?.length ?? 0}/300</span>
        </div>
        <Textarea
          id="excerpt"
          {...register('excerpt')}
          placeholder="Resumo para listagem e SEO (gerado automaticamente se vazio)"
          rows={3}
          maxLength={300}
        />
        {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
      </div>

      {/* Imagem de capa */}
      <div className="space-y-2">
        <Label>Imagem de capa</Label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-40 w-auto rounded border object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
              aria-label="Remover imagem"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-500 hover:text-amber-500"
          >
            <ImageIcon className="mb-1 h-8 w-8" />
            <span className="text-sm">Clique para selecionar JPEG, PNG ou WebP (máx 5MB)</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
        {isUploading && (
          <p className="flex items-center gap-1 text-sm text-amber-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fazendo upload...
          </p>
        )}
      </div>

      {/* Alt da imagem */}
      <div className="space-y-1">
        <Label htmlFor="image_alt">Alt da imagem (SEO / acessibilidade)</Label>
        <Input id="image_alt" {...register('image_alt')} placeholder="Descrição da imagem" />
      </div>

      {/* Data de publicação */}
      <div className="space-y-1">
        <Label htmlFor="scheduled_at">Data e hora de publicação (opcional)</Label>
        <Input
          id="scheduled_at"
          type="datetime-local"
          {...register('scheduled_at')}
        />
        {errors.scheduled_at && <p className="text-sm text-red-500">{errors.scheduled_at.message}</p>}
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <Label htmlFor="tags">Tags (separadas por vírgula ou Enter)</Label>
        <Input id="tags" {...register('tags')} placeholder="café especial, terroir, receita" />
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar Rascunho
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-amber-500 text-amber-600 hover:bg-amber-50"
          onClick={onSchedule}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar e Agendar
        </Button>
        <Button
          type="button"
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={onPublishNow}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Publicar Agora
        </Button>
      </div>
    </div>
  )
}
