import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST() {
  try {
    console.log("=== FORÇANDO REVALIDAÇÃO DO SITEMAP ===")
    
    // Revalidar o sitemap
    revalidatePath('/sitemap.xml')
    revalidatePath('/blog')
    revalidatePath('/blog/receitas')
    revalidatePath('/blog/noticias')
    
    console.log("✅ Sitemap revalidado com sucesso")
    
    return NextResponse.json({
      success: true,
      message: "Sitemap revalidado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao revalidar sitemap:", error)
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
    message: "Endpoint para revalidação do sitemap",
    usage: "POST /api/revalidate-sitemap",
    timestamp: new Date().toISOString(),
  })
} 