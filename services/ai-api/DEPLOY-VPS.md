# Deploy do AI API Backend na VPS

## Prompt para o Claude na VPS

Cole o seguinte prompt no Claude Code quando estiver conectado na VPS:

---

```
Preciso que voce deixe online o backend de IA do projeto Cafe Canastra Blog.

## O que fazer

1. Antes de tudo, analise os servicos ja rodando nesta VPS:
   - Liste os containers Docker ativos: `docker ps`
   - Verifique a rede do Traefik: `docker network ls` e identifique qual rede o Traefik usa
   - Verifique como os outros servicos (n8n, Evolution API, OrionDesign) estao configurados no Traefik (labels, rede, certresolver)
   - Adapte o docker-compose.yml do ai-api para usar a MESMA rede e MESMO padrao de labels dos servicos existentes

2. Clone o repositorio e configure o servico:
   ```bash
   cd /opt
   git clone https://github.com/Kmzf777/cafecanastrablog.git canastrablog
   cd /opt/canastrablog/services/ai-api
   ```

3. Instale dependencias e compile o TypeScript:
   ```bash
   npm install
   npm run build
   ```

4. Configure as variaveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com os valores reais:
   - `GEMINI_API_KEY` — chave da API do Google Gemini
   - `SUPABASE_URL` — URL do projeto Supabase (ex: https://xxx.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key do Supabase
   - `AI_API_SECRET` — gere um secret forte (ex: `openssl rand -hex 32`)
   - `DOMAIN` — dominio base (ex: cafecanastra.com)
   - `PORT` — manter 3100

5. Adapte o `docker-compose.yml`:
   - Ajuste a rede externa para a mesma que o Traefik usa nesta VPS
   - Ajuste o certresolver para o mesmo nome usado pelos outros servicos
   - Ajuste o Host rule para o subdominio desejado (ex: `ai-api.cafecanastra.com`)
   - Se os outros servicos usam http (sem TLS), ajuste o entrypoint

6. Suba o container:
   ```bash
   docker compose up -d
   ```

7. Verifique se esta rodando:
   ```bash
   docker ps | grep cafe-canastra-ai-api
   curl http://localhost:3100/health
   ```

8. Teste o endpoint atraves do Traefik:
   ```bash
   curl https://ai-api.cafecanastra.com/health
   ```

## Estrutura do servico

O servico e um Express.js que expoe:
- `GET /health` — healthcheck (publico)
- `POST /api/generate` — gera post com IA (requer Bearer token)
- `POST /api/scrape` — scrape de URL (requer Bearer token)

Autenticacao: Header `Authorization: Bearer {AI_API_SECRET}`

## Apos o deploy

Anote o `AI_API_SECRET` gerado — ele precisa ser configurado tambem na Vercel:
- `AI_API_URL=https://ai-api.cafecanastra.com` (ou o subdominio que voce escolher)
- `AI_API_SECRET=<mesmo-secret-do-.env-da-vps>`

## Portas e rede

- O servico roda na porta 3100 internamente
- O Traefik faz o proxy reverso com TLS automatico
- Nao precisa expor a porta 3100 externamente

## Troubleshooting

- Se o container nao sobe: `docker compose logs ai-api`
- Se o Traefik nao roteia: verifique se a rede e a mesma e se os labels estao corretos
- Se o healthcheck falha: verifique se o `.env` esta preenchido corretamente
- Se o generate retorna 401: verifique se o `AI_API_SECRET` no header bate com o do `.env`
```

---

## Notas

- O frontend (Vercel) continua chamando `/api/admin/ai/generate` normalmente
- As API Routes do Next.js na Vercel agora fazem proxy para este servico
- O CRUD de posts, login, upload continuam rodando direto na Vercel
- Somente a geracao de conteudo com IA e o scraping rodam na VPS
