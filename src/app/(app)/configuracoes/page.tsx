'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { Settings, Save, CheckCircle2, Shield, Mail, Phone, Clock, Database } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { configuracoes, updateConfiguracao } = useTickets();
  const { role } = useAuth();

  const [emailSuporte, setEmailSuporte] = useState(
    configuracoes.find((c) => c.chave === 'empresa_email_suporte')?.valor || 'jrbctech@gmail.com'
  );
  const [telefone, setTelefone] = useState(
    configuracoes.find((c) => c.chave === 'empresa_telefone')?.valor || '(63) 98121-3180'
  );
  const [nomeEmpresa, setNomeEmpresa] = useState(
    configuracoes.find((c) => c.chave === 'empresa_nome')?.valor || 'JRBTC-TECH Soluções em TI'
  );
  const [slaCritica, setSlaCritica] = useState(
    configuracoes.find((c) => c.chave === 'sla_critica_horas')?.valor || '2'
  );
  const [slaNormal, setSlaNormal] = useState(
    configuracoes.find((c) => c.chave === 'sla_normal_horas')?.valor || '24'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfiguracao('empresa_email_suporte', emailSuporte);
    await updateConfiguracao('empresa_telefone', telefone);
    await updateConfiguracao('empresa_nome', nomeEmpresa);
    await updateConfiguracao('sla_critica_horas', slaCritica);
    await updateConfiguracao('sla_normal_horas', slaNormal);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" /> Parâmetros Gerais
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configurações do Sistema JRBTC-TECH
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Dados de contato institucional, SLAs e parametrizações operacionais do Service Desk.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloco 1: Dados Institucionais */}
        <div className="p-6 rounded-2xl glass-card border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-sky-400" />
            Dados Institucionais e Notificações
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                disabled={role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Principal de Suporte</label>
              <input
                type="email"
                value={emailSuporte}
                onChange={(e) => setEmailSuporte(e.target.value)}
                disabled={role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-500">Destinatário padrão das notificações de abertura e encerramento.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp Suporte</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                disabled={role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Regras de SLA */}
        <div className="p-6 rounded-2xl glass-card border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            Regras e Limites de SLA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prazo SLA Chamado CRÍTICO (Horas)</label>
              <input
                type="number"
                value={slaCritica}
                onChange={(e) => setSlaCritica(e.target.value)}
                disabled={role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prazo SLA Chamado NORMAL (Horas)</label>
              <input
                type="number"
                value={slaNormal}
                onChange={(e) => setSlaNormal(e.target.value)}
                disabled={role !== 'ADMIN'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Status da Infraestrutura e Supabase */}
        <div className="p-6 rounded-2xl glass-card border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-purple-400" />
            Status da Conexão com Supabase & Backend
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div>
              <p className="font-semibold text-white">Modo de Operação Atual</p>
              <p className="text-[11px] text-slate-400">
                Conectado ao Supabase PostgreSQL com RLS habilitado (projeto: mfvtzqayexkmeuhcowrk)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg font-bold text-[10px] border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              SUPABASE LIVE
            </span>
          </div>
        </div>

        {role === 'ADMIN' && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
