# PRD — Café Canastra: Block Editor CMS + SEO/GEO Avançado

**Versao:** 2.0
**Data:** 2026-03-03
**Status:** Draft — Aguardando Aprovacao
**Autor:** Morgan (PM) — Synkra AIOS
**Contexto:** Brownfield — Reformulacao total do sistema de blog existente
**Baseado em:** Analise do @analyst Atlas (2026-03-03)
**PRD Anterior:** PRD-cafe-canastra-seo-geo-blog.md v1.0 (parcialmente implementado)

---

## 1. Visao Executiva

O sistema de blog do Cafe Canastra foi implementado com um modelo de conteudo monolitico (campo TEXT unico com Markdown) e um editor basico (textarea). Esta abordagem limita severamente:

- **Controle editorial:** Impossivel reorganizar secoes sem editar Markdown manualmente
- **SEO granular:** Sem controle de structured data por tipo de conteudo
- **GEO (Generative Engine Optimization):** Nenhuma otimizacao para motores de busca baseados em IA
- **Experiencia do editor:** Curva de aprendizado alta, sem preview visual

**A reformulacao propoe:**

1. **Block Editor:** Sistema de edicao baseado em blocos (estilo WordPress Gutenberg) com drag-and-drop, permitindo composicao visual de posts com 16+ tipos de blocos
2. **SEO Avancado:** Score de SEO em tempo real com 12+ verificacoes automaticas, structured data por bloco, controle total de meta tags
3. **GEO de Ponta:** Otimizacao especifica para AI Overviews, Perplexity, ChatGPT — com citabilidade, entidades semanticas, speakable markup e FAQ schema automatico

---

## 2. Contexto do Negocio

### 2.1 Produto
Cafe Canastra e uma marca de cafes especiais com origem na Serra da Canastra, MG. Tres linhas (Classico, Suave, Canela) em grao e moido, capsulas e drip coffee.

### 2.2 Situacao Atual do Blog
- **Stack:** Next.js 16.1 + React 19 + Supabase + Tailwind CSS
- **DB:** Tabela `blog_posts` com `content: TEXT` (Markdown)
- **Admin:** PostForm.tsx com textarea simples, upload de imagem, categorias, tags
- **SEO:** Meta tags basicas, JSON-LD Article/Blog/Breadcrumb, sitemap estatico
- **GEO:** Inexistente
- **i18n:** PT/EN/ES nas pages principais, blog apenas PT
- **Rendering:** ReactMarkdown com remark-gfm e @tailwindcss/typography

### 2.3 Problemas Identificados

| # | Problema | Impacto |
|---|---------|---------|
| P1 | Conteudo monolitico (TEXT) impossibilita controle granular | Editor limitado, SEO basico |
| P2 | Sem preview visual — editor e textarea pura | UX ruim para criadores de conteudo |
| P3 | Sem score de SEO em tempo real | Posts publicados sem otimizacao |
| P4 | Zero otimizacao GEO | Invisivel para AI search engines |
| P5 | Sitemap nao inclui posts do blog | Indexacao prejudicada |
| P6 | Sem controle de structured data por tipo de conteudo | FAQ, HowTo, Product nao gerados |
| P7 | Sem suporte a i18n no blog | Mercado EN/ES nao atendido |
| P8 | Imagens sem otimizacao automatica (resize, WebP) | Performance e Core Web Vitals |

### 2.4 Objetivos Estrategicos

- **O1:** Aumentar trafego organico em 3x em 6 meses via SEO tecnico e conteudo otimizado
- **O2:** Ser citado como fonte em pelo menos 2 AI search engines (Perplexity, Google AI Overview) para queries de cafe especial
- **O3:** Reduzir tempo de criacao de post de 30min para 10min com editor visual
- **O4:** Atingir score medio de SEO >= 85/100 em todos os posts publicados

---

## 3. Requisitos Funcionais

### 3.1 Sistema de Blocos (Block Editor)

**FR1:** O sistema deve suportar os seguintes tipos de blocos para composicao de posts:

| Bloco | ID | Descricao | Propriedades |
|-------|-----|-----------|-------------|
| Titulo | `heading` | Cabecalhos H1-H6 | `level`, `text`, `anchor_id` (auto) |
| Paragrafo | `paragraph` | Texto rico | `text` (bold, italic, underline, links, highlight) |
| Imagem | `image` | Imagem com metadados SEO | `url`, `alt` (obrigatorio), `caption`, `width`, `height`, `loading` |
| Galeria | `gallery` | Colecao de imagens | `images[]`, `layout` (grid, carousel, masonry), `columns` |
| Citacao | `quote` | Blockquote com fonte | `text`, `author`, `source_url` |
| Lista | `list` | Lista ol/ul | `items[]`, `ordered` |
| Codigo | `code` | Bloco de codigo | `language`, `code`, `filename` |
| Embed | `embed` | Conteudo externo | `url`, `type` (youtube, instagram, twitter, tiktok), `caption` |
| Separador | `divider` | Divisor visual | `style` (line, dots, space) |
| Destaque | `callout` | CTA ou aviso | `text`, `type` (info, warning, tip, success), `icon` |
| Tabela | `table` | Dados tabulares | `headers[]`, `rows[][]`, `caption` |
| FAQ | `faq` | Perguntas/respostas | `items[{question, answer}]` — gera FAQPage schema |
| CTA | `cta` | Call-to-Action | `text`, `button_text`, `button_url`, `style` (primary, secondary) |
| Video | `video` | Video embed | `url`, `poster_url`, `caption`, `duration` |
| Acordeao | `accordion` | Conteudo colapsavel | `items[{title, content}]` |
| Produto | `product` | Card de produto | `name`, `price`, `image`, `link`, `description` — gera Product schema |

**FR2:** Cada bloco deve ter um ID unico (UUID) e propriedade `order` (integer) para definir posicao no post.

**FR3:** Cada bloco deve aceitar `settings` opcionais:
- `width`: narrow | normal | wide | full
- `alignment`: left | center | right
- `css_class`: classe CSS customizada (opcional)
- `spacing`: top/bottom margin override

**FR4:** O editor deve suportar drag-and-drop para reordenar blocos com feedback visual.

**FR5:** Cada bloco deve ter menu de contexto com opcoes: duplicar, mover para cima/baixo, converter tipo (quando aplicavel), deletar.

**FR6:** O editor deve incluir toolbar de insercao rapida de blocos com icones representativos, ativavel com botao "+" entre blocos e no final do post.

