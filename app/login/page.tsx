"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Shield, Eye, EyeOff, Coffee } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  console.log("LoginPage renderizando...")
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTime, setBlockTime] = useState(0)

  const { toast } = useToast()

  // Verificar se já está logado
  useEffect(() => {
    console.log("LoginPage useEffect executando...")
    checkAuthStatus()
  }, [])

  // Verificar bloqueio por tentativas
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true)
      setBlockTime(300) // 5 minutos
      
      const timer = setInterval(() => {
        setBlockTime((prev) => {
          if (prev <= 1) {
            setIsBlocked(false)
            setLoginAttempts(0)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [loginAttempts])

  const checkAuthStatus = async () => {
    try {
      console.log("Verificando status de autenticação...")
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      })
      
      if (response.ok) {
        console.log("Usuário já autenticado, redirecionando...")
        // Já está logado, redirecionar para o blog manager
        window.location.href = '/blogmanager'
      } else {
        console.log("Usuário não autenticado")
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Tentativa de login...")

    if (isBlocked) {
      toast({
        title: "Acesso bloqueado",
        description: `Tente novamente em ${Math.floor(blockTime / 60)}:${(blockTime % 60).toString().padStart(2, '0')}`,
        variant: "destructive",
      })
      return
    }

    if (!username.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("Resposta do login:", data)

      if (data.success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o painel administrativo...",
        })
        
        // Limpar formulário
        setUsername("")
        setPassword("")
        setLoginAttempts(0)
        
        // Redirecionar após um breve delay
        setTimeout(() => {
          window.location.href = "/blogmanager"
        }, 1000)
      } else {
        setLoginAttempts(prev => prev + 1)
        toast({
          title: "Erro no login",
          description: data.error || "Credenciais inválidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro no login:", error)
      setLoginAttempts(prev => prev + 1)
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  console.log("Renderizando componente de login...")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Coffee className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </CardTitle>
            <CardDescription className="text-gray-600">
              Café Canastra - Blog Manager
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  disabled={isLoading || isBlocked}
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  autoComplete="username"
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
                    placeholder="Digite sua senha"
                    disabled={isLoading || isBlocked}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading || isBlocked}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {isBlocked && (
                <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    Acesso bloqueado por {formatTime(blockTime)}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || isBlocked}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/cafecanastra"
                className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
              >
                ← Voltar para o site
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 