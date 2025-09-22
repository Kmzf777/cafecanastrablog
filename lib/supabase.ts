import { createClient } from "@supabase/supabase-js"

// Verificar se as variáveis de ambiente estão disponíveis
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Criar cliente Supabase usando as variáveis de ambiente (somente se configuradas)
export const supabase = isSupabaseConfigured 
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null

// Cliente para server-side (usando as mesmas credenciais)
export const supabaseServer = isSupabaseConfigured
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  : null

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
    console.log(`Seções encontradas: ${secoesEncontradas.length} (${secoesEncontradas.join(', ')})`)
  }
  
  // Manter compatibilidade com formato antigo (seções numeradas)
  for (let i = 1; i <= 7; i++) {
    const tituloKey = `seção ${i} titulo`
    const textoKey = `seção ${i} texto`
    const imagemKey = `imagem seção ${i}`
    const altImagemKey = `alt imagem seção ${i}`
    
    if (postData[tituloKey]) {
      processedData[`secao_${i}_titulo`] = postData[tituloKey]
    }
    if (postData[textoKey]) {
      processedData[`secao_${i}_texto`] = postData[textoKey]
    }
    if (postData[imagemKey]) {
      processedData[`imagem_secao_${i}`] = postData[imagemKey]
    }
    if (postData[altImagemKey]) {
      processedData[`alt_imagem_secao_${i}`] = postData[altImagemKey]
    }
  }
  
  // Seções CTA
  processedData.secao_cta_titulo = postData["seção cta titulo"] || null
  processedData.secao_cta_texto = postData["seção cta texto"] || null
  
  console.log("=== DADOS PROCESSADOS FINAL ===")
  console.log("Campos principais:", {
    titulo: processedData.titulo,
    slug: processedData.slug,
    post_type: processedData.post_type,
    resumo: processedData.resumo ? "Sim" : "Não",
    conclusao: processedData.conclusao ? "Sim" : "Não"
  })
  
  return processedData
}

// Função para salvar post no Supabase
export async function saveBlogPost(postData: any, modo: string): Promise<BlogPost | null> {
  try {
    console.log("=== INICIANDO SALVAMENTO NO SUPABASE ===")
    console.log("postData recebido:", JSON.stringify(postData, null, 2))
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Definida" : "❌ Não definida")

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, não é possível salvar post")
      return null
    }

    // Processar dados do webhook
    const processedData = processWebhookData(postData)
    console.log("Dados processados:", JSON.stringify(processedData, null, 2))

    const blogPost = {
      ...processedData,
      modo: modo as "automático" | "personalizado",
      status: "publicado" as const,
    }

    console.log("blogPost final a ser salvo:", JSON.stringify(blogPost, null, 2))

    const { data, error } = await supabase.from("blog_posts").insert([blogPost]).select().single()

    if (error) {
      console.error("❌ Erro ao salvar post no Supabase:", error)
      return null
    }

    console.log("✅ Post salvo com sucesso:", data)
    return data
  } catch (error) {
    console.error("❌ Erro ao processar post:", error)
    return null
  }
}

// Função para buscar todos os posts publicados (server-side)
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    console.log("=== BUSCANDO POSTS PUBLICADOS ===")
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabaseServer) {
      console.log("❌ Supabase não configurado, retornando array vazio")
      return []
    }

    const { data, error } = await supabaseServer.from("blog_posts")
      .select("*")
      .eq("status", "publicado")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar posts:", error)
      return []
    }

    console.log(`✅ ${data?.length || 0} posts encontrados`)
    return data || []
  } catch (error) {
    console.error("❌ Erro ao buscar posts:", error)
    return []
  }
}

// Função para buscar post por slug (server-side)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log("=== BUSCANDO POST POR SLUG ===")
    console.log("Slug:", slug)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabaseServer) {
      console.log("❌ Supabase não configurado, retornando null")
      return null
    }

    const { data, error } = await supabaseServer.from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "publicado")
      .single()

    if (error) {
      console.error("❌ Erro ao buscar post por slug:", error)
      return null
    }

    console.log("✅ Post encontrado:", data?.titulo)
    return data
  } catch (error) {
    console.error("❌ Erro ao buscar post por slug:", error)
    return null
  }
}

