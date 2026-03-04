'use client'

import React, { useCallback, useState } from 'react'
import { type Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Link,
  RemoveFormatting,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface InlineToolbarProps {
  editor: Editor
}

export function InlineToolbar({ editor }: InlineToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const handleLink = useCallback(() => {
    const existing = editor.getAttributes('link').href
    if (existing) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    setLinkUrl('')
    setShowLinkInput(true)
  }, [editor])

  const applyLink = useCallback(() => {
    if (linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-md"
    >
      {showLinkInput ? (
        <div className="flex items-center gap-1">
          <Input
            className="h-7 w-48 text-xs"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') setShowLinkInput(false)
            }}
            autoFocus
          />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={applyLink}>
            <Link className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${editor.isActive('underline') ? 'bg-accent' : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${editor.isActive('link') ? 'bg-accent' : ''}`}
            onClick={handleLink}
          >
            <Link className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter className="h-3.5 w-3.5" />
          </Button>
          <div className="mx-0.5 h-4 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            <RemoveFormatting className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </BubbleMenu>
  )
}
