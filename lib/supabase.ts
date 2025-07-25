import { createClient } from "@supabase/supabase-js"

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ CRÍTICO: Variáveis do Supabase não configuradas!")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅" : "❌")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey ? "✅" : "❌")
  
  // Em desenvolvimento, tentar carregar do .env.local
  if (process.env.NODE_ENV === 'development') {
    console.log("🔧 Modo desenvolvimento - verifique o arquivo .env.local")
  } else {
    console.log("🚀 Modo produção - configure as variáveis na Vercel")
  }
}

// Criar cliente Supabase usando as variáveis de ambiente
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)

// Cliente para server-side (usando as mesmas credenciais)
export const supabaseServer = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
)

// Função para debug das variáveis de ambiente
export function debugEnvironmentVariables() {
  console.log("=== SUPABASE ENVIRONMENT VARIABLES DEBUG ===")
  console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set")

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("URL Value:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("Key starts with:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "...")
  }

  console.log("=== END DEBUG ===")
}

export interface BlogPost {
  id: string
  // Campos de SEO
  meta_description: string | null
  meta_keywords: string | null
  og_url: string | null
  og_title: string | null
  og_description: string | null
  twitter_title: string | null
  twitter_description: string | null
  title: string

  // Campos de conteúdo
  titulo: string
  imagem_titulo: string | null
  alt_imagem_titulo: string | null
  resumo: string | null
  
  // Seções dinâmicas (para compatibilidade com formato antigo)
  secao_1_titulo: string | null
  secao_1_texto: string | null
  secao_2_titulo: string | null
  secao_2_texto: string | null
  secao_3_titulo: string | null
  secao_3_texto: string | null
  imagem_secao_3: string | null
  alt_imagem_secao_3: string | null
  secao_4_titulo: string | null
  secao_4_texto: string | null
  secao_5_titulo: string | null
  secao_5_texto: string | null
  secao_6_titulo: string | null
  secao_6_texto: string | null
  imagem_secao_6: string | null
  alt_imagem_secao_6: string | null
  secao_7_titulo: string | null
  secao_7_texto: string | null
  secao_cta_titulo: string | null
  secao_cta_texto: string | null
  
  // Campos dinâmicos para receitas
  ingredientes_titulo?: string | null
  ingrediente_1?: string | null
  ingrediente_2?: string | null
  ingrediente_3?: string | null
  ingrediente_4?: string | null
  ingrediente_5?: string | null
  ingrediente_6?: string | null
  ingrediente_7?: string | null
  ingrediente_8?: string | null
  ingrediente_9?: string | null
  ingrediente_10?: string | null
  ingrediente_11?: string | null
  ingrediente_12?: string | null
  ingrediente_13?: string | null
  ingrediente_14?: string | null
  ingrediente_15?: string | null
  
  modo_de_preparo_titulo?: string | null
  modo_de_preparo_1?: string | null
  modo_de_preparo_2?: string | null
  modo_de_preparo_3?: string | null
  modo_de_preparo_4?: string | null
  modo_de_preparo_5?: string | null
  modo_de_preparo_6?: string | null
  modo_de_preparo_7?: string | null
  modo_de_preparo_8?: string | null
  modo_de_preparo_9?: string | null
  modo_de_preparo_10?: string | null
  modo_de_preparo_11?: string | null
  modo_de_preparo_12?: string | null
  modo_de_preparo_13?: string | null
  modo_de_preparo_14?: string | null
  modo_de_preparo_15?: string | null
  
  // Campos dinâmicos para notícias
  subtitulo_1?: string | null
  paragrafo_1?: string | null
  subtitulo_2?: string | null
  paragrafo_2?: string | null
  subtitulo_3?: string | null
  paragrafo_3?: string | null
  subtitulo_4?: string | null
  paragrafo_4?: string | null
  subtitulo_5?: string | null
  paragrafo_5?: string | null
  subtitulo_6?: string | null
  paragrafo_6?: string | null
  subtitulo_7?: string | null
  paragrafo_7?: string | null
  subtitulo_8?: string | null
  paragrafo_8?: string | null
  subtitulo_9?: string | null
  paragrafo_9?: string | null
  subtitulo_10?: string | null
  paragrafo_10?: string | null
  
  // Campo fonte para notícias
  fonte?: string | null
  
  conclusao: string | null

  // Campos internos
  slug: string
  post_type: "recipe" | "news" | null
  modo: "automático" | "personalizado"
  status: "publicado" | "rascunho"
  created_at: string
  updated_at: string
}

