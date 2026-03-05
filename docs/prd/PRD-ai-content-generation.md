# PRD — Cafe Canastra: AI Content Generation Module

**Versao:** 1.0
**Data:** 2026-03-05
**Status:** Draft — Aguardando Aprovacao
**Autor:** Morgan (PM) — Synkra AIOS
**Contexto:** Feature — Modulo novo sobre a base existente (Block Editor + SEO/GEO)
**Baseado em:** Analise do @analyst Atlas (2026-03-05)
**PRD Relacionado:** PRD-block-editor-seo-geo-v2.md (implementado)

---

## 1. Visao Executiva

O blog do Cafe Canastra possui um editor de blocos completo com 16 tipos de blocos, scoring SEO em tempo real e configuracao GEO avancada. Porem, **todo o conteudo e criado manualmente**, o que limita:

- **Velocidade de producao:** Criar um post completo leva 30-60 minutos
- **Consistencia SEO:** Depende do conhecimento do editor sobre boas praticas
- **Escala:** Impossivel manter frequencia de publicacao alta sem equipe dedicada
- **Aproveitamento de fontes:** Reescrever conteudo de referencia e manual e tedioso

**A solucao propoe:**

1. **Gerador de Conteudo IA:** Interface dedicada para gerar posts completos a partir de um tema + referencia opcional (URL)
2. **Scraping Inteligente:** Extracao automatica de conteudo de URLs para usar como referencia contextual
3. **Output em Blocos:** A IA gera diretamente no formato de blocos do editor existente, com SEO/GEO pre-configurado
4. **Fluxo de Revisao:** Preview antes de publicar, com opcao de editar no editor de blocos existente

---

## 2. Contexto do Negocio

### 2.1 Produto
Cafe Canastra e uma marca de cafes especiais da Serra da Canastra, MG. O blog e o canal principal de marketing de conteudo, atraindo trafego organico para conversao em vendas.

### 2.2 Situacao Atual
- **Editor:** Block Editor completo com 16 tipos de blocos, drag-and-drop, Tiptap rich text
- **SEO:** Score em tempo real (0-100), meta tags, focus keyword, structured data
- **GEO:** Entidades semanticas, speakable selectors, target region
- **Publicacao:** Draft → Scheduled → Published, com auto-save
- **IA:** Nenhuma integracao — 100% manual

### 2.3 Oportunidade

| # | Oportunidade | Impacto Esperado |
|---|-------------|-----------------|
| O1 | Gerar posts em segundos vs. 30-60 min | 10-20x mais rapido |
| O2 | SEO/GEO automatico na geracao | Score medio > 80 vs. ~60 manual |
| O3 | Referencia por URL elimina pesquisa manual | Conteudo mais rico e factual |
| O4 | Custo por post ~R$0.008 (Gemini 2.5 Flash) | Praticamente gratuito |

---

## 3. Objetivos e Metricas

### 3.1 Objetivos

| ID | Objetivo | Prazo |
|----|---------|-------|
| OBJ-1 | Permitir geracao de posts completos via IA em < 30 segundos | MVP |
| OBJ-2 | Posts gerados devem ter SEO score >= 75 por padrao | MVP |
| OBJ-3 | Scraping de URL funcional para blogs e noticias comuns | MVP |
| OBJ-4 | Fluxo completo: gerar → preview → editar/aprovar | MVP |

### 3.2 Metricas de Sucesso

| Metrica | Target | Como Medir |
|---------|--------|-----------|
| Tempo de geracao (tema → preview) | < 30s | Timestamp no frontend |
| SEO score medio de posts gerados | >= 75/100 | SEO Scorer existente |
| Taxa de aprovacao sem edicao | >= 30% | Tracking de fluxo |
| Taxa de aprovacao com edicao | >= 90% | Tracking de fluxo |
| Erros de parsing (blocos invalidos) | < 5% | Logs de validacao |

---

## 4. Requisitos Funcionais

### FR-1: Pagina de Geracao de Conteudo

**Rota:** `/admin/posts/generate`

**Interface:**
- Campo TextArea: "Tema do Post" (obrigatorio)
  - Placeholder: "Ex: Processo de torra do cafe especial na Serra da Canastra"
  - Minimo 10 caracteres, maximo 500