**FR7:** O editor deve ter auto-save a cada 30 segundos (debounce) para evitar perda de conteudo, com indicador visual de status (salvo/salvando/erro).

**FR8:** O editor deve suportar preview em tempo real do post renderizado, alternando entre modo edicao e preview.

### 3.2 SEO Avancado

**FR9:** Cada post deve ter um painel de configuracao SEO com os seguintes campos:
- `meta_title` (titulo para SERP, max 60 chars, fallback para titulo do post)
- `meta_description` (descricao para SERP, max 160 chars, fallback para excerpt)
- `focus_keyword` (palavra-chave principal)
- `secondary_keywords[]` (ate 5 palavras-chave secundarias)
- `canonical_url` (URL canonica, padrao: URL do post)
- `og_title`, `og_description`, `og_image` (overrides para Open Graph)
- `twitter_card_type` (summary | summary_large_image)
- `noindex`, `nofollow` (boolean, padrao false)

**FR10:** O sistema deve calcular e exibir um SEO Score (0-100) em tempo real durante edicao, baseado em:

| Check | Peso | Criterio |
|-------|------|---------|
| Focus keyword no titulo | 10 | Presente no H1 |
| Focus keyword na meta description | 10 | Presente na meta desc |
| Focus keyword no primeiro paragrafo | 8 | Nos primeiros 150 chars |
| Keyword density | 8 | Entre 1-2% no conteudo total |
| Meta description length | 8 | 120-160 caracteres |
| Meta title length | 7 | 30-60 caracteres |
| Heading hierarchy | 7 | H1 > H2 > H3 sem pulos |
| Internal links | 7 | Minimo 2 links internos |
| External links | 5 | Pelo menos 1 link externo |
| Image alt text | 8 | Todas imagens com alt |
| Content length | 7 | Minimo 800 palavras |
| URL/slug optimization | 5 | Keyword no slug, max 5 palavras |
| Reading time | 5 | Calculado e exibido |
| Subheading distribution | 5 | H2/H3 a cada ~300 palavras |

**FR11:** O SEO panel deve exibir o score com indicadores visuais:
- 90-100: verde (Excelente)
- 70-89: amarelo (Bom)
- 50-69: laranja (Precisa melhorar)
- 0-49: vermelho (Ruim)
- Cada check com icone: checkmark (ok), warning (parcial), X (falhou)

**FR12:** Structured data (JSON-LD) deve ser gerado automaticamente baseado nos blocos do post:
- Bloco `faq` → `FAQPage` schema
- Bloco `product` → `Product` schema
- Bloco `video` → `VideoObject` schema
- Bloco `image` → `ImageObject` schema
- Bloco `heading` → gera anchor IDs para deep linking
- Post principal → `Article` schema enriquecido
- Breadcrumb → `BreadcrumbList` schema
- Organizacao → `Organization` schema (existente, manter)

**FR13:** O sitemap.xml deve ser dinamico e incluir todos os posts publicados com:
- `<lastmod>` baseado em `updated_at`
- `<changefreq>` baseado no tipo (post: weekly, page: monthly)
- `<priority>` configuravel por post (padrao 0.7)
- Posts agendados NAO devem aparecer no sitemap

**FR14:** O sistema deve gerar meta tags `hreflang` automaticamente para posts com traducoes, linkando entre versoes PT/EN/ES.

### 3.3 GEO (Generative Engine Optimization)

**FR15:** O sistema deve implementar otimizacoes especificas para AI search engines:

| Estrategia | Implementacao | Bloco relacionado |
|-----------|---------------|-------------------|
| Speakable markup | `SpeakableSpecification` com CSS selectors para titulo, excerpt, FAQ answers | Post-level |
| Citabilidade | Paragrafos auto-contidos com max 3 frases por ponto | `paragraph` |
| FAQ para featured snippets | Schema `FAQPage` automatico a partir de blocos FAQ | `faq` |
| Dados com fonte | Campo `source_url` obrigatorio em blocos `quote` e `callout` tipo stat | `quote`, `callout` |
| Entity linking | Campo `entities[]` por post para knowledge graph matching | Post-level |
| Freshness signals | `dateModified` atualizado em toda edicao, `datePublished` fixo | Post-level |
| Conteudo estruturado | Headings hierarquicos com anchor IDs para deep linking de IA | `heading` |
| About/mentions | `about` e `mentions` no Article schema com links sameAs (Wikidata) | Post-level |
| HowTo schema | Quando detectado bloco de lista com heading "Como..." gera `HowTo` | `list` + `heading` |
| Table schema | Dados tabulares com caption geram structured data | `table` |

**FR16:** O painel GEO (sidebar do editor) deve exibir:
- **Citability Score:** % de paragrafos auto-contidos (ideal > 80%)
- **Entity Count:** numero de entidades semanticas vinculadas
- **FAQ Blocks:** quantidade de blocos FAQ (recomendado >= 1 por post)
- **Source Citations:** numero de citacoes com fonte (recomendado >= 2)
- **Speakable Coverage:** % de conteudo marcado como speakable
- **Content Freshness:** tempo desde ultima atualizacao

**FR17:** O campo `entities[]` no post deve aceitar entidades semanticas no formato:
```typescript
interface SemanticEntity {
  name: string          // "Cafe Especial"
  type: string          // "Thing" | "Place" | "Product" | "Organization"
  sameAs?: string       // URL Wikidata/Wikipedia
  description?: string  // Descricao curta
}
```

### 3.4 Admin Panel & Editor UX

**FR18:** O editor de post deve ter layout dividido:
- **Esquerda (70%):** Area de edicao com blocos empilhados verticalmente
- **Direita (30%):** Sidebar com abas: SEO | GEO | Configuracoes

**FR19:** A toolbar de bloco deve mostrar icones para os 8 blocos mais usados e um botao "More" para os demais. A toolbar aparece:
- Entre cada bloco (ao hover, exibe botao "+")
- No final do post (sempre visivel)

**FR20:** O editor deve suportar atalhos de teclado:
- `/` em bloco vazio: abre seletor de tipo (slash command, estilo Notion)
- `Ctrl+S`: salvar rascunho
- `Ctrl+Shift+P`: alternar preview
- `Ctrl+D`: duplicar bloco atual
- `Delete` em bloco vazio: remove bloco

**FR21:** Cada bloco de texto (heading, paragraph, quote, callout) deve ter mini-toolbar de formatacao inline:
- Bold, Italic, Underline, Link, Highlight, Clear formatting
- A toolbar aparece ao selecionar texto

