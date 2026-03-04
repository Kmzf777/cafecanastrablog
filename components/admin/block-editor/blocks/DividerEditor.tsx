'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import type { DividerData } from '@/lib/types/block-data'

interface DividerEditorProps {
  data: DividerData
  onChange: (data: DividerData) => void
}

const STYLES = [
  { value: 'solid', label: 'Linha', preview: 'border-t-2 border-solid border-foreground/30' },
  { value: 'dotted', label: 'Pontos', preview: 'border-t-2 border-dotted border-foreground/30' },
  { value: 'dashed', label: 'Tracejado', preview: 'border-t-2 border-dashed border-foreground/30' },
  { value: 'ornamental', label: 'Espaço', preview: '' },
] as const

export function DividerEditor({ data, onChange }: DividerEditorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs">Estilo</Label>
      <div className="flex gap-2">
        {STYLES.map((s) => (
          <button
            key={s.value}
            className={`flex-1 rounded-md border p-3 text-center transition-colors ${
              (data.style || 'solid') === s.value
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'hover:border-muted-foreground/50'
            }`}
            onClick={() => onChange({ style: s.value as DividerData['style'] })}
          >
            <div className="h-4 flex items-center justify-center">
              {s.preview ? <div className={`w-full ${s.preview}`} /> : <span className="text-xs text-muted-foreground">···</span>}
            </div>
            <span className="text-xs mt-1 block">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