- Campo Input Text: "URL de Referencia" (opcional)
  - Placeholder: "https://exemplo.com/artigo-sobre-cafe"
  - Validacao de URL valida
  - Indicador visual de que e opcional
- Botao "Gerar Post"
  - Estado de loading com progress indicator durante geracao
  - Desabilitado enquanto tema estiver vazio

**Acesso:** Botao "New Post with AI" no AdminDashboard, ao lado do "New Post" existente

### FR-2: Scraping de URL

**Endpoint:** `POST /api/admin/ai/scrape`

**Input:** `{ url: string }`

**Comportamento:**
- Faz fetch da URL informada
- Extrai conteudo principal (tag `<article>`, `<main>`, ou `<body>`)
- Remove elementos irrelevantes: `<nav>`, `<footer>`, `<aside>`, `<script>`, `<style>`, ads
- Extrai: titulo da pagina, meta description, conteudo textual limpo
- Limita output a 10.000 caracteres (budget de contexto)
- Timeout: 15 segundos

**Output:**
```typescript
{
  success: boolean
  title?: string
  description?: string
  content?: string
  error?: string
}
```

**Tratamento de erros:**
- URL inacessivel → mensagem amigavel, continua geracao sem referencia
- Timeout → mensagem amigavel, continua geracao sem referencia
- Conteudo vazio → mensagem amigavel, continua geracao sem referencia

**Tecnologia:** `fetch` + `cheerio` (parsing HTML leve — sem Playwright)

### FR-3: Geracao de Post com IA

**Endpoint:** `POST /api/admin/ai/generate`

**Input:**
```typescript
{
  theme: string          // Tema do post (obrigatorio)
  referenceContent?: {   // Conteudo do scraping (opcional)
    title: string
    description: string
    content: string
  }
  locale?: string        // pt | en | es (default: pt)
}
```

**LLM:** Google Gemini 2.5 Flash (`gemini-2.5-flash`)

**SDK:** `@google/genai`

**Prompt Strategy:**

O prompt deve instruir o modelo a gerar um JSON com:

1. **Metadata do post:**
   - `title` (50-70 caracteres, keyword-rich)
   - `excerpt` (120-160 caracteres)
   - `slug` (URL-friendly, gerado do titulo)
   - `category` (uma das categorias existentes: Receitas, Dicas, Sobre o Cafe, Sustentabilidade, Cultura do Cafe, Noticias)
   - `tags` (3-5 tags relevantes)
   - `seo_config`:
     - `meta_title` (50-60 chars)
     - `meta_description` (120-155 chars)
     - `focus_keyword` (palavra-chave principal)
     - `secondary_keywords` (3-5 palavras-chave)
     - `og_title`, `og_description`
   - `geo_config`:
     - `target_region` ("Serra da Canastra")
     - `target_city` ("Sao Roque de Minas")
     - `target_state` ("Minas Gerais")
     - `target_country` ("Brasil")
     - `local_business_name` ("Cafe Canastra")
     - `local_business_type` ("CafeOrCoffeeShop")

2. **Blocos de conteudo (8-15 blocos):**
   - `heading` (H1) — titulo principal
   - `paragraph` — introducao engajante (hook)
   - `heading` (H2) — primeira secao
   - `paragraph` — desenvolvimento com focus keyword
   - `callout` (tip/info) — dica relevante
   - `heading` (H2) — segunda secao
   - `paragraph` — mais conteudo
   - `quote` — citacao relevante (quando aplicavel)
   - `heading` (H2) — terceira secao (quando aplicavel)
   - `paragraph` — conteudo adicional
   - `faq` — 3-5 perguntas frequentes (otimo para SEO/GEO)
   - `cta` — call to action final

3. **Regras SEO no prompt:**
   - Focus keyword no H1, primeiro paragrafo, pelo menos um H2, e meta description
   - Keyword density: 1-2%
   - Paragrafos curtos (2-3 frases)
   - Word count total: 800-1500 palavras
   - Pelo menos 3 headings H2
   - FAQ com schema potential
   - Linguagem acessivel e engajante

