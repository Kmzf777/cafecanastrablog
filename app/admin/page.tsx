
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Plus, Pencil, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { BlogPost } from '@/lib/types/blog'

export const metadata: Metadata = {
    title: 'Painel Admin | Café Canastra',
    robots: {
        index: false,
        follow: false,
    },
}

async function getPosts(): Promise<BlogPost[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) return []

    try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching posts:', error)
            return []
        }

        return (data as BlogPost[]) || []
    } catch (error) {
        console.error('Error in getPosts:', error)
        return []
    }
}

function formatDate(dateString: string | null) {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
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

export default async function AdminPage() {
    const posts = await getPosts()

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Painel Administrativo</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Gerencie os posts do blog, agendamentos e conteúdos do Café Canastra.
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

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Título
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Data
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Ações</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {posts.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                                    Nenhum post encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            posts.map((post) => (
                                                <tr key={post.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {post.title}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {getStatusBadge(post.status)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex justify-end gap-2">
                                                            {post.status === 'published' && (
                                                                <Link
                                                                    href={`/blog/${post.slug}`}
                                                                    target="_blank"
                                                                    className="text-gray-400 hover:text-gray-600"
                                                                    title="Ver no site"
                                                                >
                                                                    <Globe className="w-4 h-4" />
                                                                </Link>
                                                            )}
                                                            <Link
                                                                href={`/admin/posts/${post.id}`}
                                                                className="text-amber-600 hover:text-amber-900"
                                                                title="Editar"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
