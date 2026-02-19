# PRD — Café Canastra: Operação SEO/GEO & Sistema de Blog

**Versão:** 1.0
**Data:** 2026-02-19
**Status:** Aprovado para Desenvolvimento
**Autor:** Morgan (PM) — Synkra AIOS
**Contexto:** Brownfield — projeto Next.js + Supabase existente

---

## 1. Visão Executiva

O site do Café Canastra possui presença digital, mas **não está aproveitando seu potencial orgânico** de busca. A marca tem um diferencial competitivo real: café especial produzido na Serra da Canastra, uma das denominações de origem mais reconhecidas do Brasil — e isso não está refletido na estrutura técnica do site nem na produção de conteúdo.

Esta operação tem dois eixos complementares:

1. **Eixo Fundação:** Otimizar tecnicamente o site existente para SEO (Google) e GEO (Generative Engine Optimization — IA como ChatGPT, Gemini, Perplexity).
2. **Eixo Crescimento:** Construir um sistema de blog editorial — com publicação agendada via painel admin — que produza conteúdo relevante e consistente para amplificar o tráfego orgânico ao longo do tempo.

O sistema de automação de blog via IA existente (não testado, baseado em web scraping + OpenAI) será **completamente removido** e substituído por um CMS simples e confiável de criação manual com agendamento via cron na VPS.

---

## 2. Contexto do Negócio

### 2.1 Produto
Café Canastra é uma marca de cafés especiais com origem na Serra da Canastra, Minas Gerais. Comercializa três linhas de produto (Clássico, Suave, Canela) em modalidades moído e grão inteiro.

### 2.2 Situação Atual
- Site Next.js funcional com homepage institucional, carrossel de produtos e mapa interativo da fazenda.
- Supabase configurado como banco de dados.
- Automação de blog baseada em IA **não testada** e não utilizada.
- Sem sistema de blog editorial ativo.
- SEO técnico básico não implementado (sem schema markup, sem sitemap dinâmico verificado, sem meta tags estruturadas por página).
- Zero produção de conteúdo para ranqueamento de palavras-chave de cauda longa.

### 2.3 Oportunidade
- Termos como "café especial serra da canastra", "café gourmet minas gerais", "café de altitude" têm volume de busca significativo e concorrência moderada.
- Conteúdo editorial (receitas, terroir, processo de torra, modos de preparo) ranqueia bem para buscas informacionais com alta intenção de compra.
- GEO: IAs generativas estão sendo consultadas para recomendações de produtos. Conteúdo estruturado e autoridade de domínio determinam se a marca aparece nessas respostas.

---

## 3. Problema a Resolver

| # | Problema | Impacto |
|---|----------|---------|
| P1 | Site não está tecnicamente otimizado para indexação | Google não ranqueia páginas sem estrutura correta |
| P2 | Sem conteúdo editorial para palavras-chave de cauda longa | Zero tráfego orgânico informacional |
| P3 | Sem schema markup para produtos e organização | Não aparece em rich snippets, não é citado por IAs |
| P4 | Automação de blog não testada ocupa espaço no codebase sem funcionar | Dívida técnica, risco de build em produção |
| P5 | Sem ferramenta para criar e agendar conteúdo | Impossível manter cadência editorial |

---

## 4. Objetivos e Métricas de Sucesso

### 4.1 Objetivos (OKRs)

**Objetivo 1: Tornar o site indexável e autoritativo**
- KR1: Google Search Console mostrando 0 erros críticos de cobertura em 30 dias
- KR2: Core Web Vitals todos em "verde" (LCP < 2.5s, FID < 100ms, CLS < 0.1) em 60 dias
- KR3: 10+ rich snippets ativos (produtos, FAQ, organização) em 60 dias

**Objetivo 2: Gerar tráfego orgânico crescente via blog**
- KR1: 12 posts publicados nos primeiros 90 dias (cadência de 1 por semana)
- KR2: 500+ visitantes/mês via blog em 6 meses
- KR3: 3+ palavras-chave do blog na primeira página do Google em 6 meses

