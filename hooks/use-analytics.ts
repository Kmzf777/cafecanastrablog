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
    if (!enabled || hasTracked.current) return

    try {
      const visitDuration = duration || Math.floor((Date.now() - startTime.current) / 1000)
      
      const analyticsData = {
        ...data,
        visitDuration,
        screenResolution: data.screenResolution || `${window.screen.width}x${window.screen.height}`,
        language: data.language || navigator.language
      }

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData),
      })

      if (response.ok) {
        hasTracked.current = true
        console.log('Analytics tracked successfully')
      } else {
        console.error('Failed to track analytics')
      }
    } catch (error) {
      console.error('Error tracking analytics:', error)
    }
  }

  // Rastrear ao montar o componente
  useEffect(() => {
    if (trackOnMount) {
      trackPageView()
    }

    // Rastrear ao desmontar o componente
    return () => {
      if (trackOnUnmount && !hasTracked.current) {
        const duration = Math.floor((Date.now() - startTime.current) / 1000)
        trackPageView(duration)
      }
    }
  }, [trackOnMount, trackOnUnmount])

  // Rastrear quando o usuário sai da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!hasTracked.current) {
        const duration = Math.floor((Date.now() - startTime.current) / 1000)
        // Usar sendBeacon para garantir que os dados sejam enviados
        const analyticsData = {
          ...data,
          visitDuration: duration,
          screenResolution: data.screenResolution || `${window.screen.width}x${window.screen.height}`,
          language: data.language || navigator.language
        }

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/track', JSON.stringify(analyticsData))
        } else {
          // Fallback para navegadores que não suportam sendBeacon
          trackPageView(duration)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

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

        const response = await fetch(`/api/analytics/dashboard?period=${period}&pageType=${pageType}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }

        const result = await response.json()
        setData(result.data)
      } catch (err) {
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
        console.log(`Event ${eventName} tracked successfully`)
      } else {
        console.error(`Failed to track event ${eventName}`)
      }
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error)
    }
  }

  return { trackEvent }
} 