// Teste para verificar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Verificando variáveis de ambiente...')

const variables = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'NEXT_PUBLIC_SITE_URL'
]

variables.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${varName}: Não definida`)
  }
})

// Testar Supabase especificamente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (supabaseUrl && supabaseKey) {
  console.log('\n✅ Variáveis do Supabase configuradas')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 10) + '...')
} else {
  console.log('\n❌ Variáveis do Supabase não configuradas')
  console.log('💡 Verifique o arquivo .env.local')
} 