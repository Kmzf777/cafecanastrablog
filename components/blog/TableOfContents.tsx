'use client'

import { useState, useEffect, useCallback } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first heading that is intersecting
    const visible = entries.find((e) => e.isIntersecting)
    if (visible) {
      setActiveId(visible.target.id)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0.1,
    })

    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings, handleObserver])

  if (headings.length === 0) return null

  const minLevel = Math.min(...headings.map((h) => h.level))

  const tocList = (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Sumário
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.level - minLevel) * 12}px` }}
          >
            <a
              href={`#${h.id}`}
              onClick={() => setMobileOpen(false)}
              className={`block py-1 text-sm leading-snug transition-colors border-l-2 pl-3 ${
                activeId === h.id
                  ? 'border-amber-600 text-amber-700 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">{tocList}</div>
      </aside>

      {/* Mobile: floating button + overlay */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-12 h-12 rounded-full bg-amber-700 text-white shadow-lg flex items-center justify-center hover:bg-amber-800 transition-colors"
          aria-label="Toggle table of contents"
        >
          ☰
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed bottom-20 right-6 z-50 bg-white rounded-xl shadow-xl p-5 w-72 max-h-[60vh] overflow-y-auto">
              {tocList}
            </div>
          </>
        )}
      </div>
    </>
  )
}
