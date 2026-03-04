'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Copy,
  ChevronUp,
  ChevronDown,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContentBlock, BlockType } from '@/lib/types/blog'
import type { BlockData } from '@/lib/types/block-data'
import { blockRegistry } from './blockRegistry'

interface BlockWrapperProps {
  block: ContentBlock
  onUpdate: (id: string, data: BlockData) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onSlashCommand?: (blockId: string) => void
  isFirst: boolean
  isLast: boolean
  isFocused: boolean
  onFocus: (id: string) => void
}

function BlockWrapperInner({
  block,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onSlashCommand,
  isFirst,
  isLast,
  isFocused,
  onFocus,
}: BlockWrapperProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex gap-1 rounded-lg border bg-card p-2 transition-colors ${
        isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-muted-foreground/30'
      } ${isDragging ? 'z-50 shadow-lg' : ''}`}
      onClick={() => onFocus(block.id)}
    >
      {/* Drag handle */}
      <div
        className="flex flex-col items-center gap-0.5 pt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Block content area */}
      <div className="flex-1 min-w-0">
        {/* Block type indicator */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-muted-foreground">
            {React.createElement(blockRegistry[block.type].icon, { className: 'h-3.5 w-3.5' })}
          </span>
          <span className="text-xs text-muted-foreground capitalize">{blockRegistry[block.type].label}</span>
        </div>

        {/* Block editor */}
        {React.createElement(blockRegistry[block.type].editor, {
          data: block.data,
          onChange: (data: BlockData) => onUpdate(block.id, data),
          ...(block.type === 'paragraph' && onSlashCommand
            ? { onSlashCommand: () => onSlashCommand(block.id) }
            : {}),
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Context menu */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-50 w-40 rounded-md border bg-popover p-1 shadow-md">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(block.id)
                  setMenuOpen(false)
                }}
              >
                <Copy className="h-3.5 w-3.5" /> Duplicar
              </button>
              {!isFirst && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveUp(block.id)
                    setMenuOpen(false)
                  }}
                >
                  <ChevronUp className="h-3.5 w-3.5" /> Mover Acima
                </button>
              )}
              {!isLast && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveDown(block.id)
                    setMenuOpen(false)
                  }}
                >
                  <ChevronDown className="h-3.5 w-3.5" /> Mover Abaixo
                </button>
              )}
              <div className="my-1 h-px bg-border" />
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(block.id)
                  setMenuOpen(false)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </button>
            </div>
          )}
        </div>

        {/* Quick delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(block.id)
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

export const BlockWrapper = React.memo(BlockWrapperInner)
