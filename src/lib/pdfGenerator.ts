import jsPDF from "jspdf";
import { Chamado, Cliente, Tecnico, Usuario } from "@/types/database.types";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";

interface GeneratePDFParams {
  chamado: Chamado;
  cliente?: Cliente | null;
  solicitante?: Usuario | null;
  tecnico?: Tecnico | null;
}

export function generateServiceOrderPDF({
  chamado,
  cliente,
  solicitante,
  tecnico,
}: GeneratePDFParams): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let currentY = 16;

  // --- CABEÇALHO CORPORATIVO JRBTC-TECH ---
  // Barra de destaque superior
  doc.setFillColor(14, 165, 233); // #0ea5e9 Blue
  doc.rect(0, 0, pageWidth, 6, "F");

  // Logo / Título da Empresa
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(7, 12, 29); // Navy dark
  doc.text("JRBTC-TECH", margin, currentY + 4);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Soluções Especializadas em Tecnologia da Informação", margin, currentY + 9);
  doc.text("CNPJ: 45.123.456/0001-89 | E-mail: jrbctech@gmail.com | Tel: (63) 98121-3180", margin, currentY + 14);

  // Caixa de Protocolo da Ordem de Serviço (Direita)
  const boxWidth = 60;
  const boxHeight = 18;
  const boxX = pageWidth - margin - boxWidth;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(boxX, currentY - 2, boxWidth, boxHeight, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ORDEM DE SERVIÇO / RECIBO", boxX + 4, currentY + 3);

  doc.setFontSize(12);
  doc.setTextColor(14, 165, 233);
  doc.text(chamado.numero_chamado, boxX + 4, currentY + 11);

  currentY += 24;

  // Linha divisória
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // --- SEÇÃO 1: DADOS DO CLIENTE E SOLICITANTE ---
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 7, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("1. IDENTIFICAÇÃO DO CLIENTE E SOLICITANTE", margin + 4, currentY + 5);
  currentY += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);

  const col1 = margin + 2;
  const col2 = margin + 95;

  const razaoSocial = cliente?.razao_social || cliente?.nome_fantasia || "Cliente Corporativo";
  const docCliente = cliente?.cnpj ? `CNPJ: ${cliente.cnpj}` : cliente?.cpf ? `CPF: ${cliente.cpf}` : "CNPJ/CPF: Não informado";
  const nomeSolicitante = solicitante?.nome || "Solicitante não informado";
  const emailContato = solicitante?.email || cliente?.email || "contato@cliente.com";
  const telefoneContato = solicitante?.telefone || cliente?.whatsapp || cliente?.telefone || "(Não informado)";
  const enderecoCliente = cliente?.endereco ? `${cliente.endereco}, ${cliente.cidade || ''} - ${cliente.estado || ''}` : "Atendimento Remoto / Local";

  doc.setFont("helvetica", "bold");
  doc.text("Razão Social / Nome:", col1, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(razaoSocial, col1 + 38, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Documento:", col2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(docCliente, col2 + 22, currentY);
  currentY += 5.5;

  doc.setFont("helvetica", "bold");
  doc.text("Solicitante:", col1, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(nomeSolicitante, col1 + 22, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Telefone / Celular:", col2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(telefoneContato, col2 + 32, currentY);
  currentY += 5.5;

  doc.setFont("helvetica", "bold");
  doc.text("E-mail:", col1, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(emailContato, col1 + 16, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Localização:", col2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(enderecoCliente.slice(0, 42), col2 + 22, currentY);
  currentY += 8;

  // --- SEÇÃO 2: DETALHES DO ATENDIMENTO E DATAS ---
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 7, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("2. DADOS DO CHAMADO TÉCNICO", margin + 4, currentY + 5);
  currentY += 10;

  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  doc.setFont("helvetica", "bold");
  doc.text("Categoria:", col1, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(chamado.categoria?.nome || "TI Especializada", col1 + 20, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Serviço:", col2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(chamado.servico?.nome_servico || chamado.titulo, col2 + 16, currentY);
  currentY += 5.5;

  doc.setFont("helvetica", "bold");
  doc.text("Data Abertura:", col1, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(chamado.data_abertura), col1 + 26, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Data Conclusão:", col2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(chamado.data_conclusao || new Date().toISOString()), col2 + 28, currentY);
  currentY += 5.5;

  doc.setFont("helvetica", "bold");
  doc.text("Prioridade:", col1, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(chamado.prioridade, col1 + 20, currentY);

  doc.setFont("helvetica", "bold");
  doc.text("Técnico Resp.:", col2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(tecnico?.nome || chamado.tecnico_responsavel?.nome || "Carlos Silva (JRBTC-TECH)", col2 + 26, currentY);
  currentY += 8;

  // --- SEÇÃO 3: DESCRIÇÃO DA SOLICITAÇÃO ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 22, 1, 1, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("TÍTULO / SINTOMA DO PROBLEMA:", margin + 4, currentY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const descLines = doc.splitTextToSize(chamado.descricao || chamado.titulo, pageWidth - (margin * 2) - 8);
  doc.text(descLines.slice(0, 3), margin + 4, currentY + 10);
  currentY += 26;

  // --- SEÇÃO 4: DIAGNÓSTICO E SOLUÇÃO TÉCNICA APLICADA ---
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 7, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("3. DIAGNÓSTICO E SOLUÇÃO TÉCNICA APLICADA", margin + 4, currentY + 5);
  currentY += 10;

  const solucaoTexto = chamado.solucao || "Serviço executado em conformidade com as normas técnicas de segurança e boas práticas de TI. Sistema configurado, validado e liberado para uso.";
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 26, 1, 1, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const solucaoLines = doc.splitTextToSize(solucaoTexto, pageWidth - (margin * 2) - 8);
  doc.text(solucaoLines.slice(0, 4), margin + 4, currentY + 6);
  currentY += 30;

  // --- SEÇÃO 5: DEMONSTRATIVO FINANCEIRO E HORAS ---
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 7, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("4. VALORES E TEMPO DE ATENDIMENTO", margin + 4, currentY + 5);
  currentY += 10;

  // Tabela simples de valores
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("ITEM / DESCRIÇÃO", margin + 4, currentY + 4.5);
  doc.text("TEMPO (HORAS)", margin + 110, currentY + 4.5);
  doc.text("VALOR TOTAL", margin + 150, currentY + 4.5);
  currentY += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(chamado.servico?.nome_servico || chamado.titulo, margin + 4, currentY + 4.5);
  doc.text(`${(chamado.tempo_atendimento_horas || 1.5).toFixed(1)}h`, margin + 115, currentY + 4.5);
  doc.text(formatCurrency(chamado.valor_servico || 250.00), margin + 150, currentY + 4.5);
  currentY += 8;

  // Linha totalizadora
  doc.setFillColor(224, 242, 254); // Light blue
  doc.roundedRect(pageWidth - margin - 70, currentY, 70, 9, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(3, 105, 161);
  doc.text("VALOR TOTAL:", pageWidth - margin - 65, currentY + 6);
  doc.text(formatCurrency(chamado.valor_servico || 250.00), pageWidth - margin - 28, currentY + 6);
  currentY += 16;

  // --- SEÇÃO 6: TERMO DE ACEITE E ASSINATURAS ---
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Declaro que os serviços acima descritos foram devidamente executados, testados e aprovados nesta data.",
    margin,
    currentY
  );
  currentY += 14;

  const sigWidth = 75;
  const sig1X = margin + 8;
  const sig2X = pageWidth - margin - sigWidth - 8;

  // Assinatura Técnico
  doc.setDrawColor(148, 163, 184);
  doc.line(sig1X, currentY, sig1X + sigWidth, currentY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text("JRBTC-TECH - Técnico Responsável", sig1X + 4, currentY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(tecnico?.nome || "Carlos Silva", sig1X + 4, currentY + 8);

  // Assinatura Cliente
  doc.line(sig2X, currentY, sig2X + sigWidth, currentY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Cliente / Solicitante", sig2X + 16, currentY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(nomeSolicitante, sig2X + 16, currentY + 8);

  // Rodapé com data de emissão e autenticação
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Documento emitido eletronicamente via Sistema JRBTC-TECH em ${formatDate(new Date().toISOString())}. Validação: ${chamado.id.slice(0, 8).toUpperCase()}`,
    margin,
    290
  );

  return doc;
}
