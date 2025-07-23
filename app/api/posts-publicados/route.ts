import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/supabase';

export async function GET() {
  try {
    console.log("=== API POSTS PUBLICADOS ===");
    const posts = await getPublishedPosts();
    console.log(`Posts encontrados: ${posts.length}`);
    
    // Retorne informações completas para debug
    const result = {
      posts: posts.map(post => ({
        id: post.id,
        titulo: post.titulo,
        slug: post.slug,
        post_type: post.post_type,
        status: post.status,
        created_at: post.created_at,
        updated_at: post.updated_at,
      })),
      total: posts.length,
      timestamp: new Date().toISOString()
    };
    
    console.log("Resultado:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json({ error: 'Erro ao buscar posts', details: error.message }, { status: 500 });
  }
} 