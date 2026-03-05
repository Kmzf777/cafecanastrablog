import * as cheerio from 'cheerio'

export interface ScrapeSuccess {
  success: true
  title: string
  description: string
  content: string
}

export interface ScrapeError {
  success: false
  error: string
}

export type ScrapeResult = ScrapeSuccess | ScrapeError

const TIMEOUT_MS = 15_000
const MAX_CONTENT_LENGTH = 10_000

const REMOVE_SELECTORS = [
  'nav', 'footer', 'aside', 'script', 'style', 'noscript', 'iframe',
  '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
  '.cookie-banner', '.cookie-consent', '.cookie-notice',
  '.ad', '.ads', '.advertisement', '.adsbygoogle',
  '#cookie-banner', '#cookie-consent',
  '.sidebar', '.nav', '.menu', '.header', '.footer',
  '.popup', '.modal', '.overlay',
  '.social-share', '.share-buttons',
  '.comments', '#comments', '.comment-section',
].join(', ')

const CONTENT_SELECTORS = ['article', 'main', '[role="main"]', '.post-content', '.article-content', '.entry-content', 'body']

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function cleanText(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/gm, '')
    .trim()
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  if (!url || !isValidUrl(url)) {
    return { success: false, error: 'Invalid URL' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let html: string
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CafeCanastrBot/1.0; +https://cafecanastra.com)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
    })

    if (!response.ok) {
      return { success: false, error: 'URL inaccessible' }
    }

    html = await response.text()
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { success: false, error: 'URL inaccessible' }
    }
    return { success: false, error: 'URL inaccessible' }
  } finally {
    clearTimeout(timeout)
  }

  const $ = cheerio.load(html)

  const title = $('title').first().text().trim()
  const description = $('meta[name="description"]').attr('content')?.trim() || ''

  $(REMOVE_SELECTORS).remove()

  let content = ''
  for (const selector of CONTENT_SELECTORS) {
    const el = $(selector).first()
    if (el.length) {
      content = cleanText(el.text())
      if (content.length > 50) break
    }
  }

  if (!content || content.length < 20) {
    return { success: false, error: 'No content found' }
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.slice(0, MAX_CONTENT_LENGTH)
  }

  return { success: true, title, description, content }
}
