# 🔧 Configuração das Variáveis de Ambiente

## ❌ Problema Identificado

Os posts do blog não estão sendo exibidos porque as variáveis de ambiente do Supabase não estão configuradas.

## ✅ Solução

### 1. Criar arquivo `.env.local`

Crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# JWT Secret (para autenticação)
JWT_SECRET=cafe-canastra-super-secret-key-2024

# Configurações de produção
NODE_ENV=development
```

### 2. Obter credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)
4. Vá para **Settings** > **API**
5. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Criar tabela no Supabase

Execute o script SQL em **SQL Editor** do Supabase:

```sql
-- Copie o conteúdo do arquivo database/update_blog_posts_table.sql
```

### 4. Reiniciar o servidor

```bash
npm run dev
```

## 🔍 Verificação

Após configurar, verifique se está funcionando:

1. Acesse `http://localhost:3000/blog`
2. Os posts devem aparecer
3. Se não aparecerem, verifique o console do navegador

## 📞 Suporte

Se precisar de ajuda:
1. Verifique se as credenciais estão corretas
2. Confirme se a tabela foi criada no Supabase
3. Verifique os logs no console do navegador

---

**Status:** ⚠️ Aguardando configuração das variáveis de ambiente 