import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createTransport } from "npm:nodemailer@6.9.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  reportData: {
    titulo: string;
    hotel: string;
    fechaGeneracion: string;
    periodo: {
      tipo: string;
      fechaInicio: string;
      fechaFin: string;
    };
    estadisticas: {
      totalRegistros: number;
      pesoTotal: string;
      pesoPromedio: string;
      tiposResiduos: number;
      ubicaciones: number;
    };
    registros: Array<{
      type: string;
      location: string;
      weight: number;
      date: string;
      time: string;
      notes?: string;
    }>;
  };
  recipients: string[];
}

// Función para crear el HTML del email
function createEmailHTML(data: EmailRequest['reportData']): string {
  const registrosHTML = data.registros.map(record => `
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">${record.type}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">${record.location}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${record.weight.toFixed(2)} kg</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">${record.date}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">${record.time}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">${record.notes || '-'}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.titulo}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f3f4f6;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px;">${data.titulo}</h1>
          <h2 style="color: #4b5563; margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">${data.hotel}</h2>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Generado: ${data.fechaGeneracion}</p>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Período: ${data.periodo.fechaInicio} - ${data.periodo.fechaFin}</p>
        </div>

        <!-- Estadísticas -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #1e40af;">${data.estadisticas.totalRegistros}</div>
            <div style="color: #4b5563; font-size: 14px; margin-top: 5px;">Total Registros</div>
          </div>
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #059669;">${data.estadisticas.pesoTotal}</div>
            <div style="color: #4b5563; font-size: 14px; margin-top: 5px;">Peso Total</div>
          </div>
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #d97706;">${data.estadisticas.pesoPromedio}</div>
            <div style="color: #4b5563; font-size: 14px; margin-top: 5px;">Peso Promedio</div>
          </div>
          <div style="background-color: #e9d5ff; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #7c3aed;">${data.estadisticas.tiposResiduos}</div>
            <div style="color: #4b5563; font-size: 14px; margin-top: 5px;">Tipos de Residuos</div>
          </div>
        </div>

        <!-- Tabla de Registros -->
        <div style="margin-top: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">Detalle de Registros</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; background-color: white;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; color: #374151; font-weight: 600;">Tipo</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; color: #374151; font-weight: 600;">Ubicación</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #374151; font-weight: 600;">Peso (kg)</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; color: #374151; font-weight: 600;">Fecha</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; color: #374151; font-weight: 600;">Hora</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; color: #374151; font-weight: 600;">Notas</th>
                </tr>
              </thead>
              <tbody>
                ${registrosHTML}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Este es un reporte automático generado por el Sistema de Gestión de Residuos Sólidos</p>
          <p style="margin-top: 5px;">${data.hotel}</p>
          <p style="margin-top: 10px; color: #9ca3af;">Para consultas, contacte al departamento de sustentabilidad</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

Deno.serve(async (req: Request) => {
  // Manejar preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { reportData, recipients }: EmailRequest = await req.json();

    // Validar datos
    if (!reportData || !recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Faltan datos requeridos: reportData y recipients"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Configuración del transportador SMTP
    // ESTAS VARIABLES SE CONFIGURAN EN SUPABASE DASHBOARD
    const transporter = createTransport({
      host: Deno.env.get("SMTP_HOST"), // ej: smtp.gmail.com
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      secure: Deno.env.get("SMTP_SECURE") === "true", // true para puerto 465, false para otros
      auth: {
        user: Deno.env.get("SMTP_USER"), // tu email
        pass: Deno.env.get("SMTP_PASS"), // tu contraseña o app password
      },
    });

    // Crear el HTML del email
    const htmlContent = createEmailHTML(reportData);

    // Configurar el email
    const mailOptions = {
      from: `"${Deno.env.get("SMTP_FROM_NAME") || 'Sistema de Residuos'}" <${Deno.env.get("SMTP_USER")}>`,
      to: recipients.join(", "),
      subject: `${reportData.titulo} - ${reportData.hotel}`,
      html: htmlContent,
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email enviado:", info.messageId);
    console.log("Destinatarios:", recipients);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reporte enviado exitosamente",
        messageId: info.messageId,
        recipients: recipients,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error enviando email:", error);

    return new Response(
      JSON.stringify({
        error: "Error al enviar el email",
        details: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
