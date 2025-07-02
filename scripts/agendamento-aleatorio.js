#!/usr/bin/env node

/**
 * Script de Agendamento Aleatório para VPS
 * - Sorteia um horário entre 13:01 e 13:04
 * - Aguarda até o horário sorteado
 * - Dispara um POST para o endpoint do blogmanager
 */

const https = require('https');
const http = require('http');

// CONFIGURE AQUI O ENDPOINT DO BLOGMANAGER
const ENDPOINT = process.env.BLOGMANAGER_ENDPOINT || 'http://localhost:3000/api/scheduled-posts';

function log(msg) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${msg}`);
}

function waitUntil(targetDate) {
  return new Promise(resolve => {
    const now = new Date();
    const msToWait = targetDate - now;
    if (msToWait > 0) {
      log(`Aguardando até ${targetDate.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })} (${Math.round(msToWait/1000)} segundos)`);
      setTimeout(resolve, msToWait);
    } else {
      log('Horário sorteado já passou, executando imediatamente.');
      resolve();
    }
  });
}

function postToBlogManager() {
  return new Promise((resolve, reject) => {
    const url = new URL(ENDPOINT);
    const protocol = url.protocol === 'https:' ? https : http;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AgendamentoAleatorio/1.0'
      }
    };
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        log(`Resposta do blogmanager: HTTP ${res.statusCode}`);
        log(`Corpo: ${data}`);
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', (err) => {
      log(`Erro ao enviar POST: ${err.message}`);
      reject(err);
    });
    req.write(JSON.stringify({ modo: 'automático' }));
    req.end();
  });
}

async function main() {
  log('Script de agendamento aleatório iniciado.');
  // Sorteio entre 13:10 e 13:15
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minMinute = 10;
  const maxMinute = 15;
  const randomMinute = Math.floor(Math.random() * (maxMinute - minMinute + 1)) + minMinute;
  const scheduledTime = new Date(today.setHours(13, randomMinute, 0, 0));
  log(`Horário sorteado: ${scheduledTime.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  await waitUntil(scheduledTime);
  log('Disparando POST para o blogmanager...');
  await postToBlogManager();
  log('Processo concluído.');
}

main().catch(err => {
  log(`Erro fatal: ${err.message}`);
  process.exit(1);
}); 