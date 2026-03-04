'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Upload, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GalleryData } from '@/lib/types/block-data'

interface GalleryEditorProps {
  data: GalleryData
  onChange: (data: GalleryData) => void
}

export function GalleryEditor({ data, onChange }: GalleryEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (files: FileList) => {
      setUploading(true)
      try {
        const newImages = [...data.images]
        for (const file of Array.from(files)) {
          const formData = new FormData()
          formData.append('file', file)
          const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
          const json = await res.json()
          if (json.url) {
            newImages.push({ src: json.url, alt: '', caption: undefined })
          }
        }
        onChange({ ...data, images: newImages })
      } finally {
        setUploading(false)
      }
    },
    [data, onChange]
  )

  const removeImage = useCallback(
    (idx: number) => {
      const images = data.images.filter((_, i) => i !== idx)
      onChange({ ...data, images })
    },
    [data, onChange]
  )

  const updateImageAlt = useCallback(
    (idx: number, alt: string) => {
      const images = data.images.map((img, i) => (i === idx ? { ...img, alt } : img))
      onChange({ ...data, images })
    },
    [data, onChange]
  )

  const handleDragStart = useCallback((idx: number) => setDragIdx(idx), [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, overIdx: number) => {
      e.preventDefault()
      if (dragIdx === null || dragIdx === overIdx) return
      const images = [...data.images]
      const [moved] = images.splice(dragIdx, 1)
      images.splice(overIdx, 0, moved)
      onChange({ ...data, images })
      setDragIdx(overIdx)
    },
    [dragIdx, data, onChange]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="w-32">
          <Label className="text-xs">Layout</Label>
          <Select
            value={data.layout || 'grid'}
            onValueChange={(v) => onChange({ ...data, layout: v as GalleryData['layout'] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grade</SelectItem>
              <SelectItem value="carousel">Carrossel</SelectItem>
              <SelectItem value="masonry">Mosaico</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-24">
          <Label className="text-xs">Colunas</Label>
          <Select
            value={String(data.columns || 3)}
            onValueChange={(v) => onChange({ ...data, columns: Number(v) as GalleryData['columns'] })}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 gap-2">
        {data.images.map((img, idx) => (
          <div
            key={idx}
            className="relative group border rounded-md overflow-hidden"
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDragIdx(null)}
          >
            <img src={img.src} alt={img.alt} className="h-24 w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <GripVertical className="h-4 w-4 text-white cursor-grab" />
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeImage(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Input
              className="h-7 text-xs rounded-none border-0 border-t"
              placeholder="Texto alt..."
              value={img.alt}
              onChange={(e) => updateImageAlt(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div
        className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 p-4 cursor-pointer hover:border-muted-foreground/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files)
        }}
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {uploading ? 'Enviando...' : 'Adicionar imagens'}
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>
    </div>
  )
}
