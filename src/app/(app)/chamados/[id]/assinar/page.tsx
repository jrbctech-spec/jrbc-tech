'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import SignatureCanvas from '@/components/chamados/SignatureCanvas';
import { CheckCircle2, FileText, ArrowLeft, AlertCircle, PenLine } from 'lucide-react';
import Link from 'next/link';

export default function AssinarOSPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getChamadoById, assinarOS } = useTickets();
  const { user } = useAuth();
  const [signed, setSigned] = useState(false);
  const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chamado = getChamadoById(params.id);

  if (!chamado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="text-slate-300">Chamado não encontrado.</p>
        <Link href="/chamados" className="px-5 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm">Voltar</Link>
      </div>
    );
  }

  if (chamado.status !== 'AGUARDANDO_ASSINATURA') {
    return (
      <div className="max-w-lg mx-auto p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="font-bold text-white">Assinatura não disponível</h2>
        <p className="text-xs text-slate-400">
          Este chamado está no status <strong className="text-amber-300">{chamado.status}</strong>. A assinatura só é possível quando o chamado está <strong>"AGUARDANDO_ASSINATURA"</strong>.
        </p>
        <Link href={`/chamados/${chamado.id}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm min-h-[48px]">
          <ArrowLeft className="w-4 h-4" /> Ver Chamado
        </Link>
      </div>
    );
  }

  const handleSave = (dataUrl: string) => {
    setSigDataUrl(dataUrl);
    setSigned(true);
  };

  const handleConfirmar = async () => {
    if (!sigDataUrl) return;
    setIsSubmitting(true);
    try {
      await assinarOS(chamado.id, sigDataUrl);
      router.push(`/chamados/${chamado.id}?assinado=1`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 pb-24">
      <div className="flex items-center gap-3">
        <Link href={`/chamados/${chamado.id}`} className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-600 text-slate-400 min-h-[44px] flex items-center">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PenLine className="w-5 h-5 text-violet-400" />
            Assinatura da Ordem de Serviço
          </h1>
          <p className="text-xs text-slate-400">Chamado: <strong className="text-sky-400 font-mono">{chamado.numero_chamado}</strong></p>
        </div>
      </div>

      {/* Resumo do Atendimento */}
      <div className="p-5 rounded-2xl glass-card border-violet-500/30 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" /> Resumo do Atendimento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-[11px] text-slate-500 uppercase font-bold">Serviço</p>
            <p className="text-sm font-semibold text-white">{chamado.titulo}</p>
          </div>
          {chamado.equipamento_marca && (
            <div className="space-y-0.5">
              <p className="text-[11px] text-slate-500 uppercase font-bold">Equipamento</p>
              <p className="text-sm font-semibold text-white">{chamado.equipamento_marca} {chamado.equipamento_modelo}</p>
            </div>
          )}
          <div className="space-y-0.5">
            <p className="text-[11px] text-slate-500 uppercase font-bold">Técnico</p>
            <p className="text-sm font-semibold text-white">{chamado.tecnico_responsavel?.nome || 'Técnico JRBTC-TECH'}</p>
          </div>
          {chamado.tempo_atendimento_horas && (
            <div className="space-y-0.5">
              <p className="text-[11px] text-slate-500 uppercase font-bold">Tempo de Atendimento</p>
              <p className="text-sm font-semibold text-white">{chamado.tempo_atendimento_horas}h</p>
            </div>
          )}
        </div>
        {chamado.solucao && (
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-bold mb-1">Laudo / Solução Aplicada</p>
            <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800">{chamado.solucao}</p>
          </div>
        )}
      </div>

      {/* Declaração */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <p>
          Eu, <strong className="text-white">{user?.nome || 'Responsável'}</strong>, confirmo que os serviços descritos acima foram executados de forma satisfatória pelo técnico da <strong className="text-sky-400">JRBTC-TECH</strong> e autorizo o encerramento desta Ordem de Serviço.
        </p>
      </div>

      {/* Canvas de Assinatura */}
      <div className="p-5 rounded-2xl glass-card space-y-3">
        <h3 className="text-sm font-bold text-white">Assinatura Digital do Responsável</h3>
        <SignatureCanvas onSave={handleSave} onClear={() => setSigned(false)} height={160} />
      </div>

      {/* Preview da Assinatura */}
      {signed && sigDataUrl && (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Assinatura capturada com sucesso! Clique em <strong>Confirmar e Assinar O.S.</strong> para finalizar.</span>
        </div>
      )}

      {/* Botão Final */}
      <button
        onClick={handleConfirmar}
        disabled={!signed || isSubmitting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 min-h-[56px] shadow-2xl transition-all"
      >
        <CheckCircle2 className="w-5 h-5" />
        {isSubmitting ? 'Registrando assinatura...' : 'Confirmar e Assinar Ordem de Serviço'}
      </button>

      <p className="text-center text-[11px] text-slate-500">
        A assinatura digital é legalmente vinculante conforme a Lei 14.063/2020 (LGPD e assinatura eletrônica).
      </p>
    </div>
  );
}
