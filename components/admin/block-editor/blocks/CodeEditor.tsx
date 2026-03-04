'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CodeData } from '@/lib/types/block-data'
import { codeDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface CodeEditorProps {
  data: CodeData
  onChange: (data: CodeData) => void
}

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'sql', 'bash', 'json', 'html', 'css', 'other',
]

export function CodeEditor({ data, onChange }: CodeEditorProps) {
  const { errors, validate } = useBlockValidation(codeDataSchema)

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="w-40">
          <Label className="text-xs">Linguagem</Label>
          <Select
            value={data.language || ''}
            onValueChange={(v) => onChange({ ...data, language: v })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label className="text-xs">Nome do arquivo (opcional)</Label>
          <Input
            value={data.filename || ''}
            onChange={(e) => onChange({ ...data, filename: e.target.value || undefined })}
            placeholder="example.ts"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Código</Label>
        <Textarea
          value={data.code}
          onChange={(e) => onChange({ ...data, code: e.target.value })}
          onBlur={() => validate(data)}
          placeholder="Cole ou digite o código aqui..."
          className={`font-mono text-sm min-h-[120px] ${errors.code ? 'border-destructive' : ''}`}
          rows={6}
        />
        {errors.code && <p className="text-xs text-destructive mt-1">{errors.code}</p>}
      </div>
    </div>
  )
}
