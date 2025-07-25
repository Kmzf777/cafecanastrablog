import { NextRequest, NextResponse } from 'next/server'

// Função para gerar datas dos últimos N dias
function generateDailyViews(days: number = 7) {
  const dailyViews = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    dailyViews.push({
      date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      views: 0
    })
  }
  
  return dailyViews
}

export async function GET(request: NextRequest) {
  try {
    console.log('API de dashboard chamada')
    
    // Gerar datas reais dos últimos 7 dias
    const dailyViews = generateDailyViews(7)
    
    // Retornar dados vazios simples
    return NextResponse.json({
      success: true,
      period: '7d',
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
        period: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Erro na API de dashboard:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 