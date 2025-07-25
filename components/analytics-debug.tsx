"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AnalyticsDebugProps {
  pageUrl: string
  pageTitle: string
  postSlug?: string
  postType?: string
}

export default function AnalyticsDebug({ 
  pageUrl, 
  pageTitle, 
  postSlug, 
  postType 
}: AnalyticsDebugProps) {
  const [isClient, setIsClient] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'tracking' | 'success' | 'error'>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Interceptar logs do console
    const originalLog = console.log
    const originalError = console.error
    
    console.log = (...args) => {
      originalLog(...args)
      if (args[0]?.includes?.('Analytics') || args[0]?.includes?.('📊')) {
        setLogs(prev => [...prev, `LOG: ${args.join(' ')}`])
      }
    }
    
    console.error = (...args) => {
      originalError(...args)
      if (args[0]?.includes?.('Analytics') || args[0]?.includes?.('❌')) {
        setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`])
      }
    }

    return () => {
      console.log = originalLog
      console.error = originalError
    }
  }, [])

  const testTracking = async () => {
    setTrackingStatus('tracking')
    setLogs(prev => [...prev, '🧪 Iniciando teste manual de tracking...'])

    try {
      const data = {
        pageUrl,
        pageTitle,
        postSlug,
        postType,
        visitDuration: 30,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
      }

      setAnalyticsData(data)
      setLogs(prev => [...prev, `📤 Enviando dados: ${JSON.stringify(data, null, 2)}`])

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (response.ok) {
        setTrackingStatus('success')
        setLogs(prev => [...prev, `✅ Tracking bem-sucedido! ID: ${result.analyticsId || 'N/A'}`])
        setLogs(prev => [...prev, `📊 Resposta: ${JSON.stringify(result, null, 2)}`])
      } else {
        setTrackingStatus('error')
        setLogs(prev => [...prev, `❌ Erro no tracking: ${response.status}`])
        setLogs(prev => [...prev, `📊 Erro: ${JSON.stringify(result, null, 2)}`])
      }
    } catch (error) {
      setTrackingStatus('error')
      setLogs(prev => [...prev, `❌ Erro de rede: ${error}`])
    }
  }

  const testDashboard = async () => {
    setLogs(prev => [...prev, '📊 Testando API do dashboard...'])

    try {
      const response = await fetch('/api/analytics/dashboard?period=7d')
      const result = await response.json()
      
      if (response.ok) {
        setLogs(prev => [...prev, `✅ Dashboard OK - Total: ${result.data?.totalViews || 0} visualizações`])
      } else {
        setLogs(prev => [...prev, `❌ Dashboard erro: ${response.status}`])
      }
    } catch (error) {
      setLogs(prev => [...prev, `❌ Erro dashboard: ${error}`])
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  if (!isClient) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 w-96 max-h-96 z-50 bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>🔍 Analytics Debug</span>
          <div className="flex gap-2">
            <Badge variant={trackingStatus === 'success' ? 'default' : trackingStatus === 'error' ? 'destructive' : 'secondary'}>
              {trackingStatus}
            </Badge>
            <Button size="sm" variant="outline" onClick={clearLogs}>
              Limpar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-3">
          <Button size="sm" onClick={testTracking} disabled={trackingStatus === 'tracking'}>
            Testar Tracking
          </Button>
          <Button size="sm" variant="outline" onClick={testDashboard}>
            Testar Dashboard
          </Button>
        </div>
        
        <div className="text-xs space-y-1 max-h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="p-1 bg-gray-50 rounded text-xs font-mono">
              {log}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 