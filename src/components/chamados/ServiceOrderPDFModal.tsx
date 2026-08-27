'use client';

import React, { useState } from 'react';
import { Chamado, Cliente, Tecnico, Usuario } from '@/types/database.types';
import { generateServiceOrderPDF } from '@/lib/pdfGenerator';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Clock, 
  DollarSign,
  X
} from 'lucide-react';

interface ServiceOrderPDFModalProps {
  chamado: Chamado;
  cliente?: Cliente | null;
  solicitante?: Usuario | null;
  tecnico?: Tecnico | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceOrderPDFModal: React.FC<ServiceOrderPDFModalProps> = ({
  chamado,
  cliente,
  solicitante,
  tecnico,
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = generateServiceOrderPDF({
        chamado,
        cliente: cliente || chamado.cliente,
        solicitante: solicitante || chamado.solicitante,
        tecnico: tecnico || chamado.tecnico_responsavel,
      });

      doc.save(`OS_JRBTC_${chamado.numero_chamado}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const doc = generateServiceOrderPDF({
      chamado,
      cliente: cliente || chamado.cliente,
      solicitante: solicitante || chamado.solicitante,
      tecnico: tecnico || chamado.tecnico_responsavel,
    });
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-8">
        {/* Barra Superior do Modal */}
        <div className="bg-slate-950 p-4 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Ordem de Serviço & Recibo Oficial
                <span className="text-xs font-mono text-sky-400 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {chamado.numero_chamado}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">JRBTC-TECH Soluções em TI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pré-visualização Estruturada da O.S. (Papel Timbrado) */}
        <div className="p-6 bg-slate-950 text-slate-200 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Cabeçalho da Empresa */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-sky-400">JRBTC-TECH</h2>
              <p className="text-xs text-slate-300">Soluções em Tecnologia da Informação</p>
              <p className="text-[11px] text-slate-400">CNPJ: 45.123.456/0001-89 | Tel: (63) 98121-3180</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                DOCUMENTO CONCLUÍDO
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Emitido em: {formatDateTime(chamado.data_conclusao || new Date().toISOString())}
              </p>
            </div>
          </div>

          {/* Dados do Cliente e Chamado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Dados do Cliente
              </h4>
              <p className="text-xs font-semibold text-white">
                {cliente?.razao_social || cliente?.nome_fantasia || chamado.cliente?.razao_social || 'Cliente'}
              </p>
              <p className="text-[11px] text-slate-400">
                {cliente?.cnpj ? `CNPJ: ${cliente.cnpj}` : cliente?.cpf ? `CPF: ${cliente.cpf}` : 'Documento registrado'}
              </p>
              <p className="text-[11px] text-slate-400">
                Solicitante: <strong className="text-slate-300">{solicitante?.nome || 'Contato da Empresa'}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Detalhes Técnicos
              </h4>
              <p className="text-xs font-semibold text-white">
                {chamado.categoria?.nome} • {chamado.servico?.nome_servico || chamado.titulo}
              </p>
              <p className="text-[11px] text-slate-400">
                Prioridade: <strong className="text-slate-300">{chamado.prioridade}</strong> | Horas: <strong className="text-slate-300">{chamado.tempo_atendimento_horas || 1.5}h</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Técnico Resp.: <strong className="text-slate-300">{tecnico?.nome || chamado.tecnico_responsavel?.nome || 'Carlos Silva'}</strong>
              </p>
            </div>
          </div>

          {/* Diagnóstico e Solução */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solução Técnica Aplicada
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {chamado.solucao || 'Serviço executado com sucesso e validado pela equipe técnica de TI da JRBTC-TECH.'}
            </p>
          </div>

          {/* Demonstrativo Financeiro */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">Valor Total do Atendimento / O.S.</p>
                <p className="text-[10px] text-slate-400">Mão de obra e suporte técnico especializado</p>
              </div>
            </div>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              {formatCurrency(chamado.valor_servico || 0)}
            </span>
          </div>

          {/* Termo de Aceite & Assinaturas */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-6">
            <p className="text-center italic">
              "Declaro que os serviços técnicos acima foram devidamente executados, testados e aprovados."
            </p>

            <div className="grid grid-cols-2 gap-8 text-center pt-2">
              <div>
                <div className="w-full border-b border-slate-700 mb-2"></div>
                <p className="font-bold text-slate-200 text-xs">JRBTC-TECH</p>
                <p className="text-[10px] text-slate-500">Técnico Responsável</p>
              </div>
              <div>
                <div className="w-full border-b border-slate-700 mb-2"></div>
                <p className="font-bold text-slate-200 text-xs">{solicitante?.nome || 'Cliente Responsável'}</p>
                <p className="text-[10px] text-slate-500">{cliente?.razao_social || 'Aceite Digital'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
