'use client'

interface SeoScoreGaugeProps {
  score: number
  maxScore: number
}

function getScoreColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 70) return 'text-yellow-600'
  if (percentage >= 50) return 'text-orange-500'
  return 'text-red-600'
}

function getBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-green-500'
  if (percentage >= 70) return 'bg-yellow-500'
  if (percentage >= 50) return 'bg-orange-500'
  return 'bg-red-500'
}

function getLabel(percentage: number): string {
  if (percentage >= 90) return 'Excelente'
  if (percentage >= 70) return 'Bom'
  if (percentage >= 50) return 'Precisa melhorar'
  return 'Ruim'
}

export function SeoScoreGauge({ score, maxScore }: SeoScoreGaugeProps) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-bold tabular-nums ${getScoreColor(percentage)}`}>
            {percentage}
          </span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
        <span className={`text-sm font-medium ${getScoreColor(percentage)}`}>
          {getLabel(percentage)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
