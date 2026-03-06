import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
      ADMIN_JWT_SECRET: !!process.env.ADMIN_JWT_SECRET,
      AI_API_URL: !!process.env.AI_API_URL,
      AI_API_SECRET: !!process.env.AI_API_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    },
  }

  // Test Supabase connection
  try {
    const { createServiceClient } = await import('@/lib/supabase-service')
    const supabase = createServiceClient()
    const { error } = await supabase.from('blog_posts').select('id').limit(1)
    checks.supabase = error ? { ok: false, error: error.message } : { ok: true }
  } catch (e) {
    checks.supabase = { ok: false, error: e instanceof Error ? e.message : String(e) }
  }

  // Test block-helpers import
  try {
    await import('@/lib/utils/block-helpers')
    checks.blockHelpers = { ok: true }
  } catch (e) {
    checks.blockHelpers = { ok: false, error: e instanceof Error ? e.message : String(e) }
  }

  return Response.json(checks)
}
