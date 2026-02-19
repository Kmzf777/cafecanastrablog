# Troubleshooting - Problemas com Criação de Posts

## Problema: Posts não estão sendo criados ou não aparecem no blogmanager

### 1. Verificar Estrutura da Tabela

Execute o script SQL para atualizar a tabela `blog_posts`:

```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: database/update_blog_posts_table.sql
```

### 2. Verificar Variáveis de Ambiente

Certifique-se de que as variáveis estão configuradas no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Testar Conexão com Supabase

Execute o teste de conexão:

```bash
npm run build
```

Verifique os logs para ver se há erros de conexão.

### 4. Testar Webhook Manualmente

Use o script de teste:

```bash
node test-webhook.js
```

### 5. Verificar Logs do Webhook

Quando um post é enviado via webhook, verifique os logs no console:

- `=== WEBHOOK BLOG RECEBIDO ===`
- `=== PROCESSANDO DADOS DO WEBHOOK ===`
- `=== INICIANDO SALVAMENTO NO SUPABASE ===`

### 6. Problemas Comuns

#### A. Erro de Campos Não Existentes
**Sintoma**: Erro "column does not exist"
**Solução**: Execute o script SQL para adicionar os novos campos

#### B. Erro de Permissões
**Sintoma**: Erro "permission denied"
**Solução**: Verificar RLS (Row Level Security) no Supabase

#### C. Erro de Validação
**Sintoma**: Erro "check constraint"
**Solução**: Verificar se o `post_type` é "recipe" ou "news"

### 7. Teste Simples

Crie um post básico para testar:

```javascript
// test-simple-post.js
const testPost = {
  titulo: "Post de Teste",
  resumo: "Teste básico",
  slug: "post-teste",
  post_type: "recipe",
  modo: "teste",
  status: "publicado"
};
```

### 8. Verificar BlogManager

1. Acesse `/blogmanager`
2. Verifique se está autenticado
3. Clique em "Gerenciamento de Posts"
4. Verifique se os posts aparecem

### 9. Logs de Debug

Adicione logs temporários para debug:

```javascript
// No webhook
console.log("Body recebido:", JSON.stringify(body, null, 2))
console.log("Resposta do webhook utilizada:", prodData)

// Na função saveBlogPost
console.log("postData recebido:", JSON.stringify(postData, null, 2))
console.log("Dados processados:", JSON.stringify(processedData, null, 2))
```

### 10. Verificar Status do Supabase

No blogmanager, verifique:
- Status da conexão
- Variáveis de ambiente
- Autenticação

### 11. Teste de Post Manual

Crie um post manualmente no Supabase para verificar se a estrutura está correta:

```sql
INSERT INTO blog_posts (
  titulo, 
  resumo, 
  slug, 
  post_type, 
  modo, 
  status
) VALUES (
  'Teste Manual',
  'Post criado manualmente',
  'teste-manual',
  'recipe',
  'teste',
  'publicado'
);
```

### 12. Verificar Interface BlogPost

Certifique-se de que a interface `BlogPost` está atualizada com todos os campos necessários.

### 13. Limpar Cache

```bash
# Limpar cache do Next.js
rm -rf .next
npm run build
```

### 14. Verificar Console do Navegador

Abra o DevTools e verifique:
- Erros no console
- Requisições de rede
- Status das chamadas para a API

### 15. Teste de Endpoint

Teste o endpoint diretamente:

```bash
curl -X POST http://localhost:3000/api/blog-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "post_type": "recipe",
    "titulo": "Teste via Curl",
    "resumo": "Teste via curl"
  }'
```

## Próximos Passos

Se o problema persistir:

1. Verifique os logs completos
2. Teste com dados mínimos
3. Verifique a estrutura da tabela no Supabase
4. Teste a conexão diretamente
5. Verifique as permissões da tabela 