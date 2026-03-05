import type { Request, Response } from 'express'
import { getGeminiClient, GEMINI_MODEL, GEMINI_CONFIG } from '../lib/gemini-client.js'
import { buildPrompt } from '../lib/prompt-builder.js'
import { parseResponse } from '../lib/response-parser.js'
import { scrapeUrl } from '../lib/scraper.js'
import { generateSlug } from '../lib/slug.js'
import { calculateMetrics, blocksToDbRecords } from '../lib/block-helpers.js'
import { createServiceClient } from '../lib/supabase.js'

const THEME_MIN_LENGTH = 10
const THEME_MAX_LENGTH = 500

export async function generateRoute(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body
    const theme = typeof body.theme === 'string' ? body.theme.trim() : ''
    const url = typeof body.url === 'string' ? body.url.trim() : undefined

    if (!theme || theme.length < THEME_MIN_LENGTH) {
      res.status(400).json({ error: `O tema deve ter pelo menos ${THEME_MIN_LENGTH} caracteres.` })
      return
    }
    if (theme.length > THEME_MAX_LENGTH) {
      res.status(400).json({ error: `O tema deve ter no maximo ${THEME_MAX_LENGTH} caracteres.` })
      return
    }

    // Scrape reference URL if provided
    let reference: string | undefined
    if (url) {
      const scrapeResult = await scrapeUrl(url)
      if (scrapeResult.success) {
        reference = `Title: ${scrapeResult.title}\n\n${scrapeResult.content}`
      } else {
        console.warn(`[ai/generate] Scraping failed for ${url}: ${scrapeResult.error}`)
      }
    }

    // Build prompt and call Gemini
    const prompt = buildPrompt(theme, reference)
    const client = getGeminiClient()

    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: GEMINI_CONFIG.temperature,
        responseMimeType: GEMINI_CONFIG.responseMimeType,
      },
    })

    const responseText = result.text
    if (!responseText) {
      res.status(500).json({ error: 'A IA nao retornou conteudo. Tente novamente.' })
      return
    }

    // Parse, validate, and sanitize
    let parsed: ReturnType<typeof parseResponse>
    try {
      parsed = parseResponse(responseText)
    } catch (parseError) {
      console.error('[ai/generate] Parse error:', parseError)
      res.status(500).json({
        error: 'A resposta da IA nao pode ser processada. Tente novamente.',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error',
      })
      return
    }

    const { post, blocks } = parsed
    const slug = generateSlug(post.title)
    const metrics = calculateMetrics(blocks)

    // Save to Supabase
    const supabase = createServiceClient()

    const postRecord = {
      title: post.title,
      slug,
      content: '',
      excerpt: post.excerpt,
      image_url: null,
      image_alt: null,
      category: post.category,
      tags: post.tags,
      status: 'draft' as const,
      scheduled_at: null,
      published_at: null,
      author: 'Cafe Canastra',
      locale: 'pt',
      seo_config: post.seo_config,
      geo_config: post.geo_config,
      reading_time_minutes: metrics.reading_time_minutes,
      word_count: metrics.word_count,
      seo_score: 0,
    }

    const { data: savedPost, error: postError } = await supabase
      .from('blog_posts')
      .insert(postRecord)
      .select('id')
      .single()

    if (postError) {
      console.error('[ai/generate] Post insert error:', postError)
      res.status(500).json({ error: 'Erro ao salvar o post.' })
      return
    }

    const blockRecords = blocksToDbRecords(blocks, savedPost.id)
    const { error: blocksError } = await supabase
      .from('blog_post_blocks')
      .insert(blockRecords)

    if (blocksError) {
      await supabase.from('blog_posts').delete().eq('id', savedPost.id)
      console.error('[ai/generate] Blocks insert error:', blocksError)
      res.status(500).json({ error: 'Erro ao salvar os blocos do post.' })
      return
    }

    res.json({
      success: true,
      postId: savedPost.id,
      title: post.title,
      slug,
      blockCount: blocks.length,
      wordCount: metrics.word_count,
      readingTime: metrics.reading_time_minutes,
    })
  } catch (error) {
    console.error('[ai/generate] Unexpected error:', error)

    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
      res.status(500).json({ error: 'Configuracao da IA ausente. Verifique as variaveis de ambiente.' })
      return
    }

    res.status(500).json({ error: 'Erro ao gerar conteudo. Tente novamente.' })
  }
}
