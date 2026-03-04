// Story 1.5 — SEO Score Engine (pure client-side, zero API calls)

import type { ContentBlock, SeoConfig } from '@/lib/types/blog'
import type {
  HeadingData,
  ParagraphData,
  QuoteData,
  ListData,
  CalloutData,
  FaqData,
  AccordionData,
  CtaData,
  ProductData,
  ImageData,
  GalleryData,
} from '@/lib/types/block-data'

// --- Types ---

export interface SeoCheckResult {
  id: string
  label: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  score: number
  maxScore: number
}

export interface SeoScoreResult {
  totalScore: number
  maxScore: number
  checks: SeoCheckResult[]
}

// --- Helpers ---

/** Strip HTML tags, returning plain text */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Extract all text from blocks for analysis */
export function extractTextFromBlocks(blocks: ContentBlock[]): string {
  const texts: string[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
        texts.push((block.data as HeadingData).text)
        break
      case 'paragraph':
        texts.push(stripHtml((block.data as ParagraphData).text))
        break
      case 'quote':
        texts.push(stripHtml((block.data as QuoteData).text))
        break
      case 'callout':
        texts.push(stripHtml((block.data as CalloutData).text))
        break
      case 'list':
        for (const item of (block.data as ListData).items) {
          texts.push(stripHtml(item))
        }
        break
      case 'faq':
        for (const item of (block.data as FaqData).items) {
          texts.push(stripHtml(item.question))
          texts.push(stripHtml(item.answer))
        }
        break
      case 'accordion':
        for (const item of (block.data as AccordionData).items) {
          texts.push(stripHtml(item.title))
          texts.push(stripHtml(item.content))
        }
        break
      case 'cta':
        texts.push(stripHtml((block.data as CtaData).text))
        break
      case 'product': {
        const pd = block.data as ProductData
        if (pd.description) texts.push(stripHtml(pd.description))
        break
      }
    }
  }

  return texts.join(' ')
}

/** Count words in text */
export function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0)
  return words.length
}

/** Calculate keyword density as percentage */
export function calculateKeywordDensity(text: string, keyword: string): number {
  if (!keyword || !text) return 0
  const lower = text.toLowerCase()
  const kw = keyword.toLowerCase().trim()
  if (!kw) return 0
  const totalWords = countWords(lower)
  if (totalWords === 0) return 0

  // Count keyword occurrences (keyword can be multi-word)
  const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
  const matches = lower.match(regex)
  const kwWordCount = countWords(kw)
  const occurrences = matches ? matches.length : 0

  return (occurrences * kwWordCount / totalWords) * 100
}

/** Extract href links from HTML content in blocks */
function extractLinks(blocks: ContentBlock[]): { internal: string[]; external: string[] } {
  const internal: string[] = []
  const external: string[] = []
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi

  function processHtml(html: string) {
    let match: RegExpExecArray | null
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1]
      if (href.startsWith('/') || href.includes('cafecanastra.com')) {
        internal.push(href)
      } else if (href.startsWith('http')) {
        external.push(href)
      }
    }
    linkRegex.lastIndex = 0
  }

  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        processHtml((block.data as ParagraphData).text)
        break
      case 'callout':
        processHtml((block.data as CalloutData).text)
        break
      case 'list':
        for (const item of (block.data as ListData).items) {
          processHtml(item)
        }
        break
    }
  }

  return { internal, external }
}

/** Extract heading levels in order */
function extractHeadingLevels(blocks: ContentBlock[]): number[] {
  return blocks
    .filter((b) => b.type === 'heading')
    .map((b) => (b.data as HeadingData).level)
}

/** Check if all images have alt text */
function extractImages(blocks: ContentBlock[]): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = []
  for (const block of blocks) {
    if (block.type === 'image') {
      const data = block.data as ImageData
      images.push({ src: data.src, alt: data.alt || '' })
    } else if (block.type === 'gallery') {
      const data = block.data as GalleryData
      for (const img of data.images) {
        images.push({ src: img.src, alt: img.alt || '' })
      }
    }
  }
  return images
}

/** Get first paragraph text (plain) */
function getFirstParagraphText(blocks: ContentBlock[]): string {
  const first = blocks.find((b) => b.type === 'paragraph')
  if (!first) return ''
  return stripHtml((first.data as ParagraphData).text).toLowerCase()
}

// --- 14 SEO Checks ---

function checkFocusKeywordInTitle(seoConfig: SeoConfig, postTitle?: string): SeoCheckResult {
  const maxScore = 10
  const keyword = seoConfig.focus_keyword?.toLowerCase().trim()
  const title = (seoConfig.meta_title || postTitle || '').toLowerCase()

  if (!keyword) {
    return { id: 'keyword-in-title', label: 'Palavra-chave no título', status: 'fail', message: 'Nenhuma palavra-chave definida', score: 0, maxScore }
  }
  if (title.includes(keyword)) {
    return { id: 'keyword-in-title', label: 'Palavra-chave no título', status: 'pass', message: 'Palavra-chave encontrada no título', score: maxScore, maxScore }
  }
  return { id: 'keyword-in-title', label: 'Palavra-chave no título', status: 'fail', message: 'Palavra-chave não encontrada no título', score: 0, maxScore }
}

