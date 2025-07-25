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
  const { trackPageView } = useAnalytics({
    pageUrl,
    pageTitle,
    postSlug,
    postType
  }, {
    enabled: true,
    trackOnMount: true,
    trackOnUnmount: true
  })

  // Rastrear visualização quando o componente montar
  useEffect(() => {
    trackPageView()
  }, [trackPageView])

  // Este componente não renderiza nada visual
  return null
} 