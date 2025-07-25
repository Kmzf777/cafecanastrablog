"use client"

import { useEffect } from 'react'
import { useAnalytics } from '@/hooks/use-analytics'

interface AnalyticsTrackerProps {
  pageUrl: string
  pageTitle: string
  postSlug?: string
  postType?: string
}

export default function AnalyticsTracker({ 
  pageUrl, 
  pageTitle, 
  postSlug, 
  postType 
}: AnalyticsTrackerProps) {
  
  // Verificar se estamos no cliente
  const isClient = typeof window !== 'undefined'
  
  const { trackPageView } = useAnalytics({
    pageUrl,
    pageTitle,
    postSlug,
    postType
  }, {
    enabled: isClient, // Só habilitar no cliente
    trackOnMount: true,
    trackOnUnmount: true
  })

  // Rastrear visualização quando o componente montar
  useEffect(() => {
    if (!isClient) {
      console.log('🚫 AnalyticsTracker: Executando no servidor, pulando tracking')
      return
    }

    console.log('📊 AnalyticsTracker: Iniciando tracking para:', {
      pageUrl,
      pageTitle,
      postSlug,
      postType
    })

    // Aguardar um pouco para garantir que a página carregou completamente
    const timer = setTimeout(() => {
      trackPageView()
    }, 1000)

    return () => clearTimeout(timer)
  }, [trackPageView, isClient, pageUrl, pageTitle, postSlug, postType])

  // Log de debug para verificar se o componente está sendo renderizado
  useEffect(() => {
    if (isClient) {
      console.log('✅ AnalyticsTracker: Componente montado em:', pageUrl)
    }
  }, [isClient, pageUrl])

  // Este componente não renderiza nada visual
  return null
} 