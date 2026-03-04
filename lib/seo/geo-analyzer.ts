// Story 1.6 — GEO Analysis Engine (pure client-side, zero API calls)

import type { ContentBlock, GeoConfig } from '@/lib/types/blog'
import type { ParagraphData, FaqData, QuoteData } from '@/lib/types/block-data'

// --- Types ---

export interface GeoAnalysisResult {
  citabilityScore: number // % of paragraphs that are citable (<= 3 sentences)
  entityCount: number // number of semantic entities in geo_config
  faqCoverage: number // number of FAQ blocks
  sourceCitations: number // count of blocks with source URL (quote with url)
  speakableCoverage: number // % of content covered by speakable selectors
  contentFreshness: number // days since last update
}

export interface GeoRecommendation {
  id: string
  message: string
  action: string
  severity: 'info' | 'warning' | 'error'
}

// --- Helpers ---

/** Strip HTML tags, returning plain text */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Count sentences in a text.
 * Splits on . ! ? followed by space or end of string.
 */
function countSentences(text: string): number {
  if (!text.trim()) return 0
  const sentences = text.split(/[.!?](?:\s|$)/).filter((s) => s.trim().length > 0)
  return sentences.length
}

// --- Individual Metric Functions ---

/**
 * Citability: % of paragraph blocks that are self-contained (<= 3 sentences).
 * Only analyzes 'paragraph' blocks.
 */
export function analyzeCitability(blocks: ContentBlock[]): number {
  const paragraphs = blocks.filter((b) => b.type === 'paragraph')
  if (paragraphs.length === 0) return 100

  let citableCount = 0
  for (const block of paragraphs) {
    const text = stripHtml((block.data as ParagraphData).text)
    const sentences = countSentences(text)
    if (sentences <= 3) {
      citableCount++
    }
  }

  return Math.round((citableCount / paragraphs.length) * 100)
}

/**
 * Entity count: number of semantic entities in geo_config.semantic_entities[]
 */
export function countEntities(geoConfig: GeoConfig | undefined): number {
  return geoConfig?.semantic_entities?.length ?? 0
}

/**
 * FAQ coverage: number of blocks of type 'faq'
 */
export function countFaqBlocks(blocks: ContentBlock[]): number {
  return blocks.filter((b) => b.type === 'faq').length
}

/**
 * Source citations: count of blocks with non-empty source URL.
 * Checks quote blocks with 'url' field filled.
 */
export function countSourceCitations(blocks: ContentBlock[]): number {
  let count = 0
  for (const block of blocks) {
    if (block.type === 'quote') {
      const data = block.data as QuoteData
      if (data.url && data.url.trim()) {
        count++
      }
    }
  }
  return count
}

/**
 * Speakable coverage: % of content types covered by speakable selectors.
 * Possible selectors: title (.post-title), excerpt (.post-excerpt), FAQ answers (.faq-answer)
 * Returns % of available selectors that are enabled.
 */
export function calculateSpeakableCoverage(
  blocks: ContentBlock[],
  selectors: string[] | undefined
): number {
  if (!selectors || selectors.length === 0) return 0

  // Possible speakable targets
  const possibleTargets: { selector: string; available: boolean }[] = [
    { selector: '.post-title', available: true }, // title always exists
    { selector: '.post-excerpt', available: true }, // excerpt always available
    {
      selector: '.faq-answer',
      available: blocks.some((b) => b.type === 'faq' && (b.data as FaqData).items.length > 0),
    },
  ]

  const availableTargets = possibleTargets.filter((t) => t.available)
  if (availableTargets.length === 0) return 0

  const coveredTargets = availableTargets.filter((t) => selectors.includes(t.selector))
  return Math.round((coveredTargets.length / availableTargets.length) * 100)
}

/**
 * Content freshness: days since last update.
 */
export function calculateFreshness(updatedAt: string | undefined): number {
  if (!updatedAt) return Infinity
  const updated = new Date(updatedAt)
  const now = new Date()
  const diffMs = now.getTime() - updated.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

// --- Main Analysis Function ---

/**
 * Full GEO analysis returning all 6 metrics.
 */
export function analyzeGeo(
  blocks: ContentBlock[],
  geoConfig: GeoConfig | undefined,
  updatedAt: string | undefined
): GeoAnalysisResult {
  return {
    citabilityScore: analyzeCitability(blocks),
    entityCount: countEntities(geoConfig),
    faqCoverage: countFaqBlocks(blocks),
    sourceCitations: countSourceCitations(blocks),
    speakableCoverage: calculateSpeakableCoverage(blocks, geoConfig?.speakable_selectors),
    contentFreshness: calculateFreshness(updatedAt),
  }
}

// --- Recommendations Engine ---

/**
 * Generate contextual recommendations based on GEO analysis results.
 */
export function generateGeoRecommendations(result: GeoAnalysisResult): GeoRecommendation[] {
  const recommendations: GeoRecommendation[] = []

  if (result.faqCoverage === 0) {
    recommendations.push({
      id: 'add-faq',
      message: 'Adicione um bloco FAQ para melhorar a citabilidade em respostas de IA',
      action: 'Adicione um bloco FAQ ao seu conteúdo',
      severity: 'warning',
    })
  }

  if (result.sourceCitations < 2) {
    recommendations.push({
      id: 'add-sources',
      message: 'Adicione URLs de fonte às citações e destaques para melhores sinais de autoridade',
      action: `Adicione mais ${2 - result.sourceCitations} citação(ões) de fonte`,
      severity: result.sourceCitations === 0 ? 'warning' : 'info',
    })
  }

  if (result.citabilityScore < 70) {
    recommendations.push({
      id: 'improve-citability',
      message: 'Divida parágrafos longos em declarações mais curtas e independentes',
      action: 'Mantenha parágrafos com 3 frases ou menos',
      severity: result.citabilityScore < 50 ? 'error' : 'warning',
    })
  }

  if (result.entityCount < 2) {
    recommendations.push({
      id: 'add-entities',
      message: 'Vincule entidades semânticas para ajudar sistemas de IA a entender seu conteúdo',
      action: `Adicione mais ${2 - result.entityCount} entidade(s) semântica(s)`,
      severity: result.entityCount === 0 ? 'warning' : 'info',
    })
  }

  if (result.speakableCoverage < 50) {
    recommendations.push({
      id: 'add-speakable',
      message: 'Marque conteúdo como falável para otimização de busca por voz',
      action: 'Ative os seletores de fala na seção Conteúdo para Voz',
      severity: 'info',
    })
  }

  if (result.contentFreshness > 30) {
    recommendations.push({
      id: 'update-content',
      message: 'Conteúdo foi atualizado há mais de 30 dias',
      action: 'Revise e atualize o conteúdo para manter sinais de atualidade',
      severity: result.contentFreshness > 90 ? 'error' : 'warning',
    })
  }

  return recommendations
}
