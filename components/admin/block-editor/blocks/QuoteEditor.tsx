'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { QuoteData } from '@/lib/types/block-data'
import { quoteDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface QuoteEditorProps {
  data: QuoteData
  onChange: (data: QuoteData) => void
}

export function QuoteEditor({ data, onChange }: QuoteEditorProps) {
  const { errors, validate } = useBlockValidation(quoteDataSchema)

  return (
    <div className="space-y-3 border-l-4 border-muted-foreground/30 pl-4">
      <div>
        <Label className="text-xs">Citação</Label>
        <Textarea
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          onBlur={() => validate(data)}
          placeholder="Digite o texto da citação..."
          className={`italic ${errors.text ? 'border-destructive' : ''}`}
          rows={3}
        />
        {errors.text && <p className="text-xs text-destructive mt-1">{errors.text}</p>}
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-xs">Autor</Label>
          <Input
            value={data.citation || ''}
            onChange={(e) => onChange({ ...data, citation: e.target.value || undefined })}
            placeholder="Nome do autor..."
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs">URL da Fonte (recomendado para GEO)</Label>
          <Input
            value={data.url || ''}
            onChange={(e) => onChange({ ...data, url: e.target.value || undefined })}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  )
}
