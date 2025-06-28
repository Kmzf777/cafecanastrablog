# Sistema de Persistência de Configurações Automáticas

Este documento explica o novo sistema implementado para manter as configurações do agendamento automático sempre salvas, mesmo após recarregar a página.

## 🎯 Problema Resolvido

**Problema anterior:** O sistema de on/off e configurações do agendamento automático era resetado toda vez que a página era recarregada, pois os valores eram mantidos apenas em estado local.

**Solução implementada:** Sistema de persistência dupla (localStorage + Supabase) que mantém as configurações sempre salvas.

## 🏗️ Arquitetura da Solução

### 1. **API de Configurações** (`/api/auto-config`)
- **GET**: Carrega configurações do Supabase
- **POST**: Salva configurações no Supabase
- Conversão automática entre camelCase (frontend) e snake_case (banco)

### 2. **Hook Personalizado** (`useAutoConfig`)
- Gerencia estado das configurações
- Persistência em localStorage (resposta rápida)
- Sincronização com Supabase (backup seguro)
- Sincronização automática a cada 30 segundos

### 3. **Tabela no Supabase** (`auto_config`)
- Armazena configurações de forma persistente
- Validações de dados
- Timestamps automáticos
- Políticas de segurança

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
```
├── app/api/auto-config/route.ts          # API para salvar/carregar configs
├── hooks/use-auto-config.ts              # Hook personalizado
├── database/auto_config_table.sql        # Script SQL para criar tabela
└── SISTEMA_PERSISTENCIA_CONFIG.md        # Esta documentação
```

### Arquivos Modificados:
```
└── app/blogmanager/page.tsx              # Integração com novo hook
```

## 🚀 Como Usar

### 1. **Configurar Banco de Dados**
Execute o script SQL no Supabase:
```sql
-- Execute o conteúdo de database/auto_config_table.sql
-- no SQL Editor do Supabase
```

### 2. **Usar no Componente**
```tsx
import { useAutoConfig } from '@/hooks/use-auto-config'

function MeuComponente() {
  const { 
    config,           // Configurações atuais
    isLoading,        // Status de carregamento
    isSaving,         // Status de salvamento
    updateConfig      // Função para atualizar
  } = useAutoConfig()

  // Exemplo de uso
  const handleToggle = (enabled: boolean) => {
    updateConfig({ isEnabled: enabled })
  }

  return (
    <Switch 
      checked={config.isEnabled}
      onCheckedChange={handleToggle}
    />
  )
}
```

## 🔄 Fluxo de Funcionamento

### Carregamento:
1. **localStorage** → Carregamento instantâneo (cache)
2. **Supabase** → Sincronização com servidor
3. **Fallback** → Configuração padrão se necessário

### Salvamento:
1. **localStorage** → Salvamento imediato (UX)
2. **Supabase** → Backup persistente
3. **Feedback** → Toast de confirmação/erro

### Sincronização:
- Automática a cada 30 segundos
- Detecta mudanças no servidor
- Mantém dados atualizados

## 🎛️ Configurações Disponíveis

```typescript
interface AutoConfig {
  isEnabled: boolean        // Status on/off
  startHour: number         // Hora de início (0-23)
  endHour: number           // Hora de fim (0-23)
  modo: "automático" | "personalizado"
  tema: string             // Tema para modo personalizado
  publico_alvo: string     // Público-alvo para modo personalizado
}
```

## 🛡️ Tratamento de Erros

### Cenários Cobertos:
- **Sem conexão**: Usa localStorage
- **Erro de servidor**: Mantém dados locais
- **Dados inválidos**: Validação e feedback
- **Conflitos**: Resolução automática

### Feedback ao Usuário:
- ✅ Configuração salva com sucesso
- ⚠️ Salvo localmente, erro no servidor
- ❌ Erro de validação
- 🔄 Sincronizando...

## 🔧 Configurações Avançadas

### Variáveis de Ambiente:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Personalização:
- Intervalo de sincronização: 30s (editável no hook)
- Timeout de requisições: padrão do fetch
- Retry automático: implementado no hook

## 📊 Benefícios

### Para o Usuário:
- ✅ Configurações sempre salvas
- ⚡ Resposta instantânea
- 🔄 Sincronização automática
- 📱 Funciona offline

### Para o Desenvolvedor:
- 🧩 Hook reutilizável
- 🔒 Dados seguros no Supabase
- 📝 Código bem documentado
- 🛠️ Fácil manutenção

## 🧪 Testes

### Cenários de Teste:
1. **Recarregar página** → Configurações mantidas
2. **Mudar configuração** → Salva automaticamente
3. **Sem internet** → Funciona com localStorage
4. **Múltiplas abas** → Sincronização entre abas
5. **Dados corrompidos** → Fallback para padrão

## 🔮 Próximos Passos

### Melhorias Futuras:
- [ ] Histórico de configurações
- [ ] Backup/restore de configurações
- [ ] Configurações por usuário
- [ ] Validação mais robusta
- [ ] Logs de auditoria

### Integração:
- [ ] Com sistema de logs
- [ ] Com monitoramento
- [ ] Com notificações
- [ ] Com analytics

---

**Status:** ✅ Implementado e Funcionando  
**Versão:** 1.0.0  
**Data:** Dezembro 2024 