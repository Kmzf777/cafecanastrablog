const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPostCreation() {
  console.log('=== TESTANDO CRIAÇÃO DE POST E ATUALIZAÇÃO DO SITEMAP ===');
  
  try {
    // 1. Verificar sitemap antes
    console.log('\n1. Verificando sitemap antes da criação do post...');
    const beforeResponse = await fetch('http://localhost:3000/sitemap.xml');
    const beforeXml = await beforeResponse.text();
    const beforeUrlCount = (beforeXml.match(/<url>/g) || []).length;
    console.log(`URLs no sitemap antes: ${beforeUrlCount}`);
    
    // 2. Simular criação de post via webhook
    console.log('\n2. Simulando criação de post via webhook...');
    const postData = {
      titulo: "Teste de Post Automático - " + new Date().toISOString(),
      slug: "teste-post-automatico-" + Date.now(),
      post_type: "news",
      status: "publicado",
      resumo: "Este é um post de teste para verificar a atualização automática do sitemap",
      modo: "automático"
    };
    
    const webhookResponse = await fetch('http://localhost:3000/api/blog-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...postData,
        modo: "automático"
      })
    });
    
    const webhookResult = await webhookResponse.json();
    console.log('Resultado do webhook:', webhookResult);
    
    // Aguardar um pouco para a revalidação
    console.log('\n3. Aguardando revalidação...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Verificar sitemap depois
    console.log('\n4. Verificando sitemap após a criação do post...');
    const afterResponse = await fetch('http://localhost:3000/sitemap.xml');
    const afterXml = await afterResponse.text();
    const afterUrlCount = (afterXml.match(/<url>/g) || []).length;
    console.log(`URLs no sitemap depois: ${afterUrlCount}`);
    
    // 4. Verificar se o novo post aparece no sitemap
    const newPostUrl = `https://cafecanastra.com/blog/noticias/${postData.slug}`;
    const postInSitemap = afterXml.includes(newPostUrl);
    
    console.log(`\n5. Resultado da verificação:`);
    console.log(`- URLs antes: ${beforeUrlCount}`);
    console.log(`- URLs depois: ${afterUrlCount}`);
    console.log(`- Diferença: ${afterUrlCount - beforeUrlCount}`);
    console.log(`- Novo post no sitemap: ${postInSitemap ? '✅ SIM' : '❌ NÃO'}`);
    
    if (postInSitemap) {
      console.log(`- URL do novo post: ${newPostUrl}`);
    }
    
    console.log('\n✅ Teste concluído');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar o teste
testPostCreation(); 