// Função para buscar posts recentes (server-side)
export async function getRecentPosts(limit = 4): Promise<BlogPost[]> {
  try {
    console.log("=== BUSCANDO POSTS RECENTES (SERVER) ===")
    console.log("Limit:", limit)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabaseServer) {
      console.log("❌ Supabase não configurado, retornando array vazio")
      return []
    }

    const { data, error } = await supabaseServer.from("blog_posts")
      .select("id, titulo, slug, created_at")
      .eq("status", "publicado")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("❌ Erro ao buscar posts recentes:", error)
      return []
    }

    console.log(`✅ ${data?.length || 0} posts recentes encontrados`)
    return data || []
  } catch (error) {
    console.error("❌ Erro ao buscar posts recentes:", error)
    return []
  }
}

// Função para buscar posts recentes (client-side)
export async function getRecentPostsClient(limit = 4): Promise<BlogPost[]> {
  try {
    console.log("=== BUSCANDO POSTS RECENTES (CLIENT) ===")
    console.log("Limit:", limit)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, retornando array vazio")
      return []
    }

    // Buscar todos os campos relevantes para o cálculo correto do tempo de leitura
    const { data, error } = await supabase.from("blog_posts")
      .select("*") // Buscar todos os campos
      .eq("status", "publicado")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("❌ Erro ao buscar posts recentes:", error)
      return []
    }

    console.log(`✅ ${data?.length || 0} posts recentes encontrados`)
    return data || []
  } catch (error) {
    console.error("❌ Erro ao buscar posts recentes:", error)
    return []
  }
}

// Função para atualizar post
export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    console.log("=== ATUALIZANDO POST ===")
    console.log("ID:", id)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, não é possível atualizar post")
      return null
    }

    const { data, error } = await supabase.from("blog_posts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Erro ao atualizar post:", error)
      return null
    }

    console.log("✅ Post atualizado:", data?.titulo)
    return data
  } catch (error) {
    console.error("❌ Erro ao atualizar post:", error)
    return null
  }
}

// Função para deletar post
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    console.log("=== DELETANDO POST ===")
    console.log("ID:", id)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, não é possível deletar post")
      return false
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("❌ Erro ao deletar post:", error)
      return false
    }

    console.log("✅ Post deletado com sucesso")
    return true
  } catch (error) {
    console.error("❌ Erro ao deletar post:", error)
    return false
  }
}

// Função para buscar todos os posts (incluindo rascunhos) - para admin
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    console.log("=== BUSCANDO TODOS OS POSTS (ADMIN) ===")
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, retornando array vazio")
      return []
    }

    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro ao buscar todos os posts:", error)
      return []
    }

    console.log(`✅ ${data?.length || 0} posts encontrados (incluindo rascunhos)`)
    return data || []
  } catch (error) {
    console.error("❌ Erro ao buscar todos os posts:", error)
    return []
  }
}

// Função de teste para verificar conexão
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log("=== TESTANDO CONEXÃO SUPABASE ===")
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Definida" : "❌ Não definida")

    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, conexão falhou")
      return false
    }

    const { data, error } = await supabase.from("blog_posts").select("count", { count: "exact" }).limit(1)

    if (error) {
      console.error("❌ Erro na conexão:", error)
      return false
    }

    console.log("✅ Conexão Supabase OK")
    return true
  } catch (error) {
    console.error("❌ Erro ao testar conexão:", error)
    return false
  }
}


// Função para upload de imagem no Supabase Storage
export async function uploadImageToStorage(file: File, postId: string): Promise<string | null> {
  try {
    if (!isSupabaseConfigured || !supabase) {
      console.log("❌ Supabase não configurado, não é possível fazer upload")
      return null
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `blog/${postId}/${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('blog-images') // nome do bucket
      .upload(filePath, file)
    if (error) {
      console.error('Erro ao fazer upload da imagem:', JSON.stringify(error, null, 2))
      return null
    }
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath)
    return publicUrlData?.publicUrl || null
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    return null
  }
}
