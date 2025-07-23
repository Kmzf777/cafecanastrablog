# 🚀 Configuração Rápida - Sistema de Monitoramento

## ⚡ Setup em 3 Passos

### 1. **Criar Tabelas no Supabase**
Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Copie e cole o conteúdo de database/analytics_table.sql
-- Ou execute diretamente no SQL Editor do Supabase
```

### 2. **Verificar Variáveis de Ambiente**
Certifique-se de que estas variáveis estão configuradas:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. **Reiniciar o Servidor**
```bash
npm run dev
# ou
yarn dev
```

## ✅ Teste Rápido

1. Acesse `/blogmanager`
2. Clique na aba "Monitoramento"
3. **O dashboard deve carregar com as métricas!** ✅

## 🔧 Arquivos Criados

- `database/analytics_table.sql` - Script SQL para criar tabelas
- `app/api/analytics/track/route.ts` - API de rastreamento
- `app/api/analytics/dashboard/route.ts` - API do dashboard
- `components/analytics-dashboard.tsx` - Dashboard principal
- `components/analytics-tracker.tsx` - Componente de tracking
- `hooks/use-analytics.ts` - Hook personalizado
- `test-analytics.js` - Script de teste
- `SISTEMA_MONITORAMENTO.md` - Documentação completa

## 📊 Funcionalidades

### Dashboard Completo
- ✅ Total de visualizações
- ✅ Visitas únicas
- ✅ Home page vs Blog
- ✅ Posts mais visualizados
- ✅ Dispositivos e browsers
- ✅ Taxa de bounce
- ✅ Tempo médio de sessão
- ✅ Gráficos diários

### Rastreamento Automático
- ✅ Home page (`/cafecanastra`)
- ✅ Blog (`/blog`)
- ✅ Posts individuais (`/blog/[slug]`)
- ✅ Detecção de dispositivos
- ✅ Sessões únicas
- ✅ Duração de visitas

## 🧪 Testar o Sistema

Execute o script de teste:
```bash
node test-analytics.js
```

## 🆘 Solução de Problemas

### Erro: "Tabelas não encontradas"
- Execute o script SQL no Supabase
- Verifique se as variáveis de ambiente estão corretas

### Erro: "Dashboard não carrega"
- Verifique a conexão com o Supabase
- Abra o console do navegador para ver erros

### Erro: "Tracking não funciona"
- Verifique se os componentes estão incluídos
- Teste com o script de teste
- Confirme se as APIs estão funcionando

## 📞 Suporte

Para mais detalhes, consulte:
- `SISTEMA_MONITORAMENTO.md` - Documentação completa
- Console do navegador - Logs de erro
- Network tab - Requisições da API

---

**Status:** ✅ Pronto para uso  
**Última atualização:** Dezembro 2024 