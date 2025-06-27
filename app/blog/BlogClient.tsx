"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coffee, Search, Calendar, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { getPublishedPosts, type BlogPost } from "@/lib/supabase"

async function BlogContent() {
  const posts = await getPublishedPosts()

  return <BlogListClient initialPosts={posts} />
}

function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = async () => {
    console.log("=== CARREGANDO POSTS DO SUPABASE NA PÁGINA DO BLOG ===")
    setIsLoading(true)

    try {
      const allPosts = await getPublishedPosts()
      console.log("Posts carregados:", allPosts)

      setPosts(allPosts)
      setFilteredPosts(allPosts)
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
      setPosts([])
      setFilteredPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Filtrar posts baseado no termo de busca
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts)
    } else {
      const filtered = posts.filter(
        (post) =>
          post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.resumo && post.resumo.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (post.meta_keywords && post.meta_keywords.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredPosts(filtered)
    }
  }, [searchTerm, posts])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    } catch {
      return "Data inválida"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/cafecanastra" className="flex items-center">
              <img src="/logo-canastra.png" alt="Café Canastra" className="h-10 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Café Canastra</h1>
                <p className="text-gray-600">Histórias, dicas e cultura do café especial</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={loadPosts} className="text-amber-600 hover:bg-amber-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Link href="/cafecanastra">
                <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore nossos artigos</h2>
            <p className="text-lg text-gray-600">
              Descubra o mundo do café através dos nossos conteúdos especializados
            </p>
          </div>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "Nenhum artigo encontrado" : "Nenhum post publicado ainda"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Tente buscar por outros termos ou explore todos os artigos."
                  : "Em breve teremos conteúdos incríveis sobre café para você!"}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="border-amber-500 text-amber-600 hover:bg-amber-50"
                >
                  Ver todos os artigos
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 relative overflow-hidden">
                      {post.imagem_titulo ? (
                        <img
                          src={post.imagem_titulo || "/placeholder.svg"}
                          alt={post.alt_imagem_titulo || post.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Coffee className="w-16 h-16 text-amber-600 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            post.modo === "automático" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {post.modo}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {post.titulo}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.resumo}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          {post.meta_keywords
                            ?.split(",")
                            .slice(0, 2)
                            .map((tag, i) => (
                              <span key={i} className="inline-block bg-gray-100 px-2 py-1 rounded mr-1">
                                {tag.trim()}
                              </span>
                            ))}
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 group-hover:translate-x-1 transition-transform"
                          >
                            Ler mais
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Experimente nossos cafés especiais</h2>
          <p className="text-lg text-gray-600 mb-8">Descubra sabores únicos da Serra da Canastra em cada xícara</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://loja.cafecanastra.com"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Coffee className="w-5 h-5 mr-2" />
              Ver nossa loja
            </a>
            <Link href="/cafecanastra">
              <Button
                variant="outline"
                size="lg"
                className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
              >
                Conhecer a marca
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/logo-canastra.png" alt="Café Canastra" className="h-12 mx-auto mb-4 filter brightness-0 invert" />
          <p className="text-gray-300 mb-6">O melhor café artesanal da Serra da Canastra</p>
          <div className="flex justify-center space-x-8 mb-8">
            <Link href="/cafecanastra" className="text-gray-300 hover:text-white transition-colors">
              Início
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
          <div className="pt-8 border-t border-gray-800 text-sm text-gray-400">
            <p>&copy; 2024 Café Canastra. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BlogListClient
