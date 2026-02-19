# Sistema de Internacionalização - Café Canastra

## Visão Geral

O sistema de internacionalização foi implementado seguindo a estrutura de pastas do Next.js App Router, permitindo que o site seja acessado em três idiomas:

- **Português (PT)**: `/cafecanastra` (padrão)
- **Inglês (EN)**: `/en/cafecanastra`
- **Espanhol (ES)**: `/es/cafecanastra`

## Estrutura de Arquivos

```
app/
├── cafecanastra/          # Página em português (padrão)
│   └── page.tsx
├── en/
│   └── cafecanastra/      # Página em inglês
│       └── page.tsx
└── es/
    └── cafecanastra/      # Página em espanhol
        └── page.tsx
```

## Componentes Traduzidos

### ProductCarousel
- `components/product-carousel.tsx` - Versão em português
- `components/product-carousel-en.tsx` - Versão em inglês
- `components/product-carousel-es.tsx` - Versão em espanhol

### LanguageSwitcher
O componente `components/LanguageSwitcher.tsx` detecta automaticamente o idioma atual pela URL e permite a navegação entre os idiomas.

## Funcionalidades Implementadas

### 1. Detecção Automática de Idioma
O LanguageSwitcher detecta o idioma atual baseado na URL:
- URLs sem prefixo: português (padrão)
- URLs com `/en/`: inglês
- URLs com `/es/`: espanhol

### 2. Navegação Entre Idiomas
O botão de troca de idioma:
- Remove o prefixo de idioma atual da URL
- Adiciona o novo prefixo de idioma
- Redireciona para a nova URL

### 3. Conteúdo Traduzido
Todas as páginas contêm:
- **Navegação**: Menu traduzido para cada idioma
- **Hero Section**: Títulos e descrições traduzidos
- **Seções de Conteúdo**: História, diferenciais, FAQ, etc.
- **Formulários**: Labels e mensagens traduzidos
- **ProductCarousel**: Produtos com descrições traduzidas

## Traduções Implementadas

### Português (Padrão)
- "O Café que Eterniza Momentos"
- "Fale Conosco"
- "Nossa História"
- "Cafés"
- "Kits"
- "Depoimentos"
- "Blog"
- "Contato"

### Inglês
- "The Coffee that Eternalizes Moments"
- "Contact Us"
- "Our Story"
- "Coffees"
- "Kits"
- "Testimonials"
- "Blog"
- "Contact"

### Espanhol
- "El Café que Eterniza Momentos"
- "Contáctanos"
- "Nuestra Historia"
- "Cafés"
- "Kits"
- "Testimonios"
- "Blog"
- "Contacto"

## Configuração do Middleware

O middleware foi atualizado para permitir acesso às rotas de idiomas:
```typescript
const PUBLIC_ROUTES = [
  '/cafecanastra',
  '/en/cafecanastra',
  '/es/cafecanastra',
  // ... outras rotas
]
```

## Como Usar

### Para Usuários
1. Acesse o site em qualquer idioma
2. Use os botões de idioma no header para trocar de idioma
3. A navegação mantém a seção atual ao trocar de idioma

### Para Desenvolvedores
1. Para adicionar novo conteúdo traduzido, edite as páginas correspondentes:
   - `app/cafecanastra/page.tsx` (português)
   - `app/en/cafecanastra/page.tsx` (inglês)
   - `app/es/cafecanastra/page.tsx` (espanhol)

2. Para adicionar novos componentes traduzidos:
   - Crie versões separadas para cada idioma
   - Importe a versão correta em cada página

## URLs de Acesso

- **Português**: `http://localhost:3000/cafecanastra`
- **Inglês**: `http://localhost:3000/en/cafecanastra`
- **Espanhol**: `http://localhost:3000/es/cafecanastra`

## Próximos Passos

1. **SEO**: Adicionar meta tags específicas para cada idioma
2. **Sitemap**: Atualizar sitemap para incluir URLs de idiomas
3. **Blog**: Implementar tradução para seção do blog
4. **Formulários**: Conectar formulários traduzidos aos webhooks corretos
5. **Testes**: Implementar testes para verificar funcionalidade de troca de idiomas

## Manutenção

- Mantenha as traduções sincronizadas entre as três versões
- Use ferramentas de tradução profissional para novos conteúdos
- Teste regularmente a funcionalidade de troca de idiomas
- Monitore métricas de uso por idioma 