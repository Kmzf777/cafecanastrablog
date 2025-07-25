# 🔧 Solução de Problemas - Sistema de Analytics

## 🚨 Problema: Dashboard não exibe dados e tracking não funciona

### 📋 Diagnóstico Rápido

Execute este comando para testar o sistema:

```bash
node test-analytics.js
```

### 🔍 Possíveis Causas e Soluções

## 1. **Tabelas não criadas no Supabase** ⚠️

**Sintomas:**
- Dashboard mostra "Tabelas não configuradas"
- Tracking funciona mas dados não são salvos
- Mensagem: "Analytics tracking funcionando (tabelas não configuradas)"

**Solução:**
1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login e acesse seu projeto
3. Vá para **SQL Editor**
4. Clique em **"New query"**
5. Copie e cole todo o conteúdo do arquivo `database/analytics_table.sql`
6. Clique em **"Run"**

**Verificação:**
- No painel do Supabase, vá para **Table Editor**
- Você deve ver duas novas tabelas: `analytics` e `sessions`

## 2. **Variáveis de ambiente não configuradas** ⚠️

**Sintomas:**
- Erro: "Supabase connection failed"
- APIs retornam erro 500
- Console mostra erros de conexão

**Solução:**
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

3. Reinicie o servidor:
```bash
npm run dev
```

**Como obter as credenciais:**
1. No Supabase, vá para **Settings** > **API**
2. Copie a **Project URL** e **anon public** key

## 3. **Permissões do Supabase incorretas** ⚠️

**Sintomas:**
- Erro: "permission denied"
- Tabelas existem mas não conseguem inserir dados

**Solução:**
1. No Supabase, vá para **Authentication** > **Policies**
2. Verifique se as tabelas `analytics` e `sessions` têm políticas que permitem:
   - **INSERT** (para salvar dados)
   - **SELECT** (para ler dados)
3. Se não existem, crie políticas com:
   - **Target roles**: `anon`
   - **Policy definition**: `true`

## 4. **Componente AnalyticsTracker não está sendo usado** ⚠️

**Sintomas:**
- APIs funcionam mas não há dados sendo enviados
- Console não mostra logs de tracking

**Verificação:**
Confirme se o componente está sendo usado nas páginas:

```tsx
// Deve estar em app/page.tsx, app/blog/page.tsx, etc.
<AnalyticsTracker
  pageUrl="/cafecanastra"
  pageTitle="Café Canastra - Café Especial"
/>
```

## 5. **Problemas de CORS ou rede** ⚠️

**Sintomas:**
- Erro: "Failed to fetch"
- Requisições não chegam ao servidor

**Solução:**
1. Verifique se o servidor está rodando em `http://localhost:3001`
2. Confirme que não há bloqueios de firewall
3. Teste acessando diretamente: `http://localhost:3001/api/analytics/track`

## 6. **Dados não aparecem no dashboard** ⚠️

**Sintomas:**
- Tracking funciona mas dashboard mostra zeros
- Dados existem no Supabase mas não aparecem

**Solução:**
1. Verifique se os dados estão sendo inseridos corretamente:
   ```sql
   SELECT * FROM analytics ORDER BY created_at DESC LIMIT 5;
   ```

2. Verifique se as consultas do dashboard estão funcionando:
   ```sql
   SELECT COUNT(*) FROM analytics WHERE created_at >= NOW() - INTERVAL '7 days';
   ```

## 🧪 Testes de Verificação

### Teste 1: Verificar APIs
```bash
# Testar tracking
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"pageUrl":"/test","pageTitle":"Test"}'

# Testar dashboard
curl http://localhost:3001/api/analytics/dashboard?period=7d
```

### Teste 2: Verificar Supabase
```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('analytics', 'sessions');

-- Verificar dados
SELECT COUNT(*) FROM analytics;
SELECT COUNT(*) FROM sessions;
```

### Teste 3: Verificar variáveis de ambiente
```javascript
// Adicione este código temporariamente em qualquer página
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
```

## 📊 Logs de Debug

### Ativar logs detalhados:
1. Abra o console do navegador (F12)
2. Navegue pelo site
3. Procure por mensagens como:
   - "📊 Analytics data to insert"
   - "✅ Analytics data inserted successfully"
   - "❌ Erro ao inserir na tabela analytics"

### Logs do servidor:
1. No terminal onde o servidor está rodando
2. Procure por mensagens de erro ou sucesso
3. Verifique se as APIs estão sendo chamadas

## 🔄 Fluxo de Dados

```
1. Usuário acessa página
   ↓
2. AnalyticsTracker é montado
   ↓
3. useAnalytics hook é executado
   ↓
4. POST /api/analytics/track é chamado
   ↓
5. Dados são salvos no Supabase
   ↓
6. Dashboard busca dados via GET /api/analytics/dashboard
   ↓
7. Dados são exibidos no frontend
```

## 🆘 Se Nada Funcionar

### 1. **Reset completo:**
```bash
# Parar servidor
Ctrl+C

# Limpar cache
rm -rf .next

# Reinstalar dependências
npm install

# Reiniciar servidor
npm run dev
```

### 2. **Verificar versões:**
```bash
node --version
npm --version
```

### 3. **Testar em navegador diferente:**
- Chrome, Firefox, Edge
- Modo incógnito
- Desabilitar extensões

### 4. **Verificar firewall/antivírus:**
- Temporariamente desabilitar
- Adicionar exceções para localhost:3001

## 📞 Suporte

Se ainda houver problemas:

1. **Execute o teste completo:**
   ```bash
   node test-analytics.js
   ```

2. **Colete informações:**
   - Resultado do teste
   - Logs do console do navegador
   - Logs do servidor
   - Screenshot do erro

3. **Verifique:**
   - ✅ Tabelas criadas no Supabase
   - ✅ Variáveis de ambiente configuradas
   - ✅ Servidor rodando em localhost:3001
   - ✅ APIs respondendo corretamente

---

**Status:** 🔧 Sistema funcionando com fallback  
**Próximo passo:** Configurar tabelas no Supabase 