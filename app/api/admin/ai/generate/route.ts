// Proxy route — forwards AI generation requests to the VPS backend service.
// This keeps the admin JWT auth on Vercel and delegates heavy AI work to the VPS.

import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

const AI_API_URL = process.env.AI_API_URL // e.g. https://ai-api.cafecanastra.com
const AI_API_SECRET = process.env.AI_API_SECRET

export async function POST(request: NextRequest) {
  if (!(await verifyAdminAuth(request))) return unauthorizedResponse()

  if (!AI_API_URL || !AI_API_SECRET) {
    return Response.json(
      { error: 'AI API not configured. Set AI_API_URL and AI_API_SECRET.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()

    const res = await fetch(`${AI_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_SECRET}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (error) {
    console.error('[ai/generate proxy] Error:', error)
    return Response.json(
      { error: 'Falha ao conectar com o servico de IA. Tente novamente.' },
      { status: 502 }
    )
  }
}
