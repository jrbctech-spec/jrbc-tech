'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Building2, 
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, informe e-mail e senha.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !password) {
      setError('Preencha os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await signUpWithEmail(nome, email, password, empresa);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('Cadastro realizado! Acessando portal...');
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar via Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickLogin = (emailSample: string, passSample: string = '123456') => {
    setEmail(emailSample);
    setPassword(passSample);
    setTab('login');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logotipo e Apresentação */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-1 mx-auto shadow-glow-cyan flex items-center justify-center mb-3">
            <img src="/logo-jrbtc.svg" alt="JRBTC-TECH Logo" className="w-full h-full object-contain rounded-[14px]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-white bg-clip-text text-transparent">
            JRBTC-TECH
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Service Desk de TI & Gestão de Chamados
          </p>
        </div>

        {/* Card Principal */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card border-sky-500/30 shadow-2xl space-y-5">
          {/* Alternador Login / Cadastro */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`py-2 rounded-lg transition-colors min-h-[44px] ${
                tab === 'login' ? 'bg-sky-500 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              Acessar Conta
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`py-2 rounded-lg transition-colors min-h-[44px] ${
                tab === 'register' ? 'bg-sky-500 text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              Novo Cliente
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Botão Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full p-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-md min-h-[48px]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Entrar com Conta Google</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ou com e-mail corporativo</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail corporativo</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com.br"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <span>{isLoading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da sua Empresa</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Ex: Alpha Contabilidade Ltda"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail corporativo *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao@alphacontabil.com.br"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Criar Senha *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <span>{isLoading ? 'Cadastrando...' : 'Criar Conta de Cliente'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Dicas de Acesso Rápido */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <p className="text-center font-semibold text-slate-300">Contas pré-configuradas para testes:</p>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
              <button
                type="button"
                onClick={() => fillQuickLogin('jrbctech@gmail.com')}
                className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 font-semibold"
              >
                Admin (JRBTC)
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('carlos.silva@jrbtc.com.br')}
                className="p-1.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 font-semibold"
              >
                Técnico (Carlos)
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('roberto@alphacontabil.com.br')}
                className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-semibold"
              >
                Cliente (Roberto)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          JRBTC-TECH Soluções em TI • Central: jrbctech@gmail.com
        </p>
      </div>
    </div>
  );
}
