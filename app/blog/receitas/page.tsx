import type { Metadata } from "next"
import { getPublishedPosts } from "@/lib/supabase"
import BlogListClient from "../BlogListClient"

export const metadata: Metadata = {
  title: "Receitas | Blog Café Canastra",
  description:
    "Descubra receitas incríveis com café especial da Serra da Canastra. Dicas de preparo, métodos de extração e muito mais.",
  keywords: "receitas café, preparo café, métodos café, café especial, serra da canastra",
  authors: [{ name: "Equipe Café Canastra" }],
  robots: "index, follow",
  openGraph: {
    title: "Receitas | Blog Café Canastra",
    description:
      "Descubra receitas incríveis com café especial da Serra da Canastra. Dicas de preparo, métodos de extração e muito mais.",
    url: "https://cafecanastra.com/blog/receitas",
    type: "website",
    siteName: "Café Canastra",
    locale: "pt_BR",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Receitas+Café+Canastra",
        width: 1200,
        height: 630,
        alt: "Receitas Café Canastra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cafecanastra",
    creator: "@cafecanastra",
    title: "Receitas | Blog Café Canastra",
    description:
      "Descubra receitas incríveis com café especial da Serra da Canastra. Dicas de preparo, métodos de extração e muito mais.",
    images: ["/placeholder.svg?height=630&width=1200&text=Receitas+Café+Canastra"],
  },
  alternates: {
    canonical: "https://cafecanastra.com/blog/receitas",
  },
}

export default async function ReceitasPage() {
  const allPosts = await getPublishedPosts()
  const receitasPosts = allPosts.filter(post => post.post_type === "recipe")

  return (
    <>
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Receitas Café Canastra",
            description: "Descubra receitas incríveis com café especial da Serra da Canastra",
            url: "https://cafecanastra.com/blog/receitas",
            publisher: {
              "@type": "Organization",
              name: "Café Canastra",
              logo: {
                "@type": "ImageObject",
                url: "https://cafecanastra.com/logo-canastra.png",
              },
            },
            blogPost: receitasPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.titulo,
              description: post.resumo || "Receita do blog Café Canastra",
              url: `https://cafecanastra.com/blog/receitas/${post.slug}`,
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
        initialPosts={receitasPosts} 
        category="receitas"
        categoryTitle="Receitas"
        categoryDescription="Descubra receitas incríveis com café especial da Serra da Canastra"
      />
    </>
  )
} 