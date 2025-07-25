import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Função para calcular período baseado no parâmetro
function calculatePeriod(period: string) {
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case '1d':
      startDate.setDate(now.getDate() - 1)
      break
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setDate(now.getDate() - 7) // padrão 7 dias
  }
  
  return {
    start: startDate.toISOString(),
    end: now.toISOString()
  }
}

// Função para gerar visualizações diárias
async function generateDailyViews(period: string) {
  const { start, end } = calculatePeriod(period)
  const startDate = new Date(start)
  const endDate = new Date(end)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  try {
    // Buscar dados reais do Supabase
    const { data: dailyData, error } = await supabase
      .from('analytics')
      .select('created_at')
      .gte('created_at', start)
      .lte('created_at', end)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('❌ Erro ao buscar dados diários:', error)
      return []
    }

    // Agrupar por dia
    const dailyViews: { [key: string]: number } = {}
    
    // Inicializar todos os dias com 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dailyViews[dateStr] = 0
    }

    // Contar visualizações por dia
    dailyData?.forEach(record => {
      const dateStr = new Date(record.created_at).toISOString().split('T')[0]
      if (dailyViews[dateStr] !== undefined) {
        dailyViews[dateStr]++
      }
    })

    // Converter para array
    return Object.entries(dailyViews).map(([date, views]) => ({
      date,
      views
    }))

  } catch (error) {
    console.error('❌ Erro ao gerar visualizações diárias:', error)
    return []
  }
}

// Função para contar por tipo de página
async function countByPageType(start: string, end: string) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('page_type')
      .gte('created_at', start)
      .lte('created_at', end)

    if (error) {
      console.error('❌ Erro ao buscar por tipo de página:', error)
      return []
    }

    // Agrupar manualmente
    const counts: { [key: string]: number } = {}
    data?.forEach(record => {
      const pageType = record.page_type || 'other'
      counts[pageType] = (counts[pageType] || 0) + 1
    })

    return Object.entries(counts).map(([page_type, count]) => ({
      page_type,
      count
    }))
  } catch (error) {
    console.error('❌ Erro ao contar por tipo de página:', error)
    return []
  }
}

// Função para buscar posts mais visualizados
async function getTopPosts(start: string, end: string) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('post_slug, post_type, page_title')
      .not('post_slug', 'is', null)
      .gte('created_at', start)
      .lte('created_at', end)

    if (error) {
      console.error('❌ Erro ao buscar posts mais visualizados:', error)
      return []
    }

    // Agrupar manualmente
    const counts: { [key: string]: any } = {}
    data?.forEach(record => {
      const key = record.post_slug
      if (!counts[key]) {
        counts[key] = {
          post_slug: record.post_slug,
          post_type: record.post_type,
          page_title: record.page_title,
          count: 0
        }
      }
      counts[key].count++
    })

    // Converter para array e ordenar
    return Object.values(counts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)
  } catch (error) {
    console.error('❌ Erro ao buscar posts mais visualizados:', error)
    return []
  }
}

// Função para contar por dispositivo
async function countByDevice(start: string, end: string) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('device_type')
      .gte('created_at', start)
      .lte('created_at', end)

    if (error) {
      console.error('❌ Erro ao buscar por dispositivo:', error)
      return []
    }

    // Agrupar manualmente
    const counts: { [key: string]: number } = {}
    data?.forEach(record => {
      const deviceType = record.device_type || 'other'
      counts[deviceType] = (counts[deviceType] || 0) + 1
    })

    return Object.entries(counts).map(([device_type, count]) => ({
      device_type,
      count
    }))
  } catch (error) {
    console.error('❌ Erro ao contar por dispositivo:', error)
    return []
  }
}

