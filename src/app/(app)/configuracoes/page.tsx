'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { Settings, Save, CheckCircle2, Shield, Mail, Phone, Clock, Database, Copy, FileCode, Check } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { configuracoes, updateConfiguracao } = useTickets();
  const { role, user } = useAuth();

  const [emailSuporte, setEmailSuporte] = useState(
    configuracoes.find((c) => c.chave === 'empresa_email_suporte')?.valor || 'contato@jrbctech.com.br'
  );
  const [telefone, setTelefone] = useState(
    configuracoes.find((c) => c.chave === 'empresa_telefone')?.valor || '(63) 98121-3180'
  );
  const [nomeEmpresa, setNomeEmpresa] = useState(
    configuracoes.find((c) => c.chave === 'empresa_nome')?.valor || 'JRBC TECH TECNOLOGIA LTDA'
  );
  const [slaCritica, setSlaCritica] = useState(
    configuracoes.find((c) => c.chave === 'sla_critica_horas')?.valor || '2'
  );
  const [slaNormal, setSlaNormal] = useState(
    configuracoes.find((c) => c.chave === 'sla_normal_horas')?.valor || '24'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados do Gerador de Assinatura de E-mail
  const [sigNome, setSigNome] = useState(user?.nome || 'Equipe de Suporte');
  const [sigCargo, setSigCargo] = useState('Especialista de TI / Field Service');
  const [sigEmail, setSigEmail] = useState(user?.email || 'contato@jrbctech.com.br');
  const [sigTelefone, setSigTelefone] = useState('(63) 98121-3180');
  const [copied, setCopied] = useState(false);

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

  const htmlSignature = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #1e293b; font-size: 13px; line-height: 1.4;">
  <tr>
    <td style="padding-right: 14px; border-right: 2px solid #00e676; vertical-align: top;">
      <strong style="font-size: 15px; color: #05080f;">${sigNome}</strong><br/>
      <span style="font-size: 11px; color: #00e676; font-weight: bold;">${sigCargo}</span><br/>
      <span style="font-size: 10px; color: #64748b; font-weight: bold;">JRBC TECH TECNOLOGIA LTDA</span>
    </td>
    <td style="padding-left: 14px; vertical-align: top;">
      <strong style="color: #05080f; font-size: 13px;">JRBC TECH</strong> <span style="font-size: 9px; color: #d4af37; font-weight: bold;">GLOBAL INNOVATIONS</span><br/>
      <span style="font-size: 11px; color: #475569;">📞 Tel/WhatsApp: ${sigTelefone}</span><br/>
      <span style="font-size: 11px; color: #475569;">✉️ E-mail: ${sigEmail}</span><br/>
      <span style="font-size: 10px; color: #94a3b8;">📍 Quadra ACSV SE 32, Av. LO 05, Lote 22, Nº 22, Palmas – TO</span>
    </td>
  </tr>
</table>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlSignature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#00e676] uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" /> Parâmetros Gerais
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configurações do Sistema JRBC TECH
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Dados de contato institucional, SLAs, gerador de assinatura de e-mail e parametrizações do Service Desk.
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
            <Mail className="w-4 h-4 text-[#00e676]" />
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
            <Clock className="w-4 h-4 text-[#00e676]" />
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

        {/* Bloco 3: Gerador de Assinatura de E-mail HTML */}
        <div className="p-6 rounded-2xl glass-card border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#d4af37]" /> Gerador de Assinatura de E-mail Corporativa
            </span>
            <button
              type="button"
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[#00e676] text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar HTML'}
            </button>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nome Profissional</label>
              <input
                type="text"
                value={sigNome}
                onChange={(e) => setSigNome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cargo / Função</label>
              <input
                type="text"
                value={sigCargo}
                onChange={(e) => setSigCargo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">E-mail Profissional</label>
              <input
                type="email"
                value={sigEmail}
                onChange={(e) => setSigEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={sigTelefone}
                onChange={(e) => setSigTelefone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 mb-2">Pré-visualização da Assinatura:</p>
            <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-300" dangerouslySetInnerHTML={{ __html: htmlSignature }} />
          </div>
        </div>

        {/* Bloco 4: Status da Infraestrutura e Supabase */}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00e676] to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_rgba(0,230,118,0.25)] flex items-center gap-2 transition-all"
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
