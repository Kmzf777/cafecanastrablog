'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Upload, X, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ImageData } from '@/lib/types/block-data'
import { imageDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface ImageEditorProps {
  data: ImageData
  onChange: (data: ImageData) => void
}

export function ImageEditor({ data, onChange }: ImageEditorProps) {
  const { errors, validate } = useBlockValidation(imageDataSchema)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef(data)
  dataRef.current = data

  const handleUpload = useCallback(
    async (file: File) => {
      // Client-side validation
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Arquivo muito grande (máx 5MB)')
        return
      }
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) {
        setUploadError('Tipo não permitido. Use JPEG, PNG ou WebP.')
        return
      }

      setUploading(true)
      setUploadError(null)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const json = await res.json()

        if (!res.ok) {
          setUploadError(json.error || `Erro no upload (${res.status})`)
          return
        }

        if (!json.url) {
          setUploadError('Resposta inválida do servidor')
          return
        }

        onChange({ ...dataRef.current, src: json.url })
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Falha na conexão com o servidor')
      } finally {
        setUploading(false)
        // Reset file input so the same file can be re-selected
        if (fileRef.current) fileRef.current.value = ''
      }
    },
    [onChange]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleUpload(file)
    },
    [handleUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const file = e.dataTransfer.files?.[0]
      if (file) handleUpload(file)
    },
    [handleUpload]
  )

  const handleClickUpload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    fileRef.current?.click()
  }, [])

  return (
    <div className="space-y-3">
      {data.src ? (
        <div className="relative group">
          <img
            src={data.src}
            alt={data.alt || ''}
            className="max-h-64 rounded-md border object-contain"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onChange({ ...data, src: '' })
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 p-8 cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={handleClickUpload}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDrop={handleDrop}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
              <p className="text-sm text-amber-600">Enviando...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique ou arraste uma imagem aqui
              </p>
              <p className="text-xs text-muted-foreground">JPEG, PNG ou WebP (máx 5MB)</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {uploadError && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3 shrink-0" /> {uploadError}
        </p>
      )}

      <div>
        <Label className="text-xs">Texto Alt (obrigatório para SEO)</Label>
        <Input
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          onBlur={() => validate(data)}
          placeholder="Descreva a imagem..."
          className={errors.alt ? 'border-destructive' : ''}
        />
        {!data.alt && data.src && (
          <p className="flex items-center gap-1 text-xs text-amber-600 mt-1">
            <AlertTriangle className="h-3 w-3" /> Texto alt é recomendado para acessibilidade e SEO
          </p>
        )}
        {errors.alt && <p className="text-xs text-destructive mt-1">{errors.alt}</p>}
      </div>

      <div>
        <Label className="text-xs">Legenda (opcional)</Label>
        <Input
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value || undefined })}
          placeholder="Legenda da imagem..."
        />
      </div>
    </div>
  )
}
