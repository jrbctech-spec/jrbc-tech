'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { 
  PlusCircle, 
  LifeBuoy, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  Newspaper, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { formatDateTime, PRIORITY_MAP, STATUS_MAP } from '@/lib/utils';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { chamados, noticias, configuracoes } = useTickets();

  const myCompanyTickets = chamados.filter(c => c.cliente_id === user?.cliente_id);
  const activeTickets = myCompanyTickets.filter(c => c.status !== 'FINALIZADO' && c.status !== 'CANCELADO');
  const finishedTickets = myCompanyTickets.filter(c => c.status === 'FINALIZADO');

  const suporteEmail = configuracoes.find(c => c.chave === 'empresa_email_suporte')?.valor || 'jrbctech@gmail.com';
  const suporteTel = configuracoes.find(c => c.chave === 'empresa_telefone')?.valor || '(63) 98121-3180';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner de Boas-Vindas para o Cliente */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-navy-950 border border-sky-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Portal de Autoatendimento do Cliente</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bem-vindo, {user?.nome || 'Cliente'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Abra novas solicitações técnicas, acompanhe o diagnóstico da equipe da <strong>JRBTC-TECH</strong> e consulte suas Ordens de Serviço.
            </p>
          </div>

          <Link
            href="/chamados/novo"
            className="self-start md:self-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-cyan flex items-center gap-2.5 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Abrir Novo Chamado</span>
          </Link>
        </div>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card border-sky-500/20 glass-card-hover flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Chamados em Andamento</span>
            <p className="text-3xl font-extrabold text-sky-400 mt-1">{activeTickets.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-emerald-500/20 glass-card-hover flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Chamados Concluídos</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{finishedTickets.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-purple-500/20 glass-card-hover flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total de Solicitações</span>
            <p className="text-3xl font-extrabold text-purple-400 mt-1">{myCompanyTickets.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/15 text-purple-400">
            <LifeBuoy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Seção Principal: Meus Chamados Ativos e Mural */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Chamados Ativos */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-sky-400" />
              Minhas Solicitações em Aberto
            </h3>
            <Link href="/chamados" className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
              Ver histórico completo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeTickets.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-900/40 rounded-xl border border-slate-800/80">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-slate-200">Nenhum chamado pendente!</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Todos os sistemas da sua empresa estão operando normalmente. Caso precise de suporte, abra um novo chamado.
                </p>
                <Link
                  href="/chamados/novo"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
                >
                  <PlusCircle className="w-4 h-4" /> Abrir Solicitação
                </Link>
              </div>
            ) : (
              activeTickets.map((ticket) => {
                const statusInfo = STATUS_MAP[ticket.status];
                const priorityInfo = PRIORITY_MAP[ticket.prioridade];

                return (
                  <Link
                    key={ticket.id}
                    href={`/chamados/${ticket.id}`}
                    className="block p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-sky-400">{ticket.numero_chamado}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityInfo.badge}`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.badge}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                      {ticket.titulo}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {ticket.descricao}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Categoria: <strong className="text-slate-300">{ticket.categoria?.nome || 'TI'}</strong></span>
                      <span>Aberto em {formatDateTime(ticket.data_abertura)}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Lado Direito: Mural de Notícias & Contato Rápido */}
        <div className="space-y-6">
          {/* Mural de Notícias */}
          <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-cyan-400" />
                Mural de Notícias TI
              </h3>
              <Link href="/noticias" className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
                Ver todas
              </Link>
            </div>

            <div className="space-y-3">
              {noticias.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href="/noticias"
                  className="block p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 transition-all"
                >
                  <h4 className="text-xs font-semibold text-slate-200 hover:text-cyan-300 line-clamp-1">
                    {item.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {item.resumo || item.texto}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Central de Atendimento e Contato Direto */}
          <div className="p-5 rounded-2xl glass-card border-sky-500/30 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-sky-400" />
              Canais Diretos JRBTC-TECH
            </h3>
            <p className="text-xs text-slate-400">
              Dúvidas urgentes ou suporte emergencial:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href={`mailto:${suporteEmail}`}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/70 hover:bg-sky-950/50 border border-slate-800 text-slate-200 transition-colors"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span className="font-mono text-[11px]">{suporteEmail}</span>
              </a>
              <a
                href={`https://wa.me/5563981213180?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20t%C3%A9cnico%20da%20JRBTC-TECH`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/70 hover:bg-emerald-950/50 border border-slate-800 text-slate-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{suporteTel} (WhatsApp)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
