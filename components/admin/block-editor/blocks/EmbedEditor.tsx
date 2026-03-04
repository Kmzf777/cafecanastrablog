'use client'

import React, { useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { EmbedData } from '@/lib/types/block-data'
import { embedDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface EmbedEditorProps {
  data: EmbedData
  onChange: (data: EmbedData) => void
}

function detectProvider(url: string): string {
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return 'youtube'
  if (/instagram\.com\/(p|reel)\//.test(url)) return 'instagram'
  if (/twitter\.com\/|x\.com\//.test(url)) return 'twitter'
  if (/tiktok\.com\/@/.test(url)) return 'tiktok'
  return 'generic'
}

function getEmbedUrl(url: string, provider: string): string | null {
  if (provider === 'youtube') {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }
  return null
}

export function EmbedEditor({ data, onChange }: EmbedEditorProps) {
  const { errors, validate } = useBlockValidation(embedDataSchema)

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value
      const provider = url ? detectProvider(url) : undefined
      onChange({ ...data, url, provider })
    },
    [data, onChange]
  )

  const embedUrl = useMemo(
    () => (data.url && data.provider ? getEmbedUrl(data.url, data.provider) : null),
    [data.url, data.provider]
  )

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">URL de Incorporação</Label>
        <Input
          value={data.url}
          onChange={handleUrlChange}
          onBlur={() => validate(data)}
          placeholder="https://youtube.com/watch?v=..."
          className={errors.url ? 'border-destructive' : ''}
        />
        {errors.url && <p className="text-xs text-destructive mt-1">{errors.url}</p>}
      </div>

      {data.provider && (
        <p className="text-xs text-muted-foreground">
          Detectado: <span className="capitalize font-medium">{data.provider}</span>
        </p>
      )}

      {embedUrl && (
        <div className="aspect-video rounded-md overflow-hidden border">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allowFullScreen
            title="Pré-visualização"
          />
        </div>
      )}

      <div>
        <Label className="text-xs">Legenda (opcional)</Label>
        <Input
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value || undefined })}
          placeholder="Legenda da incorporação..."
        />
      </div>
    </div>
  )
}
