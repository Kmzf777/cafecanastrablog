-- ============================================================
-- Migration 002: Add block system to blog_posts
-- Story: 1.1 - Foundation — Types, DB Schema & Migration
-- Date: 2026-03-03
-- Execute this script in Supabase SQL Editor
-- ============================================================

-- =====================
-- 1. ALTER blog_posts — add new columns
-- =====================

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'pt',
  ADD COLUMN IF NOT EXISTS translation_group_id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS seo_config JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS geo_config JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0;

-- Indices for new columns
CREATE INDEX IF NOT EXISTS idx_blog_posts_translation_group
  ON public.blog_posts(translation_group_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_locale
  ON public.blog_posts(locale);

-- =====================
-- 2. CREATE TABLE blog_post_blocks
-- =====================

CREATE TABLE IF NOT EXISTS public.blog_post_blocks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  type       VARCHAR(30) NOT NULL
             CHECK (type IN (
               'heading', 'paragraph', 'image', 'gallery', 'quote', 'list',
               'code', 'embed', 'divider', 'callout', 'table', 'faq',
               'cta', 'video', 'accordion', 'product'
             )),
  "order"    INTEGER NOT NULL,
  data       JSONB NOT NULL,
  settings   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================
-- 3. Indices for blog_post_blocks
-- =====================

CREATE INDEX IF NOT EXISTS idx_blocks_post_id
  ON public.blog_post_blocks(post_id);

CREATE INDEX IF NOT EXISTS idx_blocks_post_order
  ON public.blog_post_blocks(post_id, "order");

CREATE INDEX IF NOT EXISTS idx_blocks_type
  ON public.blog_post_blocks(type);

-- =====================
-- 4. Trigger: updated_at on blog_post_blocks
-- =====================

CREATE OR REPLACE FUNCTION update_blog_post_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_blog_post_blocks_updated_at
  BEFORE UPDATE ON public.blog_post_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_blocks_updated_at();

-- =====================
-- 5. RLS policies for blog_post_blocks
-- =====================

ALTER TABLE public.blog_post_blocks ENABLE ROW LEVEL SECURITY;

-- Public can read blocks of published posts
CREATE POLICY "Public can read blocks of published posts"
  ON public.blog_post_blocks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = blog_post_blocks.post_id
        AND blog_posts.status = 'published'
    )
  );

-- No public writes on blocks (service_role bypasses RLS)
CREATE POLICY "No public writes on blocks"
  ON public.blog_post_blocks
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- =====================
-- Comments
-- =====================

COMMENT ON TABLE public.blog_post_blocks IS 'Content blocks for blog posts (block editor system)';
COMMENT ON COLUMN public.blog_post_blocks.type IS 'Block type: heading, paragraph, image, gallery, quote, list, code, embed, divider, callout, table, faq, cta, video, accordion, product';
COMMENT ON COLUMN public.blog_post_blocks."order" IS 'Display order of the block within its post';
COMMENT ON COLUMN public.blog_post_blocks.data IS 'Block content data (JSONB, structure varies by type)';
COMMENT ON COLUMN public.blog_post_blocks.settings IS 'Block display settings: width, alignment, css_class, spacing';
