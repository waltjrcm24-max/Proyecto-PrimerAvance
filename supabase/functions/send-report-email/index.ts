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
  EMAIL_USER: "tucorreo@gmail.com",

  // Contraseña de aplicación de Gmail (16 caracteres sin espacios)
  EMAIL_PASSWORD: "xxxx xxxx xxxx xxxx",

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

    return new Response(
      JSON.stringify({
        success: true,
        message: `Configuración completa - ver archivo para editar credenciales`,
        note: "Este es un placeholder. Edita EMAIL_USER y EMAIL_PASSWORD en el código."
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
