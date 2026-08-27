'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Chamado, Cliente, Tecnico, Categoria, Servico, Noticia, Configuracao,
  TicketStatus, TicketPriority, CommentVisibility, AttachmentType,
  ChamadoHistorico, Comentario, Anexo
} from '@/types/database.types';
import {
  MOCK_CHAMADOS, MOCK_CLIENTES, MOCK_TECNICOS, MOCK_CATEGORIAS,
  MOCK_SERVICOS, MOCK_NOTICIAS, MOCK_CONFIGURACOES
} from '@/lib/mockData';
import { useAuth } from './AuthContext';
import { sendEmailNotification } from '@/lib/emailService';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { calcularComissao } from '@/lib/utils';

interface CreateTicketData {
  cliente_id: string;
  categoria_id: string;
  servico_id: string;
  titulo: string;
  descricao: string;
  prioridade: TicketPriority;
  equipamento_marca?: string;
  equipamento_modelo?: string;
  equipamento_serial?: string;
  valor_servico?: number;
  anexos?: { url: string; nome: string; tipo: AttachmentType; tamanho?: number }[];
}

interface TicketContextType {
  chamados: Chamado[];
  clientes: Cliente[];
  tecnicos: Tecnico[];
  categorias: Categoria[];
  servicos: Servico[];
  noticias: Noticia[];
  configuracoes: Configuracao[];
  isLoading: boolean;

  // Fluxo Principal do Chamado
  createChamado: (data: CreateTicketData) => Promise<Chamado>;
  pagarChamado: (chamadoId: string) => Promise<void>;
  aceitarChamado: (chamadoId: string) => Promise<void>;
  aCaminho: (chamadoId: string) => Promise<void>;
  chegouLocal: (chamadoId: string) => Promise<void>;
  finalizarAtendimento: (chamadoId: string, solucao: string, tempoHoras: number, obsInternas?: string, obsCliente?: string) => Promise<void>;
  assinarOS: (chamadoId: string, assinaturaUrl: string) => Promise<void>;
  confirmarRepasse: (chamadoId: string) => Promise<void>;

  // Ações Gerais
  updateChamadoStatus: (chamadoId: string, novoStatus: TicketStatus, observacao?: string) => Promise<void>;
  assignTecnico: (chamadoId: string, tecnicoId: string | null) => Promise<void>;
  addComentario: (chamadoId: string, mensagem: string, visibilidade: CommentVisibility) => Promise<void>;
  addAnexo: (chamadoId: string, anexo: Omit<Anexo, 'id' | 'created_at'>) => Promise<void>;
  finalizeChamado: (chamadoId: string, solucao: string, tempoHoras: number, valorServico: number, obsInternas?: string, obsCliente?: string) => Promise<void>;

