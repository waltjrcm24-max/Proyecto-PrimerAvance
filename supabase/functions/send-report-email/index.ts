import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from 'npm:resend@2.0.0';

/**
 * VERSIÓN CON RESEND.COM - MÉTODO MÁS SENCILLO
 *
 * 1. Regístrate en https://resend.com (gratis)
 * 2. Crea una API Key
 * 3. Pégala abajo en RESEND_API_KEY
 * 4. Despliega: npx supabase functions deploy send-report-email
 * 5. Listo!
 */

const RESEND_API_KEY = "re_FFGqL8xA_C4y4xxihU9PcZYrkX2Rj4Xu1"; // Reemplaza con tu API key

const EMAIL_CONFIG = {
  FROM_EMAIL: "noreply@resend.dev", // O tu dominio verificado
  FROM_NAME: "Sistema de Gestión de Residuos - Secrets Playa Blanca",
  REPLY_TO: "sustentabilidadsecrets@gmail.com"
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  recipients: string[];
  reportData: any;
  reportFormat: 'pdf' | 'json' | 'csv';
  periodText: string;
  startDate: string;
  endDate: string;
}

function generateEmailHTML(periodText: string, startDate: string, endDate: string, totalRecords: any, totalWeight: any): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 0 auto; }
.header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; }
.header h1 { margin: 0 0 10px 0; font-size: 24px; }
.content { background: #f9f9f9; padding: 30px; }
.stats { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }
.stats h3 { margin-top: 0; color: #0ea5e9; }
.stats p { margin: 10px 0; }
.footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Reporte de Residuos Sólidos</h1>
<p>Secrets Playa Blanca Costa Mujeres</p>
</div>
<div class="content">
<p>Estimado/a,</p>
<p>Adjunto encontrará el reporte <strong>${periodText}</strong> de gestión de residuos sólidos.</p>
<div class="stats">
<h3>Resumen del Período</h3>
<p><strong>Período:</strong> ${startDate} - ${endDate}</p>
<p><strong>Total de registros:</strong> ${totalRecords}</p>
<p><strong>Peso total:</strong> ${totalWeight}</p>
</div>
<p>El archivo adjunto contiene el detalle completo de todos los registros del período seleccionado.</p>
<p style="margin-top: 30px;">Saludos cordiales,<br><strong>Sistema de Gestión de Residuos Sólidos</strong><br>Sustentabilidad Secrets Playa Blanca</p>
</div>
<div class="footer">
<p>Este es un correo automático, por favor no responda a este mensaje.</p>
<p>Para consultas: ${EMAIL_CONFIG.REPLY_TO}</p>
<p>&copy; 2025 Secrets Playa Blanca Costa Mujeres</p>
</div>
</div>
</body>
</html>`;
}

function generateAttachment(reportData: any, format: string, periodText: string, startDate: string, endDate: string) {
  const dateStr = `${startDate}_${endDate}`;

  if (format === 'json') {
    return {
      content: Buffer.from(JSON.stringify(reportData, null, 2)).toString('base64'),
      filename: `reporte-${periodText.toLowerCase()}-${dateStr}.json`,
      contentType: 'application/json'
    };
  }

  if (format === 'csv') {
    let csv = 'Tipo de Residuo,Ubicación,Peso (kg),Fecha,Hora,Notas,Creado por\n';
    const registros = reportData.registros || [];
    for (const record of registros) {
      csv += `"${record.type}","${record.location}",${record.weight},"${record.date}","${record.time}","${record.notes || ''}","${record.createdBy || ''}"\n`;
    }
    return {
      content: Buffer.from(csv).toString('base64'),
      filename: `reporte-${periodText.toLowerCase()}-${dateStr}.csv`,
      contentType: 'text/csv'
    };
  }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reporte ${periodText}</title>
<style>body{font-family:Arial;margin:40px}h1{color:#0ea5e9}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#0ea5e9;color:white}@media print{body{margin:0}}</style>
</head>
<body>
<h1>Reporte ${periodText} de Residuos Sólidos</h1>
<p><strong>Período:</strong> ${startDate} - ${endDate}</p>
<p><strong>Total registros:</strong> ${reportData.estadisticas?.totalRegistros || 'N/A'}</p>
<p><strong>Peso total:</strong> ${reportData.estadisticas?.pesoTotal || 'N/A'}</p>
<table>
<tr><th>Tipo</th><th>Ubicación</th><th>Peso (kg)</th><th>Fecha</th><th>Hora</th><th>Notas</th></tr>
${(reportData.registros || []).map((r: any) =>
  `<tr><td>${r.type}</td><td>${r.location}</td><td>${r.weight}</td><td>${r.date}</td><td>${r.time}</td><td>${r.notes || ''}</td></tr>`
).join('')}
</table>
<p style="margin-top:30px"><small>Para guardar como PDF: Archivo → Imprimir → Guardar como PDF</small></p>
</body></html>`;

  return {
    content: Buffer.from(html).toString('base64'),
    filename: `reporte-${periodText.toLowerCase()}-${dateStr}.html`,
    contentType: 'text/html'
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { recipients, reportData, reportFormat, periodText, startDate, endDate }: EmailRequest = await req.json();

    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const startDateFormatted = startDate.split('T')[0];
    const endDateFormatted = endDate.split('T')[0];

    const totalRecords = reportData.estadisticas?.totalRegistros || reportData.registros?.length || 'N/A';
    const totalWeight = reportData.estadisticas?.pesoTotal || 'N/A';

    const htmlBody = generateEmailHTML(periodText, startDateFormatted, endDateFormatted, totalRecords, totalWeight);
    const { content, filename, contentType } = generateAttachment(reportData, reportFormat, periodText, startDateFormatted, endDateFormatted);

    const emailPromises = recipients.map(async (recipient) => {
      const { data, error } = await resend.emails.send({
        from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
        to: recipient,
        replyTo: EMAIL_CONFIG.REPLY_TO,
        subject: `Reporte ${periodText} de Residuos Sólidos - ${startDateFormatted} a ${endDateFormatted}`,
        html: htmlBody,
        attachments: [{
          filename,
          content,
        }]
      });

      if (error) {
        console.error(`Error enviando a ${recipient}:`, error);
        throw error;
      }

      console.log(`Enviado exitosamente a ${recipient}, ID: ${data?.id}`);
      return { recipient, status: 'sent', messageId: data?.id };
    });

    const results = await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Reporte enviado exitosamente a ${recipients.length} destinatario(s)`,
        recipients,
        results
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-report-email:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
