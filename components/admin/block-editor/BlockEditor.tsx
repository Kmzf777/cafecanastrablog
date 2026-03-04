'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react'
import type { ContentBlock, BlockType } from '@/lib/types/blog'
import { useBlockReducer } from './useBlockReducer'
import { useAutoSave, type SaveStatus } from './useAutoSave'
import { useEditorShortcuts } from './useEditorShortcuts'
import { BlockWrapper } from './BlockWrapper'
import { BlockToolbar } from './BlockToolbar'
import { InsertButton } from './InsertButton'
import { SlashCommand } from './SlashCommand'

interface BlockEditorProps {
  initialBlocks?: ContentBlock[]
  postId?: string
  onChange?: (blocks: ContentBlock[]) => void
}

const SAVE_STATUS_CONFIG: Record<SaveStatus, { icon: React.ReactNode; label: string }> = {
  idle: { icon: <Cloud className="h-3.5 w-3.5" />, label: '' },
  saving: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, label: 'Salvando...' },
  saved: { icon: <Check className="h-3.5 w-3.5 text-green-500" />, label: 'Salvo' },
  error: { icon: <CloudOff className="h-3.5 w-3.5 text-destructive" />, label: 'Erro' },
}

export function BlockEditor({ initialBlocks = [], postId, onChange }: BlockEditorProps) {
  const {
    blocks,
    addBlock,
    removeBlock,
    updateBlock,
    reorderBlocks,
    duplicateBlock,
    setBlocks,
    moveBlockUp,
    moveBlockDown,
    isBlockEmpty,
  } = useBlockReducer(initialBlocks)

  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
  const [slashCommandBlockId, setSlashCommandBlockId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const { status: saveStatus, save } = useAutoSave({ postId, blocks })

  // Notify parent of changes
  const prevBlocksRef = useRef(blocks)
  useEffect(() => {
    if (prevBlocksRef.current !== blocks) {
      prevBlocksRef.current = blocks
      onChange?.(blocks)
    }
  }, [blocks, onChange])

  // Keyboard shortcuts
  useEditorShortcuts({
    onSave: save,
    onTogglePreview: () => setPreviewMode((prev) => !prev),
    onDuplicateBlock: () => {
      if (focusedBlockId) duplicateBlock(focusedBlockId)
    },
    onDeleteEmptyBlock: () => {
      if (focusedBlockId && isBlockEmpty(focusedBlockId)) {
        removeBlock(focusedBlockId)
        setFocusedBlockId(null)
      }
    },
  })

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        reorderBlocks(String(active.id), String(over.id))
      }
    },
    [reorderBlocks]
  )

  const handleInsert = useCallback(
    (type: BlockType, position: number) => {
      addBlock(type, position)
    },
    [addBlock]
  )

  const handleSlashCommand = useCallback((blockId: string) => {
    setSlashCommandBlockId(blockId)
  }, [])

  const handleSlashSelect = useCallback(
    (blockId: string, newType: BlockType) => {
      // Remove the empty paragraph and add the selected block type at the same position
      const idx = blocks.findIndex((b) => b.id === blockId)
      if (idx !== -1) {
        removeBlock(blockId)
        addBlock(newType, idx)
      }
      setSlashCommandBlockId(null)
    },
    [blocks, removeBlock, addBlock]
  )

  const statusConfig = SAVE_STATUS_CONFIG[saveStatus]

  return (
    <div className="space-y-2">
      {/* Editor header with save status */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
        <span className="text-sm font-medium">Editor de Blocos</span>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {statusConfig.icon}
          {statusConfig.label && <span>{statusConfig.label}</span>}
        </div>
      </div>

      {/* Block list with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0">
            {blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                {/* Insert button between blocks */}
                <InsertButton
                  position={index}
                  onInsert={handleInsert}
                />

                {/* Block wrapper */}
                <div className="relative">
                  <BlockWrapper
                    block={block}
                    onUpdate={updateBlock}
                    onRemove={removeBlock}
                    onDuplicate={duplicateBlock}
                    onMoveUp={moveBlockUp}
                    onMoveDown={moveBlockDown}
                    onSlashCommand={handleSlashCommand}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    isFocused={focusedBlockId === block.id}
                    onFocus={setFocusedBlockId}
                  />

                  {/* Slash command menu */}
                  {slashCommandBlockId === block.id && (
                    <SlashCommand
                      blockId={block.id}
                      onSelect={handleSlashSelect}
                      onClose={() => setSlashCommandBlockId(null)}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}

            {/* Always show insert button at end */}
            <InsertButton
              position={blocks.length}
              onInsert={handleInsert}
            />
          </div>
        </SortableContext>
      </DndContext>

      {/* Block toolbar at bottom */}
      <BlockToolbar onInsert={handleInsert} totalBlocks={blocks.length} />

      {/* Block count */}
      <div className="text-xs text-muted-foreground text-right">
        {blocks.length} bloco{blocks.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
