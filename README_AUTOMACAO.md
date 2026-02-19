# 🤖 Sistema de Automação de Blog - Café Canastra

Este sistema permite gerar posts de blog automaticamente usando Inteligência Artificial (OpenAI GPT-4o-mini) a partir de URLs de referência.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Arquitetura](#arquitetura)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema de automação de blog consiste em:

1. **Interface Administrativa**: `/cafecanastrablog` - Página para inserir URLs e gerar posts
2. **API Route**: `/api/automacaoblog` - Endpoint que processa as requisições
3. **Serviços**:
   - `scraperService.ts` - Extrai conteúdo de URLs usando JSDOM + Readability
   - `openaiService.ts` - Integração com OpenAI para geração de conteúdo
   - `blogGenerationService.ts` - Orquestra todo o fluxo e salva no Supabase

### Fluxo de Trabalho

```
Usuário insere URLs
    ↓
API valida e processa
    ↓
Scraper extrai conteúdo das URLs
    ↓
OpenAI gera novo post (JSON)
    ↓
Post é salvo no Supabase (draft)
    ↓
Usuário é notificado com sucesso
```

## 📦 Pré-requisitos

- Node.js 20+
- Projeto Next.js 16+ (já configurado)
- Conta no Supabase
- Chave API da OpenAI
- Dependências instaladas (já instaladas):
  - `openai`
  - `@mozilla/readability`
  - `jsdom`
  - `cheerio`
  - `slugify`

## 🚀 Instalação

### 1. Instalar Dependências

As dependências já foram instaladas. Se precisar reinstalar:

```bash
cd cafecanastrablog
npm install openai @mozilla/readability jsdom cheerio slugify
npm install -D @types/jsdom @types/mozilla-readability
```

### 2. Configurar Banco de Dados

Execute o script SQL no Supabase:

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie o conteúdo de `database/extend_blog_posts_for_automation.sql`
5. Cole no SQL Editor e execute

O script criará as seguintes colunas na tabela `blog_posts`:
- `status` (draft, published, archived)
- `source_urls` (array de URLs de origem)
- `seo_keywords` (array de palavras-chave)
- `is_ai_generated` (boolean)
- `ai_generation_metadata` (JSON com metadados)

### 3. Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env.local` no diretório `cafecanastrablog/`:

```bash
# Copie do arquivo de exemplo
cp .env.example.automacao .env.local
```

Preencha as seguintes variáveis:

#### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Para obter essas chaves:**
1. No Dashboard do Supabase, vá em **Settings** > **API**
2. Copie o **Project URL** para `NEXT_PUBLIC_SUPABASE_URL`
3. Copie a **anon public** key para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copie a **service_role** secret para `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **ATENÇÃO**: A service_role key tem acesso total ao banco. Use com cuidado!

#### OpenAI

```env
OPENAI_API_KEY=sk-proj-...
```

**Para obter a chave:**
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Clique em **Create new secret key**
3. Dê um nome para a chave
4. Copie a chave gerada

### 4. Verificar Instalação

Inicie o servidor de desenvolvimento:

```bash
cd cafecanastrablog
npm run dev
```

Acesse: `http://localhost:3000/cafecanastrablog`

A página deve mostrar o status das conexões:
- ✅ Supabase: Conectado
- ✅ OpenAI (GPT-4o-mini): Conectado

Se ambos estiverem conectados, você pode começar a usar!

## 📖 Uso

### Gerar um Post de Blog

1. Acesse `http://localhost:3000/cafecanastrablog`
2. Insira URLs de referência (uma por linha)
   ```
   https://exemplo.com/artigo-cafe
   https://outro-site.com/cafe-especial
   ```
3. Clique em **Gerar Post com IA**
4. Aguarde o processamento (pode levar 30-60 segundos)
5. Você receberá uma notificação de sucesso
6. O post será salvo como rascunho no Supabase

### Visualizar Posts Gerados

Os posts gerados podem ser visualizados no Supabase:

1. Vá ao Dashboard do Supabase
2. Acesse **Table Editor**
3. Selecione a tabela `blog_posts`
4. Filtre por `is_ai_generated = true` para ver posts gerados por IA
5. Você pode editar, publicar ou arquivar os posts

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
cafecanastrablog/
├── app/
│   ├── api/
│   │   └── automacaoblog/
│   │       └── route.ts              # API Route (POST/GET)
│   └── cafecanastrablog/
│       └── page.tsx                 # Interface administrativa
├── services/
│   ├── scraperService.ts              # Web scraping
│   ├── openaiService.ts              # Integração OpenAI
│   └── blogGenerationService.ts      # Orquestração
├── database/
│   └── extend_blog_posts_for_automation.sql
└── .env.local                       # Variáveis de ambiente (não commitar!)
```

### Detalhes dos Serviços

#### scraperService.ts

- Usa `JSDOM` para parsear HTML
- Usa `@mozilla/readability` para extrair conteúdo principal
- Remove menus, footers, ads automaticamente
- Suporta múltiplas URLs em paralelo (máx 5 simultâneas)
- Timeout de 30 segundos por URL

#### openaiService.ts

- Usa modelo `gpt-4o-mini` (padrão)
- Suporta múltiplos modelos: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`
- System prompt: "Barista Sênior" especialista em cafés
- Gera JSON estruturado com:
  - `title` (máx 60 caracteres)
  - `slug` (URL amigável)
  - `seo_keywords` (array de 5 palavras-chave)
  - `content` (Markdown formatado)
- Retry automático (até 3 tentativas)
- Validação rigorosa da saída
- `response_format: { type: 'json_object' }` para garantir JSON válido

#### blogGenerationService.ts

- Orquestra scraping + IA
- Melhora slug com `slugify` se necessário
- Salva no Supabase usando `SUPABASE_SERVICE_ROLE_KEY`
- Metadados de geração (modelo, timestamp, quantidade de fontes)
- Valida conexões com os serviços

### Modelos OpenAI Disponíveis

O sistema suporta os seguintes modelos da OpenAI:

- **`gpt-4o`** (recomendado para máxima qualidade)
- **`gpt-4o-mini`** (padrão - melhor custo/benefício)
- **`gpt-4-turbo`** (alternativa rápida)
- **`gpt-4`** (versão clássica)
- **`gpt-3.5-turbo`** (mais econômico)

Para mudar o modelo, edite o arquivo `services/openaiService.ts` e altere a propriedade `defaultModel`.

## 🔧 Troubleshooting

### "Não foi possível extrair conteúdo das fontes"

**Causas possíveis:**
- URLs estão bloqueadas por robots.txt
- Sites exigem JavaScript para carregar (não suportado)
- Timeout (30 segundos)
- Conteúdo muito curto (< 100 caracteres)

**Soluções:**
- Tente URLs diferentes
- Verifique se o site permite scraping
- Use artigos com conteúdo completo

### "Erro ao gerar conteúdo após 3 tentativas"

**Causas possíveis:**
- Chave API da OpenAI inválida ou expirada
- Problemas de rede
- IA retornando formato JSON inválido
- Limite de taxa (rate limit) excedido

**Soluções:**
- Verifique a chave `OPENAI_API_KEY`
- Teste a conexão clicando em "Verificar Conexões"
- Verifique o console do servidor para detalhes do erro
- Se houver rate limit, aguarde alguns minutos antes de tentar novamente

### "Supabase não conectado"

**Causas possíveis:**
- Variáveis de ambiente não configuradas
- URL ou chaves incorretas
- Problemas de rede

**Soluções:**
- Verifique `.env.local`
- Confirme que as chaves estão corretas no Supabase Dashboard
- Execute o script SQL novamente se necessário

### "Slug deve conter apenas letras minúsculas, números e hífens"

**Causa:**
- IA gerou slug inválido

**Solução:**
- O sistema aplica `slugify` automaticamente
- Se persistir, edite o post diretamente no Supabase

### Timeout na API

**Causa:**
- Muitas URLs ou scraping demorado

**Soluções:**
- Reduza a quantidade de URLs (máx 10)
- Use URLs de sites rápidos
- Aumente o timeout em `scraperService.ts` se necessário

### "Error 429 Too Many Requests"

**Causa:**
- Limite de taxa da API da OpenAI excedido

**Soluções:**
- Aguarde alguns minutos e tente novamente
- Considere usar um modelo mais econômico como `gpt-3.5-turbo`
- Verifique sua conta para limites de uso

## 💰 Custos

### Estimativa de Custos da OpenAI

Baseado nos preços atuais da OpenAI (sujeito a alterações):

| Modelo | Custo por 1K tokens (input) | Custo por 1K tokens (output) | Custo estimado por post |
|--------|------------------------------|-------------------------------|----------------------|
| gpt-4o | US$ 2.50 | US$ 10.00 | ~US$ 0.05 |
| gpt-4o-mini | US$ 0.15 | US$ 0.60 | ~US$ 0.01 |
| gpt-4-turbo | US$ 10.00 | US$ 30.00 | ~US$ 0.15 |
| gpt-3.5-turbo | US$ 0.50 | US$ 1.50 | ~US$ 0.01 |

**Estimativa por post:**
- Input: ~3,000 tokens (conteúdo das referências)
- Output: ~2,000 tokens (post gerado)
- Total: ~5,000 tokens por post

**Recomendação:** Use `gpt-4o-mini` para o melhor custo-benefício.

### Monitoramento de Custos

Acompanhe seu uso e custos em:
- [OpenAI Dashboard](https://platform.openai.com/usage)
- [OpenAI Billing](https://platform.openai.com/account/billing/overview)

## 🚨 Segurança

### Boas Práticas

1. **Nunca** commitar `.env.local` no Git
2. Use apenas `SUPABASE_SERVICE_ROLE_KEY` no servidor
3. Monitore o uso da API da OpenAI
4. Revise os posts gerados antes de publicar
5. Limite o acesso à página `/cafecanastrablog` (autenticação)
6. Rotacione as chaves API periodicamente

### Rate Limiting

O sistema tem limites embutidos:
- Máximo 10 URLs por requisição
- 5 requisições simultâneas de scraping
- 3 tentativas de geração com IA
- Timeout de 30 segundos por URL

## 📊 Monitoramento

### Logs do Servidor

Os serviços logam informações no console:
- Status de conexões
- URLs processadas
- Conteúdo extraído
- Erros e avisos
- Tokens usados pela OpenAI

### Supabase

Use o Supabase Dashboard para:
- Visualizar posts gerados
- Monitorar queries
- Verificar logs

### OpenAI Platform

Acesse [OpenAI Platform](https://platform.openai.com) para:
- Verificar uso da API
- Monitorar custos
- Ver histórico de requisições
- Configurar alertas de uso

## 🔄 Atualizações

Para atualizar o sistema:

1. Atualize as dependências:
   ```bash
   npm install openai@latest @mozilla/readability@latest
   ```

2. Verifique se há atualizações no script SQL

3. Reinicie o servidor de desenvolvimento

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do servidor (`npm run dev`)
2. Consulte a seção de Troubleshooting acima
3. Verifique os logs no Supabase Dashboard
4. Verifique o uso e erros no OpenAI Platform
5. Teste as conexões na interface administrativa

## 📝 Notas Importantes

- O sistema usa o modelo `gpt-4o-mini` por padrão (melhor custo/benefício)
- Posts são gerados como `draft` (não publicados automaticamente)
- O conteúdo é original e otimizado para SEO
- A IA segue o persona "Barista Sênior" especialista em cafés
- Sempre revise o conteúdo antes de publicar
- Monitore os custos da OpenAI regularmente
- Considere implementar autenticação na página administrativa

## 🎯 Personalização

### Mudar o Modelo OpenAI

Edite `services/openaiService.ts`:

```typescript
private defaultModel = 'gpt-4o'; // ou 'gpt-4', 'gpt-3.5-turbo', etc.
```

### Personalizar o System Prompt

Edite `services/openaiService.ts` e modifique a constante `SYSTEM_PROMPT` para alterar o tom de voz e as instruções da IA.

### Ajustar Temperatura

A temperatura controla a criatividade da IA:
- `0.0` - Mais previsível e determinista
- `0.7` - Equilibrado (padrão)
- `1.0` - Mais criativo e variável

Edite `services/openaiService.ts`:

```typescript
const temperature = options.temperature ?? 0.7; // Ajuste conforme necessário
```

---

**Desenvolvido para Café Canastra** ☕