# Sistema de Agendamento Automático de Posts

Este sistema permite agendar automaticamente a criação de posts no blog entre horários configuráveis, utilizando webhooks e integração com o Supabase.

## 🚀 Funcionalidades

- **Agendamento Automático**: Criação automática de posts entre horários configuráveis
- **Botão On/Off**: Controle simples para habilitar/desabilitar o agendamento
- **Horários Personalizáveis**: Configure horário de início e fim
- **Verificação de Horário**: Sistema verifica se está dentro do horário permitido
- **Modo de Postagem**: Automático ou personalizado com tema e público-alvo
- **Integração com Webhooks**: Dispara webhooks de produção e teste
- **Salvamento no Supabase**: Posts são automaticamente salvos no banco de dados
- **Interface Administrativa**: Painel para configurar e monitorar o agendamento
- **Script de Cron Job**: Script Node.js para automação via cron

## 📁 Estrutura dos Arquivos

```
├── app/api/scheduled-posts/route.ts    # API de agendamento
├── scripts/scheduled-posts.js          # Script para cron job
├── agendamento-posts.bat               # Script batch para Windows
├── cron-scheduled-posts.txt            # Exemplos de configuração cron
├── AGENDAMENTO_AUTOMATICO.md           # Esta documentação
└── app/blogmanager/page.tsx            # Interface administrativa
```

## 🔧 Configuração

### 1. API de Agendamento (`/api/scheduled-posts`)

A API verifica o horário e executa o agendamento:

- **GET**: Verifica status do agendamento
- **POST**: Executa o agendamento automático

**Parâmetros aceitos:**
```json
{
  "quantidade": 1,
  "atraso": 1000,
  "modo": "automático",
  "tema": "Café especial da Canastra",
  "publico_alvo": "Apreciadores de café gourmet",
  "startHour": 7,
  "endHour": 10,
  "isEnabled": true
}
```

### 2. Interface Administrativa

A interface unificada permite:

- **Botão On/Off**: Habilitar/desabilitar o agendamento
- **Configuração de Horários**: Definir horário de início e fim
- **Modo de Postagem**: Automático ou personalizado
- **Status em Tempo Real**: Verificar se está dentro do horário permitido

### 3. Script de Cron Job

O script `scripts/scheduled-posts.js` pode ser executado por um cron job:

```bash
# Tornar executável
chmod +x scripts/scheduled-posts.js

# Testar manualmente
node scripts/scheduled-posts.js
```

### 4. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```bash
# URL da API de agendamento
SCHEDULED_POSTS_API_URL=http://localhost:3003/api/scheduled-posts

# Configuração dos posts
POSTS_QUANTITY=1
POSTS_DELAY=1000
POSTS_MODE=automático
POSTS_THEME="Café especial da Canastra"
POSTS_TARGET_AUDIENCE="Apreciadores de café gourmet"

# Configuração de horários
START_HOUR=7
END_HOUR=10
IS_ENABLED=true

# Configuração de retry
MAX_RETRIES=3
RETRY_DELAY=5000

# Logging
VERBOSE=true
```

## ⏰ Configuração do Cron Job

### Exemplos de Cron Jobs

```bash
# Executar uma vez por hora entre horários configuráveis
0 7-9 * * * /usr/bin/node /caminho/para/seu/projeto/scripts/scheduled-posts.js

# Executar a cada 30 minutos entre horários específicos
0,30 7-9 * * * /usr/bin/node /caminho/para/seu/projeto/scripts/scheduled-posts.js

# Executar a cada 15 minutos entre horários específicos
0,15,30,45 7-9 * * * /usr/bin/node /caminho/para/seu/projeto/scripts/scheduled-posts.js

# Executar apenas em horários específicos
30 7,9 * * * /usr/bin/node /caminho/para/seu/projeto/scripts/scheduled-posts.js
```

### Configuração com Variáveis Personalizadas

```bash
# Configurar horários personalizados
0 8-11 * * * cd /caminho/para/seu/projeto && START_HOUR=8 END_HOUR=11 /usr/bin/node scripts/scheduled-posts.js

# Desabilitar agendamento
0 7-9 * * * cd /caminho/para/seu/projeto && IS_ENABLED=false /usr/bin/node scripts/scheduled-posts.js