**FR22:** O formulario de metadados do post (sidebar "Configuracoes") deve incluir:
- Titulo do post
- Slug (auto-gerado, editavel)
- Featured image (upload com preview)
- Categoria (select das categorias existentes)
- Tags (input com chips)
- Autor (padrao: Cafe Canastra)
- Locale (PT | EN | ES)
- Status (Draft | Scheduled | Published)
- Data de agendamento (quando scheduled)
- Reading time (calculado automaticamente, exibido)

**FR23:** O dashboard admin deve exibir lista de posts com:
- Titulo e status (badge colorido)
- Categoria e tags
- Locale flag (bandeira)
- Data de publicacao/agendamento
- SEO Score (badge com cor)
- Acoes: Edit | Preview | Duplicate | Delete

### 3.5 Blog Frontend (Rendering)

**FR24:** O frontend do blog deve renderizar cada tipo de bloco com componente React dedicado, substituindo o ReactMarkdown atual:

```
BlockRenderer
├── HeadingBlock     → <h1-h6> com anchor link
├── ParagraphBlock   → <p> com rich text
├── ImageBlock       → <figure> com <img>, <figcaption>, alt
├── GalleryBlock     → Grid/carousel responsivo
├── QuoteBlock       → <blockquote> com <cite>
├── ListBlock        → <ul>/<ol> com items
├── CodeBlock        → <pre><code> com syntax highlighting
├── EmbedBlock       → iframe responsivo (YouTube, etc)
├── DividerBlock     → <hr> estilizado
├── CalloutBlock     → <aside> com icone e tipo
├── TableBlock       → <table> responsiva
├── FaqBlock         → Accordion com schema FAQ
├── CtaBlock         → Botao/banner de CTA
├── VideoBlock       → <video> ou embed
├── AccordionBlock   → Colapsavel com animacao
└── ProductBlock     → Card de produto com schema
```

**FR25:** O frontend deve gerar Table of Contents (TOC) automaticamente a partir dos blocos `heading`, exibido como sidebar flutuante em desktop e menu colapsavel em mobile.

**FR26:** O frontend deve calcular e exibir reading time baseado no word count total dos blocos de texto.

**FR27:** Posts com traducoes devem exibir language switcher linkando para as versoes traduzidas via `translation_group_id`.

### 3.6 API & Data Layer

**FR28:** Nova API para gerenciamento de blocos:

| Endpoint | Metodo | Descricao |
|----------|--------|-----------|
| `POST /api/admin/posts` | POST | Criar post com array de blocos |
| `PUT /api/admin/posts/[id]` | PUT | Atualizar post e blocos |
| `GET /api/admin/posts/[id]` | GET | Buscar post com blocos para edicao |
| `GET /api/blog/posts` | GET | Listar posts publicados (com blocos) |
| `GET /api/blog/posts/[slug]` | GET | Buscar post publicado com blocos |
| `POST /api/admin/posts/[id]/blocks/reorder` | POST | Reordenar blocos |
| `POST /api/admin/upload` | POST | Upload de imagem (manter existente) |
| `POST /api/admin/posts/[id]/auto-save` | POST | Auto-save parcial |
| `GET /api/sitemap.xml` | GET | Sitemap dinamico com posts |

**FR29:** O payload de criacao/atualizacao de post deve incluir os blocos inline (nao como operacao separada) para garantir consistencia atomica:

```typescript
interface CreatePostPayload {
  // Post metadata
  title: string
  slug: string
  excerpt?: string
  featured_image_url?: string
  featured_image_alt?: string
  category?: string
  tags: string[]
  locale: 'pt' | 'en' | 'es'
  translation_group_id?: string
  status: 'draft' | 'scheduled' | 'published'
  scheduled_at?: string
  // SEO
  seo_config: SeoConfig
  // GEO
  geo_config: GeoConfig
  // Blocks
  blocks: ContentBlock[]
}
```

**FR30:** Migracao de posts existentes: o sistema deve migrar posts Markdown existentes para um unico bloco `paragraph` com o conteudo original, garantindo retrocompatibilidade. Script de migracao executavel via CLI.

---

## 4. Requisitos Nao-Funcionais

**NFR1:** Performance — O editor de blocos deve carregar em < 2s e responder a interacoes (drag, type, insert) em < 100ms.

**NFR2:** Auto-save — O auto-save nao deve causar jank ou interrupcao da edicao. Usar debounce de 30s e salvamento em background.

**NFR3:** Tamanho do bundle — As dependencias do editor (dnd-kit, tiptap se usado) devem ser lazy-loaded e nao impactar o carregamento do frontend publico.

**NFR4:** Core Web Vitals — O blog frontend deve manter LCP < 2.5s, FID < 100ms, CLS < 0.1 em paginas de post.

**NFR5:** Acessibilidade — O editor deve ser acessivel via teclado (Tab navigation, aria labels). Os blocos renderizados devem cumprir WCAG 2.1 AA.

**NFR6:** Compatibilidade — O editor deve funcionar em Chrome, Firefox, Safari e Edge (ultimas 2 versoes).

**NFR7:** Seguranca — Manter autenticacao JWT existente. Sanitizar todo conteudo HTML nos blocos antes de renderizar. Prevenir XSS em blocos de embed e rich text.

**NFR8:** Responsividade — O editor admin deve ser funcional em tablets (min 768px). O frontend do blog deve ser totalmente responsivo (mobile-first).

**NFR9:** Banco de dados — Consultas de listagem de posts com blocos devem executar em < 200ms. Usar JOINs otimizados e indices adequados.

**NFR10:** SEO Score — O calculo do score deve ser client-side puro, sem chamadas API, para garantir atualizacao em tempo real.

---

## 5. Requisitos de Compatibilidade

**CR1: API Compatibility** — As APIs publicas existentes (`GET /api/blog/posts`, `GET /api/blog/posts/[slug]`) devem continuar funcionando, retornando dados no formato atual durante periodo de transicao. Adicionar campo `blocks` ao response existente.

**CR2: Database Compatibility** — A tabela `blog_posts` existente sera modificada (adicionando novos campos JSONB e locale), NAO deletada. Nova tabela `blog_post_blocks` sera criada. Posts existentes serao migrados.

**CR3: URL Compatibility** — Todas as URLs de blog existentes (`/blog`, `/blog/[slug]`) devem continuar funcionando sem quebra. Slugs existentes preservados.

**CR4: Auth Compatibility** — O sistema de autenticacao admin (JWT, cookies, middleware) sera mantido intacto.

