"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Coffee, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getRecentPostsClient, type BlogPost } from "@/lib/supabase"

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      console.log("=== CARREGANDO POSTS RECENTES DO SUPABASE ===")
      const recentPosts = await getRecentPostsClient(3)
      console.log("Posts carregados:", recentPosts)
      setPosts(recentPosts)
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
    } finally {
      setIsLoading(false)
    }
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
    // Estimar tempo de leitura baseado no conteúdo
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
    return Math.ceil(wordCount / 200) // ~200 palavras por minuto
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Nosso <span className="text-amber-600">Blog</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os segredos do café especial, dicas de preparo e histórias da Serra da Canastra
          </p>
        </motion.div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
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
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Em breve, novos posts!</h3>
            <p className="text-gray-600 mb-6">Estamos preparando conteúdos incríveis sobre café especial para você.</p>
            <Link href="/blogmanager">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">Acessar Painel do Blog</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
                  {/* Post Image */}
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee className="w-16 h-16 text-amber-600 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                    </div>
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
                    <Link href={`/blog/${post.slug}`} className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 bg-transparent"
                      >
                        Ler mais
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Posts Button */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12 lg:mt-16"
          >
            <Link href="/blog">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                Ver todos os posts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
