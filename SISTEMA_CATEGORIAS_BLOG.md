# Sistema de Categorias do Blog

## Visão Geral

O blog possui um sistema de categorias que separa os posts em duas categorias principais:

- **Receitas** (`/blog/receitas`) - Posts com `post_type: "recipe"`
- **Notícias** (`/blog/noticias`) - Posts com `post_type: "news"`

## Estrutura de Rotas

### Páginas de Listagem
- `/blog` - Todos os posts (página principal)
- `/blog/receitas` - Apenas receitas
- `/blog/noticias` - Apenas notícias

### Páginas Individuais
- `/blog/[slug]` - Posts sem categoria específica (post_type: null)
- `/blog/receitas/[slug]` - Posts de receitas
- `/blog/noticias/[slug]` - Posts de notícias

### Redirecionamento Automático
O sistema inclui redirecionamento automático para garantir que posts sejam acessados pelas rotas corretas:

- Posts com `post_type: "recipe"` → redirecionados para `/blog/receitas/[slug]`
- Posts com `post_type: "news"` → redirecionados para `/blog/noticias/[slug]`
- Posts sem `post_type` → permanecem em `/blog/[slug]`

## Campo post_type

O campo `post_type` foi adicionado à interface `BlogPost` e à tabela do Supabase:

```typescript
post_type: "recipe" | "news" | null
```

### Valores Possíveis
- `"recipe"` - Para receitas
- `"news"` - Para notícias
- `null` - Para posts sem categoria específica

## Webhook

O webhook processa dados flexíveis baseados no `post_type`. O sistema suporta dois formatos principais:

### Receitas (`post_type: "recipe"`)

```json
{
  "post_type": "recipe",
  "titulo": "Pizza de Café: A Combinação Perfeita para o Dia Mundial da Pizza!",
  "resumo": "No Dia Mundial da Pizza...",
  "ingredientes_titulo": "Ingredientes",
  "ingrediente_1": "250g de farinha de trigo (preferencialmente orgânica)",
  "ingrediente_2": "150ml de água morna",
  // ... até ingrediente_15
  "modo_de_preparo_titulo": "Modo de Preparo",
  "modo_de_preparo_1": "Em uma tigela grande, misture o fermento...",
  "modo_de_preparo_2": "Adicione a farinha, o sal...",
  // ... até modo_de_preparo_15
  "subtitulo_1": "Dicas do Especialista",
  "paragrafo_1": "Experimente essa receita exclusiva...",
  // ... até subtitulo_10/paragrafo_10
  "conclusao": "A pizza de café não é só uma novidade..."
}
```

### Notícias (`post_type: "news"`)

```json
{
  "post_type": "news",
  "titulo": "Tarifa de 50% dos EUA ameaça competitividade do café brasileiro",
  "resumo": "A recente decisão dos Estados Unidos...",
  "subtitulo_1": "Como a nova tarifa impacta o café brasileiro",
  "paragrafo_1": "O anúncio causado pelo ex-presidente...",
  "subtitulo_2": "Concorrência mais acirrada",
  "paragrafo_2": "Com o encarecimento dos grãos brasileiros...",
  // ... até subtitulo_10/paragrafo_10
  "fonte": "https://www.cafepoint.com.br/noticias/...",
  "conclusao": "Apesar do cenário adverso..."
}
```

### Campos Dinâmicos

O sistema processa automaticamente:
- **Ingredientes**: `ingrediente_1` até `ingrediente_15`
- **Modo de Preparo**: `modo_de_preparo_1` até `modo_de_preparo_15`
- **Subtítulos/Parágrafos**: `subtitulo_1`/`paragrafo_1` até `subtitulo_10`/`paragrafo_10`
- **Fonte**: Campo `fonte` para notícias

## Componentes Atualizados

### BlogListClient
- Aceita props para categoria e título personalizado
- Mostra navegação por categorias na página principal
- Links dos posts direcionam para rotas corretas baseadas no `post_type`

### BlogBreadcrumb
- Aceita parâmetro `category`
- Mostra breadcrumb com categoria quando aplicável

### ClientBlogPostPage
- Aceita parâmetro `category`
- Passa categoria para o breadcrumb
- Renderiza conteúdo dinâmico baseado no `post_type`:
  - **Receitas**: Ingredientes, modo de preparo, subtítulos/parágrafos
  - **Notícias**: Subtítulos/parágrafos, fonte
- Mantém compatibilidade com formato antigo (seções numeradas)

## Filtragem

### Página Principal (`/blog`)
- Mostra todos os posts
- Inclui navegação por categorias
- Links direcionam para rotas corretas

### Páginas de Categoria
- Filtram posts por `post_type`
- URLs específicas para cada categoria
- SEO otimizado para cada categoria

## SEO

### URLs Estruturadas
- Receitas: `https://cafecanastra.com/blog/receitas/[slug]`
- Notícias: `https://cafecanastra.com/blog/noticias/[slug]`
- Posts gerais: `https://cafecanastra.com/blog/[slug]`

