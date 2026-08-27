'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { 
  LayoutDashboard, 
  LifeBuoy, 
  PlusCircle, 
  Building2, 
  UserCog, 
  Layers, 
  Newspaper, 
  Settings, 
  Headphones,
  FileText,
  DollarSign
} from 'lucide-react';
import { ROLE_MAP } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, user } = useAuth();
  const { chamados } = useTickets();

  const activeCount = chamados.filter(c => ['PAGO', 'ACEITO', 'A_CAMINHO', 'EM_ATENDIMENTO', 'AGUARDANDO_ASSINATURA', 'ABERTO'].includes(c.status)).length;
  const repasseCount = chamados.filter(c => c.status === 'AGUARDANDO_REPASSE').length;

  const navItems = [
    {
      label: 'Painel Principal',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'TECNICO', 'CLIENTE'],
    },
    {
      label: role === 'CLIENTE' ? 'Meus Chamados' : 'Fila de Chamados',
      href: '/chamados',
      icon: LifeBuoy,
      badge: activeCount > 0 ? activeCount : undefined,
      roles: ['ADMIN', 'TECNICO', 'CLIENTE'],
    },
    {
      label: 'Abrir Chamado',
      href: '/chamados/novo',
      icon: PlusCircle,
      highlight: true,
      roles: ['ADMIN', 'CLIENTE'],
    },
    {
      label: 'Mural de Notícias',
      href: '/noticias',
      icon: Newspaper,
      roles: ['ADMIN', 'TECNICO', 'CLIENTE'],
    },
    {
      label: 'Gestão de Clientes',
      href: '/clientes',
      icon: Building2,
      roles: ['ADMIN'],
    },
    {
      label: 'Equipe Técnica',
      href: '/tecnicos',
      icon: UserCog,
      roles: ['ADMIN'],
    },
    {
      label: 'Catálogo de Serviços',
      href: '/servicos',
      icon: Layers,
      roles: ['ADMIN'],
    },
    {
      label: 'Módulo Financeiro',
      href: '/financeiro',
      icon: DollarSign,
      badge: repasseCount > 0 ? repasseCount : undefined,
      roles: ['ADMIN'],
    },
    {
      label: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-sky-950/40 bg-slate-950/90 backdrop-blur-md p-4 justify-between z-30">
      <div>
        {/* Brand Logo & Name */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-glow-cyan flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo-jrbtc.svg" alt="JRBTC-TECH" className="w-full h-full object-contain rounded-[10px]" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base tracking-wider bg-gradient-to-r from-sky-400 via-cyan-300 to-white bg-clip-text text-transparent">
              JRBTC-TECH
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              {role === 'CLIENTE' ? 'Portal do Cliente' : role === 'TECNICO' ? 'Portal do Técnico' : 'Painel Administrativo'}
            </p>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Navegação
          </p>
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-glow-cyan font-semibold'
                    : item.highlight
                    ? 'bg-gradient-to-r from-sky-900/40 to-cyan-900/40 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-sky-300'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Box de Suporte Imediato */}
      <div className="mt-auto pt-4 border-t border-slate-900">
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-sky-950/40 to-slate-900/60 border border-sky-500/20">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
            <Headphones className="w-4 h-4" />
            <span>Central JRBTC-TECH</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Precisa de atendimento de infraestrutura ou banco de dados?
          </p>
          <a
            href="mailto:jrbctech@gmail.com"
            className="block text-center text-[11px] font-medium py-1.5 px-2.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-colors"
          >
            jrbctech@gmail.com
          </a>
        </div>
      </div>
    </aside>
  );
};
