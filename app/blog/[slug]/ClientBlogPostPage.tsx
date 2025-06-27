"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Coffee, MessageCircle, Calendar, Tag, Clock, Facebook, Twitter, Linkedin, Copy } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { BlogPost } from "@/lib/supabase"

interface ClientBlogPostPageProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function ClientBlogPostPage({ post, relatedPosts }: ClientBlogPostPageProps) {
  const [readingTime] = useState(() => {
    // Calcular tempo de leitura (aproximadamente 200 palavras por minuto)
    const wordCount = [
      post.resumo,
      post.secao_1_texto,
      post.secao_2_texto,
      post.secao_3_texto,
      post.secao_4_texto,
      post.secao_5_texto,
      post.secao_6_texto,
      post.secao_7_texto,
      post.conclusao,
    ]
      .filter(Boolean)
      .join(" ")
      .split(" ").length

    return Math.ceil(wordCount / 200)
  })

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
      >
        {titulo && (
          <h2
            id={`secao-${sectionNumber}`}
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
          <div className="my-6 lg:my-8">
            <img
              src={imagem || "/placeholder.svg"}
              alt={altImagem || titulo || `Imagem da seção ${sectionNumber}`}
              className="w-full max-h-96 lg:max-h-[500px] object-cover rounded-lg shadow-lg"
              loading="lazy"
            />
            {altImagem && <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic">{altImagem}</p>}
          </div>
        )}
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
          <Link href="/cafecanastra" className="flex items-center">
            <img src="/logo-canastra.png" alt="Café Canastra" className="h-8 mr-3" />
            <span className="text-lg font-semibold text-gray-800">Blog</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/blog">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
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
              >
                <span className="hidden sm:inline">Voltar ao site</span>
                <span className="sm:hidden">Site</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Article Content */}
          <article className="lg:col-span-3">
            {/* Hero Image */}
            {post.imagem_titulo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6 lg:mb-8"
              >
                <img
                  src={post.imagem_titulo || "/placeholder.svg"}
                  alt={post.alt_imagem_titulo || post.titulo}
                  className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-xl shadow-lg"
                />
                {post.alt_imagem_titulo && (
                  <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 italic">{post.alt_imagem_titulo}</p>
                )}
              </motion.div>
            )}

            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 lg:mb-8"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                {post.titulo}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm text-gray-500 mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Coffee className="w-4 h-4 mr-2" />
                  <span>Equipe Café Canastra</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(post.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{readingTime} min de leitura</span>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    post.modo === "automático" ? "border-blue-200 text-blue-800" : "border-green-200 text-green-800"
                  }`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {post.modo}
                </Badge>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600 mr-2">Compartilhar:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("facebook")}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("twitter")}
                  className="border-sky-200 text-sky-600 hover:bg-sky-50"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("linkedin")}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sharePost("copy")}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
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
              >
                <p className="text-base lg:text-lg font-medium text-gray-800 italic leading-relaxed">{post.resumo}</p>
              </motion.div>
            )}

            {/* Seções 1-7 */}
            {[1, 2, 3, 4, 5, 6, 7].map(renderSection)}

            {/* Seção CTA */}
            {(post.secao_cta_titulo || post.secao_cta_texto) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 lg:p-8 rounded-lg my-8 lg:my-12 text-center border border-amber-200"
              >
                {post.secao_cta_titulo && (
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">{post.secao_cta_titulo}</h3>
                )}
                {post.secao_cta_texto && (
                  <p className="text-base lg:text-lg text-gray-700 mb-6 leading-relaxed">{post.secao_cta_texto}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://loja.cafecanastra.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Coffee className="w-5 h-5 mr-2" />
                    Conheça nossos cafés especiais
                  </a>
                  <a
                    href="https://atacado.cafecanastra.com/atacado"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Conclusão</h3>
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
            >
              <h2 className="text-xl font-bold text-amber-600 mb-4">Sobre o Autor</h2>
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>Equipe Café Canastra</strong> – apaixonados por café com alma mineira. Compartilhamos
                    conhecimento, tradição e inovação no mundo do café especial brasileiro.
                  </p>
                  <a
                    href="https://www.instagram.com/cafecanastra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-600 hover:text-amber-800 font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nos siga no Instagram
                  </a>
                </div>
              </div>
            </motion.section>

            {/* Navegação entre posts */}
            <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ver todos os posts
                  </Button>
                </Link>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  ↑ Voltar ao topo
                </Button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Posts Relacionados */}
              {relatedPosts.length > 0 && (
                <Card className="shadow-sm">
                  <CardContent className="p-4 lg:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Posts Relacionados</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block group">
                          <div className="flex space-x-3">
                            <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Coffee className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-1">
                                {relatedPost.titulo}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {new Date(relatedPost.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter */}
              <Card className="shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Newsletter</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Receba novidades sobre café e nossos produtos diretamente no seu e-mail.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm">
                      Assinar Newsletter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Café */}
              <Card className="shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Experimente nossos cafés</h3>
                  <p className="text-sm text-gray-600 mb-4">Descubra sabores únicos da Serra da Canastra</p>
                  <a
                    href="https://loja.cafecanastra.com"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Ver nossa loja
                  </a>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12 mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/logo-canastra.png" alt="Café Canastra" className="h-12 mx-auto mb-4 filter brightness-0 invert" />
          <p className="text-gray-300 mb-6">O melhor café artesanal da Serra da Canastra</p>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 mb-8">
            <Link href="/cafecanastra" className="text-gray-300 hover:text-white transition-colors">
              Início
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
            <a href="https://loja.cafecanastra.com" className="text-gray-300 hover:text-white transition-colors">
              Loja
            </a>
            <a
              href="https://www.instagram.com/cafecanastra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
          <div className="pt-6 lg:pt-8 border-t border-gray-800 text-sm text-gray-400">
            <p>&copy; 2024 Café Canastra. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50">
        <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-3 lg:p-4">
          <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
        </Button>
      </div>
    </div>
  )
}
