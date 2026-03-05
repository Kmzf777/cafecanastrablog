// Proxy route — forwards scrape requests to the VPS backend service.

import { NextRequest } from 'next/server'
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth'

const AI_API_URL = process.env.AI_API_URL
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

    const res = await fetch(`${AI_API_URL}/api/scrape`, {
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
    console.error('[ai/scrape proxy] Error:', error)
    return Response.json(
      { success: false, error: 'Falha ao conectar com o servico de IA.' },
      { status: 502 }
    )
  }
}
