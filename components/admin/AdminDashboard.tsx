'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Globe, Copy, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown, Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import type { BlogPost } from '@/lib/types/blog'

type SortField = 'date' | 'title' | 'seo_score'
type SortDirection = 'asc' | 'desc'

interface AdminDashboardProps {
  initialPosts: BlogPost[]
}

const LOCALE_FLAGS: Record<string, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Publicado</Badge>
    case 'scheduled':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">Agendado</Badge>
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Rascunho</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getSeoScoreBadge(score: number | undefined | null) {
  if (score === undefined || score === null) {
    return <Badge className="bg-gray-100 text-gray-500 border-gray-200">N/A</Badge>
  }
  if (score >= 90) return <Badge className="bg-green-100 text-green-800 border-green-200">{score}</Badge>
  if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{score}</Badge>
  if (score >= 50) return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{score}</Badge>
  return <Badge className="bg-red-100 text-red-800 border-red-200">{score}</Badge>
}

function formatRelativeDate(dateString: string | null) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return '1 dia atrás'
  if (diffDays < 7) return `${diffDays} dias atrás`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`
  return `${Math.floor(diffDays / 365)} anos atrás`
}

function formatAbsoluteDate(dateString: string | null) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPostDate(post: BlogPost): string | null {
  return post.published_at || post.scheduled_at || post.created_at
}

export default function AdminDashboard({ initialPosts }: AdminDashboardProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Prevent hydration mismatch for date-dependent rendering
  useEffect(() => setMounted(true), [])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [localeFilter, setLocaleFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeoutRef = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef[0]) clearTimeout(searchTimeoutRef[0])
    searchTimeoutRef[0] = setTimeout(() => setDebouncedSearch(value), 300)
  }, [searchTimeoutRef])

  // Get unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set<string>()
    posts.forEach(p => { if (p.category) cats.add(p.category) })
    return Array.from(cats).sort()
  }, [posts])

  // Summary counters
  const counters = useMemo(() => ({
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
  }), [posts])

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter)
    }

    // Locale filter
    if (localeFilter !== 'all') {
      result = result.filter(p => (p.locale || 'pt') === localeFilter)
    }

    // Search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(query))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'date': {
          const dateA = new Date(getPostDate(a) || 0).getTime()
          const dateB = new Date(getPostDate(b) || 0).getTime()
          comparison = dateA - dateB
          break
        }
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'seo_score':
          comparison = (a.seo_score ?? -1) - (b.seo_score ?? -1)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [posts, statusFilter, categoryFilter, localeFilter, debouncedSearch, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'title' ? 'asc' : 'desc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 ml-1" />
      : <ArrowDown className="w-3 h-3 ml-1" />
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    setDuplicatingId(id)
    try {
      const res = await fetch(`/api/admin/posts/${id}/duplicate`, { method: 'POST' })
      if (res.ok) {
        const { post } = await res.json()
        setPosts(prev => [post, ...prev])
      }
    } finally {
      setDuplicatingId(null)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-serif font-bold text-gray-900">Painel Administrativo</h1>
              <p className="mt-2 text-sm text-gray-700">
                Gerencie posts, agendamentos e conteúdo do Café Canastra.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Link href="/admin/posts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Post
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Counters */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{counters.published}</div>
                <div className="text-sm text-gray-500">Publicados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-700">{counters.draft}</div>
                <div className="text-sm text-gray-500">Rascunhos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">{counters.scheduled}</div>
                <div className="text-sm text-gray-500">Agendados</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por título..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={localeFilter} onValueChange={setLocaleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Idiomas</SelectItem>
                <SelectItem value="pt">🇧🇷 PT</SelectItem>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="mt-6">
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer select-none"
                      onClick={() => handleSort('title')}
                    >
                      <span className="inline-flex items-center">
                        Título {getSortIcon('title')}
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Categoria
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Idioma
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer select-none"
                      onClick={() => handleSort('date')}
                    >
                      <span className="inline-flex items-center">
                        Data {getSortIcon('date')}
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer select-none"
                      onClick={() => handleSort('seo_score')}
                    >
                      <span className="inline-flex items-center">
                        SEO {getSortIcon('seo_score')}
                      </span>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                        Nenhum post encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => {
                      const postDate = getPostDate(post)
                      return (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate">{post.title}</span>
                              </TooltipTrigger>
                              <TooltipContent>{post.title}</TooltipContent>
                            </Tooltip>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {post.category || '—'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span title={post.locale || 'pt'}>
                              {LOCALE_FLAGS[post.locale || 'pt'] || post.locale || 'pt'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {mounted ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>{formatRelativeDate(postDate)}</span>
                                </TooltipTrigger>
                                <TooltipContent>{formatAbsoluteDate(postDate)}</TooltipContent>
                              </Tooltip>
                            ) : (
                              <span>{postDate ? new Date(postDate).toLocaleDateString() : '—'}</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {getSeoScoreBadge(post.seo_score)}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              {/* Edit */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/admin/posts/${post.id}`}
                                    className="text-amber-600 hover:text-amber-900 p-1"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>Editar</TooltipContent>
                              </Tooltip>

                              {/* Preview (published only) */}
                              {post.status === 'published' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={`/blog/${post.slug}`}
                                      target="_blank"
                                      className="text-blue-500 hover:text-blue-700 p-1"
                                    >
                                      <Globe className="w-4 h-4" />
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>Visualizar</TooltipContent>
                                </Tooltip>
                              )}

                              {/* Duplicate */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => handleDuplicate(post.id)}
                                    disabled={duplicatingId === post.id}
                                    className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Duplicar</TooltipContent>
                              </Tooltip>

                              {/* Delete */}
                              <AlertDialog>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <button
                                        disabled={deletingId === post.id}
                                        className="text-red-400 hover:text-red-600 p-1 disabled:opacity-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir post</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza? Esta ação não pode ser desfeita. O post &quot;{post.title}&quot; e todos os seus blocos serão permanentemente excluídos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(post.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
