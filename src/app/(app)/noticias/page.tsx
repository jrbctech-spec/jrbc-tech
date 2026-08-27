'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { Newspaper, Plus, ShieldAlert, Sparkles, X, Calendar, User } from 'lucide-react';

export default function NoticiasPage() {
  const { noticias, createNoticia } = useTickets();
  const { role } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [texto, setTexto] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNoticia({
      titulo,
      resumo,
      texto,
      imagem_url: imagemUrl || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      autor: 'Equipe JRBTC-TECH',
      data_publicacao: new Date().toISOString(),
      ativo: true,
    });
    setIsModalOpen(false);
    setTitulo('');
    setResumo('');
    setTexto('');
    setImagemUrl('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" /> Mural Informativo
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comunicados & Notícias de TI
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Alertas de cibersegurança, manutenções programadas e boas práticas de tecnologia.
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Comunicado</span>
          </button>
        )}
      </div>

      {/* Grid de Notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {noticias.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl glass-card border-slate-800 hover:border-sky-500/40 transition-all overflow-hidden flex flex-col shadow-xl"
          >
            {item.imagem_url && (
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  src={item.imagem_url}
                  alt={item.titulo}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {formatDate(item.data_publicacao)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {item.autor}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
                  {item.titulo}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.texto}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-[11px] text-sky-400 flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Informação homologada pela JRBTC-TECH
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Nova Notícia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-sky-400" />
                Novo Comunicado de TI
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Comunicado *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Alerta de Atualização Crítica de Segurança"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resumo Curto</label>
                <input
                  type="text"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Resumo de 1 frase..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Texto Completo *</label>
                <textarea
                  required
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL da Imagem de Destaque</label>
                <input
                  type="url"
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold shadow-glow-cyan"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
