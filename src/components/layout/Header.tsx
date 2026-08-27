'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import { 
  Bell, 
  LogOut, 
  PlusCircle, 
  Menu, 
  X, 
  LifeBuoy, 
  Newspaper, 
  Building2, 
  UserCog, 
  Layers, 
  Settings, 
  Headphones,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { ROLE_MAP } from '@/lib/utils';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, role, signOut } = useAuth();
  const { chamados } = useTickets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const urgentTickets = chamados.filter(c => c.prioridade === 'CRITICA' || c.status === 'ABERTO').slice(0, 4);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const navLinks = [
    { label: 'Painel', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TECNICO', 'CLIENTE'] },
    { label: 'Chamados', href: '/chamados', icon: LifeBuoy, roles: ['ADMIN', 'TECNICO', 'CLIENTE'] },
    { label: 'Abrir Chamado', href: '/chamados/novo', icon: PlusCircle, roles: ['ADMIN', 'CLIENTE'] },
    { label: 'Mural de Notícias', href: '/noticias', icon: Newspaper, roles: ['ADMIN', 'TECNICO', 'CLIENTE'] },
    { label: 'Clientes', href: '/clientes', icon: Building2, roles: ['ADMIN'] },
    { label: 'Técnicos', href: '/tecnicos', icon: UserCog, roles: ['ADMIN'] },
    { label: 'Serviços', href: '/servicos', icon: Layers, roles: ['ADMIN'] },
    { label: 'Configurações', href: '/configuracoes', icon: Settings, roles: ['ADMIN'] },
  ];

  const visibleLinks = navLinks.filter(l => l.roles.includes(role));

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-sky-950/40 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between">
      {/* Lado Esquerdo - Botão Hamburger Mobile + Logo & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botão Hamburger Mobile (Mínimo 44px de toque) */}
        <button
          onClick={() => setShowMobileDrawer(true)}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
          aria-label="Abrir Menu"
        >
          <Menu className="w-6 h-6 text-sky-400" />
        </button>

        {/* Logo Mobile */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <img src="/logo-jrbtc.svg" alt="JRBTC-TECH" className="w-full h-full object-contain rounded-md" />
          </div>
          <span className="font-heading font-extrabold text-sm text-white tracking-wide">
            JRBTC-TECH
          </span>
        </Link>

        {/* Status Desktop */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/20 text-xs text-sky-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">JRBTC Service Desk Online</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Suporte 24/7</span>
        </div>

        {/* Badge do Papel Ativo */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          {role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
          {role === 'TECNICO' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
          {role === 'CLIENTE' && <Users className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="font-semibold text-slate-200">
            {ROLE_MAP[role]?.label || role}
          </span>
        </div>
      </div>

      {/* Lado Direito - Ações, Notificações e Usuário */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botão Abrir Chamado (Destaque) */}
        {(role === 'CLIENTE' || role === 'ADMIN') && (
          <Link
            href="/chamados/novo"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Abrir Chamado</span>
          </Link>
        )}

        {/* Notificações */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors relative"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 text-slate-400" />
            {urgentTickets.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-dropdown p-4 shadow-2xl border border-sky-500/30 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-sky-400" /> Notificações
                </h4>
                <span className="text-xs text-sky-400 font-mono">{urgentTickets.length} pendentes</span>
              </div>

              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {urgentTickets.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Nenhum chamado pendente no momento.</p>
                ) : (
                  urgentTickets.map(ticket => (
                    <Link
                      key={ticket.id}
                      href={`/chamados/${ticket.id}`}
                      onClick={() => setShowNotifications(false)}
                      className="block p-2.5 rounded-lg bg-slate-900/80 hover:bg-sky-950/50 border border-slate-800 hover:border-sky-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-sky-400 font-semibold">{ticket.numero_chamado}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${ticket.prioridade === 'CRITICA' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {ticket.prioridade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-1">{ticket.titulo}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perfil do Usuário & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
            {user?.nome?.charAt(0) || 'U'}
          </div>

          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-100 truncate max-w-[130px]">{user?.nome}</p>
            <p className="text-[10px] text-slate-400 truncate">{ROLE_MAP[role]?.label || role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menu Gaveta Mobile (Slide-out Drawer) */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-150">
          <div className="w-4/5 max-w-xs h-full bg-slate-950 border-r border-sky-950 p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Topo do Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 flex items-center justify-center">
                    <img src="/logo-jrbtc.svg" alt="JRBTC-TECH" className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">JRBTC-TECH</h3>
                    <span className="text-[10px] text-sky-400 font-semibold">{ROLE_MAP[role]?.label}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileDrawer(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informações do Usuário */}
              <div className="py-4 border-b border-slate-800 text-xs">
                <p className="text-slate-400">Conectado como:</p>
                <p className="font-bold text-white mt-0.5 truncate">{user?.nome}</p>
                <p className="text-[11px] text-sky-400 truncate">{user?.email}</p>
              </div>

              {/* Links de Navegação */}
              <nav className="py-4 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                  Menu Principal
                </p>
                {visibleLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMobileDrawer(false)}
                      className="flex items-center gap-3 p-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-sky-500/20 transition-all min-h-[44px]"
                    >
                      <Icon className="w-4 h-4 text-sky-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Rodapé do Drawer */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1 font-semibold text-sky-400">
                  <Headphones className="w-3.5 h-3.5" /> Suporte Direto
                </p>
                <p className="text-[10px] text-slate-400">jrbctech@gmail.com</p>
                <p className="text-[10px] text-slate-400">(63) 98121-3180</p>
              </div>

              <button
                onClick={() => { setShowMobileDrawer(false); handleLogout(); }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
              >
                <LogOut className="w-4 h-4" /> Sair da Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
