'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { Servico } from '@/types/database.types';
import { formatCurrency } from '@/lib/utils';
import { 
  Layers, 
  Plus, 
  Monitor, 
  Server, 
  Database, 
  Clock, 
  DollarSign, 
  Edit3, 
  X,
  CheckCircle2
} from 'lucide-react';

export default function ServicosPage() {
  const { categorias, servicos, createServico, updateServico } = useTickets();
  const { role } = useAuth();

  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>(categorias[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nomeServico, setNomeServico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [slaHoras, setSlaHoras] = useState(8);
  const [valorEstimado, setValorEstimado] = useState(150);

  const currentCategory = categorias.find((c) => c.id === selectedCategoriaId) || categorias[0];
  const categoryServices = servicos.filter((s) => s.categoria_id === selectedCategoriaId);

  const openNewModal = () => {
    setEditingId(null);
    setNomeServico('');
    setDescricao('');
    setSlaHoras(8);
    setValorEstimado(150);
    setIsModalOpen(true);
  };

  const openEditModal = (s: Servico) => {
    setEditingId(s.id);
    setNomeServico(s.nome_servico);
    setDescricao(s.descricao || '');
    setSlaHoras(s.sla_horas);
    setValorEstimado(s.valor_estimado);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateServico(editingId, {
        nome_servico: nomeServico,
        descricao,
        sla_horas: Number(slaHoras),
        valor_estimado: Number(valorEstimado),
      });
    } else {
      await createServico({
        categoria_id: selectedCategoriaId,
        nome_servico: nomeServico,
        descricao,
        sla_horas: Number(slaHoras),
        valor_estimado: Number(valorEstimado),
        ativo: true,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> Catálogo de TI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Especialidades & Catálogo de Serviços
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configuração de prazos de SLA e valores de referência para serviços técnicos.
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={openNewModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Serviço</span>
          </button>
        )}
      </div>

      {/* Seletor de Categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categorias.map((cat) => {
          const isSelected = selectedCategoriaId === cat.id;
          let Icon = Monitor;
          if (cat.nome === 'Infraestrutura de TI') Icon = Server;
          if (cat.nome === 'Banco de Dados') Icon = Database;

          const count = servicos.filter((s) => s.categoria_id === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoriaId(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-400 shadow-glow-cyan text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {count} serviços
                </span>
              </div>
              <h3 className="font-bold text-sm">{cat.nome}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.descricao}</p>
            </button>
          );
        })}
      </div>

      {/* Lista de Serviços da Categoria Ativa */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          Serviços em <span className="text-cyan-400">{currentCategory?.nome}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryServices.map((servico) => (
            <div
              key={servico.id}
              className="p-5 rounded-2xl glass-card border-slate-800 hover:border-sky-500/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{servico.nome_servico}</h4>
                  <p className="text-xs text-slate-400 mt-1">{servico.descricao}</p>
                </div>

                {role === 'ADMIN' && (
                  <button
                    onClick={() => openEditModal(servico)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex-shrink-0 ml-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-sky-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> SLA: {servico.sla_horas}h
                </span>
                <span className="font-extrabold text-emerald-400 font-mono">
                  {formatCurrency(servico.valor_estimado)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação / Edição de Serviço */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                {editingId ? 'Editar Serviço' : 'Novo Serviço no Catálogo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  value={nomeServico}
                  onChange={(e) => setNomeServico(e.target.value)}
                  placeholder="Ex: Formatação e Instalação de SO"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição do Escopo</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SLA Padrão (Horas)</label>
                  <input
                    type="number"
                    min="1"
                    value={slaHoras}
                    onChange={(e) => setSlaHoras(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    step="10"
                    value={valorEstimado}
                    onChange={(e) => setValorEstimado(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
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
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
