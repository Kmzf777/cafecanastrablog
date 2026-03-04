'use client'

import { useState } from 'react'
import type { AccordionData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface AccordionBlockProps {
  data: AccordionData
  settings?: BlockSettings
}

function AccordionItem({ title, content, defaultOpen }: { title: string; content: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen || false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 px-1 text-left text-gray-900 font-medium hover:text-amber-700 transition-colors"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`ml-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[1000px] pb-4' : 'max-h-0'}`}
      >
        <div
          className="px-1 text-gray-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}

export function AccordionBlock({ data }: AccordionBlockProps) {
  return (
    <div className="my-6 rounded-lg border border-gray-200 divide-y divide-gray-200 px-4">
      {data.items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          content={item.content}
          defaultOpen={item.defaultOpen}
        />
      ))}
    </div>
  )
}
