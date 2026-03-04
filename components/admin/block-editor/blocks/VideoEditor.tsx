'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { VideoData } from '@/lib/types/block-data'
import { videoDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface VideoEditorProps {
  data: VideoData
  onChange: (data: VideoData) => void
}

export function VideoEditor({ data, onChange }: VideoEditorProps) {
  const { errors, validate } = useBlockValidation(videoDataSchema)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePosterUpload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (json.url) {
          onChange({ ...data, thumbnail: json.url })
        }
      } finally {
        setUploading(false)
      }
    },
    [data, onChange]
  )

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">URL do Vídeo</Label>
        <Input
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          onBlur={() => validate(data)}
          placeholder="https://youtube.com/watch?v=..."
          className={errors.url ? 'border-destructive' : ''}
        />
        {errors.url && <p className="text-xs text-destructive mt-1">{errors.url}</p>}
      </div>

      <div>
        <Label className="text-xs">Título (opcional)</Label>
        <Input
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value || undefined })}
          placeholder="Título do vídeo..."
        />
      </div>

      {/* Poster image */}
      <div>
        <Label className="text-xs">Imagem de Capa (opcional)</Label>
        {data.thumbnail ? (
          <div className="relative group mt-1">
            <img src={data.thumbnail} alt="Poster" className="h-32 rounded-md border object-cover" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onChange({ ...data, thumbnail: undefined })}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 p-3 cursor-pointer hover:border-muted-foreground/50 transition-colors mt-1"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {uploading ? 'Enviando...' : 'Enviar imagem de capa'}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handlePosterUpload(f)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
