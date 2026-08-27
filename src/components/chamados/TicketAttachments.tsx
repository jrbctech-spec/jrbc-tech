'use client';

import React, { useState } from 'react';
import { Anexo, AttachmentType } from '@/types/database.types';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Upload, 
  ExternalLink,
  Plus
} from 'lucide-react';

interface TicketAttachmentsProps {
  chamadoId: string;
  anexos?: Anexo[];
}

export const TicketAttachments: React.FC<TicketAttachmentsProps> = ({ chamadoId, anexos = [] }) => {
  const { addAnexo } = useTickets();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        const tipo: AttachmentType = isImage ? 'FOTO' : isPdf ? 'PDF' : 'DOCUMENTO';

        // URL base64/object local para preview imediato
        const fakeUrl = isImage
          ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
          : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

        await addAnexo(chamadoId, {
          chamado_id: chamadoId,
          arquivo_url: fakeUrl,
          nome_arquivo: file.name,
          tipo_anexo: tipo,
          tamanho_bytes: file.size,
          enviado_por: user?.nome || 'Usuário',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botão de Upload / Dropzone */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
          <Paperclip className="w-4 h-4 text-sky-400" />
          Anexos e Evidências Técnicas ({anexos.length})
        </h4>

        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Enviando...' : 'Adicionar Anexo'}</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Grid de Anexos */}
      {anexos.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
          Nenhum anexo ou foto adicionado a este chamado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {anexos.map((anexo) => {
            const isPhoto = anexo.tipo_anexo === 'FOTO';

            return (
              <div
                key={anexo.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400 flex-shrink-0">
                    {isPhoto ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-xs text-slate-200 truncate">
                      {anexo.nome_arquivo || 'Evidência Técnica'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Enviado por {anexo.enviado_por}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={anexo.arquivo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 transition-colors"
                    title="Visualizar anexo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
