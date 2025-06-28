import { NextResponse } from "next/server"
import { saveBlogPost } from "@/lib/supabase"

interface ScheduledPostConfig {
  quantidade: number
  atraso: number
  modo: "automático" | "personalizado"
  tema?: string
  publico_alvo?: string
  startHour?: number
  endHour?: number
  isEnabled?: boolean
}

export async function POST(request: Request) {
  try {
    console.log("=== AGENDAMENTO AUTOMÁTICO INICIADO ===")
    
    const body = await request.json()
    const config: ScheduledPostConfig = {
      quantidade: body.quantidade || 1,
      atraso: body.atraso || 1000,
      modo: body.modo || "automático",
      tema: body.tema,
      publico_alvo: body.publico_alvo,
      startHour: body.startHour || 7,
      endHour: body.endHour || 10,
      isEnabled: body.isEnabled !== undefined ? body.isEnabled : true
    }

    // Verificar se o agendamento está habilitado
    if (!config.isEnabled) {
      console.log("❌ Agendamento desabilitado")
      return NextResponse.json({
        success: false,
        error: "Agendamento automático está desabilitado",
        timestamp: new Date().toISOString()
      }, { status: 403 })
    }

    // Verificar se está no horário permitido
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Converter horários para minutos desde meia-noite para facilitar comparação
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    const startTimeInMinutes = config.startHour * 60
    const endTimeInMinutes = config.endHour * 60
    
    if (currentTimeInMinutes < startTimeInMinutes || currentTimeInMinutes > endTimeInMinutes) {
      console.log(`❌ Fora do horário permitido. Atual: ${currentHour}:${currentMinute.toString().padStart(2, '0')}, Permitido: ${config.startHour}:00-${config.endHour}:00`)
      return NextResponse.json({
        success: false,
        error: `Fora do horário permitido para postagem automática (${config.startHour}h às ${config.endHour}h)`,
        currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`,
        allowedTime: `${config.startHour}:00-${config.endHour}:00`,
        timestamp: now.toISOString()
      }, { status: 403 })
    }

    console.log(`✅ Horário permitido: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`)
    console.log("Configuração:", config)

    // URLs dos webhooks
    const webhookProd = "https://webhook.canastrainteligencia.com/webhook/blog"
    const webhookTest = "https://n8n.canastrainteligencia.com/webhook-test/blog"

    const results = []
    let createdPosts = 0

    // Processar posts com atraso entre eles
    for (let i = 0; i < config.quantidade; i++) {
      try {
        console.log(`📝 Processando post ${i + 1}/${config.quantidade}`)
        
        const payload = {
          modo: config.modo,
          quantidade: 1, // Sempre 1 por vez para controle
          atraso: 0, // Sem atraso interno
          tema: config.tema,
          publico_alvo: config.publico_alvo
        }

        // Disparar ambos os webhooks simultaneamente
        const [prodRes, testRes] = await Promise.all([
          fetch(webhookProd, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).catch(e => e),
          fetch(webhookTest, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).catch(e => e)
        ])

        // Tentar usar a resposta do primeiro que retornar sucesso
        let responseToUse = null
        if (prodRes && prodRes.ok) {
          responseToUse = prodRes
          console.log("✅ Usando resposta do webhook de produção.")
        } else if (testRes && testRes.ok) {
          responseToUse = testRes
          console.log("✅ Usando resposta do webhook de teste.")
        } else {
          throw new Error(`Ambos os webhooks falharam: produção (${prodRes?.status}), teste (${testRes?.status})`)
        }

        const webhookData = await responseToUse.json()
        console.log(`✅ Webhook ${i + 1} processado:`, webhookData)

        // Processar resposta do webhook
        let postsToProcess = []
        if (Array.isArray(webhookData)) {
          postsToProcess = webhookData
        } else if (webhookData && typeof webhookData === 'object') {
          postsToProcess = [webhookData]
        } else {
          throw new Error("Formato de resposta do webhook inválido")
        }

        // Salvar cada post no Supabase
        for (const postData of postsToProcess) {
          const savedPost = await saveBlogPost(postData, config.modo)
          if (savedPost) {
            createdPosts++
            results.push({
              success: true,
              post: savedPost.titulo,
              slug: savedPost.slug,
              id: savedPost.id,
              timestamp: new Date().toISOString()
            })
            console.log(`✅ Post salvo: ${savedPost.titulo}`)
          } else {
            results.push({
              success: false,
              error: "Falha ao salvar no Supabase",
              postData: postData.titulo || "Sem título",
              timestamp: new Date().toISOString()
            })
            console.log(`❌ Falha ao salvar post: ${postData.titulo || "Sem título"}`)
          }
        }

        // Aguardar antes do próximo post (exceto no último)
        if (i < config.quantidade - 1 && config.atraso > 0) {
          console.log(`⏳ Aguardando ${config.atraso}ms antes do próximo post...`)
          await new Promise(resolve => setTimeout(resolve, config.atraso))
        }

      } catch (error) {
        console.error(`❌ Erro no post ${i + 1}:`, error)
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
          postIndex: i + 1,
          timestamp: new Date().toISOString()
        })
      }
    }

    console.log(`=== AGENDAMENTO CONCLUÍDO ===`)
    console.log(`Posts criados: ${createdPosts}/${config.quantidade}`)

    return NextResponse.json({
      success: true,
      message: `Agendamento automático concluído. ${createdPosts} post(s) criado(s).`,
      config: config,
      results: results,
      createdPosts: createdPosts,
      totalAttempts: config.quantidade,
      processedAt: new Date().toISOString(),
      executionTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`
    })

  } catch (error) {
    console.error("❌ Erro no agendamento automático:", error)
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
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute
  
  // Valores padrão
  const defaultStartHour = 7
  const defaultEndHour = 10
  const startTimeInMinutes = defaultStartHour * 60
  const endTimeInMinutes = defaultEndHour * 60
  
  const isWithinAllowedTime = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes

  return NextResponse.json({
    message: "API de Agendamento Automático está funcionando",
    endpoint: "/api/scheduled-posts",
    methods: ["POST"],
    allowedTime: `${defaultStartHour}:00-${defaultEndHour}:00`,
    currentTime: `${currentHour}:${currentMinute.toString().padStart(2, '0')}`,
    isWithinAllowedTime: isWithinAllowedTime,
    status: isWithinAllowedTime ? "ready" : "outside_schedule",
    timestamp: now.toISOString(),
    config: {
      defaultQuantity: 1,
      defaultDelay: 1000,
      defaultMode: "automático",
      defaultStartHour: defaultStartHour,
      defaultEndHour: defaultEndHour
    }
  })
} 