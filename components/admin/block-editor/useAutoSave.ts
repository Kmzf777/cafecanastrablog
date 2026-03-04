'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import type { ContentBlock } from '@/lib/types/blog'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions {
  postId?: string
  blocks: ContentBlock[]
  debounceMs?: number
}

export function useAutoSave({ postId, blocks, debounceMs = 30000 }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const blocksRef = useRef(blocks)
  const abortRef = useRef<AbortController | null>(null)

  // Keep blocks ref up to date
  blocksRef.current = blocks

  const save = useCallback(async () => {
    if (!postId) return

    // Cancel any in-flight request
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setStatus('saving')
    try {
      const res = await fetch(`/api/admin/posts/${postId}/auto-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: blocksRef.current }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error('Auto-save failed')
      setStatus('saved')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setStatus('error')
    }
  }, [postId])

  // Trigger debounced save on blocks change
  useEffect(() => {
    if (!postId) return

    // Don't auto-save on initial load
    if (status === 'idle' && blocks.length === 0) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      save()
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [blocks, postId, debounceMs, save, status])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      abortRef.current?.abort()
    }
  }, [])

  return { status, save }
}
