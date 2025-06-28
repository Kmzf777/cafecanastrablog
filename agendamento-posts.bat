@echo off
echo ========================================
echo Agendamento Automático de Posts - Cafe Canastra
echo ========================================
echo Data/Hora: %date% %time%
echo.

REM Configurar variáveis de ambiente
set SCHEDULED_POSTS_API_URL=http://localhost:3003/api/scheduled-posts
set POSTS_QUANTITY=1
set POSTS_DELAY=1000
set POSTS_MODE=automático
set POSTS_THEME=
set POSTS_TARGET_AUDIENCE=
set START_HOUR=7
set END_HOUR=10
set IS_ENABLED=true
set MAX_RETRIES=3
set RETRY_DELAY=5000
set VERBOSE=true

REM Navegar para o diretório do projeto
cd /d "%~dp0"

echo Verificando se o Node.js esta instalado...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js em: https://nodejs.org/
    echo.
    echo Pressione qualquer tecla para sair...
    pause >nul
    exit /b 1
)

echo Node.js encontrado: 
node --version

echo.
echo Configuracao do agendamento:
echo - Horario: %START_HOUR%h - %END_HOUR%h
echo - Modo: %POSTS_MODE%
echo - Habilitado: %IS_ENABLED%
echo.

echo Verificando se o servidor esta rodando...
curl -s http://localhost:3003/api/scheduled-posts >nul 2>&1
if errorlevel 1 (
    echo AVISO: Servidor nao respondeu. Verifique se o Next.js esta rodando.
    echo.
)

echo.
echo Executando agendamento...
echo ========================================

node scripts/scheduled-posts.js

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERRO: Falha na execucao do agendamento
    echo Verifique os logs acima
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Agendamento executado com sucesso
    echo ========================================
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul 