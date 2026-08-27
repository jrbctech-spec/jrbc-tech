import { Chamado, Cliente, Usuario } from "@/types/database.types";
import { formatCurrency, formatDateTime } from "./utils";

export interface SendEmailPayload {
  to: string;
  subject: string;
  tipo: "ABERTURA_CHAMADO" | "CONCLUSAO_CHAMADO" | "NOVO_COMENTARIO";
  chamado: Chamado;
  cliente?: Cliente | null;
  solicitante?: Usuario | null;
}

export function generateTicketOpenEmailHtml(chamado: Chamado, cliente?: Cliente | null): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
      .header { background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%); padding: 30px; text-align: center; }
      .header h1 { margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; }
      .header p { margin: 6px 0 0 0; color: #e0f2fe; font-size: 14px; }
      .content { padding: 30px; line-height: 1.6; color: #cbd5e1; }
      .protocol-badge { display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 16px; margin-bottom: 15px; }
      .card { background-color: #0f172a; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
      .field { margin-bottom: 10px; }
      .field strong { color: #94a3b8; }
      .footer { background-color: #0b132b; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
      .btn { display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>JRBTC-TECH</h1>
        <p>Soluções Especializadas em Tecnologia da Informação</p>
      </div>
      <div class="content">
        <div class="protocol-badge">${chamado.numero_chamado}</div>
        <h2 style="color: #ffffff; margin-top: 0;">Chamado Registrado com Sucesso!</h2>
        <p>Olá <strong>${cliente?.nome_fantasia || cliente?.razao_social || 'Cliente'}</strong>,</p>
        <p>Confirmamos o recebimento de sua solicitação de suporte técnico de TI. Nossa equipe técnica já foi notificada e iniciará o atendimento dentro do SLA estabelecido.</p>
        
        <div class="card">
          <div class="field"><strong>Título:</strong> ${chamado.titulo}</div>
          <div class="field"><strong>Categoria:</strong> ${chamado.categoria?.nome || 'Geral'}</div>
          <div class="field"><strong>Prioridade:</strong> <span style="color: #38bdf8;">${chamado.prioridade}</span></div>
          <div class="field"><strong>Data de Abertura:</strong> ${formatDateTime(chamado.data_abertura)}</div>
          <div class="field"><strong>Descrição:</strong> ${chamado.descricao}</div>
        </div>

        <p>Você pode acompanhar o andamento, adicionar mensagens e interagir com o técnico responsável diretamente no painel:</p>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/chamados/${chamado.id}" class="btn" style="color:#ffffff;">
            Acompanhar Chamado Online
          </a>
        </p>
      </div>
      <div class="footer">
        JRBTC-TECH - E-mail: jrbctech@gmail.com | Suporte: (63) 98121-3180<br>
        Este é um e-mail automático enviado pelo sistema de Service Desk.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function generateTicketClosedEmailHtml(chamado: Chamado, cliente?: Cliente | null): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
      .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; }
      .header h1 { margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; }
      .header p { margin: 6px 0 0 0; color: #d1fae5; font-size: 14px; }
      .content { padding: 30px; line-height: 1.6; color: #cbd5e1; }
      .protocol-badge { display: inline-block; background-color: #10b981; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 16px; margin-bottom: 15px; }
      .card { background-color: #0f172a; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #10b981; }
      .field { margin-bottom: 10px; }
      .field strong { color: #94a3b8; }
      .footer { background-color: #0b132b; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
      .btn { display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>JRBTC-TECH</h1>
        <p>Ordem de Serviço Concluída</p>
      </div>
      <div class="content">
        <div class="protocol-badge">${chamado.numero_chamado}</div>
        <h2 style="color: #ffffff; margin-top: 0;">Chamado Finalizado com Sucesso!</h2>
        <p>Olá <strong>${cliente?.nome_fantasia || cliente?.razao_social || 'Cliente'}</strong>,</p>
        <p>Informamos que o atendimento técnico referente ao chamado <strong>${chamado.numero_chamado}</strong> foi concluído com êxito por nossa equipe.</p>
        
        <div class="card">
          <div class="field"><strong>Serviço:</strong> ${chamado.servico?.nome_servico || chamado.titulo}</div>
          <div class="field"><strong>Solução Aplicada:</strong> ${chamado.solucao || 'Serviço executado conforme padrões técnicos.'}</div>
          <div class="field"><strong>Tempo Gasto:</strong> ${chamado.tempo_atendimento_horas || 1} horas</div>
          <div class="field"><strong>Valor Total:</strong> ${formatCurrency(chamado.valor_servico || 0)}</div>
          <div class="field"><strong>Data de Conclusão:</strong> ${formatDateTime(chamado.data_conclusao || new Date().toISOString())}</div>
        </div>

        <p>Você pode acessar sua Ordem de Serviço / Recibo em PDF para download e conferência:</p>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/chamados/${chamado.id}" class="btn" style="color:#ffffff;">
            Visualizar e Baixar Ordem de Serviço (PDF)
          </a>
        </p>
      </div>
      <div class="footer">
        JRBTC-TECH - E-mail: jrbctech@gmail.com | Suporte: (63) 98121-3180<br>
        Obrigado pela confiança em nossos serviços de TI!
      </div>
    </div>
  </body>
  </html>
  `;
}

// Função de disparo para API interna
export async function sendEmailNotification(payload: SendEmailPayload) {
  try {
    // Server-side fetch (during build) requires an absolute URL.
    // Use NEXT_PUBLIC_APP_URL when available, otherwise VERCEL_URL or localhost.
    const base = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const url = new URL('/api/send-email', base).toString();

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error('Erro ao disparar notificação de e-mail:', error);
    return { success: false, error };
  }
}
