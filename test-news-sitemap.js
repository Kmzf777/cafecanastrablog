const https = require('https');
const { parseString } = require('xml2js');

// Função para fazer requisição HTTPS com suporte a redirecionamentos
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      // Se receber redirecionamento, seguir automaticamente
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Função para testar o sitemap de notícias
async function testNewsSitemap() {
  console.log('🔍 Testando sitemap de notícias...\n');
  
  try {
    // Testar sitemap principal
    console.log('1. Testando sitemap principal...');
    const mainSitemap = await fetchUrl('https://cafecanastra.com/sitemap.xml');
    console.log(`   Status: ${mainSitemap.statusCode}`);
    
    if (mainSitemap.statusCode === 200) {
      console.log('   ✅ Sitemap principal acessível');
    } else {
      console.log('   ❌ Erro no sitemap principal');
    }
    
    // Testar sitemap de notícias
    console.log('\n2. Testando sitemap de notícias...');
    const newsSitemap = await fetchUrl('https://cafecanastra.com/sitemap-news.xml');
    console.log(`   Status: ${newsSitemap.statusCode}`);
    
    if (newsSitemap.statusCode === 200) {
      console.log('   ✅ Sitemap de notícias acessível');
      
      // Verificar se é XML válido
      try {
        parseString(newsSitemap.data, (err, result) => {
          if (err) {
            console.log('   ❌ XML inválido:', err.message);
          } else {
            console.log('   ✅ XML válido');
            
            // Contar URLs de notícias
            if (result.urlset && result.urlset.url) {
              const newsUrls = result.urlset.url.filter(url => 
                url.loc && url.loc[0].includes('/blog/noticias/')
              );
              console.log(`   📰 ${newsUrls.length} notícias encontradas`);
              
              // Mostrar algumas URLs de exemplo
              if (newsUrls.length > 0) {
                console.log('\n   Exemplos de URLs:');
                newsUrls.slice(0, 3).forEach((url, index) => {
                  console.log(`   ${index + 1}. ${url.loc[0]}`);
                });
              }
            }
          }
        });
      } catch (parseError) {
        console.log('   ❌ Erro ao parsear XML:', parseError.message);
      }
    } else {
      console.log('   ❌ Erro no sitemap de notícias');
    }
    
    // Testar robots.txt
    console.log('\n3. Testando robots.txt...');
    const robots = await fetchUrl('https://cafecanastra.com/robots.txt');
    console.log(`   Status: ${robots.statusCode}`);
    
    if (robots.statusCode === 200) {
      console.log('   ✅ Robots.txt acessível');
      
      // Verificar se sitemap está listado
      if (robots.data.includes('sitemap-news.xml')) {
        console.log('   ✅ Sitemap de notícias listado no robots.txt');
      } else {
        console.log('   ❌ Sitemap de notícias não encontrado no robots.txt');
      }
    } else {
      console.log('   ❌ Erro no robots.txt');
    }
    
    // Testar uma URL de notícia
    console.log('\n4. Testando URL de notícia...');
    const testNewsUrl = 'https://cafecanastra.com/blog/noticias';
    const newsPage = await fetchUrl(testNewsUrl);
    console.log(`   Status: ${newsPage.statusCode}`);
    
    if (newsPage.statusCode === 200) {
      console.log('   ✅ Página de notícias acessível');
    } else {
      console.log('   ❌ Erro na página de notícias');
    }
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Executar testes
testNewsSitemap().then(() => {
  console.log('\n🎉 Testes concluídos!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure o Google Publisher Center');
  console.log('2. Adicione o sitemap de notícias');
  console.log('3. Submeta para revisão');
  console.log('4. Monitore no Google Search Console');
}); 