4. **Regras GEO no prompt:**
   - Mencionar Serra da Canastra, Minas Gerais naturalmente no conteudo
   - Incluir entidades semanticas relevantes (cafe especial, torra, origem, terroir)
   - Estrutura citavel (frases curtas e declarativas que AI engines podem extrair)
   - Formato adequado para AI Overviews e Perplexity

5. **Quando URL de referencia fornecida:**
   - Usar como inspiracao para tom, estrutura e fatos
   - NAO copiar — reescrever com perspectiva original da marca Cafe Canastra
   - Citar dados/estatisticas quando relevante, atribuindo a fonte

**Output:**
```typescript
{
  success: boolean
  post: {
    title: string
    excerpt: string
    slug: string
    category: string
    tags: string[]
    seo_config: SeoConfig
    geo_config: GeoConfig
  }
  blocks: ContentBlock[]
  error?: string
}
```

**Configuracao do modelo:**
- `temperature`: 0.7 (criativo mas consistente)
- `responseMimeType`: "application/json" (JSON nativo)
- `responseSchema`: schema TypeScript dos blocos (garante output valido)

### FR-4: Preview do Post Gerado

**Rota:** `/admin/posts/generate/preview`

**Comportamento:**
- Recebe os dados gerados (via state/query param com postId)
- Salva automaticamente como draft no Supabase ao chegar na preview
- Renderiza o post completo usando os componentes de renderizacao existentes do blog
- Exibe SEO score calculado
- Exibe metadata (titulo, excerpt, categoria, tags)

**Acoes:**
- Botao "Editar" → redireciona para `/admin/posts/[id]/edit` (editor de blocos existente com o post pre-carregado)
- Botao "Aprovar e Publicar" → PATCH status para 'published', redireciona para dashboard
- Botao "Salvar como Rascunho" → mantem status 'draft', redireciona para dashboard
- Botao "Descartar" → deleta o draft, volta para `/admin/posts/generate`

### FR-5: Integracao com Dashboard

**AdminDashboard existente:**
- Adicionar botao "Gerar com IA" ao lado do botao "Novo Post" existente
- Visual diferenciado (icone de IA/sparkles) para distinguir do fluxo manual
- Mesmo nível de destaque que o botao manual

---

## 5. Requisitos Nao Funcionais

### NFR-1: Performance
- Tempo de scraping: < 15 segundos (timeout com fallback)
- Tempo de geracao IA: < 30 segundos para post completo
- Indicador de progresso visivel durante toda a operacao

### NFR-2: Seguranca
- API key do Gemini NUNCA exposta no client-side
- Todas as chamadas ao Gemini sao server-side (API routes)
- Autenticacao JWT obrigatoria em todos os endpoints `/api/admin/ai/*`
- Sanitizacao do HTML gerado via DOMPurify (ja existente no projeto)
- Validacao Zod dos blocos gerados antes de salvar

### NFR-3: Resiliencia
- Falha no scraping NAO bloqueia a geracao (continua sem referencia)
- Falha na geracao exibe mensagem de erro clara com opcao de retry
- Blocos invalidos sao filtrados (nao quebram o post inteiro)
- Rate limiting: maximo 10 geracoes por hora por sessao

### NFR-4: Custo
- Modelo: Gemini 2.5 Flash (custo ~R$0.008 por post)
- Sem custos fixos — pay-per-use via Google AI Studio
- Budget alert: log warning se > 100 geracoes/dia

### NFR-5: Manutenibilidade
- Prompt centralizado em arquivo dedicado (`/lib/ai/prompt-builder.ts`)
- Facil de ajustar tom, estrutura e regras sem alterar codigo
- Schema de resposta versionado

---

## 6. Arquitetura Tecnica

### 6.1 Stack de Tecnologia

| Camada | Tecnologia | Justificativa |
|--------|-----------|--------------|
| LLM | Gemini 2.5 Flash | 1M context, JSON nativo, baixo custo, rapido |
| SDK | @google/genai | SDK oficial Google, ~30KB, TypeScript nativo |
| Scraping | cheerio + fetch | Leve (~200KB), suficiente para HTML estatico |
| Validacao | Zod (existente) | Schemas de blocos ja definidos no projeto |
| Sanitizacao | DOMPurify (existente) | Ja integrado no pipeline de blocos |
| Storage | Supabase (existente) | Mesmo banco, mesmas tabelas, mesma API |

