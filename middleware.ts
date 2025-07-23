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
  
  console.log(`[MIDDLEWARE] Acessando: ${pathname}`)
  
  // Headers de segurança
  const response = NextResponse.next()
  
  // Ocultar informações do servidor (removido para evitar confusão)
  // response.headers.set('Server', 'Apache/2.4.1')
  // response.headers.set('X-Powered-By', 'PHP/8.1.0')
  
  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP (Content Security Policy) - Mais permissivo para SEO
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com; frame-ancestors 'none';"
  )
  
  // Lista de bots legítimos que devem ter acesso
  const legitimateBots = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'facebookexternalhit', 
    'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'discordbot',
    'applebot', 'yandexbot', 'baiduspider', 'sogou', 'ahrefsbot', 'semrushbot'
  ]

  // Rate limiting para APIs (exceto para bots legítimos)
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent') || ''
    const isLegitimateBot = legitimateBots.some(bot => 
      userAgent.toLowerCase().includes(bot.toLowerCase())
    )
    
    if (!isLegitimateBot && isRateLimited(ip, 100, 60000)) { // 100 requests por minuto para APIs
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
  
  // Bloquear bots maliciosos (exceto para bots legítimos do Google e outros motores de busca)
  const userAgent = request.headers.get('user-agent') || ''
  const maliciousBots = [
    'curl', 'wget', 'python', 'php', 'scraper'
  ]
  
  const isLegitimateBot = legitimateBots.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  )
  
  if (
    maliciousBots.some(bot => userAgent.toLowerCase().includes(bot)) &&
    !isLegitimateBot &&
    !pathname.startsWith('/api/scheduled-posts') &&
    !pathname.includes('/sitemap.xml') &&
    !pathname.includes('/robots.txt')
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