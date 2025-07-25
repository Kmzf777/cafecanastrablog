"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Coffee, MessageCircle, Calendar, Clock, Facebook, Twitter, Linkedin, Copy } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { BlogPost } from "@/lib/supabase"
import { calculateReadingTime } from "@/lib/utils"
import BlogBreadcrumb from "@/components/blog-breadcrumb"
import OptimizedImage from "@/components/optimized-image"
import TableOfContents from "@/components/table-of-contents"

interface ClientBlogPostPageProps {
  post: BlogPost
  relatedPosts?: BlogPost[]
  category?: string
}

export default function ClientBlogPostPage({ post, relatedPosts = [], category }: ClientBlogPostPageProps) {
  // DEBUG: Verificar valor da imagem de capa
  console.log('DEBUG imagem_titulo:', post.imagem_titulo)
  const readingTime = calculateReadingTime(post)

  // Gerar seções para a tabela de conteúdo
  const sections = useMemo(() => {
    const sectionsList = []
    
    // Adicionar seções que têm título
    for (let i = 1; i <= 7; i++) {
      const titulo = post[`secao_${i}_titulo` as keyof BlogPost] as string
      if (titulo) {
        sectionsList.push({
          id: `secao-${i}-titulo`,
          title: titulo,
          level: 2,
        })
      }
    }

    // Adicionar conclusão se existir
    if (post.conclusao) {
      sectionsList.push({
        id: "conclusao",
        title: "Conclusão",
        level: 2,
      })
    }

    return sectionsList
  }, [post])

  const renderSection = (sectionNumber: number) => {
    const titulo = post[`secao_${sectionNumber}_titulo` as keyof BlogPost] as string
    const texto = post[`secao_${sectionNumber}_texto` as keyof BlogPost] as string

    // Verificar se há imagem específica para esta seção
    let imagem = ""
    let altImagem = ""
    if (sectionNumber === 3) {
      imagem = post.imagem_secao_3 || ""
      altImagem = post.alt_imagem_secao_3 || ""
    } else if (sectionNumber === 6) {
      imagem = post.imagem_secao_6 || ""
      altImagem = post.alt_imagem_secao_6 || ""
    }

    if (!titulo && !texto) return null

    return (
      <motion.section
        key={sectionNumber}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 lg:mb-12"
        aria-labelledby={`secao-${sectionNumber}-titulo`}
      >
        {titulo && (
          <h2
            id={`secao-${sectionNumber}-titulo`}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-b-2 border-amber-500 pb-2"
          >
            {titulo}
          </h2>
        )}
        {texto && (
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 leading-relaxed mb-6">
            {texto.split("\n").map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ),
            )}
          </div>
        )}
        {imagem && (
          <OptimizedImage
            src={imagem}
            alt={altImagem || titulo || `Imagem da seção ${sectionNumber}`}
            caption={altImagem}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
          />
        )}
      </motion.section>
    )
  }

  // Renderizar ingredientes para receitas
  const renderIngredientes = () => {
    if (post.post_type !== "recipe" || !post.ingredientes_titulo) return null

    const ingredientes = []
    for (let i = 1; i <= 15; i++) {
      const ingrediente = post[`ingrediente_${i}` as keyof BlogPost] as string
      if (ingrediente) {
        ingredientes.push(ingrediente)
      }
    }

    if (ingredientes.length === 0) return null

    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 lg:mb-12"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-b-2 border-amber-500 pb-2">
          {post.ingredientes_titulo}
        </h2>
        <div className="bg-amber-50 p-6 rounded-lg">
          <ul className="space-y-2">
            {ingredientes.map((ingrediente, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span className="text-gray-700">{ingrediente}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>
    )
  }

  // Renderizar modo de preparo para receitas
  const renderModoPreparo = () => {
    if (post.post_type !== "recipe" || !post.modo_de_preparo_titulo) return null

    const passos = []
    for (let i = 1; i <= 15; i++) {
      const passo = post[`modo_de_preparo_${i}` as keyof BlogPost] as string
      if (passo) {
        passos.push(passo)
      }
    }

    if (passos.length === 0) return null

    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 lg:mb-12"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-b-2 border-amber-500 pb-2">
          {post.modo_de_preparo_titulo}
        </h2>
        <div className="space-y-4">
          {passos.map((passo, index) => (
            <div key={index} className="flex items-start">
              <span className="bg-amber-600 text-white rounded-full w-8 h-8 aspect-square flex items-center justify-center text-sm font-bold mr-4 mt-1">
                {index + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{passo}</p>
            </div>
          ))}
        </div>
      </motion.section>
    )
  }

  // Renderizar subtítulos e parágrafos dinâmicos
  const renderSubtitulosParagrafos = () => {
    const sections = []
    
    for (let i = 1; i <= 10; i++) {
      const subtitulo = post[`subtitulo_${i}` as keyof BlogPost] as string
      const paragrafo = post[`paragrafo_${i}` as keyof BlogPost] as string
      
      if (subtitulo || paragrafo) {
        sections.push({ subtitulo, paragrafo, index: i })
      }
    }

    if (sections.length === 0) return null

    return sections.map(({ subtitulo, paragrafo, index }) => (
      <motion.section
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 lg:mb-12"
      >
        {subtitulo && (
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6 border-b-2 border-amber-500 pb-2">
            {subtitulo}
          </h2>
        )}
        {paragrafo && (
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 leading-relaxed">
            {paragrafo.split("\n").map(
              (paragraph, pIndex) =>
                paragraph.trim() && (
                  <p key={pIndex} className="mb-4">
                    {paragraph}
                  </p>
                ),
            )}
          </div>
        )}
      </motion.section>
    ))
  }

  // Renderizar fonte para notícias
  const renderFonte = () => {
    if (post.post_type !== "news" || !post.fonte) return null

    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 lg:mb-12"
      >
        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-amber-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonte:</h3>
          <a 
            href={post.fonte} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline"
          >
            {post.fonte}
          </a>
        </div>
      </motion.section>
    )
  }

  const sharePost = (platform: string) => {
    const url = window.location.href
    const title = post.titulo

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(url)
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cafecanastra" className="flex items-center" aria-label="Ir para página inicial">
            <img src="/logo-canastra.png" alt="Café Canastra" className="h-8 mr-3" />
            <span className="text-lg font-semibold text-gray-800">Blog</span>
          </Link>
          <nav className="flex items-center space-x-3" role="navigation" aria-label="Navegação principal">
            <Link href="/blog">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
                aria-label="Ver todos os posts do blog"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Todos os posts</span>
                <span className="sm:hidden">Posts</span>
              </Button>
            </Link>
            <Link href="/cafecanastra">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                aria-label="Voltar ao site principal"
              >
                <span className="hidden sm:inline">Voltar ao site</span>
                <span className="sm:hidden">Site</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8" role="main" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Article Content */}
          <article className="lg:col-span-3 blog-content" itemScope itemType="https://schema.org/Article">
            {/* Breadcrumb */}
            <BlogBreadcrumb 
              postTitle={post.titulo} 
              postSlug={post.slug} 
              category={category}
            />

            {/* Hero Image */}
            {(post.imagem_titulo && post.imagem_titulo.trim() !== "") ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6 lg:mb-8"
              >
                <OptimizedImage
                  src={post.imagem_titulo}
                  alt={post.alt_imagem_titulo || post.titulo}
                  caption={post.alt_imagem_titulo}
                  priority={true}
                  className="w-full h-auto max-w-full rounded-xl shadow-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6 lg:mb-8"
              >
                <OptimizedImage
                  src="/placeholder.svg"
                  alt="Imagem não disponível"
                  caption="Imagem não disponível"
                  priority={true}
                  className="w-full h-auto max-w-full rounded-xl shadow-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                />
              </motion.div>
            )}

            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 lg:mb-8"
            >
              <h1 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight"
                itemProp="headline"
              >
                {post.titulo}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm text-gray-500 mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-gray-200">
                <div className="flex items-center" itemProp="author" itemScope itemType="https://schema.org/Organization">
                  <Coffee className="w-4 h-4 mr-2" />
                  <span itemProp="name">Equipe Café Canastra</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time dateTime={post.created_at} itemProp="datePublished">
                    {new Date(post.created_at).toLocaleDateString("pt-BR")}
                  </time>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{readingTime} min de leitura</span>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2 mb-6" role="group" aria-label="Compartilhar post">
                <span className="text-sm text-gray-600 mr-2">Compartilhar:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("facebook")}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  aria-label="Compartilhar no Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("twitter")}
                  className="border-sky-200 text-sky-600 hover:bg-sky-50"
                  aria-label="Compartilhar no Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("linkedin")}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  aria-label="Compartilhar no LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("copy")}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  aria-label="Copiar link do post"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </motion.header>

            {/* Resumo */}
            {post.resumo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-amber-50 border-l-4 border-amber-500 p-4 lg:p-6 mb-6 lg:mb-8 rounded-r-lg"
                itemProp="description"
              >
                <p className="text-base lg:text-lg font-medium text-gray-800 italic leading-relaxed">{post.resumo}</p>
              </motion.div>
            )}

            {/* Seções 1-7 */}
            {[1, 2, 3, 4, 5, 6, 7].map(renderSection)}

            {/* Conteúdo dinâmico baseado no post_type */}
            {renderIngredientes()}
            {renderModoPreparo()}
            {renderSubtitulosParagrafos()}
            {renderFonte()}

            {/* Seção CTA */}
            {(post.secao_cta_titulo || post.secao_cta_texto) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 lg:p-8 rounded-lg my-8 lg:my-12 text-center border border-amber-200"
                role="complementary"
                aria-labelledby="cta-titulo"
              >
                {post.secao_cta_titulo && (
                  <h3 id="cta-titulo" className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    {post.secao_cta_titulo}
                  </h3>
                )}
                {post.secao_cta_texto && (
                  <p className="text-base lg:text-lg text-gray-700 mb-6 leading-relaxed">{post.secao_cta_texto}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://loja.cafecanastra.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                    aria-label="Visitar loja do Café Canastra"
                  >
                    <Coffee className="w-5 h-5 mr-2" />
                    Conheça nossos cafés especiais
                  </a>
                  <a
                    href="https://atacado.cafecanastra.com/atacado"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    aria-label="Informações sobre revenda do Café Canastra"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Quer revender Café Canastra?
                  </a>
                </div>
              </motion.div>
            )}

            {/* Conclusão */}
            {post.conclusao && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 lg:p-6 mb-8 lg:mb-12 rounded-r-lg"
              >
                <h3 id="conclusao" className="text-lg font-semibold text-gray-900 mb-3">Conclusão</h3>
                <div className="prose prose-sm lg:prose max-w-none text-gray-700 leading-relaxed">
                  {post.conclusao.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <p key={index} className="mb-3">
                          {paragraph}
                        </p>
                      ),
                  )}
                </div>
              </motion.div>
            )}

            {/* Autor */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 lg:p-8 rounded-lg border border-gray-200 mt-8 lg:mt-12"
              itemProp="author" itemScope itemType="https://schema.org/Organization"
            >
              <h2 className="text-xl font-bold text-amber-600 mb-4">Sobre o Autor</h2>
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed mb-3" itemProp="description">
                    <strong itemProp="name">Equipe Café Canastra</strong> – apaixonados por café com alma mineira. Compartilhamos
                    conhecimento, tradição e inovação no mundo do café especial brasileiro.
                  </p>
                  <a
                    href="https://www.instagram.com/cafecanastra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-600 hover:text-amber-800 font-semibold"
                    aria-label="Seguir Café Canastra no Instagram"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nos siga no Instagram
                  </a>
                </div>
              </div>
            </motion.section>

            {/* Navegação entre posts */}
            <nav className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200" role="navigation" aria-label="Navegação do blog">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
                    aria-label="Ver todos os posts do blog"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ver todos os posts
                  </Button>
                </Link>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Voltar ao topo da página"
                >
                  ↑ Voltar ao topo
                </Button>
              </div>
            </nav>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 blog-sidebar" role="complementary" aria-label="Conteúdo relacionado">
            <div className="space-y-6">
              {/* Tabela de Conteúdo */}
              {sections.length > 0 && <TableOfContents sections={sections} />}

              {/* Posts Relacionados */}
              {relatedPosts.length > 0 && (
                <Card className="shadow-sm blog-sidebar-card">
                  <CardContent className="p-4 lg:p-6 card-content-safe">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Posts Relacionados</h3>
                    <nav className="space-y-4" role="navigation" aria-label="Posts relacionados">
                      {relatedPosts.map((relatedPost) => (
                        <Link 
                          key={relatedPost.id} 
                          href={
                            relatedPost.post_type === "recipe"
                              ? `/blog/receitas/${relatedPost.slug}`
                              : relatedPost.post_type === "news"
                              ? `/blog/noticias/${relatedPost.slug}`
                              : `/blog/${relatedPost.slug}`
                          }
                          className="block group"
                        >
                          <div className="flex space-x-3">
                            <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Coffee className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-1 break-words text-overflow-safe">
                                {relatedPost.titulo}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {new Date(relatedPost.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter */}
              <Card className="shadow-sm blog-sidebar-card">
                <CardContent className="p-4 lg:p-6 card-content-safe">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Newsletter</h3>
                  <p className="text-sm text-gray-600 mb-4 break-words text-overflow-safe">
                    Receba novidades sobre café e nossos produtos diretamente no seu e-mail.
                  </p>
                  <form className="space-y-3" role="form" aria-label="Formulário de newsletter">
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      aria-label="Endereço de e-mail"
                    />
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm" type="submit">
                      Assinar Newsletter
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* CTA Café */}
              <Card className="shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 blog-sidebar-card">
                <CardContent className="p-4 lg:p-6 text-center card-content-safe">
                  <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Experimente nossos cafés</h3>
                  <p className="text-sm text-gray-600 mb-4 break-words text-overflow-safe">Descubra sabores únicos da Serra da Canastra</p>
                  <a
                    href="https://loja.cafecanastra.com"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-sm"
                    aria-label="Visitar loja do Café Canastra"
                  >
                    Ver nossa loja
                  </a>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
