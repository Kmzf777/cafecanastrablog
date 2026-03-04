'use client'

import { useReducer, useCallback } from 'react'
import type { ContentBlock, BlockType } from '@/lib/types/blog'
import type { BlockData, ParagraphData } from '@/lib/types/block-data'

// Action types
type BlockAction =
  | { type: 'ADD_BLOCK'; payload: { blockType: BlockType; position: number } }
  | { type: 'REMOVE_BLOCK'; payload: { id: string } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; data: BlockData } }
  | { type: 'REORDER_BLOCKS'; payload: { activeId: string; overId: string } }
  | { type: 'DUPLICATE_BLOCK'; payload: { id: string } }
  | { type: 'SET_BLOCKS'; payload: { blocks: ContentBlock[] } }

function getDefaultData(blockType: BlockType): BlockData {
  const defaults: Record<BlockType, BlockData> = {
    heading: { text: '', level: 2 },
    paragraph: { text: '' },
    image: { src: '', alt: '' },
    gallery: { images: [], columns: 3, layout: 'grid' },
    quote: { text: '' },
    list: { style: 'unordered', items: [''] },
    code: { code: '' },
    embed: { url: '' },
    divider: { style: 'solid' },
    callout: { text: '', variant: 'info' },
    table: { headers: [''], rows: [['']] },
    faq: { items: [{ question: '', answer: '' }] },
    cta: { text: '', buttonText: '', buttonUrl: '' },
    video: { url: '' },
    accordion: { items: [{ title: '', content: '' }] },
    product: { name: '' },
  }
  return defaults[blockType]
}

function reorder(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block, index) => ({ ...block, order: index }))
}

function blockReducer(state: ContentBlock[], action: BlockAction): ContentBlock[] {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const { blockType, position } = action.payload
      const newBlock: ContentBlock = {
        id: crypto.randomUUID(),
        type: blockType,
        order: position,
        data: getDefaultData(blockType),
      }
      const next = [...state]
      next.splice(position, 0, newBlock)
      return reorder(next)
    }

    case 'REMOVE_BLOCK': {
      const next = state.filter((b) => b.id !== action.payload.id)
      return reorder(next)
    }

    case 'UPDATE_BLOCK': {
      const { id, data } = action.payload
      return state.map((b) => (b.id === id ? { ...b, data } : b))
    }

    case 'REORDER_BLOCKS': {
      const { activeId, overId } = action.payload
      if (activeId === overId) return state

      const oldIndex = state.findIndex((b) => b.id === activeId)
      const newIndex = state.findIndex((b) => b.id === overId)
      if (oldIndex === -1 || newIndex === -1) return state

      const next = [...state]
      const [moved] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, moved)
      return reorder(next)
    }

    case 'DUPLICATE_BLOCK': {
      const idx = state.findIndex((b) => b.id === action.payload.id)
      if (idx === -1) return state

      const original = state[idx]
      const duplicate: ContentBlock = {
        ...original,
        id: crypto.randomUUID(),
        data: { ...original.data },
      }
      const next = [...state]
      next.splice(idx + 1, 0, duplicate)
      return reorder(next)
    }

    case 'SET_BLOCKS': {
      return reorder(action.payload.blocks)
    }

    default:
      return state
  }
}

export function useBlockReducer(initialBlocks: ContentBlock[] = []) {
  const [blocks, dispatch] = useReducer(blockReducer, reorder(initialBlocks))

  const addBlock = useCallback((blockType: BlockType, position: number) => {
    dispatch({ type: 'ADD_BLOCK', payload: { blockType, position } })
  }, [])

  const removeBlock = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_BLOCK', payload: { id } })
  }, [])

  const updateBlock = useCallback((id: string, data: BlockData) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, data } })
  }, [])

  const reorderBlocks = useCallback((activeId: string, overId: string) => {
    dispatch({ type: 'REORDER_BLOCKS', payload: { activeId, overId } })
  }, [])

  const duplicateBlock = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_BLOCK', payload: { id } })
  }, [])

  const setBlocks = useCallback((newBlocks: ContentBlock[]) => {
    dispatch({ type: 'SET_BLOCKS', payload: { blocks: newBlocks } })
  }, [])

  const moveBlockUp = useCallback((id: string) => {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx <= 0) return
    const overId = blocks[idx - 1].id
    dispatch({ type: 'REORDER_BLOCKS', payload: { activeId: id, overId } })
  }, [blocks])

  const moveBlockDown = useCallback((id: string) => {
    const idx = blocks.findIndex((b) => b.id === id)
    if (idx === -1 || idx >= blocks.length - 1) return
    const overId = blocks[idx + 1].id
    dispatch({ type: 'REORDER_BLOCKS', payload: { activeId: id, overId } })
  }, [blocks])

  const isBlockEmpty = useCallback((id: string): boolean => {
    const block = blocks.find((b) => b.id === id)
    if (!block) return false
    if (block.type === 'paragraph') {
      return !(block.data as ParagraphData).text?.trim()
    }
    return false
  }, [blocks])

  return {
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
  }
}

export type { BlockAction }
