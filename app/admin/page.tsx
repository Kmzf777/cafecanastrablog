export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { BlogPost } from '@/lib/types/blog'

export const metadata: Metadata = {
    title: 'Painel Administrativo | Café Canastra',
    robots: {
        index: false,
        follow: false,
    },
}

async function getPosts(): Promise<BlogPost[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) return []

    try {
        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        })
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

export default async function AdminPage() {
    const posts = await getPosts()

    return <AdminDashboard initialPosts={posts} />
}
