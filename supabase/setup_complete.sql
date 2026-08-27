-- ==============================================================================
-- JRBTC-TECH - SCRIPT COMPLETO DE INSTALAÇÃO & SEED (EXECUTE NO SUPABASE SQL EDITOR)
-- PROJETO SUPABASE ID: mfvtzqayexkmeuhcowrk
-- ==============================================================================

-- 1. HABILITAR EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CRIAR SEQUÊNCIA DE PROTOCOLO ANUAL
CREATE SEQUENCE IF NOT EXISTS chamado_seq_2026 START 1;

-- 3. CRIAÇÃO DAS 11 TABELAS

-- 3.1 Clientes
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

-- 3.2 Usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
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

-- 3.3 Técnicos
CREATE TABLE IF NOT EXISTS public.tecnicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    especialidades TEXT[] DEFAULT '{}',
    pix_chave VARCHAR(255),
    pix_tipo VARCHAR(20) CHECK (pix_tipo IN ('CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA')),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Categorias
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(50) DEFAULT 'Wrench',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Serviços
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

-- 3.6 Chamados (Fluxo Completo: Pagamento → Aceito → A Caminho → Atendimento → Assinatura → Repasse → Finalizado)
CREATE TABLE IF NOT EXISTS public.chamados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_chamado VARCHAR(30) UNIQUE NOT NULL,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
    solicitante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
    categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
    servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE RESTRICT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    prioridade VARCHAR(20) DEFAULT 'NORMAL' CHECK (prioridade IN ('BAIXA', 'NORMAL', 'ALTA', 'CRITICA')),
    status VARCHAR(35) DEFAULT 'AGUARDANDO_PAGAMENTO' CHECK (status IN (
        'AGUARDANDO_PAGAMENTO', 'PAGO', 'ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO',
        'AGUARDANDO_ASSINATURA', 'AGUARDANDO_REPASSE', 'FINALIZADO', 'CANCELADO',
        -- Legacy (compatível com chamados antigos)
        'ABERTO', 'EM_ANALISE', 'AGENDADO', 'RESOLVIDO'
    )),
    tecnico_responsavel_id UUID REFERENCES public.tecnicos(id) ON DELETE SET NULL,

    -- Equipamento
    equipamento_marca VARCHAR(100),
    equipamento_modelo VARCHAR(150),
    equipamento_serial VARCHAR(100),

    -- Financeiro
    valor_servico NUMERIC(10, 2) DEFAULT 0.00,
    valor_pago NUMERIC(10, 2),
    status_pagamento VARCHAR(30) DEFAULT 'AGUARDANDO_PAGAMENTO' CHECK (status_pagamento IN ('AGUARDANDO_PAGAMENTO', 'PAGO', 'REPASSADO')),
    taxa_empresa NUMERIC(10, 2),   -- 30%
    valor_tecnico NUMERIC(10, 2),  -- 70%

    -- Assinatura Digital
    assinatura_cliente_url TEXT,

    -- Timestamps Operacionais
    data_abertura TIMESTAMPTZ DEFAULT NOW(),
    data_agendamento TIMESTAMPTZ,
    data_aceite_tecnico TIMESTAMPTZ,
    data_chegada_local TIMESTAMPTZ,
    data_inicio_atendimento TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,

    -- Laudo
    solucao TEXT,
    observacoes_internas TEXT,
    observacoes_cliente TEXT,
    tempo_atendimento_horas NUMERIC(6, 2) DEFAULT 0.00,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 Histórico do Chamado
CREATE TABLE IF NOT EXISTS public.chamado_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES public.chamados(id) ON DELETE CASCADE,
    data_hora TIMESTAMPTZ DEFAULT NOW(),
    usuario_email VARCHAR(255) NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    status_anterior VARCHAR(25),
    status_novo VARCHAR(25),
    descricao TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Comentários
