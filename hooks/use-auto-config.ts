import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface AutoConfig {
  isEnabled: boolean
  startHour: number
  endHour: number
  modo: "automático" | "personalizado"
  tema: string
  publico_alvo: string
}

const defaultConfig: AutoConfig = {
  isEnabled: false,
  startHour: 7,
  endHour: 10,
  modo: "automático",
  tema: "",
  publico_alvo: ""
}

export function useAutoConfig() {
  const [config, setConfig] = useState<AutoConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Carregar configuração do localStorage primeiro (para resposta rápida)
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('autoConfig')
      if (stored) {
        const parsed = JSON.parse(stored)
        setConfig(parsed)
        return parsed
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error)
    }
    return null
  }, [])

  // Carregar configuração do Supabase
  const loadFromSupabase = useCallback(async () => {
    try {
      const response = await fetch('/api/auto-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
        // Salvar no localStorage para cache
        localStorage.setItem('autoConfig', JSON.stringify(data))
        return data
      } else {
        throw new Error('Falha ao carregar configuração')
      }
    } catch (error) {
      console.error('Erro ao carregar do Supabase:', error)
      // Se falhar, usar localStorage ou padrão
      const localConfig = loadFromLocalStorage()
      if (localConfig) {
        return localConfig
      }
      return defaultConfig
    }
  }, [loadFromLocalStorage])

  // Salvar configuração
  const saveConfig = useCallback(async (newConfig: AutoConfig) => {
    setIsSaving(true)
    try {
      // Salvar no localStorage primeiro (para resposta imediata)
      localStorage.setItem('autoConfig', JSON.stringify(newConfig))
      setConfig(newConfig)

      // Salvar no Supabase
      const response = await fetch('/api/auto-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })

      if (!response.ok) {
        throw new Error('Falha ao salvar no servidor')
      }

      const savedConfig = await response.json()
      
      toast({
        title: "✅ Configuração salva",
        description: "As configurações foram salvas com sucesso.",
        duration: 3000,
      })

      return savedConfig
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
      
      toast({
        title: "⚠️ Aviso",
        description: "Configuração salva localmente, mas houve erro ao salvar no servidor.",
        variant: "destructive",
        duration: 5000,
      })
      
      return newConfig
    } finally {
      setIsSaving(false)
    }
  }, [toast])

  // Atualizar configuração
  const updateConfig = useCallback(async (updates: Partial<AutoConfig>) => {
    const newConfig = { ...config, ...updates }
    return await saveConfig(newConfig)
  }, [config, saveConfig])

  // Carregar configuração na inicialização
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true)
      
      // Primeiro carregar do localStorage para resposta rápida
      const localConfig = loadFromLocalStorage()
      
      // Depois tentar carregar do Supabase para sincronizar
      try {
        await loadFromSupabase()
      } catch (error) {
        console.error('Erro ao sincronizar com servidor:', error)
      }
      
      setIsLoading(false)
    }

    loadConfig()
  }, [loadFromLocalStorage, loadFromSupabase])

  // Sincronizar com servidor periodicamente
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        await loadFromSupabase()
      } catch (error) {
        console.error('Erro na sincronização periódica:', error)
      }
    }, 30000) // Sincronizar a cada 30 segundos

    return () => clearInterval(syncInterval)
  }, [loadFromSupabase])

  return {
    config,
    isLoading,
    isSaving,
    saveConfig,
    updateConfig,
    loadFromSupabase,
  }
} 