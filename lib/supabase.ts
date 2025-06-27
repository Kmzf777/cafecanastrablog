import { createClient } from "@supabase/supabase-js"

// Criar cliente Supabase usando as variáveis de ambiente
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Cliente para server-side (usando as mesmas credenciais)
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  conclusao: string | null

  // Campos internos
  slug: string
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

// Função para salvar post no Supabase
export async function saveBlogPost(postData: any, modo: string): Promise<BlogPost | null> {
  try {
    console.log("=== INICIANDO SALVAMENTO NO SUPABASE ===")
    console.log("postData recebido:", JSON.stringify(postData, null, 2))
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Definida" : "❌ Não definida")

    const titulo = postData.titulo || "Post sem título"
    const slug = createSlug(titulo)

    const blogPost = {
      meta_description: postData['meta name="description"'] || null,
      meta_keywords: postData['meta name="keywords"'] || null,
      og_url: postData['meta property="og:url"'] || `https://cafecanastra.com/blog/${slug}`,
      og_title: postData['meta property="og:title"'] || titulo,
      og_description: postData['meta property="og:description"'] || null,
      twitter_title: postData['meta property="twitter:title"'] || titulo,
      twitter_description: postData['meta property="twitter:description"'] || null,
      title: postData["<title>"] || `${titulo} | Blog Café Canastra`,
      titulo: titulo,
      imagem_titulo: postData["imagem titulo"] || null,
      alt_imagem_titulo: postData["alt imagem titulo"] || null,
      resumo: postData.resumo || null,
      secao_1_titulo: postData["seção 1 titulo"] || null,
      secao_1_texto: postData["seção 1 texto"] || null,
      secao_2_titulo: postData["seção 2 titulo"] || null,
      secao_2_texto: postData["seção 2 texto"] || null,
      secao_3_titulo: postData["seção 3 titulo"] || null,
      secao_3_texto: postData["seção 3 texto"] || null,
      imagem_secao_3: postData["imagem seção 3"] || null,
      alt_imagem_secao_3: postData["alt imagem seção 3"] || null,
      secao_4_titulo: postData["seção 4 titulo"] || null,
      secao_4_texto: postData["seção 4 texto"] || null,
      secao_5_titulo: postData["seção 5 titulo"] || null,
      secao_5_texto: postData["seção 5 texto"] || null,
      secao_6_titulo: postData["seção 6 titulo"] || null,
      secao_6_texto: postData["seção 6 texto"] || null,
      imagem_secao_6: postData["imagem seção 6"] || null,
      alt_imagem_secao_6: postData["alt imagem seção 6"] || null,
      secao_7_titulo: postData["seção 7 titulo"] || null,
      secao_7_texto: postData["seção 7 texto"] || null,
      secao_cta_titulo: postData["seção cta titulo"] || null,
      secao_cta_texto: postData["seção cta texto"] || null,
      conclusao: postData["Conclusão"] || postData.conclusao || null,
      slug: slug,
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

    const { data, error } = await supabaseServer
      .from("blog_posts")
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

    const { data, error } = await supabaseServer
      .from("blog_posts")
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

    const { data, error } = await supabaseServer
      .from("blog_posts")
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

    const { data, error } = await supabase
      .from("blog_posts")
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

// Função para atualizar post
export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    console.log("=== ATUALIZANDO POST ===")
    console.log("ID:", id)
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida")

    const { data, error } = await supabase
      .from("blog_posts")
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
