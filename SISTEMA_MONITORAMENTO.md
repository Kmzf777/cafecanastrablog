# Sistema de Monitoramento - Analytics Dashboard

## Visão Geral

O sistema de monitoramento implementa um dashboard completo de analytics capaz de rastrear visualizações da home page, posts do blog e gerar métricas profissionais em tempo real.

## 🚀 Funcionalidades Implementadas

### 📊 Dashboard Completo
- **Métricas Principais**: Total de visualizações, visitas únicas, home page, blog
- **Gráficos Interativos**: Visualizações diárias com gráficos de barras
- **Filtros Dinâmicos**: Por período (1d, 7d, 30d, 90d, 1y) e tipo de página
- **Posts Mais Visualizados**: Ranking dos conteúdos mais populares
- **Estatísticas de Dispositivos**: Desktop, mobile, tablet, bots
- **Análise de Browsers**: Chrome, Firefox, Safari, Edge, etc.
- **Taxa de Bounce**: Usuários que saem sem navegar
- **Tempo Médio de Sessão**: Duração das visitas
- **Crescimento**: Comparativo de períodos

### 🔍 Rastreamento Automático
- **Home Page**: `/cafecanastra` e `/`
- **Blog**: `/blog` (lista de posts)
- **Posts Individuais**: `/blog/[slug]`, `/blog/receitas/[slug]`, `/blog/noticias/[slug]`
- **Detecção de Dispositivos**: Desktop, mobile, tablet, bots
- **Informações do Browser**: Chrome, Firefox, Safari, etc.
- **Sistema Operacional**: Windows, macOS, Linux, Android, iOS
- **Resolução de Tela**: Dados de display
- **Idioma**: Preferência do usuário
- **Sessões Únicas**: Rastreamento de visitantes únicos
- **Duração de Visita**: Tempo gasto em cada página

### 📈 Métricas Avançadas
- **Visualizações por Tipo**: Home, blog, receitas, notícias
- **Posts Mais Populares**: Ranking por visualizações
- **Dispositivos Mais Usados**: Distribuição por tipo
- **Browsers Preferidos**: Análise de navegadores
- **Taxa de Bounce**: Indicador de engajamento
- **Tempo de Sessão**: Duração média das visitas
- **Crescimento**: Comparativo entre períodos

## 🏗️ Arquitetura do Sistema

### Banco de Dados (Supabase)

#### Tabela `analytics`
```sql
- id: SERIAL PRIMARY KEY
- page_url: TEXT (URL da página)
- page_title: TEXT (Título da página)
- page_type: TEXT (home, blog, blog_post, recipe, news, other)
- post_slug: TEXT (Slug do post, se aplicável)
- post_type: TEXT (recipe, news, null)
- user_agent: TEXT (User agent do navegador)
- ip_address: INET (Endereço IP)
- referrer: TEXT (Página de origem)
- device_type: TEXT (desktop, mobile, tablet, bot, other)
- browser: TEXT (Chrome, Firefox, Safari, etc.)
- os: TEXT (Windows, macOS, Linux, etc.)
- screen_resolution: TEXT (Resolução da tela)
- language: TEXT (Idioma do usuário)
- session_id: TEXT (ID da sessão)
- visit_duration: INTEGER (Duração em segundos)
- bounce: BOOLEAN (Se saiu sem navegar)
- is_unique_visit: BOOLEAN (Primeira visita da sessão)
- created_at: TIMESTAMP
```

