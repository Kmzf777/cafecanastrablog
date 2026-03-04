'use client'

import React, { useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TableData } from '@/lib/types/block-data'
import { tableDataSchema } from '@/lib/schemas/block-validation'
import { useBlockValidation } from '../useBlockValidation'

interface TableEditorProps {
  data: TableData
  onChange: (data: TableData) => void
}

export function TableEditor({ data, onChange }: TableEditorProps) {
  const { errors, validate } = useBlockValidation(tableDataSchema)
  const colCount = data.headers.length

  const updateHeader = useCallback(
    (idx: number, value: string) => {
      const headers = data.headers.map((h, i) => (i === idx ? value : h))
      onChange({ ...data, headers })
    },
    [data, onChange]
  )

  const updateCell = useCallback(
    (rowIdx: number, colIdx: number, value: string) => {
      const rows = data.rows.map((row, ri) =>
        ri === rowIdx ? row.map((cell, ci) => (ci === colIdx ? value : cell)) : row
      )
      onChange({ ...data, rows })
    },
    [data, onChange]
  )

  const addRow = useCallback(() => {
    onChange({ ...data, rows: [...data.rows, Array(colCount).fill('')] })
  }, [data, colCount, onChange])

  const removeRow = useCallback(
    (idx: number) => {
      if (data.rows.length <= 1) return
      onChange({ ...data, rows: data.rows.filter((_, i) => i !== idx) })
    },
    [data, onChange]
  )

  const addColumn = useCallback(() => {
    onChange({
      ...data,
      headers: [...data.headers, ''],
      rows: data.rows.map((row) => [...row, '']),
    })
  }, [data, onChange])

  const removeColumn = useCallback(
    (idx: number) => {
      if (colCount <= 2) return
      onChange({
        ...data,
        headers: data.headers.filter((_, i) => i !== idx),
        rows: data.rows.map((row) => row.filter((_, i) => i !== idx)),
      })
    },
    [data, colCount, onChange]
  )

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {data.headers.map((header, ci) => (
                <th key={ci} className="relative border p-0">
                  <Input
                    className="h-8 rounded-none border-0 font-semibold text-xs"
                    value={header}
                    onChange={(e) => updateHeader(ci, e.target.value)}
                    onBlur={() => validate(data)}
                    placeholder={`Header ${ci + 1}`}
                  />
                  {colCount > 2 && (
                    <button
                      className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100"
                      onClick={() => removeColumn(ci)}
                    >
                      ×
                    </button>
                  )}
                </th>
              ))}
              <th className="w-8 border p-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addColumn}>
                  <Plus className="h-3 w-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border p-0">
                    <Input
                      className="h-8 rounded-none border-0 text-xs"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      placeholder="..."
                    />
                  </td>
                ))}
                <td className="w-8 border p-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(ri)}
                    disabled={data.rows.length <= 1}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addRow}>
        <Plus className="h-3 w-3 mr-1" /> Adicionar Linha
      </Button>

      {errors.headers && <p className="text-xs text-destructive">{errors.headers}</p>}
      {errors.rows && <p className="text-xs text-destructive">{errors.rows}</p>}

      <div>
        <Label className="text-xs">Legenda (opcional)</Label>
        <Input
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value || undefined })}
          placeholder="Legenda da tabela..."
        />
      </div>
    </div>
  )
}
