import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from 'jose'

// Chave secreta para JWT (em produção, use uma chave mais segura)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
)

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGIN API RECEBIDO ===")

    const body = await request.json()
    const { username, password } = body

    console.log("Tentativa de login:", { username: username ? "***" : "undefined" })

    // Verificar credenciais
    if (username === "Canastrainteligencia" && password === "Canastrainteligencia@321") {
      console.log("✅ Login bem-sucedido")

      // Criar JWT token
      const token = await new SignJWT({ 
        user: "admin",
        username: "Canastrainteligencia",
        role: "administrator"
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Token expira em 24 horas
        .sign(JWT_SECRET)

      // Criar resposta com token JWT
      const response = NextResponse.json({
        success: true,
        message: "Login realizado com sucesso",
        user: "Administrador"
      })

      // Definir cookie httpOnly com o token JWT
      response.cookies.set("admin-token", token, {
        httpOnly: true, // Cookie não pode ser acessado via JavaScript
        secure: process.env.NODE_ENV === "production", // HTTPS apenas em produção
        sameSite: "strict", // Proteção contra CSRF
        maxAge: 24 * 60 * 60, // 24 horas em segundos
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".cafecanastra.com" : undefined
      })

      // Remover cookie antigo se existir
      response.cookies.delete("admin-auth")

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