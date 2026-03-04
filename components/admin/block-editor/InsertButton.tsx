'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import type { BlockType } from '@/lib/types/blog'
import { BLOCK_TYPE_CONFIG } from './BlockToolbar'

interface InsertButtonProps {
  position: number
  onInsert: (type: BlockType, position: number) => void
}

export function InsertButton({ position, onInsert }: InsertButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="group/insert relative flex items-center justify-center py-0.5">
      {/* Hover line */}
      <div className="absolute inset-x-0 h-px bg-transparent group-hover/insert:bg-primary/30 transition-colors" />

      {/* Plus button */}
      <button
        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 group-hover/insert:opacity-100 hover:border-primary hover:text-primary transition-all"
        onClick={() => setShowMenu(!showMenu)}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>

      {/* Quick insert dropdown */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 w-64 rounded-md border bg-popover p-2 shadow-lg">
            <div className="grid grid-cols-4 gap-1">
              {BLOCK_TYPE_CONFIG.filter((b) => b.primary).map((config) => (
                <button
                  key={config.type}
                  className="flex flex-col items-center gap-1 rounded-md p-2 text-xs hover:bg-accent transition-colors"
                  onClick={() => {
                    onInsert(config.type, position)
                    setShowMenu(false)
                  }}
                >
                  <span className="text-muted-foreground">{config.icon}</span>
                  <span className="truncate">{config.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
