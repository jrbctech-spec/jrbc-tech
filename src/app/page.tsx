'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import {
  Monitor, Server, Database, Layers, Shield, Zap, Clock, Star,
  ArrowRight, CheckCircle2, Phone, Mail, Menu, X, LogIn,
  Newspaper, ChevronRight, Award, Users, FileText, Headphones
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const SERVICES = [
  {
    icon: Monitor,
    title: 'Microinformática',
    color: 'sky',
    items: ['Formatação e Instalação de SO', 'Upgrade de SSD e Memória RAM', 'Remoção de Vírus e Malwares', 'Configuração de Impressoras em Rede'],
    desc: 'Suporte completo para computadores, notebooks e periféricos corporativos.',
  },
  {
    icon: Server,
    title: 'Infraestrutura de TI',
    color: 'cyan',
    items: ['Configuração de Firewall e VPN', 'Servidores e Armazenamento', 'Redes Wi-Fi Corporativas', 'Cabeamento Estruturado'],
    desc: 'Projetos e manutenção de toda a infraestrutura crítica da sua empresa.',
  },
  {
    icon: Database,
    title: 'Banco de Dados',
    color: 'violet',
    items: ['Backup e Recuperação de Dados', 'Otimização de Queries', 'Disaster Recovery', 'Migração e Modelagem'],
    desc: 'Gestão especializada de bancos de dados PostgreSQL, MySQL e SQL Server.',
  },
  {
    icon: Layers,
    title: 'Projetos Especiais',
    color: 'amber',
    items: ['Implantação de ERP e CRM', 'Automação de Processos TI', 'Consultoria Estratégica', 'Migração para Nuvem'],
    desc: 'Soluções customizadas para demandas complexas e projetos de transformação digital.',
  },
];

const STATS = [
  { value: '500+', label: 'Chamados Atendidos' },
  { value: '98%', label: 'Satisfação dos Clientes' },
  { value: '2h', label: 'SLA Crítico Garantido' },
  { value: '24/7', label: 'Suporte Disponível' },
];

