import type { Request, Response } from 'express'
import { scrapeUrl } from '../lib/scraper.js'

export async function scrapeRoute(req: Request, res: Response): Promise<void> {
  try {
    const { url } = req.body

    if (!url || typeof url !== 'string') {
      res.status(400).json({ success: false, error: 'Invalid URL' })
      return
    }

    const result = await scrapeUrl(url.trim())

    if (!result.success) {
      res.status(422).json(result)
      return
    }

    res.json(result)
  } catch {
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
