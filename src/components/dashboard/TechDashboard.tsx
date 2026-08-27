'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import {
  Zap, Clock, CheckCircle2, AlertCircle, ArrowRight, PlayCircle,
  UserCheck, Car, MapPin, ClipboardCheck, FileText,
  DollarSign, Timer
} from 'lucide-react';
import { formatDateTime, formatCurrency, PRIORITY_MAP, STATUS_MAP } from '@/lib/utils';
import { Chamado } from '@/types/database.types';

// Modal de finalização do atendimento
function FinalizarModal({ chamado, onConfirm, onClose }: { chamado: Chamado; onConfirm: (solucao: string, tempo: number) => void; onClose: () => void }) {
  const [solucao, setSolucao] = useState('');
  const [tempo, setTempo] = useState<string>('1');
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-violet-400" />
          <h3 className="font-bold text-white">Finalizar Atendimento</h3>
        </div>
        <p className="text-xs text-slate-400">Protocolo: <strong className="text-sky-400">{chamado.numero_chamado}</strong></p>
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Laudo / Solução Aplicada *</label>
          <textarea value={solucao} onChange={e => setSolucao(e.target.value)} rows={4} placeholder="Descreva detalhadamente o serviço executado, peças utilizadas e solução encontrada..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Tempo de Atendimento (horas)</label>
          <input type="number" min="0.5" max="24" step="0.5" value={tempo} onChange={e => setTempo(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500 min-h-[44px]" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 min-h-[44px]">Cancelar</button>
          <button
            onClick={() => { if (solucao.trim()) onConfirm(solucao.trim(), parseFloat(tempo) || 1); }}
            disabled={!solucao.trim()}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-xs disabled:opacity-40 min-h-[44px]"
          >
            Registrar e Aguardar Assinatura
          </button>
        </div>
      </div>
    </div>
  );
}

export const TechDashboard: React.FC = () => {
  const { user } = useAuth();
  const { chamados, tecnicos, aceitarChamado, aCaminho, chegouLocal, finalizarAtendimento } = useTickets();
  const [finalizando, setFinalizando] = useState<Chamado | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const currentTech = tecnicos.find(t => t.email.toLowerCase() === user?.email.toLowerCase()) || tecnicos[0];
  const myTickets = chamados.filter(c => c.tecnico_responsavel_id === currentTech?.id);

  // Fila de chamados PAGOS (disponíveis para aceitar)
  const paidQueue = chamados.filter(c => c.status === 'PAGO' && !c.tecnico_responsavel_id);

  // Chamados que são meus e estão em alguma etapa ativa
  const inProgress = myTickets.filter(c => ['ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO'].includes(c.status));
  const pendingSignature = myTickets.filter(c => c.status === 'AGUARDANDO_ASSINATURA');
  const resolvedCount = myTickets.filter(c => ['AGUARDANDO_REPASSE', 'FINALIZADO'].includes(c.status)).length;
  const totalHours = myTickets.reduce((acc, curr) => acc + (curr.tempo_atendimento_horas || 0), 0);
  const totalEarnings = myTickets
    .filter(c => ['AGUARDANDO_REPASSE', 'FINALIZADO'].includes(c.status))
    .reduce((acc, c) => acc + (c.valor_tecnico || 0), 0);

  const action = async (fn: () => Promise<void>, id: string) => {
    setLoadingId(id);
    try { await fn(); } finally { setLoadingId(null); }
  };

  // Botões de etapas por status atual do chamado
  const renderActionButton = (ticket: Chamado) => {
    const loading = loadingId === ticket.id;
    if (ticket.status === 'PAGO') {
      return <button onClick={() => action(() => aceitarChamado(ticket.id), ticket.id)} disabled={loading} className="btn-action bg-teal-500/20 border-teal-500/50 text-teal-300 min-h-[40px]"><UserCheck className="w-3.5 h-3.5" />{loading ? '...' : 'Aceitar'}</button>;
    }
    if (ticket.status === 'ACEITO') {
      return <button onClick={() => action(() => aCaminho(ticket.id), ticket.id)} disabled={loading} className="btn-action bg-orange-500/20 border-orange-500/50 text-orange-300 min-h-[40px]"><Car className="w-3.5 h-3.5" />{loading ? '...' : 'A Caminho'}</button>;
    }
    if (ticket.status === 'A_CAMINHO') {
      return <button onClick={() => action(() => chegouLocal(ticket.id), ticket.id)} disabled={loading} className="btn-action bg-cyan-500/20 border-cyan-500/50 text-cyan-300 min-h-[40px]"><MapPin className="w-3.5 h-3.5" />{loading ? '...' : 'Cheguei / Iniciar'}</button>;
    }
    if (ticket.status === 'EM_ATENDIMENTO') {
      return <button onClick={() => setFinalizando(ticket)} className="btn-action bg-violet-500/20 border-violet-500/50 text-violet-300 min-h-[40px]"><ClipboardCheck className="w-3.5 h-3.5" />Finalizar</button>;
    }
    if (ticket.status === 'AGUARDANDO_ASSINATURA') {
      return <span className="text-[10px] text-violet-300 font-semibold">Aguardando assinatura do cliente</span>;
    }
    return null;
  };

  // Pipeline visual
  const PIPELINE = [
    { status: 'ACEITO', label: 'Aceito', icon: UserCheck, color: 'text-indigo-400' },
    { status: 'A_CAMINHO', label: 'A Caminho', icon: Car, color: 'text-orange-400' },
    { status: 'EM_ATENDIMENTO', label: 'Atendendo', icon: PlayCircle, color: 'text-cyan-400' },
    { status: 'AGUARDANDO_ASSINATURA', label: 'Assinatura', icon: FileText, color: 'text-violet-400' },
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {finalizando && (
        <FinalizarModal
          chamado={finalizando}
          onClose={() => setFinalizando(null)}
          onConfirm={async (solucao, tempo) => {
            await action(() => finalizarAtendimento(finalizando.id, solucao, tempo), finalizando.id);
            setFinalizando(null);
          }}
        />
      )}

      {/* Banner do Técnico */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-950 border border-sky-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4" /> Bancada Técnica · Atendimento de Campo
            </div>
            <h1 className="text-2xl font-extrabold text-white">Olá, {user?.nome || 'Técnico'}</h1>
            <p className="text-xs text-slate-300 mt-1">
              Especialidades: <strong className="text-cyan-300">{currentTech?.especialidades.join(', ') || 'TI Geral'}</strong>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Horas Trabalhadas</span>
              <p className="text-lg font-bold text-cyan-300">{totalHours.toFixed(1)} h</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ganhos (70%)</span>
              <p className="text-lg font-bold text-emerald-300">{formatCurrency(totalEarnings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border-teal-500/30">
          <span className="text-xs font-semibold text-teal-400">Fila Disponível (Pagos)</span>
          <p className="text-2xl font-extrabold text-teal-300 mt-2">{paidQueue.length}</p>
          <span className="text-[10px] text-slate-400">Para aceitar agora</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border-cyan-500/20">
          <span className="text-xs font-semibold text-cyan-400">Em Progresso</span>
          <p className="text-2xl font-extrabold text-cyan-300 mt-2">{inProgress.length}</p>
          <span className="text-[10px] text-slate-400">Ativos comigo</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border-violet-500/20">
          <span className="text-xs font-semibold text-violet-400">Aguard. Assinatura</span>
          <p className="text-2xl font-extrabold text-violet-300 mt-2">{pendingSignature.length}</p>
          <span className="text-[10px] text-slate-400">Cliente precisa assinar</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border-emerald-500/20">
          <span className="text-xs font-semibold text-emerald-400">O.S. Concluídas</span>
          <p className="text-2xl font-extrabold text-emerald-300 mt-2">{resolvedCount}</p>
          <span className="text-[10px] text-slate-400">Finalizadas com sucesso</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minha Fila — Chamados Ativos */}
        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Minha Fila Ativa ({myTickets.filter(c => !['FINALIZADO', 'CANCELADO', 'AGUARDANDO_REPASSE'].includes(c.status)).length})
            </h3>
            <Link href="/chamados" className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myTickets.filter(c => !['FINALIZADO', 'CANCELADO', 'AGUARDANDO_REPASSE'].includes(c.status)).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Você não possui chamados ativos. Confira a fila paga abaixo!</p>
            ) : (
              myTickets.filter(c => !['FINALIZADO', 'CANCELADO', 'AGUARDANDO_REPASSE'].includes(c.status)).slice(0, 5).map((ticket) => {
                const statusInfo = STATUS_MAP[ticket.status];
                const priorityInfo = PRIORITY_MAP[ticket.prioridade];
                return (
                  <div key={ticket.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-sky-400 flex-shrink-0">{ticket.numero_chamado}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${priorityInfo.badge}`}>{priorityInfo.label}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusInfo.badge}`}>{statusInfo.label}</span>
                    </div>

                    {/* Pipeline visual */}
                    <div className="flex items-center gap-1">
                      {PIPELINE.map((step, idx) => {
                        const stages = ['ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO', 'AGUARDANDO_ASSINATURA'];
                        const currentIdx = stages.indexOf(ticket.status);
                        const stepIdx = stages.indexOf(step.status);
                        const isDone = stepIdx < currentIdx;
                        const isCurrent = stepIdx === currentIdx;
                        const Icon = step.icon;
                        return (
                          <React.Fragment key={step.status}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCurrent ? 'bg-sky-500 ring-2 ring-sky-400' : isDone ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-slate-600'}`} />}
                            </div>
                            {idx < 3 && <div className={`flex-1 h-0.5 ${isDone || isCurrent ? 'bg-sky-500' : 'bg-slate-800'}`} />}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <Link href={`/chamados/${ticket.id}`} className="block text-sm font-semibold text-slate-100 hover:text-cyan-300 truncate">{ticket.titulo}</Link>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                      <div>
                        <p className="text-slate-400 text-[11px]">{ticket.cliente?.nome_fantasia || 'Cliente'}</p>
                        {ticket.equipamento_marca && <p className="text-slate-500 text-[10px]">{ticket.equipamento_marca} {ticket.equipamento_modelo}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderActionButton(ticket)}
                        <Link href={`/chamados/${ticket.id}`} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold min-h-[32px] flex items-center">Detalhes</Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Fila de Chamados Pagos (para aceitar) */}
        <div className="p-5 rounded-2xl glass-card border-teal-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-400" />
              Fila de Chamados Pagos ({paidQueue.length})
            </h3>
            <span className="text-xs text-teal-300 font-semibold">Disponíveis p/ aceitar</span>
          </div>

          <div className="space-y-3">
            {paidQueue.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Nenhum chamado pago disponível no momento.</p>
            ) : (
              paidQueue.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/20 hover:border-teal-500/40 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">{ticket.numero_chamado}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_MAP[ticket.prioridade].badge}`}>{ticket.prioridade}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-100">{ticket.titulo}</h4>
                  {ticket.equipamento_marca && (
                    <p className="text-xs text-slate-400">{ticket.equipamento_marca} {ticket.equipamento_modelo}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-teal-900/40 text-xs">
                    <div>
                      <p className="text-slate-400">{ticket.cliente?.nome_fantasia || 'Empresa'}</p>
                      <p className="text-emerald-400 font-bold">{formatCurrency((ticket.valor_tecnico || 0))} <span className="text-slate-500 font-normal">(70%)</span></p>
                    </div>
                    <button
                      onClick={() => action(() => aceitarChamado(ticket.id), ticket.id)}
                      disabled={loadingId === ticket.id}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-emerald min-h-[40px]"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> {loadingId === ticket.id ? '...' : 'Aceitar Chamado'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .btn-action { @apply flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-colors; }
      `}</style>
    </div>
  );
};
