import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGIN API RECEBIDO ===")

    const body = await request.json()
    const { username, password } = body

    console.log("Tentativa de login:", { username, password })

    // Verificar credenciais
    if (username === "Canastrainteligencia" && password === "Canastrainteligencia@321") {
      console.log("✅ Login bem-sucedido")

      // Criar resposta com cookie
      const response = NextResponse.json({
        success: true,
        message: "Login realizado com sucesso",
        user: "Administrador"
      })

      // Definir cookie de autenticação (7 dias de duração)
      response.cookies.set("admin-auth", "true", {
        // httpOnly: true, // REMOVIDO para permitir leitura no client-side
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
        path: "/"
      })

      return response
    } else {
      console.log("❌ Credenciais inválidas")
      return NextResponse.json(
        {
          success: false,
          error: "Usuário ou senha incorretos"
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor"
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "API de login está funcionando",
    endpoint: "/api/login",
    methods: ["POST"]
  })
} 