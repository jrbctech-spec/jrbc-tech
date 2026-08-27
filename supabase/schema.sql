-- ==============================================================================
-- JRBTC-TECH - SISTEMA DE GESTÃO DE CHAMADOS TÉCNICOS DE TI
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS (SUPABASE POSTGRESQL + RLS + TRIGGERS)
-- ==============================================================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABELAS PRINCIPAIS
-- ==============================================================================

-- 1.1 Tabela de Clientes (Empresas e Contratantes)
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    whatsapp VARCHAR(30),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Tabela de Usuários (Integrado com Supabase Auth)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- Referência opcional ao auth.users do Supabase
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(30),
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('ADMIN', 'TECNICO', 'CLIENTE')),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Tabela de Técnicos
CREATE TABLE IF NOT EXISTS public.tecnicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    especialidades TEXT[] DEFAULT '{}',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL UNIQUE CHECK (nome IN ('Microinformática', 'Infraestrutura de TI', 'Banco de Dados', 'Sistemas & Cloud', 'Redes & Segurança')),
    descricao TEXT,
    icone VARCHAR(50) DEFAULT 'Wrench',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 Tabela de Serviços (Vinculados à Categoria)
CREATE TABLE IF NOT EXISTS public.servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
    nome_servico VARCHAR(255) NOT NULL,
    descricao TEXT,
    sla_horas INT DEFAULT 24,
    valor_estimado NUMERIC(10, 2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequência para numeração de chamados por ano
CREATE SEQUENCE IF NOT EXISTS chamado_seq_2026 START 1;

-- 1.6 Tabela de Chamados
CREATE TABLE IF NOT EXISTS public.chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_chamado VARCHAR(30) UNIQUE NOT NULL, -- Ex: CH-2026-000001
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
    solicitante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
    categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
    servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE RESTRICT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    prioridade VARCHAR(20) DEFAULT 'NORMAL' CHECK (prioridade IN ('BAIXA', 'NORMAL', 'ALTA', 'CRITICA')),
    status VARCHAR(25) DEFAULT 'ABERTO' CHECK (status IN ('ABERTO', 'EM_ANALISE', 'AGENDADO', 'EM_ATENDIMENTO', 'RESOLVIDO', 'FINALIZADO', 'CANCELADO')),
    tecnico_responsavel_id UUID REFERENCES public.tecnicos(id) ON DELETE SET NULL,
    data_abertura TIMESTAMPTZ DEFAULT NOW(),
    data_agendamento TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    solucao TEXT,
    observacoes_internas TEXT,
    observacoes_cliente TEXT,
    tempo_atendimento_horas NUMERIC(6, 2) DEFAULT 0.00,
    valor_servico NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.7 Tabela de Histórico do Chamado (Auditoria de Eventos)
CREATE TABLE IF NOT EXISTS public.chamado_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES public.chamados(id) ON DELETE CASCADE,
    data_hora TIMESTAMPTZ DEFAULT NOW(),
    usuario_email VARCHAR(255) NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- 'CRIACAO', 'MUDANCA_STATUS', 'ATRIBUICAO', 'ATUALIZACAO_SOLUCAO', 'COMENTARIO'
    status_anterior VARCHAR(25),
    status_novo VARCHAR(25),
    descricao TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.8 Tabela de Comentários / Chat
CREATE TABLE IF NOT EXISTS public.comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES public.chamados(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
    mensagem TEXT NOT NULL,
    visibilidade VARCHAR(20) DEFAULT 'CLIENTE' CHECK (visibilidade IN ('CLIENTE', 'INTERNO')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.9 Tabela de Anexos
CREATE TABLE IF NOT EXISTS public.anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES public.chamados(id) ON DELETE CASCADE,
    arquivo_url TEXT NOT NULL,
    nome_arquivo VARCHAR(255),
    tipo_anexo VARCHAR(20) DEFAULT 'DOCUMENTO' CHECK (tipo_anexo IN ('FOTO', 'PDF', 'DOCUMENTO')),
    tamanho_bytes BIGINT,
    enviado_por VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.10 Tabela de Notícias e Comunicados
CREATE TABLE IF NOT EXISTS public.noticias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    resumo VARCHAR(500),
    imagem_url TEXT,
    autor VARCHAR(100) DEFAULT 'Equipe JRBTC-TECH',
    data_publicacao TIMESTAMPTZ DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.11 Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS public.configuracoes (
    chave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descricao TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. ÍNDICES PARA ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON public.usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_cliente_id ON public.usuarios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_chamados_cliente_id ON public.chamados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON public.chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_prioridade ON public.chamados(prioridade);
CREATE INDEX IF NOT EXISTS idx_chamados_tecnico ON public.chamados(tecnico_responsavel_id);
CREATE INDEX IF NOT EXISTS idx_chamados_data_abertura ON public.chamados(data_abertura DESC);
CREATE INDEX IF NOT EXISTS idx_chamado_historico_chamado ON public.chamado_historico(chamado_id, data_hora DESC);
CREATE INDEX IF NOT EXISTS idx_comentarios_chamado ON public.comentarios(chamado_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_anexos_chamado ON public.anexos(chamado_id);

-- ==============================================================================
-- 3. FUNÇÕES E TRIGGERS AUTOMATIZADOS
-- ==============================================================================

-- 3.1 Função para gerar número do chamado no formato CH-YYYY-000001
CREATE OR REPLACE FUNCTION public.gerar_numero_chamado()
RETURNS TRIGGER AS $$
DECLARE
    ano_atual TEXT;
    novo_num INT;
BEGIN
    IF NEW.numero_chamado IS NULL OR NEW.numero_chamado = '' THEN
        ano_atual := TO_CHAR(NOW(), 'YYYY');
        -- Obtém próximo valor de sequence
        SELECT nextval('chamado_seq_2026') INTO novo_num;
        NEW.numero_chamado := 'CH-' || ano_atual || '-' || LPAD(novo_num::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gerar_numero_chamado ON public.chamados;
CREATE TRIGGER trg_gerar_numero_chamado
BEFORE INSERT ON public.chamados
FOR EACH ROW
EXECUTE FUNCTION public.gerar_numero_chamado();

-- 3.2 Trigger para registrar histórico de auditoria automaticamente
CREATE OR REPLACE FUNCTION public.trg_auditar_chamado()
RETURNS TRIGGER AS $$
BEGIN
    -- Se for INSERT, registra a criação
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.chamado_historico (
            chamado_id, data_hora, usuario_email, tipo_evento, status_anterior, status_novo, descricao
        ) VALUES (
            NEW.id,
            NOW(),
            COALESCE(current_setting('request.jwt.claim.email', true), 'sistema@jrbtc.com.br'),
            'CRIACAO',
            NULL,
            NEW.status,
            'Chamado aberto com sucesso no sistema JRBTC-TECH com prioridade ' || NEW.prioridade
        );
        RETURN NEW;
    END IF;

    -- Se for UPDATE com mudança de status
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.chamado_historico (
            chamado_id, data_hora, usuario_email, tipo_evento, status_anterior, status_novo, descricao
        ) VALUES (
            NEW.id,
            NOW(),
            COALESCE(current_setting('request.jwt.claim.email', true), 'tecnico@jrbtc.com.br'),
            'MUDANCA_STATUS',
            OLD.status,
            NEW.status,
            'Status alterado de ' || OLD.status || ' para ' || NEW.status || 
            CASE WHEN NEW.status = 'RESOLVIDO' THEN ' (Solução Técnica Aplicada)' 
                 WHEN NEW.status = 'FINALIZADO' THEN ' (Chamado Concluído e O.S. Emitida)'
                 ELSE '' END
        );
    END IF;

    -- Se for UPDATE com atribuição de técnico
    IF (TG_OP = 'UPDATE' AND OLD.tecnico_responsavel_id IS DISTINCT FROM NEW.tecnico_responsavel_id AND NEW.tecnico_responsavel_id IS NOT NULL) THEN
        INSERT INTO public.chamado_historico (
            chamado_id, data_hora, usuario_email, tipo_evento, status_anterior, status_novo, descricao
        ) VALUES (
            NEW.id,
            NOW(),
            COALESCE(current_setting('request.jwt.claim.email', true), 'admin@jrbtc.com.br'),
            'ATRIBUICAO',
            OLD.status,
            NEW.status,
            'Técnico responsável atribuído ao atendimento.'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chamados_auditoria ON public.chamados;
CREATE TRIGGER trg_chamados_auditoria
AFTER INSERT OR UPDATE ON public.chamados
FOR EACH ROW
EXECUTE FUNCTION public.trg_auditar_chamado();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Habilita RLS em todas as tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chamados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chamado_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Helper: Obter tipo do usuário logado
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
    SELECT tipo_usuario FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: Obter cliente_id do usuário logado
CREATE OR REPLACE FUNCTION public.get_current_user_cliente_id()
RETURNS UUID AS $$
    SELECT cliente_id FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 4.1 Políticas para Categorias e Serviços (Leitura Pública para autenticados, Escrita Admin)
CREATE POLICY "Leitura de categorias para todos autenticados" ON public.categorias
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin gerencia categorias" ON public.categorias
    FOR ALL TO authenticated USING (public.get_current_user_role() = 'ADMIN');

CREATE POLICY "Leitura de serviços para todos autenticados" ON public.servicos
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin gerencia serviços" ON public.servicos
    FOR ALL TO authenticated USING (public.get_current_user_role() = 'ADMIN');

-- 4.2 Políticas para Chamados
-- ADMIN: Acesso Total
CREATE POLICY "Admin acesso total chamados" ON public.chamados
    FOR ALL TO authenticated USING (public.get_current_user_role() = 'ADMIN');

-- TECNICO: Visualiza todos os chamados ou da sua fila e atualiza
CREATE POLICY "Tecnico visualiza todos chamados" ON public.chamados
    FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('TECNICO', 'ADMIN'));

CREATE POLICY "Tecnico atualiza chamados" ON public.chamados
    FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('TECNICO', 'ADMIN'));

-- CLIENTE: Visualiza e cria apenas chamados da sua empresa
CREATE POLICY "Cliente visualiza seus proprios chamados" ON public.chamados
    FOR SELECT TO authenticated USING (
        public.get_current_user_role() = 'CLIENTE' AND cliente_id = public.get_current_user_cliente_id()
    );

CREATE POLICY "Cliente cria chamado para sua empresa" ON public.chamados
    FOR INSERT TO authenticated WITH CHECK (
        public.get_current_user_role() = 'CLIENTE' AND cliente_id = public.get_current_user_cliente_id()
    );

-- 4.3 Políticas para Comentários
CREATE POLICY "Admin e Tecnico leem todos comentarios" ON public.comentarios
    FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('ADMIN', 'TECNICO'));

CREATE POLICY "Cliente le apenas comentarios publicos do seu chamado" ON public.comentarios
    FOR SELECT TO authenticated USING (
        visibilidade = 'CLIENTE' AND EXISTS (
            SELECT 1 FROM public.chamados c 
            WHERE c.id = chamado_id AND c.cliente_id = public.get_current_user_cliente_id()
        )
    );

CREATE POLICY "Usuarios autenticados criam comentarios em seus chamados" ON public.comentarios
    FOR INSERT TO authenticated WITH CHECK (true);

-- 4.4 Políticas para Histórico de Chamados
CREATE POLICY "Visualizacao de historico" ON public.chamado_historico
    FOR SELECT TO authenticated USING (
        public.get_current_user_role() IN ('ADMIN', 'TECNICO') OR
        EXISTS (
            SELECT 1 FROM public.chamados c 
            WHERE c.id = chamado_id AND c.cliente_id = public.get_current_user_cliente_id()
        )
    );

-- 4.5 Políticas para Notícias
CREATE POLICY "Leitura de noticias para todos" ON public.noticias
    FOR SELECT TO authenticated USING (ativo = TRUE OR public.get_current_user_role() = 'ADMIN');

CREATE POLICY "Admin gerencia noticias" ON public.noticias
    FOR ALL TO authenticated USING (public.get_current_user_role() = 'ADMIN');

-- 4.6 Políticas para Configurações
CREATE POLICY "Leitura publica de configuracoes" ON public.configuracoes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin edita configuracoes" ON public.configuracoes
    FOR ALL TO authenticated USING (public.get_current_user_role() = 'ADMIN');
