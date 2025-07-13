import { type NextRequest, NextResponse } from "next/server"
import { saveBlogPost } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK BLOG RECEBIDO ===")

    const body = await request.json()
    console.log("Body recebido:", JSON.stringify(body, null, 2))

    // URLs dos webhooks
    const webhookProd = "https://webhook.canastrainteligencia.com/webhook/blog"
    const webhookTest = "https://n8n.canastrainteligencia.com/webhook-test/blog"

    // Disparar ambos os webhooks simultaneamente
    const [prodRes, testRes] = await Promise.all([
      fetch(webhookProd, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(e => e),
      fetch(webhookTest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(e => e)
    ])

    // Tentar usar a resposta do primeiro que retornar sucesso
    let responseToUse = null
    if (prodRes && prodRes.ok) {
      responseToUse = prodRes
      console.log("Usando resposta do webhook de produção.")
    } else if (testRes && testRes.ok) {
      responseToUse = testRes
      console.log("Usando resposta do webhook de teste.")
    } else {
      throw new Error(`Ambos os webhooks falharam: produção (${prodRes?.status}), teste (${testRes?.status})`)
    }

    const prodData = await responseToUse.json()
    console.log("Resposta do webhook utilizada:", prodData)

    // O formato esperado é um array de posts ou um único post
    let postsToProcess = []
    if (Array.isArray(prodData)) {
      postsToProcess = prodData
    } else if (prodData && typeof prodData === 'object') {
      postsToProcess = [prodData]
    } else {
      throw new Error("Formato de resposta do webhook inválido")
    }

    // Salvar cada post no Supabase
    const results = []
    const savedPosts = []
    let createdPosts = 0
    for (const [index, postData] of postsToProcess.entries()) {
      try {
        // Processar post_type se fornecido
        if (postData.post_type) {
          console.log(`Processando post com tipo: ${postData.post_type}`)
        }
        
        const savedPost = await saveBlogPost(postData, body.modo || "automático")
        if (savedPost) {
          savedPosts.push(savedPost)
          createdPosts++
          results.push({
            success: true,
            post: savedPost.titulo,
            slug: savedPost.slug,
            id: savedPost.id,
            post_type: savedPost.post_type,
          })
        } else {
          results.push({
            success: false,
            error: "Falha ao salvar no Supabase",
            postData: postData.titulo || "Sem título",
          })
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
          postData: postData.titulo || "Sem título",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Webhook processado com sucesso. ${createdPosts} post(s) criado(s).`,
      webhookResults: results,
      createdPosts: createdPosts,
      savedPosts: savedPosts.length,
      modo: body.modo || "automático",
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook do blog está funcionando",
    endpoint: "/api/blog-webhook",
    methods: ["POST"],
    timestamp: new Date().toISOString(),
  })
}
