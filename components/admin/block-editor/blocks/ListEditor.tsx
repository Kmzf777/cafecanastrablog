'use client'

import React, { useCallback } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ListData } from '@/lib/types/block-data'
import { listDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface ListEditorProps {
  data: ListData
  onChange: (data: ListData) => void
}

export function ListEditor({ data, onChange }: ListEditorProps) {
  const { errors, validate } = useBlockValidation(listDataSchema)
  const [dragIdx, setDragIdx] = React.useState<number | null>(null)

  const toggleStyle = useCallback(() => {
    onChange({ ...data, style: data.style === 'ordered' ? 'unordered' : 'ordered' })
  }, [data, onChange])

  const updateItem = useCallback(
    (idx: number, value: string) => {
      const items = data.items.map((item, i) => (i === idx ? value : item))
      onChange({ ...data, items })
    },
    [data, onChange]
  )

  const addItem = useCallback(() => {
    onChange({ ...data, items: [...data.items, ''] })
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
      <div className="flex items-center gap-2">
        <Label className="text-xs">Estilo:</Label>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={toggleStyle}>
          {data.style === 'ordered' ? '1. Ordenada' : '• Não ordenada'}
        </Button>
      </div>

      <div className="space-y-1">
        {data.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1"
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDragIdx(null)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
            <span className="text-xs text-muted-foreground w-5 shrink-0">
              {data.style === 'ordered' ? `${idx + 1}.` : '•'}
            </span>
            <Input
              className="h-8 text-sm"
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              onBlur={() => validate(data)}
              placeholder="Item da lista..."
            />
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
      </div>

      {errors.items && <p className="text-xs text-destructive">{errors.items}</p>}

      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addItem}>
        <Plus className="h-3 w-3 mr-1" /> Adicionar Item
      </Button>
    </div>
  )
}
