# Configuração do Agendamento no Windows

Este guia explica como configurar o agendamento automático de posts no Windows usando o Agendador de Tarefas.

## 🖥️ Pré-requisitos

- Windows 10/11 ou Windows Server
- Node.js instalado
- Projeto configurado e funcionando
- Servidor Next.js rodando

## 🔧 Configuração do Agendador de Tarefas

### 1. Abrir o Agendador de Tarefas

1. Pressione `Win + R`
2. Digite `taskschd.msc`
3. Pressione Enter

### 2. Criar Nova Tarefa

1. No painel direito, clique em "Criar Tarefa Básica..."
2. Digite um nome: `Agendamento Posts Blog`
3. Adicione uma descrição: `Executa agendamento automático de posts entre 7h e 10h`
4. Clique em "Próximo"

### 3. Configurar Gatilho

1. Selecione "Diariamente"
2. Clique em "Próximo"
3. Configure:
   - **Data de início**: Data atual
   - **Hora**: 07:00:00
4. Clique em "Próximo"

### 4. Configurar Ação

1. Selecione "Iniciar um programa"
2. Clique em "Próximo"
3. Configure:
   - **Programa/script**: `C:\Program Files\nodejs\node.exe`
   - **Adicionar argumentos**: `C:\caminho\para\seu\projeto\scripts\scheduled-posts.js`
   - **Iniciar em**: `C:\caminho\para\seu\projeto`
4. Clique em "Próximo"

### 5. Finalizar

1. Revise as configurações
2. Marque "Abrir as propriedades avançadas desta tarefa quando eu clicar em Concluir"
3. Clique em "Concluir"

### 6. Configurações Avançadas

Na janela de propriedades que abrir:

#### Aba "Gatilhos"
1. Clique em "Editar"
2. Configure:
   - **Repetir tarefa a cada**: 1 hora
   - **Por um período de**: 3 horas
3. Clique em "OK"

#### Aba "Condições"
1. Desmarque "Iniciar a tarefa apenas se o computador estiver em uso"
2. Marque "Executar com privilégios mais altos"

#### Aba "Configurações"
1. Marque "Permitir que a tarefa seja executada sob demanda"
2. Marque "Se a tarefa falhar, reiniciar a cada": 5 minutos
3. Configure "Tentativas de reinicialização": 3

#### Aba "Geral"
1. Marque "Executar independentemente do usuário estar conectado"
2. Marque "Não armazenar senha"

## 📝 Script Batch para Windows

Crie um arquivo `agendamento-posts.bat` na raiz do projeto:

```batch
@echo off
echo ========================================
echo Agendamento Automático de Posts - Cafe Canastra
echo ========================================
echo Data/Hora: %date% %time%
echo.

cd /d "C:\caminho\para\seu\projeto"

echo Verificando se o Node.js esta instalado...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo Executando agendamento...
node scripts/scheduled-posts.js

if errorlevel 1 (
    echo ERRO: Falha na execucao do agendamento
    echo Verifique os logs acima
) else (
    echo Agendamento executado com sucesso
)

echo.
echo ========================================
pause
```

### Configurar Tarefa com Script Batch

1. No Agendador de Tarefas, configure a ação como:
   - **Programa/script**: `C:\caminho\para\seu\projeto\agendamento-posts.bat`
   - **Adicionar argumentos**: (deixe vazio)
   - **Iniciar em**: `C:\caminho\para\seu\projeto`

## 🔧 Variáveis de Ambiente no Windows

### Configurar Variáveis de Ambiente

1. Pressione `Win + R`
2. Digite `sysdm.cpl`
3. Clique em "Variáveis de Ambiente"

#### Variáveis do Sistema
Adicione as seguintes variáveis:

```
SCHEDULED_POSTS_API_URL=http://localhost:3003/api/scheduled-posts
POSTS_QUANTITY=1
POSTS_DELAY=1000
POSTS_MODE=automático
MAX_RETRIES=3
RETRY_DELAY=5000
VERBOSE=true
```

### Configurar no Script Batch

Alternativamente, configure as variáveis no script batch:

```batch
@echo off
set SCHEDULED_POSTS_API_URL=http://localhost:3003/api/scheduled-posts
set POSTS_QUANTITY=1
set POSTS_DELAY=1000
set POSTS_MODE=automático
set MAX_RETRIES=3
set RETRY_DELAY=5000
set VERBOSE=true

cd /d "C:\caminho\para\seu\projeto"
node scripts/scheduled-posts.js
```

## 📊 Monitoramento

### Logs do Windows

Os logs do Agendador de Tarefas ficam em:
- **Visualizar**: Agendador de Tarefas → Biblioteca do Agendador de Tarefas → Sua Tarefa → Histórico
- **Arquivo**: `C:\Windows\System32\Tasks\Scheduler\Logs`

### Logs Personalizados

Configure o script batch para gerar logs:

```batch
@echo off
set LOG_FILE=C:\logs\agendamento-posts.log

echo [%date% %time%] Iniciando agendamento >> %LOG_FILE%

cd /d "C:\caminho\para\seu\projeto"
node scripts/scheduled-posts.js >> %LOG_FILE% 2>&1

echo [%date% %time%] Agendamento finalizado >> %LOG_FILE%
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **"Node.js não encontrado"**
   - Verifique se o Node.js está instalado
   - Confirme o caminho no script: `C:\Program Files\nodejs\node.exe`

2. **"Caminho não encontrado"**
   - Verifique se o caminho do projeto está correto
   - Use caminhos absolutos

3. **"Permissão negada"**
   - Execute o Agendador de Tarefas como administrador
   - Configure "Executar com privilégios mais altos"

4. **"Tarefa não executa"**
   - Verifique se o servidor Next.js está rodando
   - Confirme as variáveis de ambiente
   - Teste o script manualmente

### Comandos de Diagnóstico

```cmd
# Testar Node.js
node --version

# Testar script manualmente
cd C:\caminho\para\seu\projeto
node scripts/scheduled-posts.js

# Verificar variáveis de ambiente
echo %SCHEDULED_POSTS_API_URL%

# Verificar se o servidor está rodando
curl http://localhost:3003/api/scheduled-posts
```

## 📅 Exemplos de Configuração

### Execução Única às 7h
- **Gatilho**: Diariamente às 07:00

### Execução Múltipla
- **Gatilho**: Diariamente às 07:00
- **Repetir**: A cada 1 hora por 3 horas

### Execução com Logs
- **Ação**: Script batch com redirecionamento de logs
- **Logs**: `C:\logs\agendamento-posts.log`

## 🔒 Segurança

- Execute com privilégios mínimos necessários
- Não armazene senhas na tarefa
- Use caminhos absolutos
- Configure logs para auditoria
- Teste em ambiente de desenvolvimento primeiro

## 📞 Suporte

Para problemas específicos do Windows:
1. Verifique o Histórico do Agendador de Tarefas
2. Teste o script manualmente
3. Confirme as permissões de usuário
4. Verifique as variáveis de ambiente
5. Teste a conectividade com a API

---

**Configuração específica para Windows - Sistema de Agendamento Automático de Posts** 