'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ChevronDown, ChevronRight, Globe } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { ContentBlock, SeoConfig } from '@/lib/types/blog'
import { calculateSeoScore, type SeoScoreResult } from '@/lib/seo/seo-scorer'
import { SeoScoreGauge } from './SeoScoreGauge'
import { SeoCheckItem } from './SeoCheckItem'

interface SeoPanelProps {
  blocks: ContentBlock[]
  seoConfig: SeoConfig
  slug: string
  onSeoConfigChange: (config: SeoConfig) => void
}

export function SeoPanel({ blocks, seoConfig, slug, onSeoConfigChange }: SeoPanelProps) {
  const [scoreResult, setScoreResult] = useState<SeoScoreResult | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [ogOpen, setOgOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced score calculation (500ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const result = calculateSeoScore(blocks, seoConfig, slug)
      setScoreResult(result)
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [blocks, seoConfig, slug])

  const updateConfig = useCallback(
    (field: keyof SeoConfig, value: unknown) => {
      onSeoConfigChange({ ...seoConfig, [field]: value })
    },
    [seoConfig, onSeoConfigChange]
  )

  // Secondary keywords as comma-separated string
  const secondaryKeywordsStr = useMemo(
    () => (seoConfig.secondary_keywords || []).join(', '),
    [seoConfig.secondary_keywords]
  )

  const handleSecondaryKeywordsChange = useCallback(
    (value: string) => {
      const keywords = value
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
        .slice(0, 5)
      updateConfig('secondary_keywords', keywords)
    },
    [updateConfig]
  )

  return (
    <div className="space-y-4">
      {/* Score Gauge */}
      {scoreResult && (
        <SeoScoreGauge score={scoreResult.totalScore} maxScore={scoreResult.maxScore} />
      )}

      {/* Check List */}
      {scoreResult && (
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold mb-1">Verificações SEO</h4>
          {scoreResult.checks.map((check) => (
            <SeoCheckItem key={check.id} check={check} />
          ))}
        </div>
      )}

      {/* SEO Settings Form */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-1 text-sm font-semibold hover:underline">
          {settingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          Configurações SEO
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {/* Meta Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="meta_title" className="text-xs">Meta Título</Label>
              <span className={`text-xs tabular-nums ${(seoConfig.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {seoConfig.meta_title?.length || 0}/60
              </span>
            </div>
            <Input
              id="meta_title"
              value={seoConfig.meta_title || ''}
              onChange={(e) => updateConfig('meta_title', e.target.value)}
              placeholder="Título da página para mecanismos de busca"
              className="h-8 text-sm"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="meta_description" className="text-xs">Meta Descrição</Label>
              <span className={`text-xs tabular-nums ${(seoConfig.meta_description?.length || 0) > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {seoConfig.meta_description?.length || 0}/160
              </span>
            </div>
            <textarea
              id="meta_description"
              value={seoConfig.meta_description || ''}
              onChange={(e) => updateConfig('meta_description', e.target.value)}
              placeholder="Breve descrição para resultados de busca"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none"
              rows={3}
            />
          </div>

          {/* Focus Keyword */}
          <div className="space-y-1">
            <Label htmlFor="focus_keyword" className="text-xs">Palavra-chave Principal</Label>
            <Input
              id="focus_keyword"
              value={seoConfig.focus_keyword || ''}
              onChange={(e) => updateConfig('focus_keyword', e.target.value)}
              placeholder="Palavra-chave principal para otimizar"
              className="h-8 text-sm"
            />
          </div>

          {/* Secondary Keywords */}
          <div className="space-y-1">
            <Label htmlFor="secondary_keywords" className="text-xs">Palavras-chave Secundárias (máx 5, separadas por vírgula)</Label>
            <Input
              id="secondary_keywords"
              value={secondaryKeywordsStr}
              onChange={(e) => handleSecondaryKeywordsChange(e.target.value)}
              placeholder="ex: café, minas gerais, artesanal"
              className="h-8 text-sm"
            />
            {(seoConfig.secondary_keywords?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {seoConfig.secondary_keywords!.map((kw, i) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Canonical URL */}
          <div className="space-y-1">
            <Label htmlFor="canonical_url" className="text-xs">URL Canônica</Label>
            <Input
              id="canonical_url"
              value={seoConfig.canonical_url || ''}
              onChange={(e) => updateConfig('canonical_url', e.target.value)}
              placeholder={`https://cafecanastra.com/blog/${slug || 'post-slug'}`}
              className="h-8 text-sm"
            />
          </div>

          {/* Open Graph Override */}
          <Collapsible open={ogOpen} onOpenChange={setOgOpen}>
            <CollapsibleTrigger className="flex w-full items-center gap-1 text-xs font-medium text-muted-foreground hover:underline">
              {ogOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Substituição Open Graph
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="space-y-1">
                <Label htmlFor="og_title" className="text-xs">Título OG</Label>
                <Input
                  id="og_title"
                  value={seoConfig.og_title || ''}
                  onChange={(e) => updateConfig('og_title', e.target.value)}
                  placeholder="Substituir título nas redes sociais"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="og_description" className="text-xs">Descrição OG</Label>
                <Input
                  id="og_description"
                  value={seoConfig.og_description || ''}
                  onChange={(e) => updateConfig('og_description', e.target.value)}
                  placeholder="Substituir descrição nas redes sociais"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="og_image" className="text-xs">URL da Imagem OG</Label>
                <Input
                  id="og_image"
                  value={seoConfig.og_image || ''}
                  onChange={(e) => updateConfig('og_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-8 text-sm"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Twitter Card Type */}
          <div className="space-y-1">
            <Label className="text-xs">Tipo de Card Twitter</Label>
            <Select
              value={seoConfig.twitter_card_type || 'summary'}
              onValueChange={(value) => updateConfig('twitter_card_type', value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Resumo</SelectItem>
                <SelectItem value="summary_large_image">Resumo com Imagem Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* noindex / nofollow toggles */}
          <div className="flex items-center justify-between">
            <Label htmlFor="noindex" className="text-xs">noindex</Label>
            <Switch
              id="noindex"
              checked={seoConfig.no_index || false}
              onCheckedChange={(checked) => updateConfig('no_index', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="nofollow" className="text-xs">nofollow</Label>
            <Switch
              id="nofollow"
              checked={seoConfig.no_follow || false}
              onCheckedChange={(checked) => updateConfig('no_follow', checked)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* SERP Preview */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          Pré-visualização SERP
        </h4>
        <div className="rounded-md border bg-white p-3 space-y-0.5">
          <p className="text-[13px] truncate" style={{ color: '#1a0dab' }}>
            {(seoConfig.meta_title || 'Título do post').slice(0, 60)}
          </p>
          <p className="text-xs truncate" style={{ color: '#006621' }}>
            cafecanastra.com/blog/{slug || 'post-slug'}
          </p>
          <p className="text-xs line-clamp-2" style={{ color: '#545454' }}>
            {(seoConfig.meta_description || 'Nenhuma meta descrição definida. Adicione uma para melhorar a taxa de cliques.').slice(0, 160)}
          </p>
        </div>
      </div>
    </div>
  )
}
