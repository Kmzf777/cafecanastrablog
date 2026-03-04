'use client'

import { useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SemanticEntity } from '@/lib/types/blog'

const ENTITY_TYPES = ['Thing', 'Place', 'Product', 'Organization', 'Person'] as const

interface EntitySelectorProps {
  entities: SemanticEntity[]
  onChange: (entities: SemanticEntity[]) => void
}

interface EntityFormState {
  name: string
  type: string
  sameAs: string
  description: string
}

const EMPTY_FORM: EntityFormState = { name: '', type: 'Thing', sameAs: '', description: '' }

export function EntitySelector({ entities, onChange }: EntitySelectorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<EntityFormState>(EMPTY_FORM)

  const handleSave = useCallback(() => {
    if (!form.name.trim()) return

    const entity: SemanticEntity = {
      name: form.name.trim(),
      type: form.type,
      ...(form.description.trim() && { description: form.description.trim() }),
      ...(form.sameAs.trim() && { sameAs: [form.sameAs.trim()] }),
    }

    if (editingIndex !== null) {
      const updated = [...entities]
      updated[editingIndex] = entity
      onChange(updated)
      setEditingIndex(null)
    } else {
      onChange([...entities, entity])
      setIsAdding(false)
    }
    setForm(EMPTY_FORM)
  }, [form, editingIndex, entities, onChange])

  const handleEdit = useCallback((index: number) => {
    const entity = entities[index]
    setForm({
      name: entity.name,
      type: entity.type,
      sameAs: entity.sameAs?.[0] || '',
      description: entity.description || '',
    })
    setEditingIndex(index)
    setIsAdding(false)
  }, [entities])

  const handleDelete = useCallback((index: number) => {
    onChange(entities.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
      setForm(EMPTY_FORM)
    }
  }, [entities, editingIndex, onChange])

  const handleCancel = useCallback(() => {
    setEditingIndex(null)
    setIsAdding(false)
    setForm(EMPTY_FORM)
  }, [])

  const handleStartAdd = useCallback(() => {
    setIsAdding(true)
    setEditingIndex(null)
    setForm(EMPTY_FORM)
  }, [])

  const showForm = isAdding || editingIndex !== null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Entidades Semânticas ({entities.length})
        </h4>
        {!showForm && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="h-3 w-3" />
            Adicionar Entidade
          </button>
        )}
      </div>

      {/* Entity List */}
      {entities.length > 0 && (
        <div className="space-y-1">
          {entities.map((entity, index) => (
            <div
              key={index}
              className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 text-sm ${
                editingIndex === index ? 'border-primary bg-primary/5' : 'bg-muted/30'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium">{entity.name}</span>
                <span className="ml-1.5 text-xs text-muted-foreground">({entity.type})</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="space-y-2 rounded-md border border-dashed p-2.5">
          <div className="space-y-1">
            <Label className="text-xs">Nome *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Serra da Canastra"
              className="h-7 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Tipo</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger className="h-7 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTITY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">URL sameAs</Label>
            <Input
              value={form.sameAs}
              onChange={(e) => setForm((f) => ({ ...f, sameAs: e.target.value }))}
              placeholder="https://www.wikidata.org/wiki/Q..."
              className="h-7 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Descrição</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Breve descrição"
              className="h-7 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-3 w-3" />
              {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs hover:bg-muted"
            >
              <X className="h-3 w-3" />
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