CREATE TABLE IF NOT EXISTS public.comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES public.chamados(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
    mensagem TEXT NOT NULL,
    visibilidade VARCHAR(20) DEFAULT 'CLIENTE' CHECK (visibilidade IN ('CLIENTE', 'INTERNO')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Anexos
CREATE TABLE IF NOT EXISTS public.anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chamado_id UUID NOT NULL REFERENCES public.chamados(id) ON DELETE CASCADE,
    arquivo_url TEXT NOT NULL,
    nome_arquivo VARCHAR(255),
    tipo_anexo VARCHAR(20) DEFAULT 'DOCUMENTO' CHECK (tipo_anexo IN ('FOTO', 'PDF', 'DOCUMENTO', 'ASSINATURA', 'PROVA_EXECUCAO')),
    tamanho_bytes BIGINT,
    enviado_por VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.10 Notícias
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

-- 3.11 Configurações
CREATE TABLE IF NOT EXISTS public.configuracoes (
    chave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descricao TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ÍNDICES DE DESEMPENHO
CREATE INDEX IF NOT EXISTS idx_chamados_cliente ON public.chamados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON public.chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_prioridade ON public.chamados(prioridade);
CREATE INDEX IF NOT EXISTS idx_chamados_tecnico ON public.chamados(tecnico_responsavel_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_chamado ON public.comentarios(chamado_id);
CREATE INDEX IF NOT EXISTS idx_historico_chamado ON public.chamado_historico(chamado_id);

-- 5. TRIGGER DE GERAÇÃO DE NÚMERO DE PROTOCOLO
CREATE OR REPLACE FUNCTION public.gerar_numero_chamado()
RETURNS TRIGGER AS $$
DECLARE
    ano_atual TEXT;
    novo_num INT;
BEGIN
    IF NEW.numero_chamado IS NULL OR NEW.numero_chamado = '' THEN
        ano_atual := TO_CHAR(NOW(), 'YYYY');
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

-- 6. PERMISSÕES PARA ROLES DO SUPABASE (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 7. POLÍTICAS DE RLS (HABILITAÇÃO FLEXÍVEL)
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

-- Políticas de Leitura e Escrita Públicas/Autenticadas
CREATE POLICY "Acesso completo categorias" ON public.categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo servicos" ON public.servicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo usuarios" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo tecnicos" ON public.tecnicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo chamados" ON public.chamados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo historico" ON public.chamado_historico FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo comentarios" ON public.comentarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo anexos" ON public.anexos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo noticias" ON public.noticias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo configuracoes" ON public.configuracoes FOR ALL USING (true) WITH CHECK (true);

-- 8. CARGA INICIAL DE DADOS (SEED DATA)

-- Configurações
INSERT INTO public.configuracoes (chave, valor, descricao) VALUES
('empresa_nome', 'JRBTC-TECH Soluções em TI', 'Razão social oficial'),
('empresa_email_suporte', 'jrbctech@gmail.com', 'E-mail oficial para notificações e atendimento'),
('empresa_telefone', '(63) 98121-3180', 'Telefone / WhatsApp central de suporte'),
('empresa_cnpj', '45.123.456/0001-89', 'CNPJ da JRBTC-TECH'),
('empresa_endereco', 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP', 'Sede corporativa'),
('sla_critica_horas', '2', 'SLA Crítica'),
('sla_alta_horas', '8', 'SLA Alta'),
('sla_normal_horas', '24', 'SLA Normal'),
('sla_baixa_horas', '48', 'SLA Baixa')
ON CONFLICT (chave) DO NOTHING;

-- Categorias de Especialidade TI
INSERT INTO public.categorias (id, nome, descricao, icone, ativo) VALUES
('11111111-1111-1111-1111-111111111101', 'Microinformática', 'Suporte a desktops, notebooks, impressoras, formatação, hardware e periféricos.', 'Monitor', TRUE),
('11111111-1111-1111-1111-111111111102', 'Infraestrutura de TI', 'Servidores, switches, roteadores, firewalls, cabeamento estruturado, Wi-Fi corporativo e VPN.', 'Server', TRUE),
('11111111-1111-1111-1111-111111111103', 'Banco de Dados', 'Administração, backup/restore em nuvem, otimização de queries, replicação e modelagem PostgreSQL/MySQL.', 'Database', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Catálogo de Serviços
INSERT INTO public.servicos (id, categoria_id, nome_servico, descricao, sla_horas, valor_estimado, ativo) VALUES
-- Microinformática
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Formatação e Instalação de SO', 'Instalação limpa do Windows/Linux com drivers, suíte Office e antivírus configurado.', 8, 180.00, TRUE),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Upgrade de Hardware (SSD / RAM)', 'Substituição de componentes físicos, clonagem de disco e testes de stress.', 4, 150.00, TRUE),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'Remoção de Malwares e Otimização', 'Varredura avançada contra vírus/trojans, limpeza de temporários e otimização de inicialização.', 6, 120.00, TRUE),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111101', 'Configuração de Impressora / Rede', 'Instalação de drivers em rede, mapeamento em estações de trabalho e testes de impressão.', 4, 90.00, TRUE),

-- Infraestrutura de TI
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111102', 'Configuração de Firewall e VPN', 'Configuração de regras de tráfego, VPN para home-office seguro e bloqueios de ameaças.', 12, 350.00, TRUE),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111102', 'Manutenção em Servidor Local/Nuvem', 'Checagem de logs, aplicação de patches de segurança e balanceamento de carga.', 24, 450.00, TRUE),
('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111102', 'Diagnóstico de Conectividade e Wi-Fi', 'Análise de cobertura Wi-Fi corporativo, troca de pontos de rede e certificação de cabos.', 8, 220.00, TRUE),

-- Banco de Dados
('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111103', 'Rotina de Backup Automatizado', 'Implementação de rotinas de backup full e incremental com envio seguro para a nuvem.', 12, 300.00, TRUE),
('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111103', 'Otimização de Performance e Queries', 'Análise de slow query logs, criação de índices estratégicos e ajuste de buffers no PostgreSQL/MySQL.', 16, 500.00, TRUE),
('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111103', 'Recuperação de Desastre (Disaster Recovery)', 'Restauração emergencial de base corrompida e validação de consistência transacional.', 4, 800.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Clientes
INSERT INTO public.clientes (id, razao_social, nome_fantasia, cnpj, email, telefone, whatsapp, endereco, cidade, estado, cep, status) VALUES
('33333333-3333-3333-3333-333333333301', 'Alpha Contabilidade e Consultoria Ltda', 'Alpha Contábil', '12.345.678/0001-90', 'contato@alphacontabil.com.br', '(11) 3322-1100', '(11) 99887-1122', 'Rua das Flores, 500, Sala 42', 'São Paulo', 'SP', '01234-000', 'ATIVO'),
('33333333-3333-3333-3333-333333333302', 'Nexus Logística e Transportes S.A.', 'Nexus Log', '98.765.432/0001-10', 'operacoes@nexuslog.com.br', '(11) 4455-8899', '(11) 97766-3344', 'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-000', 'ATIVO'),
('33333333-3333-3333-3333-333333333303', 'Beta Engenharia e Projetos Eireli', 'Beta Engenharia', '23.456.789/0001-22', 'suporte@betaeng.com.br', '(19) 3876-5432', '(19) 99123-4567', 'Rua Engenheiro Carlos, 100', 'Campinas', 'SP', '13010-000', 'ATIVO')
ON CONFLICT (id) DO NOTHING;

-- Usuários
INSERT INTO public.usuarios (id, nome, email, telefone, tipo_usuario, cliente_id, ativo) VALUES
('44444444-4444-4444-4444-444444444401', 'Diretoria JRBTC-TECH (Admin)', 'admin@jrbtc.com.br', '(63) 98121-3180', 'ADMIN', NULL, TRUE),
('44444444-4444-4444-4444-444444444402', 'Carlos Silva (Técnico Infra)', 'carlos.silva@jrbtc.com.br', '(11) 97111-2233', 'TECNICO', NULL, TRUE),
('44444444-4444-4444-4444-444444444403', 'Mariana Oliveira (DBA)', 'mariana.oliveira@jrbtc.com.br', '(11) 97222-3344', 'TECNICO', NULL, TRUE),
('44444444-4444-4444-4444-444444444404', 'Roberto Mendes (Alpha Contábil)', 'roberto@alphacontabil.com.br', '(11) 99887-1122', 'CLIENTE', '33333333-3333-3333-3333-333333333301', TRUE),
('44444444-4444-4444-4444-444444444405', 'Fernanda Lima (Nexus Log)', 'fernanda@nexuslog.com.br', '(11) 97766-3344', 'CLIENTE', '33333333-3333-3333-3333-333333333302', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Técnicos
INSERT INTO public.tecnicos (id, usuario_id, nome, email, telefone, especialidades, ativo) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444402', 'Carlos Silva', 'carlos.silva@jrbtc.com.br', '(11) 97111-2233', ARRAY['Infraestrutura de TI', 'Redes & Segurança', 'Microinformática'], TRUE),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444403', 'Mariana Oliveira', 'mariana.oliveira@jrbtc.com.br', '(11) 97222-3344', ARRAY['Banco de Dados', 'PostgreSQL', 'Cloud & Backup'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- Notícias
INSERT INTO public.noticias (id, titulo, resumo, texto, imagem_url, autor, data_publicacao, ativo) VALUES
('66666666-6666-6666-6666-666666666601', 'Alerta de Segurança: Campanha de Phishing bancário ativa', 'Identificamos e-mails falsos solicitando atualização cadastral bancária com links maliciosos.', 'Recomendamos a todos os colaboradores que redobrem a atenção a remetentes desconhecidos. Nunca informem senhas ou cliquem em links suspeitos. Em caso de dúvidas, abram um chamado imediatamente para análise pela equipe JRBTC-TECH.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', 'Segurança da Informação JRBTC', NOW() - INTERVAL '2 days', TRUE),
('66666666-6666-6666-6666-666666666602', 'Manutenção Programada em Servidores de Backup', 'Janela de manutenção preventiva no domingo das 02h às 06h da manhã.', 'Informamos aos clientes corporativos que realizaremos upgrade de capacidade no nosso cluster de armazenamento em nuvem. Não haverá impacto durante o horário comercial regular.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'Infraestrutura JRBTC', NOW() - INTERVAL '5 days', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Chamados Iniciais
INSERT INTO public.chamados (
    id, numero_chamado, cliente_id, solicitante_id, categoria_id, servico_id,
    titulo, descricao, prioridade, status, tecnico_responsavel_id,
    data_abertura, data_conclusao, solucao, observacoes_internas, observacoes_cliente,
    tempo_atendimento_horas, valor_servico
) VALUES
(
    '77777777-7777-7777-7777-777777777701',
    'CH-2026-000001',
    '33333333-3333-3333-3333-333333333301',
    '44444444-4444-4444-4444-444444444404',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222205',
    'Queda de conexão VPN da filial São Paulo',
    'Os funcionários do setor fiscal não conseguem conectar na VPN do escritório para emitir notas fiscais desde as 08:30.',
    'CRITICA',
    'EM_ATENDIMENTO',
    '55555555-5555-5555-5555-555555555501',
    NOW() - INTERVAL '3 hours',
    NULL,
    NULL,
    'Identificado travamento no gateway IPsec após oscilação no link de fibra da operadora.',
    'Técnico Carlos está atuando no reinício seguro e reconfiguração das rotas.',
    1.5,
    350.00
),
(
    '77777777-7777-7777-7777-777777777702',
    'CH-2026-000002',
    '33333333-3333-3333-3333-333333333301',
    '44444444-4444-4444-4444-444444444404',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222202',
    'Computador da recepção extremamente lento e travando',
    'Notebook Dell Inspiron da recepção demora mais de 10 minutos para iniciar o Windows e abrir o ERP.',
    'NORMAL',
    'FINALIZADO',
    '55555555-5555-5555-5555-555555555501',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '4 hours',
    'Realizada substituição de HD mecânico com defeito de setores por SSD Kingston NVMe de 500GB, clonagem do sistema e limpeza física do cooler. Sistema iniciando em 9 segundos.',
    'Cliente autorizou a troca do SSD no valor de R$ 220 + mão de obra.',
    'Equipamento testado e entregue em perfeito funcionamento na recepção.',
    2.5,
    370.00
),
(
    '77777777-7777-7777-7777-777777777703',
    'CH-2026-000003',
    '33333333-3333-3333-3333-333333333302',
    '44444444-4444-4444-4444-444444444405',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222208',
    'Configuração de Rotina de Backup em Nuvem para Banco PostgreSQL',
    'Necessitamos configurar rotina diária às 23:00 com compactação e upload para bucket com retenção de 30 dias.',
    'ALTA',
    'ABERTO',
    NULL,
    NOW() - INTERVAL '1 day',
    NULL,
    NULL,
    NULL,
    NULL,
    0.0,
    300.00
)
ON CONFLICT (id) DO NOTHING;