**Objetivo 3: Aparecer nas respostas de IAs generativas (GEO)**
- KR1: Schema markup Organization, Product, BreadcrumbList implementados em 30 dias
- KR2: Conteúdo de autoridade sobre "Serra da Canastra café" rastreável por IAs em 90 dias
- KR3: Citação verificada em pelo menos 2 respostas de IA sobre cafés especiais de Minas Gerais em 6 meses

---

## 5. Usuários e Stakeholders

### 5.1 Usuário Primário do Admin
**Rafael (proprietário)** — Cria e agenda posts do blog via painel `/admin`. Não é desenvolvedor. Precisa de interface simples e sem fricção.

**Requisitos do usuário admin:**
- Criar post com título, conteúdo de texto rico, imagem e data/hora de publicação
- Ver lista de posts agendados e publicados
- Editar qualquer post antes ou depois da publicação
- Excluir posts
- Não precisar de nenhuma ação manual para que o post seja publicado no horário definido

### 5.2 Usuário Final do Site
**Consumidor de café especial** — Encontra o Café Canastra via Google ou IA generativa ao buscar informações sobre cafés de qualidade, métodos de preparo, ou origens brasileiras. Converte em compra.

---

## 6. Requisitos Funcionais

### ÉPICO 1 — Limpeza: Remoção da Automação Não Testada

**FR-1.1** Remover completamente os arquivos do sistema de automação IA:
- `services/blogGenerationService.ts`
- `services/scraperService.ts`
- `services/openaiService.ts`
- `app/api/automacaoblog/route.ts`
- `app/cafecanastrablog/page.tsx` e layout
- `scripts/scheduled-posts.js`
- `scripts/agendamento-aleatorio.js`
- `agendamento-posts.bat`
- `database/extend_blog_posts_for_automation.sql`

**FR-1.2** Remover dependências npm exclusivas da automação IA (`@mozilla/readability`, `jsdom`, `cheerio`, `openai`, `@google/genai`) que não sejam utilizadas em outras partes do sistema.

**FR-1.3** Verificar que o build (`npm run build`) passa sem erros após remoção.

---

### ÉPICO 2 — Fundação: SEO Técnico

**FR-2.1 Meta Tags por Página**
Cada página deve ter `<title>`, `<meta name="description">`, `<meta property="og:*">`, e `<link rel="canonical">` únicos e otimizados.

**FR-2.2 Schema Markup (JSON-LD)**
Implementar structured data em:
- Homepage: `Organization`, `LocalBusiness`, `WebSite` com `SearchAction`
- Página de produto: `Product` com `AggregateRating` (preparado para receber avaliações)
- Posts do blog: `Article`, `BreadcrumbList`
- FAQ na homepage: `FAQPage`

**FR-2.3 Sitemap Dinâmico**
Gerar `sitemap.xml` dinâmico via Next.js que inclua:
- Páginas estáticas (homepage, sobre, contato)
- Todos os posts do blog com status `published`
- Atualização automática a cada publicação

**FR-2.4 Robots.txt**
Arquivo `robots.txt` configurado corretamente, bloqueando `/admin` e liberando o restante.

**FR-2.5 Open Graph e Twitter Cards**
Imagens e metadados completos para compartilhamento em redes sociais, incluindo imagem do produto/post.

**FR-2.6 Core Web Vitals**
- Lazy loading de imagens não críticas
- Fontes carregadas com `font-display: swap`
- Revisão do carregamento do mapa interativo (já usa `dynamic()`)
- Verificação de LCP, FID e CLS

**FR-2.7 URLs Semânticas**
Posts do blog acessíveis em `/blog/[slug]` com slug gerado a partir do título.

---

### ÉPICO 3 — Blog: Sistema de Criação e Agendamento

**FR-3.1 Banco de Dados — Tabela `blog_posts`**

