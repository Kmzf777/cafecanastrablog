'use client'

import React, { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import HighlightExtension from '@tiptap/extension-highlight'
import type { ParagraphData } from '@/lib/types/block-data'
import { InlineToolbar } from '../InlineToolbar'

interface ParagraphEditorProps {
  data: ParagraphData
  onChange: (data: ParagraphData) => void
  onSlashCommand?: () => void
}

export function ParagraphEditor({ data, onChange, onSlashCommand }: ParagraphEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
      }),
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      HighlightExtension,
    ],
    content: data.text || '',
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML()
      // Detect slash command
      if (html === '<p>/</p>' && onSlashCommand) {
        onSlashCommand()
        e.commands.clearContent()
        return
      }
      onChange({ text: html })
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[60px] px-3 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      },
    },
  })

  // Sync external data changes (e.g. undo)
  useEffect(() => {
    if (editor && data.text !== editor.getHTML()) {
      editor.commands.setContent(data.text || '', { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative">
      {editor && <InlineToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
