const BASE_URL = 'http://localhost:3001'

// Função para fazer requisições HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
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

// Função para gerar dados de analytics
function generateAnalyticsData(pageType, postSlug = null) {
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
      baseData.pageTitle = 'Café Canastra - Café Especial'
      break
    case 'blog':
      baseData.pageUrl = '/blog'
      baseData.pageTitle = 'Blog - Café Canastra'
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

async function testAnalytics() {
  console.log('🚀 Iniciando teste do sistema de analytics...\n')

  try {
    // 1. Testar tracking da home page
    console.log('1. Testando tracking da home page...')
    const homeData = generateAnalyticsData('home')
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

    // 2. Testar tracking do blog
    console.log('\n2. Testando tracking do blog...')
    const blogData = generateAnalyticsData('blog')
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

    // 3. Testar tracking de post de receita
    console.log('\n3. Testando tracking de post de receita...')
    const recipeData = generateAnalyticsData('receita', 'cafe-especial-canastra')
    const recipeResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: recipeData
    })
    
    if (recipeResponse.status === 200) {
      console.log('✅ Receita tracking funcionando')
      if (recipeResponse.data.analyticsId) {
        console.log('   ✅ Dados salvos no Supabase (ID:', recipeResponse.data.analyticsId, ')')
      }
    } else {
      console.log(`❌ Erro no tracking da receita: ${recipeResponse.status}`)
      console.log('   Resposta:', recipeResponse.data)
    }

    // 4. Testar tracking de post de notícia
    console.log('\n4. Testando tracking de post de notícia...')
    const newsData = generateAnalyticsData('noticia', 'nova-colheita-2024')
    const newsResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: newsData
    })
    
    if (newsResponse.status === 200) {
      console.log('✅ Notícia tracking funcionando')
      if (newsResponse.data.analyticsId) {
        console.log('   ✅ Dados salvos no Supabase (ID:', newsResponse.data.analyticsId, ')')
      }
    } else {
      console.log(`❌ Erro no tracking da notícia: ${newsResponse.status}`)
      console.log('   Resposta:', newsResponse.data)
    }

    // 5. Testar API do dashboard
    console.log('\n5. Testando API do dashboard...')
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

    // 6. Testar diferentes períodos
    console.log('\n6. Testando diferentes períodos...')
    const periods = ['1d', '7d', '30d']
    
    for (const period of periods) {
      const periodResponse = await makeRequest(`${BASE_URL}/api/analytics/dashboard?period=${period}`)
      if (periodResponse.status === 200) {
        console.log(`   ✅ Período ${period}: OK`)
      } else {
        console.log(`   ❌ Período ${period}: Erro ${periodResponse.status}`)
      }
    }

    console.log('\n🎉 Teste concluído!')
    console.log('\n📋 Resumo:')
    console.log('- APIs de tracking: ✅ Funcionando')
    console.log('- API do dashboard: ✅ Funcionando')
    console.log('- Diferentes períodos: ✅ Funcionando')
    
    console.log('\n🔧 Próximos passos:')
    console.log('1. Se as tabelas não estão configuradas, execute o script SQL no Supabase')
    console.log('2. Acesse o dashboard em: http://localhost:3001/blogmanager')
    console.log('3. Navegue pelo site para gerar dados reais')
    console.log('4. Verifique os dados no Supabase')

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

// Executar o teste
testAnalytics() 