import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGOUT API RECEBIDO ===")

    // Criar resposta de sucesso
    const response = NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso"
    })

    // Remover cookie de autenticação
    response.cookies.delete("admin-token")
    response.cookies.delete("admin-auth") // Remover cookie antigo também

    // Definir cookie vazio para garantir que seja removido
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expirar imediatamente
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".cafecanastra.com" : undefined
    })

    console.log("✅ Logout bem-sucedido")
    return response

  } catch (error) {
    console.error("Erro no logout:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor"
      },
      { status: 500 }
    )
  }
} 