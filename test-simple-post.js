// Script de teste simples para criar um post básico
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente do Supabase não configuradas");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimplePost() {
  try {
    console.log("=== TESTANDO CRIAÇÃO DE POST SIMPLES ===");
    
    const testPost = {
      titulo: "Post de Teste - " + new Date().toISOString(),
      resumo: "Este é um post de teste para verificar se a criação está funcionando.",
      slug: "post-teste-" + Date.now(),
      post_type: "recipe",
      modo: "teste",
      status: "publicado",
      ingredientes_titulo: "Ingredientes",
      ingrediente_1: "250g de farinha",
      ingrediente_2: "150ml de água",
      modo_de_preparo_titulo: "Modo de Preparo",
      modo_de_preparo_1: "Misture os ingredientes",
      modo_de_preparo_2: "Deixe descansar",
      conclusao: "Post de teste criado com sucesso!"
    };
    
    console.log("Dados do post:", JSON.stringify(testPost, null, 2));
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([testPost])
      .select()
      .single();
    
    if (error) {
      console.error("❌ Erro ao criar post:", error);
      console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
    } else {
      console.log("✅ Post criado com sucesso!");
      console.log("ID:", data.id);
      console.log("Título:", data.titulo);
      console.log("Slug:", data.slug);
      console.log("Post Type:", data.post_type);
    }
    
  } catch (error) {
    console.error("❌ Erro geral:", error);
  }
}

// Executar teste
testSimplePost(); 