-- Script para criar a tabela blog_posts no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- Criar tabela blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Campos de SEO
    meta_description TEXT,
    meta_keywords TEXT,
    og_url TEXT,
    og_title TEXT,
    og_description TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    title TEXT NOT NULL,
    
    -- Campos de conteúdo
    titulo TEXT NOT NULL,
    imagem_titulo TEXT,
    alt_imagem_titulo TEXT,
    resumo TEXT,
    secao_1_titulo TEXT,
    secao_1_texto TEXT,
    secao_2_titulo TEXT,
    secao_2_texto TEXT,
    secao_3_titulo TEXT,
    secao_3_texto TEXT,
    imagem_secao_3 TEXT,
    alt_imagem_secao_3 TEXT,
    secao_4_titulo TEXT,
    secao_4_texto TEXT,
    secao_5_titulo TEXT,
    secao_5_texto TEXT,
    secao_6_titulo TEXT,
    secao_6_texto TEXT,
    imagem_secao_6 TEXT,
    alt_imagem_secao_6 TEXT,
    secao_7_titulo TEXT,
    secao_7_texto TEXT,
    secao_cta_titulo TEXT,
    secao_cta_texto TEXT,
    conclusao TEXT,
    
    -- Campos internos
    slug TEXT UNIQUE NOT NULL,
    modo TEXT CHECK (modo IN ('automático', 'personalizado')) NOT NULL,
    status TEXT CHECK (status IN ('publicado', 'rascunho')) DEFAULT 'rascunho',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de posts publicados
CREATE POLICY "Posts publicados são visíveis publicamente" ON public.blog_posts
    FOR SELECT USING (status = 'publicado');

-- Política para permitir inserção/atualização (você pode ajustar conforme necessário)
CREATE POLICY "Permitir inserção e atualização" ON public.blog_posts
    FOR ALL USING (true);

-- Verificar se a tabela foi criada
SELECT 'Tabela blog_posts criada com sucesso!' as resultado; 