Schema da tabela:
```sql
CREATE TABLE blog_posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  content     TEXT NOT NULL,           -- HTML ou Markdown
  excerpt     TEXT,                    -- Resumo para listagem (máx 300 chars)
  image_url   TEXT,                    -- URL da imagem no Supabase Storage
  status      VARCHAR(20) DEFAULT 'draft'
              CHECK (status IN ('draft', 'scheduled', 'published')),
  scheduled_at TIMESTAMPTZ,           -- Data/hora de publicação
  published_at TIMESTAMPTZ,           -- Preenchido pelo cron ao publicar
  author      VARCHAR(100) DEFAULT 'Café Canastra',
  category    VARCHAR(100),           -- ex: 'receitas', 'terroir', 'preparo'
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**FR-3.2 Painel Admin `/admin`**

Autenticação simples via variável de ambiente (senha fixa, sem sistema de usuários complexo) protegida por middleware.

Tela de listagem (`/admin`):
- Tabela com colunas: Título | Categoria | Status | Data Agendada | Ações
- Filtro por status (todos / agendados / publicados / rascunhos)
- Botões: Novo Post | Editar | Excluir (com confirmação)
- Badge colorido por status (cinza=rascunho, amarelo=agendado, verde=publicado)

**FR-3.3 Formulário de Criação/Edição de Post (`/admin/posts/new` e `/admin/posts/[id]/edit`)**

Campos obrigatórios:
- **Título** — texto livre, máx 80 caracteres, gera slug automaticamente
- **Conteúdo** — editor de texto (textarea com suporte Markdown ou editor rico simples)
- **Imagem de capa** — upload de arquivo (JPEG/PNG/WebP, máx 5MB) via Supabase Storage
- **Data e hora de publicação** — datetime picker; se vazio = salvar como rascunho
- **Categoria** — select: Receitas / Terroir & Origem / Métodos de Preparo / Notícias / Curiosidades
- **Excerpt** — texto curto para listagem (opcional, gerado automaticamente dos primeiros 200 chars se vazio)

Campos opcionais:
- **Tags** — input com múltiplas tags
- **Alt da imagem** — texto alternativo para acessibilidade e SEO

Ações:
- Salvar como rascunho
- Salvar e agendar (requer data/hora)
- Publicar agora (publica imediatamente)

**FR-3.4 Sistema de Agendamento via Cron (VPS)**

Script Node.js (`scripts/publish-scheduled.js`) que:
1. Conecta ao Supabase
2. Busca posts com `status = 'scheduled'` E `scheduled_at <= NOW()`
3. Para cada post encontrado: atualiza `status = 'published'` e `published_at = NOW()`
4. Gera log da operação
5. Roda via cron na VPS a cada 5 minutos: `*/5 * * * * node /path/scripts/publish-scheduled.js`

Também expor endpoint `/api/publish-scheduled` para chamada manual ou webhook alternativo.

**FR-3.5 Site Público — Listagem do Blog (`/blog`)**

- Lista de posts com status `published` ordenados por `published_at DESC`
- Cards com: imagem de capa, título, excerpt, categoria, data, tempo de leitura estimado
- Paginação: 9 posts por página
- Filtro por categoria
- SEO: título da página, meta description, schema `Blog`

**FR-3.6 Site Público — Post Individual (`/blog/[slug]`)**

- Conteúdo completo renderizado (Markdown → HTML)
- Imagem de capa com alt text
- Data de publicação, autor, categoria
- Breadcrumb: Home > Blog > [Categoria] > [Título]
- Schema markup: `Article`, `BreadcrumbList`
- Posts relacionados (mesma categoria, últimos 3)
- Meta tags SEO completas (Open Graph, Twitter Card)
- Tempo estimado de leitura

**FR-3.7 Seção Blog na Homepage**

Adicionar seção "Do Nosso Blog" na homepage exibindo os 3 posts mais recentes com status `published`, com link para `/blog`.

---

### ÉPICO 4 — GEO: Otimização para IAs Generativas

**FR-4.1 Conteúdo de Autoridade Estruturado**

Criar página dedicada `/sobre/origem` com conteúdo rico e factual sobre:
- Serra da Canastra como região produtora (altitude, clima, solo)
- Processo de produção do Café Canastra (colheita, secagem, torra)
- Diferencial dos cafés especiais de altitude

**FR-4.2 FAQ Schema na Homepage**

Implementar seção FAQ na homepage com 8-10 perguntas frequentes sobre café especial, o produto e a origem, marcadas com schema `FAQPage`.

**FR-4.3 LocalBusiness e Organization Schema**

Dados completos da empresa em schema estruturado:
- Nome, descrição, endereço, telefone, URL
- Redes sociais (sameAs)
- Área de atuação
- Horários (se aplicável)

**FR-4.4 Estratégia de Palavras-chave para o Blog**

O blog deve cobrir os seguintes clusters temáticos (conteúdo a ser produzido editorialmente):

| Cluster | Exemplos de Posts |
|---------|------------------|
| Origem & Terroir | "O que é café Serra da Canastra", "Por que altitude melhora o café" |
| Métodos de Preparo | "Como fazer café coado perfeito", "Guia de moagem para cada método" |
| Receitas | "Receitas com café especial", "Affogato com café Canastra" |
| Educação sobre Café | "Diferença entre café especial e comum", "Pontuação SCA explicada" |
| Cultura Mineira | "Café e queijo da Serra da Canastra", "Tradição cafeeira de Minas" |

---

## 7. Requisitos Não-Funcionais

| # | Requisito | Especificação |
|---|-----------|--------------|
| NFR-1 | Performance | LCP < 2.5s, TTFB < 600ms, Lighthouse > 90 |
| NFR-2 | Segurança Admin | Rota `/admin` protegida por middleware + senha env |
| NFR-3 | Imagens | Upload limitado a 5MB, conversão para WebP no storage |
| NFR-4 | SEO Técnico | Sem duplicate content, canonical correto em todas as páginas |
| NFR-5 | Acessibilidade | Alt text obrigatório em imagens de posts |
| NFR-6 | Mobile-First | Todas as páginas novas responsivas |
| NFR-7 | Indexabilidade | Nenhuma página pública com `noindex` não intencional |
| NFR-8 | Cron Confiável | Script de publicação com tratamento de erro e log em arquivo |

---

## 8. Arquitetura Técnica

### 8.1 Stack (sem alterações)
- **Framework:** Next.js 16+ (App Router)
- **Banco:** Supabase (PostgreSQL + Storage para imagens)
- **Estilização:** Tailwind CSS + Radix UI
- **Deploy:** Atual (VPS ou Vercel)
- **Cron:** VPS (script Node.js puro, sem dependências extras)

### 8.2 Estrutura de Rotas Nova

```
/blog                          → Listagem pública de posts
/blog/[slug]                   → Post individual
/sobre/origem                  → Página de autoridade GEO
/admin                         → Painel admin (protegido)
/admin/posts/new               → Criar novo post
/admin/posts/[id]/edit         → Editar post

