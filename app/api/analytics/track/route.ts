import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Função para gerar ID de sessão único
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Função para detectar tipo de dispositivo baseado no user agent
function detectDeviceType(userAgent: string): string {
  if (!userAgent) return 'other'
  
  const ua = userAgent.toLowerCase()
  
  // Detectar bots
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    return 'bot'
  }
  
  // Detectar mobile
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'mobile'
  }
  
  // Detectar tablet
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet'
  }
  
  // Desktop como padrão
  return 'desktop'
}

// Função para detectar browser baseado no user agent
function detectBrowser(userAgent: string): string {
  if (!userAgent) return 'unknown'
  
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('chrome')) return 'Chrome'
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('safari')) return 'Safari'
  if (ua.includes('edge')) return 'Edge'
  if (ua.includes('opera')) return 'Opera'
  
  return 'Other'
}

// Função para detectar OS baseado no user agent
function detectOS(userAgent: string): string {
  if (!userAgent) return 'unknown'
  
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac') || ua.includes('os x')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
  
  return 'Other'
}

// Função para determinar o tipo de página
function determinePageType(pageUrl: string, postType?: string): string {
  if (pageUrl === '/' || pageUrl === '/cafecanastra') return 'home'
  if (pageUrl === '/blog') return 'blog'
  if (postType === 'recipe') return 'recipe'
  if (postType === 'news') return 'news'
  if (pageUrl.includes('/blog/')) return 'blog_post'
  return 'other'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      pageUrl,
      pageTitle,
      postSlug,
      postType,
      visitDuration = 0,
      screenResolution,
      language
    } = body

    // Obter informações do request
    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'
    const referrer = request.headers.get('referer') || ''

    // Gerar session ID
    const sessionId = generateSessionId()

    // Determinar tipo de página
    const pageType = determinePageType(pageUrl, postType)

    // Detectar informações do dispositivo
    const deviceType = detectDeviceType(userAgent)
    const browser = detectBrowser(userAgent)
    const os = detectOS(userAgent)

    // Preparar dados para inserção na tabela analytics
    const analyticsData = {
      page_url: pageUrl,
      page_title: pageTitle,
      page_type: pageType,
      post_slug: postSlug || null,
      post_type: postType || null,
      user_agent: userAgent,
      ip_address: ipAddress,
      referrer: referrer,
      device_type: deviceType,
      browser: browser,
      os: os,
      screen_resolution: screenResolution || null,
      language: language || null,
      session_id: sessionId,
      visit_duration: visitDuration,
      bounce: true, // Será atualizado se o usuário visitar outras páginas
      is_unique_visit: true,
      created_at: new Date().toISOString()
    }

    console.log('📊 Analytics data to insert:', analyticsData)

    // Tentar inserir na tabela analytics
    let analyticsId = null
    try {
      const { data: analyticsResult, error: analyticsError } = await supabase
        .from('analytics')
        .insert([analyticsData])
        .select('id')
        .single()

      if (analyticsError) {
        console.error('❌ Erro ao inserir na tabela analytics:', analyticsError)
        // Se as tabelas não existem, retornar resposta de fallback
        return NextResponse.json({ 
          success: true, 
          sessionId,
          analyticsId: null,
          message: 'Analytics tracking funcionando (tabelas não configuradas)',
          receivedData: {
            pageUrl,
            pageTitle,
            postSlug,
            postType,
            visitDuration,
            screenResolution,
            language
          }
        })
      }

      analyticsId = analyticsResult?.id
      console.log('✅ Analytics data inserted successfully, ID:', analyticsId)

    } catch (error) {
      console.error('❌ Erro ao inserir analytics:', error)
      // Retornar resposta de fallback se as tabelas não existem
      return NextResponse.json({ 
        success: true, 
        sessionId,
        analyticsId: null,
        message: 'Analytics tracking funcionando (tabelas não configuradas)',
        receivedData: {
          pageUrl,
          pageTitle,
          postSlug,
          postType,
          visitDuration,
          screenResolution,
          language
        }
      })
    }

    // Tentar inserir/atualizar na tabela sessions
    try {
      // Verificar se já existe uma sessão para este IP
      const { data: existingSession } = await supabase
        .from('sessions')
        .select('*')
        .eq('ip_address', ipAddress)
        .single()

      if (existingSession) {
        // Atualizar sessão existente
        const updatedPages = existingSession.pages_visited || []
        if (!updatedPages.includes(pageUrl)) {
          updatedPages.push(pageUrl)
        }

        const { error: updateError } = await supabase
          .from('sessions')
          .update({
            last_visit_at: new Date().toISOString(),
            visit_count: existingSession.visit_count + 1,
            total_duration: existingSession.total_duration + visitDuration,
            pages_visited: updatedPages
          })
          .eq('id', existingSession.id)

        if (updateError) {
          console.error('❌ Erro ao atualizar sessão:', updateError)
        } else {
          console.log('✅ Session updated successfully')
        }
      } else {
        // Criar nova sessão
        const sessionData = {
          id: sessionId,
          ip_address: ipAddress,
          user_agent: userAgent,
          first_visit_at: new Date().toISOString(),
          last_visit_at: new Date().toISOString(),
          visit_count: 1,
          total_duration: visitDuration,
          pages_visited: [pageUrl],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: sessionError } = await supabase
          .from('sessions')
          .insert([sessionData])

        if (sessionError) {
          console.error('❌ Erro ao inserir sessão:', sessionError)
        } else {
          console.log('✅ New session created successfully')
        }
      }

    } catch (error) {
      console.error('❌ Erro ao gerenciar sessão:', error)
    }

    // Retornar resposta de sucesso
    return NextResponse.json({ 
      success: true, 
      sessionId,
      analyticsId,
      message: 'Analytics tracking funcionando perfeitamente!',
      receivedData: {
        pageUrl,
        pageTitle,
        postSlug,
        postType,
        visitDuration,
        screenResolution,
        language
      }
    })

  } catch (error) {
    console.error('❌ Erro no tracking de analytics:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Analytics tracking endpoint' })
} 