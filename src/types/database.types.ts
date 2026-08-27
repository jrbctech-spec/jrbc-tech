// ============================================================================
// JRBTC-TECH — Tipos do Banco de Dados (Supabase PostgreSQL)
// ============================================================================

export type UserRole = 'ADMIN' | 'TECNICO' | 'CLIENTE';
export type TicketStatus =
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAGO'
  | 'ACEITO'
  | 'A_CAMINHO'
  | 'EM_ATENDIMENTO'
  | 'AGUARDANDO_ASSINATURA'
  | 'AGUARDANDO_REPASSE'
  | 'FINALIZADO'
  | 'CANCELADO'
  // Legacy aliases
  | 'ABERTO'
  | 'EM_ANALISE'
  | 'AGENDADO'
  | 'RESOLVIDO';

export type TicketPriority = 'BAIXA' | 'NORMAL' | 'ALTA' | 'CRITICA';
export type CommentVisibility = 'CLIENTE' | 'INTERNO';
export type AttachmentType = 'FOTO' | 'PDF' | 'DOCUMENTO' | 'ASSINATURA' | 'PROVA_EXECUCAO';
export type PaymentStatus = 'AGUARDANDO_PAGAMENTO' | 'PAGO' | 'REPASSADO';
export type PixType = 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';

export interface Cliente {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj?: string | null;
  cpf?: string | null;
  email: string;
  telefone?: string | null;
  whatsapp?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
  status: 'ATIVO' | 'INATIVO';
  created_at: string;
  updated_at: string;
}

export interface Usuario {
  id: string;
  auth_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  tipo_usuario: UserRole;
  cliente_id?: string | null;
  ativo: boolean;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos
  cliente?: Cliente | null;
}

export interface Tecnico {
  id: string;
  usuario_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  especialidades: string[];
  pix_chave?: string | null;
  pix_tipo?: PixType | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  usuario?: Usuario | null;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string | null;
  icone?: string | null;
  ativo: boolean;
  created_at: string;
}

export interface Servico {
  id: string;
  categoria_id: string;
  nome_servico: string;
  descricao?: string | null;
  sla_horas: number;
  valor_estimado: number;
  ativo: boolean;
  created_at: string;
  // Relacionamentos
  categoria?: Categoria | null;
}

export interface ChamadoHistorico {
  id: string;
  chamado_id: string;
  data_hora: string;
  usuario_email: string;
  tipo_evento: string;
  status_anterior?: string | null;
  status_novo?: string | null;
  descricao: string;
  created_at?: string;
}

export interface Comentario {
  id: string;
  chamado_id: string;
  usuario_id: string;
  mensagem: string;
  visibilidade: CommentVisibility;
  created_at: string;
  // Relacionamentos
  usuario?: Usuario | null;
}

export interface Anexo {
  id: string;
  chamado_id: string;
  arquivo_url: string;
  nome_arquivo?: string | null;
  tipo_anexo: AttachmentType;
  tamanho_bytes?: number | null;
  enviado_por: string;
  created_at: string;
}

export interface Chamado {
  id: string;
  numero_chamado: string;
  cliente_id: string;
  solicitante_id: string;
  categoria_id: string;
  servico_id: string;
  titulo: string;
  descricao: string;
  prioridade: TicketPriority;
  status: TicketStatus;
  tecnico_responsavel_id?: string | null;

  // Dados do Equipamento
  equipamento_marca?: string | null;
  equipamento_modelo?: string | null;
  equipamento_serial?: string | null;

  // Dados Financeiros
  valor_servico: number;
  valor_pago?: number | null;
  status_pagamento?: PaymentStatus | null;
  taxa_empresa?: number | null;   // 30%
  valor_tecnico?: number | null;  // 70%

  // Assinatura Digital
  assinatura_cliente_url?: string | null;

  // Timestamps Operacionais
  data_abertura: string;
  data_agendamento?: string | null;
  data_aceite_tecnico?: string | null;
  data_chegada_local?: string | null;
  data_inicio_atendimento?: string | null;
  data_conclusao?: string | null;

  // Laudo Técnico
  solucao?: string | null;
  observacoes_internas?: string | null;
  observacoes_cliente?: string | null;
  tempo_atendimento_horas?: number | null;

  created_at: string;
  updated_at: string;

  // Relacionamentos
  cliente?: Cliente | null;
  solicitante?: Usuario | null;
  categoria?: Categoria | null;
  servico?: Servico | null;
  tecnico_responsavel?: Tecnico | null;
  historico?: ChamadoHistorico[];
  comentarios?: Comentario[];
  anexos?: Anexo[];
}

export interface Noticia {
  id: string;
  titulo: string;
  texto: string;
  resumo?: string | null;
  imagem_url?: string | null;
  autor?: string | null;
  data_publicacao: string;
  ativo: boolean;
  created_at: string;
}

export interface Configuracao {
  chave: string;
  valor: string;
  descricao?: string | null;
  updated_at?: string;
}
