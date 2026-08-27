'use client';

import React from 'react';
import { ChamadoHistorico } from '@/types/database.types';
import { formatDateTime } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  AlertCircle,
  Activity
} from 'lucide-react';

interface TicketTimelineProps {
  historico?: ChamadoHistorico[];
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ historico = [] }) => {
  if (historico.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        Nenhum evento registrado no histórico ainda.
      </div>
    );
  }

  // Ordenar eventos do mais recente ao mais antigo
  const sortedHistory = [...historico].sort(
    (a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
  );

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {sortedHistory.map((event, idx) => {
        const isLatest = idx === 0;

        let icon = <Clock className="w-3.5 h-3.5" />;
        let iconBg = 'bg-slate-800 text-slate-400 border-slate-700';

        if (event.tipo_evento === 'CRIACAO') {
          icon = <FileText className="w-3.5 h-3.5" />;
          iconBg = 'bg-sky-500/20 text-sky-400 border-sky-500/40';
        } else if (event.tipo_evento === 'ATRIBUICAO') {
          icon = <UserCheck className="w-3.5 h-3.5" />;
          iconBg = 'bg-purple-500/20 text-purple-400 border-purple-500/40';
        } else if (event.status_novo === 'RESOLVIDO' || event.status_novo === 'FINALIZADO') {
          icon = <CheckCircle2 className="w-3.5 h-3.5" />;
          iconBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
        } else if (event.tipo_evento === 'MUDANCA_STATUS') {
          icon = <Activity className="w-3.5 h-3.5" />;
          iconBg = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
        }

        return (
          <div key={event.id || idx} className="relative group">
            {/* Ponto / Ícone na Linha do Tempo */}
            <div
              className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border ${iconBg} ${
                isLatest ? 'ring-4 ring-sky-500/20 shadow-glow-cyan' : ''
              }`}
            >
              {icon}
            </div>

            {/* Conteúdo do Evento */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 group-hover:border-slate-700 transition-colors space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 font-mono">
                  {event.usuario_email}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatDateTime(event.data_hora)}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {event.descricao}
              </p>
              {event.status_novo && event.status_anterior && (
                <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800">{event.status_anterior}</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-semibold">{event.status_novo}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
