-- ============================================================
-- Migration 003: Migrate existing content to block system
-- Story: 1.1 - Foundation — Types, DB Schema & Migration
-- Date: 2026-03-03
-- Execute this script in Supabase SQL Editor AFTER 002
-- ============================================================

-- 1. Convert each existing post's content into a single paragraph block
INSERT INTO public.blog_post_blocks (post_id, type, "order", data)
SELECT
  id AS post_id,
  'paragraph' AS type,
  0 AS "order",
  jsonb_build_object('text', content) AS data
FROM public.blog_posts
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_post_blocks
  WHERE blog_post_blocks.post_id = blog_posts.id
);

-- 2. Set translation_group_id to the post's own id for existing posts
UPDATE public.blog_posts
SET translation_group_id = id
WHERE translation_group_id IS NULL
   OR translation_group_id != id;
