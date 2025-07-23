// Arquivo de configuração centralizada do Supabase
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

// Função para validar configuração
export function validateSupabaseConfig() {
  const { url, anonKey } = supabaseConfig

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined. Please add it to your environment variables.")
  }

  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Please add it to your environment variables.")
  }

  // Validar formato da URL
  try {
    new URL(url)
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not a valid URL.")
  }

  // Validar se a key tem pelo menos 100 caracteres (mais flexível que verificar JWT)
  if (anonKey.length < 100) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be too short for a valid JWT token.")
  }

  return { url, anonKey }
}

// Função para debug das variáveis de ambiente
export function debugEnvironmentVariables() {
  console.log("=== SUPABASE ENVIRONMENT VARIABLES DEBUG ===")
  console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set")

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log("URL Value:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("Key length:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length)
    console.log("Key starts with:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "...")
  }

  console.log("=== END DEBUG ===")
}
