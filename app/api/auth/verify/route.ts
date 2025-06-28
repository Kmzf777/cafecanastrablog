import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from 'jose'

// Chave secreta para JWT (deve ser a mesma usada no login)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cafe-canastra-super-secret-key-2024'
)

export async function GET(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Token não encontrado" 
        },
        { status: 401 }
      )
    }

    // Verificar token JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Verificar se o token não expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Token expirado" 
        },
        { status: 401 }
      )
    }

    // Token válido
    return NextResponse.json({
      success: true,
      user: payload.user,
      username: payload.username,
      role: payload.role
    })

  } catch (error) {
    console.error("Erro na verificação do token:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Token inválido" 
      },
      { status: 401 }
    )
  }
} 