**CR5: Storage Compatibility** — O bucket Supabase `blog-images` e o endpoint de upload serao mantidos. Novas imagens de blocos usarao o mesmo bucket.

---

## 6. Arquitetura Tecnica

### 6.1 Modelo de Dados

#### Tabela `blog_posts` (modificada)

```sql
-- Novos campos adicionados a tabela existente
ALTER TABLE public.blog_posts
  ADD COLUMN locale VARCHAR(5) DEFAULT 'pt',
  ADD COLUMN translation_group_id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN seo_config JSONB DEFAULT '{}',
  ADD COLUMN geo_config JSONB DEFAULT '{}',
  ADD COLUMN reading_time_minutes INTEGER DEFAULT 0,
  ADD COLUMN word_count INTEGER DEFAULT 0,
  ADD COLUMN seo_score INTEGER DEFAULT 0;

-- Indice para traducoes
CREATE INDEX idx_blog_posts_translation_group
  ON public.blog_posts(translation_group_id);

-- Indice para locale
CREATE INDEX idx_blog_posts_locale
  ON public.blog_posts(locale);
```

#### Tabela `blog_post_blocks` (nova)

```sql
CREATE TABLE public.blog_post_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL
    CHECK (type IN (
      'heading', 'paragraph', 'image', 'gallery', 'quote',
      'list', 'code', 'embed', 'divider', 'callout',
      'table', 'faq', 'cta', 'video', 'accordion', 'product'
    )),
  "order" INTEGER NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indices
CREATE INDEX idx_blocks_post_id ON public.blog_post_blocks(post_id);
CREATE INDEX idx_blocks_post_order ON public.blog_post_blocks(post_id, "order");
CREATE INDEX idx_blocks_type ON public.blog_post_blocks(type);

-- RLS
ALTER TABLE public.blog_post_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blocks of published posts"
  ON public.blog_post_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE id = post_id AND status = 'published'
    )
  );

CREATE POLICY "No public writes on blocks"
  ON public.blog_post_blocks
  FOR ALL
  USING (false)
  WITH CHECK (false);
```

#### JSONB Schemas

```typescript
// seo_config JSONB
interface SeoConfig {
  meta_title?: string         // max 60 chars
  meta_description?: string   // max 160 chars
  focus_keyword?: string
  secondary_keywords?: string[] // max 5
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_card_type?: 'summary' | 'summary_large_image'
  noindex?: boolean           // default false
  nofollow?: boolean          // default false
}

// geo_config JSONB
interface GeoConfig {
  entities?: SemanticEntity[]
  speakable_selectors?: string[]   // CSS selectors for speakable content
  target_region?: string            // "Serra da Canastra"
  target_city?: string              // "Medeiros, MG"
  coordinates?: { lat: number, lng: number }
  about_topics?: string[]           // For schema "about" property
}

// Block data JSONB (varies by type)
interface HeadingData {
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  anchor_id: string   // auto-generated from text
}

interface ParagraphData {
  text: string         // HTML (sanitized): <strong>, <em>, <u>, <a>, <mark>
}

interface ImageData {
  url: string
  alt: string          // REQUIRED for SEO
  caption?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
}

interface GalleryData {
  images: ImageData[]
  layout: 'grid' | 'carousel' | 'masonry'
  columns?: 2 | 3 | 4
}

interface QuoteData {
  text: string
  author?: string
  source_url?: string  // Important for GEO citability
}

interface ListData {
  items: string[]      // HTML allowed in items
  ordered: boolean
}

interface CodeData {
  language: string
  code: string
  filename?: string
}

interface EmbedData {
  url: string
  type: 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'generic'
  caption?: string
}

interface DividerData {
  style: 'line' | 'dots' | 'space'
}

interface CalloutData {
  text: string
  type: 'info' | 'warning' | 'tip' | 'success'
  icon?: string
  source_url?: string  // For stat citations (GEO)
}

interface TableData {
  headers: string[]
  rows: string[][]
  caption?: string
}

interface FaqData {
  items: Array<{
    question: string
    answer: string
  }>
}

interface CtaData {
  text: string
  button_text: string
  button_url: string
  style: 'primary' | 'secondary' | 'outline'
}

interface VideoData {
  url: string
  poster_url?: string
  caption?: string
  duration?: string   // ISO 8601 (PT5M30S)
}

interface AccordionData {
  items: Array<{
    title: string
    content: string   // HTML allowed
  }>
}

interface ProductData {
  name: string
  price?: string
  image?: string
  link?: string
  description?: string
  currency?: string   // default "BRL"
}
```

### 6.2 Stack Tecnica (Adicoes)

| Necessidade | Biblioteca | Justificativa |
|-------------|-----------|---------------|
| Drag & Drop de blocos | `@dnd-kit/core` + `@dnd-kit/sortable` | Leve (~12KB gzip), acessivel, React-native, sem dependencias pesadas |
| Rich text inline | `@tiptap/react` + `@tiptap/starter-kit` | Headless, extensivel, ProseMirror-based, excelente para blocos |
| Syntax highlighting | `prism-react-renderer` | Leve, sem runtime Prism, perfeito para code blocks |
| SEO Score engine | Custom (sem dep) | Algoritmo deterministico client-side, sem overhead |
| Schema generators | Custom (expandir `blog-schemas.ts` existente) | Ja existe base, adicionar novos tipos |
| HTML sanitization | `dompurify` | Seguranca contra XSS em rich text |
| Toast/notifications | Manter `sonner` / Radix Toast existente | Ja no projeto |
| Forms | Manter `react-hook-form` + `zod` | Ja no projeto |
| Image upload | Manter Supabase Storage | Ja implementado |

### 6.3 Estrutura de Arquivos (Novos/Modificados)

