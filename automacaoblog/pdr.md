    Como Arquiteto de Software, analisei a sua demanda. A ideia está clara o suficiente para desenharmos uma arquitetura robusta. Como você já possui um ecossistema em Next.js (React + Tailwind), a melhor abordagem não é levantar um backend Express separado, mas sim aproveitar as Route Handlers (API Routes) do Next.js (App Router) em conjunto com o Supabase.Um desafio arquitetural aqui: rodar web scraping pesado (como o Playwright) dentro de funções serverless do Next.js (como na Vercel) pode gerar problemas de timeout e limite de memória. Portanto, projetaremos a extração de dados usando cheerio e @mozilla/readability para ler o HTML estático de forma extremamente rápida e leve, passando o texto limpo para a IA.Abaixo está o Plano de Implementação Técnica (PRD) detalhado para produção.ResumoMódulo de automação de conteúdo para o projeto Café Canastra. O sistema consiste em uma interface administrativa protegida que recebe uma ou mais URLs de referência. Uma API interna em Next.js faz o web scraping dessas URLs, extrai o conteúdo principal em texto puro (ignorando menus e anúncios) e o envia como contexto para um Agente de IA (Google Gemini). A IA atua como um copywriter especialista em cafés especiais, gerando um artigo inédito, otimizado para SEO e formatado em Markdown, que é salvo automaticamente no Supabase como rascunho (draft).Stack TecnológicaRuntime: Node.js 20+ / TypeScript 5.6+Framework: Next.js 14+ (App Router) / React 18+Estilização: Tailwind CSSBanco de Dados: Supabase (PostgreSQL)Scraping: cheerio (Parsing HTML) + @mozilla/readability (Extração semântica de artigos)IA: Google Gemini (modelo gemini-2.5-flash pela velocidade e janela de contexto ampla)Estrutura de PastasFocada na integração com o seu projeto Next.js existente usando App Router:Plaintextmeu-projeto-next/
├── src/
│   ├── app/
│   │   ├── cafecanastrablog/
│   │   │   └── page.tsx                 # Interface Admin (Formulário de URLs)
│   │   ├── api/
│   │   │   └── automacaoblog/
│   │   │       └── route.ts             # Endpoint POST da Automação
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── supabase.ts                  # Cliente Supabase
│   │   └── gemini.ts                    # Configuração e Cliente da IA
│   └── services/
│       ├── scraperService.ts            # Lógica de extração de texto das URLs
│       └── blogGenerationService.ts     # Orquestração do Scraping + IA
├── .env.local
└── package.json
Dependências PrincipaisExecute a instalação destes pacotes adicionais no seu projeto:JSON{
  "dependencies": {
    "@google/genai": "^0.1.2",
    "@mozilla/readability": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "cheerio": "^1.0.0-rc.12",
    "jsdom": "^24.0.0",
    "slugify": "^1.6.6"
  },
  "devDependencies": {
    "@types/jsdom": "^21.1.6",
    "@types/mozilla-readability": "^0.2.1"
  }
}
Schema SQL (Supabase)Execute este DDL no SQL Editor do seu Supabase. Ele cria a tabela de posts, adiciona constraints de segurança e atualiza o updated_at automaticamente.SQL-- Criar extensão para UUIDs se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Posts do Blog
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    source_urls TEXT[] NOT NULL, -- Array de URLs que originaram o post
    seo_keywords VARCHAR(255)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para performance
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_status ON public.posts(status);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_modtime
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
Fluxo de Dados PrincipalPlaintext[Usuário/Admin] 
      │
      ├─ 1. Insere URL(s) em /cafecanastrablog e clica em "Gerar"
      ▼
[Next.js API Route: /api/automacaoblog]
      │
      ├─ 2. Recebe Array de URLs
      ▼
[scraperService.ts]
      │
      ├─ 3. Faz `fetch()` do HTML de cada URL
      ├─ 4. Usa `jsdom` + `Readability` para extrair apenas o texto limpo do artigo
      ▼
[blogGenerationService.ts]
      │
      ├─ 5. Compila os textos extraídos
      ├─ 6. Envia o texto + System Prompt para o Google Gemini via API
      ▼
[Google Gemini API]
      │
      ├─ 7. Processa as informações e gera Título, Slug, SEO e Conteúdo em Markdown
      ▼
[Next.js API Route]
      │
      ├─ 8. Faz o parse do JSON retornado pela IA
      ├─ 9. Salva no Supabase (Tabela `posts`)
      ▼
[Supabase (PostgreSQL)]
      │
      ├─ 10. Retorna Sucesso (ID do Post)
      ▼
