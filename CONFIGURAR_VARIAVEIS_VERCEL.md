# 🔧 CONFIGURAR VARIÁVEIS DE AMBIENTE NA VERCEL

## ❌ PROBLEMA IDENTIFICADO

O sistema de analytics não está funcionando porque as variáveis de ambiente do Supabase não estão configuradas na Vercel (produção).

## ✅ SOLUÇÃO

### 1. Acessar o Painel da Vercel

1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta
3. Encontre o projeto `cafecanastrablog`
4. Clique no projeto

### 2. Configurar Variáveis de Ambiente

1. No painel do projeto, clique na aba **"Settings"**
2. No menu lateral, clique em **"Environment Variables"**
3. Clique em **"Add New"**

### 3. Adicionar as Variáveis

#### Variável 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://dlkfpjismifzzzyphqtn.supabase.co`
- **Environment:** `Production` ✅
- **Environment:** `Preview` ✅
- **Environment:** `Development` ✅

#### Variável 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsa2ZwamlzbWlmenp6eXBoY3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQ5NzQsImV4cCI6MjA1MTI1MDk3NH0.placeholder`
- **Environment:** `Production` ✅
- **Environment:** `Preview` ✅
- **Environment:** `Development` ✅

### 4. Redeploy

1. Após adicionar as variáveis, clique em **"Save"**
2. Vá para a aba **"Deployments"**
3. Clique em **"Redeploy"** no último deployment
4. Aguarde o deploy terminar

### 5. Verificar

1. Acesse: https://cafecanastra.com
2. Abra o DevTools (F12)
3. Vá para a aba "Console"
4. Procure por mensagens de analytics
5. Acesse: https://cafecanastra.com/blogmanager
6. Verifique se o dashboard mostra dados

## 🔍 COMO VERIFICAR SE FUNCIONOU

### Teste 1: Console do Navegador
```javascript
// No console do navegador, digite:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### Teste 2: API de Analytics
```bash
curl -X POST https://cafecanastra.com/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"pageUrl":"/test","pageTitle":"Test"}'
```

### Teste 3: Dashboard
Acesse: https://cafecanastra.com/blogmanager

## 🚨 IMPORTANTE

- As variáveis devem ser configuradas para **TODOS** os ambientes (Production, Preview, Development)
- Após configurar, é necessário fazer um **redeploy**
- O deploy pode levar 2-5 minutos
- Verifique os logs da Vercel para erros

## 📞 SUPORTE

Se ainda não funcionar após configurar as variáveis:

1. Verifique os logs da Vercel
2. Teste localmente com `npm run dev`
3. Verifique se as tabelas existem no Supabase
4. Execute o script SQL no Supabase se necessário

## 🎯 PRÓXIMOS PASSOS

1. ✅ Configurar variáveis na Vercel
2. ✅ Fazer redeploy
3. ✅ Testar o site
4. ✅ Verificar dashboard
5. ✅ Testar com diferentes dispositivos 