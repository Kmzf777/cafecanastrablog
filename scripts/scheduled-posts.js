#!/usr/bin/env node

/**
 * Script de Agendamento Automático de Posts
 * 
 * Este script pode ser executado por um cron job para disparar
 * postagens automáticas entre horários configuráveis.
 * 
 * Exemplo de uso com cron:
 * 0 7-9 * * * /usr/bin/node /path/to/scripts/scheduled-posts.js
 * 
 * Ou para executar a cada 30 minutos entre horários específicos:
 * 0,30 7-9 * * * /usr/bin/node /path/to/scripts/scheduled-posts.js
 */

const https = require('https');
const http = require('http');

// Configuração do agendamento
const config = {
  // URL da API de agendamento (ajuste conforme necessário)     
  apiUrl: process.env.SCHEDULED_POSTS_API_URL || 'http://localhost:3000/api/scheduled-posts',
  
  // Configuração padrão dos posts
  postConfig: {
    quantidade: parseInt(process.env.POSTS_QUANTITY) || 1,
    atraso: parseInt(process.env.POSTS_DELAY) || 1000,
    modo: process.env.POSTS_MODE || "automático",
    tema: process.env.POSTS_THEME,
    publico_alvo: process.env.POSTS_TARGET_AUDIENCE,
    startHour: parseInt(process.env.START_HOUR) || 7,
    endHour: parseInt(process.env.END_HOUR) || 10,
    isEnabled: process.env.IS_ENABLED !== 'false' // Padrão: true
  },
  
  // Configuração de retry
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
  retryDelay: parseInt(process.env.RETRY_DELAY) || 5000,
  
  // Logging
  verbose: process.env.VERBOSE === 'true' || false
};

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function executeScheduledPosts(retryCount = 0) {
  try {
    log(`🚀 Iniciando agendamento automático (tentativa ${retryCount + 1}/${config.maxRetries + 1})`);
    
    if (config.verbose) {
      log(`📋 Configuração: ${JSON.stringify(config.postConfig, null, 2)}`);
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ScheduledPosts/1.0'
      },
      body: JSON.stringify(config.postConfig)
    };
    
    log(`📡 Enviando requisição para: ${config.apiUrl}`);
    
    const response = await makeRequest(config.apiUrl, requestOptions);
    
    if (response.status === 200) {
      log(`✅ Agendamento executado com sucesso!`);
      log(`📊 Resultado: ${response.data.createdPosts} post(s) criado(s) de ${response.data.totalAttempts} tentativa(s)`);
      
      if (config.verbose && response.data.results) {
        response.data.results.forEach((result, index) => {
          if (result.success) {
            log(`✅ Post ${index + 1}: ${result.post} (${result.slug})`);
          } else {
            log(`❌ Post ${index + 1}: ${result.error}`, 'ERROR');
          }
        });
      }
      
      return {
        success: true,
        data: response.data
      };
      
    } else if (response.status === 403) {
      if (response.data.error && response.data.error.includes('desabilitado')) {
        log(`⏸️ Agendamento desabilitado`, 'WARN');
        return {
          success: false,
          error: 'disabled',
          data: response.data
        };
      } else {
        log(`⏰ Fora do horário permitido: ${response.data.currentTime}`, 'WARN');
        log(`📅 Horário permitido: ${response.data.allowedTime}`, 'WARN');
        return {
          success: false,
          error: 'outside_schedule',
          data: response.data
        };
      }
      
    } else {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }
    
  } catch (error) {
    log(`❌ Erro na execução: ${error.message}`, 'ERROR');
    
    if (retryCount < config.maxRetries) {
      log(`🔄 Tentando novamente em ${config.retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      return executeScheduledPosts(retryCount + 1);
    } else {
      log(`💥 Máximo de tentativas atingido. Falha na execução.`, 'ERROR');
      return {
        success: false,
        error: 'max_retries_exceeded',
        message: error.message
      };
    }
  }
}

async function checkApiStatus() {
  try {
    log(`🔍 Verificando status da API...`);
    
    const response = await makeRequest(config.apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'ScheduledPosts/1.0'
      }
    });
    
    if (response.status === 200) {
      log(`✅ API está funcionando`);
      log(`⏰ Horário atual: ${response.data.currentTime}`);
      log(`📅 Dentro do horário permitido: ${response.data.isWithinAllowedTime ? 'Sim' : 'Não'}`);
      return true;
    } else {
      log(`❌ API retornou status ${response.status}`, 'ERROR');
      return false;
    }
    
  } catch (error) {
    log(`❌ Erro ao verificar API: ${error.message}`, 'ERROR');
    return false;
  }
}

async function waitUntil(targetDate) {
  const now = new Date();
  const msToWait = targetDate - now;
  if (msToWait > 0) {
    log(`⏳ Aguardando até o horário sorteado: ${targetDate.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (${Math.round(msToWait / 1000)} segundos)`);
    await new Promise(resolve => setTimeout(resolve, msToWait));
  } else {
    log(`⚠️ Horário sorteado já passou, executando imediatamente.`);
  }
}

async function main() {
  log(`🌅 Script de Agendamento Automático iniciado (modo TESTE)`);
  log(`📅 Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);

  // SORTEIO DE HORÁRIO ENTRE 12:41 E 12:44
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minMinute = 41;
  const maxMinute = 44;
  const randomMinute = Math.floor(Math.random() * (maxMinute - minMinute + 1)) + minMinute;
  const scheduledTime = new Date(today.setHours(12, randomMinute, 0, 0));

  log(`🎲 Horário sorteado para execução: ${scheduledTime.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  await waitUntil(scheduledTime);

  // Verificar se a API está disponível
  const apiStatus = await checkApiStatus();
  if (!apiStatus) {
    log(`💥 API não está disponível. Encerrando.`, 'ERROR');
    process.exit(1);
  }

  // Executar agendamento
  const result = await executeScheduledPosts();

  if (result.success) {
    log(`🎉 Agendamento concluído com sucesso!`);
    process.exit(0);
  } else if (result.error === 'outside_schedule') {
    log(`⏰ Agendamento não executado - fora do horário permitido`);
    process.exit(0);
  } else if (result.error === 'disabled') {
    log(`⏸️ Agendamento não executado - sistema desabilitado`);
    process.exit(0);
  } else {
    log(`💥 Agendamento falhou: ${result.message || result.error}`, 'ERROR');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch((error) => {
    log(`💥 Erro fatal: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  executeScheduledPosts,
  checkApiStatus,
  config
}; 