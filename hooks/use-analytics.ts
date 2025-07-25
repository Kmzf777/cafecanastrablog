import { useEffect, useRef, useState } from 'react'

interface AnalyticsData {
  pageUrl: string
  pageTitle: string
  postSlug?: string
  postType?: string
  visitDuration?: number
  screenResolution?: string
  language?: string
}

interface UseAnalyticsOptions {
  enabled?: boolean
  trackOnMount?: boolean
  trackOnUnmount?: boolean
}

export function useAnalytics(
  data: AnalyticsData,
  options: UseAnalyticsOptions = {}
) {
  const {
    enabled = true,
    trackOnMount = true,
    trackOnUnmount = true
  } = options

  const startTime = useRef<number>(Date.now())
  const hasTracked = useRef<boolean>(false)

  // Função para rastrear visualização
  const trackPageView = async (duration?: number) => {
    if (!enabled) {
      console.log('🚫 Analytics: Desabilitado')
      return
    }
    
    if (hasTracked.current) {
      console.log('🚫 Analytics: Já foi rastreado nesta sessão')
      return
    }

    console.log('📊 Analytics: Iniciando tracking...')

    try {
      const visitDuration = duration || Math.floor((Date.now() - startTime.current) / 1000)
      
      const analyticsData = {
        ...data,
        visitDuration,
        screenResolution: data.screenResolution || `${window.screen.width}x${window.screen.height}`,
        language: data.language || navigator.language
      }

      console.log('📊 Analytics: Dados a serem enviados:', analyticsData)

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData),
      })

      console.log('📊 Analytics: Resposta do servidor:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('📊 Analytics: Resposta completa:', result)
        
        hasTracked.current = true
        console.log('✅ Analytics: Tracking realizado com sucesso')
      } else {
        console.error('❌ Analytics: Falha no tracking - Status:', response.status)
        const errorText = await response.text()
        console.error('❌ Analytics: Erro detalhado:', errorText)
      }
    } catch (error) {
      console.error('❌ Analytics: Erro no tracking:', error)
    }
  }

  // Rastrear ao montar o componente
  useEffect(() => {
    if (trackOnMount && enabled) {
      console.log('📊 Analytics: Componente montado, aguardando para tracking...')
    }
  }, [trackOnMount, enabled])

  // Rastrear quando o usuário sai da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!hasTracked.current && enabled) {
        console.log('📊 Analytics: Usuário saindo da página, enviando dados...')
        const duration = Math.floor((Date.now() - startTime.current) / 1000)
        // Usar sendBeacon para garantir que os dados sejam enviados
        const analyticsData = {
          ...data,
          visitDuration: duration,
          screenResolution: data.screenResolution || `${window.screen.width}x${window.screen.height}`,
          language: data.language || navigator.language
        }

        if (navigator.sendBeacon) {
          const success = navigator.sendBeacon('/api/analytics/track', JSON.stringify(analyticsData))
          console.log('📊 Analytics: sendBeacon enviado:', success)
        } else {
          // Fallback para navegadores que não suportam sendBeacon
          console.log('📊 Analytics: Usando fallback para navegadores sem sendBeacon')
          trackPageView(duration)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled])

  return {
    trackPageView,
    hasTracked: hasTracked.current
  }
}

// Hook para obter dados de analytics do dashboard
export function useAnalyticsData(period: string = '7d', pageType: string = 'all') {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('📊 Dashboard: Buscando dados...')

        const response = await fetch(`/api/analytics/dashboard?period=${period}&pageType=${pageType}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }

        const result = await response.json()
        console.log('📊 Dashboard: Dados recebidos:', result)
        
        setData(result.data)
      } catch (err) {
        console.error('❌ Dashboard: Erro ao buscar dados:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [period, pageType])

  return { data, loading, error }
}

// Hook para rastrear eventos customizados
export function useAnalyticsEvent() {
  const trackEvent = async (eventName: string, eventData: any = {}) => {
    try {
      console.log('📊 Event: Rastreando evento:', eventName, eventData)

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          eventName,
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        console.log(`✅ Event: Evento ${eventName} rastreado com sucesso`)
      } else {
        console.error(`❌ Event: Falha ao rastrear evento ${eventName}`)
      }
    } catch (error) {
      console.error(`❌ Event: Erro ao rastrear evento ${eventName}:`, error)
    }
  }

  return { trackEvent }
} 