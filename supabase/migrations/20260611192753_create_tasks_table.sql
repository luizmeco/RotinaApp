-- 1. Criar "Enums" para padronizar o que entra no banco
CREATE TYPE task_priority AS ENUM ('baixa', 'media', 'alta');
CREATE TYPE task_status AS ENUM ('pendente', 'concluida');

-- 2. Criar a tabela de Tarefas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  priority task_priority DEFAULT 'media',
  status task_status DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar a segurança de nível de linha (RLS) - ISSO É VITAL!
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 4. Criar as Políticas de Segurança (Policies)
-- Essa política diz: "O usuário só pode Inserir, Ver, Editar ou Deletar tarefas onde o user_id for igual ao ID dele mesmo logado".
CREATE POLICY "Usuários gerenciam apenas suas próprias tarefas"
ON tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);