```
lib/
├── types/
│   ├── blog.ts                    # [MODIFICAR] Adicionar BlockType, ContentBlock, SeoConfig, GeoConfig
│   └── block-data.ts              # [NOVO] Interfaces de dados por tipo de bloco
├── schemas/
│   ├── blog-schemas.ts            # [MODIFICAR] Adicionar FAQPage, Product, VideoObject, HowTo, Speakable
│   └── block-validation.ts        # [NOVO] Zod schemas para validacao de dados de blocos
├── seo/
│   ├── seo-scorer.ts              # [NOVO] Engine de calculo de SEO score
│   └── geo-analyzer.ts            # [NOVO] Analisador GEO (citability, entities)
└── utils/
    ├── slug.ts                    # [MANTER] Ja existente
    ├── block-utils.ts             # [NOVO] Helpers para manipulacao de blocos
    ├── reading-time.ts            # [NOVO] Calculo de tempo de leitura
    └── html-sanitizer.ts          # [NOVO] Sanitizacao de HTML com DOMPurify

components/
├── admin/
│   ├── PostForm.tsx               # [SUBSTITUIR] Pelo novo BlockEditor
│   ├── block-editor/
│   │   ├── BlockEditor.tsx        # [NOVO] Container principal do editor
│   │   ├── BlockToolbar.tsx       # [NOVO] Toolbar de insercao de blocos
│   │   ├── BlockWrapper.tsx       # [NOVO] Wrapper com drag handle, menu, controles
│   │   ├── InlineToolbar.tsx      # [NOVO] Toolbar de formatacao inline
│   │   ├── SlashCommand.tsx       # [NOVO] Menu de slash commands
│   │   └── blocks/                # [NOVO] Editores por tipo de bloco
│   │       ├── HeadingEditor.tsx
│   │       ├── ParagraphEditor.tsx
│   │       ├── ImageEditor.tsx
│   │       ├── GalleryEditor.tsx
│   │       ├── QuoteEditor.tsx
│   │       ├── ListEditor.tsx
│   │       ├── CodeEditor.tsx
│   │       ├── EmbedEditor.tsx
│   │       ├── DividerEditor.tsx
│   │       ├── CalloutEditor.tsx
│   │       ├── TableEditor.tsx
│   │       ├── FaqEditor.tsx
│   │       ├── CtaEditor.tsx
│   │       ├── VideoEditor.tsx
│   │       ├── AccordionEditor.tsx
│   │       └── ProductEditor.tsx
│   ├── seo-panel/
│   │   ├── SeoPanel.tsx           # [NOVO] Painel lateral de SEO
│   │   ├── SeoScoreGauge.tsx      # [NOVO] Gauge visual do score
│   │   └── SeoCheckItem.tsx       # [NOVO] Item individual de check
│   ├── geo-panel/
│   │   ├── GeoPanel.tsx           # [NOVO] Painel lateral de GEO
│   │   └── EntitySelector.tsx     # [NOVO] Seletor de entidades semanticas
│   └── post-settings/
│       └── PostSettings.tsx       # [NOVO] Sidebar de configuracoes do post
├── blog/
│   ├── BlockRenderer.tsx          # [NOVO] Renderizador principal de blocos
│   ├── TableOfContents.tsx        # [NOVO] TOC automatico
│   └── blocks/                    # [NOVO] Componentes de rendering por tipo
│       ├── HeadingBlock.tsx
│       ├── ParagraphBlock.tsx
│       ├── ImageBlock.tsx
│       ├── GalleryBlock.tsx
│       ├── QuoteBlock.tsx
│       ├── ListBlock.tsx
│       ├── CodeBlock.tsx
│       ├── EmbedBlock.tsx
│       ├── DividerBlock.tsx
│       ├── CalloutBlock.tsx
│       ├── TableBlock.tsx
│       ├── FaqBlock.tsx
│       ├── CtaBlock.tsx
│       ├── VideoBlock.tsx
│       ├── AccordionBlock.tsx
│       └── ProductBlock.tsx
└── schema-org.tsx                 # [MODIFICAR] Suportar multiplos schemas por pagina

app/
├── blog/
│   ├── page.tsx                   # [MODIFICAR] Usar BlockRenderer, adicionar SEO score badge
│   └── [slug]/
│       └── page.tsx               # [MODIFICAR] Block rendering, TOC, enhanced schemas
├── admin/
│   ├── posts/
│   │   ├── new/
│   │   │   └── page.tsx           # [MODIFICAR] Usar novo BlockEditor
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx       # [MODIFICAR] Usar novo BlockEditor
│   └── page.tsx                   # [MODIFICAR] Dashboard com SEO scores
├── api/
│   ├── admin/
│   │   ├── posts/
│   │   │   ├── route.ts           # [MODIFICAR] Suportar blocos no payload
│   │   │   └── [id]/
│   │   │       ├── route.ts       # [MODIFICAR] CRUD com blocos
│   │   │       ├── blocks/
│   │   │       │   └── reorder/
│   │   │       │       └── route.ts  # [NOVO] Reordenar blocos
│   │   │       └── auto-save/
│   │   │           └── route.ts      # [NOVO] Auto-save endpoint
│   │   └── upload/
│   │       └── route.ts           # [MANTER] Upload de imagens
│   └── sitemap.xml/
│       └── route.ts               # [MODIFICAR] Incluir posts dinamicos

database/
├── 001_create_blog_posts.sql      # [MANTER] Schema original
├── 002_add_block_system.sql       # [NOVO] Adicionar blocos, SEO, GEO
└── 003_migrate_content.sql        # [NOVO] Migrar posts existentes para blocos
```

---

## 7. Interface do Editor

### 7.1 Layout do Editor

```
+---------------------------------------------------------------+
|  <- Back    [Post Title Input]                    [Save Draft] |
|             [Slug: auto-generated]                [Schedule ]  |
|                                                   [Publish  ]  |
+--------------------------------------------+------------------+
|                                            |  [SEO] [GEO] [*] |
|  [+ Add Block]                             |                   |
|                                            |  SEO Score: 82    |
|  +--------------------------------------+  |  ====------  Good |
|  | [=] H2: Introducao ao Cafe Especial  |  |                   |
|  |     [drag] [menu] [delete]           |  |  V keyword title  |
|  +--------------------------------------+  |  V keyword desc   |
|       [+]                                  |  V first paragraph |
|  +--------------------------------------+  |  ! density 0.8%   |
|  | [=] Paragraph                        |  |  V heading order  |
|  |     O cafe especial da Serra...      |  |  X no alt img #3  |
|  |     [drag] [menu] [delete]           |  |  V content 1450w  |
|  +--------------------------------------+  |  V slug optimized |
|       [+]                                  |                   |
|  +--------------------------------------+  |  --- GEO ---      |
|  | [=] Image                            |  |  Citability: 82%  |
|  |     [image preview + alt input]      |  |  Entities: 3      |
|  |     [drag] [menu] [delete]           |  |  FAQ blocks: 1    |
|  +--------------------------------------+  |  Sources: 2       |
|       [+]                                  |                   |
|  +--------------------------------------+  |  --- Settings --- |
|  | [=] FAQ                              |  |  Category: [v]    |
|  |     Q: O que e cafe especial?        |  |  Tags: [chips]    |
|  |     A: Cafe especial e...            |  |  Locale: PT       |
|  |     [+ Add Q&A]                      |  |  Author: [input]  |
|  |     [drag] [menu] [delete]           |  |  Reading: 7 min   |
|  +--------------------------------------+  |                   |
|                                            |                   |
|  [+ Add Block v]                           |                   |
|  [H] [P] [img] ["] [li] [=] [?] [more]    |                   |
+--------------------------------------------+------------------+
```

