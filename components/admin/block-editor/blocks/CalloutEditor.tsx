'use client'

import React from 'react'
import { Info, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CalloutData } from '@/lib/types/block-data'
import { calloutDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface CalloutEditorProps {
  data: CalloutData
  onChange: (data: CalloutData) => void
}

const VARIANTS = [
  { value: 'info', label: 'Info', color: 'bg-blue-50 border-blue-300 text-blue-800', icon: Info },
  { value: 'warning', label: 'Aviso', color: 'bg-amber-50 border-amber-300 text-amber-800', icon: AlertTriangle },
  { value: 'tip', label: 'Dica', color: 'bg-emerald-50 border-emerald-300 text-emerald-800', icon: Lightbulb },
  { value: 'success', label: 'Sucesso', color: 'bg-green-50 border-green-300 text-green-800', icon: CheckCircle },
] as const

export function CalloutEditor({ data, onChange }: CalloutEditorProps) {
  const { errors, validate } = useBlockValidation(calloutDataSchema)
  const current = VARIANTS.find((v) => v.value === (data.variant || 'info')) || VARIANTS[0]
  const IconComponent = current.icon

  return (
    <div className={`space-y-3 rounded-md border-l-4 p-3 ${current.color}`}>
      {/* Variant selector */}
      <div className="flex gap-1">
        {VARIANTS.map((v) => {
          const Icon = v.icon
          return (
            <button
              key={v.value}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                data.variant === v.value || (!data.variant && v.value === 'info')
                  ? 'bg-white/80 shadow-sm font-medium'
                  : 'hover:bg-white/50'
              }`}
              onClick={() => onChange({ ...data, variant: v.value as CalloutData['variant'] })}
            >
              <Icon className="h-3 w-3" />
              {v.label}
            </button>
          )
        })}
      </div>

      <div>
        <Label className="text-xs">Conteúdo</Label>
        <Textarea
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          onBlur={() => validate(data)}
          placeholder="Conteúdo do destaque..."
          className={`bg-white/50 ${errors.text ? 'border-destructive' : ''}`}
          rows={2}
        />
        {errors.text && <p className="text-xs text-destructive mt-1">{errors.text}</p>}
      </div>

      <div>
        <Label className="text-xs">URL da Fonte (opcional, para citações)</Label>
        <Input
          value={data.icon || ''}
          onChange={(e) => onChange({ ...data, icon: e.target.value || undefined })}
          placeholder="https://source-url..."
          className="bg-white/50"
        />
      </div>
    </div>
  )
}
