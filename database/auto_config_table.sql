-- Script para criar a tabela auto_config no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela auto_config
CREATE TABLE IF NOT EXISTS auto_config (
  id SERIAL PRIMARY KEY,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  start_hour INTEGER NOT NULL DEFAULT 7 CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour INTEGER NOT NULL DEFAULT 10 CHECK (end_hour >= 0 AND end_hour <= 23),
  modo TEXT NOT NULL DEFAULT 'automático' CHECK (modo IN ('automático', 'personalizado')),
  tema TEXT DEFAULT '',
  publico_alvo TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para otimizar consultas por updated_at
CREATE INDEX IF NOT EXISTS idx_auto_config_updated_at ON auto_config(updated_at DESC);

-- Inserir configuração padrão se a tabela estiver vazia
INSERT INTO auto_config (is_enabled, start_hour, end_hour, modo, tema, publico_alvo)
SELECT false, 7, 10, 'automático', '', ''
WHERE NOT EXISTS (SELECT 1 FROM auto_config);

-- Habilitar Row Level Security (RLS)
ALTER TABLE auto_config ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura e escrita (ajuste conforme necessário)
CREATE POLICY "Permitir acesso total à auto_config" ON auto_config
  FOR ALL USING (true);

-- Função para atualizar o timestamp updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_auto_config_updated_at
  BEFORE UPDATE ON auto_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE auto_config IS 'Configurações do sistema de agendamento automático de posts';
COMMENT ON COLUMN auto_config.is_enabled IS 'Status de ativação do agendamento automático';
COMMENT ON COLUMN auto_config.start_hour IS 'Hora de início do agendamento (0-23)';
COMMENT ON COLUMN auto_config.end_hour IS 'Hora de fim do agendamento (0-23)';
COMMENT ON COLUMN auto_config.modo IS 'Modo de postagem: automático ou personalizado';
COMMENT ON COLUMN auto_config.tema IS 'Tema para postagem personalizada';
COMMENT ON COLUMN auto_config.publico_alvo IS 'Público-alvo para postagem personalizada'; 