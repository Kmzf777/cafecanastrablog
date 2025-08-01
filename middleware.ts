import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Chave secreta para JWT (em produção, use uma chave mais segura)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
)

// Rotas protegidas (requerem autenticação)
const PROTECTED_ROUTES = ['/blogmanager']

// Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = [
  '/login', 
  '/api/login',
  '/api/auth/verify',
  '/api/auth/logout',
  '/api/scheduled-posts',
  '/cafecanastra',
  '/en/cafecanastra',
  '/es/cafecanastra',
  '/blog',
  '/',
  '/sitemap.xml',
  '/sitemap-news.xml',
  '/robots.txt',
  '/manifest.json'
]

// Rate limiting simples
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

// Limpar rate limit map periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [ip, requests] of rateLimitMap.entries()) {
    const validRequests = requests.filter((timestamp: number) => now - timestamp < 60000)
    if (validRequests.length === 0) {
      rateLimitMap.delete(ip)
    } else {
      rateLimitMap.set(ip, validRequests)
    }
  }
}, 60000)

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''

  // Permitir acesso irrestrito aos sitemaps
  if (pathname === '/sitemap.xml' || pathname === '/sitemap-news.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // Permitir bots legítimos (Googlebot, Bingbot, etc)
  const allowedBots = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebot', 'ia_archiver'
  ]
  if (allowedBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    return NextResponse.next();
  }
  
  console.log(`[MIDDLEWARE] Acessando: ${pathname}`)
  
  // Headers de segurança
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
  
  // CSP (Content Security Policy)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';"
  )
  
  // Rate limiting para APIs
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(ip, 100, 60000)) { // 100 requests por minuto para APIs
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      )
    }
  }
  
  // Rate limiting para login
  if (pathname === '/api/login') {
    if (isRateLimited(ip, 5, 300000)) { // 5 tentativas por 5 minutos
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Try again later.' }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '300'
          }
        }
      )
    }
  }
  
  // Remover checagem de rota protegida baseada em JWT
  
  // Bloquear acesso direto a arquivos sensíveis
  if (pathname.includes('.env') || pathname.includes('package.json') || pathname.includes('node_modules')) {
    return new NextResponse('Not Found', { status: 404 })
  }
  
  // Bloquear bots maliciosos
  const maliciousBots = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'php'
  ]
  
  if (
    maliciousBots.some(bot => userAgent.toLowerCase().includes(bot)) &&
    !pathname.startsWith('/api/scheduled-posts')
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