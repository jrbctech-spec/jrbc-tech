'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Chamado, TicketPriority, TicketStatus } from '@/types/database.types';
import { formatCurrency, formatDateTime, PRIORITY_MAP, STATUS_MAP } from '@/lib/utils';
import { Search, Filter, ArrowUpDown, ChevronRight, User, Building2 } from 'lucide-react';

interface TicketTableProps {
  chamados: Chamado[];
}

export const TicketTable: React.FC<TicketTableProps> = ({ chamados }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filtered = chamados.filter((ticket) => {
    const matchesSearch =
      ticket.numero_chamado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.cliente?.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.cliente?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.prioridade === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por protocolo, título ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filtro Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="AGUARDANDO_PAGAMENTO">Aguard. Pagamento</option>
            <option value="PAGO">Pago / Na Fila</option>
            <option value="ACEITO">Aceito pelo Técnico</option>
            <option value="A_CAMINHO">A Caminho</option>
            <option value="EM_ATENDIMENTO">Em Atendimento</option>
            <option value="AGUARDANDO_ASSINATURA">Aguard. Assinatura</option>
            <option value="AGUARDANDO_REPASSE">Aguard. Repasse</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          {/* Filtro Prioridade */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Todas as Prioridades</option>
            <option value="CRITICA">Crítica</option>
            <option value="ALTA">Alta</option>
            <option value="NORMAL">Normal</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Protocolo / Título</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Equipamento</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Prioridade</th>
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4">Abertura</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Nenhum chamado encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => {
                  const statusInfo = STATUS_MAP[ticket.status];
                  const priorityInfo = PRIORITY_MAP[ticket.prioridade];

                  return (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <Link href={`/chamados/${ticket.id}`} className="block">
                          <span className="font-mono font-bold text-sky-400 group-hover:text-cyan-300">
                            {ticket.numero_chamado}
                          </span>
                          <p className="font-semibold text-slate-100 mt-0.5 max-w-xs truncate">
                            {ticket.titulo}
                          </p>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-200 truncate block max-w-[150px]">
                          {ticket.cliente?.nome_fantasia || ticket.cliente?.razao_social || 'Cliente'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 block">{ticket.equipamento_marca || ticket.categoria?.nome || '-'}</span>
                        <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">
                          {ticket.equipamento_modelo || ticket.servico?.nome_servico || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityInfo.badge}`}>
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.badge}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300">
                          {ticket.tecnico_responsavel?.nome?.split(' ')[0] || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateTime(ticket.data_abertura)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/chamados/${ticket.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors"
                        >
                          Ver <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