  // Ações Administrativas
  createCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCliente: (id: string, dados: Partial<Cliente>) => Promise<void>;
  createTecnico: (tecnico: Omit<Tecnico, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTecnico: (id: string, dados: Partial<Tecnico>) => Promise<void>;
  createServico: (servico: Omit<Servico, 'id' | 'created_at'>) => Promise<void>;
  updateServico: (id: string, dados: Partial<Servico>) => Promise<void>;
  createNoticia: (noticia: Omit<Noticia, 'id' | 'created_at'>) => Promise<void>;
  updateConfiguracao: (chave: string, valor: string) => Promise<void>;

  // Getters
  getChamadoById: (id: string) => Chamado | undefined;
  getFilteredChamados: () => Chamado[];
  refreshData: () => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>(MOCK_TECNICOS);
  const [categorias, setCategorias] = useState<Categoria[]>(MOCK_CATEGORIAS);
  const [servicos, setServicos] = useState<Servico[]>(MOCK_SERVICOS);
  const [noticias, setNoticias] = useState<Noticia[]>(MOCK_NOTICIAS);
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>(MOCK_CONFIGURACOES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        // Dados públicos sempre
        const [resCategorias, resServicos, resNoticias, resConfig] = await Promise.all([
          supabase.from('categorias').select('*').order('nome'),
          supabase.from('servicos').select('*').order('nome_servico'),
          supabase.from('noticias').select('*').order('data_publicacao', { ascending: false }),
          supabase.from('configuracoes').select('*'),
        ]);

        if (resCategorias.data?.length) setCategorias(resCategorias.data);
        if (resServicos.data?.length) setServicos(resServicos.data);
        if (resNoticias.data?.length) setNoticias(resNoticias.data);
        if (resConfig.data?.length) setConfiguracoes(resConfig.data);

        // Dados protegidos apenas se logado
        if (user) {
          const [resChamados, resClientes, resTecnicos] = await Promise.all([
            supabase.from('chamados').select(`*, cliente:clientes(*), solicitante:usuarios(*), categoria:categorias(*), servico:servicos(*), tecnico_responsavel:tecnicos(*), historico:chamado_historico(*), comentarios:comentarios(*, usuario:usuarios(*)), anexos:anexos(*)`).order('data_abertura', { ascending: false }),
            supabase.from('clientes').select('*').order('nome_fantasia'),
            supabase.from('tecnicos').select('*, usuario:usuarios(*)').order('nome'),
          ]);

          if (resClientes.data?.length) setClientes(resClientes.data);
          if (resTecnicos.data?.length) setTecnicos(resTecnicos.data);
          setChamados(resChamados.data?.length ? (resChamados.data as any) : MOCK_CHAMADOS);
        } else {
          setChamados([]);
          setClientes([]);
          setTecnicos([]);
        }
      } else {
        const saved = localStorage.getItem('jrbtc_chamados');
        setChamados(saved ? JSON.parse(saved) : MOCK_CHAMADOS);
        const sc = localStorage.getItem('jrbtc_clientes'); if (sc) setClientes(JSON.parse(sc));
        const st = localStorage.getItem('jrbtc_tecnicos'); if (st) setTecnicos(JSON.parse(st));
        const ss = localStorage.getItem('jrbtc_servicos'); if (ss) setServicos(JSON.parse(ss));
        const sn = localStorage.getItem('jrbtc_noticias'); if (sn) setNoticias(JSON.parse(sn));
      }
    } catch (err) {
      console.error('[JRBTC] Erro ao carregar dados:', err);
      setChamados(MOCK_CHAMADOS);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const persistChamados = (updated: Chamado[]) => {
    setChamados(updated);
    if (!isSupabaseConfigured()) localStorage.setItem('jrbtc_chamados', JSON.stringify(updated));
  };

  // Helper: atualiza chamado localmente e no Supabase
  const updateChamadoFields = async (chamadoId: string, fields: Partial<Chamado>, histDesc: string, histStatus?: TicketStatus) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('chamados').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', chamadoId);
        if (histStatus) {
          await supabase.from('chamado_historico').insert({
            chamado_id: chamadoId,
            data_hora: new Date().toISOString(),
            usuario_email: user?.email || 'sistema@jrbtc.com.br',
            tipo_evento: 'MUDANCA_STATUS',
            status_novo: histStatus,
            descricao: histDesc,
          });
        }
      } catch (err) { console.warn('[JRBTC] Supabase update error:', err); }
    }

    const updated = chamados.map(c => {
      if (c.id !== chamadoId) return c;
      const histEntry: ChamadoHistorico | null = histStatus ? {
        id: 'h-' + Date.now(),
        chamado_id: chamadoId,
        data_hora: new Date().toISOString(),
        usuario_email: user?.email || 'sistema@jrbtc.com.br',
        tipo_evento: 'MUDANCA_STATUS',
        status_anterior: c.status,
        status_novo: histStatus,
        descricao: histDesc,
      } : null;
      return {
        ...c, ...fields, updated_at: new Date().toISOString(),
        historico: histEntry ? [histEntry, ...(c.historico || [])] : c.historico,
      };
    });
    persistChamados(updated);
  };

  // 1. Criar Chamado (Status inicial: AGUARDANDO_PAGAMENTO)
  const createChamado = async (data: CreateTicketData): Promise<Chamado> => {
    const year = new Date().getFullYear();
    const count = chamados.length + 1;
    const protocolNumber = `CH-${year}-${String(count).padStart(6, '0')}`;
    const categoriaObj = categorias.find(c => c.id === data.categoria_id);
    const servicoObj = servicos.find(s => s.id === data.servico_id);
    const clienteObj = clientes.find(c => c.id === data.cliente_id);
    const valorServico = data.valor_servico || servicoObj?.valor_estimado || 0;
    const { taxaEmpresa, valorTecnico } = calcularComissao(valorServico);

    let newTicket: Chamado = {
      id: 'ch-' + Date.now(),
      numero_chamado: protocolNumber,
      cliente_id: data.cliente_id,
      solicitante_id: user?.id || '44444444-4444-4444-4444-444444444404',
      categoria_id: data.categoria_id,
      servico_id: data.servico_id,
      titulo: data.titulo,
      descricao: data.descricao,
      prioridade: data.prioridade,
      status: 'AGUARDANDO_PAGAMENTO',
      tecnico_responsavel_id: null,
      equipamento_marca: data.equipamento_marca,
      equipamento_modelo: data.equipamento_modelo,
      equipamento_serial: data.equipamento_serial,
      valor_servico: valorServico,
      valor_pago: null,
      status_pagamento: 'AGUARDANDO_PAGAMENTO',
      taxa_empresa: taxaEmpresa,
      valor_tecnico: valorTecnico,
      data_abertura: new Date().toISOString(),
      cliente: clienteObj, solicitante: user, categoria: categoriaObj, servico: servicoObj,
      tecnico_responsavel: null, historico: [], comentarios: [],
      anexos: (data.anexos || []).map((a, idx) => ({
        id: 'anx-' + Date.now() + idx, chamado_id: 'ch-' + Date.now(),
        arquivo_url: a.url, nome_arquivo: a.nome, tipo_anexo: a.tipo, tamanho_bytes: a.tamanho,
        enviado_por: user?.nome || 'Solicitante', created_at: new Date().toISOString(),
      })),
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data: dbTicket } = await supabase.from('chamados').insert({
          numero_chamado: protocolNumber, cliente_id: data.cliente_id,
          solicitante_id: user?.id, categoria_id: data.categoria_id, servico_id: data.servico_id,
          titulo: data.titulo, descricao: data.descricao, prioridade: data.prioridade,
          status: 'AGUARDANDO_PAGAMENTO', valor_servico: valorServico,
          equipamento_marca: data.equipamento_marca, equipamento_modelo: data.equipamento_modelo,
          equipamento_serial: data.equipamento_serial,
          status_pagamento: 'AGUARDANDO_PAGAMENTO', taxa_empresa: taxaEmpresa, valor_tecnico: valorTecnico,
        }).select().single();
        if (dbTicket) newTicket.id = dbTicket.id;
      } catch (err) { console.warn('[JRBTC] create chamado error:', err); }
    }

    persistChamados([newTicket, ...chamados]);
    return newTicket;
  };

  // 2. Confirmar Pagamento PIX → Status PAGO
  const pagarChamado = async (chamadoId: string) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado) return;
    const valorPago = chamado.valor_servico;
    await updateChamadoFields(chamadoId, {
      status: 'PAGO', status_pagamento: 'PAGO', valor_pago: valorPago,
    }, `Pagamento de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPago)} confirmado via PIX. Chamado liberado para fila de técnicos.`, 'PAGO');

    // Notificar admin
    sendEmailNotification({
      to: 'jrbctech@gmail.com',
      subject: `[JRBTC-TECH] ✅ Novo Chamado PAGO na Fila: ${chamado.numero_chamado}`,
      tipo: 'ABERTURA_CHAMADO', chamado: { ...chamado, status: 'PAGO' },
      cliente: clientes.find(c => c.id === chamado.cliente_id),
    });
  };

  // 3. Técnico Aceita o Chamado
  const aceitarChamado = async (chamadoId: string) => {
    const tecnico = tecnicos.find(t => t.email.toLowerCase() === user?.email.toLowerCase()) || tecnicos[0];
    await updateChamadoFields(chamadoId, {
      status: 'ACEITO', tecnico_responsavel_id: tecnico?.id,
      tecnico_responsavel: tecnico, data_aceite_tecnico: new Date().toISOString(),
    }, `Chamado aceito pelo técnico ${tecnico?.nome || user?.nome}. Preparando deslocamento.`, 'ACEITO');
  };

  // 4. Técnico a Caminho
  const aCaminho = async (chamadoId: string) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    await updateChamadoFields(chamadoId, { status: 'A_CAMINHO' },
      `Técnico ${user?.nome} está em deslocamento ao local do atendimento.`, 'A_CAMINHO');
    if (chamado) {
      sendEmailNotification({
        to: clientes.find(c => c.id === chamado.cliente_id)?.email || 'jrbctech@gmail.com',
        subject: `[JRBTC-TECH] 🚗 Técnico a Caminho — Chamado ${chamado.numero_chamado}`,
        tipo: 'NOVO_COMENTARIO', chamado: { ...chamado, status: 'A_CAMINHO' },
        cliente: clientes.find(c => c.id === chamado.cliente_id),
      });
    }
  };

  // 5. Técnico Chegou ao Local / Inicia Atendimento
  const chegouLocal = async (chamadoId: string) => {
    await updateChamadoFields(chamadoId, {
      status: 'EM_ATENDIMENTO',
      data_chegada_local: new Date().toISOString(),
      data_inicio_atendimento: new Date().toISOString(),
    }, `Técnico ${user?.nome} chegou ao local e iniciou o atendimento. Cronômetro iniciado.`, 'EM_ATENDIMENTO');
  };

  // 6. Técnico Finaliza o Atendimento → Aguarda Assinatura do Cliente
  const finalizarAtendimento = async (chamadoId: string, solucao: string, tempoHoras: number, obsInternas?: string, obsCliente?: string) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado) return;
    await updateChamadoFields(chamadoId, {
      status: 'AGUARDANDO_ASSINATURA', solucao, tempo_atendimento_horas: tempoHoras,
      observacoes_internas: obsInternas, observacoes_cliente: obsCliente,
      data_conclusao: new Date().toISOString(),
    }, `Atendimento concluído pelo técnico ${user?.nome}. Laudo técnico registrado. Aguardando assinatura do cliente na Ordem de Serviço.`, 'AGUARDANDO_ASSINATURA');

    // Notificar cliente para assinar
    sendEmailNotification({
      to: clientes.find(c => c.id === chamado.cliente_id)?.email || 'jrbctech@gmail.com',
      subject: `[JRBTC-TECH] ✍️ Assine a Ordem de Serviço — Chamado ${chamado.numero_chamado}`,
      tipo: 'CONCLUSAO_CHAMADO', chamado: { ...chamado, status: 'AGUARDANDO_ASSINATURA', solucao },
      cliente: clientes.find(c => c.id === chamado.cliente_id),
    });
  };

  // 7. Cliente Assina a O.S. → Libera para Repasse Admin
  const assinarOS = async (chamadoId: string, assinaturaUrl: string) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    await updateChamadoFields(chamadoId, {
      status: 'AGUARDANDO_REPASSE', assinatura_cliente_url: assinaturaUrl,
    }, `Ordem de Serviço assinada pelo cliente. Aguardando confirmação de repasse ao técnico pelo administrador JRBTC-TECH.`, 'AGUARDANDO_REPASSE');

    // Notificar admin sobre repasse pendente
    if (chamado) {
      sendEmailNotification({
        to: 'jrbctech@gmail.com',
        subject: `[JRBTC-TECH] 💰 Repasse Pendente ao Técnico — Chamado ${chamado.numero_chamado}`,
        tipo: 'CONCLUSAO_CHAMADO', chamado: { ...chamado, status: 'AGUARDANDO_REPASSE' },
        cliente: clientes.find(c => c.id === chamado.cliente_id),
      });
    }
  };

  // 8. Admin Confirma Repasse 70% ao Técnico → Finaliza
  const confirmarRepasse = async (chamadoId: string) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    const valorTecnico = chamado?.valor_tecnico || 0;
    await updateChamadoFields(chamadoId, {
      status: 'FINALIZADO', status_pagamento: 'REPASSADO',
    }, `Repasse de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTecnico)} (70%) confirmado pelo administrador JRBTC-TECH. Chamado encerrado com sucesso.`, 'FINALIZADO');
  };

  // Atualizar status genérico (Admin / legado)
  const updateChamadoStatus = async (chamadoId: string, novoStatus: TicketStatus, observacao?: string) => {
    await updateChamadoFields(chamadoId, { status: novoStatus }, observacao || `Status alterado para ${novoStatus} por ${user?.nome}.`, novoStatus);
  };

  // Atribuir Técnico
  const assignTecnico = async (chamadoId: string, tecnicoId: string | null) => {
    const targetTecnico = tecnicos.find(t => t.id === tecnicoId) || null;
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('chamados').update({ tecnico_responsavel_id: tecnicoId, updated_at: new Date().toISOString() }).eq('id', chamadoId);
      } catch (err) { console.warn(err); }
    }
    const updated = chamados.map(c => c.id === chamadoId
      ? { ...c, tecnico_responsavel_id: tecnicoId, tecnico_responsavel: targetTecnico, updated_at: new Date().toISOString() }
      : c);
    persistChamados(updated);
  };

  // Adicionar Comentário
  const addComentario = async (chamadoId: string, mensagem: string, visibilidade: CommentVisibility) => {
    const newComment: Comentario = {
      id: 'c-' + Date.now(), chamado_id: chamadoId, usuario_id: user?.id || '',
      mensagem, visibilidade, created_at: new Date().toISOString(), usuario: user,
    };
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('comentarios').insert({ chamado_id: chamadoId, usuario_id: user?.id, mensagem, visibilidade }).select().single();
        if (data) newComment.id = data.id;
      } catch (err) { console.warn(err); }
    }
    const updated = chamados.map(c => c.id === chamadoId
      ? { ...c, comentarios: [...(c.comentarios || []), newComment] }
      : c);
    persistChamados(updated);
  };

  // Adicionar Anexo
  const addAnexo = async (chamadoId: string, anexoData: Omit<Anexo, 'id' | 'created_at'>) => {
    const newAnexo: Anexo = { ...anexoData, id: 'anx-' + Date.now(), created_at: new Date().toISOString() };
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('anexos').insert({ ...anexoData, chamado_id: chamadoId }).select().single();
        if (data) newAnexo.id = data.id;
      } catch (err) { console.warn(err); }
    }
    const updated = chamados.map(c => c.id === chamadoId
      ? { ...c, anexos: [...(c.anexos || []), newAnexo] }
      : c);
    persistChamados(updated);
  };

  // Legado: Finalizar chamado (Admin)
  const finalizeChamado = async (chamadoId: string, solucao: string, tempoHoras: number, valorServico: number, obsInternas?: string, obsCliente?: string) => {
    const { taxaEmpresa, valorTecnico } = calcularComissao(valorServico);
    await updateChamadoFields(chamadoId, {
      status: 'FINALIZADO', solucao, tempo_atendimento_horas: tempoHoras, valor_servico: valorServico,
      observacoes_internas: obsInternas, observacoes_cliente: obsCliente,
      data_conclusao: new Date().toISOString(), taxa_empresa: taxaEmpresa, valor_tecnico: valorTecnico,
      status_pagamento: 'REPASSADO',
    }, `Chamado encerrado manualmente pelo administrador. Laudo: ${solucao.slice(0, 80)}...`, 'FINALIZADO');
  };

  // CRUD Administrativo
  const createCliente = async (novo: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    let item: Cliente = { ...novo, id: 'cli-' + Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (isSupabaseConfigured()) { try { const { data } = await supabase.from('clientes').insert(novo).select().single(); if (data) item = data; } catch (err) { console.warn(err); } }
    const updated = [...clientes, item]; setClientes(updated); localStorage.setItem('jrbtc_clientes', JSON.stringify(updated));
  };

  const updateCliente = async (id: string, dados: Partial<Cliente>) => {
    if (isSupabaseConfigured()) { try { await supabase.from('clientes').update(dados).eq('id', id); } catch (err) { console.warn(err); } }
    const updated = clientes.map(c => c.id === id ? { ...c, ...dados } : c); setClientes(updated); localStorage.setItem('jrbtc_clientes', JSON.stringify(updated));
  };

  const createTecnico = async (novo: Omit<Tecnico, 'id' | 'created_at' | 'updated_at'>) => {
    let item: Tecnico = { ...novo, id: 'tec-' + Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (isSupabaseConfigured()) { try { const { data } = await supabase.from('tecnicos').insert(novo).select().single(); if (data) item = data; } catch (err) { console.warn(err); } }
    const updated = [...tecnicos, item]; setTecnicos(updated); localStorage.setItem('jrbtc_tecnicos', JSON.stringify(updated));
  };

  const updateTecnico = async (id: string, dados: Partial<Tecnico>) => {
    if (isSupabaseConfigured()) { try { await supabase.from('tecnicos').update(dados).eq('id', id); } catch (err) { console.warn(err); } }
    const updated = tecnicos.map(t => t.id === id ? { ...t, ...dados } : t); setTecnicos(updated); localStorage.setItem('jrbtc_tecnicos', JSON.stringify(updated));
  };

  const createServico = async (novo: Omit<Servico, 'id' | 'created_at'>) => {
    let item: Servico = { ...novo, id: 'srv-' + Date.now(), created_at: new Date().toISOString() };
    if (isSupabaseConfigured()) { try { const { data } = await supabase.from('servicos').insert(novo).select().single(); if (data) item = data; } catch (err) { console.warn(err); } }
    const updated = [...servicos, item]; setServicos(updated); localStorage.setItem('jrbtc_servicos', JSON.stringify(updated));
  };

  const updateServico = async (id: string, dados: Partial<Servico>) => {
    if (isSupabaseConfigured()) { try { await supabase.from('servicos').update(dados).eq('id', id); } catch (err) { console.warn(err); } }
    const updated = servicos.map(s => s.id === id ? { ...s, ...dados } : s); setServicos(updated);
  };

  const createNoticia = async (novo: Omit<Noticia, 'id' | 'created_at'>) => {
    let item: Noticia = { ...novo, id: 'not-' + Date.now(), created_at: new Date().toISOString() };
    if (isSupabaseConfigured()) { try { const { data } = await supabase.from('noticias').insert(novo).select().single(); if (data) item = data; } catch (err) { console.warn(err); } }
    const updated = [item, ...noticias]; setNoticias(updated);
  };

  const updateConfiguracao = async (chave: string, valor: string) => {
    if (isSupabaseConfigured()) { try { await supabase.from('configuracoes').upsert({ chave, valor }); } catch (err) { console.warn(err); } }
    const updated = configuracoes.map(c => c.chave === chave ? { ...c, valor } : c); setConfiguracoes(updated);
  };

  const getChamadoById = (id: string) => chamados.find(c => c.id === id || c.numero_chamado === id);

  const getFilteredChamados = () => {
    if (role === 'ADMIN') return chamados;
    if (role === 'TECNICO') {
      const tecnicoObj = tecnicos.find(t => t.email.toLowerCase() === user?.email.toLowerCase());
      return chamados.filter(c => c.status === 'PAGO' || (tecnicoObj && c.tecnico_responsavel_id === tecnicoObj.id));
    }
    return chamados.filter(c => c.cliente_id === user?.cliente_id);
  };

  return (
    <TicketContext.Provider value={{
      chamados, clientes, tecnicos, categorias, servicos, noticias, configuracoes, isLoading,
      createChamado, pagarChamado, aceitarChamado, aCaminho, chegouLocal,
      finalizarAtendimento, assinarOS, confirmarRepasse,
      updateChamadoStatus, assignTecnico, addComentario, addAnexo, finalizeChamado,
      createCliente, updateCliente, createTecnico, updateTecnico,
      createServico, updateServico, createNoticia, updateConfiguracao,
      getChamadoById, getFilteredChamados, refreshData: loadData,
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets deve ser usado dentro de TicketProvider');
  return context;
};
