'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { BlockType } from '@/lib/types/blog'
import { BLOCK_TYPE_CONFIG } from './BlockToolbar'

interface SlashCommandProps {
  blockId: string
  onSelect: (blockId: string, newType: BlockType) => void
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
}

export function SlashCommand({ blockId, onSelect, onClose, anchorRef }: SlashCommandProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = BLOCK_TYPE_CONFIG.filter((config) =>
    config.label.toLowerCase().includes(search.toLowerCase()) ||
    config.type.toLowerCase().includes(search.toLowerCase())
  )

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1))
          break
        case 'Enter':
          e.preventDefault()
          if (filtered[selectedIndex]) {
            onSelect(blockId, filtered[selectedIndex].type)
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [blockId, filtered, selectedIndex, onSelect, onClose]
  )

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-64 rounded-md border bg-popover shadow-lg"
    >
      <div className="p-2 border-b">
        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-sm border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Buscar blocos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Nenhum bloco encontrado
          </div>
        ) : (
          filtered.map((config, index) => (
            <button
              key={config.type}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${
                index === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => onSelect(blockId, config.type)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-muted-foreground">{config.icon}</span>
              <span>{config.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{config.category}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
