'use client'

import { useEffect } from 'react'

interface UseEditorShortcutsOptions {
  onSave: () => void
  onTogglePreview: () => void
  onDuplicateBlock: () => void
  onDeleteEmptyBlock: () => void
}

export function useEditorShortcuts({
  onSave,
  onTogglePreview,
  onDuplicateBlock,
  onDeleteEmptyBlock,
}: UseEditorShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrl = e.ctrlKey || e.metaKey

      // Ctrl+S — save draft
      if (isCtrl && e.key === 's') {
        e.preventDefault()
        onSave()
        return
      }

      // Ctrl+Shift+P — toggle preview
      if (isCtrl && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        onTogglePreview()
        return
      }

      // Ctrl+D — duplicate focused block
      if (isCtrl && e.key === 'd') {
        e.preventDefault()
        onDuplicateBlock()
        return
      }

      // Delete on empty block — remove block
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
        if (isInput) {
          const value = (target as HTMLInputElement | HTMLTextAreaElement).value
          if (value !== undefined && value !== '') return
        }
        // Let the handler decide if the block is empty
        onDeleteEmptyBlock()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSave, onTogglePreview, onDuplicateBlock, onDeleteEmptyBlock])
}
