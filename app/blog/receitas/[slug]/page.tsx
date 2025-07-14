import type { Metadata } from "next"
import { getPostBySlug, getPublishedPosts } from "@/lib/supabase"
import ClientBlogPostPage from "../../[slug]/ClientBlogPostPage"
import { notFound } from "next/navigation"
import { generateBlogPostSchema } from "@/lib/utils"
import { generateRecipeSchema } from "@/lib/utils"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.post_type !== "recipe") {
    return {
      title: "Receita não encontrada | Blog Café Canastra",
    }
  }

  return {
    title: `${post.titulo} | Receitas Café Canastra`,
    description: post.resumo || `Descubra esta receita incrível com café especial da Serra da Canastra`,
    keywords: post.meta_keywords || "receita café, preparo café, café especial, serra da canastra",
    authors: [{ name: "Equipe Café Canastra" }],
    robots: "index, follow",
    openGraph: {
      title: post.og_title || post.titulo,
      description: post.og_description || post.resumo || `Descubra esta receita incrível com café especial`,
      url: post.og_url || `https://cafecanastra.com/blog/receitas/${post.slug}`,
      type: "article",
      siteName: "Café Canastra",
      locale: "pt_BR",
      images: post.imagem_titulo ? [
        {
          url: post.imagem_titulo,
          width: 1200,
          height: 630,
          alt: post.alt_imagem_titulo || post.titulo,
        },
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@cafecanastra",
      creator: "@cafecanastra",
      title: post.twitter_title || post.titulo,
      description: post.twitter_description || post.resumo || `Descubra esta receita incrível com café especial`,
      images: post.imagem_titulo ? [post.imagem_titulo] : undefined,
    },
    alternates: {
      canonical: `https://cafecanastra.com/blog/receitas/${post.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  const receitasPosts = posts.filter(post => post.post_type === "recipe")
  
  return receitasPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function ReceitaPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.post_type !== "recipe") {
    notFound()
  }

  return (
    <>
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateRecipeSchema(post)),
        }}
      />
      <ClientBlogPostPage post={post} category="receitas" />
    </>
  )
} 