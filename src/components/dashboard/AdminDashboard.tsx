'use client';

import React from 'react';
import Link from 'next/link';
import { useTickets } from '@/context/TicketContext';
import { 
  LifeBuoy, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Server, 
  Database, 
  Monitor, 
  PlusCircle, 
  ArrowRight,
  ShieldAlert,
  Users,
  Building2
} from 'lucide-react';
import { formatCurrency, formatDateTime, PRIORITY_MAP, STATUS_MAP } from '@/lib/utils';

export const AdminDashboard: React.FC = () => {
  const { chamados, clientes, tecnicos } = useTickets();

  // Cálculos de Indicadores
  const totalChamados = chamados.length;
  const abertos = chamados.filter(c => c.status === 'ABERTO').length;
  const emAtendimento = chamados.filter(c => c.status === 'EM_ATENDIMENTO' || c.status === 'EM_ANALISE' || c.status === 'AGENDADO').length;
  const finalizados = chamados.filter(c => c.status === 'FINALIZADO' || c.status === 'RESOLVIDO').length;
  
  const faturamentoTotal = chamados.reduce((acc, curr) => acc + (curr.valor_servico || 0), 0);
  const chamadosCriticos = chamados.filter(c => c.prioridade === 'CRITICA' && c.status !== 'FINALIZADO');

  // Distribuição por categoria
  const catMicro = chamados.filter(c => c.categoria?.nome === 'Microinformática').length;
  const catInfra = chamados.filter(c => c.categoria?.nome === 'Infraestrutura de TI').length;
  const catDB = chamados.filter(c => c.categoria?.nome === 'Banco de Dados').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner de Boas-Vindas & Ações Rápidas */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/70 via-slate-900/80 to-navy-900 border border-sky-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Painel de Controle Executivo • JRBTC-TECH
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Central de Gestão e Operações de TI
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Monitoramento em tempo real de chamados, técnicos em campo, SLA corporativo e faturamento de serviços técnicos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/chamados/novo"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Abrir Novo Chamado</span>
            </Link>
            <Link
              href="/chamados"
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-2 transition-all"
            >
              <LifeBuoy className="w-4 h-4 text-sky-400" />
              <span>Ver Quadro Kanban</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Principais (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Chamados */}
        <div className="p-4 sm:p-5 rounded-2xl glass-card border-sky-500/20 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total de Chamados</span>
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{totalChamados}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Volume total registrado</span>
          </div>
        </div>

        {/* Chamados Abertos / Triagem */}
        <div className="p-4 sm:p-5 rounded-2xl glass-card border-amber-500/20 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">Fila Aberta / Triagem</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">{abertos}</p>
          <div className="text-[11px] text-amber-400/80 mt-2">
            Aguardando atribuição técnica
          </div>
        </div>

        {/* Em Atendimento */}
        <div className="p-4 sm:p-5 rounded-2xl glass-card border-cyan-500/20 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300">Em Atendimento</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-2">{emAtendimento}</p>
          <div className="text-[11px] text-cyan-400/80 mt-2">
            Com técnico em execução
          </div>
        </div>

        {/* Faturamento Total */}
        <div className="p-4 sm:p-5 rounded-2xl glass-card border-emerald-500/20 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Faturamento Serviços</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
            {formatCurrency(faturamentoTotal)}
          </p>
          <div className="text-[11px] text-emerald-400/80 mt-2">
            {finalizados} concluídos com O.S.
          </div>
        </div>
      </div>

      {/* Seção Central: Alerta Crítico & Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chamados de Alta Prioridade / Críticos */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-base text-white">Chamados Prioritários e Recentes</h3>
            </div>
            <Link href="/chamados" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {chamados.slice(0, 4).map((ticket) => {
              const statusInfo = STATUS_MAP[ticket.status];
              const priorityInfo = PRIORITY_MAP[ticket.prioridade];

              return (
                <Link
                  key={ticket.id}
                  href={`/chamados/${ticket.id}`}
                  className="block p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-sky-500/30 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-sky-400 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40">
                        {ticket.numero_chamado}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityInfo.badge}`}>
                        {priorityInfo.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.badge}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatDateTime(ticket.data_abertura)}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 mt-2 group-hover:text-sky-300 transition-colors">
                    {ticket.titulo}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {ticket.descricao}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {ticket.cliente?.nome_fantasia || ticket.cliente?.razao_social || 'Cliente'}
                    </span>
                    <span className="font-semibold text-slate-300">
                      {formatCurrency(ticket.valor_servico)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Distribuição por Categorias e Equipe */}
        <div className="space-y-6">
          {/* Distribuição por Categoria */}
          <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Chamados por Especialidade
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-sky-400" /> Microinformática
                  </span>
                  <span className="text-sky-400 font-mono">{catMicro} chamados</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all" 
                    style={{ width: `${totalChamados > 0 ? (catMicro / totalChamados) * 100 : 33}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" /> Infraestrutura de TI
                  </span>
                  <span className="text-cyan-400 font-mono">{catInfra} chamados</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all" 
                    style={{ width: `${totalChamados > 0 ? (catInfra / totalChamados) * 100 : 33}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-400" /> Banco de Dados
                  </span>
                  <span className="text-purple-400 font-mono">{catDB} chamados</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all" 
                    style={{ width: `${totalChamados > 0 ? (catDB / totalChamados) * 100 : 33}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipe Técnica & Clientes Ativos */}
          <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Recursos Operacionais
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <Link href="/tecnicos" className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors">
                <p className="text-xl font-bold text-cyan-400">{tecnicos.length}</p>
                <p className="text-[11px] text-slate-400">Técnicos Ativos</p>
              </Link>
              <Link href="/clientes" className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors">
                <p className="text-xl font-bold text-emerald-400">{clientes.length}</p>
                <p className="text-[11px] text-slate-400">Empresas / Clientes</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
