"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, X, ExternalLink } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  titulo: string
  resumo: string
  slug: string
  data_criacao: string
}

export default function BlogNotification() {
  const [newPost, setNewPost] = useState<BlogPost | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleNewPost = (event: CustomEvent) => {
      const post = event.detail as BlogPost
      setNewPost(post)
      setIsVisible(true)

      // Auto-hide após 10 segundos
      setTimeout(() => {
        setIsVisible(false)
      }, 10000)
    }

    window.addEventListener("newBlogPost", handleNewPost as EventListener)

    return () => {
      window.removeEventListener("newBlogPost", handleNewPost as EventListener)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && newPost && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <Card className="shadow-lg border-amber-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <Coffee className="w-5 h-5 text-amber-600 mr-2" />
                  <span className="text-sm font-semibold text-amber-600">Novo Post!</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0 hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{newPost.titulo}</h4>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{newPost.resumo}</p>

              <div className="flex space-x-2">
                <Link href={`/blog/${newPost.slug}`} className="flex-1">
                  <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ler agora
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleClose} className="border-gray-300">
                  Depois
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