function checkFocusKeywordInMetaDesc(seoConfig: SeoConfig): SeoCheckResult {
  const maxScore = 10
  const keyword = seoConfig.focus_keyword?.toLowerCase().trim()
  const desc = (seoConfig.meta_description || '').toLowerCase()

  if (!keyword) {
    return { id: 'keyword-in-meta-desc', label: 'Palavra-chave na meta descrição', status: 'fail', message: 'Nenhuma palavra-chave definida', score: 0, maxScore }
  }
  if (desc.includes(keyword)) {
    return { id: 'keyword-in-meta-desc', label: 'Palavra-chave na meta descrição', status: 'pass', message: 'Palavra-chave encontrada na meta descrição', score: maxScore, maxScore }
  }
  return { id: 'keyword-in-meta-desc', label: 'Palavra-chave na meta descrição', status: 'fail', message: 'Palavra-chave não encontrada na meta descrição', score: 0, maxScore }
}

function checkFocusKeywordInFirstParagraph(blocks: ContentBlock[], seoConfig: SeoConfig): SeoCheckResult {
  const maxScore = 8
  const keyword = seoConfig.focus_keyword?.toLowerCase().trim()

  if (!keyword) {
    return { id: 'keyword-in-first-para', label: 'Palavra-chave no 1º parágrafo', status: 'fail', message: 'Nenhuma palavra-chave definida', score: 0, maxScore }
  }
  const firstPara = getFirstParagraphText(blocks)
  if (firstPara.includes(keyword)) {
    return { id: 'keyword-in-first-para', label: 'Palavra-chave no 1º parágrafo', status: 'pass', message: 'Palavra-chave encontrada no primeiro parágrafo', score: maxScore, maxScore }
  }
  return { id: 'keyword-in-first-para', label: 'Palavra-chave no 1º parágrafo', status: 'fail', message: 'Palavra-chave não encontrada no primeiro parágrafo', score: 0, maxScore }
}

function checkKeywordDensity(blocks: ContentBlock[], seoConfig: SeoConfig): SeoCheckResult {
  const maxScore = 8
  const keyword = seoConfig.focus_keyword?.trim()

  if (!keyword) {
    return { id: 'keyword-density', label: 'Densidade da palavra-chave 1-2%', status: 'fail', message: 'Nenhuma palavra-chave definida', score: 0, maxScore }
  }
  const text = extractTextFromBlocks(blocks)
  const density = calculateKeywordDensity(text, keyword)

  if (density >= 1 && density <= 2) {
    return { id: 'keyword-density', label: 'Densidade da palavra-chave 1-2%', status: 'pass', message: `Densidade é ${density.toFixed(1)}% — ideal`, score: maxScore, maxScore }
  }
  if ((density >= 0.5 && density < 1) || (density > 2 && density <= 3)) {
    return { id: 'keyword-density', label: 'Densidade da palavra-chave 1-2%', status: 'warning', message: `Densidade é ${density.toFixed(1)}% — ideal entre 1-2%`, score: Math.round(maxScore * 0.5), maxScore }
  }
  return { id: 'keyword-density', label: 'Densidade da palavra-chave 1-2%', status: 'fail', message: `Densidade é ${density.toFixed(1)}% — o ideal é 1-2%`, score: 0, maxScore }
}

function checkMetaDescriptionLength(seoConfig: SeoConfig): SeoCheckResult {
  const maxScore = 8
  const len = (seoConfig.meta_description || '').length

  if (len === 0) {
    return { id: 'meta-desc-length', label: 'Tamanho da meta descrição', status: 'fail', message: 'Nenhuma meta descrição definida', score: 0, maxScore }
  }
  if (len >= 120 && len <= 160) {
    return { id: 'meta-desc-length', label: 'Tamanho da meta descrição', status: 'pass', message: `Meta descrição tem ${len} caracteres — ideal`, score: maxScore, maxScore }
  }
  if ((len >= 100 && len < 120) || (len > 160 && len <= 180)) {
    return { id: 'meta-desc-length', label: 'Tamanho da meta descrição', status: 'warning', message: `Meta descrição tem ${len} caracteres — ideal entre 120-160`, score: Math.round(maxScore * 0.8), maxScore }
  }
  return { id: 'meta-desc-length', label: 'Tamanho da meta descrição', status: 'fail', message: `Meta descrição tem ${len} caracteres — deve ter 120-160`, score: 0, maxScore }
}

