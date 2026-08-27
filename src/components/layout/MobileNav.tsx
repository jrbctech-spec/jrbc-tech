'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  LifeBuoy, 
  PlusCircle, 
  Newspaper, 
  Building2,
  DollarSign,
  Headphones
} from 'lucide-react';

type NavItem = { label: string; href: string; icon: React.ElementType; isAction?: boolean };

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();

  // Menus específicos mobile-first por perfil
  const clientNav: NavItem[] = [
    { label: 'Início', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Meus Chamados', href: '/chamados', icon: LifeBuoy },
    { label: 'Abrir Chamado', href: '/chamados/novo', icon: PlusCircle, isAction: true },
    { label: 'Notícias', href: '/noticias', icon: Newspaper },
  ];

  const techNav: NavItem[] = [
    { label: 'Painel', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Chamados', href: '/chamados', icon: LifeBuoy },
    { label: 'Notícias', href: '/noticias', icon: Newspaper },
  ];

  const adminNav: NavItem[] = [
    { label: 'Painel', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Chamados', href: '/chamados', icon: LifeBuoy },
    { label: 'Novo', href: '/chamados/novo', icon: PlusCircle, isAction: true },
    { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
    { label: 'Clientes', href: '/clientes', icon: Building2 },
  ];

  const activeNav = role === 'CLIENTE' ? clientNav : role === 'TECNICO' ? techNav : adminNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-slate-950/95 backdrop-blur-xl border-t border-sky-950/60 px-2 flex items-center justify-around shadow-2xl">
      {activeNav.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-6 group focus:outline-none min-w-[56px] min-h-[56px]"
              aria-label={item.label}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 via-cyan-400 to-sky-300 p-0.5 shadow-glow-cyan flex items-center justify-center text-slate-950 transition-transform active:scale-95">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white">
                  <Icon className="w-7 h-7" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-sky-400 mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all min-h-[48px] min-w-[48px] ${
              isActive ? 'text-sky-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
