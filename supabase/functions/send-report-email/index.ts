import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * CONFIGURACIÓN DE CORREO ELECTRÓNICO
 *
 * IMPORTANTE: Configura aquí las credenciales del correo remitente
 *
 * Para Gmail:
 * 1. Ve a tu cuenta de Google: https://myaccount.google.com/
 * 2. Selecciona "Seguridad" en el menú lateral
 * 3. Busca "Verificación en dos pasos" y actívala si no lo está
 * 4. Busca "Contraseñas de aplicaciones" y haz clic
 * 5. Selecciona "Correo" y "Otro (nombre personalizado)"
 * 6. Escribe un nombre (ej: "Sistema Residuos")
 * 7. Copia la contraseña de 16 caracteres generada
 * 8. Pégala en EMAIL_PASSWORD abajo (sin espacios)
 *
 * NOTA: NO uses tu contraseña normal de Gmail, DEBE ser una contraseña de aplicación
 */
const EMAIL_CONFIG = {
  // Tu correo de Gmail (el que enviará los reportes)
  EMAIL_USER: "sustentabilidadsecrets@gmail.com",

  // Contraseña de aplicación de Gmail (16 caracteres sin espacios)
  EMAIL_PASSWORD: "uwxpeirjtiamhiev",

  // Configuración SMTP de Gmail (NO cambiar a menos que uses otro proveedor)
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,

  // Nombre que aparecerá como remitente
  FROM_NAME: "Sistema de Gestión de Residuos - Secrets Playa Blanca"
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
      attachment: JSON.stringify(reportData, null, 2),
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
      attachment: csv,
      filename: `reporte-${periodText.toLowerCase()}-${dateStr}.csv`,
      contentType: 'text/csv'
    };
  }

  // PDF/HTML
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reporte ${periodText}</title>
<style>body{font-family:Arial;margin:40px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px}th{background:#0ea5e9;color:white}</style>
</head>
<body>
<h1>Reporte ${periodText} de Residuos Sólidos</h1>
<p><strong>Período:</strong> ${startDate} - ${endDate}</p>
<table><tr><th>Tipo</th><th>Ubicación</th><th>Peso (kg)</th><th>Fecha</th><th>Hora</th></tr>
${(reportData.registros || []).map((r: any) => `<tr><td>${r.type}</td><td>${r.location}</td><td>${r.weight}</td><td>${r.date}</td><td>${r.time}</td></tr>`).join('')}
</table>
</body></html>`;

  return {
    attachment: html,
    filename: `reporte-${periodText.toLowerCase()}-${dateStr}.html`,
    contentType: 'text/html'
  };
}

interface EmailRequest {
  recipients: string[];
  reportData: any;
  reportFormat: 'pdf' | 'json' | 'csv';
  periodText: string;
  startDate: string;
  endDate: string;
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

    // Validate email configuration
    if (EMAIL_CONFIG.EMAIL_USER === "tucorreo@gmail.com" || EMAIL_CONFIG.EMAIL_PASSWORD === "xxxx xxxx xxxx xxxx") {
      return new Response(
        JSON.stringify({
          error: "Email not configured",
          message: "Por favor configura EMAIL_USER y EMAIL_PASSWORD en el código de la Edge Function"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Formatear fechas
    const startDateFormatted = startDate.split('T')[0];
    const endDateFormatted = endDate.split('T')[0];

    // Obtener estadísticas
    const totalRecords = reportData.estadisticas?.totalRegistros || reportData.registros?.length || 'N/A';
    const totalWeight = reportData.estadisticas?.pesoTotal || 'N/A';

    // Generar HTML del correo
    const htmlBody = generateEmailHTML(periodText, startDateFormatted, endDateFormatted, totalRecords, totalWeight);

    // Generar adjunto según formato
    const { attachment, filename, contentType } = generateAttachment(reportData, reportFormat, periodText, startDateFormatted, endDateFormatted);

    // Preparar el correo para cada destinatario
    const emailPromises = recipients.map(async (recipient) => {
      const emailData = {
        from: {
          name: EMAIL_CONFIG.FROM_NAME,
          email: EMAIL_CONFIG.EMAIL_USER
        },
        to: recipient,
        subject: `Reporte ${periodText} de Residuos Sólidos - ${startDateFormatted} a ${endDateFormatted}`,
        html: htmlBody,
        attachments: [{
          filename,
          content: attachment,
          contentType
        }]
      };

      // Enviar usando SMTP (simulado para Edge Functions)
      // Nota: Edge Functions no soportan SMTP directamente
      // Usa un servicio como Resend.com o SendGrid
      console.log(`Enviando a ${recipient}:`, filename);
      return { recipient, status: 'simulated' };
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Reporte preparado para ${recipients.length} destinatario(s)`,
        recipients,
        note: "Para envío real, integra Resend.com (https://resend.com) - es gratis hasta 3000 emails/mes"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-report-email:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error.message,
        hint: "Verifica que EMAIL_USER y EMAIL_PASSWORD estén configurados correctamente"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
