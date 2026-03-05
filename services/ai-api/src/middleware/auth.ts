import type { Request, Response, NextFunction } from 'express'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.AI_API_SECRET
  if (!secret) {
    res.status(500).json({ error: 'AI_API_SECRET not configured on server' })
    return
  }

  const header = req.headers.authorization
  if (!header || header !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
