'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  DollarSign, TrendingUp, CheckCircle2, Clock, AlertCircle,
  Filter, Download, ChevronRight, Banknote, Building2, User2
} from 'lucide-react';

type FilterView = 'TODOS' | 'AGUARDANDO_REPASSE' | 'FINALIZADO';

export default function FinanceiroPage() {
  const { chamados, tecnicos, clientes, confirmarRepasse } = useTickets();
  const { role } = useAuth();
  const [filter, setFilter] = useState<FilterView>('TODOS');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-6">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <h2 className="font-bold text-white text-lg">Acesso Restrito</h2>
        <p className="text-slate-400 text-sm">Módulo financeiro exclusivo para administradores JRBTC-TECH.</p>
      </div>
    );
  }

  const pagosEFinalizados = chamados.filter(c => ['PAGO', 'ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO', 'AGUARDANDO_ASSINATURA', 'AGUARDANDO_REPASSE', 'FINALIZADO'].includes(c.status));

  const filtered = filter === 'TODOS' ? pagosEFinalizados
    : filter === 'AGUARDANDO_REPASSE' ? pagosEFinalizados.filter(c => c.status === 'AGUARDANDO_REPASSE')
    : pagosEFinalizados.filter(c => c.status === 'FINALIZADO');

  // KPIs financeiros
  const totalRecebido = pagosEFinalizados.reduce((acc, c) => acc + (c.valor_pago || c.valor_servico || 0), 0);
  const taxaEmpresa = pagosEFinalizados.reduce((acc, c) => acc + (c.taxa_empresa || (c.valor_servico || 0) * 0.30), 0);
  const totalTecnicos = pagosEFinalizados.reduce((acc, c) => acc + (c.valor_tecnico || (c.valor_servico || 0) * 0.70), 0);
  const pendentesRepasse = pagosEFinalizados.filter(c => c.status === 'AGUARDANDO_REPASSE');
  const totalPendenteRepasse = pendentesRepasse.reduce((acc, c) => acc + (c.valor_tecnico || (c.valor_servico || 0) * 0.70), 0);

  const handleRepasse = async (id: string) => {
    setConfirmingId(id);
    try { await confirmarRepasse(id); } finally { setConfirmingId(null); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-emerald-400" />
            Módulo Financeiro
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Receita, comissões (30%/70%) e repasses aos técnicos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:border-sky-500/40 transition-colors min-h-[44px]">
          <Download className="w-3.5 h-3.5" /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
          <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Total Recebido</p>
          <p className="text-2xl font-extrabold text-emerald-400">{formatCurrency(totalRecebido)}</p>
          <p className="text-[10px] text-slate-500">{pagosEFinalizados.length} chamados pagos</p>
        </div>
        <div className="p-5 rounded-2xl bg-violet-950/30 border border-violet-500/30 space-y-2">
          <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-violet-400" /> Taxa JRBTC (30%)</p>
          <p className="text-2xl font-extrabold text-violet-400">{formatCurrency(taxaEmpresa)}</p>
          <p className="text-[10px] text-slate-500">Receita operacional</p>
        </div>
        <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
          <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5"><User2 className="w-3.5 h-3.5 text-cyan-400" /> Total Técnicos (70%)</p>
          <p className="text-2xl font-extrabold text-cyan-400">{formatCurrency(totalTecnicos)}</p>
          <p className="text-[10px] text-slate-500">Valor repassado / a repassar</p>
        </div>
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2 relative">
          <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> Aguard. Repasse</p>
          <p className="text-2xl font-extrabold text-amber-400">{formatCurrency(totalPendenteRepasse)}</p>
          {pendentesRepasse.length > 0 && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">{pendentesRepasse.length}</span>
          )}
          <p className="text-[10px] text-slate-500">{pendentesRepasse.length} chamados pendentes</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['TODOS', 'AGUARDANDO_REPASSE', 'FINALIZADO'] as FilterView[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-colors min-h-[40px] whitespace-nowrap ${filter === f ? 'bg-sky-500/20 border-sky-400 text-sky-300' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
            {f === 'TODOS' ? 'Todos os Chamados' : f === 'AGUARDANDO_REPASSE' ? '⏳ Aguard. Repasse' : '✅ Finalizados'}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Chamados Pagos — Extrato Financeiro</h2>
          <span className="text-xs text-slate-500">{filtered.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead className="bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase">Protocolo / Serviço</th>
                <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase hidden sm:table-cell">Cliente</th>
                <th className="text-left py-3 px-3 text-[10px] font-bold text-slate-400 uppercase hidden md:table-cell">Técnico</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-slate-400 uppercase">Valor Pago</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-violet-400 uppercase hidden sm:table-cell">JRBTC 30%</th>
                <th className="text-right py-3 px-3 text-[10px] font-bold text-cyan-400 uppercase">Técnico 70%</th>
                <th className="text-center py-3 px-3 text-[10px] font-bold text-slate-400 uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-slate-500">Nenhum registro encontrado para o filtro selecionado.</td></tr>
              )}
              {filtered.map((c) => {
                const valorPago = c.valor_pago || c.valor_servico || 0;
                const taxa = c.taxa_empresa || Math.round(valorPago * 0.30 * 100) / 100;
                const repasse = c.valor_tecnico || Math.round(valorPago * 0.70 * 100) / 100;
                const tecnico = c.tecnico_responsavel;
                const cliente = c.cliente || clientes.find(cl => cl.id === c.cliente_id);
                const isPending = c.status === 'AGUARDANDO_REPASSE';
                const isFinalizado = c.status === 'FINALIZADO';

                return (
                  <tr key={c.id} className={`hover:bg-slate-900/40 transition-colors ${isPending ? 'bg-amber-950/10' : ''}`}>
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-sky-400">{c.numero_chamado}</p>
                      <p className="text-slate-400 truncate max-w-[180px]">{c.titulo}</p>
                    </td>
                    <td className="py-3.5 px-3 hidden sm:table-cell">
                      <p className="text-slate-200 font-semibold truncate max-w-[120px]">{cliente?.nome_fantasia || 'N/A'}</p>
                    </td>
                    <td className="py-3.5 px-3 hidden md:table-cell">
                      <p className="text-slate-200 font-semibold truncate max-w-[120px]">{tecnico?.nome || '—'}</p>
                      {tecnico?.pix_chave && <p className="text-[10px] text-slate-500">PIX: {tecnico.pix_chave}</p>}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">{formatCurrency(valorPago)}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-violet-400 hidden sm:table-cell">{formatCurrency(taxa)}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-cyan-400">{formatCurrency(repasse)}</td>
                    <td className="py-3.5 px-3 text-center">
                      {isPending && (
                        <button onClick={() => handleRepasse(c.id)} disabled={confirmingId === c.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] hover:bg-emerald-500/30 transition-colors min-h-[32px] disabled:opacity-50 whitespace-nowrap">
                          {confirmingId === c.id ? '...' : '✓ Repassar'}
                        </button>
                      )}
                      {isFinalizado && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><CheckCircle2 className="w-3 h-3" /> Repassado</span>
                      )}
                      {!isPending && !isFinalizado && (
                        <span className="text-[10px] text-slate-500">{c.status.replace('_', ' ')}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totais */}
        {filtered.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-wrap gap-4 justify-end text-xs font-bold">
            <span className="text-slate-400">Total filtrado:</span>
            <span className="text-emerald-400">{formatCurrency(filtered.reduce((a, c) => a + (c.valor_pago || c.valor_servico || 0), 0))}</span>
            <span className="text-violet-400 hidden sm:inline">JRBTC: {formatCurrency(filtered.reduce((a, c) => a + (c.taxa_empresa || (c.valor_servico || 0) * 0.30), 0))}</span>
            <span className="text-cyan-400">Técnicos: {formatCurrency(filtered.reduce((a, c) => a + (c.valor_tecnico || (c.valor_servico || 0) * 0.70), 0))}</span>
          </div>
        )}
      </div>
    </div>
  );
}
