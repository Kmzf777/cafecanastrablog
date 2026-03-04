'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  Volume2,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { ContentBlock, GeoConfig } from '@/lib/types/blog'
import {
  analyzeGeo,
  generateGeoRecommendations,
  type GeoAnalysisResult,
  type GeoRecommendation,
} from '@/lib/seo/geo-analyzer'
import { SITE_CONFIG } from '@/lib/site-config'
import { EntitySelector } from './EntitySelector'

interface GeoPanelProps {
  blocks: ContentBlock[]
  geoConfig: GeoConfig
  updatedAt: string | undefined
  onGeoConfigChange: (config: GeoConfig) => void
}

// --- Metric Display Helpers ---

type MetricStatus = 'green' | 'yellow' | 'red'

function getPercentStatus(value: number): MetricStatus {
  if (value >= 80) return 'green'
  if (value >= 50) return 'yellow'
  return 'red'
}

function getFreshnessStatus(days: number): MetricStatus {
  if (days <= 7) return 'green'
  if (days <= 30) return 'yellow'
  return 'red'
}

function getFreshnessLabel(days: number): string {
  if (!isFinite(days)) return 'Data indisponível'
  if (days === 0) return 'Atualizado hoje'
  if (days === 1) return 'Atualizado ontem'
  return `Atualizado há ${days} dias`
}

