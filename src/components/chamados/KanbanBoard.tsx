'use client';

import React from 'react';
import Link from 'next/link';
import { Chamado, TicketStatus } from '@/types/database.types';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { PRIORITY_MAP, STATUS_MAP } from '@/lib/utils';
import { User, ChevronRight, DollarSign, Wrench, CheckCircle2, Car, MapPin, ClipboardCheck, FileText, UserCheck } from 'lucide-react';

interface KanbanBoardProps { chamados: Chamado[] }

interface ColumnConfig {
  id: TicketStatus | 'EM_OPERACAO';  // grupo especial
  statuses: TicketStatus[];
  title: string;
  badgeColor: string;
  borderColor: string;
  icon: React.ElementType;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'AGUARDANDO_PAGAMENTO',
    statuses: ['AGUARDANDO_PAGAMENTO'],
    title: 'Aguard. Pagamento',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/30',
    icon: DollarSign,
  },
  {
    id: 'PAGO',
    statuses: ['PAGO', 'ABERTO'],
    title: 'Fila (Pagos / Triagem)',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    borderColor: 'border-teal-500/30',
    icon: UserCheck,
  },
  {
    id: 'EM_OPERACAO' as TicketStatus,
    statuses: ['ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO', 'EM_ANALISE', 'AGENDADO'],
    title: 'Em Operação',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
    icon: Wrench,
  },
  {
    id: 'AGUARDANDO_ASSINATURA',
    statuses: ['AGUARDANDO_ASSINATURA', 'RESOLVIDO'],
    title: 'Aguard. Assinatura',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    borderColor: 'border-violet-500/30',
    icon: FileText,
  },
  {
    id: 'AGUARDANDO_REPASSE',
    statuses: ['AGUARDANDO_REPASSE'],
    title: 'Aguard. Repasse',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    borderColor: 'border-orange-500/30',
    icon: ClipboardCheck,
  },
  {
    id: 'FINALIZADO',
    statuses: ['FINALIZADO', 'CANCELADO'],
    title: 'Finalizados',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    borderColor: 'border-slate-500/30',
    icon: CheckCircle2,
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ chamados }) => {
  const { role } = useAuth();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
      {COLUMNS.map((col) => {
        const columnTickets = chamados.filter((t) => col.statuses.includes(t.status));
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className={`flex flex-col flex-shrink-0 w-[280px] rounded-2xl bg-slate-950/60 border ${col.borderColor} p-3.5 backdrop-blur-sm`}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${col.badgeColor}`}>
                  {col.title}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">{columnTickets.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
              {columnTickets.length === 0 ? (
                <div className="p-5 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
                  Nenhum chamado aqui
                </div>
              ) : (
                columnTickets.map((ticket) => {
                  const priority = PRIORITY_MAP[ticket.prioridade];
                  const statusInfo = STATUS_MAP[ticket.status];

                  return (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-all shadow-md space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-sky-400">{ticket.numero_chamado}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priority.badge}`}>
                          {priority.label}
                        </span>
                      </div>

                      <Link
                        href={`/chamados/${ticket.id}`}
                        className="block font-semibold text-xs text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2"
                      >
                        {ticket.titulo}
                      </Link>

                      {/* Equipamento */}
                      {ticket.equipamento_marca && (
                        <p className="text-[10px] text-slate-500 truncate">
                          📱 {ticket.equipamento_marca} {ticket.equipamento_modelo}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <p className="truncate font-medium text-slate-300">
                          {ticket.cliente?.nome_fantasia || ticket.cliente?.razao_social || 'Cliente'}
                        </p>
                        <p className="truncate text-[10px] text-slate-500">
                          {ticket.categoria?.nome} • {ticket.servico?.nome_servico || 'Serviço TI'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <User className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[100px] text-[10px]">
                            {ticket.tecnico_responsavel?.nome?.split(' ')[0] || 'Não atribuído'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.badge}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