### 7.2 Block Insertion Menu (Slash Command)

Ao digitar "/" em um bloco vazio ou clicar no botao "+":

```
+----------------------------------+
|  Search blocks...                |
|                                  |
|  TEXT                            |
|  [H] Heading    [P] Paragraph   |
|  ["] Quote      [!] Callout     |
|                                  |
|  MEDIA                           |
|  [img] Image    [vid] Video     |
|  [gal] Gallery  [<>] Embed     |
|                                  |
|  DATA                            |
|  [li] List      [tb] Table     |
|  [?] FAQ        [acc] Accordion |
|                                  |
|  ACTION                          |
|  [cta] CTA      [prod] Product |
|  [---] Divider  [code] Code    |
+----------------------------------+
```

---

## 8. Estrutura de Epic e Stories

### Abordagem: Epic Unico, Stories Sequenciais

**Justificativa:** Esta e uma reformulacao profunda de um subsistema coeso (blog). Todas as stories sao interdependentes — o editor depende dos tipos, o rendering depende dos blocos no DB, o SEO depende de ambos. Um epic unico com stories sequenciais garante integridade e permite rollback por story.

---

### Epic 1: Block Editor CMS + SEO/GEO Avancado

**Epic Goal:** Transformar o sistema de blog de um editor Markdown monolitico para um CMS baseado em blocos com editor visual, SEO score em tempo real e otimizacoes GEO de ponta.

**Integration Requirements:** Manter compatibilidade com posts existentes, URLs, autenticacao, e bucket de imagens do Supabase.

---

#### Story 1.1 — Foundation: Types, Schema DB e Migracao

> Como um **desenvolvedor**,
> quero que o modelo de dados suporte blocos, SEO config e GEO config,
> para que o sistema tenha a fundacao necessaria para o editor de blocos.

**Acceptance Criteria:**
1. TypeScript types criados: `BlockType`, `ContentBlock`, `SeoConfig`, `GeoConfig`, e todas as interfaces de dados por bloco (`HeadingData`, `ParagraphData`, etc.)
2. Migration SQL `002_add_block_system.sql` criada e validada: novos campos em `blog_posts` + nova tabela `blog_post_blocks` com RLS
3. Migration SQL `003_migrate_content.sql` criada: converte posts existentes (campo `content`) em bloco `paragraph` unico
4. Zod validation schemas criados para todos os 16 tipos de blocos
5. Indices de performance criados conforme especificacao
6. Testes de tipo (typecheck) passando sem erros

**Integration Verification:**
- IV1: Posts existentes continuam acessiveis via API publica apos migracao
- IV2: RLS policies funcionam corretamente (public read de posts publicados)
- IV3: Performance de queries com JOIN blocos < 200ms

---

#### Story 1.2 — API Layer: CRUD de Posts com Blocos

> Como um **administrador do blog**,
> quero criar e editar posts com blocos via API,
> para que o editor possa salvar e recuperar conteudo estruturado.

**Acceptance Criteria:**
1. `POST /api/admin/posts` aceita payload com `blocks[]`, `seo_config`, `geo_config` e cria post + blocos atomicamente
2. `PUT /api/admin/posts/[id]` atualiza post e sincroniza blocos (delete orphans, update existing, insert new)
3. `GET /api/admin/posts/[id]` retorna post com blocos ordenados por `order`
4. `POST /api/admin/posts/[id]/blocks/reorder` atualiza order de multiplos blocos
5. `POST /api/admin/posts/[id]/auto-save` salva parcialmente sem validacao completa
6. Validacao Zod no server-side para todos os dados de blocos
7. Sanitizacao HTML (DOMPurify) aplicada em todos os campos de texto rico
8. Testes de API passando para create, update, read, reorder, auto-save

**Integration Verification:**
- IV1: API publica `GET /api/blog/posts` continua retornando dados compativeis
- IV2: Upload de imagens (`/api/admin/upload`) continua funcionando
- IV3: Auth middleware protege todos os endpoints admin

---

#### Story 1.3 — Block Editor Core: Container, DnD e Block Wrapper

> Como um **editor de conteudo**,
> quero um editor visual onde posso adicionar, reordenar e remover blocos com drag-and-drop,
> para que eu tenha controle granular sobre a estrutura do post.

**Acceptance Criteria:**
1. `BlockEditor.tsx` implementado como container principal com estado gerenciado via `useReducer`
2. `BlockWrapper.tsx` implementado com: drag handle, menu de contexto (duplicar, mover, deletar), indicador de tipo
3. Drag-and-drop funcional via `@dnd-kit/core` + `@dnd-kit/sortable` com feedback visual
4. `BlockToolbar.tsx` implementado com icones para os 8 blocos mais usados + botao "More"
5. Toolbar de insercao aparece entre blocos (hover) e no final (always visible)
6. Botao "+" insere novo bloco na posicao correta
7. Auto-save funcional com debounce de 30s e indicador visual de status
8. Atalho `/` em bloco vazio abre `SlashCommand.tsx` com busca
9. Atalhos `Ctrl+S`, `Ctrl+Shift+P`, `Ctrl+D`, `Delete` funcionais

**Integration Verification:**
- IV1: Editor carrega em < 2s com 20+ blocos
- IV2: Drag-and-drop nao causa re-renders desnecessarios
- IV3: Auto-save nao interrompe edicao

---

#### Story 1.4 — Block Editors: Implementacao dos 16 Tipos

> Como um **editor de conteudo**,
> quero editores especializados para cada tipo de bloco,
> para que eu possa criar conteudo rico sem escrever Markdown.