function checkMetaTitleLength(seoConfig: SeoConfig): SeoCheckResult {
  const maxScore = 7
  const len = (seoConfig.meta_title || '').length

  if (len === 0) {
    return { id: 'meta-title-length', label: 'Tamanho do meta título', status: 'fail', message: 'Nenhum meta título definido', score: 0, maxScore }
  }
  if (len >= 30 && len <= 60) {
    return { id: 'meta-title-length', label: 'Tamanho do meta título', status: 'pass', message: `Meta título tem ${len} caracteres — ideal`, score: maxScore, maxScore }
  }
  if ((len >= 20 && len < 30) || (len > 60 && len <= 70)) {
    return { id: 'meta-title-length', label: 'Tamanho do meta título', status: 'warning', message: `Meta título tem ${len} caracteres — ideal entre 30-60`, score: Math.round(maxScore * 0.8), maxScore }
  }
  return { id: 'meta-title-length', label: 'Tamanho do meta título', status: 'fail', message: `Meta título tem ${len} caracteres — deve ter 30-60`, score: 0, maxScore }
}

function checkHeadingHierarchy(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 7
  const levels = extractHeadingLevels(blocks)

  if (levels.length === 0) {
    return { id: 'heading-hierarchy', label: 'Hierarquia de títulos (sem pulos)', status: 'fail', message: 'Nenhum título encontrado no conteúdo', score: 0, maxScore }
  }

  // Check for gaps: each heading should not skip a level
  let hasGap = false
  let minLevel = levels[0]
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > minLevel + 1 && levels[i] > levels[i - 1] + 1) {
      hasGap = true
      break
    }
    if (levels[i] < minLevel) minLevel = levels[i]
  }

  if (!hasGap) {
    return { id: 'heading-hierarchy', label: 'Hierarquia de títulos (sem pulos)', status: 'pass', message: 'Hierarquia de títulos está correta', score: maxScore, maxScore }
  }
  return { id: 'heading-hierarchy', label: 'Hierarquia de títulos (sem pulos)', status: 'fail', message: 'Hierarquia de títulos tem pulos (ex: H2 depois H4)', score: 0, maxScore }
}

function checkInternalLinks(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 7
  const { internal } = extractLinks(blocks)

  if (internal.length >= 2) {
    return { id: 'internal-links', label: 'Links internos >= 2', status: 'pass', message: `${internal.length} links internos encontrados`, score: maxScore, maxScore }
  }
  if (internal.length === 1) {
    return { id: 'internal-links', label: 'Links internos >= 2', status: 'warning', message: 'Apenas 1 link interno — adicione pelo menos mais 1', score: Math.round(maxScore * 0.5), maxScore }
  }
  return { id: 'internal-links', label: 'Links internos >= 2', status: 'fail', message: 'Nenhum link interno — adicione pelo menos 2', score: 0, maxScore }
}

function checkExternalLinks(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 5
  const { external } = extractLinks(blocks)

  if (external.length >= 1) {
    return { id: 'external-links', label: 'Links externos >= 1', status: 'pass', message: `${external.length} links externos encontrados`, score: maxScore, maxScore }
  }
  return { id: 'external-links', label: 'Links externos >= 1', status: 'fail', message: 'Nenhum link externo — adicione pelo menos 1 link de autoridade', score: 0, maxScore }
}

function checkImageAltText(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 8
  const images = extractImages(blocks)

  if (images.length === 0) {
    return { id: 'image-alt-text', label: 'Imagens com texto alt', status: 'pass', message: 'Nenhuma imagem para verificar', score: maxScore, maxScore }
  }

  const missingAlt = images.filter((img) => !img.alt.trim())
  if (missingAlt.length === 0) {
    return { id: 'image-alt-text', label: 'Imagens com texto alt', status: 'pass', message: `Todas as ${images.length} imagens têm texto alt`, score: maxScore, maxScore }
  }

  const ratio = (images.length - missingAlt.length) / images.length
  if (ratio >= 0.5) {
    return { id: 'image-alt-text', label: 'Imagens com texto alt', status: 'warning', message: `${missingAlt.length} de ${images.length} imagens sem texto alt`, score: Math.round(maxScore * ratio), maxScore }
  }
  return { id: 'image-alt-text', label: 'Imagens com texto alt', status: 'fail', message: `${missingAlt.length} de ${images.length} imagens sem texto alt`, score: 0, maxScore }
}

