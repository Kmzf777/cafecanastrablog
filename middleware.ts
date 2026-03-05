import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Secret for JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
)

// Rate limiting map (simple in-memory)
const rateLimitMap = new Map()

function isRateLimited(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }

  const requests = rateLimitMap.get(ip)
  const validRequests = requests.filter((timestamp: number) => timestamp > windowStart)

  if (validRequests.length >= limit) {
    return true
  }

  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''

  // 1. Allow unrestricted access to public files
  if (pathname === '/sitemap.xml' || pathname === '/sitemap-news.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // 2. Allow legitimate bots
  const allowedBots = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebot', 'ia_archiver'
  ]
  if (allowedBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    return NextResponse.next();
  }

  // 3. Admin Authentication Logic
  if (pathname.startsWith('/admin')) {
    // Allow login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for token
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      // Token is valid, proceed
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 4. Rate Limiting for Login API
  if (pathname === '/api/admin/login') {
    if (isRateLimited(ip as string, 5, 300000)) { // 5 attempts per 5 minutes
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Try again later.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '300' }
        }
      )
    }
  }

  // 5. Security Headers & Standard Response
  const response = NextResponse.next()

  // Ocultar informações do servidor
  response.headers.set('Server', 'Apache/2.4.1')
  response.headers.set('X-Powered-By', 'PHP/8.1.0')

  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CSP (Content Security Policy) - Adjusted to allow Supabase
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.canastrainteligencia.com https://va.vercel-scripts.com; frame-ancestors 'none';"
  )

  // 6. Block malicious bots (basic check)
  const maliciousBots = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'php']
  if (
    maliciousBots.some(bot => userAgent.toLowerCase().includes(bot)) &&
    !pathname.startsWith('/api/scheduled-posts') &&
    !pathname.startsWith('/admin') // Allow admin access which might look like bot if scripted but generally safe to exclude here
  ) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}