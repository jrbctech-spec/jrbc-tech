# JRBTC-TECH - Sistema de Gestão de Chamados Técnicos de TI

Aplicação Full-Stack PWA responsiva (Web, Tablet e Mobile) de Gestão de Chamados Técnicos e Service Desk desenvolvida especificamente para a empresa **JRBTC-TECH**.

---

## 🚀 Principais Funcionalidades

1. **Controle de Acesso por Perfis (RBAC & RLS)**:
   - **ADMIN**: Visão gerencial completa, Quadro Kanban, Gestão de Clientes, Técnicos, Catálogo de Serviços, Faturamento e Métricas de SLA.
   - **TÉCNICO**: Fila de atendimento, diagnóstico técnico, registro de horas trabalhadas, encerramento de chamados e emissão de Ordem de Serviço.
   - **CLIENTE**: Abertura dinâmica de chamados, acompanhamento de status em tempo real, mural de notícias, chat e download de O.S. em PDF.

2. **Abertura Inteligente de Chamados**:
   - Seleção em cascata dinâmica: **Especialidade de TI** (*Microinformática*, *Infraestrutura de TI*, *Banco de Dados*) ➔ **Serviço Específico**.
   - Definição de prioridades com prazos de SLA automáticos (*Crítica 2h, Alta 8h, Normal 24h, Baixa 48h*).
   - Dropzone para upload de fotos e prints de evidências.
   - Geração automática de protocolo sequencial anual no formato `CH-YYYY-000001`.

3. **Linha do Tempo de Auditoria & Chat com Notas Internas**:
   - Auditoria automática de todas as transições de status na tabela `chamado_historico`.
   - Sistema de mensagens com separador de visibilidade (*Visível ao Cliente* vs *Nota Interna Privada para a equipe técnica*).

4. **Emissão de Ordem de Serviço e Recibo em PDF**:
   - Geração de documento em PDF timbrado com identidade visual **JRBTC-TECH**.
   - Detalhamento do cliente, solicitante, laudo técnico, solução aplicada, horas trabalhadas, valor total e campos de assinatura digital/manual.

5. **Notificações Automáticas por E-mail**:
   - Disparo automático de e-mail ao cliente e para **`jrbctech@gmail.com`** na abertura e no encerramento do chamado com resumo da O.S.

6. **Progressive Web App (PWA)**:
   - Totalmente instalável em smartphones e tablets com suporte a funcionamento offline via Service Worker (`sw.js` e `manifest.json`).

---

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend & Banco de Dados**: Supabase (PostgreSQL + Auth + Storage) com Row Level Security (RLS) e Triggers.
- **Geração de Documentos**: jsPDF para emissão de Ordens de Serviço em PDF.
- **E-mails**: Resend / Nodemailer (SMTP) com templates HTML responsivos.

---

## 🗄️ Modelagem do Banco de Dados (11 Tabelas)

O script SQL de migração e criação das tabelas está disponível em [`supabase/schema.sql`](./supabase/schema.sql):

1. `usuarios`
2. `clientes`
3. `tecnicos`
4. `categorias`
5. `servicos`
6. `chamados`
7. `chamado_historico`
8. `comentarios`
9. `anexos`
10. `noticias`
11. `configuracoes`

O script de dados iniciais e sementes está em [`supabase/seed.sql`](./supabase/seed.sql).

---

## 📦 Como Executar Localmente

### 1. Pré-requisitos
- Node.js v18+ instalado.

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Configuração das Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` inserindo suas credenciais do Supabase e do serviço de e-mail.

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

> **Nota:** A aplicação conta com um modo de demonstração local integrado com alternador de perfis instantâneo (Admin, Técnico e Cliente) no topo da barra de navegação.

---

## 🌐 Deploy em Produção (Vercel / Netlify)

1. Faça o fork ou push do repositório para o seu GitHub.
2. Na Vercel ou Netlify, importe o projeto Next.js.
3. Configure as variáveis de ambiente presentes no `.env.example`.
4. O deploy será realizado de forma automatizada com otimização global.

---

## 📧 Suporte e Contato

- **Empresa**: JRBTC-TECH Soluções em TI
- **E-mail**: `jrbctech@gmail.com`
- **Telefone**: (11) 98765-4321