function checkContentLength(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 7
  const text = extractTextFromBlocks(blocks)
  const words = countWords(text)

  if (words >= 800) {
    return { id: 'content-length', label: 'Conteúdo >= 800 palavras', status: 'pass', message: `Conteúdo tem ${words} palavras — bom tamanho`, score: maxScore, maxScore }
  }
  if (words >= 500) {
    return { id: 'content-length', label: 'Conteúdo >= 800 palavras', status: 'warning', message: `Conteúdo tem ${words} palavras — ideal 800+`, score: Math.round(maxScore * 0.6), maxScore }
  }
  return { id: 'content-length', label: 'Conteúdo >= 800 palavras', status: 'fail', message: `Conteúdo tem ${words} palavras — precisa de 800+`, score: 0, maxScore }
}

function checkSlugOptimized(slug: string, seoConfig: SeoConfig): SeoCheckResult {
  const maxScore = 5
  const keyword = seoConfig.focus_keyword?.toLowerCase().trim()

  if (!slug) {
    return { id: 'slug-optimized', label: 'Slug otimizado', status: 'fail', message: 'Nenhum slug definido', score: 0, maxScore }
  }

  const slugWords = slug.split('-').filter((w) => w.length > 0)
  const hasKeyword = keyword ? slug.toLowerCase().includes(keyword.replace(/\s+/g, '-')) : false
  const shortEnough = slugWords.length <= 5

  if (hasKeyword && shortEnough) {
    return { id: 'slug-optimized', label: 'Slug otimizado', status: 'pass', message: 'Slug contém a palavra-chave e é conciso', score: maxScore, maxScore }
  }
  if (hasKeyword || shortEnough) {
    return { id: 'slug-optimized', label: 'Slug otimizado', status: 'warning', message: !hasKeyword ? 'Palavra-chave não está no slug' : `Slug tem ${slugWords.length} palavras — máx 5`, score: Math.round(maxScore * 0.6), maxScore }
  }
  return { id: 'slug-optimized', label: 'Slug otimizado', status: 'fail', message: 'Slug sem palavra-chave e muito longo', score: 0, maxScore }
}

function checkReadingTime(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 5
  const text = extractTextFromBlocks(blocks)
  const words = countWords(text)
  const minutes = Math.max(1, Math.ceil(words / 200))

  // Always pass if calculable — it's about availability, not a specific target
  if (words > 0) {
    return { id: 'reading-time', label: 'Tempo de leitura disponível', status: 'pass', message: `Tempo de leitura: ${minutes} min (${words} palavras)`, score: maxScore, maxScore }
  }
  return { id: 'reading-time', label: 'Tempo de leitura disponível', status: 'fail', message: 'Sem conteúdo para calcular tempo de leitura', score: 0, maxScore }
}

function checkSubheadingDistribution(blocks: ContentBlock[]): SeoCheckResult {
  const maxScore = 5
  const text = extractTextFromBlocks(blocks)
  const totalWords = countWords(text)
  const headings = blocks.filter((b) => b.type === 'heading' && (b.data as HeadingData).level >= 2)

  if (totalWords < 300) {
    return { id: 'subheading-distribution', label: 'Distribuição de subtítulos', status: 'pass', message: 'Conteúdo curto — subtítulos não necessários', score: maxScore, maxScore }
  }

  // Ideal: a subheading roughly every 300 words
  const expectedHeadings = Math.floor(totalWords / 300)
  if (headings.length >= expectedHeadings) {
    return { id: 'subheading-distribution', label: 'Distribuição de subtítulos', status: 'pass', message: `${headings.length} subtítulos para ${totalWords} palavras — boa distribuição`, score: maxScore, maxScore }
  }
  if (headings.length >= Math.floor(expectedHeadings * 0.5)) {
    return { id: 'subheading-distribution', label: 'Distribuição de subtítulos', status: 'warning', message: `${headings.length} subtítulos — adicione mais (1 a cada ~300 palavras)`, score: Math.round(maxScore * 0.6), maxScore }
  }
  return { id: 'subheading-distribution', label: 'Distribuição de subtítulos', status: 'fail', message: `Apenas ${headings.length} subtítulos para ${totalWords} palavras — adicione mais`, score: 0, maxScore }
}

// --- Main Score Function ---

export function calculateSeoScore(
  blocks: ContentBlock[],
  seoConfig: SeoConfig,
  slug: string
): SeoScoreResult {
  const checks: SeoCheckResult[] = [
    checkFocusKeywordInTitle(seoConfig),
    checkFocusKeywordInMetaDesc(seoConfig),
    checkFocusKeywordInFirstParagraph(blocks, seoConfig),
    checkKeywordDensity(blocks, seoConfig),
    checkMetaDescriptionLength(seoConfig),
    checkMetaTitleLength(seoConfig),
    checkHeadingHierarchy(blocks),
    checkInternalLinks(blocks),
    checkExternalLinks(blocks),
    checkImageAltText(blocks),
    checkContentLength(blocks),
    checkSlugOptimized(slug, seoConfig),
    checkReadingTime(blocks),
    checkSubheadingDistribution(blocks),
  ]

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0)
  const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0)

  return { totalScore, maxScore, checks }
}
