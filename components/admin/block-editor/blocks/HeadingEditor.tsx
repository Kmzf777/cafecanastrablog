'use client'

import React, { useCallback } from 'react'
import slugify from 'slugify'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { HeadingData } from '@/lib/types/block-data'
import { headingDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface HeadingEditorProps {
  data: HeadingData
  onChange: (data: HeadingData) => void
}

const LEVELS = [1, 2, 3, 4, 5, 6] as const

export function HeadingEditor({ data, onChange }: HeadingEditorProps) {
  const { errors, validate } = useBlockValidation(headingDataSchema)

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value
      const anchor = text.trim() ? slugify(text, { lower: true, strict: true }) : undefined
      const next = { ...data, text, anchor }
      onChange(next)
    },
    [data, onChange]
  )

  const handleLevelChange = useCallback(
    (value: string) => {
      const next = { ...data, level: Number(value) as HeadingData['level'] }
      onChange(next)
    },
    [data, onChange]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="w-24">
          <Label className="text-xs">Nível</Label>
          <Select value={String(data.level)} onValueChange={handleLevelChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={String(l)}>
                  H{l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label className="text-xs">Texto do Título</Label>
          <Input
            value={data.text}
            onChange={handleTextChange}
            onBlur={() => validate(data)}
            placeholder="Digite o texto do título..."
            className={`text-lg font-semibold ${errors.text ? 'border-destructive' : ''}`}
          />
          {errors.text && <p className="text-xs text-destructive mt-1">{errors.text}</p>}
        </div>
      </div>
      {data.anchor && (
        <p className="text-xs text-muted-foreground">
          Anchor: <code className="bg-muted px-1 rounded">#{data.anchor}</code>
        </p>
      )}
    </div>
  )
}
