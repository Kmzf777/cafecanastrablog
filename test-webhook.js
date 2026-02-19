// Script de teste para o webhook
const testData = {
  post_type: "recipe",
  titulo: "Teste de Receita - Pizza de Café",
  resumo: "Esta é uma receita de teste para verificar se o webhook está funcionando.",
  ingredientes_titulo: "Ingredientes",
  ingrediente_1: "250g de farinha de trigo",
  ingrediente_2: "150ml de água morna",
  modo_de_preparo_titulo: "Modo de Preparo",
  modo_de_preparo_1: "Misture todos os ingredientes",
  modo_de_preparo_2: "Deixe descansar por 1 hora",
  conclusao: "Esta é uma receita de teste."
};

async function testWebhook() {
  try {
    console.log("=== TESTANDO WEBHOOK ===");
    console.log("Dados de teste:", JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/blog-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modo: "teste",
        ...testData
      }),
    });
    
    const result = await response.json();
    console.log("Resposta do webhook:", JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log("✅ Webhook funcionando!");
      console.log(`Posts criados: ${result.createdPosts}`);
    } else {
      console.log("❌ Erro no webhook:", result.error);
    }
  } catch (error) {
    console.error("❌ Erro ao testar webhook:", error);
  }
}

// Executar teste se o script for chamado diretamente
if (typeof window === 'undefined') {
  testWebhook();
} 