'use client'

import { useState } from 'react'
import type { FaqData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface FaqBlockProps {
  data: FaqData
  settings?: BlockSettings
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 px-1 text-left text-gray-900 font-medium hover:text-amber-700 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className={`ml-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}
      >
        <div
          className="px-1 text-gray-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  )
}

export function FaqBlock({ data }: FaqBlockProps) {
  return (
    <div className="my-6 rounded-lg border border-gray-200 divide-y divide-gray-200 px-4">
      {data.items.map((item, i) => (
        <FaqItem key={i} question={item.question} answer={item.answer} />
      ))}
    </div>
  )
}