### Structured Data
- Breadcrumbs incluem categoria
- URLs corretas no schema.org
- Metadados específicos por categoria

## Migração

Posts existentes sem `post_type` continuam funcionando na rota `/blog/[slug]` para compatibilidade.

## Exemplo de Uso

### Webhook Response (Receita)
```json
{
  "post_type": "recipe",
  "titulo": "Pizza de Café: A Combinação Perfeita para o Dia Mundial da Pizza!",
  "resumo": "No Dia Mundial da Pizza, nada melhor do que inovar...",
  "ingredientes_titulo": "Ingredientes",
  "ingrediente_1": "250g de farinha de trigo (preferencialmente orgânica)",
  "ingrediente_2": "150ml de água morna",
  "modo_de_preparo_titulo": "Modo de Preparo",
  "modo_de_preparo_1": "Em uma tigela grande, misture o fermento...",
  "conclusao": "A pizza de café não é só uma novidade..."
}
```

### Resultado (Receita)
- Post salvo com `post_type: "recipe"`
- Acessível em `/blog/receitas/pizza-de-cafe-dia-mundial-da-pizza`
- Aparece na listagem de receitas
- Renderiza ingredientes e modo de preparo
- Breadcrumb: Início > Blog > Receitas > Pizza de Café

### Webhook Response (Notícia)
```json
{
  "post_type": "news",
  "titulo": "Tarifa de 50% dos EUA ameaça competitividade do café brasileiro",
  "resumo": "A recente decisão dos Estados Unidos...",
  "subtitulo_1": "Como a nova tarifa impacta o café brasileiro",
  "paragrafo_1": "O anúncio causado pelo ex-presidente...",
  "fonte": "https://www.cafepoint.com.br/noticias/...",
  "conclusao": "Apesar do cenário adverso..."
}
```

### Resultado (Notícia)
- Post salvo com `post_type: "news"`
- Acessível em `/blog/noticias/tarifa-50-por-cento-cafe-eua`
- Aparece na listagem de notícias
- Renderiza subtítulos/parágrafos e fonte
- Breadcrumb: Início > Blog > Notícias > Tarifa de 50% dos EUA

## Redirecionamento Automático

### Como Funciona
1. Usuário acessa `/blog/[slug]`
2. Sistema busca o post pelo slug
3. Se o post tem `post_type: "recipe"` → redireciona para `/blog/receitas/[slug]`
4. Se o post tem `post_type: "news"` → redireciona para `/blog/noticias/[slug]`
5. Se o post não tem `post_type` → permanece em `/blog/[slug]`

### Benefícios
- **SEO**: URLs consistentes e organizadas
- **UX**: Navegação intuitiva por categorias
- **Compatibilidade**: Posts antigos continuam funcionando
- **Flexibilidade**: Suporte para posts sem categoria

## Estrutura de Arquivos

```
app/blog/
├── page.tsx                    # Lista todos os posts
├── [slug]/
│   ├── page.tsx               # Posts sem categoria (com redirecionamento)
│   └── ClientBlogPostPage.tsx # Componente de post
├── receitas/
│   ├── page.tsx               # Lista receitas
│   └── [slug]/
│       └── page.tsx           # Posts de receitas
└── noticias/
    ├── page.tsx               # Lista notícias
    └── [slug]/
        └── page.tsx           # Posts de notícias
```

## Melhorias Implementadas

### 1. Redirecionamento Automático
- **Arquivo**: `app/blog/[slug]/page.tsx`
- **Funcionalidade**: Redireciona automaticamente posts com categorias para suas rotas corretas
- **Benefício**: Garante URLs consistentes e SEO otimizado

### 2. BlogManager Atualizado
- **Arquivo**: `app/blogmanager/page.tsx`
- **Funcionalidade**: Links de visualização direcionam para rotas corretas baseadas no `post_type`
- **Benefício**: UX melhorada no painel administrativo

### 3. Navegação por Categorias
- **Arquivo**: `app/blog/BlogListClient.tsx`
- **Funcionalidade**: Links dos posts direcionam para rotas corretas
- **Benefício**: Navegação intuitiva e organizada

### 4. SEO Otimizado
- **Arquivos**: Todas as páginas de categoria
- **Funcionalidade**: Metadados e structured data específicos por categoria
- **Benefício**: Melhor indexação e ranking nos motores de busca

## Testes

### Teste de Redirecionamento
1. Crie um post com `post_type: "recipe"`
2. Acesse `/blog/[slug]`
3. Verifique se redireciona para `/blog/receitas/[slug]`

### Teste de Categorização
1. Crie posts com diferentes `post_type`
2. Verifique se aparecem nas listagens corretas
3. Confirme se os links funcionam corretamente

### Teste de Compatibilidade
1. Crie um post sem `post_type`
2. Verifique se funciona em `/blog/[slug]`
3. Confirme se não há redirecionamento

### Teste do BlogManager
1. Acesse o painel administrativo
2. Crie posts com diferentes categorias
3. Teste os links de visualização
4. Verifique se direcionam para as rotas corretas 