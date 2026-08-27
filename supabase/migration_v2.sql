-- ==============================================================================
-- JRBTC-TECH - MIGRAÇÃO V2 (ADICIONAR NOVOS CAMPOS SE AS TABELAS JÁ EXISTIREM)
-- ==============================================================================

-- 1. TÉCNICOS: Adicionar campos de PIX
ALTER TABLE public.tecnicos 
ADD COLUMN IF NOT EXISTS pix_chave VARCHAR(255),
ADD COLUMN IF NOT EXISTS pix_tipo VARCHAR(20) CHECK (pix_tipo IN ('CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'ALEATORIA'));

-- 2. CHAMADOS: Atualizar constraint de status
-- Remove a constraint antiga (pode falhar se o nome for diferente, mas o Supabase costuma nomear como chamados_status_check)
ALTER TABLE public.chamados DROP CONSTRAINT IF EXISTS chamados_status_check;
ALTER TABLE public.chamados ADD CONSTRAINT chamados_status_check CHECK (status IN (
    'AGUARDANDO_PAGAMENTO', 'PAGO', 'ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO',
    'AGUARDANDO_ASSINATURA', 'AGUARDANDO_REPASSE', 'FINALIZADO', 'CANCELADO',
    -- Legacy (compatível com chamados antigos)
    'ABERTO', 'EM_ANALISE', 'AGENDADO', 'RESOLVIDO'
));

-- 3. CHAMADOS: Adicionar Equipamento
ALTER TABLE public.chamados 
ADD COLUMN IF NOT EXISTS equipamento_marca VARCHAR(100),
ADD COLUMN IF NOT EXISTS equipamento_modelo VARCHAR(150),
ADD COLUMN IF NOT EXISTS equipamento_serial VARCHAR(100);

-- 4. CHAMADOS: Adicionar Financeiro
ALTER TABLE public.chamados 
ADD COLUMN IF NOT EXISTS valor_pago NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS status_pagamento VARCHAR(30) DEFAULT 'AGUARDANDO_PAGAMENTO' CHECK (status_pagamento IN ('AGUARDANDO_PAGAMENTO', 'PAGO', 'REPASSADO')),
ADD COLUMN IF NOT EXISTS taxa_empresa NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS valor_tecnico NUMERIC(10, 2);

-- 5. CHAMADOS: Adicionar Assinatura
ALTER TABLE public.chamados 
ADD COLUMN IF NOT EXISTS assinatura_cliente_url TEXT;

-- 6. CHAMADOS: Adicionar Timestamps Operacionais
ALTER TABLE public.chamados 
ADD COLUMN IF NOT EXISTS data_agendamento TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_aceite_tecnico TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_chegada_local TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS data_inicio_atendimento TIMESTAMPTZ;
