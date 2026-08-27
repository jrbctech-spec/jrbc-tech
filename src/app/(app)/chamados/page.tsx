'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { KanbanBoard } from '@/components/chamados/KanbanBoard';
import { TicketTable } from '@/components/chamados/TicketTable';
import { 
  Kanban, 
  Table as TableIcon, 
  PlusCircle, 
  LifeBuoy, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function ChamadosPage() {
  const { getFilteredChamados } = useTickets();
  const { role } = useAuth();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'PROGRESS' | 'DONE'>('ALL');

  const allChamados = getFilteredChamados();

  // Filtragem por abas superiores
  const displayedChamados = allChamados.filter((c) => {
    if (activeTab === 'OPEN') return ['AGUARDANDO_PAGAMENTO', 'PAGO', 'ABERTO'].includes(c.status);
    if (activeTab === 'PROGRESS') return ['ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO', 'EM_ANALISE', 'AGENDADO'].includes(c.status);
    if (activeTab === 'PENDING') return ['AGUARDANDO_ASSINATURA', 'AGUARDANDO_REPASSE', 'RESOLVIDO'].includes(c.status);
    if (activeTab === 'DONE') return ['FINALIZADO', 'CANCELADO'].includes(c.status);
    return true;
  });

  const counts = {
    open: allChamados.filter(c => ['AGUARDANDO_PAGAMENTO', 'PAGO', 'ABERTO'].includes(c.status)).length,
    progress: allChamados.filter(c => ['ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO', 'EM_ANALISE', 'AGENDADO'].includes(c.status)).length,
    pending: allChamados.filter(c => ['AGUARDANDO_ASSINATURA', 'AGUARDANDO_REPASSE', 'RESOLVIDO'].includes(c.status)).length,
    done: allChamados.filter(c => ['FINALIZADO', 'CANCELADO'].includes(c.status)).length,
  };


  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4" />
            {role === 'CLIENTE' ? 'Portal do Cliente' : role === 'TECNICO' ? 'Fila Operacional' : 'Administração Geral'}
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white">
            {role === 'CLIENTE' ? 'Meus Chamados Técnicos' : 'Gestão de Chamados de TI'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe o andamento dos tickets e acesse as Ordens de Serviço.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternador de Visualização: Kanban vs Tabela */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors min-h-[40px] ${
                viewMode === 'kanban'
                  ? 'bg-sky-500 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors min-h-[40px] ${
                viewMode === 'table'
                  ? 'bg-sky-500 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabela</span>
            </button>
          </div>

          {(role === 'CLIENTE' || role === 'ADMIN') && (
            <Link
              href="/chamados/novo"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Chamado</span>
              <span className="sm:hidden">Abrir</span>
            </Link>
          )}
        </div>
      </div>

      {/* Abas Rápidas de Status Mobile-First */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'ALL'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Todos ({allChamados.length})
        </button>

        <button
          onClick={() => setActiveTab('OPEN')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'OPEN'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Abertos ({counts.open})
        </button>

        <button
          onClick={() => setActiveTab('PROGRESS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'PROGRESS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Em Atendimento ({counts.progress})
        </button>

        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'PENDING'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Aguard. Ação ({counts.pending})
        </button>

        <button
          onClick={() => setActiveTab('DONE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[40px] ${
            activeTab === 'DONE'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Concluídos ({counts.done})
        </button>
      </div>

      {/* Renderização */}
      {viewMode === 'kanban' ? (
        <KanbanBoard chamados={displayedChamados} />
      ) : (
        <TicketTable chamados={displayedChamados} />
      )}
    </div>
  );
}
