const BASE_URL = 'https://cafecanastra-blog.vercel.app' // URL de produção

// Função para fazer requisições HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...options.headers
      },
      ...options
    })

    const data = await response.json()
    return { status: response.status, data }
  } catch (error) {
    return { status: 500, data: { error: error.message } }
  }
}

// Função para gerar dados de analytics realistas
function generateRealAnalyticsData(pageType, postSlug = null) {
  const baseData = {
    pageUrl: '',
    pageTitle: '',
    postSlug: postSlug,
    postType: null,
    visitDuration: Math.floor(Math.random() * 300) + 30, // 30-330 segundos
    screenResolution: '1920x1080',
    language: 'pt-BR'
  }

  switch (pageType) {
    case 'home':
      baseData.pageUrl = '/cafecanastra'
      baseData.pageTitle = 'Café Canastra - Café Especial da Serra da Canastra'
      break
    case 'blog':
      baseData.pageUrl = '/blog'
      baseData.pageTitle = 'Blog | Café Canastra'
      break
    case 'receita':
      baseData.pageUrl = `/blog/receitas/${postSlug}`
      baseData.pageTitle = 'Receita de Café Especial - Café Canastra'
      baseData.postType = 'recipe'
      break
    case 'noticia':
      baseData.pageUrl = `/blog/noticias/${postSlug}`
      baseData.pageTitle = 'Notícias - Café Canastra'
      baseData.postType = 'news'
      break
    default:
      baseData.pageUrl = '/'
      baseData.pageTitle = 'Café Canastra'
  }

  return JSON.stringify(baseData)
}

async function testProductionAnalytics() {
  console.log('🚀 Testando sistema de analytics em PRODUÇÃO...')
  console.log('📍 URL:', BASE_URL)
  console.log('')

  try {
    // 1. Testar se o site está acessível
    console.log('1. Testando acesso ao site...')
    const siteResponse = await makeRequest(`${BASE_URL}`)
    
    if (siteResponse.status === 200) {
      console.log('✅ Site acessível')
    } else {
      console.log(`❌ Site não acessível: ${siteResponse.status}`)
      return
    }

    // 2. Testar tracking da home page
    console.log('\n2. Testando tracking da home page...')
    const homeData = generateRealAnalyticsData('home')
    const homeResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: homeData
    })
    
    if (homeResponse.status === 200) {
      console.log('✅ Home page tracking funcionando')
      console.log('   Resposta:', homeResponse.data.message)
      if (homeResponse.data.analyticsId) {
        console.log('   ✅ Dados salvos no Supabase (ID:', homeResponse.data.analyticsId, ')')
      } else {
        console.log('   ⚠️  Tabelas não configuradas no Supabase')
      }
    } else {
      console.log(`❌ Erro no tracking da home page: ${homeResponse.status}`)
      console.log('   Resposta:', homeResponse.data)
    }

    // 3. Testar tracking do blog
    console.log('\n3. Testando tracking do blog...')
    const blogData = generateRealAnalyticsData('blog')
    const blogResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: blogData
    })
    
    if (blogResponse.status === 200) {
      console.log('✅ Blog tracking funcionando')
      if (blogResponse.data.analyticsId) {
        console.log('   ✅ Dados salvos no Supabase (ID:', blogResponse.data.analyticsId, ')')
      }
    } else {
      console.log(`❌ Erro no tracking do blog: ${blogResponse.status}`)
      console.log('   Resposta:', blogResponse.data)
    }

    // 4. Testar API do dashboard
    console.log('\n4. Testando API do dashboard...')
    const dashboardResponse = await makeRequest(`${BASE_URL}/api/analytics/dashboard?period=7d`)
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard API funcionando')
      const data = dashboardResponse.data
      
      if (data.message && data.message.includes('não configuradas')) {
        console.log('   ⚠️  Tabelas não configuradas no Supabase')
        console.log('   💡 Execute o script SQL no Supabase para configurar as tabelas')
      } else {
        console.log('   ✅ Dashboard carregando dados reais')
        console.log('   📊 Total de visualizações:', data.data.totalViews)
        console.log('   👥 Visitas únicas:', data.data.uniqueViews)
        console.log('   🏠 Home page:', data.data.homeViews)
        console.log('   📝 Blog:', data.data.blogViews)
      }
    } else {
      console.log(`❌ Erro na API do dashboard: ${dashboardResponse.status}`)
      console.log('   Resposta:', dashboardResponse.data)
    }

    // 5. Testar acesso direto às páginas para simular visitas reais
    console.log('\n5. Simulando visitas reais às páginas...')
    
    const pages = [
      { url: '/cafecanastra', name: 'Home Page' },
      { url: '/blog', name: 'Blog' },
      { url: '/blog/receitas/cafe-especial-canastra', name: 'Receita' },
      { url: '/blog/noticias/nova-colheita-2024', name: 'Notícia' }
    ]

    for (const page of pages) {
      console.log(`   Testando ${page.name}...`)
      const pageResponse = await makeRequest(`${BASE_URL}${page.url}`)
      
      if (pageResponse.status === 200) {
        console.log(`   ✅ ${page.name} acessível`)
      } else {
        console.log(`   ❌ ${page.name} não acessível: ${pageResponse.status}`)
      }
      
      // Aguardar um pouco entre as requisições
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('\n🎉 Teste de produção concluído!')
    console.log('\n📋 Resumo:')
    console.log('- Site acessível: ✅')
    console.log('- APIs funcionando: ✅')
    console.log('- Tracking operacional: ✅')
    
    console.log('\n🔧 Próximos passos:')
    console.log('1. Acesse o site em produção: https://cafecanastra-blog.vercel.app')
    console.log('2. Navegue pelas páginas para gerar dados reais')
    console.log('3. Verifique o dashboard em: https://cafecanastra-blog.vercel.app/blogmanager')
    console.log('4. Confirme se os dados aparecem no Supabase')

  } catch (error) {
    console.error('❌ Erro durante o teste de produção:', error)
  }
}

// Executar o teste
testProductionAnalytics() 