#### Tabela `sessions`
```sql
- id: TEXT PRIMARY KEY (ID da sessão)
- ip_address: INET (Endereço IP)
- user_agent: TEXT (User agent)
- first_visit_at: TIMESTAMP (Primeira visita)
- last_visit_at: TIMESTAMP (Última visita)
- visit_count: INTEGER (Número de visitas)
- total_duration: INTEGER (Duração total em segundos)
- pages_visited: TEXT[] (Array de páginas visitadas)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### APIs Implementadas

#### `/api/analytics/track` (POST)
**Função**: Rastrear visualizações de páginas
**Parâmetros**:
```json
{
  "pageUrl": "/cafecanastra",
  "pageTitle": "Café Canastra - Café Especial",
  "postSlug": "cafe-especial-canastra",
  "postType": "recipe",
  "visitDuration": 45,
  "screenResolution": "1920x1080",
  "language": "pt-BR"
}
```

**Resposta**:
```json
{
  "success": true,
  "sessionId": "abc123def456",
  "analyticsId": 123
}
```

#### `/api/analytics/dashboard` (GET)
**Função**: Obter dados para o dashboard
**Parâmetros**:
- `period`: 1d, 7d, 30d, 90d, 1y
- `pageType`: all, home, blog, recipe, news

**Resposta**:
```json
{
  "success": true,
  "period": "7d",
  "data": {
    "totalViews": 1250,
    "uniqueViews": 890,
    "homeViews": 450,
    "blogViews": 800,
    "viewsByPageType": [...],
    "topPosts": [...],
    "deviceStats": [...],
    "browserStats": [...],
    "dailyViews": [...],
    "bounceRate": 35,
    "avgSessionDuration": 180,
    "period": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-07T23:59:59Z"
    }
  }
}
```

### Componentes Frontend

#### `AnalyticsDashboard`
Dashboard completo com todas as métricas e gráficos

#### `AnalyticsTracker`
Componente invisível para rastrear visualizações automaticamente

#### `useAnalytics` (Hook)
Hook personalizado para rastrear analytics no frontend

## 📁 Estrutura de Arquivos

```
├── database/
│   └── analytics_table.sql          # Script SQL para criar tabelas
├── app/api/analytics/
│   ├── track/route.ts               # API de rastreamento
│   └── dashboard/route.ts           # API do dashboard
├── components/
│   ├── analytics-dashboard.tsx      # Dashboard principal
│   └── analytics-tracker.tsx        # Componente de tracking
├── hooks/
│   └── use-analytics.ts             # Hook personalizado
├── app/blogmanager/page.tsx         # Integração no painel admin
├── app/page.tsx                     # Tracking na home page
├── app/blog/page.tsx                # Tracking no blog
├── app/blog/[slug]/page.tsx         # Tracking em posts individuais
├── test-analytics.js                # Script de teste
└── SISTEMA_MONITORAMENTO.md         # Esta documentação
```

## 🚀 Como Usar

### 1. Configurar Banco de Dados
Execute o script SQL no Supabase:
```sql
-- Execute o conteúdo de database/analytics_table.sql
-- no SQL Editor do Supabase
```

### 2. Verificar Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Acessar o Dashboard
1. Acesse `/blogmanager`
2. Clique na aba "Monitoramento"
3. Visualize todas as métricas em tempo real

### 4. Testar o Sistema
```bash
node test-analytics.js
```

## 📊 Métricas Disponíveis

### Métricas Principais
- **Total de Visualizações**: Todas as visualizações no período
- **Visitas Únicas**: Sessões únicas (visitantes únicos)
- **Home Page**: Visualizações da página principal
- **Blog**: Visualizações de todas as páginas do blog

### Métricas Secundárias
- **Taxa de Bounce**: % de usuários que saem sem navegar
- **Tempo Médio**: Duração média das sessões
- **Crescimento**: Comparativo com período anterior

### Análises Detalhadas
- **Posts Mais Visualizados**: Ranking dos conteúdos
- **Dispositivos**: Desktop, mobile, tablet, bots
- **Browsers**: Chrome, Firefox, Safari, Edge, etc.
- **Visualizações Diárias**: Gráfico de evolução
- **Por Tipo de Página**: Home, blog, receitas, notícias

## 🔧 Funcionalidades Técnicas

### Detecção Automática
- **Dispositivos**: Baseado no User Agent
- **Browsers**: Identificação automática
- **Sistema Operacional**: Detecção do OS
- **Bots**: Filtragem de crawlers

### Sessões Inteligentes
- **Cookies**: Rastreamento de sessões (30 dias)
- **IP + User Agent**: Identificação de visitantes
- **Páginas Visitadas**: Array de URLs na sessão
- **Duração Total**: Soma do tempo gasto

### Performance
- **Índices Otimizados**: Consultas rápidas
- **Agregações**: Dados pré-calculados
- **Cache**: Dados em memória quando possível
- **Rate Limiting**: Proteção contra spam

## 🎯 Benefícios

### Para o Negócio
- **Insights de Comportamento**: Como os usuários navegam
- **Conteúdo Popular**: Posts que mais engajam
- **Performance**: Métricas de tempo de sessão
- **Crescimento**: Acompanhamento de evolução

### Para o Desenvolvimento
- **Debugging**: Identificação de problemas
- **Otimização**: Foco em melhorias baseadas em dados
- **SEO**: Análise de páginas mais acessadas
- **UX**: Comportamento dos usuários

## 🔮 Próximas Melhorias

### Funcionalidades Futuras
- [ ] **Heatmaps**: Visualização de cliques
- [ ] **Funnels**: Análise de conversão
- [ ] **A/B Testing**: Testes de variantes
- [ ] **Notificações**: Alertas de métricas
- [ ] **Exportação**: Relatórios em PDF/Excel
- [ ] **Integração**: Google Analytics, Facebook Pixel
- [ ] **Geolocalização**: Dados de localização
- [ ] **Eventos Customizados**: Cliques, formulários, etc.

### Melhorias Técnicas
- [ ] **Cache Redis**: Performance melhorada
- [ ] **WebSockets**: Dados em tempo real
- [ ] **Machine Learning**: Previsões de tráfego
- [ ] **API Rate Limiting**: Proteção avançada
- [ ] **Backup Automático**: Dados seguros

## 🛠️ Troubleshooting

### Problemas Comuns

#### Dados não aparecem
1. Verificar se as tabelas foram criadas no Supabase
2. Confirmar variáveis de ambiente
3. Testar API de tracking manualmente
4. Verificar logs do console

#### Dashboard não carrega
1. Verificar conexão com Supabase
2. Confirmar permissões das tabelas
3. Testar API do dashboard
4. Verificar autenticação

#### Tracking não funciona
1. Verificar se o componente está incluído
2. Confirmar se a API está acessível
3. Testar com script de teste
4. Verificar CORS e headers

### Logs de Debug
```javascript
// Verificar tracking no console
console.log('Analytics tracked successfully')

// Verificar dados no dashboard
console.log('Dashboard data loaded:', data)
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console
2. Testar com script de teste
3. Confirmar configuração do banco
4. Verificar variáveis de ambiente

---

**Status**: ✅ Implementado e Funcionando  
**Versão**: 1.0.0  
**Data**: Dezembro 2024  
**Desenvolvido para**: Café Canastra - Sistema de Monitoramento Completo 