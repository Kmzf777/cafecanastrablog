'use client'

import { Check, AlertTriangle, X } from 'lucide-react'
import type { SeoCheckResult } from '@/lib/seo/seo-scorer'

interface SeoCheckItemProps {
  check: SeoCheckResult
}

const STATUS_CONFIG = {
  pass: {
    icon: Check,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  fail: {
    icon: X,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
} as const

export function SeoCheckItem({ check }: SeoCheckItemProps) {
  const config = STATUS_CONFIG[check.status]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-2 py-1.5">
      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{check.label}</span>
          <span className="text-xs text-muted-foreground">
            {check.score}/{check.maxScore}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{check.message}</p>
      </div>
    </div>
  )
}
