import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BlogPost } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função utilitária para calcular word count de forma consistente
export function calculateWordCount(post: BlogPost): number {
  const textParts = [
    // Campos básicos
    post.resumo,
    post.conclusao,
    
    // Seções numeradas (formato antigo)
    post.secao_1_texto,
    post.secao_2_texto,
    post.secao_3_texto,
    post.secao_4_texto,
    post.secao_5_texto,
    post.secao_6_texto,
    post.secao_7_texto,
    
    // Campos dinâmicos para receitas
    post.ingredientes_titulo,
    post.modo_de_preparo_titulo,
    
    // Ingredientes (até 15)
    ...Array.from({ length: 15 }, (_, i) => post[`ingrediente_${i + 1}` as keyof BlogPost] as string),
    
    // Modo de preparo (até 15)
    ...Array.from({ length: 15 }, (_, i) => post[`modo_de_preparo_${i + 1}` as keyof BlogPost] as string),
    
    // Subtítulos e parágrafos (até 10)
    ...Array.from({ length: 10 }, (_, i) => post[`subtitulo_${i + 1}` as keyof BlogPost] as string),
    ...Array.from({ length: 10 }, (_, i) => post[`paragrafo_${i + 1}` as keyof BlogPost] as string),
  ]
    .filter(Boolean)
    .join(" ")
    .split(" ")
    .filter(word => word.length > 0)

  return textParts.length
}

// Função utilitária para calcular tempo de leitura de forma consistente
export function calculateReadingTime(post: BlogPost): number {
  const wordCount = calculateWordCount(post)
  
  // Calcular tempo baseado em ~200 palavras por minuto
  const readingTime = Math.ceil(wordCount / 200)
  
  // Garantir mínimo de 1 minuto
  return Math.max(1, readingTime)
}

/**
 * Gera o objeto schema.org BlogPosting para posts do blog, enriquecido com todos os campos relevantes.
 * @param post O objeto do post
 * @param slug O slug do post
 * @param readingTime Tempo de leitura (opcional)
 * @param wordCount Contagem de palavras (opcional)
 * @param category Categoria do post (opcional)
 */
export function generateBlogPostSchema(post: any, slug: string, readingTime?: number, wordCount?: number, category?: string) {
  const url = post.post_type === "recipe"
    ? `https://cafecanastra.com/blog/receitas/${post.slug}`
    : post.post_type === "news"
    ? `https://cafecanastra.com/blog/noticias/${post.slug}`
    : `https://cafecanastra.com/blog/${post.slug}`

  const breadcrumbs = [
    { name: "Início", url: "https://cafecanastra.com/cafecanastra" },
    { name: "Blog", url: "https://cafecanastra.com/blog" },
    ...(category ? [{ name: category === "receitas" ? "Receitas" : "Notícias", url: `https://cafecanastra.com/blog/${category}` }] : []),
    { name: post.titulo, url },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "description": post.resumo || post.meta_description || "Descubra os segredos do café especial da Serra da Canastra.",
    "image": post.imagem_titulo ? [post.imagem_titulo] : undefined,
    "url": url,
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": {
      "@type": "Organization",
      "name": "Café Canastra",
      "url": "https://cafecanastra.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cafecanastra.com/logo-canastra.png",
      },
    },
    "publisher": {
      "@type": "Organization",
      "name": "Café Canastra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cafecanastra.com/logo-canastra.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "wordCount": wordCount,
    "timeRequired": readingTime ? `PT${readingTime}M` : undefined,
    "articleSection": category || (post.post_type === "recipe" ? "Receitas" : post.post_type === "news" ? "Notícias" : "Blog"),
    "keywords": post.meta_keywords || "café especial, serra da canastra, café brasileiro",
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    "about": [
      { "@type": "Thing", "name": "Café Especial" },
      { "@type": "Thing", "name": "Serra da Canastra" },
      { "@type": "Thing", "name": "Café Brasileiro" },
    ],
    "mentions": [
      { "@type": "Organization", "name": "Café Canastra", "url": "https://cafecanastra.com" },
    ],
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url,
      })),
    },
    ...(post.fonte ? { "sourceOrganization": post.fonte } : {}),
  }
}
