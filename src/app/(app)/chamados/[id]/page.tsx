'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { TicketStatus, TicketPriority } from '@/types/database.types';
import { TicketTimeline } from '@/components/chamados/TicketTimeline';
import { TicketChat } from '@/components/chamados/TicketChat';
import { TicketAttachments } from '@/components/chamados/TicketAttachments';
import { ServiceOrderPDFModal } from '@/components/chamados/ServiceOrderPDFModal';
import { 
  formatCurrency, 
  formatDateTime, 
  PRIORITY_MAP, 
  STATUS_MAP 
} from '@/lib/utils';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  User, 
  Wrench, 
  FileText, 
  MessageSquare, 
  Paperclip, 
  Activity, 
  CheckCircle2, 
  PlayCircle, 
  ShieldAlert, 
  DollarSign,
  UserCheck,
  Download,
  PenTool,
  Car,
  MapPin,
  Laptop
} from 'lucide-react';

export default function DetalheChamadoPage() {
  const params = useParams();
  const router = useRouter();
  const chamadoId = params.id as string;

  const { chamados, tecnicos, updateChamadoStatus, assignTecnico, finalizeChamado } = useTickets();
  const { role, user } = useAuth();

  const chamado = chamados.find(c => c.id === chamadoId || c.numero_chamado === chamadoId);

  // Tabs de Conteúdo
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'attachments' | 'solution'>('chat');
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  // Formulário de Solução Técnica (Para Técnicos e Admin)
  const [solucaoTexto, setSolucaoTexto] = useState(chamado?.solucao || '');
  const [tempoHoras, setTempoHoras] = useState(chamado?.tempo_atendimento_horas || 1.5);
  const [valorServico, setValorServico] = useState(chamado?.valor_servico || 250);
  const [obsInternas, setObsInternas] = useState(chamado?.observacoes_internas || '');
  const [obsCliente, setObsCliente] = useState(chamado?.observacoes_cliente || '');
  const [isFinalizing, setIsFinalizing] = useState(false);

  if (!chamado) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-sm text-slate-400">Chamado não encontrado.</p>
        <Link href="/chamados" className="text-xs text-sky-400 hover:underline min-h-[44px] flex items-center">
          Voltar para listagem
        </Link>
      </div>
    );
  }

  // Verificação de Segurança (RLS no Frontend): Se for cliente, não pode ver chamados de outra empresa
  if (role === 'CLIENTE' && user?.cliente_id && chamado.cliente_id !== user.cliente_id) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-white">Acesso Restrito</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Você não possui permissão para visualizar chamados pertencentes a outra organização.
        </p>
        <Link href="/chamados" className="px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold min-h-[44px] flex items-center">
          Voltar aos Meus Chamados
        </Link>
      </div>
    );
  }

  const priorityInfo = PRIORITY_MAP[chamado.prioridade];
  const statusInfo = STATUS_MAP[chamado.status];

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solucaoTexto.trim()) {
      alert('Por favor, informe a solução técnica aplicada antes de finalizar.');
      return;
    }

    setIsFinalizing(true);
    try {
      await finalizeChamado(
        chamado.id,
        solucaoTexto.trim(),
        Number(tempoHoras),
        Number(valorServico),
        obsInternas.trim(),
        obsCliente.trim()
      );
      setIsPDFModalOpen(true);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Navegação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/chamados"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Chamados
        </Link>

        {/* Botão de Ordem de Serviço PDF */}
        <button
          onClick={() => setIsPDFModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition-all min-h-[44px]"
        >
          <FileText className="w-4 h-4" />
          <span>Ordem de Serviço (PDF)</span>
        </button>
      </div>

      {/* Banner Principal do Chamado */}
      <div className="p-4 sm:p-6 rounded-2xl glass-card border-sky-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800/60">
                {chamado.numero_chamado}
              </span>
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${priorityInfo.badge}`}>
                {priorityInfo.label}
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.badge}`}>
                {statusInfo.label}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white">
              {chamado.titulo}
            </h1>
          </div>

          {/* Ações de Status para Técnico e Admin */}
          {role !== 'CLIENTE' && (
            <div className="flex flex-wrap items-center gap-2">
              {chamado.status === 'PAGO' && (
                <button
                  onClick={() => updateChamadoStatus(chamado.id, 'ACEITO')}
                  className="px-3.5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <UserCheck className="w-4 h-4" /> Aceitar Chamado
                </button>
              )}

              {chamado.status === 'ACEITO' && (
                <button
                  onClick={() => updateChamadoStatus(chamado.id, 'A_CAMINHO')}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <Car className="w-4 h-4" /> Estou a Caminho
                </button>
              )}

              {chamado.status === 'A_CAMINHO' && (
                <button
                  onClick={() => updateChamadoStatus(chamado.id, 'EM_ATENDIMENTO')}
                  className="px-3.5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <MapPin className="w-4 h-4" /> Cheguei no Local
                </button>
              )}

              {(chamado.status === 'EM_ATENDIMENTO' || chamado.status === 'EM_ANALISE' || chamado.status === 'AGENDADO' || chamado.status === 'RESOLVIDO') && (
                <button
                  onClick={() => setActiveTab('solution')}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4" /> Registrar Solução & Finalizar
                </button>
              )}

              {chamado.status === 'AGUARDANDO_REPASSE' && role === 'ADMIN' && (
                <button
                  onClick={() => updateChamadoStatus(chamado.id, 'FINALIZADO')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
                >
                  <DollarSign className="w-4 h-4" /> Confirmar Pagamento Técnico
                </button>
              )}
            </div>
          )}

          {/* Ações de Status para o Cliente */}
          {role === 'CLIENTE' && chamado.status === 'AGUARDANDO_ASSINATURA' && (
            <Link
              href={`/chamados/${chamado.id}/assinar`}
              className="px-4 py-2.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[44px]"
            >
              <PenTool className="w-4 h-4" /> Assinar Ordem de Serviço
            </Link>
          )}
        </div>

        {/* Linha Informativa e Financeira */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div>
            <span className="text-[10px] text-slate-500 block">Especialidade</span>
            <span className="font-semibold text-slate-200">{chamado.categoria?.nome}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Serviço / Abertura</span>
            <span className="font-semibold text-slate-200 truncate block">{chamado.servico?.nome_servico}</span>
            <span className="text-[10px] text-slate-500">{formatDateTime(chamado.data_abertura)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Valor Serviço</span>
            <span className="font-semibold text-emerald-400 block">{formatCurrency(chamado.valor_servico)}</span>
            <span className="text-[10px] text-slate-500">
              {chamado.status_pagamento === 'PAGO' ? 'Pago pelo Cliente' : chamado.status_pagamento === 'REPASSADO' ? 'Pago e Repassado' : 'Aguardando Pagamento'}
            </span>
          </div>
          {role !== 'CLIENTE' && (
            <div>
              <span className="text-[10px] text-slate-500 block">
                {role === 'ADMIN' ? 'Divisão (30% / 70%)' : 'Seu Repasse (70%)'}
              </span>
              <div className="flex items-center gap-2">
                {role === 'ADMIN' && (
                  <span className="font-semibold text-sky-400">{formatCurrency(chamado.taxa_empresa || 0)}</span>
                )}
                <span className="font-semibold text-emerald-400">{formatCurrency(chamado.valor_tecnico || 0)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Central: Lateral e Abas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Painel Lateral: Informações */}
        <div className="space-y-4">
          {/* Solicitante */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border-slate-800 space-y-2.5">
            <h3 className="font-bold text-xs text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Solicitante / Empresa
            </h3>
            <div>
              <p className="font-bold text-sm text-white">
                {chamado.cliente?.nome_fantasia || chamado.cliente?.razao_social || 'Cliente'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Contato: <strong className="text-slate-200">{chamado.solicitante?.nome || 'Solicitante'}</strong>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
              <p>E-mail: <strong className="text-slate-200">{chamado.solicitante?.email || chamado.cliente?.email}</strong></p>
              <p>Telefone: <strong className="text-slate-200">{chamado.cliente?.whatsapp || chamado.cliente?.telefone || '(63) 98121-3180'}</strong></p>
            </div>
          </div>

          {/* Técnico Responsável */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border-slate-800 space-y-2.5">
            <h3 className="font-bold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Técnico Responsável
            </h3>

            {role === 'ADMIN' ? (
              <div className="space-y-2">
                <select
                  value={chamado.tecnico_responsavel_id || ''}
                  onChange={(e) => assignTecnico(chamado.id, e.target.value || null)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 min-h-[44px]"
                >
                  <option value="">Fila Geral (Nenhum Técnico)</option>
                  {tecnicos.map((tec) => (
                    <option key={tec.id} value={tec.id}>
                      {tec.nome} ({tec.especialidades.slice(0, 1).join('')})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-white">
                  {chamado.tecnico_responsavel?.nome || 'Aguardando atribuição de técnico'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {chamado.tecnico_responsavel?.email || 'Central JRBTC-TECH'}
                </p>
              </div>
            )}
          </div>

          {/* Equipamento */}
          {(chamado.equipamento_marca || chamado.equipamento_modelo) && (
            <div className="p-4 sm:p-5 rounded-2xl glass-card border-slate-800 space-y-2.5">
              <h3 className="font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" /> Equipamento
              </h3>
              <div>
                <p className="font-bold text-sm text-white">
                  {chamado.equipamento_marca} {chamado.equipamento_modelo}
                </p>
                {chamado.equipamento_serial && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    S/N: <strong className="text-slate-200">{chamado.equipamento_serial}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Descrição do Problema */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card border-slate-800 space-y-2">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
              Descrição do Problema
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {chamado.descricao}
            </p>
          </div>
        </div>

        {/* Painel Principal de Abas */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl glass-card border-slate-800 space-y-4">
          {/* Navegação de Abas Mobile-Friendly */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[44px] ${
                activeTab === 'chat'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat ({chamado.comentarios?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[44px] ${
                activeTab === 'history'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Linha do Tempo</span>
            </button>

            <button
              onClick={() => setActiveTab('attachments')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[44px] ${
                activeTab === 'attachments'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Paperclip className="w-4 h-4" />
              <span>Evidências ({chamado.anexos?.length || 0})</span>
            </button>

            {role !== 'CLIENTE' && (
              <button
                onClick={() => setActiveTab('solution')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[44px] ${
                  activeTab === 'solution'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Laudo & Fechamento</span>
              </button>
            )}
          </div>

          {/* Conteúdo das Abas */}
          <div className="pt-1">
            {activeTab === 'chat' && (
              <TicketChat chamadoId={chamado.id} comentarios={chamado.comentarios} />
            )}

            {activeTab === 'history' && (
              <TicketTimeline historico={chamado.historico} />
            )}

            {activeTab === 'attachments' && (
              <TicketAttachments chamadoId={chamado.id} anexos={chamado.anexos} />
            )}

            {activeTab === 'solution' && role !== 'CLIENTE' && (
              <form onSubmit={handleFinalize} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Laudo Técnico e Emissão da Ordem de Serviço
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    O encerramento disparará e-mail automático para o cliente e para <strong>jrbctech@gmail.com</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Diagnóstico e Solução Técnica Aplicada *
                  </label>
                  <textarea
                    value={solucaoTexto}
                    onChange={(e) => setSolucaoTexto(e.target.value)}
                    rows={4}
                    placeholder="Descreva o procedimento executado, testes e componentes configurados..."
                    required
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Tempo de Atendimento (Horas)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={tempoHoras}
                      onChange={(e) => setTempoHoras(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Valor Total da O.S. (R$)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={valorServico}
                      onChange={(e) => setValorServico(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Observações Impressas para o Cliente
                  </label>
                  <input
                    type="text"
                    value={obsCliente}
                    onChange={(e) => setObsCliente(e.target.value)}
                    placeholder="Ex: Garantia de 90 dias nos serviços prestados..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={isFinalizing}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all min-h-[48px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isFinalizing ? 'Finalizando...' : 'Concluir Chamado e Emitir O.S. (PDF)'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Ordem de Serviço em PDF */}
      <ServiceOrderPDFModal
        chamado={chamado}
        cliente={chamado.cliente}
        solicitante={chamado.solicitante}
        tecnico={chamado.tecnico_responsavel}
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
      />
    </div>
  );
}