/api/posts                     → GET: lista posts publicados
/api/admin/posts               → GET/POST: CRUD admin
/api/admin/posts/[id]          → PUT/DELETE: post individual
/api/admin/upload              → POST: upload de imagem
/api/publish-scheduled         → POST: publicar posts agendados (chamado pelo cron)
```

### 8.3 Fluxo de Publicação Agendada

```
[Admin cria post com data]
  → status: 'scheduled', scheduled_at: '2026-03-01 10:00'

[Cron na VPS, a cada 5min]
  → GET /api/publish-scheduled (com CRON_SECRET header)
  → API busca: status='scheduled' AND scheduled_at <= NOW()
  → Atualiza: status='published', published_at=NOW()

[Visitante acessa /blog]
  → Query: WHERE status='published' ORDER BY published_at DESC
  → Post aparece automaticamente
```

### 8.4 Autenticação do Admin

Middleware verifica header `Cookie` com token JWT assinado. Login via `/admin/login` com senha definida em variável de ambiente `ADMIN_PASSWORD`. Sem sistema de usuários múltiplos.

### 8.5 Supabase Storage

Bucket `blog-images` com políticas:
- **Leitura:** pública (para servir imagens no site)
- **Escrita:** apenas service role (via API admin autenticada)

---

## 9. Épicos e Estimativa de Esforço

| Épico | Descrição | Prioridade | Esforço Estimado |
|-------|-----------|------------|-----------------|
| **E1** | Limpeza — Remoção da automação IA | CRÍTICO | Pequeno (1-2 stories) |
| **E2** | SEO Técnico — Meta tags, Schema, Sitemap | ALTO | Médio (3-4 stories) |
| **E3** | Blog — Admin + Site público + Cron | ALTO | Grande (5-7 stories) |
| **E4** | GEO — Conteúdo de autoridade + FAQ Schema | MÉDIO | Médio (2-3 stories) |

**Ordem de execução recomendada:** E1 → E2 → E3 → E4

---

## 10. Stories de Alto Nível (para @sm detalhar)

### E1 — Limpeza

- **Story 1.1:** Remover arquivos e dependências da automação IA, verificar build

### E2 — SEO Técnico

- **Story 2.1:** Implementar meta tags dinâmicas (title, description, OG, canonical) por página
- **Story 2.2:** Implementar schema markup (Organization, LocalBusiness, FAQPage) na homepage
- **Story 2.3:** Gerar sitemap.xml dinâmico incluindo posts do blog
- **Story 2.4:** Revisar e otimizar Core Web Vitals (imagens, fontes, carregamento)

### E3 — Blog

- **Story 3.1:** Criar tabela `blog_posts` no Supabase com RLS e Storage bucket
- **Story 3.2:** Criar autenticação do admin (middleware + login)
- **Story 3.3:** Criar painel admin — listagem de posts com filtros
- **Story 3.4:** Criar formulário de criação/edição de posts com upload de imagem
- **Story 3.5:** Criar script de cron para publicação agendada + endpoint `/api/publish-scheduled`
- **Story 3.6:** Criar páginas públicas do blog (`/blog` e `/blog/[slug]`) com SEO
- **Story 3.7:** Adicionar seção blog na homepage (3 posts mais recentes)

### E4 — GEO

- **Story 4.1:** Criar página `/sobre/origem` com conteúdo de autoridade sobre Serra da Canastra
- **Story 4.2:** Implementar schema markup Article nos posts e BreadcrumbList nas páginas internas

---

## 11. Fora do Escopo

- Geração de conteúdo por IA (removida nesta operação)
- Sistema de comentários
- Newsletter
- E-commerce / checkout (já existe em plataforma externa)
- Múltiplos usuários admin
- Analytics avançado (Google Analytics pode ser adicionado separadamente)
- Internacionalização do blog (blog em PT-BR apenas nesta fase)

---

## 12. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Remoção de arquivos quebra build | Média | Alto | Executar `npm run build` após cada remoção, antes de avançar |
| Cron na VPS falha sem notificação | Baixa | Médio | Log em arquivo + teste manual antes de ir para produção |
| Imagens muito pesadas afetam LCP | Alta | Médio | Validação de tamanho no upload (máx 5MB), servir via Supabase CDN |
| Slug duplicado ao criar posts | Baixa | Médio | Constraint UNIQUE no banco + verificação no form |

---

## 13. Critérios de Aceite Globais

- [ ] Build `npm run build` passa sem erros e sem warnings críticos
- [ ] Todas as páginas públicas passam no teste do Google Rich Results Test
- [ ] Sitemap inclui todos os posts publicados
- [ ] Admin consegue criar, editar, agendar e excluir posts sem ajuda técnica
- [ ] Post agendado aparece no site automaticamente no horário definido
- [ ] Site pontua > 90 no Lighthouse (Performance, SEO, Accessibility)
- [ ] Nenhum dado sensível (senha admin, service key) exposto no frontend

---

## 14. Definição de Pronto (Definition of Done)

Para cada story ser considerada concluída:
1. Código implementado e funcionando localmente
2. Build passa sem erros (`npm run build`)
3. Lint passa (`npm run lint`)
4. Funcionalidade testada manualmente end-to-end
5. Story file atualizada com checkboxes marcados
6. Sem secrets hardcoded no código

---

*— Morgan, planejando o futuro 📊*
*Synkra AIOS — PRD v1.0 — 2026-02-19*
