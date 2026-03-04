'use client'

import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { ImageIcon, X, Loader2, RefreshCw, Clock, FileText, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BlogPost } from '@/lib/types/blog'
import { generateSlug } from '@/lib/utils/slug'
import { CATEGORIES, LOCALES } from '@/lib/constants'

interface Translation {
  id: string
  locale: string
  title: string
}

interface PostSettingsProps {
  post: Partial<BlogPost>
  seoScore: number
  readingTime: number
  wordCount: number
  onChange: (field: string, value: unknown) => void
}

export function PostSettings({
  post,
  seoScore,
  readingTime,
  wordCount,
  onChange,
}: PostSettingsProps) {
  const [tagInput, setTagInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string>(post.image_url || '')
  const [imageError, setImageError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [translations, setTranslations] = useState<Translation[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef(post.title || '')

  // Fetch translations when post has translation_group_id
  useEffect(() => {
    if (!post.translation_group_id || !post.id) return

    async function fetchTranslations() {
      try {
        const res = await fetch(
          `/api/admin/posts?translation_group_id=${post.translation_group_id}&exclude_id=${post.id}`
        )
        if (res.ok) {
          const json = await res.json()
          const posts = json.posts || []
          setTranslations(
            posts.map((p: BlogPost) => ({
              id: p.id,
              locale: p.locale || 'pt',
              title: p.title,
            }))
          )
        }
      } catch {
        // Silently fail — translations are non-critical
      }
    }
    fetchTranslations()
  }, [post.translation_group_id, post.id])

  // Auto-generate slug from title
  const handleTitleChange = useCallback(
    (value: string) => {
      const prevSlug = generateSlug(titleRef.current)
      const currentSlug = post.slug || ''
      onChange('title', value)
      // Only auto-update slug if it matches previous auto-slug or is empty
      if (currentSlug === prevSlug || currentSlug === '') {
        onChange('slug', generateSlug(value))
      }
      titleRef.current = value
    },
    [post.slug, onChange]
  )

  const handleRegenerateSlug = useCallback(() => {
    if (post.title) {
      onChange('slug', generateSlug(post.title))
    }
  }, [post.title, onChange])

  // Tags management
  const tags = post.tags || []

  const addTag = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (trimmed && !tags.includes(trimmed)) {
        onChange('tags', [...tags, trimmed])
      }
    },
    [tags, onChange]
  )

  const removeTag = useCallback(
    (index: number) => {
      onChange(
        'tags',
        tags.filter((_, i) => i !== index)
      )
    },
    [tags, onChange]
  )

  const handleTagKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        const parts = tagInput.split(',')
        parts.forEach((part) => addTag(part))
        setTagInput('')
      }
      if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
        removeTag(tags.length - 1)
      }
    },
    [tagInput, tags, addTag, removeTag]
  )

  // Image upload — uploads immediately on file selection
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setImageError('')
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Arquivo muito grande (máx 5MB)')
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setImageError('Apenas JPEG, PNG ou WebP permitidos')
      return
    }
    setImagePreview(URL.createObjectURL(file))
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Falha no upload')
      setImagePreview(json.url)
      onChange('image_url', json.url)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Falha no upload')
      setImagePreview('')
    } finally {
      setIsUploading(false)
    }
  }

  function removeImage() {
    setImagePreview('')
    onChange('image_url', null)
    onChange('image_alt', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Locale helpers
  const currentLocale = post.locale || 'pt'
  const missingLocales = LOCALES.filter(
    (l) =>
      l.value !== currentLocale &&
      !translations.some((t) => t.locale === l.value)
  )

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-title" className="text-xs font-medium">
            Título *
          </Label>
          <span
            className={`text-xs tabular-nums ${
              (post.title?.length || 0) > 70
                ? 'text-amber-600'
                : 'text-muted-foreground'
            }`}
          >
            {post.title?.length || 0}/80
          </span>
        </div>
        <Input
          id="post-title"
          value={post.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título do post"
          maxLength={80}
          className="h-8 text-sm"
        />
      </div>

      {/* Slug */}
      <div className="space-y-1">
        <Label htmlFor="post-slug" className="text-xs font-medium">
          Slug
        </Label>
        <div className="flex gap-1">
          <Input
            id="post-slug"
            value={post.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="slug-do-post"
            className="h-8 text-sm font-mono"
          />
          <button
            type="button"
            onClick={handleRegenerateSlug}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border hover:bg-muted"
            title="Regenerar do título"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Gerado automaticamente do título. Editável.
        </p>
      </div>

      {/* Featured Image */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Imagem de Capa</Label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 w-full rounded border object-cover"
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
            className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 hover:border-amber-500 hover:text-amber-500"
          >
            <ImageIcon className="mb-1 h-6 w-6" />
            <span className="text-xs">JPEG, PNG, WebP (máx 5MB)</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        {imageError && <p className="text-xs text-red-500">{imageError}</p>}
        {isUploading && (
          <p className="flex items-center gap-1 text-xs text-amber-600">
            <Loader2 className="h-3 w-3 animate-spin" /> Enviando...
          </p>
        )}
        {imagePreview && (
          <div className="space-y-1">
            <Label htmlFor="image-alt" className="text-xs">
              Texto alternativo
            </Label>
            <Input
              id="image-alt"
              value={post.image_alt || ''}
              onChange={(e) => onChange('image_alt', e.target.value)}
              placeholder="Descrição da imagem"
              className="h-8 text-sm"
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Categoria</Label>
        <Select
          value={post.category || undefined}
          onValueChange={(val) => onChange('category', val)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Selecionar categoria" />
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

      {/* Tags */}
      <div className="space-y-1">
        <Label htmlFor="post-tags" className="text-xs font-medium">
          Tags
        </Label>
        <div className="flex flex-wrap gap-1 rounded-md border bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="ml-0.5 hover:text-red-500"
                aria-label={`Remover tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            id="post-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? 'Adicionar tags (Enter ou vírgula)' : ''}
            className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Author */}
      <div className="space-y-1">
        <Label htmlFor="post-author" className="text-xs font-medium">
          Autor
        </Label>
        <Input
          id="post-author"
          value={post.author || 'Cafe Canastra'}
          onChange={(e) => onChange('author', e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Locale */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          Idioma
        </Label>
        <Select
          value={currentLocale}
          onValueChange={(val) => onChange('locale', val)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOCALES.map((loc) => (
              <SelectItem key={loc.value} value={loc.value}>
                {loc.flag} {loc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Translation links */}
        {translations.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Traduções existentes:</p>
            {translations.map((t) => {
              const loc = LOCALES.find((l) => l.value === t.locale)
              return (
                <Link
                  key={t.id}
                  href={`/admin/posts/${t.id}/edit`}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  {loc?.flag || '🌐'} {t.title}
                </Link>
              )
            })}
          </div>
        )}

        {/* Create missing translation buttons */}
        {post.id && post.translation_group_id && missingLocales.length > 0 && (
          <div className="space-y-1">
            {missingLocales.map((loc) => (
              <Link
                key={loc.value}
                href={`/admin/posts/new?translation_group_id=${post.translation_group_id}&locale=${loc.value}`}
                className="flex items-center gap-1.5 text-xs text-amber-600 hover:underline"
              >
                + Criar versão {loc.flag} {loc.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Readonly Metrics */}
      <div className="space-y-2 rounded-md border bg-muted/30 p-3">
        <h4 className="text-xs font-semibold">Métricas</h4>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Tempo de leitura
          </span>
          <span className="font-medium">{readingTime} min de leitura</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            Contagem de palavras
          </span>
          <span className="font-medium">{wordCount.toLocaleString()} palavras</span>
        </div>
      </div>
    </div>
  )
}
