# Cron Job — Publicação Automática de Posts Agendados

Este documento descreve como configurar o cron job na VPS para publicar
automaticamente os posts agendados do blog do Café Canastra.

---

## Como funciona

1. O script `publish-scheduled.js` roda a cada 5 minutos via crontab
2. Ele chama `POST /api/publish-scheduled` com um header de autorização secreto
3. O endpoint busca posts com `status = 'scheduled'` e `scheduled_at <= NOW()`
4. Esses posts são atualizados para `status = 'published'`
5. O resultado é registrado em `logs/cron.log` e no stdout

---

## Variáveis de ambiente necessárias

Configure no arquivo `.env` na raiz do projeto (`cafecanastrablog/.env`):

```env
# URL pública do site (sem barra no final)
NEXT_PUBLIC_SITE_URL=https://cafecanastra.com

# Segredo do cron — deve ser igual ao configurado na VPS
# Gere com: openssl rand -hex 32
CRON_SECRET=seu-segredo-aleatorio-aqui
```

> **Importante:** O `.env` nunca deve ser commitado. Use o `.env.example` como referência.

---

## Configuração do crontab na VPS

### 1. Abrir o editor do crontab

```bash
crontab -e
```

### 2. Adicionar a linha do cron (executa a cada 5 minutos)

```cron
*/5 * * * * node /var/www/cafecanastra/cafecanastrablog/scripts/publish-scheduled.js >> /var/log/cron-blog.log 2>&1
```

> Ajuste o caminho `/var/www/cafecanastra/cafecanastrablog` para o caminho real
> onde o projeto está instalado na VPS.

### 3. Verificar se o cron foi salvo

```bash
crontab -l
```

---

## Verificar os logs

### Logs do script (arquivo)

```bash
tail -f /var/www/cafecanastra/cafecanastrablog/logs/cron.log
```

### Logs do crontab (stdout redirecionado)

```bash
tail -f /var/log/cron-blog.log
```

### Exemplo de saída esperada

```
[2026-02-19T10:00:01.234Z] No posts to publish.
[2026-02-19T10:05:01.456Z] Published 2 post(s): cafe-gourmet-guaxupe, torra-artesanal-canastra
[2026-02-19T10:10:01.789Z] No posts to publish.
```

---

## Testar manualmente com curl

```bash
# Testar sem authorization → deve retornar 401
curl -X POST https://cafecanastra.com/api/publish-scheduled

# Testar com authorization correto (sem posts agendados)
curl -X POST https://cafecanastra.com/api/publish-scheduled \
  -H "Authorization: Bearer SEU_CRON_SECRET" \
  -H "Content-Type: application/json"
# Retorno esperado: {"published":0,"posts":[]}
```

### Inserir um post de teste para validar publicação

No Supabase SQL Editor:

```sql
INSERT INTO blog_posts (title, slug, content, status, scheduled_at)
VALUES (
  'Teste de Publicação Agendada',
  'teste-publicacao-agendada',
  'Conteúdo de teste.',
  'scheduled',
  NOW() - INTERVAL '1 minute'
);
```

Depois execute o curl acima — o post deve aparecer como `published`.

---

## Executar o script manualmente (sem crontab)

```bash
cd /var/www/cafecanastra/cafecanastrablog
node scripts/publish-scheduled.js
```

---

## Solução de problemas

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `ERROR: CRON_SECRET is not set` | Variável não configurada | Adicionar ao `.env` |
| `ERROR: Unauthorized` | CRON_SECRET incorreto | Verificar valor no `.env` e na VPS |
| `ERROR: fetch failed` | Site offline ou URL errada | Verificar `NEXT_PUBLIC_SITE_URL` |
| `ERROR: Database error` | Problema no Supabase | Verificar `SUPABASE_SERVICE_ROLE_KEY` |
