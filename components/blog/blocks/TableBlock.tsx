import type { TableData } from '@/lib/types/block-data'
import type { BlockSettings } from '@/lib/types/blog'

interface TableBlockProps {
  data: TableData
  settings?: BlockSettings
}

export function TableBlock({ data }: TableBlockProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        {data.caption && (
          <caption className="px-4 py-2 text-sm text-gray-500 text-left bg-gray-50">
            {data.caption}
          </caption>
        )}
        <thead className="bg-gray-50">
          <tr>
            {data.headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
