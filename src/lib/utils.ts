import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TicketPriority, TicketStatus, UserRole } from "@/types/database.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatação de Moeda BRL
export function formatCurrency(value: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Formatação de Data e Hora
export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// Informações visuais para Status do Chamado (Fluxo Completo)
export const STATUS_MAP: Record<TicketStatus, { label: string; color: string; bg: string; border: string; badge: string; icon?: string }> = {
  // Fluxo novo
  AGUARDANDO_PAGAMENTO: {
    label: 'Aguard. Pagamento',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
  },
  PAGO: {
    label: 'Pago — Aguard. Técnico',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30'
  },
  ACEITO: {
    label: 'Aceito pelo Técnico',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
  },
  A_CAMINHO: {
    label: 'Técnico a Caminho',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30'
  },
  EM_ATENDIMENTO: {
    label: 'Em Atendimento',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
  },
  AGUARDANDO_ASSINATURA: {
    label: 'Aguard. Assinatura',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30'
  },
  AGUARDANDO_REPASSE: {
    label: 'Aguard. Repasse',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  FINALIZADO: {
    label: 'Finalizado',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  },
  // Legacy (compatibilidade retroativa)
  ABERTO: {
    label: 'Aberto',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  EM_ANALISE: {
    label: 'Em Análise',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
  },
  AGENDADO: {
    label: 'Agendado',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
  },
  RESOLVIDO: {
    label: 'Resolvido',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
};

// Informações visuais para Prioridade do Chamado
export const PRIORITY_MAP: Record<TicketPriority, { label: string; color: string; badge: string; dot: string }> = {
  BAIXA: {
    label: 'Baixa',
    color: 'text-slate-300',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-400'
  },
  NORMAL: {
    label: 'Normal',
    color: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400'
  },
  ALTA: {
    label: 'Alta',
    color: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400'
  },
  CRITICA: {
    label: 'Crítica (SLA 2h)',
    color: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    dot: 'bg-rose-500'
  },
};

// Papéis de Usuário
export const ROLE_MAP: Record<UserRole, { label: string; badge: string }> = {
  ADMIN: {
    label: 'Administrador TI',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  TECNICO: {
    label: 'Técnico Especialista',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  CLIENTE: {
    label: 'Cliente / Solicitante',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }
};

// Calcula divisão financeira: 70% técnico / 30% empresa
export function calcularComissao(valorTotal: number): { taxaEmpresa: number; valorTecnico: number } {
  const taxaEmpresa = Math.round(valorTotal * 0.30 * 100) / 100;
  const valorTecnico = Math.round(valorTotal * 0.70 * 100) / 100;
  return { taxaEmpresa, valorTecnico };
}

// Ordena status no pipeline para fins de visualização
export const STATUS_ORDER: TicketStatus[] = [
  'AGUARDANDO_PAGAMENTO',
  'PAGO',
  'ACEITO',
  'A_CAMINHO',
  'EM_ATENDIMENTO',
  'AGUARDANDO_ASSINATURA',
  'AGUARDANDO_REPASSE',
  'FINALIZADO',
  'CANCELADO',
];
