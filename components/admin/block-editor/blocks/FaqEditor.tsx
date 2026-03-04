'use client'

import React, { useCallback } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FaqData } from '@/lib/types/block-data'
import { faqDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface FaqEditorProps {
  data: FaqData
  onChange: (data: FaqData) => void
}

export function FaqEditor({ data, onChange }: FaqEditorProps) {
  const { errors, validate } = useBlockValidation(faqDataSchema)
  const [dragIdx, setDragIdx] = React.useState<number | null>(null)

  const updateItem = useCallback(
    (idx: number, field: 'question' | 'answer', value: string) => {
      const items = data.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
      onChange({ ...data, items })
    },
    [data, onChange]
  )

  const addItem = useCallback(() => {
    onChange({ ...data, items: [...data.items, { question: '', answer: '' }] })
  }, [data, onChange])

  const removeItem = useCallback(
    (idx: number) => {
      if (data.items.length <= 1) return
      onChange({ ...data, items: data.items.filter((_, i) => i !== idx) })
    },
    [data, onChange]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent, overIdx: number) => {
      e.preventDefault()
      if (dragIdx === null || dragIdx === overIdx) return
      const items = [...data.items]
      const [moved] = items.splice(dragIdx, 1)
      items.splice(overIdx, 0, moved)
      onChange({ ...data, items })
      setDragIdx(overIdx)
    },
    [dragIdx, data, onChange]
  )

  return (
    <div className="space-y-3">
      {data.items.map((item, idx) => (
        <div
          key={idx}
          className="flex gap-2 rounded-md border p-3"
          draggable
          onDragStart={() => setDragIdx(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={() => setDragIdx(null)}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0 mt-2" />
          <div className="flex-1 space-y-2">
            <div>
              <Label className="text-xs">Pergunta {idx + 1}</Label>
              <Input
                value={item.question}
                onChange={(e) => updateItem(idx, 'question', e.target.value)}
                onBlur={() => validate(data)}
                placeholder="Pergunta frequente..."
                className="font-medium"
              />
            </div>
            <div>
              <Label className="text-xs">Resposta</Label>
              <Textarea
                value={item.answer}
                onChange={(e) => updateItem(idx, 'answer', e.target.value)}
                onBlur={() => validate(data)}
                placeholder="Resposta..."
                rows={2}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => removeItem(idx)}
            disabled={data.items.length <= 1}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      {errors.items && <p className="text-xs text-destructive">{errors.items}</p>}

      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addItem}>
        <Plus className="h-3 w-3 mr-1" /> Adicionar Pergunta e Resposta
      </Button>
    </div>
  )
}
