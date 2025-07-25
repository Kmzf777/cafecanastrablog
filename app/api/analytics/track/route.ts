import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Função para detectar tipo de dispositivo
function detectDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) return 'mobile'
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  return 'desktop'
}

// Função para detectar navegador
function detectBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent)) return 'Chrome'
  if (/firefox/i.test(userAgent)) return 'Firefox'
  if (/safari/i.test(userAgent)) return 'Safari'
  if (/edge/i.test(userAgent)) return 'Edge'
  if (/opera/i.test(userAgent)) return 'Opera'
  return 'Unknown'
}

// Função para detectar sistema operacional
function detectOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows'
  if (/macintosh|mac os x/i.test(userAgent)) return 'macOS'
  if (/linux/i.test(userAgent)) return 'Linux'
  if (/android/i.test(userAgent)) return 'Android'
  if (/ios/i.test(userAgent)) return 'iOS'
  return 'Unknown'
}

// Função para determinar tipo de página
function determinePageType(pageUrl: string, postType?: string): string {
  if (postType === 'recipe') return 'receita'
  if (postType === 'news') return 'noticia'
  if (pageUrl.includes('/blog')) return 'blog'
  if (pageUrl.includes('/cafecanastra') || pageUrl === '/') return 'home'
  return 'other'
}

// Função para gerar session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Analytics Track: Iniciando requisição...')
    
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔧 Verificando variáveis de ambiente:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida')
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Definida' : '❌ Não definida')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ CRÍTICO: Variáveis do Supabase não configuradas!')
      return NextResponse.json({ 
        success: false, 
        error: 'Configuração do Supabase não encontrada',
        message: 'Tabelas não configuradas - configure as variáveis de ambiente na Vercel'
      }, { status: 500 })
    }

    const body = await request.json()
    const { pageUrl, pageTitle, postSlug, postType, visitDuration = 0, screenResolution, language } = body

    console.log('📊 Dados recebidos:', {
      pageUrl,
      pageTitle,
      postSlug,
      postType,
      visitDuration,
      screenResolution,
      language
    })

    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    const referrer = request.headers.get('referer') || ''

    console.log('📊 Headers extraídos:', {
      userAgent: userAgent.substring(0, 50) + '...',
      ipAddress,
      referrer: referrer.substring(0, 50) + '...'
    })

    const sessionId = generateSessionId()
    const pageType = determinePageType(pageUrl, postType)
    const deviceType = detectDeviceType(userAgent)
    const browser = detectBrowser(userAgent)
    const os = detectOS(userAgent)

    console.log('📊 Dados processados:', {
      sessionId,
      pageType,
      deviceType,
      browser,
      os
    })

    const analyticsData = {
      page_url: pageUrl,
      page_title: pageTitle,
      post_slug: postSlug,
      post_type: postType,
      page_type: pageType,
      user_agent: userAgent,
      ip_address: ipAddress,
      referrer: referrer,
      device_type: deviceType,
      browser: browser,
      os: os,
      screen_resolution: screenResolution,
      language: language,
      visit_duration: visitDuration,
      session_id: sessionId,
      created_at: new Date().toISOString()
    }

    console.log('📊 Tentando salvar no Supabase...')

    // Insert into analytics table
    const { data: analyticsResult, error: analyticsError } = await supabase
      .from('analytics')
      .insert([analyticsData])
      .select('id')
      .single()

    if (analyticsError) {
      console.error('❌ Erro ao salvar analytics:', analyticsError)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao salvar dados de analytics',
        details: analyticsError.message
      }, { status: 500 })
    }

    const analyticsId = analyticsResult?.id
    console.log('✅ Analytics salvo com sucesso, ID:', analyticsId)

    // Handle session creation/update
    const { data: existingSession, error: sessionCheckError } = await supabase
      .from('sessions')
      .select('*')
      .eq('ip_address', ipAddress)
      .single()

    if (sessionCheckError && sessionCheckError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar sessão:', sessionCheckError)
    }

    if (existingSession) {
      // Update existing session
      const { error: sessionUpdateError } = await supabase
        .from('sessions')
        .update({
          last_activity: new Date().toISOString(),
          page_views: existingSession.page_views + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSession.id)

      if (sessionUpdateError) {
        console.error('❌ Erro ao atualizar sessão:', sessionUpdateError)
      } else {
        console.log('✅ Sessão atualizada')
      }
    } else {
      // Create new session
      const sessionData = {
        session_id: sessionId,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        screen_resolution: screenResolution,
        language: language,
        page_views: 1,
        first_visit: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: sessionCreateError } = await supabase
        .from('sessions')
        .insert([sessionData])

      if (sessionCreateError) {
        console.error('❌ Erro ao criar sessão:', sessionCreateError)
      } else {
        console.log('✅ Nova sessão criada')
      }
    }

    console.log('🎉 Analytics tracking concluído com sucesso!')

    return NextResponse.json({ 
      success: true, 
      sessionId, 
      analyticsId, 
      message: 'Analytics tracking funcionando perfeitamente!' 
    })

  } catch (error) {
    console.error('❌ Erro geral no analytics tracking:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Analytics tracking endpoint' })
} 