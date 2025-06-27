"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Coffee, Calendar, Clock, Search, Filter, Tag } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { BlogPost } from "@/lib/supabase"

interface BlogListClientProps {
  initialPosts: BlogPost[]
}

export default function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [posts] = useState<BlogPost[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMode, setSelectedMode] = useState<"todos" | "automático" | "personalizado">("todos")

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterPosts(term, selectedMode)
  }

  const handleModeFilter = (mode: "todos" | "automático" | "personalizado") => {
    setSelectedMode(mode)
    filterPosts(searchTerm, mode)
  }

  const filterPosts = (term: string, mode: "todos" | "automático" | "personalizado") => {
    let filtered = posts

    // Filtro por busca
    if (term.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.titulo.toLowerCase().includes(term.toLowerCase()) ||
          (post.resumo && post.resumo.toLowerCase().includes(term.toLowerCase())),
      )
    }

    // Filtro por modo
    if (mode !== "todos") {
      filtered = filtered.filter((post) => post.modo === mode)
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

  const calculateReadingTime = (post: BlogPost) => {
    const content = [
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

    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / 200)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <Link href="/cafecanastra" className="flex items-center mr-6">
                <img src="/logo-canastra.png" alt="Café Canastra" className="h-8 mr-3" />
                <span className="text-lg font-semibold text-gray-800">Blog</span>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Café Canastra</h1>
                <p className="text-gray-600 mt-1">Descubra os segredos do café especial</p>
              </div>
            </div>
            <Link href="/cafecanastra">
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex gap-2">
                <Button
                  variant={selectedMode === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleModeFilter("todos")}
                  className={
                    selectedMode === "todos"
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                  }
                >
                  Todos
                </Button>
                <Button
                  variant={selectedMode === "automático" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleModeFilter("automático")}
                  className={
                    selectedMode === "automático"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                  }
                >
                  Automático
                </Button>
                <Button
                  variant={selectedMode === "personalizado" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleModeFilter("personalizado")}
                  className={
                    selectedMode === "personalizado"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  }
                >
                  Personalizado
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredPosts.length === posts.length
              ? `${posts.length} post${posts.length !== 1 ? "s" : ""} encontrado${posts.length !== 1 ? "s" : ""}`
              : `${filteredPosts.length} de ${posts.length} post${posts.length !== 1 ? "s" : ""} encontrado${
                  filteredPosts.length !== 1 ? "s" : ""
                }`}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || selectedMode !== "todos" ? "Nenhum post encontrado" : "Nenhum post publicado ainda"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedMode !== "todos"
                ? "Tente ajustar os filtros de busca."
                : "Em breve teremos conteúdos incríveis sobre café especial."}
            </p>
            {(searchTerm || selectedMode !== "todos") && (
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedMode("todos")
                  setFilteredPosts(posts)
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Limpar filtros
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
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
                  {/* Post Image */}
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 relative overflow-hidden">
                    {post.imagem_titulo ? (
                      <img
                        src={post.imagem_titulo || "/placeholder.svg"}
                        alt={post.alt_imagem_titulo || post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-16 h-16 text-amber-600 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="outline"
                        className={`${
                          post.modo === "automático"
                            ? "bg-blue-100 border-blue-200 text-blue-800"
                            : "bg-green-100 border-green-200 text-green-800"
                        }`}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {post.modo}
                      </Badge>
                    </div>
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
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                      {post.titulo}
                    </h2>

                    {/* Post Summary */}
                    {post.resumo && (
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">{post.resumo}</p>
                    )}

                    {/* Read More Button */}
                    <Link href={`/blog/${post.slug}`} className="mt-auto">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Ler post completo</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
    </div>
  )
}
