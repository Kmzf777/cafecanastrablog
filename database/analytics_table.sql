-- Script para criar a tabela analytics no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela analytics
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title TEXT,
  page_type TEXT CHECK (page_type IN ('home', 'blog', 'blog_post', 'recipe', 'news', 'other')),
  post_slug TEXT,
  post_type TEXT CHECK (post_type IN ('recipe', 'news', null)),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'bot', 'other')),
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  language TEXT,
  session_id TEXT,
  visit_duration INTEGER, -- em segundos
  bounce BOOLEAN DEFAULT true,
  is_unique_visit BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_analytics_page_url ON analytics(page_url);
CREATE INDEX IF NOT EXISTS idx_analytics_page_type ON analytics(page_type);
CREATE INDEX IF NOT EXISTS idx_analytics_post_slug ON analytics(post_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_ip_address ON analytics(ip_address);

-- Criar tabela de sessões para rastrear visitas únicas
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  ip_address INET,
  user_agent TEXT,
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  total_duration INTEGER DEFAULT 0, -- em segundos
  pages_visited TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para sessões
CREATE INDEX IF NOT EXISTS idx_sessions_ip_address ON sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir leitura e escrita
CREATE POLICY "Permitir acesso total à analytics" ON analytics
  FOR ALL USING (true);

CREATE POLICY "Permitir acesso total à sessions" ON sessions
  FOR ALL USING (true);

-- Função para atualizar o timestamp updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente na tabela sessions
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para detectar tipo de dispositivo baseado no user agent
CREATE OR REPLACE FUNCTION detect_device_type(user_agent TEXT)
RETURNS TEXT AS $$
BEGIN
  IF user_agent IS NULL THEN
    RETURN 'other';
  END IF;
  
  user_agent := LOWER(user_agent);
  
  -- Detectar bots
  IF user_agent LIKE '%bot%' OR user_agent LIKE '%crawler%' OR user_agent LIKE '%spider%' THEN
    RETURN 'bot';
  END IF;
  
  -- Detectar mobile
  IF user_agent LIKE '%mobile%' OR user_agent LIKE '%android%' OR user_agent LIKE '%iphone%' OR user_agent LIKE '%ipad%' THEN
    RETURN 'mobile';
  END IF;
  
  -- Detectar tablet
  IF user_agent LIKE '%tablet%' OR user_agent LIKE '%ipad%' THEN
    RETURN 'tablet';
  END IF;
  
  -- Desktop como padrão
  RETURN 'desktop';
END;
$$ LANGUAGE plpgsql;

-- Função para detectar browser baseado no user agent
CREATE OR REPLACE FUNCTION detect_browser(user_agent TEXT)
RETURNS TEXT AS $$
BEGIN
  IF user_agent IS NULL THEN
    RETURN 'unknown';
  END IF;
  
  user_agent := LOWER(user_agent);
  
  IF user_agent LIKE '%chrome%' THEN
    RETURN 'Chrome';
  ELSIF user_agent LIKE '%firefox%' THEN
    RETURN 'Firefox';
  ELSIF user_agent LIKE '%safari%' THEN
    RETURN 'Safari';
  ELSIF user_agent LIKE '%edge%' THEN
    RETURN 'Edge';
  ELSIF user_agent LIKE '%opera%' THEN
    RETURN 'Opera';
  ELSE
    RETURN 'Other';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para detectar OS baseado no user agent
CREATE OR REPLACE FUNCTION detect_os(user_agent TEXT)
RETURNS TEXT AS $$
BEGIN
  IF user_agent IS NULL THEN
    RETURN 'unknown';
  END IF;
  
  user_agent := LOWER(user_agent);
  
  IF user_agent LIKE '%windows%' THEN
    RETURN 'Windows';
  ELSIF user_agent LIKE '%mac%' OR user_agent LIKE '%os x%' THEN
    RETURN 'macOS';
  ELSIF user_agent LIKE '%linux%' THEN
    RETURN 'Linux';
  ELSIF user_agent LIKE '%android%' THEN
    RETURN 'Android';
  ELSIF user_agent LIKE '%ios%' OR user_agent LIKE '%iphone%' OR user_agent LIKE '%ipad%' THEN
    RETURN 'iOS';
  ELSE
    RETURN 'Other';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE analytics IS 'Tabela para armazenar dados de analytics e monitoramento de visualizações';
COMMENT ON COLUMN analytics.page_url IS 'URL da página visitada';
COMMENT ON COLUMN analytics.page_type IS 'Tipo da página: home, blog, blog_post, recipe, news, other';
COMMENT ON COLUMN analytics.post_slug IS 'Slug do post (se aplicável)';
COMMENT ON COLUMN analytics.post_type IS 'Tipo do post: recipe, news, ou null';
COMMENT ON COLUMN analytics.device_type IS 'Tipo de dispositivo: desktop, mobile, tablet, bot, other';
COMMENT ON COLUMN analytics.visit_duration IS 'Duração da visita em segundos';
COMMENT ON COLUMN analytics.bounce IS 'Se o usuário saiu sem visitar outras páginas';
COMMENT ON COLUMN analytics.is_unique_visit IS 'Se é uma visita única (primeira visita da sessão)';

COMMENT ON TABLE sessions IS 'Tabela para rastrear sessões de usuários';
COMMENT ON COLUMN sessions.pages_visited IS 'Array com URLs das páginas visitadas na sessão';
COMMENT ON COLUMN sessions.total_duration IS 'Duração total da sessão em segundos'; 