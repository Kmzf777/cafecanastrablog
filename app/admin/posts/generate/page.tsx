'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, ArrowLeft, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

const THEME_MIN = 10
const THEME_MAX = 500

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [theme, setTheme] = useState('')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const themeLength = theme.length
  const isThemeValid = themeLength >= THEME_MIN && themeLength <= THEME_MAX
  const canSubmit = isThemeValid && !urlError && !isGenerating

  const handleUrlBlur = useCallback(() => {
    if (url.trim() === '') {
      setUrlError('')
      return
    }
    if (!isValidUrl(url.trim())) {
      setUrlError('URL invalida. Use o formato https://exemplo.com')
    } else {
      setUrlError('')
    }
  }, [url])

  const handleGenerate = useCallback(async () => {
    if (!canSubmit) return

    setIsGenerating(true)

    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme.trim(),
          url: url.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar conteudo.')
      }

      router.push(`/admin/posts/generate/preview?postId=${data.postId}`)
    } catch (error) {
      toast({
        title: 'Erro na geracao',
        description: error instanceof Error ? error.message : 'Erro desconhecido. Tente novamente.',
        variant: 'destructive',
      })
      setIsGenerating(false)
    }
  }, [canSubmit, theme, url, router, toast])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar ao painel
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerar Post com IA
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Informe um tema e, opcionalmente, uma URL de referencia para gerar um post completo.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          {/* Theme */}
          <div className="mb-6">
            <label htmlFor="theme" className="mb-2 block text-sm font-medium text-gray-700">
              Tema do post *
            </label>
            <Textarea
              id="theme"
              placeholder="Ex: Processo de torra do cafe especial na Serra da Canastra"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={isGenerating}
              className="min-h-[100px] resize-y"
              maxLength={THEME_MAX}
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {themeLength < THEME_MIN
                  ? `Minimo ${THEME_MIN} caracteres`
                  : 'Descreva o tema com detalhes para melhores resultados'}
              </p>
              <span
                className={`text-xs ${
                  themeLength > THEME_MAX
                    ? 'text-red-500'
                    : themeLength >= THEME_MIN
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`}
              >
                {themeLength}/{THEME_MAX}
              </span>
            </div>
          </div>

          {/* URL */}
          <div className="mb-6">
            <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
              <LinkIcon className="mr-1 inline h-3.5 w-3.5" />
              URL de referencia
              <span className="ml-2 text-xs font-normal text-gray-400">(opcional)</span>
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://exemplo.com/artigo-sobre-cafe"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (urlError) setUrlError('')
              }}
              onBlur={handleUrlBlur}
              disabled={isGenerating}
            />
            {urlError && (
              <p className="mt-1 text-xs text-red-500">{urlError}</p>
            )}
            {!urlError && (
              <p className="mt-1 text-xs text-gray-500">
                A IA usara o conteudo da URL como contexto adicional.
              </p>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando seu post...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
