-- ============================================================
-- Migration 001: Create blog_posts table (clean slate)
-- Story: 3.1 - Criar Tabela blog_posts no Supabase e Bucket de Imagens
-- Date: 2026-02-19
-- Execute this script in Supabase SQL Editor
-- NOTE: Drops and recreates the table — any existing data will be lost
-- ============================================================

-- Drop existing objects to start clean
DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON public.blog_posts;
DROP FUNCTION IF EXISTS update_blog_posts_updated_at();
DROP TABLE IF EXISTS public.blog_posts CASCADE;

-- Tabela principal
CREATE TABLE public.blog_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  content      TEXT NOT NULL,
  excerpt      TEXT,
  image_url    TEXT,
  image_alt    TEXT,
  status       VARCHAR(20) DEFAULT 'draft'
               CHECK (status IN ('draft', 'scheduled', 'published')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  author       VARCHAR(100) DEFAULT 'Café Canastra',
  category     VARCHAR(100),
  tags         TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX idx_blog_posts_slug
  ON public.blog_posts(slug);

CREATE INDEX idx_blog_posts_status
  ON public.blog_posts(status);

CREATE INDEX idx_blog_posts_scheduled_at
  ON public.blog_posts(scheduled_at)
  WHERE status = 'scheduled';

CREATE INDEX idx_blog_posts_published_at
  ON public.blog_posts(published_at DESC)
  WHERE status = 'published';

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger updated_at
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- RLS: habilitar Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode ler posts publicados
CREATE POLICY "Public can read published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Política: bloquear escrita pública (service_role bypassa RLS automaticamente)
CREATE POLICY "No public writes"
  ON public.blog_posts
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Comentários para documentação
COMMENT ON TABLE public.blog_posts IS 'Tabela de posts do blog Café Canastra';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL amigável única do post';
COMMENT ON COLUMN public.blog_posts.status IS 'Estado do post: draft, scheduled ou published';
COMMENT ON COLUMN public.blog_posts.scheduled_at IS 'Data/hora para publicação agendada';
COMMENT ON COLUMN public.blog_posts.published_at IS 'Data/hora em que o post foi publicado';
COMMENT ON COLUMN public.blog_posts.tags IS 'Array de tags do post';
