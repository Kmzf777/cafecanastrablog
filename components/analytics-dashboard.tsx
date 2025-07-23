"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Clock,
  Monitor,
  Smartphone,
  Globe,
  FileText,
  Coffee,
  RefreshCw,
  Calendar,
  Activity,
  Target,
  Zap,
  Database,
  Settings
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  uniqueViews: number
  homeViews: number
  blogViews: number
  viewsByPageType: Array<{ page_type: string; count: number }>
  topPosts: Array<{ post_slug: string; post_type: string; page_title: string; count: number }>
  deviceStats: Array<{ device_type: string; count: number }>
  browserStats: Array<{ browser: string; count: number }>
  dailyViews: Array<{ date: string; views: number }>
  bounceRate: number
  avgSessionDuration: number
  period: { start: string; end: string }
}

interface AnalyticsDashboardProps {
  className?: string
}

export default function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState('7d')
  const [pageType, setPageType] = useState('all')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tablesNotConfigured, setTablesNotConfigured] = useState(false)

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics/dashboard?period=${period}&pageType=${pageType}`)
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados de analytics')
      }

      const result = await response.json()
      
      // Verificar se as tabelas não estão configuradas
      if (result.message && result.message.includes('não configuradas')) {
        setTablesNotConfigured(true)
        setData(null)
      } else {
        setTablesNotConfigured(false)
        setData(result.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setTablesNotConfigured(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [period, pageType])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getPageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      home: 'Home Page',
      blog: 'Blog',
      blog_post: 'Post do Blog',
      recipe: 'Receita',
      news: 'Notícia',
      other: 'Outros'
    }
    return labels[type] || type
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="w-4 h-4" />
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Monitor className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (tablesNotConfigured) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-amber-600" />
              Dashboard de Monitoramento
            </h2>
            <p className="text-gray-600 mt-1">
              Análise completa das visualizações do site
            </p>
          </div>
        </div>

        {/* Mensagem de configuração necessária */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Database className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Configuração Necessária
              </h3>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                Para ativar o sistema de monitoramento, você precisa criar as tabelas de analytics no Supabase.
                O sistema está funcionando, mas os dados não estão sendo salvos ainda.
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
                <h4 className="font-semibold text-gray-900 mb-2">Passos para configurar:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Acesse o painel do Supabase</li>
                  <li>Vá para o SQL Editor</li>
                  <li>Execute o script: <code className="bg-gray-100 px-2 py-1 rounded">database/analytics_table.sql</code></li>
                  <li>Volte aqui e clique em "Tentar novamente"</li>
                </ol>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={fetchAnalyticsData} 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar novamente
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://supabase.com', '_blank')}
                  className="border-amber-500 text-amber-600 hover:bg-amber-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Acessar Supabase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview do dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-amber-600" />
              Preview do Dashboard
            </CardTitle>
            <CardDescription>
              Como o dashboard aparecerá quando configurado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Visualizações</CardTitle>
                  <Eye className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                  <p className="text-xs text-gray-500 mt-1">Visualizações totais no período</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Visitas Únicas</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                  <p className="text-xs text-gray-500 mt-1">Sessões únicas</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Home Page</CardTitle>
                  <Coffee className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                  <p className="text-xs text-gray-500 mt-1">Visualizações da página principal</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Blog</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-400">0</div>
                  <p className="text-xs text-gray-500 mt-1">Visualizações do blog</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchAnalyticsData} className="bg-amber-600 hover:bg-amber-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
            <p className="text-gray-600">Os dados de analytics aparecerão aqui quando houver visualizações.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div 
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-amber-600" />
            Dashboard de Monitoramento
          </h2>
          <p className="text-gray-600 mt-1">
            Análise completa das visualizações do site
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 dia</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as páginas</SelectItem>
              <SelectItem value="home">Home Page</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="recipe">Receitas</SelectItem>
              <SelectItem value="news">Notícias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={fetchAnalyticsData} 
            variant="outline" 
            size="sm"
            className="border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.totalViews)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Visualizações totais no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Visitas Únicas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.uniqueViews)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Sessões únicas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Home Page</CardTitle>
            <Coffee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.homeViews)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Visualizações da página principal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Blog</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(data.blogViews)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Visualizações do blog
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Bounce</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.bounceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              Usuários que saíram sem navegar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatDuration(data.avgSessionDuration)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Duração média da sessão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data.dailyViews.length > 1 ? 
                Math.round(((data.dailyViews[data.dailyViews.length - 1].views - data.dailyViews[0].views) / data.dailyViews[0].views) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Crescimento no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de visualizações diárias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-amber-600" />
            Visualizações Diárias
          </CardTitle>
          <CardDescription>
            Evolução das visualizações ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-1">
            {data.dailyViews.map((day, index) => {
              const maxViews = Math.max(...data.dailyViews.map(d => d.views))
              const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-amber-500 rounded-t transition-all duration-300 hover:bg-amber-600"
                    style={{ height: `${height}%` }}
                    title={`${day.date}: ${day.views} visualizações`}
                  />
                  <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                    {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Posts mais visualizados */}
      {data.topPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-amber-600" />
              Posts Mais Visualizados
            </CardTitle>
            <CardDescription>
              Conteúdo que mais engaja os visitantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPosts.map((post, index) => (
                <div key={post.post_slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {post.page_title || post.post_slug}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getPageTypeLabel(post.post_type || 'blog_post')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          /{post.post_slug}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatNumber(post.count)}</div>
                    <div className="text-xs text-gray-500">visualizações</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas de dispositivos e browsers */}
      {(data.deviceStats.length > 0 || data.browserStats.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.deviceStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-amber-600" />
                  Dispositivos
                </CardTitle>
                <CardDescription>
                  Distribuição por tipo de dispositivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.deviceStats.map((device) => (
                    <div key={device.device_type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.device_type)}
                        <span className="capitalize">{device.device_type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ 
                              width: `${(device.count / data.totalViews) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {formatNumber(device.count)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.browserStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-amber-600" />
                  Browsers
                </CardTitle>
                <CardDescription>
                  Navegadores mais utilizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.browserStats.map((browser) => (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <span className="font-medium">{browser.browser}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(browser.count / data.totalViews) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {formatNumber(browser.count)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Visualizações por tipo de página */}
      {data.viewsByPageType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-600" />
              Visualizações por Tipo de Página
            </CardTitle>
            <CardDescription>
              Distribuição das visualizações por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data.viewsByPageType.map((pageType) => (
                <div key={pageType.page_type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    {formatNumber(pageType.count)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getPageTypeLabel(pageType.page_type)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
} 