# Criar post personalizado
0 7-9 * * * cd /caminho/para/seu/projeto && POSTS_MODE=personalizado POSTS_THEME="Café especial" POSTS_TARGET_AUDIENCE="Gourmets" /usr/bin/node scripts/scheduled-posts.js
```

## 🎛️ Interface Administrativa

### Aba de Postagem Automática

A interface unificada inclui:

1. **Status do Agendamento**
   - Horário atual
   - Horário permitido (configurável)
   - Status (dentro/fora do horário)

2. **Configuração do Agendamento**
   - Botão On/Off para habilitar/desabilitar
   - Horário de início (0-23)
   - Horário de fim (0-23)
   - Modo de postagem (automático/personalizado)
   - Tema e público-alvo (para modo personalizado)

3. **Informações sobre Cron Job**
   - Exemplos de configuração com horários personalizados
   - Dicas de uso

### Como Usar

1. Acesse o painel administrativo (`/blogmanager`)
2. Vá para a aba "Postagem Automática"
3. Configure o botão On/Off
4. Defina os horários de início e fim
5. Escolha o modo de postagem
6. Clique em "Executar Agendamento" (só funciona dentro do horário configurado)

## 🔍 Monitoramento e Logs

### Logs do Script

O script gera logs detalhados:

```
[2024-01-15T07:00:00.000Z] [INFO] 🌅 Script de Agendamento Automático iniciado
[2024-01-15T07:00:00.000Z] [INFO] 📅 Data/Hora: 15/01/2024 07:00:00
[2024-01-15T07:00:00.000Z] [INFO] 🔍 Verificando status da API...
[2024-01-15T07:00:00.000Z] [INFO] ✅ API está funcionando
[2024-01-15T07:00:00.000Z] [INFO] ⏰ Horário atual: 7:00
[2024-01-15T07:00:00.000Z] [INFO] 📅 Dentro do horário permitido: Sim
[2024-01-15T07:00:00.000Z] [INFO] 🚀 Iniciando agendamento automático (tentativa 1/4)
[2024-01-15T07:00:00.000Z] [INFO] 📡 Enviando requisição para: http://localhost:3003/api/scheduled-posts
[2024-01-15T07:00:00.000Z] [INFO] ✅ Agendamento executado com sucesso!
[2024-01-15T07:00:00.000Z] [INFO] 📊 Resultado: 1 post(s) criado(s) de 1 tentativa(s)
[2024-01-15T07:00:00.000Z] [INFO] 🎉 Agendamento concluído com sucesso!
```

### Logs da API

A API também gera logs detalhados:

```
=== AGENDAMENTO AUTOMÁTICO INICIADO ===
✅ Horário permitido: 7:00
Configuração: { quantidade: 1, atraso: 1000, modo: 'automático', startHour: 7, endHour: 10, isEnabled: true }
📝 Processando post 1/1
✅ Usando resposta do webhook de produção.
✅ Webhook 1 processado: { ... }
✅ Post salvo: Título do Post
=== AGENDAMENTO CONCLUÍDO ===
Posts criados: 1/1
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **"Agendamento desabilitado"**
   - Verifique se o botão On/Off está ativado na interface
   - Confirme a variável `IS_ENABLED=true`

2. **"Fora do horário permitido"**
   - Verifique os horários configurados na interface
   - Confirme as variáveis `START_HOUR` e `END_HOUR`

3. **"API não está disponível"**
   - Verifique se o servidor Next.js está rodando
   - Confirme a URL da API em `SCHEDULED_POSTS_API_URL`

4. **"Supabase não conectado"**
   - Verifique as variáveis de ambiente do Supabase
   - Confirme se o banco está acessível

### Comandos de Diagnóstico

```bash
# Verificar status da API
curl http://localhost:3003/api/scheduled-posts

# Testar agendamento manualmente
node scripts/scheduled-posts.js

# Verificar logs do cron
tail -f /var/log/scheduled-posts.log

# Verificar crontab
crontab -l
```

## 🔒 Segurança

- O agendamento só funciona entre os horários configurados
- Controle On/Off para habilitar/desabilitar
- A API verifica autenticação antes de executar
- Logs detalhados para auditoria
- Retry automático em caso de falhas
- Validação de parâmetros de entrada

## 📈 Métricas e Relatórios

O sistema registra:
- Status do agendamento (habilitado/desabilitado)
- Horários configurados
- Quantidade de posts criados
- Horário de execução
- Status de sucesso/erro
- Tempo de processamento
- Detalhes de cada post criado

## 🔄 Atualizações Futuras

Possíveis melhorias:
- Interface para visualizar histórico de agendamentos
- Configuração de múltiplos horários
- Notificações por email/Slack
- Dashboard com métricas
- Agendamento de posts personalizados com templates
- Integração com calendário
- Configuração de dias da semana

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do sistema
2. Teste manualmente o script
3. Confirme a configuração do cron job
4. Verifique as variáveis de ambiente
5. Teste a API diretamente
6. Verifique o status On/Off na interface

---

**Desenvolvido para Café Canastra - Sistema de Agendamento Automático de Posts** 