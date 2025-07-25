// Teste simples para verificar Supabase
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function testSupabase() {
  console.log('🔍 Testando conexão com Supabase...')
  
  // Verificar variáveis de ambiente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('URL:', url ? '✅ Definida' : '❌ Não definida')
  console.log('Key:', key ? '✅ Definida' : '❌ Não definida')
  
  if (!url || !key) {
    console.log('❌ Variáveis de ambiente não configuradas')
    return
  }
  
  try {
    const supabase = createClient(url, key)
    
    // Testar conexão básica
    console.log('📡 Testando conexão...')
    const { data, error } = await supabase.from('blog_posts').select('count', { count: 'exact' }).limit(1)
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message)
      return
    }
    
    console.log('✅ Conexão Supabase OK')
    
    // Testar tabela analytics
    console.log('📊 Testando tabela analytics...')
    const { data: analyticsData, error: analyticsError } = await supabase.from('analytics').select('count', { count: 'exact' }).limit(1)
    
    if (analyticsError) {
      console.log('❌ Erro na tabela analytics:', analyticsError.message)
      console.log('💡 Tabela analytics pode não existir')
    } else {
      console.log('✅ Tabela analytics OK')
    }
    
    // Testar tabela sessions
    console.log('🔄 Testando tabela sessions...')
    const { data: sessionsData, error: sessionsError } = await supabase.from('sessions').select('count', { count: 'exact' }).limit(1)
    
    if (sessionsError) {
      console.log('❌ Erro na tabela sessions:', sessionsError.message)
      console.log('💡 Tabela sessions pode não existir')
    } else {
      console.log('✅ Tabela sessions OK')
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message)
  }
}

testSupabase() 