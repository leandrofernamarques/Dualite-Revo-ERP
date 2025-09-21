-- 1. Habilitar a extensão para busca por texto (trigram)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Criar a tabela 'clients'
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,
  
  -- Garante que um usuário não pode ter o mesmo e-mail duplicado
  CONSTRAINT clients_user_id_email_key UNIQUE (user_id, email)
);

-- 3. Adicionar comentários para clareza
COMMENT ON TABLE public.clients IS 'Tabela para armazenar os clientes de cada usuário do sistema.';
COMMENT ON COLUMN public.clients.user_id IS 'ID do usuário (dono do registro) vindo de auth.users.';
COMMENT ON COLUMN public.clients.deleted_at IS 'Timestamp de quando o cliente foi excluído (soft delete). Se for NULL, o cliente está ativo.';

-- 4. Criar índices para otimizar as consultas
-- Índice para buscas e ordenação por usuário
CREATE INDEX idx_clients_user_id_created_at ON public.clients (user_id, created_at DESC);
-- Índice para busca rápida por nome usando trigram
CREATE INDEX idx_clients_name_trgm ON public.clients USING gin (name gin_trgm_ops);

-- 5. Habilitar Row-Level Security (RLS) na tabela
-- Isso garante que, por padrão, ninguém pode acessar os dados, a menos que uma política permita.
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de RLS para isolar os dados por usuário (owner-only)
-- Permite que usuários vejam APENAS os seus próprios clientes.
CREATE POLICY "Allow SELECT for owner"
ON public.clients
FOR SELECT
USING (auth.uid() = user_id);

-- Permite que usuários insiram clientes APENAS para si mesmos.
CREATE POLICY "Allow INSERT for owner"
ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Permite que usuários atualizem APENAS os seus próprios clientes.
CREATE POLICY "Allow UPDATE for owner"
ON public.clients
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permite que usuários (soft) deletem APENAS os seus próprios clientes.
CREATE POLICY "Allow DELETE for owner"
ON public.clients
FOR DELETE
USING (auth.uid() = user_id);
