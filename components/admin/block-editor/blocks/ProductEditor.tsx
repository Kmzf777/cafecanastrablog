'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProductData } from '@/lib/types/block-data'
import { productDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface ProductEditorProps {
  data: ProductData
  onChange: (data: ProductData) => void
}

export function ProductEditor({ data, onChange }: ProductEditorProps) {
  const { errors, validate } = useBlockValidation(productDataSchema)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (json.url) {
          onChange({ ...data, image: json.url })
        }
      } finally {
        setUploading(false)
      }
    },
    [data, onChange]
  )

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-xs">Nome do Produto</Label>
          <Input
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            onBlur={() => validate(data)}
            placeholder="Nome do produto..."
            className={`font-medium ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div className="w-32">
          <Label className="text-xs">Preço</Label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              value={data.price || ''}
              onChange={(e) => onChange({ ...data, price: e.target.value || undefined, currency: 'BRL' })}
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs">Descrição</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value || undefined })}
          placeholder="Descrição do produto..."
          rows={2}
        />
      </div>

      <div>
        <Label className="text-xs">URL do Link</Label>
        <Input
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value || undefined })}
          placeholder="https://..."
        />
      </div>

      {/* Product image */}
      <div>
        <Label className="text-xs">Imagem do Produto</Label>
        {data.image ? (
          <div className="relative group mt-1">
            <img src={data.image} alt={data.name} className="h-32 rounded-md border object-cover" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onChange({ ...data, image: undefined })}
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
              {uploading ? 'Enviando...' : 'Enviar imagem do produto'}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleUpload(f)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
