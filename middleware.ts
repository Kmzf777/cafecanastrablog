import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas que precisam de autenticação
  // const protectedRoutes = ['/blogmanager']
  // const isProtectedRoute = protectedRoutes.some(route => 
  //   req.nextUrl.pathname.startsWith(route)
  // )

  // // Se é uma rota protegida e não há sessão, redirecionar para login
  // if (isProtectedRoute && !session) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/login'
  //   redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // // Se está logado e tenta acessar login, redirecionar para dashboard
  // if (session && req.nextUrl.pathname === '/login') {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/blogmanager'
  //   return NextResponse.redirect(redirectUrl)
  // }

  return response
}

export const config = {
  matcher: [
    '/blogmanager/:path*',
    '/login',
    '/api/protected/:path*'
  ],
} 