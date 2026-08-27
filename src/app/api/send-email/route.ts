import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { generateTicketOpenEmailHtml, generateTicketClosedEmailHtml, SendEmailPayload } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const body: SendEmailPayload = await req.json();
    const { to, subject, tipo, chamado, cliente, solicitante } = body;

    let htmlContent = "";
    if (tipo === "ABERTURA_CHAMADO") {
      htmlContent = generateTicketOpenEmailHtml(chamado, cliente);
    } else if (tipo === "CONCLUSAO_CHAMADO") {
      htmlContent = generateTicketClosedEmailHtml(chamado, cliente);
    } else {
      htmlContent = `<p>Notificação sobre o chamado ${chamado.numero_chamado}</p>`;
    }

    const recipientList = [to, "jrbctech@gmail.com"];

    // 1. Tentar via Resend se RESEND_API_KEY estiver configurado
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const data = await resend.emails.send({
        from: "JRBTC-TECH Suporte <suporte@jrbtc.com.br>",
        to: recipientList,
        subject: subject,
        html: htmlContent,
      });
      return NextResponse.json({ success: true, provider: "resend", data });
    }

    // 2. Tentar via Nodemailer SMTP se configurado
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"JRBTC-TECH Suporte" <jrbctech@gmail.com>',
        to: recipientList.join(", "),
        subject: subject,
        html: htmlContent,
      });

      return NextResponse.json({ success: true, provider: "smtp", messageId: info.messageId });
    }

    // 3. Fallback Simulador em desenvolvimento
    console.log("==================================================");
    console.log("[JRBTC-TECH EMAIL SIMULATOR]");
    console.log(`Para: ${recipientList.join(", ")}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Tipo: ${tipo}`);
    console.log(`Chamado: ${chamado.numero_chamado} - ${chamado.titulo}`);
    console.log("==================================================");

    return NextResponse.json({
      success: true,
      provider: "simulator",
      message: "E-mail registrado no console (Configure RESEND_API_KEY ou SMTP para envio real em produção).",
    });
  } catch (error: any) {
    console.error("Erro na API de envio de e-mail:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
