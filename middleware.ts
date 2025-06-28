import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'

// Chave secreta para JWT (em produção, use uma chave mais segura)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
)

// Rotas protegidas
const PROTECTED_ROUTES = ['/blogmanager', '/api/blog-webhook']
const PUBLIC_ROUTES = ['/login', '/api/login']

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
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Verificar token JWT
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('admin-token')?.value
    
    if (!token) {
      // Redirecionar para login se não houver token
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Verificar se o token é válido
    const isValidToken = await verifyToken(token)
    if (!isValidToken) {
      // Token inválido, redirecionar para login
      const loginUrl = new URL('/login', request.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin-token')
      return response
    }
  }
  
  // Bloquear acesso direto a arquivos sensíveis
  if (pathname.includes('.env') || pathname.includes('package.json') || pathname.includes('node_modules')) {
    return new NextResponse('Not Found', { status: 404 })
  }
  
  // Bloquear bots maliciosos
  const userAgent = request.headers.get('user-agent') || ''
  const maliciousBots = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'php'
  ]
  
  if (maliciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
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