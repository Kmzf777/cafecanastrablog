-- Script para atualizar a tabela blog_posts com os novos campos dinâmicos
-- Execute este script no SQL Editor do Supabase

-- Adicionar campo post_type se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'post_type') THEN
        ALTER TABLE blog_posts ADD COLUMN post_type TEXT CHECK (post_type IN ('recipe', 'news'));
    END IF;
END $$;

-- Adicionar campos para ingredientes (até 15)
DO $$ 
BEGIN
    FOR i IN 1..15 LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'blog_posts' AND column_name = 'ingrediente_' || i) THEN
            EXECUTE 'ALTER TABLE blog_posts ADD COLUMN ingrediente_' || i || ' TEXT';
        END IF;
    END LOOP;
END $$;

-- Adicionar campos para modo de preparo (até 15)
DO $$ 
BEGIN
    FOR i IN 1..15 LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'blog_posts' AND column_name = 'modo_de_preparo_' || i) THEN
            EXECUTE 'ALTER TABLE blog_posts ADD COLUMN modo_de_preparo_' || i || ' TEXT';
        END IF;
    END LOOP;
END $$;

-- Adicionar campos para subtítulos e parágrafos (até 10)
DO $$ 
BEGIN
    FOR i IN 1..10 LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'blog_posts' AND column_name = 'subtitulo_' || i) THEN
            EXECUTE 'ALTER TABLE blog_posts ADD COLUMN subtitulo_' || i || ' TEXT';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'blog_posts' AND column_name = 'paragrafo_' || i) THEN
            EXECUTE 'ALTER TABLE blog_posts ADD COLUMN paragrafo_' || i || ' TEXT';
        END IF;
    END LOOP;
END $$;

-- Adicionar campos específicos para receitas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'ingredientes_titulo') THEN
        ALTER TABLE blog_posts ADD COLUMN ingredientes_titulo TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'modo_de_preparo_titulo') THEN
        ALTER TABLE blog_posts ADD COLUMN modo_de_preparo_titulo TEXT;
    END IF;
END $$;

-- Adicionar campo fonte para notícias
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'fonte') THEN
        ALTER TABLE blog_posts ADD COLUMN fonte TEXT;
    END IF;
END $$;

-- Comentários para documentação
COMMENT ON COLUMN blog_posts.post_type IS 'Tipo do post: recipe (receita) ou news (notícia)';
COMMENT ON COLUMN blog_posts.ingredientes_titulo IS 'Título da seção de ingredientes para receitas';
COMMENT ON COLUMN blog_posts.modo_de_preparo_titulo IS 'Título da seção de modo de preparo para receitas';
COMMENT ON COLUMN blog_posts.fonte IS 'URL da fonte para notícias';

-- Verificar se a tabela foi atualizada corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name IN (
    'post_type',
    'ingredientes_titulo',
    'modo_de_preparo_titulo',
    'fonte',
    'ingrediente_1',
    'ingrediente_2',
    'modo_de_preparo_1',
    'modo_de_preparo_2',
    'subtitulo_1',
    'paragrafo_1'
)
ORDER BY column_name; 