-- ==============================================================================
-- JRBTC-TECH - DADOS DE SEED / CARGA INICIAL PARA O BANCO DE DADOS
-- ==============================================================================

-- 1. Configurações Iniciais do Sistema
INSERT INTO public.configuracoes (chave, valor, descricao) VALUES
('empresa_nome', 'JRBTC-TECH Soluções em TI', 'Nome oficial da empresa prestadora de serviços'),
('empresa_email_suporte', 'jrbctech@gmail.com', 'E-mail principal para notificações e atendimento'),
('empresa_telefone', '(63) 98121-3180', 'Telefone / WhatsApp central de suporte'),
('empresa_cnpj', '45.123.456/0001-89', 'CNPJ da JRBTC-TECH'),
('empresa_endereco', 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100', 'Endereço da sede'),
('sla_critica_horas', '2', 'Prazo máximo de atendimento para chamados de prioridade CRÍTICA'),
('sla_alta_horas', '8', 'Prazo máximo de atendimento para chamados de prioridade ALTA'),
('sla_normal_horas', '24', 'Prazo máximo de atendimento para chamados de prioridade NORMAL'),
('sla_baixa_horas', '48', 'Prazo máximo de atendimento para chamados de prioridade BAIXA')
ON CONFLICT (chave) DO NOTHING;

-- 2. Categorias de Atendimento
INSERT INTO public.categorias (id, nome, descricao, icone, ativo) VALUES
('11111111-1111-1111-1111-111111111101', 'Microinformática', 'Suporte a desktops, notebooks, impressoras, periféricos, formatação e softwares de escritório.', 'Monitor', TRUE),
('11111111-1111-1111-1111-111111111102', 'Infraestrutura de TI', 'Servidores, switches, roteadores, firewalls, cabeamento estruturado, Wi-Fi corporativo e VPN.', 'Server', TRUE),
('11111111-1111-1111-1111-111111111103', 'Banco de Dados', 'Administração, backup/restore, otimização de performance, replicação e modelagem de dados.', 'Database', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Catálogo de Serviços
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

-- 4. Clientes de Exemplo
INSERT INTO public.clientes (id, razao_social, nome_fantasia, cnpj, email, telefone, whatsapp, endereco, cidade, estado, cep, status) VALUES
('33333333-3333-3333-3333-333333333301', 'Alpha Contabilidade e Consultoria Ltda', 'Alpha Contábil', '12.345.678/0001-90', 'contato@alphacontabil.com.br', '(11) 3322-1100', '(11) 99887-1122', 'Rua das Flores, 500, Sala 42', 'São Paulo', 'SP', '01234-000', 'ATIVO'),
('33333333-3333-3333-3333-333333333302', 'Nexus Logística e Transportes S.A.', 'Nexus Log', '98.765.432/0001-10', 'operacoes@nexuslog.com.br', '(11) 4455-8899', '(11) 97766-3344', 'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-000', 'ATIVO'),
('33333333-3333-3333-3333-333333333303', 'Beta Engenharia e Projetos Eireli', 'Beta Engenharia', '23.456.789/0001-22', 'suporte@betaeng.com.br', '(19) 3876-5432', '(19) 99123-4567', 'Rua Engenheiro Carlos, 100', 'Campinas', 'SP', '13010-000', 'ATIVO')
ON CONFLICT (id) DO NOTHING;

-- 5. Usuários de Exemplo
INSERT INTO public.usuarios (id, nome, email, telefone, tipo_usuario, cliente_id, ativo) VALUES
-- Admin
('44444444-4444-4444-4444-444444444401', 'Diretoria JRBTC-TECH', 'admin@jrbtc.com.br', '(63) 98121-3180', 'ADMIN', NULL, TRUE),
-- Técnicos
('44444444-4444-4444-4444-444444444402', 'Carlos Silva (Especialista Redes & Infra)', 'carlos.silva@jrbtc.com.br', '(11) 97111-2233', 'TECNICO', NULL, TRUE),
('44444444-4444-4444-4444-444444444403', 'Mariana Oliveira (DBA & Sistemas)', 'mariana.oliveira@jrbtc.com.br', '(11) 97222-3344', 'TECNICO', NULL, TRUE),
-- Clientes
('44444444-4444-4444-4444-444444444404', 'Roberto Mendes (Alpha Contábil)', 'roberto@alphacontabil.com.br', '(11) 99887-1122', 'CLIENTE', '33333333-3333-3333-3333-333333333301', TRUE),
('44444444-4444-4444-4444-444444444405', 'Fernanda Lima (Nexus Log)', 'fernanda@nexuslog.com.br', '(11) 97766-3344', 'CLIENTE', '33333333-3333-3333-3333-333333333302', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 6. Técnicos
INSERT INTO public.tecnicos (id, usuario_id, nome, email, telefone, especialidades, ativo) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444402', 'Carlos Silva', 'carlos.silva@jrbtc.com.br', '(11) 97111-2233', ARRAY['Infraestrutura de TI', 'Redes & Segurança', 'Microinformática'], TRUE),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444403', 'Mariana Oliveira', 'mariana.oliveira@jrbtc.com.br', '(11) 97222-3344', ARRAY['Banco de Dados', 'PostgreSQL', 'Cloud & Backup'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Notícias e Comunicados de TI
INSERT INTO public.noticias (id, titulo, resumo, texto, imagem_url, autor, data_publicacao, ativo) VALUES
('66666666-6666-6666-6666-666666666601', 'Alerta de Segurança: Campanha de Phishing bancário ativa', 'Identificamos e-mails falsos solicitando atualização cadastral bancária com links maliciosos.', 'Recomendamos a todos os colaboradores que redobrem a atenção a remetentes desconhecidos. Nunca informem senhas ou cliquem em links suspeitos. Em caso de dúvidas, abram um chamado imediatamente para análise pela equipe JRBTC-TECH.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80', 'Segurança da Informação JRBTC', NOW() - INTERVAL '2 days', TRUE),
('66666666-6666-6666-6666-666666666602', 'Manutenção Programada em Servidores de Backup', 'Janela de manutenção preventiva no domingo das 02h às 06h da manhã.', 'Informamos aos clientes corporativos que realizaremos upgrade de capacidade no nosso cluster de armazenamento em nuvem. Não haverá impacto durante o horário comercial regular.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', 'Infraestrutura JRBTC', NOW() - INTERVAL '5 days', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Chamados de Exemplo
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
    'RESOLVIDO',
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
