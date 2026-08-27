'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { Tecnico } from '@/types/database.types';
import { 
  UserCog, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Wrench, 
  CheckCircle2, 
  Zap, 
  Edit3,
  X 
} from 'lucide-react';

export default function TecnicosPage() {
  const { tecnicos, chamados, createTecnico, updateTecnico } = useTickets();
  const { role } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidadesStr, setEspecialidadesStr] = useState('');

  const filteredTecnicos = tecnicos.filter(
    (t) =>
      t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewModal = () => {
    setEditingId(null);
    setNome('');
    setEmail('');
    setTelefone('');
    setEspecialidadesStr('Microinformática, Infraestrutura de TI');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Tecnico) => {
    setEditingId(t.id);
    setNome(t.nome);
    setEmail(t.email);
    setTelefone(t.telefone || '');
    setEspecialidadesStr(t.especialidades.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const especialidades = especialidadesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      await updateTecnico(editingId, {
        nome,
        email,
        telefone,
        especialidades,
      });
    } else {
      await createTecnico({
        usuario_id: 'user-' + Date.now(),
        nome,
        email,
        telefone,
        especialidades,
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
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <UserCog className="w-4 h-4" /> Corpo Técnico
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Técnicos & Especialistas JRBTC-TECH
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão da equipe de campo, competências técnicas e chamados vinculados.
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={openNewModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Técnico</span>
          </button>
        )}
      </div>

      {/* Grid de Técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTecnicos.map((tecnico) => {
          const techTickets = chamados.filter((c) => c.tecnico_responsavel_id === tecnico.id);
          const activeCount = techTickets.filter((c) => c.status === 'EM_ATENDIMENTO' || c.status === 'EM_ANALISE').length;
          const doneCount = techTickets.filter((c) => c.status === 'FINALIZADO' || c.status === 'RESOLVIDO').length;

          return (
            <div
              key={tecnico.id}
              className="p-5 rounded-2xl glass-card border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center font-bold text-white text-sm shadow-md">
                    {tecnico.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{tecnico.nome}</h3>
                    <p className="text-[11px] text-slate-400">{tecnico.email}</p>
                  </div>
                </div>

                {role === 'ADMIN' && (
                  <button
                    onClick={() => openEditModal(tecnico)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Especialidades */}
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5">Especialidades</p>
                <div className="flex flex-wrap gap-1.5">
                  {tecnico.especialidades.map((esp, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-950/80 text-cyan-300 border border-sky-800/60"
                    >
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estatísticas de Atendimento */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-center">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Em Atendimento</span>
                  <p className="text-base font-extrabold text-cyan-400">{activeCount}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Concluídos</span>
                  <p className="text-base font-extrabold text-emerald-400">{doneCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCog className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Editar Técnico' : 'Novo Técnico de TI'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Especialidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={especialidadesStr}
                  onChange={(e) => setEspecialidadesStr(e.target.value)}
                  placeholder="Redes, PostgreSQL, Microinformática..."
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
                  Salvar Técnico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