export default function LandingPage() {
  const { noticias } = useTickets();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNoticias = noticias.filter(n => n.ativo).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-navy-900 text-white overflow-x-hidden">

      {/* ====== HEADER PÚBLICO ====== */}
      <header className="sticky top-0 z-50 border-b border-sky-950/50 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center shadow-glow-cyan">
              <img src="/logo-jrbtc.svg" alt="JRBTC-TECH" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">JRBTC-TECH</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide leading-none">Soluções em TI</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#servicos" className="hover:text-sky-400 transition-colors">Serviços</a>
            <a href="#noticias" className="hover:text-sky-400 transition-colors">Notícias TI</a>
            <a href="#contato" className="hover:text-sky-400 transition-colors">Contato</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 hover:from-sky-400 hover:to-cyan-400 transition-all min-h-[40px]">
                <Zap className="w-3.5 h-3.5" /> Acessar Painel
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sky-500/40 text-sky-300 font-bold text-xs hover:bg-sky-500/10 transition-colors min-h-[40px]">
                  <LogIn className="w-3.5 h-3.5" /> Entrar
                </Link>
                <Link href="/login" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 hover:from-sky-400 hover:to-cyan-400 transition-all min-h-[40px]">
                  Acessar Sistema <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col p-6">
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-lg text-sky-400">JRBTC-TECH</span>
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
          </div>
          <nav className="flex flex-col gap-4 text-base font-bold text-slate-200">
            <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-slate-800">Nossos Serviços</a>
            <a href="#noticias" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-slate-800">Notícias TI</a>
            <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="py-3 border-b border-slate-800">Contato e Suporte</a>
          </nav>
          <div className="mt-auto space-y-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-4 text-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-base shadow-glow-cyan">
              Acessar Sistema / Entrar
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 text-center rounded-2xl border border-sky-500/30 text-sky-300 font-semibold text-sm">
              Sou cliente novo — Cadastrar
            </Link>
          </div>
        </div>
      )}

      {/* ====== HERO SECTION ====== */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(14,165,233,0.15)_0%,_transparent_65%)] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-semibold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Service Desk Ativo 24/7 — Atendimento em Todo o Brasil
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Suporte de TI{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              Especializado
            </span>
            <br />para Empresas de Todos os Portes
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A <strong className="text-white">JRBTC-TECH</strong> oferece atendimento técnico presencial e remoto em
            Microinformática, Infraestrutura de TI, Banco de Dados e Projetos Especiais.
            Abra seu chamado, acompanhe em tempo real e assine a Ordem de Serviço pelo celular.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all min-h-[56px] text-base">
              <FileText className="w-5 h-5" /> Abrir Chamado Técnico
            </Link>
            <a href="#servicos" className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-700 hover:border-sky-500/40 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all min-h-[56px] text-base">
              Ver Nossos Serviços <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-400">{stat.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SERVIÇOS ====== */}
      <section id="servicos" className="py-20 px-4 sm:px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest">
              <Layers className="w-4 h-4" /> Portfólio de Serviços
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Especialidades Técnicas JRBTC</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Cobrimos todas as necessidades de TI da sua empresa com técnicos certificados e SLA garantido.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              const colorMap: Record<string, string> = {
                sky: 'from-sky-500/20 to-sky-500/5 border-sky-500/30 text-sky-400',
                cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
                violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400',
                amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
              };
              const classes = colorMap[srv.color];
              return (
                <div key={srv.title} className={`p-6 rounded-2xl bg-gradient-to-b ${classes} border group hover:scale-[1.02] transition-all duration-200 space-y-4`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-950/60 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${classes.split(' ')[3]}`} />
                  </div>
                  <h3 className="font-bold text-base text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
                  <ul className="space-y-1.5">
                    {srv.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className={`flex items-center gap-1 text-xs font-bold ${classes.split(' ')[3]} hover:underline`}>
                    Solicitar Atendimento <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== COMO FUNCIONA ====== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Fluxo de Atendimento
            </div>
            <h2 className="text-3xl font-extrabold text-white">Como Funciona o Atendimento</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '01', icon: FileText, title: 'Abra seu Chamado', desc: 'Informe o equipamento, problema e fotos pelo celular ou computador.' },
              { n: '02', icon: Shield, title: 'Pague via PIX', desc: 'Realize o pagamento seguro e seu chamado entra na fila instantaneamente.' },
              { n: '03', icon: Zap, title: 'Técnico Atende', desc: 'Um especialista aceita e vai até você. Você recebe notificações em tempo real.' },
              { n: '04', icon: CheckCircle2, title: 'Assine e Finalize', desc: 'Assine a Ordem de Serviço na tela do celular e o chamado é encerrado.' },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-sky-400/30">{step.n}</span>
                    <Icon className="w-5 h-5 text-sky-400" />
                  </div>
                  <h3 className="font-bold text-sm text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== MURAL DE NOTÍCIAS ====== */}
      {publicNoticias.length > 0 && (
        <section id="noticias" className="py-20 px-4 sm:px-6 bg-slate-950/60">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                <Newspaper className="w-4 h-4" /> Mural de Notícias
              </div>
              <h2 className="text-3xl font-extrabold text-white">Novidades em Tecnologia e JRBTC-TECH</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publicNoticias.map((n) => (
                <div key={n.id} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-sky-500/30 transition-all group">
                  {n.imagem_url && (
                    <div className="h-44 overflow-hidden">
                      <img src={n.imagem_url} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <p className="text-[11px] text-sky-400 font-semibold">{n.autor} · {formatDate(n.data_publicacao)}</p>
                    <h3 className="font-bold text-sm text-white line-clamp-2">{n.titulo}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3">{n.resumo || n.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== CONTATO / CTA FINAL ====== */}
      <section id="contato" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 border border-sky-500/30 shadow-2xl text-center space-y-6">
            <Headphones className="w-12 h-12 text-sky-400 mx-auto" />
            <h2 className="text-3xl font-extrabold text-white">Precisa de Suporte Agora?</h2>
            <p className="text-slate-300 text-sm">Entre em contato via e-mail ou WhatsApp. Nossa equipe responde em minutos durante o horário comercial e em até 2 horas em emergências críticas.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:jrbctech@gmail.com" className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-500/40 text-slate-200 font-semibold text-sm transition-colors min-h-[48px]">
                <Mail className="w-4 h-4 text-sky-400" /> jrbctech@gmail.com
              </a>
              <a href="https://wa.me/5563981213180?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20t%C3%A9cnico%20da%20JRBTC-TECH" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors min-h-[48px]">
                <Phone className="w-4 h-4" /> (63) 98121-3180 (WhatsApp)
              </a>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold shadow-glow-cyan transition-all min-h-[52px]">
              Abrir Chamado Online <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-slate-900 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center">
              <img src="/logo-jrbtc.svg" alt="JRBTC-TECH" className="w-5 h-5 object-contain" />
            </div>
            <span><strong className="text-slate-300">JRBTC-TECH</strong> · CNPJ 45.123.456/0001-89</span>
          </div>
          <span>© {new Date().getFullYear()} JRBTC-TECH Soluções em TI · Todos os direitos reservados</span>
          <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
            Acesso ao Sistema →
          </Link>
        </div>
      </footer>
    </div>
  );
}