// Função para criar slug a partir do título
export function createSlug(title: string): string {
  if (!title) return "post-sem-titulo"
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Função para processar dados do webhook de forma flexível
function processWebhookData(postData: any): any {
  console.log("=== PROCESSANDO DADOS DO WEBHOOK ===")
  console.log("postData original:", JSON.stringify(postData, null, 2))
  
  const processedData: any = {}
  
  // Campos básicos
  processedData.titulo = postData.titulo || "Post sem título"
  processedData.slug = createSlug(processedData.titulo)
  processedData.post_type = postData.post_type || null
  
  console.log("Campos básicos processados:")
  console.log("- titulo:", processedData.titulo)
  console.log("- slug:", processedData.slug)
  console.log("- post_type:", processedData.post_type)
  
  // Campos de SEO
  processedData.meta_description = postData['meta name="description"'] || null
  processedData.meta_keywords = postData['meta name="keywords"'] || null
  processedData.og_url = postData['meta property="og:url"'] || `https://cafecanastra.com/blog/${processedData.slug}`
  processedData.og_title = postData['meta property="og:title"'] || processedData.titulo
  processedData.og_description = postData['meta property="og:description"'] || null
  processedData.twitter_title = postData['meta property="twitter:title"'] || processedData.titulo
  processedData.twitter_description = postData['meta property="twitter:description"'] || null
  processedData.title = postData["<title>"] || `${processedData.titulo} | Blog Café Canastra`
  
  // Campos de conteúdo básicos
  processedData.imagem_titulo = postData["imagem titulo"] || null
  processedData.alt_imagem_titulo = postData["alt imagem titulo"] || null
  processedData.resumo = postData.resumo || null
  processedData.conclusao = postData["Conclusão"] || postData.conclusao || null
  
  // Processar campos dinâmicos baseados no post_type
  if (postData.post_type === "recipe") {
    console.log("Processando receita...")
    
    // Campos específicos para receitas
    processedData.ingredientes_titulo = postData.ingredientes_titulo || null
    processedData.modo_de_preparo_titulo = postData.modo_de_preparo_titulo || null
    
    console.log("Títulos processados:")
    console.log("- ingredientes_titulo:", processedData.ingredientes_titulo)
    console.log("- modo_de_preparo_titulo:", processedData.modo_de_preparo_titulo)
    
    // Processar ingredientes (até 15)
    const ingredientesEncontrados = []
    for (let i = 1; i <= 15; i++) {
      const ingredienteKey = `ingrediente_${i}`
      if (postData[ingredienteKey]) {
        processedData[ingredienteKey] = postData[ingredienteKey]
        ingredientesEncontrados.push(i)
      }
    }
    console.log(`Ingredientes encontrados: ${ingredientesEncontrados.length} (${ingredientesEncontrados.join(', ')})`)
    
    // Processar modo de preparo (até 15)
    const passosEncontrados = []
    for (let i = 1; i <= 15; i++) {
      const modoKey = `modo_de_preparo_${i}`
      if (postData[modoKey]) {
        processedData[modoKey] = postData[modoKey]
        passosEncontrados.push(i)
      }
    }
    console.log(`Passos encontrados: ${passosEncontrados.length} (${passosEncontrados.join(', ')})`)
    
    // Processar subtítulos e parágrafos para receitas (até 10)
    const secoesEncontradas = []
    for (let i = 1; i <= 10; i++) {
      const subtituloKey = `subtitulo_${i}`
      const paragrafoKey = `paragrafo_${i}`
      if (postData[subtituloKey] || postData[paragrafoKey]) {
        if (postData[subtituloKey]) {
          processedData[subtituloKey] = postData[subtituloKey]
        }
        if (postData[paragrafoKey]) {
          processedData[paragrafoKey] = postData[paragrafoKey]
        }
        secoesEncontradas.push(i)
      }
    }
    console.log(`Seções encontradas: ${secoesEncontradas.length} (${secoesEncontradas.join(', ')})`)
    
  } else if (postData.post_type === "news") {
    console.log("Processando notícia...")
    
    // Campos específicos para notícias
    processedData.fonte = postData.fonte || null
    console.log("Fonte:", processedData.fonte)
    
    // Processar subtítulos e parágrafos para notícias (até 10)
    const secoesEncontradas = []
    for (let i = 1; i <= 10; i++) {
      const subtituloKey = `subtitulo_${i}`
      const paragrafoKey = `paragrafo_${i}`
      if (postData[subtituloKey] || postData[paragrafoKey]) {
        if (postData[subtituloKey]) {
          processedData[subtituloKey] = postData[subtituloKey]
        }
        if (postData[paragrafoKey]) {
          processedData[paragrafoKey] = postData[paragrafoKey]
        }
        secoesEncontradas.push(i)
      }
    }
    console.log(`