import type { Metadata } from "next"
import { getPublishedPosts } from "@/lib/supabase"
import BlogListClient from "../BlogListClient"

export const metadata: Metadata = {
  title: "Notícias | Blog Café Canastra",
  description:
    "Fique por dentro das últimas notícias sobre café especial, eventos da Serra da Canastra e novidades do mundo do café.",
  keywords: "notícias café, eventos café, serra da canastra, café especial, novidades café",
  authors: [{ name: "Equipe Café Canastra" }],
  robots: "index, follow",
  openGraph: {
    title: "Notícias | Blog Café Canastra",
    description:
      "Fique por dentro das últimas notícias sobre café especial, eventos da Serra da Canastra e novidades do mundo do café.",
    url: "https://cafecanastra.com/blog/noticias",
    type: "website",
    siteName: "Café Canastra",
    locale: "pt_BR",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Notícias+Café+Canastra",
        width: 1200,
        height: 630,
        alt: "Notícias Café Canastra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cafecanastra",
    creator: "@cafecanastra",
    title: "Notícias | Blog Café Canastra",
    description:
      "Fique por dentro das últimas notícias sobre café especial, eventos da Serra da Canastra e novidades do mundo do café.",
    images: ["/placeholder.svg?height=630&width=1200&text=Notícias+Café+Canastra"],
  },
  alternates: {
    canonical: "https://cafecanastra.com/blog/noticias",
  },
}

export default async function NoticiasPage() {
  const allPosts = await getPublishedPosts()
  const noticiasPosts = allPosts.filter(post => post.post_type === "news")

  return (
    <>
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Notícias Café Canastra",
            description: "Fique por dentro das últimas notícias sobre café especial",
            url: "https://cafecanastra.com/blog/noticias",
            publisher: {
              "@type": "Organization",
              name: "Café Canastra",
              logo: {
                "@type": "ImageObject",
                url: "https://cafecanastra.com/logo-canastra.png",
              },
            },
            blogPost: noticiasPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.titulo,
              description: post.resumo || "Notícia do blog Café Canastra",
              url: `https://cafecanastra.com/blog/noticias/${post.slug}`,
              datePublished: post.created_at,
              dateModified: post.updated_at,
              author: {
                "@type": "Organization",
                name: "Café Canastra",
              },
            })),
          }),
        }}
      />

      <BlogListClient 
        initialPosts={noticiasPosts} 
        category="noticias"
        categoryTitle="Notícias"
        categoryDescription="Fique por dentro das últimas notícias sobre café especial, eventos da Serra da Canastra e novidades do mundo do café"
      />
    </>
  )
} 