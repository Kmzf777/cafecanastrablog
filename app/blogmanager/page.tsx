"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Eye,
  Edit,
  Save,
  Info,
  Loader2,
  ArrowLeft,
  Coffee,
  MessageCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  AlertTriangle,
  LogOut,
  User,
  EyeOff,
  Shield
} from "lucide-react"
import Link from "next/link"
import {
  getAllPosts,
  updateBlogPost,
  deleteBlogPost,
  testSupabaseConnection,
  type BlogPost,
  debugEnvironmentVariables,
  uploadImageToStorage,
} from "@/lib/supabase"
import SupabaseStatus from "@/components/supabase-status"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAutoConfig } from "@/hooks/use-auto-config"
import { supabase } from "@/lib/supabase"

export default function BlogManagerPage() {
  console.log("[DEBUG] BlogManagerPage renderizou");
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("automatico")
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState<boolean | null>(null)

  // Estado para verificação do Supabase
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking")

  // Usar o hook de configuração automática com persistência
  const { config: autoConfig, isLoading: isConfigLoading, isSaving: isConfigSaving, updateConfig } = useAutoConfig()
  
  // Estado para a aba de Postagem Personalizada
  const [tema, setTema] = useState("")
  const [publicoAlvo, setPublicoAlvo] = useState("")

  // Estado para a aba de Gerenciamento de Posts
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedPost, setEditedPost] = useState<BlogPost | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    // Verificar autenticação via API
    // checkAuthStatus() // Removido
  }, [])

  // Checar autenticação do Supabase ao carregar o painel
  useEffect(() => {
    async function checkSupabaseAuth() {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setIsSupabaseAuthenticated(true)
      } else {
        setIsSupabaseAuthenticated(false)
      }
    }
    checkSupabaseAuth()
  }, [])

  // Verificar status do Supabase na inicialização
  useEffect(() => {
    if (isSupabaseAuthenticated === true) { // Removido isAuthorized
      checkSupabaseStatus()
    }
  }, [isSupabaseAuthenticated]) // Removido isAuthorized

  // Carregar posts do Supabase quando a aba de gerenciamento for ativada
  useEffect(() => {
    if (isSupabaseAuthenticated === true && activeTab === "gerenciamento") { // Removido isAuthorized
      loadPostsFromSupabase()
    }
  }, [isSupabaseAuthenticated, activeTab]) // Removido isAuthorized

  // Remover checkAuthStatus
  // const checkAuthStatus = async () => {
  //   try {
  //     const response = await fetch('/api/auth/verify', {
  //       method: 'GET',
  //       credentials: 'include', // Incluir cookies
  //     })
      
  //     if (response.ok) {
  //       setIsAuthorized(true)
  //     } else {
  //       setIsAuthorized(false)
  //       // Redirecionar para login se não estiver autenticado
  //       window.location.href = '/login'
  //     }
  //   } catch (error) {
  //     console.error('Erro ao verificar autenticação:', error)
  //     setIsAuthorized(false)
  //     window.location.href = '/login'
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Verificar status do Supabase na inicialização
  useEffect(() => {
    if (isSupabaseAuthenticated === true) { // Removido isAuthorized
      checkSupabaseStatus()
    }
  }, [isSupabaseAuthenticated]) // Removido isAuthorized

  const checkSupabaseStatus = async () => {
    try {
      console.log("=== VERIFICANDO STATUS DO SUPABASE ===")
      debugEnvironmentVariables()

      const isConnected = await testSupabaseConnection()
      setSupabaseStatus(isConnected ? "connected" : "error")

      if (!isConnected) {
        toast({
          title: "⚠️ Problema de Conexão",
          description: "Não foi possível conectar ao Supabase. Verifique as variáveis de ambiente.",
          variant: "destructive",
          duration: 10000,
        })
      }
    } catch (error) {
      console.error("Erro ao verificar Supabase:", error)
      setSupabaseStatus("error")
      toast({
        title: "❌ Erro de Configuração",
        description: "Variáveis de ambiente do Supabase não configuradas corretamente.",
        variant: "destructive",
        duration: 10000,
      })
    }
  }

  const loadPostsFromSupabase = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Verifique a configuração.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoadingPosts(true)
    try {
      console.log("=== CARREGANDO POSTS DO SUPABASE NO ADMIN ===")
      const allPosts = await getAllPosts()
      console.log("Posts carregados:", allPosts)
      setPosts(allPosts)
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar posts do Supabase.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleEnviarAutomatico = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Não é possível criar posts.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    if (!autoConfig.isEnabled) {
      toast({
        title: "Aviso",
        description: "O agendamento automático está desabilitado. Habilite-o primeiro.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoading(true)
    const payload = {
      modo: autoConfig.modo,
      quantidade: 1,
      atraso: 1000,
      tema: autoConfig.tema,
      publico_alvo: autoConfig.publico_alvo,
      startHour: autoConfig.startHour,
      endHour: autoConfig.endHour
    }

    console.log("=== ENVIANDO WEBHOOK AUTOMÁTICO ===")
    console.log("Payload:", payload)

    try {
      const res = await fetch("/api/blog-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const { webhookResults, createdPosts, savedPosts } = await res.json()
      console.log("Resposta do webhook:", { webhookResults, createdPosts, savedPosts })

      if (createdPosts > 0) {
        toast({
          title: "✅ Posts criados!",
          description: `${createdPosts} post(s) criado(s) e salvos no Supabase.`,
          duration: 5000,
        })
        setActiveTab("gerenciamento")
        setTimeout(() => loadPostsFromSupabase(), 500)
      } else {
        throw new Error("Nenhum post criado")
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao acionar webhooks.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnviarPersonalizado = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Não é possível criar posts.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoading(true)
    const payload = {
      modo: "personalizado",
      tema: tema,
      publico_alvo: publicoAlvo,
    }

    console.log("=== ENVIANDO WEBHOOK PERSONALIZADO ===")
    console.log("Payload:", payload)

    try {
      const res = await fetch("/api/blog-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const { webhookResults, createdPosts, savedPosts } = await res.json()
      console.log("Resposta do webhook:", { webhookResults, createdPosts, savedPosts })

      if (createdPosts > 0) {
        toast({
          title: "✅ Post personalizado criado!",
          description: `Post sobre "${tema}" criado e salvo no Supabase.`,
          duration: 5000,
        })
        setTema("")
        setPublicoAlvo("")
        setActiveTab("gerenciamento")
        setTimeout(() => loadPostsFromSupabase(), 500)
      } else {
        throw new Error("Nenhum post criado")
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao acionar webhooks.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsViewModalOpen(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditedPost({ ...post })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editedPost) return

    setIsLoading(true)
    try {
      let imageUrl = editedPost.imagem_titulo
      if (selectedImageFile) {
        imageUrl = await uploadImageToStorage(selectedImageFile, editedPost.id)
        if (imageUrl) {
          setEditedPost({ ...editedPost, imagem_titulo: imageUrl })
        }
      }
      const updatedPost = await updateBlogPost(editedPost.id, { ...editedPost, imagem_titulo: imageUrl })

      if (updatedPost) {
        const updatedPosts = posts.map((post) => {
          if (post.id === editedPost.id) {
            return updatedPost
          }
          return post
        })

        setPosts(updatedPosts)

        toast({
          title: "Sucesso!",
          description: "Post atualizado no Supabase com sucesso.",
          duration: 5000,
        })
        setIsEditModalOpen(false)
        setSelectedImageFile(null)
      } else {
        throw new Error("Falha ao atualizar post")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as alterações no Supabase.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return

    try {
      const success = await deleteBlogPost(postId)
      if (!success) throw new Error("Falha ao excluir post")

      toast({
        title: "✅ Post excluído!",
        description: "Post removido do Supabase com sucesso.",
        duration: 3000,
      })

      loadPostsFromSupabase()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao excluir post.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const viewBlogPage = (slug: string, postType?: string | null) => {
    let url = `/blog/${slug}`
    
    // Redirecionar para a rota correta baseada no post_type
    if (postType === "recipe") {
      url = `/blog/receitas/${slug}`
    } else if (postType === "news") {
      url = `/blog/noticias/${slug}`
    }
    
    window.open(url, "_blank")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Data inválida"
    }
  }

  const executeScheduledPosts = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Não é possível criar posts.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    if (!autoConfig.isEnabled) {
      toast({
        title: "Aviso",
        description: "O agendamento automático está desabilitado. Habilite-o primeiro.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoading(true)
    
    try {
      const payload = {
        modo: autoConfig.modo,
        quantidade: 1,
        atraso: 1000,
        tema: autoConfig.tema,
        publico_alvo: autoConfig.publico_alvo,
        startHour: autoConfig.startHour,
        endHour: autoConfig.endHour
      }

      const response = await fetch('/api/scheduled-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "✅ Agendamento executado!",
          description: `${data.createdPosts} post(s) criado(s) com sucesso.`,
          duration: 5000,
        })
        
        setTimeout(() => loadPostsFromSupabase(), 1000)
      } else {
        throw new Error(data.error || 'Falha na execução do agendamento')
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao executar agendamento automático.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Chamar API de logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      // Redirecionar para login
      window.location.href = '/login'
    }
  }

  function LoginForm({ onLogin }: { onLogin: () => void }) {
    console.log("[DEBUG] LoginForm renderizou");
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState("")
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setLoginError("")
      try {
        // Login Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({
          email: username, // agora username é o e-mail
          password: password
        })
        if (error) {
          setLoginError("Login no Supabase falhou: " + error.message)
          toast({
            title: "Erro no login Supabase",
            description: error.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel...",
        })
        onLogin()
      } catch (error) {
        setLoginError("Erro inesperado. Tente novamente.")
        toast({
          title: "Erro",
          description: "Erro inesperado. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4">
                <Coffee className="w-12 h-12 text-amber-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Painel Administrativo
              </CardTitle>
              <CardDescription className="text-gray-600">
                Acesse o painel de gerenciamento do blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu usuário"
                    required
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      required
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{loginError}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Acesso restrito ao painel administrativo
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Remover if (loading)
  if (isSupabaseAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (isSupabaseAuthenticated === false) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    return null
  }

  // Remover if (!isAuthorized) e LoginForm
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/logo-canastra.png" alt="Café Canastra" className="h-8" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">Gerenciamento do Blog</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Administrador</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <Link href="/cafecanastra">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex items-center">
                <img src="/logo-canastra.png" alt="Café Canastra" className="h-10 sm:h-12 mr-4" />
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Painel do Blog</h1>
                  <div className="flex items-center mt-1">
                    {supabaseStatus === "connected" && (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-700">Supabase conectado</span>
                      </>
                    )}
                    {supabaseStatus === "error" && (
                      <>
                        <AlertTriangle className="w-3 h-3 text-red-600 mr-2" />
                        <span className="text-sm text-red-700">Erro no Supabase</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="automatico" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                <TabsTrigger value="automatico" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Postagem Automática
                </TabsTrigger>
                <TabsTrigger
                  value="personalizado"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Postagem Personalizada
                </TabsTrigger>
                <TabsTrigger
                  value="gerenciamento"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Gerenciamento ({posts.length})
                </TabsTrigger>
              </TabsList>

              {/* Aba 1: Postagem Automática e Agendamento */}
              <TabsContent value="automatico">
                <div className="space-y-6">
                  {/* Configuração do Agendamento */}
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-800 flex items-center justify-between">
                        <span>Configuração do Agendamento Automático</span>
                        {(isConfigLoading || isConfigSaving) && (
                          <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Configure os parâmetros para o agendamento automático de posts
                        {isConfigSaving && (
                          <span className="text-amber-600 ml-2">Salvando...</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Botão On/Off */}
                      <div className="space-y-2">
                        <Label className="text-gray-700">Status do Agendamento</Label>
                        <div className="flex items-center space-x-4">
                          <Switch
                            checked={autoConfig.isEnabled}
                            onCheckedChange={(checked) => updateConfig({ isEnabled: checked })}
                          />
                          <span className={`text-sm font-medium ${autoConfig.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {autoConfig.isEnabled ? 'Ativado' : 'Desativado'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {autoConfig.isEnabled 
                            ? 'O agendamento automático está ativo e funcionará entre os horários configurados.'
                            : 'O agendamento automático está desativado. Ative-o para começar.'
                          }
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={executeScheduledPosts}
                        disabled={isLoading || supabaseStatus !== "connected" || !autoConfig.isEnabled}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Executando...
                          </>
                        ) : (
                          "Executar Agendamento"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              {/* Aba 2: Postagem Personalizada */}
              <TabsContent value="personalizado">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Postagem Personalizada</CardTitle>
                    <CardDescription className="text-gray-600">Crie uma postagem personalizada para o blog</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="tema" className="text-gray-700">
                        Tema
                      </Label>
                      <Input
                        id="tema"
                        placeholder="Ex: Café especial da Serra da Canastra"
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publico" className="text-gray-700">
                        Público-Alvo
                      </Label>
                      <Input
                        id="publico"
                        placeholder="Ex: Apreciadores de café gourmet"
                        value={publicoAlvo}
                        onChange={(e) => setPublicoAlvo(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleEnviarPersonalizado}
                      disabled={isLoading || !tema || !publicoAlvo || supabaseStatus !== "connected"}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                        </>
                      ) : (
                        "Enviar"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Aba 3: Gerenciamento de Posts */}
              <TabsContent value="gerenciamento">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-gray-800">
                      <span>Gerenciamento de Posts do Blog (Supabase)</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadPostsFromSupabase}
                          disabled={isLoadingPosts || supabaseStatus !== "connected"}
                          className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
                        >
                          {isLoadingPosts ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Visualize, edite e gerencie os posts salvos no Supabase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {supabaseStatus !== "connected" ? (
                      <div className="text-center py-12">
                        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Supabase não conectado</h3>
                        <p className="text-gray-600 mb-6">
                          Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
                        </p>
                        <Button onClick={checkSupabaseStatus} className="bg-amber-600 hover:bg-amber-700 text-white">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Verificar novamente
                        </Button>
                      </div>
                    ) : isLoadingPosts ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12">
                        <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum post encontrado</h3>
                        <p className="text-gray-600 mb-6">
                          Use as abas "Postagem Automática" ou "Postagem Personalizada" para criar novos posts
                        </p>
                        <div className="flex justify-center space-x-4">
                          <Button
                            onClick={() => setActiveTab("automatico")}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Criar Post Automático
                          </Button>
                          <Button
                            onClick={() => setActiveTab("personalizado")}
                            variant="outline"
                            className="border-amber-500 text-amber-600 hover:bg-amber-50"
                          >
                            Criar Post Personalizado
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                          <Card
                            key={post.id}
                            className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="aspect-video w-full bg-gradient-to-br from-amber-100 to-yellow-100 relative">
                              {post.imagem_titulo ? (
                                <img
                                  src={post.imagem_titulo || "/placeholder.svg"}
                                  alt={post.alt_imagem_titulo || post.titulo}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Coffee className="w-16 h-16 text-amber-600 opacity-50" />
                                </div>
                              )}
                              <div className="absolute top-2 left-2">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    post.status === "publicado"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {post.status}
                                </span>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800">{post.titulo}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.resumo}</p>

                              <div className="flex items-center text-xs text-gray-400 mb-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(post.created_at)}</span>
                              </div>

                              <div className="flex items-center text-xs text-gray-400 mb-4">
                                <Tag className="w-3 h-3 mr-1" />
                                <span className="truncate">/{post.slug}</span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewPost(post)}
                                  className="border-amber-500 text-amber-600 hover:bg-amber-50 flex-1"
                                >
                                  <Eye className="h-3 w-3 mr-1" /> Ver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewBlogPage(post.slug, post.post_type)}
                                  className="border-green-500 text-green-600 hover:bg-green-50 flex-1"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" /> Página
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditPost(post)}
                                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Modal de Visualização */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-800 text-xl">{selectedPost?.titulo}</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Criado em: {selectedPost ? formatDate(selectedPost.created_at) : ""} | Modo: {selectedPost?.modo} |
                    Status: {selectedPost?.status}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  {selectedPost?.imagem_titulo && (
                    <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={selectedPost.imagem_titulo || "/placeholder.svg"}
                        alt={selectedPost.alt_imagem_titulo || selectedPost.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Resumo:</h4>
                      <p className="text-gray-700">{selectedPost?.resumo}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">SEO Meta Description:</h4>
                      <p className="text-sm text-gray-600">{selectedPost?.meta_description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Keywords:</h4>
                      <p className="text-sm text-gray-600">{selectedPost?.meta_keywords}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Slug:</h4>
                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">/blog/{selectedPost?.slug}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewModalOpen(false)}
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Fechar
                  </Button>
                  {selectedPost && (
                    <Button
                      onClick={() => viewBlogPage(selectedPost.slug, selectedPost.post_type)}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Página
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Modal de Edição */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Editar Post</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-titulo" className="text-gray-700">
                        Título
                      </Label>
                      <Input
                        id="edit-titulo"
                        value={editedPost?.titulo || ""}
                        onChange={(e) => setEditedPost(editedPost ? { ...editedPost, titulo: e.target.value } : null)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-slug" className="text-gray-700">
                        Slug
                      </Label>
                      <Input
                        id="edit-slug"
                        value={editedPost?.slug || ""}
                        onChange={(e) => setEditedPost(editedPost ? { ...editedPost, slug: e.target.value } : null)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-resumo" className="text-gray-700">
                      Resumo
                    </Label>
                    <Textarea
                      id="edit-resumo"
                      rows={3}
                      value={editedPost?.resumo || ""}
                      onChange={(e) => setEditedPost(editedPost ? { ...editedPost, resumo: e.target.value } : null)}
                      className="border-gray-300 resize-none"
                    />
                  </div>

                  {/* Campo de upload de imagem */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-imagem-titulo" className="text-gray-700">
                      Imagem de Capa
                    </Label>
                    <input
                      id="edit-imagem-titulo"
                      type="file"
                      accept="image/*"
                      onChange={e => setSelectedImageFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                    {editedPost?.imagem_titulo && (
                      <img
                        src={editedPost.imagem_titulo}
                        alt="Imagem atual do post"
                        className="mt-2 max-h-40 rounded border"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-meta-desc" className="text-gray-700">
                        Meta Description
                      </Label>
                      <Textarea
                        id="edit-meta-desc"
                        rows={2}
                        value={editedPost?.meta_description || ""}
                        onChange={(e) =>
                          setEditedPost(editedPost ? { ...editedPost, meta_description: e.target.value } : null)
                        }
                        className="border-gray-300 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-meta-keywords" className="text-gray-700">
                        Meta Keywords
                      </Label>
                      <Textarea
                        id="edit-meta-keywords"
                        rows={2}
                        value={editedPost?.meta_keywords || ""}
                        onChange={(e) =>
                          setEditedPost(editedPost ? { ...editedPost, meta_keywords: e.target.value } : null)
                        }
                        className="border-gray-300 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-conclusao" className="text-gray-700">
                      Conclusão
                    </Label>
                    <Textarea
                      id="edit-conclusao"
                      rows={4}
                      value={editedPost?.conclusao || ""}
                      onChange={(e) => setEditedPost(editedPost ? { ...editedPost, conclusao: e.target.value } : null)}
                      className="border-gray-300 resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Coffee className="h-5 w-5 text-amber-600 mr-2" />
                  <p className="text-sm text-gray-600">Café Canastra - Painel Administrativo (Supabase)</p>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:bg-amber-50"
                    onClick={() => window.open("https://webhook.canastrainteligencia.com", "_blank")}
                  >
                    Webhooks
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:bg-amber-50"
                    onClick={() => window.open("https://n8n.canastrainteligencia.com", "_blank")}
                  >
                    Automações
                  </Button>
                </div>
              </div>
            </footer>
          </div>

          {/* Floating Help Button */}
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button size="icon" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md h-12 w-12">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Status do Supabase */}
          <SupabaseStatus />
        </motion.div>
      </main>
    </div>
  )
}

