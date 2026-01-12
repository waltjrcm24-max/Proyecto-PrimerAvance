# ⚡ Método MÁS SENCILLO: Resend.com

## Por qué es más sencillo que Spring Boot

**Spring Boot requiere:**
- Instalar Java 17
- Instalar Maven
- Ejecutar servidor en puerto 8080
- Configurar SMTP
- Mantener servidor corriendo 24/7

**Resend requiere:**
- Solo una API Key (gratis)
- Ya está integrado con Supabase
- No necesita servidor adicional
- 100 emails/día gratis (3000/mes)

---

## Paso 1: Crear Cuenta en Resend (2 minutos)

1. Ve a: https://resend.com/signup
2. Regístrate con tu correo
3. Verifica tu email
4. En el dashboard, clic en "API Keys"
5. Crea una nueva API Key
6. Cópiala (empieza con `re_`)

**Gratis hasta 100 emails/día** (suficiente para reportes)

---

## Paso 2: Verificar tu Dominio

### Opción A: Usar dominio de Resend (Más fácil)
Resend te da un dominio gratis: `onboarding@resend.dev`
Ya funciona sin configuración.

### Opción B: Usar tu propio dominio (Recomendado)
1. En Resend, ve a "Domains"
2. Agrega tu dominio de Hostinger
3. Copia los registros DNS que te da Resend
4. Ve al panel de Hostinger → DNS
5. Agrega los registros
6. Espera 10 minutos y verifica

---

## Paso 3: Integrar con Supabase Edge Function

Ya tienes la Edge Function creada. Solo agrega Resend:

### Desplegar la función:

```bash
# La función ya existe en: supabase/functions/send-report-email/
# Solo necesitas desplegarla
```

Desde tu aplicación web (Supabase Dashboard):
1. Ve a: https://supabase.com/dashboard/project/TU_PROYECTO_ID/functions
2. Sube la función `send-report-email`

---

## Paso 4: Actualizar la Edge Function para usar Resend

Edita: `supabase/functions/send-report-email/index.ts`

Reemplaza la sección de envío (líneas 90-112) con:

```typescript
// Importar Resend al inicio del archivo
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend('re_TU_API_KEY_AQUI');

// En el código de envío:
const emailPromises = recipients.map(async (recipient) => {
  const { data, error } = await resend.emails.send({
    from: `${EMAIL_CONFIG.FROM_NAME} <noreply@resend.dev>`,
    to: recipient,
    subject: `Reporte ${periodText} de Residuos Sólidos - ${startDateFormatted} a ${endDateFormatted}`,
    html: htmlBody,
    attachments: [{
      filename,
      content: Buffer.from(attachment).toString('base64'),
    }]
  });

  if (error) {
    console.error(`Error enviando a ${recipient}:`, error);
    throw error;
  }

  return { recipient, status: 'sent', messageId: data?.id };
});
```

---

## Paso 5: Actualizar Frontend para usar Edge Function

Edita: `src/components/Reports.tsx`

Busca la función `handleSendEmail` y actualiza la URL:

```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-report-email`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      recipients: selectedEmails,
      reportData: {
        registros: filteredRecords,
        estadisticas: {
          totalRegistros: filteredRecords.length,
          pesoTotal: `${filteredRecords.reduce((sum, r) => sum + r.weight, 0)} kg`
        }
      },
      reportFormat: reportFormat,
      periodText: getPeriodText(),
      startDate: startDate,
      endDate: endDate
    })
  }
);
```

---

## Comparación

### Spring Boot
```bash
# Terminal 1
cd backend-springboot
mvn spring-boot:run

# Terminal 2
npm run dev

# Requiere: Java + Maven + Config SMTP
```

### Resend + Supabase
```bash
# Solo 1 terminal
npm run dev

# Requiere: Solo API Key de Resend
```

---

## Costos

**Resend Gratis:**
- 3,000 emails/mes
- 100 emails/día
- Perfecto para reportes

**Resend Pro ($20/mes):**
- 50,000 emails/mes
- Soporte prioritario

**Spring Boot:**
- Gratis, pero necesitas servidor 24/7
- Hosting puede costar $5-20/mes

---

## Desplegar en Hostinger

### Con Spring Boot:
1. Compilar backend Java
2. Subir .jar al servidor
3. Instalar Java en servidor
4. Ejecutar con `java -jar`
5. Configurar para que corra 24/7
6. Compilar y subir frontend

### Con Resend + Edge Functions:
1. Compilar frontend: `npm run build`
2. Subir `dist/*` a `public_html/`
3. Listo

Las Edge Functions de Supabase se ejecutan automáticamente, no necesitas servidor.

---

## Recomendación Final

**USA RESEND** porque:

✅ Más fácil de configurar (solo API key)
✅ No requiere Java/Maven
✅ No requiere servidor adicional
✅ Gratis hasta 3000 emails/mes
✅ Más fácil de desplegar en Hostinger
✅ Menos mantenimiento
✅ Funciona directo con Supabase

**Usa Spring Boot solo si:**
- Ya tienes servidor Java
- Necesitas más de 3000 emails/mes
- Prefieres tener control total del SMTP

---

## Configuración Rápida (5 minutos)

```bash
# 1. Regístrate en Resend.com
# 2. Copia tu API Key

# 3. Edita la Edge Function
# Línea 107: const resend = new Resend('re_TU_API_KEY');

# 4. Despliega
npx supabase functions deploy send-report-email

# 5. Listo
npm run dev
```

---

## Código Completo con Resend

Ver archivo: `supabase/functions/send-report-email/RESEND-VERSION.ts`

---

## Soporte

**Resend Docs:** https://resend.com/docs
**Supabase Edge Functions:** https://supabase.com/docs/guides/functions

**Tu correo:** sustentabilidadsecrets@gmail.com (solo cambia el FROM en Resend)

---

**Método recomendado:** Resend.com
**Alternativa:** Spring Boot (si necesitas más control)
**Estado:** Listo para usar con cualquier método
