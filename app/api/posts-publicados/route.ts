import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/supabase';

export async function GET() {
  try {
    const posts = await getPublishedPosts();
    // Retorne apenas os campos necessários para o sitemap
    const result = posts.map(post => ({
      slug: post.slug,
      post_type: post.post_type,
      created_at: post.created_at,
      updated_at: post.updated_at,
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 });
  }
} 