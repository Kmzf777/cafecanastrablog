import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getPostBySlug, getRecentPosts } from "@/lib/supabase"
import { calculateReadingTime, calculateWordCount } from "@/lib/utils"
import ClientBlogPostPage from "./ClientBlogPostPage"
import { generateBlogPostSchema } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  console.log("=== GERANDO METADATA PARA SLUG ===", slug)
  
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post não encontrado | Blog Café Canastra",
      description: "O post que você está procurando não foi encontrado.",
      openGraph: {
        title: "Post não encontrado | Blog Café Canastra",
        description: "O post que você está procurando não foi encontrado.",
        url: `https://cafecanastra.com/blog/${slug}`,
        type: "article",
        images: [
          {
            url: "/placeholder.svg?height=630&width=1200&text=Café+Canastra",
            width: 1200,
            height: 630,
            alt: "Café Canastra",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Post não encontrado | Blog Café Canastra",
        description: "O post que você está procurando não foi encontrado.",
        images: ["/placeholder.svg?height=630&width=1200&text=Café+Canastra"],
      },
    }
  }

  // Garantir que todos os campos tenham valores padrão
  const title = post.title || post.titulo || "Blog Café Canastra"
  const description = post.meta_description || post.resumo || "Descubra os segredos do café especial da Serra da Canastra."
  const keywords = post.meta_keywords || "café especial, serra da canastra, café brasileiro"
  const ogTitle = post.og_title || post.titulo || title
  const ogDescription = post.og_description || post.resumo || description
  const ogUrl = post.og_url || `https://cafecanastra.com/blog/${slug}`
  const twitterTitle = post.twitter_title || post.titulo || title
  const twitterDescription = post.twitter_description || post.resumo || description
  const imageUrl = post.imagem_titulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog"

  const metadata: Metadata = {
    title: `${title} | Blog Café Canastra`,
    description: description,
    keywords: keywords,
    authors: [{ name: "Equipe Café Canastra" }],
    robots: "index, follow",
    metadataBase: new URL('https://cafecanastra.com'),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      type: "article",
      publishedTime: post.created_at,
      authors: ["Equipe Café Canastra"],
      siteName: "Café Canastra",
      locale: "pt_BR",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.alt_imagem_titulo || post.titulo || "Blog Café Canastra",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@cafecanastra",
      creator: "@cafecanastra",
      title: twitterTitle,
      description: twitterDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: ogUrl,
    },
    other: {
      "article:author": "Equipe Café Canastra",
      "article:published_time": post.created_at,
      "article:modified_time": post.updated_at,
      "article:section": "Blog",
      "article:tag": keywords,
    },
  }

  console.log("✅ Metadata gerada com sucesso para:", title)

  return metadata
}

export async function generateStaticParams() {
  return []
}

export const dynamicParams = true

// Forçar regeneração das páginas para garantir metatags atualizadas
export const revalidate = 0

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const [post, recentPosts] = await Promise.all([getPostBySlug(slug), getRecentPosts(5)])

  if (!post) {
    notFound()
  }

  // Redirecionar posts com categorias específicas para suas rotas corretas
  if (post.post_type === "recipe") {
    redirect(`/blog/receitas/${slug}`)
  }
  
  if (post.post_type === "news") {
    redirect(`/blog/noticias/${slug}`)
  }

  // Filtrar posts relacionados (excluindo o atual)
  const relatedPosts = recentPosts.filter((p) => p.id !== post.id).slice(0, 4)

  // Calcular tempo de leitura e word count usando as funções utilitárias
  const readingTime = calculateReadingTime(post)
  const wordCount = calculateWordCount(post)

  return (
    <>
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogPostSchema(post, slug, readingTime, wordCount)),
        }}
      />
      <ClientBlogPostPage 
        post={post} 
        relatedPosts={relatedPosts} 
        category={undefined} // Posts sem categoria específica
      />
    </>
  )
}
