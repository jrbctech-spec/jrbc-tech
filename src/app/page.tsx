'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTickets } from '@/context/TicketContext';
import {
  Monitor, Server, Database, Layers, Shield, Zap, Clock, Star,
  ArrowRight, CheckCircle2, Phone, Mail, Menu, X, LogIn,
  Newspaper, ChevronRight, Award, Users, FileText, Headphones,
  MapPin, Activity, CheckSquare, ExternalLink, Download, FileCheck, Lock,
  MessageSquare, UserCheck, Briefcase, Cpu, Bot, Sparkles, Building, Rocket
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function LandingPage() {
  const { noticias } = useTickets();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNoticias = noticias.filter(n => n.ativo).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-100 overflow-x-hidden font-sans selection:bg-[#00e676]/30 selection:text-[#00e676] relative">

      {/* ====== HEADER PÚBLICO EXECUTIVO ====== */}
      <header className="sticky top-0 z-50 border-b border-emerald-950/40 bg-[#05080f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

          {/* LOGO OFICIAL JRBC TECH */}
          <Link href="/" className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00e676]/40 shadow-[0_0_15px_rgba(0,230,118,0.25)] shrink-0 bg-slate-950 flex items-center justify-center">
              <img src="/logo.png" alt="JRBC TECH" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col shrink-0 whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">JRBC</span>
                <span className="font-extrabold text-xl tracking-tight text-[#00e676]">TECH</span>
              </div>
              <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#d4af37] uppercase leading-none">GLOBAL INNOVATIONS</span>
            </div>
          </Link>

          {/* MENU NAVEGAÇÃO DEKTOP */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#sobre" className="hover:text-[#00e676] transition-colors">A JRBC Tech</a>
            <a href="#saas-produtos" className="hover:text-[#00e676] transition-colors">Produtos & SaaS</a>
            <a href="#alocacao" className="hover:text-[#00e676] transition-colors">Alocação de Profissionais</a>
            <a href="#ia-sistemas" className="hover:text-[#00e676] transition-colors">Sistemas por IA</a>
            <a href="#servicos" className="hover:text-[#00e676] transition-colors">Serviços</a>
            <a href="#compliance" className="hover:text-[#00e676] transition-colors">Compliance B2B</a>
            <a href="#contato" className="hover:text-[#00e676] transition-colors">Contato</a>
          </nav>

          {/* BOTAO DESTACADO ÁREA DO CLIENTE / PORTAL DE CHAMADOS */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            {user ? (
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e676] to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,230,118,0.3)] flex items-center gap-2 transition-all min-h-[42px]">
                <Zap className="w-4 h-4 fill-slate-950" /> Painel de Chamados
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/30 hover:border-[#00e676] text-slate-200 hover:text-[#00e676] font-bold text-xs transition-all min-h-[42px] bg-slate-900/50">
                  <LogIn className="w-3.5 h-3.5" /> Entrar
                </Link>
                <Link href="/login" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-[#00e676] hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,230,118,0.3)] flex items-center gap-2 transition-all min-h-[42px] uppercase tracking-wide">
                  <FileText className="w-4 h-4" /> Portal de Chamados
                </Link>
              </div>
            )}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 text-slate-300 hover:text-[#00e676] bg-slate-900/80 rounded-xl border border-slate-800">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#05080f]/98 backdrop-blur-xl flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="JRBC TECH" className="w-9 h-9 rounded-full border border-[#00e676]" />
              <div>
                <span className="font-extrabold text-lg text-white">JRBC TECH</span>
                <p className="text-[9px] font-bold text-[#d4af37]">GLOBAL INNOVATIONS</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <nav className="flex flex-col gap-4 py-6 text-base font-bold text-slate-200">
            <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">A JRBC Tech</a>
            <a href="#saas-produtos" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">Produtos & SaaS</a>
            <a href="#alocacao" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">Alocação de Profissionais</a>
            <a href="#ia-sistemas" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">Sistemas por IA</a>
            <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">Serviços</a>
            <a href="#compliance" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">Compliance B2B</a>
            <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-slate-800/60">Contato</a>
          </nav>
          <div className="mt-auto pt-6 space-y-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-4 text-center rounded-2xl bg-gradient-to-r from-[#00e676] to-emerald-500 text-slate-950 font-extrabold text-base shadow-[0_0_20px_rgba(0,230,118,0.4)]">
              Portal de Chamados / Área do Cliente
            </Link>
          </div>
        </div>
      )}

      {/* ====== HERO SECTION ====== */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(0,230,118,0.12)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/60 border border-[#00e676]/40 text-xs font-extrabold text-[#00e676] shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] animate-ping" />
            PLATAFORMA SAAS & INFRAESTRUTURA DE TI PARA ÓRGÃOS PÚBLICOS E EMPRESAS PRIVADAS
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight max-w-5xl mx-auto text-white">
            Soluções SaaS, Nomeação de Profissionais &{' '}
            <span className="bg-gradient-to-r from-[#00e676] via-emerald-300 to-[#d4af37] bg-clip-text text-transparent">
              Sistemas Guiados por Inteligência Artificial
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            A <strong className="text-white">JRBC TECH TECNOLOGIA LTDA</strong> oferece contratação direta de produtos de infraestrutura, nomeação de engenheiros de TI alocados e plataformas SaaS com copiloto de IA para gestão de chamados, manutenção preditiva e suporte de missão crítica.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(0,230,118,0.35)] flex items-center justify-center gap-2.5 transition-all min-h-[56px]">
              <FileText className="w-5 h-5 fill-slate-950" /> Portal de Chamados / Área do Cliente
            </Link>
            <a href="#saas-produtos" className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-700 hover:border-[#00e676] bg-slate-900/60 text-slate-200 hover:text-white font-bold text-base flex items-center justify-center gap-2 transition-all min-h-[56px]">
              Ver Produtos & Catálogo SaaS <ChevronRight className="w-5 h-5 text-[#00e676]" />
            </a>
          </div>

          {/* Destaques Rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            {[
              { val: 'Contratos B2B', lbl: 'Órgãos Públicos & Privados' },
              { val: 'Staffing TI', lbl: 'Nomeação de Especialistas' },
              { val: 'AI Copilot', lbl: 'Automação de Sistemas' },
              { val: '99.9%', lbl: 'Uptime & SLA Garantido' },
            ].map(st => (
              <div key={st.lbl} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#00e676]">{st.val}</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">{st.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SEÇÃO NOX: MÓDULO SAAS & PRODUTOS CORPORATIVOS ====== */}
      <section id="saas-produtos" className="py-20 px-4 sm:px-6 bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-widest">
              <Rocket className="w-4 h-4" /> Ecossistema SaaS JRBC TECH
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Catálogo de Produtos & Soluções Contratáveis</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Contrate produtos de infraestrutura de TI como serviço (SaaS), com licenciamento flexível, suporte presencial e monitoramento inteligente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-[#00e676] transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-xl text-white">JRBC ServiceDesk SaaS</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Plataforma PWA completa de abertura e controle de chamados com protocolo sequencial, assinatura digital em PDF e notificações automáticas.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Relatórios de SLA em Tempo Real</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Ordens de Serviço em PDF com Assinatura</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Multi-Perfil (Admin, Técnico, Cliente)</li>
                </ul>
              </div>
              <Link href="/login" className="w-full py-3 rounded-xl bg-[#00e676] hover:bg-emerald-400 text-slate-950 font-extrabold text-xs text-center block shadow-md uppercase tracking-wider">
                Contratar para Empresa
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-[#00e676] transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-xl text-white">Sustentação de Datacenter SaaS</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sustentação proativa de servidores Dell PowerEdge, storage em nuvem corporativa e switches de núcleo Cisco com tempo de resposta garantido.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Monitoramento Zabbix & Grafana 24/7</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Gestão de Discos Hot-Swap e RAID</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Backup Automatizado & Disaster Recovery</li>
                </ul>
              </div>
              <a href="#contato" className="w-full py-3 rounded-xl border border-slate-700 hover:border-[#00e676] text-white font-extrabold text-xs text-center block uppercase tracking-wider">
                Solicitar Cotação B2B
              </a>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-[#00e676] transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-xl text-white">Sistemas Manuseados por IA</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assistente de diagnóstico avançado treinado para apoio a chamados técnicos, análise de erros em bancos de dados e copiloto de TI.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Integração Meta AI & LLMs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Diagnóstico Prévio Automático</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Análise de Inconsistências de Rede</li>
                </ul>
              </div>
              <Link href="/login" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs text-center block shadow-md uppercase tracking-wider">
                Acessar Copiloto de IA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SEÇÃO NOMEAÇÃO E ALOCAÇÃO DE PROFISSIONAIS ====== */}
      <section id="alocacao" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#05080f] to-slate-950 border border-emerald-950 shadow-2xl space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-widest">
                <UserCheck className="w-4 h-4" /> Nomeação & Staffing Especializado
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Contratação de Profissionais de TI por Nomeação e Alocação Dedicada
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Oferecemos a nomeação formal de engenheiros, analistas de redes N3 e especialistas em infraestrutura de TI para atuação presencial ou remota em **Órgãos Públicos** (via licitação, dispensa ou contrato público) e **Empresas Privadas**.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Building className="w-8 h-8 text-[#00e676]" />
                <h3 className="font-bold text-base text-white">Órgãos Públicos</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Atendimento integral a termos de referência, portarias de nomeação técnica e editais públicos com compliance B2B.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Briefcase className="w-8 h-8 text-[#00e676]" />
                <h3 className="font-bold text-base text-white">Empresas Privadas & Integradoras</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Alocação de especialistas certificados em Cisco, Dell e Linux para projetos corporativos e sustentação temporária.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Award className="w-8 h-8 text-[#d4af37]" />
                <h3 className="font-bold text-base text-white">Técnicos Certificados N1, N2 e N3</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Corpo técnico capacitado e pronto para assumir demandas de campo com acompanhamento por Ordem de Serviço em PDF.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-800/80">
              <a href="https://wa.me/5563981213180?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20a%20nomea%C3%A7%C3%A3o%2Faloca%C3%A7%C3%A3o%20de%20um%20profissional%20de%20TI." target="_blank" rel="noreferrer" className="px-6 py-3.5 rounded-xl bg-[#00e676] hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md uppercase tracking-wider">
                <Phone className="w-4 h-4 fill-slate-950" /> Solicitar Nomeação Profissional
              </a>
              <a href="mailto:contato@jrbctech.com.br" className="px-6 py-3.5 rounded-xl border border-slate-700 hover:border-[#00e676] text-slate-200 font-extrabold text-xs flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00e676]" /> Enviar Termo de Referência
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SEÇÃO SISTEMAS MANUSEADOS POR IA ====== */}
      <section id="ia-sistemas" className="py-20 px-4 sm:px-6 bg-slate-950/70 border-t border-slate-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Inteligência Artificial Aplicada a TI
            </div>
            <h2 className="text-3xl font-extrabold text-white">Manuseio de Sistemas e Suporte Guiados por IA</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Nossa plataforma combina a expertise humana da equipe técnica com algoritmos de Meta AI e LLMs para diagnósticos ultra-rápidos e redução do tempo de parada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <Bot className="w-10 h-10 text-[#00e676]" />
              <h3 className="font-extrabold text-lg text-white">Copiloto no Chat de Atendimento</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Técnicos e clientes têm acesso ao assistente **Meta AI** integrado diretamente no chat dos chamados (`/chamados/[id]`), gerando sugestões imediatas de resolução técnica e comandos de rede.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <Activity className="w-10 h-10 text-[#00e676]" />
              <h3 className="font-extrabold text-lg text-white">Análise Preditiva de Falhas</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Algoritmos que analisam históricos de chamados e falhas recorrentes em servidores, sugerindo upgrades antes mesmo que uma interrupção crítica ocorra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== A JRBC TECH (SOBRE) ====== */}
      <section id="sobre" className="py-20 px-4 sm:px-6 bg-slate-950/70 border-y border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-widest">
              <Shield className="w-4 h-4" /> A Empresa
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Garantia de Alta Disponibilidade & Continuidade Operacional
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A <strong className="text-white">JRBC TECH TECNOLOGIA LTDA</strong> é uma empresa especializada em prestação de serviços técnicos avançados de TI, field service corporativo e governança de infraestrutura.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Combinamos capacitação técnica certificada, monitoramento proativo com Zabbix/Grafana e metodologias alinhadas ao ITIL v4 para eliminar pontos únicos de falha e maximizar o uptime de empresas públicas e privadas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Corpo Técnico Especializado',
                'Atendimento Presencial em Palmas e Região',
                'Sustentação de Datacenters & Redes',
                'Emissão de O.S. e Laudo Técnico com Assinatura',
              ].map(feat => (
                <div key={feat} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                  {feat}
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-950/60 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-full border-2 border-[#00e676] overflow-hidden shrink-0">
                <img src="/logo.png" alt="JRBC TECH" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">JRBC TECH TECNOLOGIA LTDA</h3>
                <p className="text-xs text-[#00e676] font-semibold">Corpo Técnico Especializado & Governança ITSM</p>
                <p className="text-[11px] text-slate-400 mt-1">CNPJ: 65.488.003/0001-61 • Palmas - TO</p>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p><strong>Missão:</strong> Entregar sustentação de TI resiliente de padrão corporativo com tempo de resposta imediato para clientes críticos.</p>
              <p><strong>Visão:</strong> Ser a principal referência em Field Service N3 e governança de infraestrutura no estado do Tocantins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SERVIÇOS ====== */}
      <section id="servicos" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-widest">
              <Layers className="w-4 h-4" /> Portfólio Especializado
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Serviços de Engenharia de TI</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Atendimento técnico N1, N2 e N3 abrangendo todas as camadas da sua infraestrutura corporativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Server, title: 'Sustentação de Servidores & Storage', items: ['Diagnóstico e troca de discos Hot-Swap em Racks Dell PowerEdge', 'Configuração de arranjos RAID e atualização de iDRAC/Firmwares', 'Virtualização VMware ESXi e Proxmox VE'] },
              { icon: Zap, title: 'Redes & Conectividade Avançada', items: ['Configuração de Switches Gerenciáveis Cisco / HP / Aruba', 'Roteamento, VLANs, Troncos 802.1Q e VPNs IPsec', 'Certificação e organização de cabeamento estruturado Cat6'] },
              { icon: Activity, title: 'Field Service & Suporte N1, N2, N3', items: ['Atendimento presencial em campo em até 2 horas', 'Manutenção corretiva e preventiva de estações e periféricos', 'Backup corporativo automatizado e Disaster Recovery'] },
              { icon: Database, title: 'Banco de Dados & Aplicações', items: ['Administração e otimização de PostgreSQL, MySQL e SQL Server', 'Automação de rotinas de backup e monitoramento contínuo', 'Manutenção de sistemas e suporte a banco de dados corporativo'] },
              { icon: Shield, title: 'Segurança da Informação & Firewall', items: ['Implementação de Firewalls PFsenese, Fortinet e Sophos', 'Filtro de conteúdo, prevenção de intrusão e controle de acesso', 'Políticas de segurança alinhadas à LGPD'] },
              { icon: Monitor, title: 'Projetos e Consultoria ITSM', items: ['Auditoria de infraestrutura de TI e relatório de riscos', 'Mapeamento de processos baseado em ITIL v4', 'Consultoria estratégica para modernização de infraestrutura'] },
            ].map(srv => {
              const Icon = srv.icon;
              return (
                <div key={srv.title} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#00e676]/50 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-emerald-950/80 flex items-center justify-center text-[#00e676]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white">{srv.title}</h3>
                  <ul className="space-y-2">
                    {srv.items.map(it => (
                      <li key={it} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00e676] shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== COMPLIANCE B2B ====== */}
      <section id="compliance" className="py-20 px-4 sm:px-6 bg-slate-950/70 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-widest">
              <Award className="w-4 h-4" /> Qualificação Técnica
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Certificações & Metodologias</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Nosso corpo técnico possui especializações continuamente atualizadas para garantir conformidade técnica e segurança da informação.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> ITIL v4 Foundation — Gestão de Serviços de TI</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Cisco CCNA / Network Associate</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Dell Technologies Associate & Specialist</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00e676]" /> Zabbix Certified Specialist & Grafana Analytics</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-widest">
              <FileCheck className="w-4 h-4" /> Governança B2B
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Compliance & Dados Societários</h2>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p><strong>Razão Social:</strong> JRBC TECH TECNOLOGIA LTDA</p>
              <p><strong>Nome Fantasia:</strong> JRBC TECH TECNOLOGIA</p>
              <p><strong>CNPJ:</strong> 65.488.003/0001-61</p>
              <p><strong>Endereço da Sede:</strong> Quadra ACSV SE 32, Av. LO 05, Lote 22, Nº 22, Plano Diretor Sul, Palmas – TO, CEP: 77.021-026</p>
              <p><strong>E-mails Oficiais:</strong> contato@jrbctech.com.br / jrbctech@gmail.com</p>
              <p><strong>WhatsApp Comercial:</strong> (63) 98121-3180</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NOTÍCIAS TI ====== */}
      {publicNoticias.length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-widest">
                <Newspaper className="w-4 h-4" /> Notícias & Comunicação
              </div>
              <h2 className="text-3xl font-extrabold text-white">Informativos da JRBC TECH</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publicNoticias.map(n => (
                <div key={n.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <p className="text-[11px] font-bold text-[#00e676]">{n.autor} • {formatDate(n.data_publicacao)}</p>
                  <h3 className="font-bold text-sm text-white">{n.titulo}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3">{n.resumo || n.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== SEÇÃO CONTATO / SUPORTE ====== */}
      <section id="contato" className="py-20 px-4 sm:px-6 bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#05080f] to-slate-950 border border-emerald-950/80 shadow-2xl text-center space-y-6">
            <Headphones className="w-12 h-12 text-[#00e676] mx-auto" />
            <h2 className="text-3xl font-extrabold text-white">Central de Atendimento & Suporte Técnico</h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Precisa abrir um chamado ou solicitar atendimento presencial? Acesse o Portal de Chamados ou entre em contato com nosso corpo técnico.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a href="https://wa.me/5563981213180?text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20t%C3%A9cnico%20da%20JRBC%20TECH" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors min-h-[48px]">
                <Phone className="w-4 h-4" /> (63) 98121-3180 (WhatsApp)
              </a>
              <a href="mailto:contato@jrbctech.com.br" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#00e676] text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors min-h-[48px]">
                <Mail className="w-4 h-4 text-[#00e676]" /> contato@jrbctech.com.br
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00e676] to-emerald-500 text-slate-950 font-extrabold text-sm shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:brightness-110 transition-all uppercase tracking-wide">
                <FileText className="w-4 h-4 fill-slate-950" /> Portal de Chamados / Área do Cliente
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== WIDGET FLUTUANTE DE WHATSAPP / SUPORTE RÁPIDO ====== */}
      <a
        href="https://wa.me/5563981213180?text=Ol%C3%A1!%20Gostaria%20de%20suporte%20t%C3%A9cnico%20da%20JRBC%20TECH."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(0,230,118,0.5)] transition-all hover:scale-105 group"
        aria-label="Atendimento via WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-slate-950" />
        <span className="hidden sm:inline font-extrabold uppercase tracking-wide">Atendimento WhatsApp</span>
      </a>

      {/* ====== FOOTER OFICIAL ====== */}
      <footer className="border-t border-slate-900 py-10 px-4 sm:px-6 bg-[#03050a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#00e676]/40 overflow-hidden shrink-0">
              <img src="/logo.png" alt="JRBC TECH" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-slate-200 font-bold">JRBC TECH TECNOLOGIA LTDA</p>
              <p className="text-[10px] text-slate-400">CNPJ 65.488.003/0001-61 • Palmas – TO</p>
            </div>
          </div>

          <p className="text-center md:text-left">
            © {new Date().getFullYear()} JRBC TECH TECNOLOGIA LTDA • GLOBAL INNOVATIONS. Todos os direitos reservados.
          </p>

          <Link href="/login" className="text-[#00e676] hover:underline font-bold flex items-center gap-1">
            Portal de Chamados →
          </Link>
        </div>
      </footer>

    </div>
  );
}
