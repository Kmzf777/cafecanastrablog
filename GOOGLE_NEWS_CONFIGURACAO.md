# Configuração do Google News para Café Canastra

## 📋 Pré-requisitos

### 1. Estrutura do Site ✅
- ✅ URLs estruturadas para notícias: `/blog/noticias/[slug]`
- ✅ Schema.org NewsArticle implementado
- ✅ Sitemap específico para notícias criado
- ✅ Robots.txt configurado

### 2. Conteúdo de Notícias
- ✅ Posts com `post_type: "news"`
- ✅ Estrutura de dados otimizada
- ✅ Metadados completos

## 🚀 Passos para Configurar no Google News

### Passo 1: Google Publisher Center

1. **Acesse o Google Publisher Center**
   - Vá para: https://publishercenter.google.com/
   - Faça login com sua conta Google

2. **Adicione sua publicação**
   - Clique em "Adicionar publicação"
   - Nome: "Café Canastra"
   - Idioma: Português (Brasil)
   - País: Brasil
   - Categoria: Negócios / Agricultura

3. **Configure as informações básicas**
   ```
   Nome da publicação: Café Canastra
   URL do site: https://cafecanastra.com
   Idioma: Português (Brasil)
   País: Brasil
   Categoria: Negócios / Agricultura
   ```

### Passo 2: Configurar Sitemap de Notícias

1. **No Publisher Center, vá para "Sitemaps"**
2. **Adicione o sitemap de notícias:**
   ```
   https://cafecanastra.com/sitemap-news.xml
   ```

### Passo 3: Configurar Seções de Notícias

No Publisher Center, configure as seguintes seções:

1. **Mercado e Preços**
   - URL: `https://cafecanastra.com/blog/noticias`
   - Filtro: Posts com palavras-chave relacionadas a preços, cotação, mercado

2. **Produção e Agricultura**
   - URL: `https://cafecanastra.com/blog/noticias`
   - Filtro: Posts sobre colheita, plantio, produção, safra

3. **Eventos e Feiras**
   - URL: `https://cafecanastra.com/blog/noticias`
   - Filtro: Posts sobre eventos, feiras, exposições

4. **Qualidade e Preparo**
   - URL: `https://cafecanastra.com/blog/noticias`
   - Filtro: Posts sobre qualidade, degustação, preparo

### Passo 4: Configurar Metadados

No Publisher Center, configure:

1. **Informações da publicação:**
   ```
   Nome: Café Canastra
   Descrição: Notícias sobre café especial da Serra da Canastra
   Logo: https://cafecanastra.com/logo-canastra.png
   ```

2. **Configurações de conteúdo:**
   - Idioma: Português (Brasil)
   - País: Brasil
   - Categoria: Negócios / Agricultura
   - Frequência de publicação: Diária

### Passo 5: Verificar Implementação

1. **Teste o Schema.org**
   - Use o Google Rich Results Test: https://search.google.com/test/rich-results
   - Teste uma URL de notícia: `https://cafecanastra.com/blog/noticias/[slug]`
   - Verifique se o NewsArticle schema está sendo detectado

2. **Teste o Sitemap**
   - Acesse: `https://cafecanastra.com/sitemap-news.xml`
   - Verifique se está retornando XML válido
   - Confirme que todas as notícias estão listadas

### Passo 6: Submeter para Revisão

1. **No Publisher Center:**
   - Vá para "Revisão"
   - Clique em "Solicitar revisão"
   - Aguarde a aprovação do Google (pode levar alguns dias)

## 🔧 Configurações Técnicas Implementadas

### 1. Schema.org NewsArticle Otimizado

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Título da notícia",
  "datePublished": "2024-01-01T00:00:00Z",
  "dateModified": "2024-01-01T00:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "Café Canastra"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Café Canastra",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cafecanastra.com/logo-canastra.png"
    }
  },
  "articleSection": "Categoria da notícia",
  "inLanguage": "pt-BR"
}
```

### 2. Sitemap de Notícias Específico

- URL: `https://cafecanastra.com/sitemap-news.xml`
- Inclui namespace específico do Google News
- Atualização diária
- Prioridade alta para notícias

### 3. Metadados Otimizados

- Títulos descritivos
- Descrições completas
- Palavras-chave relevantes
- Imagens otimizadas
- Datas de publicação e modificação

## 📊 Monitoramento

### 1. Google Search Console

1. **Adicione sua propriedade:**
   - Vá para: https://search.google.com/search-console
   - Adicione: `https://cafecanastra.com`

2. **Monitore:**
   - Impressões de notícias
   - Clicks em notícias
   - Posições de ranking
   - Erros de indexação

### 2. Google Analytics

Configure eventos para monitorar:
- Visualizações de notícias
- Tempo de leitura
- Engajamento com conteúdo

## ⚠️ Requisitos Importantes

### 1. Conteúdo Original
- ✅ Todas as notícias são originais
- ✅ Não são duplicadas de outros sites
- ✅ Conteúdo de qualidade

### 2. Atualização Regular
- ✅ Publicação frequente de notícias
- ✅ Conteúdo atualizado
- ✅ Notícias relevantes para o setor

### 3. Estrutura Técnica
- ✅ URLs amigáveis
- ✅ Carregamento rápido
- ✅ Mobile-friendly
- ✅ HTTPS habilitado

## 🎯 Dicas para Sucesso

### 1. Conteúdo
- Publique notícias regularmente (pelo menos 2-3 por semana)
- Foque em notícias relevantes para o setor de café
- Use títulos descritivos e atrativos
- Inclua imagens de qualidade

### 2. SEO
- Use palavras-chave relevantes
- Otimize meta descriptions
- Mantenha URLs limpas e descritivas
- Inclua links internos relevantes

### 3. Engajamento
- Responda comentários
- Compartilhe nas redes sociais
- Mantenha conteúdo atualizado
- Monitore métricas de engajamento

## 📞 Suporte

Se precisar de ajuda:
1. Google Publisher Center Help: https://support.google.com/publishercenter
2. Google Search Console Help: https://support.google.com/webmasters
3. Documentação do Schema.org: https://schema.org/NewsArticle

## ✅ Checklist de Verificação

- [ ] Google Publisher Center configurado
- [ ] Sitemap de notícias funcionando
- [ ] Schema.org NewsArticle implementado
- [ ] Robots.txt atualizado
- [ ] Conteúdo original e de qualidade
- [ ] Publicação regular de notícias
- [ ] URLs estruturadas corretamente
- [ ] Metadados otimizados
- [ ] Imagens de qualidade
- [ ] Mobile-friendly
- [ ] HTTPS habilitado
- [ ] Google Search Console configurado
- [ ] Submetido para revisão no Google

## 🚀 Próximos Passos

1. **Implemente as configurações acima**
2. **Aguarde a aprovação do Google (2-7 dias)**
3. **Monitore o desempenho no Search Console**
4. **Continue publicando conteúdo de qualidade**
5. **Otimize baseado nos dados de performance** 