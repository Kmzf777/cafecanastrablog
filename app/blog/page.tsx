import type { Metadata } from "next"
import { getPublishedPosts } from "@/lib/supabase"
import BlogListClient from "./BlogListClient"

export const metadata: Metadata = {
  title: "Blog | Café Canastra",
  description:
    "Descubra os segredos do café especial da Serra da Canastra. Dicas de preparo, histórias dos produtores e tudo sobre café gourmet brasileiro.",
  keywords: "blog café, café especial, serra da canastra, café brasileiro, dicas café, preparo café",
  authors: [{ name: "Equipe Café Canastra" }],
  robots: "index, follow",
  openGraph: {
    title: "Blog | Café Canastra",
    description:
      "Descubra os segredos do café especial da Serra da Canastra. Dicas de preparo, histórias dos produtores e tudo sobre café gourmet brasileiro.",
    url: "https://cafecanastra.com/blog",
    type: "website",
    siteName: "Café Canastra",
    locale: "pt_BR",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Blog+Café+Canastra",
        width: 1200,
        height: 630,
        alt: "Blog Café Canastra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cafecanastra",
    creator: "@cafecanastra",
    title: "Blog | Café Canastra",
    description:
      "Descubra os segredos do café especial da Serra da Canastra. Dicas de preparo, histórias dos produtores e tudo sobre café gourmet brasileiro.",
    images: ["/placeholder.svg?height=630&width=1200&text=Blog+Café+Canastra"],
  },
  alternates: {
    canonical: "https://cafecanastra.com/blog",
  },
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <>
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog Café Canastra",
            description: "Descubra os segredos do café especial da Serra da Canastra",
            url: "https://cafecanastra.com/blog",
            publisher: {
              "@type": "Organization",
              name: "Café Canastra",
              logo: {
                "@type": "ImageObject",
                url: "https://cafecanastra.com/logo-canastra.png",
              },
            },
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.titulo,
              description: post.resumo || "Post do blog Café Canastra",
              url: `https://cafecanastra.com/blog/${post.slug}`,
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

      <BlogListClient initialPosts={posts} />
    </>
  )
}
