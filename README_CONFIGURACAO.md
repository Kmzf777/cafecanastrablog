# 🚀 Configuração Rápida - Sistema de Persistência

## ⚡ Setup em 3 Passos

### 1. **Criar Tabela no Supabase**
Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Copie e cole o conteúdo de database/auto_config_table.sql
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
2. Configure o agendamento automático
3. Recarregue a página
4. **As configurações devem permanecer!** ✅

## 🔧 Arquivos Criados

- `app/api/auto-config/route.ts` - API de configurações
- `hooks/use-auto-config.ts` - Hook de persistência
- `database/auto_config_table.sql` - Script SQL
- `SISTEMA_PERSISTENCIA_CONFIG.md` - Documentação completa

## 🆘 Solução de Problemas

### Erro: "Tabela não encontrada"
- Execute o script SQL no Supabase
- Verifique se as variáveis de ambiente estão corretas

### Erro: "Configurações não salvam"
- Verifique a conexão com o Supabase
- Abra o console do navegador para ver erros

### Configurações resetam ao recarregar
- Verifique se o hook `useAutoConfig` está sendo usado
- Confirme se a API está funcionando

## 📞 Suporte

Para mais detalhes, consulte:
- `SISTEMA_PERSISTENCIA_CONFIG.md` - Documentação completa
- Console do navegador - Logs de erro
- Network tab - Requisições da API

---

**Status:** ✅ Pronto para uso  
**Última atualização:** Dezembro 2024 