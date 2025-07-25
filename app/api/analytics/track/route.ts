import { NextRequest, NextResponse } from 'next/server'

// Função para gerar ID de sessão único
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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

    // Gerar session ID simples
    const sessionId = generateSessionId()

    // Preparar resposta com session ID
    const response = NextResponse.json({ 
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

    return response

  } catch (error) {
    console.error('Erro no tracking de analytics:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Analytics tracking endpoint' })
} 