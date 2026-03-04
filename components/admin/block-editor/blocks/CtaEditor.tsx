'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { CtaData } from '@/lib/types/block-data'
import { ctaDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface CtaEditorProps {
  data: CtaData
  onChange: (data: CtaData) => void
}

const VARIANTS = [
  { value: 'primary', label: 'Primário', cls: 'bg-primary text-primary-foreground' },
  { value: 'secondary', label: 'Secundário', cls: 'bg-secondary text-secondary-foreground' },
  { value: 'outline', label: 'Contorno', cls: 'border-2 border-primary text-primary bg-transparent' },
] as const

export function CtaEditor({ data, onChange }: CtaEditorProps) {
  const { errors, validate } = useBlockValidation(ctaDataSchema)

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Título</Label>
        <Input
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          onBlur={() => validate(data)}
          placeholder="Título da chamada para ação..."
          className={`font-semibold ${errors.text ? 'border-destructive' : ''}`}
        />
        {errors.text && <p className="text-xs text-destructive mt-1">{errors.text}</p>}
      </div>

      <div>
        <Label className="text-xs">Descrição (opcional)</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value || undefined })}
          placeholder="Texto de apoio..."
          rows={2}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-xs">Texto do Botão</Label>
          <Input
            value={data.buttonText}
            onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
            onBlur={() => validate(data)}
            placeholder="Clique aqui"
            className={errors.buttonText ? 'border-destructive' : ''}
          />
          {errors.buttonText && <p className="text-xs text-destructive mt-1">{errors.buttonText}</p>}
        </div>
        <div className="flex-1">
          <Label className="text-xs">URL do Botão</Label>
          <Input
            value={data.buttonUrl}
            onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
            onBlur={() => validate(data)}
            placeholder="https://..."
            className={errors.buttonUrl ? 'border-destructive' : ''}
          />
          {errors.buttonUrl && <p className="text-xs text-destructive mt-1">{errors.buttonUrl}</p>}
        </div>
      </div>

      {/* Style selector with preview */}
      <div>
        <Label className="text-xs">Estilo do Botão</Label>
        <div className="flex gap-2 mt-1">
          {VARIANTS.map((v) => (
            <button
              key={v.value}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all ${v.cls} ${
                (data.variant || 'primary') === v.value ? 'ring-2 ring-offset-2 ring-primary' : 'opacity-70'
              }`}
              onClick={() => onChange({ ...data, variant: v.value as CtaData['variant'] })}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
