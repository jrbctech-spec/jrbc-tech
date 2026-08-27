'use client';

import React, { useState } from 'react';
import { useTickets } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { Cliente } from '@/types/database.types';
import { 
  Building2, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Edit3,
  X
} from 'lucide-react';

export default function ClientesPage() {
  const { clientes, createCliente, updateCliente } = useTickets();
  const { role } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewModal = () => {
    setEditingId(null);
    setRazaoSocial('');
    setNomeFantasia('');
    setCnpj('');
    setEmail('');
    setTelefone('');
    setWhatsapp('');
    setEndereco('');
    setCidade('São Paulo');
    setEstado('SP');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Cliente) => {
    setEditingId(c.id);
    setRazaoSocial(c.razao_social);
    setNomeFantasia(c.nome_fantasia);
    setCnpj(c.cnpj || '');
    setEmail(c.email);
    setTelefone(c.telefone || '');
    setWhatsapp(c.whatsapp || '');
    setEndereco(c.endereco || '');
    setCidade(c.cidade || '');
    setEstado(c.estado || 'SP');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCliente(editingId, {
        razao_social: razaoSocial,
        nome_fantasia: nomeFantasia,
        cnpj,
        email,
        telefone,
        whatsapp,
        endereco,
        cidade,
        estado,
      });
    } else {
      await createCliente({
        razao_social: razaoSocial,
        nome_fantasia: nomeFantasia,
        cnpj,
        email,
        telefone,
        whatsapp,
        endereco,
        cidade,
        estado,
        status: 'ATIVO',
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
            <Building2 className="w-4 h-4" /> Gestão Corporativa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Clientes & Empresas Parceiras
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cadastro de contratantes, contratos de suporte e dados de faturamento.
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={openNewModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </button>
        )}
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar cliente por razão social ou fantasia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.map((cliente) => (
          <div
            key={cliente.id}
            className="p-5 rounded-2xl glass-card border-slate-800 hover:border-sky-500/40 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {cliente.status}
                </span>
                <h3 className="font-bold text-sm text-white mt-1.5">{cliente.nome_fantasia}</h3>
                <p className="text-[11px] text-slate-400">{cliente.razao_social}</p>
              </div>

              {role === 'ADMIN' && (
                <button
                  onClick={() => openEditModal(cliente)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  title="Editar"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2 text-slate-400">
                <span className="font-mono text-[11px] text-sky-400">{cliente.cnpj || 'CNPJ não informado'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{cliente.email}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{cliente.whatsapp || cliente.telefone || '(Não informado)'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{cliente.cidade ? `${cliente.cidade}/${cliente.estado}` : 'São Paulo/SP'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                {editingId ? 'Editar Cliente' : 'Novo Cadastro de Cliente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Fantasia *</label>
                  <input
                    type="text"
                    required
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CNPJ / CPF</label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Principal *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade / Estado</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="São Paulo - SP"
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
