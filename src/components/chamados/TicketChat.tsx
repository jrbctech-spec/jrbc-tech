'use client';

import React, { useState } from 'react';
import { Comentario, CommentVisibility } from '@/types/database.types';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/lib/utils';
import { Send, Eye, Lock, MessageSquare, ShieldAlert, Sparkles, Bot } from 'lucide-react';
import { pedirDiagnosticoMetaAI } from '@/lib/metaAiService';

interface TicketChatProps {
  chamadoId: string;
  comentarios?: Comentario[];
}

export const TicketChat: React.FC<TicketChatProps> = ({ chamadoId, comentarios = [] }) => {
  const { addComentario } = useTickets();
  const { user, role } = useAuth();
  const [mensagem, setMensagem] = useState('');
  const [visibilidade, setVisibilidade] = useState<CommentVisibility>('CLIENTE');
  const [isSending, setIsSending] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Filtragem de Comentários conforme RLS: Cliente nunca vê INTERNO
  const visibleComments = comentarios.filter((c) => {
    if (role === 'CLIENTE') {
      return c.visibilidade === 'CLIENTE';
    }
    return true; // Admin e Técnico veem ambos
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    setIsSending(true);
    try {
      await addComentario(
        chamadoId,
        mensagem.trim(),
        role === 'CLIENTE' ? 'CLIENTE' : visibilidade
      );
      setMensagem('');
    } finally {
      setIsSending(false);
    }
  };

  const handleConsultarMetaAI = async () => {
    setIsAiLoading(true);
    try {
      const contextoMsg = visibleComments.map(c => `${c.usuario?.nome || 'Usuário'}: ${c.mensagem}`).join('\n');
      const sugestao = await pedirDiagnosticoMetaAI(
        "Forneça um diagnóstico prévio ou recomendação técnica para este atendimento.",
        contextoMsg || "Abertura de chamado recente."
      );
      setMensagem(sugestao);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Botão Assistente Meta AI */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#00e676]" />
          <span className="text-xs font-bold text-white">Meta AI — Assistente de Diagnóstico</span>
        </div>
        <button
          type="button"
          onClick={handleConsultarMetaAI}
          disabled={isAiLoading}
          className="px-3 py-1.5 rounded-lg bg-[#00e676] hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          {isAiLoading ? 'Analisando...' : 'Gerar Sugestão de Diagnóstico'}
        </button>
      </div>

      {/* Lista de Mensagens */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {visibleComments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/30 rounded-xl border border-slate-800">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            Nenhuma mensagem registrada. Envie uma mensagem para iniciar o atendimento.
          </div>
        ) : (
          visibleComments.map((comment) => {
            const isInternal = comment.visibilidade === 'INTERNO';
            const isMe = comment.usuario_id === user?.id || comment.usuario?.email === user?.email;

            return (
              <div
                key={comment.id}
                className={`p-3.5 rounded-xl text-xs space-y-1.5 border transition-all ${
                  isInternal
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : isMe
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-slate-200 ml-4'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 mr-4'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">
                      {comment.usuario?.nome || (isMe ? user?.nome : 'Suporte JRBC TECH')}
                    </span>
                    {isInternal && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> NOTA INTERNA (Técnico/Admin)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatDateTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {comment.mensagem}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Formulário de Envio de Mensagem */}
      <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-slate-800">
        {/* Toggle de Visibilidade (Apenas para Técnico e Admin) */}
        {role !== 'CLIENTE' && (
          <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Visibilidade da mensagem:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVisibilidade('CLIENTE')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                  visibilidade === 'CLIENTE'
                    ? 'bg-emerald-500/20 text-[#00e676] border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3 h-3" /> Visível ao Cliente
              </button>
              <button
                type="button"
                onClick={() => setVisibilidade('INTERNO')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                  visibilidade === 'INTERNO'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3 h-3" /> Nota Interna (Privado)
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder={
              visibilidade === 'INTERNO'
                ? 'Escreva uma anotação técnica privada (não visível ao cliente)...'
                : 'Escreva uma mensagem para o cliente/solicitante...'
            }
            rows={2}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00e676] resize-none transition-colors"
          />
          <button
            type="submit"
            disabled={!mensagem.trim() || isSending}
            className="h-[58px] px-4 rounded-xl bg-gradient-to-tr from-[#00e676] to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4 fill-slate-950" />
          </button>
        </div>
      </form>
    </div>
  );
};
