'use client'

import { Highlight, themes } from 'prism-react-renderer'
import type { CodeData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface CodeBlockProps {
  data: CodeData
  settings?: BlockSettings
}

export function CodeBlock({ data }: CodeBlockProps) {
  const language = data.language || 'text'

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-sm">
      {/* Header with language/filename */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-400">
        <span>{data.filename || language}</span>
      </div>

      <Highlight theme={themes.nightOwl} code={data.code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="overflow-x-auto p-4 text-sm leading-relaxed"
            style={{ ...style, margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {data.showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