**Acceptance Criteria:**
1. `HeadingEditor` — selector de level (H1-H6) + input de texto, anchor_id auto-gerado
2. `ParagraphEditor` — rich text com TipTap (bold, italic, underline, link, highlight), `InlineToolbar` ao selecionar texto
3. `ImageEditor` — upload zone (drag file ou click), preview, inputs para alt (obrigatorio) e caption
4. `GalleryEditor` — multi-upload, selector de layout (grid/carousel/masonry), reorder de imagens
5. `QuoteEditor` — textarea para citacao, inputs para author e source_url
6. `ListEditor` — toggle ordered/unordered, add/remove/reorder items
7. `CodeEditor` — textarea monospace, selector de language, input de filename
8. `EmbedEditor` — input de URL com deteccao automatica de tipo (YouTube, Instagram, etc), preview
9. `DividerEditor` — selector de estilo (line/dots/space), preview
10. `CalloutEditor` — selector de tipo (info/warning/tip/success), textarea, input source_url
11. `TableEditor` — grid editavel com add/remove linhas e colunas, input caption
12. `FaqEditor` — pares question/answer com add/remove, reorder
13. `CtaEditor` — inputs para text, button_text, button_url, selector de style
14. `VideoEditor` — input de URL, upload de poster, input caption e duration
15. `AccordionEditor` — pares title/content com add/remove
16. `ProductEditor` — inputs para name, price, image (upload), link, description

**Integration Verification:**
- IV1: Cada editor valida seus dados com Zod schema correspondente
- IV2: Dados do editor sao serializados corretamente para o formato JSONB
- IV3: Todos os editores sao acessiveis via teclado

---

#### Story 1.5 — SEO Panel: Score Engine e Interface

> Como um **editor de conteudo**,
> quero ver o score de SEO em tempo real enquanto edito,
> para que eu possa otimizar cada post antes de publicar.

**Acceptance Criteria:**
1. `seo-scorer.ts` implementado com os 14 checks definidos em FR10, calculo de score 0-100
2. `SeoPanel.tsx` implementado como aba na sidebar do editor
3. Score gauge visual com cores (verde/amarelo/laranja/vermelho) conforme FR11
4. Lista de checks individuais com status (ok/warning/fail) e mensagem descritiva
5. Campos de SEO config editaveis na sidebar (meta_title, meta_description, focus_keyword, etc.)
6. Contador de caracteres para meta_title (max 60) e meta_description (max 160)
7. Preview de SERP (como o resultado aparecera no Google) com titulo, URL e descricao
8. Score recalculado em tempo real a cada alteracao de conteudo ou config SEO
9. SEO score salvo no campo `seo_score` do post para exibicao no dashboard

**Integration Verification:**
- IV1: Score calculation e client-side puro, sem chamadas API
- IV2: Recalculo nao causa lag no editor (< 50ms por calculo)
- IV3: Dados SEO config salvos corretamente no JSONB via API

---

#### Story 1.6 — GEO Panel: Citability, Entities e Speakable

> Como um **estrategista de conteudo**,
> quero otimizar posts para AI search engines,
> para que o Cafe Canastra seja citado como fonte em respostas de IA.

**Acceptance Criteria:**
1. `geo-analyzer.ts` implementado com metricas: citability score, entity count, FAQ coverage, source citations
2. `GeoPanel.tsx` implementado como aba na sidebar do editor
3. Citability score calculado: % de paragrafos auto-contidos (< 3 frases = citavel)
4. `EntitySelector.tsx` — interface para adicionar entidades semanticas com name, type, sameAs (URL Wikidata)
5. Indicadores visuais para: entities vinculadas, FAQ blocks, source citations, speakable coverage
6. Recomendacoes contextuais (ex: "Adicione um bloco FAQ para melhorar citabilidade")
7. Configuracao de `speakable_selectors` para markup SpeakableSpecification
8. Campos de geo targeting (region, city, coordinates) na sidebar

**Integration Verification:**
- IV1: Analise GEO e client-side, sem dependencias externas
- IV2: Entidades sao salvas no geo_config JSONB corretamente
- IV3: Metricas GEO atualizadas em tempo real

---

#### Story 1.7 — Blog Frontend: Block Renderer e TOC

> Como um **visitante do blog**,
> quero ver posts renderizados com blocos visuais ricos e table of contents,
> para que eu tenha uma experiencia de leitura superior.

**Acceptance Criteria:**
1. `BlockRenderer.tsx` implementado como switch/map que renderiza componente correto por tipo de bloco
2. 16 componentes de rendering implementados (HeadingBlock, ParagraphBlock, etc.) com estilizacao Tailwind
3. `TableOfContents.tsx` gerado automaticamente a partir de blocos `heading`, sidebar flutuante em desktop, menu colapsavel em mobile
4. Reading time exibido no header do post
5. Blocos `faq` renderizados como accordion interativo
6. Blocos `embed` renderizados com iframe responsivo
7. Blocos `code` com syntax highlighting via `prism-react-renderer`
8. Blocos `gallery` com layout responsivo e lightbox
9. ReactMarkdown removido como dependencia de rendering de posts (manter se usado em outros locais)
10. Pagina `/blog/[slug]/page.tsx` refatorada para usar BlockRenderer
11. Pagina `/blog/page.tsx` atualizada para exibir posts com dados dos novos campos

**Integration Verification:**
- IV1: Posts existentes (migrados como bloco paragraph unico) renderizam corretamente
- IV2: Core Web Vitals mantidos: LCP < 2.5s, CLS < 0.1
- IV3: Blocos de editor lazy-loaded (nao carregados no frontend publico)

---

#### Story 1.8 — Enhanced Structured Data (JSON-LD)

> Como um **motor de busca (Google/Perplexity/ChatGPT)**,
> quero structured data rico e preciso,
> para que o conteudo do Cafe Canastra seja compreendido e citado corretamente.

**Acceptance Criteria:**
1. `Article` schema enriquecido com `speakable`, `about`, `mentions`, `dateModified`
2. `FAQPage` schema gerado automaticamente quando post contem bloco(s) `faq`
3. `Product` schema gerado quando post contem bloco(s) `product`
4. `VideoObject` schema gerado quando post contem bloco(s) `video`
5. `HowTo` schema gerado quando detectado heading "Como..." seguido de bloco `list`
6. `ImageObject` schema gerado para cada bloco `image`
7. `BreadcrumbList` schema mantido e melhorado (4 niveis: Home > Blog > Categoria > Post)
8. Meta tags `hreflang` geradas para posts com traducoes (via `translation_group_id`)
9. Sitemap.xml dinamico incluindo todos os posts publicados com lastmod, changefreq, priority
10. Todos os schemas validados contra Google Rich Results Test (sem erros)

**Integration Verification:**
- IV1: JSON-LD valido (parseable) em todas as paginas de post
- IV2: Schemas nao duplicados (um de cada tipo por pagina)
- IV3: Sitemap inclui posts publicados, exclui drafts/scheduled

