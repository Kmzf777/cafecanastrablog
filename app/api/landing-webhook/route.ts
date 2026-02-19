import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK LANDING PAGE RECEBIDO ===")

    const body = await request.json()
    console.log("Dados do formulário recebidos:", JSON.stringify(body, null, 2))

    // Validar campos obrigatórios
    const { nome, email, whatsapp } = body
    
    if (!nome || !email || !whatsapp) {
      return NextResponse.json(
        {
          success: false,
          error: "Campos obrigatórios não preenchidos: nome, email e whatsapp são necessários",
        },
        { status: 400 }
      )
    }

    // URL do webhook de destino
    const webhookUrl = "https://webhook.canastrainteligencia.com/webhook/landing-page"

    // Enviar dados para o webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "CafeCanastra-LandingPage/1.0"
      },
      body: JSON.stringify({
        nome,
        email,
        whatsapp
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook retornou status ${response.status}: ${response.statusText}`)
    }

    const responseData = await response.json()
    console.log("Resposta do webhook:", responseData)

    return NextResponse.json({
      success: true,
      message: "Dados enviados com sucesso para o webhook",
      data: { nome, email, whatsapp },
      webhookResponse: responseData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro no webhook de landing page:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook da landing page está funcionando",
    endpoint: "/api/landing-webhook",
    methods: ["POST"],
    requiredFields: ["nome", "email", "whatsapp"],
    timestamp: new Date().toISOString(),
  })
} 