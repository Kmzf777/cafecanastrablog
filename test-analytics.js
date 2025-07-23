const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3001';

console.log('=== TESTANDO SISTEMA DE ANALYTICS ===\n');

// Função para fazer requisições HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Função para simular dados de analytics
function generateAnalyticsData(pageType, slug = null) {
  const baseData = {
    pageType,
    url: slug ? `/${pageType}/${slug}` : `/${pageType}`,
    title: `Test ${pageType} page`,
    referrer: 'https://www.google.com',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    language: 'pt-BR',
    screenResolution: '1920x1080',
    timezone: 'America/Sao_Paulo',
    timestamp: new Date().toISOString()
  };

  if (slug) {
    baseData.slug = slug;
  }

  return baseData;
}

async function testAnalytics() {
  try {
    // 1. Testar tracking da home page
    console.log('1. Testando tracking da home page...');
    const homeData = generateAnalyticsData('home');
    const homeResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: homeData
    });
    
    if (homeResponse.status === 200) {
      console.log('✅ Home page tracking funcionando');
    } else {
      console.log(`❌ Erro no tracking da home page: ${homeResponse.status}`);
      console.log('Resposta:', homeResponse.data);
    }

    // 2. Testar tracking do blog
    console.log('\n2. Testando tracking do blog...');
    const blogData = generateAnalyticsData('blog');
    const blogResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: blogData
    });
    
    if (blogResponse.status === 200) {
      console.log('✅ Blog tracking funcionando');
    } else {
      console.log(`❌ Erro no tracking do blog: ${blogResponse.status}`);
      console.log('Resposta:', blogResponse.data);
    }

    // 3. Testar tracking de post de receita
    console.log('\n3. Testando tracking de post de receita...');
    const recipeData = generateAnalyticsData('receita', 'cafe-especial-canastra');
    const recipeResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: recipeData
    });
    
    if (recipeResponse.status === 200) {
      console.log('✅ Receita tracking funcionando');
    } else {
      console.log(`❌ Erro no tracking da receita: ${recipeResponse.status}`);
      console.log('Resposta:', recipeResponse.data);
    }

    // 4. Testar tracking de post de notícia
    console.log('\n4. Testando tracking de post de notícia...');
    const newsData = generateAnalyticsData('noticia', 'nova-colheita-2024');
    const newsResponse = await makeRequest(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      body: newsData
    });
    
    if (newsResponse.status === 200) {
      console.log('✅ Notícia tracking funcionando');
    } else {
      console.log(`❌ Erro no tracking da notícia: ${newsResponse.status}`);
      console.log('Resposta:', newsResponse.data);
    }

    // 5. Testar busca de dados do dashboard
    console.log('\n5. Testando busca de dados do dashboard...');
    const dashboardResponse = await makeRequest(`${BASE_URL}/api/analytics/dashboard`);
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard funcionando');
      console.log('Dados do dashboard:', JSON.stringify(dashboardResponse.data, null, 2));
    } else {
      console.log(`❌ Erro ao buscar dados do dashboard: ${dashboardResponse.status}`);
      console.log('Resposta:', dashboardResponse.data);
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar testes
testAnalytics().then(() => {
  console.log('\n=== TESTE CONCLUÍDO ===');
}); 