---

#### Story 1.9 — Admin Dashboard Enhanced

> Como um **administrador do blog**,
> quero ver o status completo de todos os posts com metricas de SEO,
> para que eu possa gerenciar o conteudo de forma eficiente.

**Acceptance Criteria:**
1. Dashboard exibe lista de posts com: titulo, status badge, categoria, locale flag, data, SEO score badge
2. SEO score badge com cores: verde (90+), amarelo (70-89), laranja (50-69), vermelho (< 50)
3. Filtros por: status, categoria, locale
4. Busca por titulo
5. Ordenacao por: data, titulo, SEO score
6. Acoes por post: Edit, Preview (se publicado), Duplicate, Delete (com confirmacao)
7. Botao "New Post" direciona para editor de blocos
8. Contador de posts por status (Published: X, Draft: Y, Scheduled: Z)

**Integration Verification:**
- IV1: Dashboard carrega em < 2s com 100+ posts
- IV2: Acoes de delete usam soft-delete ou confirmacao dupla
- IV3: Filtros e busca funcionam sem recarregar pagina

---

#### Story 1.10 — Post Settings Panel e Publish Flow

> Como um **administrador do blog**,
> quero configurar metadados do post e controlar publicacao,
> para que cada post seja publicado com todas as informacoes corretas.

**Acceptance Criteria:**
1. `PostSettings.tsx` implementado como aba "Configuracoes" na sidebar
2. Campos: titulo, slug (auto-gerado), featured image, categoria, tags (chips), autor, locale, status
3. Selector de locale com bandeiras (PT/EN/ES)
4. Link para traducoes existentes via `translation_group_id`
5. Reading time calculado e exibido automaticamente
6. Word count exibido
7. Tres botoes de acao: Save Draft, Schedule (com date picker), Publish Now
8. Confirmacao antes de publicar: "Publicar agora? SEO Score: XX/100"
9. Alerta se SEO score < 50: "Score de SEO baixo. Deseja publicar mesmo assim?"

**Integration Verification:**
- IV1: Slug auto-gerado nao conflita com slugs existentes (validacao no servidor)
- IV2: Agendamento funciona com cron existente (`/api/publish-scheduled`)
- IV3: Status transitions corretas: draft -> scheduled/published, scheduled -> published

---

## 9. Sequencia de Implementacao

```
Story 1.1  Foundation (Types + DB)
    |
Story 1.2  API Layer (CRUD + Blocos)
    |
Story 1.3  Block Editor Core (Container + DnD)
    |
Story 1.4  Block Editors (16 tipos)
    |
    +--- Story 1.5  SEO Panel (Score + Interface)
    |
    +--- Story 1.6  GEO Panel (Citability + Entities)
    |
Story 1.7  Blog Frontend (Block Renderer + TOC)
    |
Story 1.8  Structured Data (JSON-LD enhanced)
    |
Story 1.9  Admin Dashboard Enhanced
    |
Story 1.10 Post Settings + Publish Flow
```

**Dependencias:**
- 1.1 -> 1.2 (API precisa dos tipos e schema)
- 1.2 -> 1.3 (Editor precisa da API para salvar)
- 1.3 -> 1.4 (Editores de bloco plugam no container)
- 1.4 -> 1.5, 1.6 (Paineis laterais analisam conteudo dos blocos)
- 1.4 -> 1.7 (Frontend renderiza os blocos)
- 1.7 -> 1.8 (Structured data depende do rendering)
- 1.2 -> 1.9 (Dashboard exibe dados da API)
- 1.5 + 1.6 -> 1.10 (Settings integra com SEO/GEO panels)

---

## 10. Riscos e Mitigacoes

| # | Risco | Probabilidade | Impacto | Mitigacao |
|---|-------|--------------|---------|-----------|
| R1 | Bundle size do editor impactar performance do frontend publico | Media | Alto | Lazy-load do editor (dynamic import). Blocos de rendering sao leves, separados do editor |
| R2 | Complexidade do TipTap rich text causar bugs de serializacao | Media | Medio | Limitar features do TipTap ao minimo necessario. Testes extensivos de serialization/deserialization |
| R3 | Migracao de posts existentes causar perda de formatacao | Baixa | Alto | Script de migracao preserva conteudo Markdown original. Reversivel: manter campo `content` como backup |
| R4 | DnD performance degradar com muitos blocos (50+) | Baixa | Medio | Virtualizacao de lista se necessario. Limite soft de 100 blocos por post |
| R5 | SEO Score engine gerar falsos positivos/negativos | Media | Baixo | Pesos ajustaveis. Score como recomendacao, nao bloqueio |
| R6 | Structured data invalido causar penalizacao Google | Baixa | Alto | Validacao contra schemas oficiais. Testes automatizados com Google Rich Results validator |

---

## 11. Metricas de Sucesso

| Metrica | Baseline Atual | Target (3 meses) | Target (6 meses) |
|---------|---------------|-------------------|-------------------|
| Posts publicados/mes | 0-2 | 8+ | 12+ |
| SEO Score medio | N/A | >= 75 | >= 85 |
| Tempo de criacao por post | ~30 min | < 15 min | < 10 min |
| Organic traffic (blog) | Baseline | +100% | +300% |
| Rich results no Google | 0 | 5+ | 15+ |
| Citacoes em AI search | 0 | 1+ | 3+ |
| Core Web Vitals | Green | Green | Green |

---

## 12. Fora de Escopo (Explicitamente)

- **Integracao com CMS externo** (Contentful, Sanity, etc.) — tudo e self-hosted via Supabase
- **Editor colaborativo** (multiplos editores simultaneos) — single-user por post
- **Versionamento de conteudo** (historico de revisoes) — pode ser adicionado em epic futuro
- **AI-assisted writing** (geracao de conteudo por IA) — pode ser adicionado em epic futuro
- **Analytics de posts** (views, engagement) — pode ser adicionado em epic futuro
- **Comentarios em posts** — fora de escopo deste epic
- **Newsletter/email integration** — fora de escopo deste epic
- **Traducao automatica** (PT->EN/ES) — manual por enquanto, traducao e via `translation_group_id`

---

## 13. Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Criacao | 2026-03-03 | 2.0 | PRD completo para reformulacao do blog com block editor, SEO e GEO | Morgan (PM) |

---

*PRD v2.0 — Block Editor CMS + SEO/GEO Avancado*
*Cafe Canastra — Synkra AIOS*

— Morgan, planejando o futuro