### 6.2 Novos Arquivos

```
src/
  app/
    admin/
      posts/
        generate/
          page.tsx              # Pagina de input (tema + URL)
          preview/
            page.tsx            # Preview do post gerado
    api/
      admin/
        ai/
          generate/
            route.ts            # POST — orquestra scraping + IA
          scrape/
            route.ts            # POST — scraping de URL
  lib/
    ai/
      prompt-builder.ts         # Construcao do prompt com regras SEO/GEO
      response-parser.ts        # Parse e validacao do output do Gemini
      scraper.ts                # Logica de scraping (cheerio)
      gemini-client.ts          # Cliente Gemini configurado
```

### 6.3 Diagrama de Fluxo

```
User                Frontend                    API                         Gemini
  |                    |                         |                            |
  |-- Enter theme ---->|                         |                            |
  |-- Enter URL ------>|                         |                            |
  |-- Click Generate ->|                         |                            |
  |                    |-- POST /ai/generate --->|                            |
  |                    |                         |-- POST /ai/scrape -------->|
  |                    |                         |<-- scraped content --------|
  |                    |                         |                            |
  |                    |                         |-- Build prompt ----------->|
  |                    |                         |-- Call Gemini 2.5 Flash -->|
  |                    |                         |<-- JSON (blocks+meta) -----|
  |                    |                         |                            |
  |                    |                         |-- Validate (Zod) -------->|
  |                    |                         |-- Sanitize (DOMPurify) -->|
  |                    |                         |-- Save draft (Supabase) ->|
  |                    |                         |                            |
  |                    |<-- { postId, blocks } --|                            |
  |                    |                         |                            |
  |<-- Redirect to ----|                         |                            |
  |   preview page     |                         |                            |
  |                    |                         |                            |
  |-- Click Edit ----->|-- Redirect /posts/[id]/edit                         |
  |   OR               |                         |                            |
  |-- Click Approve -->|-- PATCH status=published|                            |
```

---

## 7. Variaveis de Ambiente

| Variavel | Obrigatoria | Descricao |
|----------|------------|-----------|
| `GEMINI_API_KEY` | Sim | API key do Google AI Studio para Gemini 2.5 Flash |

**Nota:** Todas as outras variaveis de ambiente (Supabase, JWT, etc.) ja existem no projeto.

---

## 8. Dependencias Novas

| Pacote | Versao | Tamanho | Justificativa |
|--------|--------|---------|--------------|
| `@google/genai` | latest | ~30KB | SDK oficial do Gemini |
| `cheerio` | latest | ~200KB | Parsing HTML para scraping |

**Dependencias existentes reutilizadas:** zod, isomorphic-dompurify, slugify, jose, supabase-js

---

## 9. Categorias do Blog (Referencia)

As categorias validas para o campo `category` sao:

- Receitas
- Dicas
- Sobre o Cafe
- Sustentabilidade
- Cultura do Cafe
- Noticias

O prompt do Gemini deve selecionar a categoria mais adequada ao tema.

---

## 10. Fora de Escopo (v1.0)

| Item | Motivo |
|------|--------|
| Geracao de imagens via IA | Complexidade + custo alto, fase futura |
| Edicao inline na preview | Preview e read-only; edicao usa editor existente |
| Historico de geracoes | Drafts ficam no dashboard, sem log separado |
| Bulk generation (multiplos posts) | Fase futura, validar single-post primeiro |
| Playwright para scraping | Overkill para v1; cheerio e suficiente |
| Treinamento/fine-tuning do modelo | Desnecessario — prompt engineering e suficiente |
| Geracao de posts em EN/ES | Fase futura — v1 foca em PT |
| Integracao com calendario editorial | Fase futura |

---

## 11. Riscos e Mitigacoes

