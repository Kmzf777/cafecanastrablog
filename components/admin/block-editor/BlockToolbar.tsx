'use client'

import React, { useState } from 'react'
import {
  Type,
  Image,
  Quote,
  List,
  Code,
  Link,
  Minus,
  MessageSquare,
  Table,
  HelpCircle,
  MousePointer,
  Video,
  ChevronRight,
  Package,
  LayoutGrid,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlockType } from '@/lib/types/blog'

interface BlockTypeConfig {
  type: BlockType
  label: string
  icon: React.ReactNode
  category: 'Texto' | 'Mídia' | 'Dados' | 'Ação'
  primary: boolean
}

export const BLOCK_TYPE_CONFIG: BlockTypeConfig[] = [
  { type: 'heading', label: 'Título', icon: <Type className="h-4 w-4" />, category: 'Texto', primary: true },
  { type: 'paragraph', label: 'Parágrafo', icon: <Type className="h-4 w-4" />, category: 'Texto', primary: true },
  { type: 'image', label: 'Imagem', icon: <Image className="h-4 w-4" />, category: 'Mídia', primary: true },
  { type: 'quote', label: 'Citação', icon: <Quote className="h-4 w-4" />, category: 'Texto', primary: true },
  { type: 'list', label: 'Lista', icon: <List className="h-4 w-4" />, category: 'Texto', primary: true },
  { type: 'divider', label: 'Divisor', icon: <Minus className="h-4 w-4" />, category: 'Texto', primary: true },
  { type: 'faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" />, category: 'Dados', primary: true },
  { type: 'embed', label: 'Incorporar', icon: <Link className="h-4 w-4" />, category: 'Mídia', primary: true },
  // Não-primários (mostrados em "Mais")
  { type: 'gallery', label: 'Galeria', icon: <LayoutGrid className="h-4 w-4" />, category: 'Mídia', primary: false },
  { type: 'code', label: 'Código', icon: <Code className="h-4 w-4" />, category: 'Texto', primary: false },
  { type: 'callout', label: 'Destaque', icon: <AlertCircle className="h-4 w-4" />, category: 'Texto', primary: false },
  { type: 'table', label: 'Tabela', icon: <Table className="h-4 w-4" />, category: 'Dados', primary: false },
  { type: 'cta', label: 'CTA', icon: <MousePointer className="h-4 w-4" />, category: 'Ação', primary: false },
  { type: 'video', label: 'Vídeo', icon: <Video className="h-4 w-4" />, category: 'Mídia', primary: false },
  { type: 'accordion', label: 'Acordeão', icon: <ChevronRight className="h-4 w-4" />, category: 'Dados', primary: false },
  { type: 'product', label: 'Produto', icon: <Package className="h-4 w-4" />, category: 'Ação', primary: false },
]

const CATEGORIES = ['Texto', 'Mídia', 'Dados', 'Ação'] as const

interface BlockToolbarProps {
  onInsert: (type: BlockType, position: number) => void
  totalBlocks: number
}

export function BlockToolbar({ onInsert, totalBlocks }: BlockToolbarProps) {
  const [moreOpen, setMoreOpen] = useState(false)

  const primaryBlocks = BLOCK_TYPE_CONFIG.filter((b) => b.primary)
  const secondaryBlocks = BLOCK_TYPE_CONFIG.filter((b) => !b.primary)

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-muted/50 p-2">
      {/* Primary block type buttons */}
      {primaryBlocks.map((config) => (
        <Button
          key={config.type}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => onInsert(config.type, totalBlocks)}
        >
          {config.icon}
          {config.label}
        </Button>
      ))}

      {/* More button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => setMoreOpen(!moreOpen)}
        >
          Mais
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
        </Button>

        {moreOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
            <div className="absolute bottom-full left-0 z-50 mb-1 w-72 rounded-md border bg-popover p-3 shadow-lg">
              {CATEGORIES.map((category) => {
                const items = secondaryBlocks.filter((b) => b.category === category)
                if (items.length === 0) return null
                return (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">{category}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {items.map((config) => (
                        <button
                          key={config.type}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                          onClick={() => {
                            onInsert(config.type, totalBlocks)
                            setMoreOpen(false)
                          }}
                        >
                          <span className="text-muted-foreground">{config.icon}</span>
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