[Usuário/Admin] <── 11. Exibe notificação: "Post gerado e salvo como rascunho!"
Lógica Crítica / Algoritmos EspecíficosA parte mais complexa em um ambiente Serverless é extrair o conteúdo de uma página web sem carregar um navegador inteiro. Usaremos Readability (o mesmo algoritmo do "Modo de Leitura" do Firefox) integrado com o Node.js.TypeScript// src/services/scraperService.ts
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function extractArticleFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    
    if (!response.ok) throw new Error(`Falha ao acessar ${url}`);
    
    const html = await response.text();
    const doc = new JSDOM(html, { url });
    
    // O Readability limpa menus, footers, ads e pega o sumo do texto
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    
    if (!article || !article.textContent) {
      throw new Error('Não foi possível extrair o texto principal do artigo.');
    }
    
    // Retorna o texto limpo, removendo excesso de quebras de linha
    return article.textContent.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error(`Erro no scraping da URL: ${url}`, error);
    return ""; 
  }
}
System Prompt / Personalidade da IAConfigure a API do Gemini (dentro de blogGenerationService.ts) usando este systemInstruction para garantir qualidade e consistência:PlaintextVocê é um Arquiteto de Conteúdo e Barista Sênior focado em cafés especiais, com profundo conhecimento das regiões produtoras do Brasil, especialmente a Serra da Canastra e o cerrado mineiro. 

Seu objetivo é ler textos de referência (fornecidos pelo usuário) e escrever um NOVO post para o blog 'Café Canastra'.

REGRAS ESTritas:
1. NUNCA copie e cole o texto de referência. Reescreva com suas próprias palavras, agregando valor, tom acolhedor e profissionalismo.
2. Otimize para SEO: use subtítulos (H2, H3), bullet points e parágrafos curtos.
3. Formate a saída obrigatoriamente em JSON válido com as seguintes chaves:
   - "title": Título cativante (máx 60 caracteres).
   - "slug": URL amigável em minúsculas, separada por hífens.
   - "seo_keywords": Array de 5 palavras-chave.
   - "content": O conteúdo completo do blog formatado nativamente em Markdown.

Tom de voz: Apaixonado por café, sofisticado mas acessível, com leve sotaque e orgulho da cultura mineira de excelência.
EndpointsMétodoRotaDescriçãoContent-TypePOST/api/automacaoblogRecebe array de URLs, executa web scraping paralelo, aciona LLM, salva no Supabase e retorna os dados do post criado.application/jsonExemplo de Payload de Requisição:JSON{
  "urls": [
    "https://blog.concorrente.com/tudo-sobre-cafe-bourbon",
    "https://site.com/noticias-safra-2024"
  ]
}
Variáveis de Ambiente (.env.local)Adicione estas chaves ao seu ambiente local e de produção na Vercel:Snippet de código# Supabase
NEXT_PUBLIC_SUPABASE_URL="sua_url_aqui"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_anon_key_aqui"
SUPABASE_SERVICE_ROLE_KEY="sua_service_key_aqui" # Use a Service Role para operações de backend seguras

# Inteligência Artificial (Gemini)
GEMINI_API_KEY="sua_chave_api_do_google_aqui"
Ordem de ImplementaçãoSetup do Banco de Dados: Execute o DDL no Supabase para criar a tabela posts.Variáveis de Ambiente: Configure as chaves do Supabase e do Gemini no .env.local.Serviço de Scraping: Crie o arquivo src/services/scraperService.ts implementando a função de extração via jsdom e Readability.Serviço de IA: Crie o src/services/blogGenerationService.ts que instancia o cliente do Gemini, envia o System Prompt, recebe o JSON com o conteúdo gerado e insere no Supabase utilizando a biblioteca oficial (@supabase/supabase-js).Criação do Endpoint (Backend): Implemente app/api/automacaoblog/route.ts para conectar o serviço de scraping e o serviço de IA em um único fluxo validado.Criação da Interface Admin (Frontend): Desenvolva a página app/cafecanastrablog/page.tsx com um input/textarea para múltiplas URLs, estado de loading, botão de ação e tratamento de erro/sucesso visual.Verificação FinalPara garantir que o sistema está End-to-End ready, siga este checklist:Testar Scraping Isolado: Passe a URL de um artigo complexo e verifique se o serviço retorna apenas o texto do artigo (sem footer/header).Testar Geração da IA: Verifique se a IA não está alucinando e se está respeitando o contrato de saída JSON exigido (evitando que o parse quebre a API).Persistência de Dados: Após o disparo via front-end, verifique o Table Editor do Supabase se a linha foi criada corretamente com status = 'draft' e se o campo content possui o Markdown íntegro.Tratamento de Exceções: Tente inserir uma URL quebrada. O sistema deve ignorar a URL falha, tentar processar as outras (se houver), e se não houver texto útil, o frontend deve exibir a mensagem: "Não foi possível extrair conteúdo das fontes fornecidas".