// Função para contar por browser
async function countByBrowser(start: string, end: string) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('browser')
      .gte('created_at', start)
      .lte('created_at', end)

    if (error) {
      console.error('❌ Erro ao buscar por browser:', error)
      return []
    }

    // Agrupar manualmente
    const counts: { [key: string]: number } = {}
    data?.forEach(record => {
      const browser = record.browser || 'unknown'
      counts[browser] = (counts[browser] || 0) + 1
    })

    return Object.entries(counts).map(([browser, count]) => ({
      browser,
      count
    }))
  } catch (error) {
    console.error('❌ Erro ao contar por browser:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📊 API de dashboard chamada')
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    const pageType = searchParams.get('pageType') || 'all'
    
    console.log('📊 Parâmetros:', { period, pageType })
    
    const { start, end } = calculatePeriod(period)
    
    // Verificar se as tabelas existem tentando uma consulta simples
    let tablesExist = false
    try {
      const { data: testData, error: testError } = await supabase
        .from('analytics')
        .select('id')
        .limit(1)
      
      if (!testError) {
        tablesExist = true
        console.log('✅ Tabelas analytics existem')
      } else {
        console.log('❌ Tabelas analytics não existem:', testError.message)
      }
    } catch (error) {
      console.log('❌ Erro ao verificar tabelas:', error)
    }

    if (!tablesExist) {
      // Retornar dados vazios se as tabelas não existem
      const dailyViews = await generateDailyViews(period)
      
      return NextResponse.json({
        success: true,
        period,
        message: 'Tabelas de analytics não configuradas',
        data: {
          totalViews: 0,
          uniqueViews: 0,
          homeViews: 0,
          blogViews: 0,
          viewsByPageType: [],
          topPosts: [],
          deviceStats: [],
          browserStats: [],
          dailyViews,
          bounceRate: 0,
          avgSessionDuration: 0,
          period: { start, end }
        }
      })
    }

    // Buscar dados reais do Supabase
    console.log('📊 Buscando dados reais do Supabase...')

    // 1. Total de visualizações
    const { count: totalViews, error: totalError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start)
      .lte('created_at', end)

    if (totalError) {
      console.error('❌ Erro ao buscar total de visualizações:', totalError)
    }

    // 2. Visitas únicas (sessões únicas)
    const { count: uniqueViews, error: uniqueError } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start)
      .lte('created_at', end)

    if (uniqueError) {
      console.error('❌ Erro ao buscar visitas únicas:', uniqueError)
    }

    // 3. Visualizações da home page
    const { count: homeViews, error: homeError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('page_type', 'home')
      .gte('created_at', start)
      .lte('created_at', end)

    if (homeError) {
      console.error('❌ Erro ao buscar visualizações da home:', homeError)
    }

    // 4. Visualizações do blog
    const { count: blogViews, error: blogError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .in('page_type', ['blog', 'blog_post', 'recipe', 'news'])
      .gte('created_at', start)
      .lte('created_at', end)

    if (blogError) {
      console.error('❌ Erro ao buscar visualizações do blog:', blogError)
    }

    // 5. Visualizações por tipo de página
    const viewsByPageType = await countByPageType(start, end)

    // 6. Posts mais visualizados
    const topPosts = await getTopPosts(start, end)

    // 7. Estatísticas de dispositivos
    const deviceStats = await countByDevice(start, end)

    // 8. Estatísticas de browsers
    const browserStats = await countByBrowser(start, end)

    // 9. Taxa de bounce (usuários que visitaram apenas uma página)
    const { data: bounceData, error: bounceError } = await supabase
      .from('sessions')
      .select('pages_visited')
      .gte('created_at', start)
      .lte('created_at', end)

    let bounceRate = 0
    if (!bounceError && bounceData) {
      const totalSessions = bounceData.length
      const bouncedSessions = bounceData.filter(session => 
        session.pages_visited && session.pages_visited.length <= 1
      ).length
      bounceRate = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0
    }

    // 10. Duração média de sessão
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('total_duration')
      .gte('created_at', start)
      .lte('created_at', end)

    let avgSessionDuration = 0
    if (!sessionError && sessionData && sessionData.length > 0) {
      const totalDuration = sessionData.reduce((sum, session) => sum + (session.total_duration || 0), 0)
      avgSessionDuration = Math.round(totalDuration / sessionData.length)
    }

    // 11. Visualizações diárias
    const dailyViews = await generateDailyViews(period)

    console.log('📊 Dados coletados com sucesso!')

    return NextResponse.json({
      success: true,
      period,
      data: {
        totalViews: totalViews || 0,
        uniqueViews: uniqueViews || 0,
        homeViews: homeViews || 0,
        blogViews: blogViews || 0,
        viewsByPageType,
        topPosts,
        deviceStats,
        browserStats,
        dailyViews,
        bounceRate,
        avgSessionDuration,
        period: { start, end }
      }
    })

  } catch (error) {
    console.error('❌ Erro na API de dashboard:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 