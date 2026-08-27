'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { TicketPriority, AttachmentType } from '@/types/database.types';
import confetti from 'canvas-confetti';
import {
  PlusCircle, Monitor, Server, Database, Layers, Upload, Camera,
  Trash2, ArrowLeft, ArrowRight, CheckCircle2, Sparkles,
  CreditCard, QrCode, AlertCircle, Timer, Cpu, Hash, Tag
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

type Step = 'form' | 'payment' | 'success';

export default function NovoChamadoPage() {
  const router = useRouter();
  const { categorias, servicos, clientes, createChamado, pagarChamado } = useTickets();
  const { user, role } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [createdTicket, setCreatedTicket] = useState<{ id: string; numero: string; valor: number } | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulário
  const [clienteId, setClienteId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<TicketPriority>('NORMAL');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serial, setSerial] = useState('');
  const [anexosList, setAnexosList] = useState<{ url: string; nome: string; tipo: AttachmentType }[]>([]);

  useEffect(() => {
    if (role === 'CLIENTE' && user?.cliente_id) setClienteId(user.cliente_id);
    else if (clientes.length > 0) setClienteId(clientes[0].id);
  }, [role, user, clientes]);

  useEffect(() => {
    if (categorias.length > 0 && !categoriaId) setCategoriaId(categorias[0].id);
  }, [categorias, categoriaId]);

  const availableServices = servicos.filter(s => s.categoria_id === categoriaId && s.ativo);
  useEffect(() => {
    if (availableServices.length > 0) setServicoId(availableServices[0].id);
    else setServicoId('');
  }, [categoriaId]);

  const selectedServico = servicos.find(s => s.id === servicoId);
  const valorServico = selectedServico?.valor_estimado || 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map(file => ({
      url: file.type.startsWith('image/')
        ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
        : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      nome: file.name,
      tipo: (file.type.startsWith('image/') ? 'FOTO' : file.type === 'application/pdf' ? 'PDF' : 'DOCUMENTO') as AttachmentType,
    }));
    setAnexosList(prev => [...prev, ...newFiles]);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim() || !marca.trim() || !modelo.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios (incluindo Marca e Modelo do equipamento).');
      return;
    }
    setIsSubmitting(true);
    try {
      const ticket = await createChamado({
        cliente_id: clienteId, categoria_id: categoriaId, servico_id: servicoId,
        titulo: titulo.trim(), descricao: descricao.trim(), prioridade,
        equipamento_marca: marca.trim(), equipamento_modelo: modelo.trim(), equipamento_serial: serial.trim(),
        valor_servico: valorServico, anexos: anexosList,
      });
      setCreatedTicket({ id: ticket.id, numero: ticket.numero_chamado, valor: valorServico });
      setStep('payment');
    } catch (err) {
      alert('Erro ao criar chamado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmarPagamento = async () => {
    if (!createdTicket) return;
    setIsSubmitting(true);
    try {
      await pagarChamado(createdTicket.id);
      setStep('success');
      try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } }); } catch (_) {}
    } finally {
      setIsSubmitting(false);
    }
  };

  const CATEGORIAS_ICONS: Record<string, React.ElementType> = {
    'Microinformática': Monitor,
    'Infraestrutura de TI': Server,
    'Banco de Dados': Database,
  };

  const PIX_CHAVE = '45.123.456/0001-89'; // CNPJ JRBTC-TECH

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200 pb-24">
      {/* Barra de Progresso */}
      <div className="flex items-center justify-between px-1 pt-1">
        <Link href="/chamados" className="text-xs text-slate-400 hover:text-sky-300 flex items-center gap-1.5 min-h-[44px]">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center gap-2">
          {['form', 'payment', 'success'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === s ? 'bg-sky-500 border-sky-400 text-white' : i < ['form', 'payment', 'success'].indexOf(step) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                {i < ['form', 'payment', 'success'].indexOf(step) ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`h-0.5 w-12 ${i < ['form', 'payment', 'success'].indexOf(step) ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </React.Fragment>
          ))}
        </div>
        <span className="text-xs text-sky-400 font-bold font-mono">JRBTC Service Desk</span>
      </div>

      {/* ===== ETAPA 1: FORMULÁRIO ===== */}
      {step === 'form' && (
        <div className="p-5 sm:p-8 rounded-2xl glass-card border-sky-500/30 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
              <PlusCircle className="w-6 h-6 text-sky-400" />
              Abertura de Chamado Técnico
            </h1>
            <p className="text-xs text-slate-400 mt-1">Etapa 1 de 2 — Dados do chamado e equipamento</p>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Cliente (só Admin vê) */}
            {role === 'ADMIN' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-400" /> Empresa / Cliente *
                </label>
                <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500 min-h-[44px]">
                  {clientes.map(cli => <option key={cli.id} value={cli.id}>{cli.nome_fantasia}</option>)}
                </select>
              </div>
            )}

            {/* Categoria */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">1. Especialidade de TI *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[...categorias, { id: 'outros', nome: 'Outros', descricao: 'Demandas especiais e projetos customizados.', icone: 'Layers', ativo: true, created_at: '' }].map((cat) => {
                  const isSelected = categoriaId === cat.id;
                  const Icon = CATEGORIAS_ICONS[cat.nome] || Layers;
                  return (
                    <button key={cat.id} type="button" onClick={() => setCategoriaId(cat.id)}
                      className={`p-3 rounded-xl border text-left transition-all min-h-[64px] flex flex-col justify-between ${isSelected ? 'bg-sky-500/20 border-sky-400 shadow-glow-cyan' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <p className={`font-bold text-[11px] mt-1.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{cat.nome}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Serviço */}
            {availableServices.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">2. Serviço Específico *</label>
                <select value={servicoId} onChange={e => setServicoId(e.target.value)} className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500 min-h-[44px]">
                  {availableServices.map(srv => <option key={srv.id} value={srv.id}>{srv.nome_servico} — {formatCurrency(srv.valor_estimado)}</option>)}
                </select>
              </div>
            )}

            {/* Dados do Equipamento */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <h3 className="text-xs font-extrabold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-cyan-400" /> Dados do Equipamento *
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Marca *</label>
                  <input type="text" value={marca} onChange={e => setMarca(e.target.value)} required placeholder="Ex: Dell, HP, Lenovo, Samsung..." className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Modelo *</label>
                  <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} required placeholder="Ex: Inspiron 15 3000, ThinkPad E14..." className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3 h-3" /> Número de Série (Serial Number)
                </label>
                <input type="text" value={serial} onChange={e => setSerial(e.target.value)} placeholder="Ex: SN1234567890 — encontrado na etiqueta do equipamento" className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]" />
              </div>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">3. Nível de Prioridade *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['BAIXA', 'NORMAL', 'ALTA', 'CRITICA'] as TicketPriority[]).map(p => (
                  <button key={p} type="button" onClick={() => setPrioridade(p)}
                    className={`py-3 px-2 rounded-xl text-[11px] font-bold border transition-all min-h-[44px] ${prioridade === p
                      ? p === 'CRITICA' ? 'bg-rose-500/30 border-rose-500 text-rose-200' : p === 'ALTA' ? 'bg-amber-500/30 border-amber-500 text-amber-200' : 'bg-sky-500/30 border-sky-500 text-sky-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}>
                    {p === 'CRITICA' ? 'Crítica (2h)' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Título e Descrição */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Título do Problema *</label>
                <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ex: Computador não liga, tela azul ao iniciar..." className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 min-h-[44px]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Descrição Detalhada do Problema *</label>
                <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required rows={4} placeholder="Descreva os sintomas, mensagens de erro e quando o problema começou..." className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none" />
              </div>
            </div>

            {/* Upload de Fotos */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Fotos do Equipamento / Problema</label>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <label className="border border-sky-500/40 bg-sky-950/30 hover:bg-sky-900/40 rounded-xl p-3.5 flex flex-col items-center cursor-pointer min-h-[56px] transition-colors">
                  <Camera className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-[11px] font-bold text-cyan-300">Câmera do Celular</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                </label>
                <label className="border border-slate-700 bg-slate-900/40 hover:bg-slate-800 rounded-xl p-3.5 flex flex-col items-center cursor-pointer min-h-[56px] transition-colors">
                  <Upload className="w-5 h-5 text-slate-300 mb-1" />
                  <span className="text-[11px] font-bold text-slate-300">Galeria / Arquivo</span>
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              {anexosList.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs mb-1.5 min-h-[40px]">
                  <span className="text-slate-200 truncate">{a.nome}</span>
                  <button type="button" onClick={() => setAnexosList(p => p.filter((_, i) => i !== idx))} className="text-rose-400 p-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>

            {/* Valor e Botão Avançar */}
            <div className="pt-4 border-t border-slate-800">
              {valorServico > 0 && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-300 font-semibold">Valor estimado do serviço:</span>
                  <span className="text-lg font-extrabold text-emerald-400">{formatCurrency(valorServico)}</span>
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all min-h-[52px]">
                {isSubmitting ? 'Criando chamado...' : 'Avançar para Pagamento'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== ETAPA 2: PAGAMENTO PIX ===== */}
      {step === 'payment' && createdTicket && (
        <div className="p-5 sm:p-8 rounded-2xl glass-card border-emerald-500/30 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <QrCode className="w-6 h-6 text-emerald-400" />
              Pagamento via PIX
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Etapa 2 de 2 — Protocolo: <strong className="text-sky-400 font-mono">{createdTicket.numero}</strong>
            </p>
          </div>

          {/* Valor */}
          <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900/60 border border-emerald-500/30">
            <p className="text-xs text-slate-400 mb-2">Valor total do serviço</p>
            <p className="text-4xl font-extrabold text-emerald-400">{formatCurrency(createdTicket.valor)}</p>
            <p className="text-[11px] text-slate-400 mt-2">CNPJ: <strong className="text-slate-200">45.123.456/0001-89</strong></p>
            <p className="text-[11px] text-slate-400">Chave PIX: <strong className="text-slate-200">{PIX_CHAVE}</strong></p>
          </div>

          {/* QR Code Simulado */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-4 shadow-xl">
              <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-2">
                <QrCode className="w-20 h-20 text-slate-800" />
                <p className="text-[9px] text-slate-500 text-center font-bold">QR CODE PIX</p>
                <p className="text-[8px] text-slate-400 text-center">JRBTC-TECH<br />CNPJ 45.123.456/0001-89</p>
              </div>
            </div>

            {/* PIX Copia e Cola */}
            <div className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 mb-1 font-semibold">PIX Copia e Cola:</p>
              <code className="text-[10px] text-sky-300 font-mono break-all leading-relaxed">
                00020101021226860014BR.GOV.BCB.PIX2564pix.jrbtc.com.br/qr/v2/45123456000189-{createdTicket.numero}5204000053039865406{String(createdTicket.valor * 100).padStart(10, '0')}5802BR5910JRBTCTECH6009SAOPAULO62070503***6304{Math.random().toString(36).substring(2, 6).toUpperCase()}
              </code>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Após efetuar o pagamento no seu app bancário, clique em <strong>"Confirmar Pagamento"</strong>. Seu chamado entra na fila imediatamente.</span>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer min-h-[52px]">
            <input type="checkbox" checked={pixConfirmed} onChange={e => setPixConfirmed(e.target.checked)} className="w-5 h-5 rounded accent-emerald-500" />
            <span className="text-xs text-slate-300 font-semibold">Confirmo que efetuei o pagamento de <strong className="text-emerald-400">{formatCurrency(createdTicket.valor)}</strong> via PIX para a JRBTC-TECH.</span>
          </label>

          <div className="flex flex-col gap-3 pt-2">
            <button onClick={handleConfirmarPagamento} disabled={!pixConfirmed || isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 min-h-[52px]">
              <CheckCircle2 className="w-5 h-5" />
              {isSubmitting ? 'Confirmando...' : 'Confirmar Pagamento e Enviar para Fila'}
            </button>
            <button onClick={() => setStep('form')} className="text-xs text-slate-400 hover:text-slate-200 text-center py-2 min-h-[44px]">
              ← Voltar para editar o chamado
            </button>
          </div>
        </div>
      )}

      {/* ===== ETAPA 3: SUCESSO ===== */}
      {step === 'success' && createdTicket && (
        <div className="p-8 rounded-2xl glass-card border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Chamado Aberto e Pago!</h2>
          <p className="text-xs text-slate-300">
            Protocolo: <strong className="text-sky-400 font-mono text-sm">{createdTicket.numero}</strong>
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Seu chamado entrou na fila e nossa equipe técnica já está sendo notificada. Você receberá atualizações em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href={`/chamados/${createdTicket.id}`} className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2 min-h-[48px]">
              <Sparkles className="w-4 h-4" /> Ver Meu Chamado
            </Link>
            <Link href="/chamados" className="px-6 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center min-h-[48px]">
              Ver Todos os Chamados
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
