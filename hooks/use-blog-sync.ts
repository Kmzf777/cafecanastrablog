"use client"

import { useState, useEffect } from "react"

interface BlogPost {
  id: string
  meta_seo_1: string
  meta_seo_2: string
  meta_seo_3: string
  meta_seo_4: string
  meta_seo_5: string
  meta_seo_6: string
  titulo: string
  resumo: string
  secao_1_titulo: string
  secao_1_texto: string
  secao_2_titulo: string
  secao_2_texto: string
  secao_3_titulo: string
  secao_3_texto: string
  conclusao: string
  slug: string
  data_criacao: string
  modo: "automático" | "personalizado"
  status: "publicado" | "rascunho"
}

export function useBlogSync() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  // Função para carregar posts do localStorage
  const loadPosts = () => {
    try {
      const storedPosts = localStorage.getItem("blog_posts")
      if (storedPosts) {
        const parsedPosts: BlogPost[] = JSON.parse(storedPosts)
        const publishedPosts = parsedPosts
          .filter((post) => post.status === "publicado")
          .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
        setPosts(publishedPosts)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar posts na inicialização
  useEffect(() => {
    loadPosts()
  }, [])

  // Escutar por atualizações
  useEffect(() => {
    const handleNewPost = (event: CustomEvent) => {
      console.log("Novo post detectado:", event.detail)
      loadPosts()
      setLastUpdate(new Date().toISOString())
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "blog_posts") {
        console.log("Posts atualizados via localStorage")
        loadPosts()
        setLastUpdate(new Date().toISOString())
      }
    }

    // Escutar eventos
    window.addEventListener("newBlogPost", handleNewPost as EventListener)
    window.addEventListener("storage", handleStorageChange)

    // Verificar mudanças periodicamente
    const checkForUpdates = () => {
      const blogLastUpdate = localStorage.getItem("blog_last_update")
      if (blogLastUpdate && blogLastUpdate !== lastUpdate) {
        loadPosts()
        setLastUpdate(blogLastUpdate)
      }
    }

    const interval = setInterval(checkForUpdates, 2000) // Verificar a cada 2 segundos

    return () => {
      window.removeEventListener("newBlogPost", handleNewPost as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [lastUpdate])

  return {
    posts,
    isLoading,
    loadPosts,
    lastUpdate,
  }
}
