const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const app = express();
const PORT = 4000;

// URL da sua API que retorna todos os posts publicados
const POSTS_API_URL = 'https://www.cafecanastra.com/api/posts-publicados';

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'\"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function generateSitemapXml() {
  console.log('Iniciando geração do sitemap...');
  let res, posts;
  try {
    res = await fetch(POSTS_API_URL);
    console.log('Resposta da API recebida');
    posts = await res.json();
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    throw err;
  }

  const baseUrl = 'https://cafecanastra.com';

  // URLs estáticas
  let urls = [
    { loc: baseUrl, priority: 1.0 },
    { loc: `${baseUrl}/blog`, priority: 0.8 },
    { loc: `${baseUrl}/blog/receitas`, priority: 0.7 },
    { loc: `${baseUrl}/blog/noticias`, priority: 0.7 }
  ];

  // URLs dinâmicas dos posts
  posts.forEach(post => {
    let loc = '';
    if (post.post_type === 'recipe') {
      loc = `${baseUrl}/blog/receitas/${post.slug}`;
    } else if (post.post_type === 'news') {
      loc = `${baseUrl}/blog/noticias/${post.slug}`;
    } else {
      loc = `${baseUrl}/blog/${post.slug}`;
    }
    urls.push({
      loc,
      lastmod: post.updated_at || post.created_at,
      priority: 0.6
    });
  });

  // Monta o XML
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(url => `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ''}
    <priority>${url.priority}</priority>
  </url>`).join('\n') +
    `\n</urlset>`;

  return xml;
}

// Endpoint para servir o sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  console.log('Requisição recebida em /sitemap.xml');
  try {
    const xml = await generateSitemapXml();
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Erro ao gerar sitemap');
  }
});

// Opcional: endpoint para forçar atualização e salvar em arquivo local
app.get('/atualizar-sitemap', async (req, res) => {
  try {
    const xml = await generateSitemapXml();
    fs.writeFileSync('./sitemap.xml', xml);
    res.send('Sitemap atualizado e salvo em sitemap.xml');
  } catch (err) {
    res.status(500).send('Erro ao atualizar sitemap');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de sitemap rodando em http://0.0.0.0:${PORT}/sitemap.xml`);
}); 