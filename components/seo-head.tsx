"use client"

import { useEffect } from "react"

interface BlogPost {
  id: string
  description: string
  keywords: string
  ogUrl: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
  title: string
  titulo: string
  imagemTitulo: string
  altImagemTitulo: string
  resumo: string
  slug: string
  dataCriacao: string
}

interface SEOHeadProps {
  post?: BlogPost | null
  slug: string
}

export default function SEOHead({ post, slug }: SEOHeadProps) {
  useEffect(() => {
    if (post) {
      // Atualizar title dinamicamente
      if (post.title) {
        document.title = post.title
      }

      // Atualizar meta description
      const updateOrCreateMeta = (name: string, content: string, property?: string) => {
        const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`
        let meta = document.querySelector(selector) as HTMLMetaElement

        if (meta) {
          meta.content = content
        } else {
          meta = document.createElement("meta")
          if (property) {
            meta.setAttribute("property", property)
          } else {
            meta.setAttribute("name", name)
          }
          meta.content = content
          document.head.appendChild(meta)
        }
      }

      // Atualizar todas as meta tags
      updateOrCreateMeta("description", post.description || post.resumo)
      updateOrCreateMeta("keywords", post.keywords)
      updateOrCreateMeta("author", "Equipe Café Canastra")

      // Open Graph
      updateOrCreateMeta("", post.ogTitle || post.titulo, "og:title")
      updateOrCreateMeta("", post.ogDescription || post.resumo, "og:description")
      updateOrCreateMeta("", post.ogUrl || `https://cafecanastra.com/blog/${slug}`, "og:url")
      updateOrCreateMeta("", "article", "og:type")
      updateOrCreateMeta(
        "",
        post.imagemTitulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog",
        "og:image",
      )
      updateOrCreateMeta("", post.altImagemTitulo || post.titulo, "og:image:alt")
      updateOrCreateMeta("", "Café Canastra", "og:site_name")
      updateOrCreateMeta("", "pt_BR", "og:locale")

      // Twitter Card
      updateOrCreateMeta("twitter:card", "summary_large_image")
      updateOrCreateMeta("twitter:site", "@cafecanastra")
      updateOrCreateMeta("twitter:creator", "@cafecanastra")
      updateOrCreateMeta("twitter:title", post.twitterTitle || post.titulo)
      updateOrCreateMeta("twitter:description", post.twitterDescription || post.resumo)
      updateOrCreateMeta(
        "twitter:image",
        post.imagemTitulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog",
      )

      // Article meta
      updateOrCreateMeta("article:author", "Equipe Café Canastra")
      updateOrCreateMeta("article:published_time", post.dataCriacao)
      updateOrCreateMeta("article:modified_time", post.dataCriacao)
      updateOrCreateMeta("article:section", "Blog")
      updateOrCreateMeta("article:tag", post.keywords)

      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (canonical) {
        canonical.href = post.ogUrl || `https://cafecanastra.com/blog/${slug}`
      } else {
        canonical = document.createElement("link")
        canonical.rel = "canonical"
        canonical.href = post.ogUrl || `https://cafecanastra.com/blog/${slug}`
        document.head.appendChild(canonical)
      }

      // Atualizar structured data
      const structuredDataScript = document.querySelector('script[type="application/ld+json"]')
      if (structuredDataScript) {
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.titulo,
          description: post.resumo,
          image: post.imagemTitulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog",
          author: {
            "@type": "Organization",
            name: "Café Canastra",
            url: "https://cafecanastra.com",
          },
          publisher: {
            "@type": "Organization",
            name: "Café Canastra",
            logo: {
              "@type": "ImageObject",
              url: "https://cafecanastra.com/logo-canastra.png",
            },
          },
          datePublished: post.dataCriacao,
          dateModified: post.dataCriacao,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": post.ogUrl || `https://cafecanastra.com/blog/${slug}`,
          },
        }
        structuredDataScript.textContent = JSON.stringify(structuredData)
      }
    }
  }, [post, slug])

  return null
}
