"use client"

import { useEffect, useState } from "react"
import { testSupabaseConnection, debugEnvironmentVariables } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkConnection = async () => {
    setIsLoading(true)
    try {
      debugEnvironmentVariables()
      const connected = await testSupabaseConnection()
      setIsConnected(connected)
    } catch (error) {
      console.error("Erro ao testar conexão:", error)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (isConnected === null && !isLoading) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Alert className={`${isConnected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
            ) : isConnected ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className="ml-2 text-sm">
              {isLoading ? "Testando conexão..." : isConnected ? "Supabase conectado" : "Erro na conexão Supabase"}
            </AlertDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={checkConnection} disabled={isLoading}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}
