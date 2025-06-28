"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Coffee, Calendar, Clock, Search, Filter } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getPublishedPosts, type BlogPost } from "@/lib/supabase"
import { calculateReadingTime } from "@/lib/utils"

export default function BlogListClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    filterAndSortPosts()
  }, [posts, searchTerm, sortBy])

  const loadPosts = async () => {
    try {
      console.log("=== CARREGANDO TODOS OS POSTS ===")
      const allPosts = await getPublishedPosts()
      console.log("Posts carregados:", allPosts)
      setPosts(allPosts)
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortPosts = () => {
    let filtered = posts

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.titulo.toLowerCase().includes(term) ||
          (post.resumo && post.resumo.toLowerCase().includes(term)) ||
          (post.secao_1_texto && post.secao_1_texto.toLowerCase().includes(term)) ||
          (post.secao_2_texto && post.secao_2_texto.toLowerCase().includes(term)) ||
          (post.secao_3_texto && post.secao_3_texto.toLowerCase().includes(term)) ||
          (post.secao_4_texto && post.secao_4_texto.toLowerCase().includes(term)) ||
          (post.secao_5_texto && post.secao_5_texto.toLowerCase().includes(term)) ||
          (post.secao_6_texto && post.secao_6_texto.toLowerCase().includes(term)) ||
          (post.secao_7_texto && post.secao_7_texto.toLowerCase().includes(term)) ||
          (post.conclusao && post.conclusao.toLowerCase().includes(term))
      )
    }

    // Ordenar posts
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "title":
        filtered = filtered.sort((a, b) => a.titulo.localeCompare(b.titulo))
        break
      case "readingTime":
        filtered = filtered.sort((a, b) => calculateReadingTime(b) - calculateReadingTime(a))
        break
    }

    setFilteredPosts(filtered)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch {
      return "Data inválida"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cafecanastra" className="flex items-center" aria-label="Ir para página inicial">
            <img src="/logo-canastra.png" alt="Café Canastra" className="h-8 mr-3" />
            <span className="text-lg font-semibold text-gray-800">Blog</span>
          </Link>
          <nav className="flex items-center space-x-3" role="navigation" aria-label="Navegação principal">
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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Nosso <span className="text-amber-600">Blog</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os segredos do café especial, dicas de preparo e histórias da Serra da Canastra
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 lg:mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                  <SelectItem value="readingTime">Tempo de leitura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "Nenhum post encontrado" : "Em breve, novos posts!"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Tente ajustar os termos de busca ou filtros."
                : "Estamos preparando conteúdos incríveis sobre café especial para você."}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")} className="bg-amber-600 hover:bg-amber-700 text-white">
                Limpar busca
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
                  {/* Post Image */}
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 relative overflow-hidden">
                    {post.imagem_titulo ? (
                      <img
                        src={post.imagem_titulo}
                        alt={post.alt_imagem_titulo || post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-16 h-16 text-amber-600 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Post Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{calculateReadingTime(post)} min</span>
                      </div>
                    </div>

                    {/* Post Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                      {post.titulo}
                    </h3>

                    {/* Post Summary */}
                    {post.resumo && (
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">{post.resumo}</p>
                    )}

                    {/* Read More Button */}
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 bg-transparent"
                      >
                        Ler mais
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8 lg:mt-12"
          >
            <p className="text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post encontrado" : "posts encontrados"}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