| # | Risco | Probabilidade | Impacto | Mitigacao |
|---|-------|--------------|---------|-----------|
| R1 | Gemini gera conteudo factualmente incorreto | Media | Medio | Preview obrigatorio antes de publicar; botao Edit sempre disponivel |
| R2 | Scraping falha em sites com JS-rendering | Media | Baixo | Fallback graceful — gera sem referencia; migrar para Playwright em v2 se necessario |
| R3 | JSON do Gemini invalido/incompleto | Baixa | Medio | responseMimeType JSON nativo + Zod validation + fallback blocks |
| R4 | Conteudo gerado muito generico | Media | Medio | Prompt detalhado com brand voice Cafe Canastra + contexto Serra da Canastra |
| R5 | API key exposta no client | Baixa | Alto | Todas chamadas server-side; key apenas em .env.local |
| R6 | Rate limit do Gemini API | Baixa | Baixo | Rate limiting interno (10/hora); free tier = 15 RPM |

---

## 12. Criterios de Aceitacao (Alto Nivel)

### AC-1: Fluxo Completo
- [ ] Usuario acessa `/admin/posts/generate`
- [ ] Digita um tema e (opcionalmente) uma URL
- [ ] Clica "Gerar" e ve indicador de progresso
- [ ] Post e gerado em < 30 segundos
- [ ] Preview exibe o post renderizado com blocos
- [ ] Botao "Editar" abre o editor de blocos com o conteudo pre-carregado
- [ ] Botao "Aprovar" publica o post imediatamente
- [ ] Botao "Salvar como Rascunho" salva sem publicar
- [ ] Botao "Descartar" remove o draft

### AC-2: Qualidade do Conteudo
- [ ] Post gerado tem 800-1500 palavras
- [ ] Contem pelo menos 3 headings H2
- [ ] Contem bloco FAQ com 3-5 perguntas
- [ ] Contem bloco CTA
- [ ] SEO score >= 75 no scorer existente
- [ ] Focus keyword presente no titulo, primeiro paragrafo e meta description

### AC-3: Scraping
- [ ] URL valida retorna titulo + conteudo limpo
- [ ] URL invalida/inacessivel mostra mensagem amigavel e continua
- [ ] Conteudo extraido e usado como contexto na geracao
- [ ] Conteudo NAO e copiado literalmente

### AC-4: Seguranca
- [ ] Endpoints protegidos por JWT
- [ ] API key Gemini nunca exposta no frontend
- [ ] HTML gerado sanitizado antes de salvar
- [ ] Blocos validados com Zod antes de salvar

---

## 13. Estimativa de Complexidade

| Dimensao | Score (1-5) | Justificativa |
|----------|------------|--------------|
| Scope | 3 | ~10 novos arquivos, 2 paginas, 2 API routes |
| Integration | 2 | Uma API externa (Gemini), banco existente |
| Infrastructure | 1 | Apenas 1 env var nova, sem infra adicional |
| Knowledge | 3 | Prompt engineering requer iteracao |
| Risk | 2 | Preview obrigatorio mitiga riscos de qualidade |

**Total: 11/25 — STANDARD**

---

## 14. Notas de Implementacao

### 14.1 Prompt Engineering
O prompt e o componente mais critico. Deve ser iterado ate atingir consistentemente:
- SEO score >= 75
- Blocos validos (sem erros de parsing)
- Tom alinhado com a marca Cafe Canastra
- Conteudo factualmente preciso sobre cafe

### 14.2 Reutilizacao
- **BlockRenderer existente** para preview
- **PostEditor existente** para edicao pos-geracao
- **SeoScorer existente** para calcular score
- **API routes existentes** para salvar/publicar posts
- **Zod schemas existentes** para validar blocos

### 14.3 Ordem de Implementacao Sugerida
1. `gemini-client.ts` — configurar cliente Gemini
2. `prompt-builder.ts` — construir prompt com regras SEO/GEO
3. `response-parser.ts` — parser e validador do output
4. `scraper.ts` — logica de scraping com cheerio
5. `route.ts` (scrape) — endpoint de scraping
6. `route.ts` (generate) — endpoint de geracao
7. `page.tsx` (generate) — pagina de input
8. `page.tsx` (preview) — pagina de preview
9. Integracao com AdminDashboard (botao)

---

*Cafe Canastra AI Content Generation PRD v1.0 — Morgan (PM) — Synkra AIOS*