const STATUS_COLORS: Record<MetricStatus, { dot: string; text: string; bg: string }> = {
  green: { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  yellow: { dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' },
  red: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
}

function MetricRow({
  label,
  value,
  suffix,
  status,
}: {
  label: string
  value: string
  suffix?: string
  status: MetricStatus
}) {
  const colors = STATUS_COLORS[status]
  return (
    <div className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${colors.bg}`}>
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-semibold ${colors.text}`}>
          {value}{suffix}
        </span>
        <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
      </div>
    </div>
  )
}

// --- Speakable Selector Mapping ---

const SPEAKABLE_OPTIONS = [
  { id: 'title', label: 'Incluir título do post', selector: '.post-title' },
  { id: 'excerpt', label: 'Incluir resumo', selector: '.post-excerpt' },
  { id: 'faq', label: 'Incluir respostas FAQ', selector: '.faq-answer' },
] as const

// --- Main Component ---

export function GeoPanel({ blocks, geoConfig, updatedAt, onGeoConfigChange }: GeoPanelProps) {
  const [analysis, setAnalysis] = useState<GeoAnalysisResult | null>(null)
  const [recommendations, setRecommendations] = useState<GeoRecommendation[]>([])
  const [geoTargetingOpen, setGeoTargetingOpen] = useState(false)
  const [speakableOpen, setSpeakableOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced analysis (500ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const result = analyzeGeo(blocks, geoConfig, updatedAt)
      setAnalysis(result)
      setRecommendations(generateGeoRecommendations(result))
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [blocks, geoConfig, updatedAt])

  const updateConfig = useCallback(
    (updates: Partial<GeoConfig>) => {
      onGeoConfigChange({ ...geoConfig, ...updates })
    },
    [geoConfig, onGeoConfigChange]
  )

  // Speakable selector helpers
  const currentSelectors = geoConfig.speakable_selectors || []

  const toggleSpeakableSelector = useCallback(
    (selector: string, checked: boolean) => {
      const updated = checked
        ? [...currentSelectors, selector]
        : currentSelectors.filter((s) => s !== selector)
      updateConfig({ speakable_selectors: updated })
    },
    [currentSelectors, updateConfig]
  )

  // Geo targeting defaults from SITE_CONFIG
  const defaultRegion = SITE_CONFIG.address.addressLocality // "Serra da Canastra"
  const defaultCity = `Medeiros, ${SITE_CONFIG.address.addressRegion}` // "Medeiros, MG"

  return (
    <div className="space-y-4">
      {/* --- Metrics Dashboard --- */}
      {analysis && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold mb-1">Métricas GEO</h4>
          <MetricRow
            label="Citabilidade"
            value={String(analysis.citabilityScore)}
            suffix="%"
            status={getPercentStatus(analysis.citabilityScore)}
          />
          <MetricRow
            label="Entidades"
            value={String(analysis.entityCount)}
            status={analysis.entityCount >= 2 ? 'green' : analysis.entityCount >= 1 ? 'yellow' : 'red'}
          />
          <MetricRow
            label="Blocos FAQ"
            value={String(analysis.faqCoverage)}
            status={analysis.faqCoverage >= 1 ? 'green' : 'red'}
          />
          <MetricRow
            label="Citações de fonte"
            value={String(analysis.sourceCitations)}
            status={analysis.sourceCitations >= 2 ? 'green' : analysis.sourceCitations >= 1 ? 'yellow' : 'red'}
          />
          <MetricRow
            label="Speakable"
            value={String(analysis.speakableCoverage)}
            suffix="%"
            status={getPercentStatus(analysis.speakableCoverage)}
          />
          <MetricRow
            label="Atualidade"
            value={getFreshnessLabel(analysis.contentFreshness)}
            status={getFreshnessStatus(analysis.contentFreshness)}
          />
        </div>
      )}

      {/* --- Recommendations --- */}
      {recommendations.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-sm font-semibold flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Recomendações
          </h4>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`flex items-start gap-2 rounded-md border px-2.5 py-2 text-xs ${
                rec.severity === 'error'
                  ? 'border-red-200 bg-red-50'
                  : rec.severity === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-blue-200 bg-blue-50'
              }`}
            >
              {rec.severity === 'error' ? (
                <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
              ) : rec.severity === 'warning' ? (
                <AlertCircle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{rec.message}</p>
                <p className="text-muted-foreground mt-0.5">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Entity Selector --- */}
      <EntitySelector
        entities={geoConfig.semantic_entities || []}
        onChange={(entities) => updateConfig({ semantic_entities: entities })}
      />

      {/* --- Geo Targeting --- */}
      <Collapsible open={geoTargetingOpen} onOpenChange={setGeoTargetingOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-1 text-sm font-semibold hover:underline">
          {geoTargetingOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <MapPin className="h-3.5 w-3.5" />
          Segmentação Geográfica
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label htmlFor="target_region" className="text-xs">Região Alvo</Label>
            <Input
              id="target_region"
              value={geoConfig.target_region || ''}
              onChange={(e) => updateConfig({ target_region: e.target.value })}
              placeholder={defaultRegion}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="target_city" className="text-xs">Cidade Alvo</Label>
            <Input
              id="target_city"
              value={geoConfig.target_city || ''}
              onChange={(e) => updateConfig({ target_city: e.target.value })}
              placeholder={defaultCity}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="coord_lat" className="text-xs">Latitude</Label>
              <Input
                id="coord_lat"
                type="number"
                step="any"
                value={geoConfig.coordinates?.lat ?? ''}
                onChange={(e) => {
                  const lat = e.target.value ? parseFloat(e.target.value) : undefined
                  const lng = geoConfig.coordinates?.lng
                  if (lat !== undefined && lng !== undefined) {
                    updateConfig({ coordinates: { lat, lng } })
                  } else if (lat !== undefined) {
                    updateConfig({ coordinates: { lat, lng: 0 } })
                  } else {
                    updateConfig({ coordinates: undefined })
                  }
                }}
                placeholder="-20.25"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="coord_lng" className="text-xs">Longitude</Label>
              <Input
                id="coord_lng"
                type="number"
                step="any"
                value={geoConfig.coordinates?.lng ?? ''}
                onChange={(e) => {
                  const lng = e.target.value ? parseFloat(e.target.value) : undefined
                  const lat = geoConfig.coordinates?.lat
                  if (lng !== undefined && lat !== undefined) {
                    updateConfig({ coordinates: { lat, lng } })
                  } else if (lng !== undefined) {
                    updateConfig({ coordinates: { lat: 0, lng } })
                  } else {
                    updateConfig({ coordinates: undefined })
                  }
                }}
                placeholder="-46.5"
                className="h-8 text-sm"
              />
            </div>
          </div>
          {!geoConfig.target_region && !geoConfig.target_city && (
            <button
              type="button"
              onClick={() =>
                updateConfig({
                  target_region: defaultRegion,
                  target_city: defaultCity,
                })
              }
              className="text-xs text-primary hover:underline"
            >
              Preencher com padrões do site
            </button>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* --- Speakable Content --- */}
      <Collapsible open={speakableOpen} onOpenChange={setSpeakableOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-1 text-sm font-semibold hover:underline">
          {speakableOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <Volume2 className="h-3.5 w-3.5" />
          Conteúdo para Voz
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground">
            Marque seções para busca por voz (SpeakableSpecification no JSON-LD).
          </p>
          {SPEAKABLE_OPTIONS.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`speakable-${opt.id}`}
                checked={currentSelectors.includes(opt.selector)}
                onChange={(e) => toggleSpeakableSelector(opt.selector, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor={`speakable-${opt.id}`} className="text-sm font-normal cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
