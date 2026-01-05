# Guía de Configuración de Envío de Reportes por Email

## Introducción

Esta guía te explica paso a paso cómo configurar el envío automático de reportes por correo electrónico desde el sistema de gestión de residuos sólidos.

---

## Características del Sistema

### Formatos de Reporte Disponibles
- **CSV/Excel:** Archivo compatible con hojas de cálculo
- **JSON:** Formato estructurado para integración con otros sistemas
- **PDF/HTML:** Archivo listo para imprimir o visualizar

### Funcionalidades
- Envío a múltiples destinatarios simultáneamente
- Adjunta automáticamente el reporte en el formato seleccionado
- Email con diseño profesional y resumen del reporte
- Registro de destinatarios configurables desde la interfaz

---

## PASO 1: Configurar Gmail para Enviar Correos

### ¿Por qué Gmail?

Gmail es gratuito, confiable y ampliamente utilizado. El sistema usa el servidor SMTP de Gmail para enviar correos.

### ⚠️ IMPORTANTE: Contraseña de Aplicación

**NO USES tu contraseña normal de Gmail.** Debes generar una "Contraseña de Aplicación" específica.

---

## PASO 2: Generar Contraseña de Aplicación de Gmail

### Requisitos Previos

Tu cuenta de Gmail debe tener activada la **verificación en dos pasos** (2FA).

---

### Instrucciones Detalladas

#### 1. Activar la Verificación en Dos Pasos (si no está activa)

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú lateral, selecciona **"Seguridad"**
3. Busca la sección **"Cómo inicias sesión en Google"**
4. Haz clic en **"Verificación en dos pasos"**
5. Sigue las instrucciones para activarla (necesitarás tu teléfono)

#### 2. Generar la Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
   - O busca "Contraseñas de aplicaciones" en la configuración de seguridad

2. Es posible que te pida iniciar sesión nuevamente

3. En "Selecciona la app", elige **"Correo"**

4. En "Selecciona el dispositivo", elige **"Otro (nombre personalizado)"**

5. Escribe un nombre descriptivo, por ejemplo:
   ```
   Sistema Residuos Secrets
   ```

6. Haz clic en **"Generar"**

7. Gmail te mostrará una contraseña de 16 caracteres como esta:
   ```
   abcd efgh ijkl mnop
   ```

8. **COPIA esta contraseña inmediatamente** (no podrás verla después)

---

### Ejemplo Visual

```
┌─────────────────────────────────────┐
│  Tu contraseña de aplicación        │
│                                     │
│  [abcd efgh ijkl mnop]             │
│                                     │
│  Usa esta contraseña en lugar de   │
│  tu contraseña de Google.          │
│                                     │
│  [   Listo   ]                     │
└─────────────────────────────────────┘
```

---

## PASO 3: Configurar el Código de la Edge Function

### Ubicación del Archivo

El archivo de configuración está en:
```
supabase/functions/send-report-email/index.ts
```

### Editar Configuración

Busca la sección `EMAIL_CONFIG` al inicio del archivo (líneas 10-25):

```typescript
const EMAIL_CONFIG = {
  // Tu correo de Gmail (el que enviará los reportes)
  EMAIL_USER: "tucorreo@gmail.com",

  // Contraseña de aplicación de Gmail (16 caracteres sin espacios)
  EMAIL_PASSWORD: "xxxx xxxx xxxx xxxx",

  // Configuración SMTP de Gmail (NO cambiar)
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,

  // Nombre que aparecerá como remitente
  FROM_NAME: "Sistema de Gestión de Residuos - Secrets Playa Blanca"
};
```

### Ejemplo de Configuración Completa

```typescript
const EMAIL_CONFIG = {
  EMAIL_USER: "residuos.secrets@gmail.com",
  EMAIL_PASSWORD: "abcd efgh ijkl mnop",
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,
  FROM_NAME: "Sistema de Gestión de Residuos - Secrets Playa Blanca"
};
```

### ⚠️ Consideraciones Importantes

1. **EMAIL_USER:**
   - Usa un correo corporativo o dedicado para el sistema
   - Ejemplo: `residuos.secrets@gmail.com` o `notificaciones.hotel@gmail.com`

2. **EMAIL_PASSWORD:**
   - DEBE ser la contraseña de aplicación de 16 caracteres
   - Puedes escribirla con o sin espacios (el sistema los elimina automáticamente)
   - Ejemplos válidos:
     - `"abcd efgh ijkl mnop"` ✅
     - `"abcdefghijklmnop"` ✅

3. **FROM_NAME:**
   - Personaliza el nombre que verán los destinatarios
   - Máximo 50 caracteres recomendado

---

## PASO 4: Redesplegar la Edge Function

Después de modificar el código, debes redesplegar la función.

### Opción A: Desde Bolt.new (si estás en el entorno de desarrollo)

La función se despliega automáticamente cuando guardas los cambios.

### Opción B: Desde Supabase Dashboard

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Edge Functions"
4. Encuentra "send-report-email"
5. Haz clic en "Deploy"

---

## PASO 5: Configurar Destinatarios en la Aplicación

### Desde la Vista de Administrador

1. Inicia sesión como **Administrador**
2. Ve a la sección **"Reportes"**
3. Haz clic en el botón **"Emails"** (azul)
4. Se abrirá el panel de configuración de correos

### Agregar Destinatarios

```
┌────────────────────────────────────────┐
│  Configuración de Correos              │
│                                        │
│  [Nombre] [Email] [Agregar]           │
│                                        │
│  Lista de destinatarios:               │
│  • Juan Pérez (juan@hotel.com) [🗑️]   │
│  • María López (maria@hotel.com) [🗑️] │
└────────────────────────────────────────┘
```

#### Pasos:

1. Escribe el **nombre** del destinatario
2. Escribe su **correo electrónico**
3. Haz clic en **"Agregar"**
4. El destinatario aparecerá en la lista

#### Eliminar Destinatarios

- Haz clic en el ícono de papelera (🗑️) junto al destinatario

---

## PASO 6: Enviar un Reporte por Email

### Proceso Completo

1. **Selecciona el formato:**
   - En el dropdown junto a "Descargar", elige:
     - Excel/CSV
     - JSON
     - PDF

2. **Selecciona el período:**
   - Diario (hoy)
   - Semanal (últimos 7 días)
   - Mensual (mes actual)
   - Personalizado (rango específico)

3. **Verifica los filtros:**
   - Puedes filtrar por tipo de residuo o ubicación antes de enviar

4. **Haz clic en "Enviar"** (botón verde)

5. **Espera la confirmación:**
   - Si todo está bien: "✅ Reporte enviado exitosamente a: ..."
   - Si falta configuración: "⚠️ El correo no está configurado..."
   - Si hay error: "❌ Error al enviar el reporte..."

---

## Ejemplos de Casos de Uso

### Caso 1: Reporte Semanal al Gerente

**Configuración:**
```
Destinatarios:
- Gerente General (gerente@secrets.com)

Formato: Excel/CSV
Período: Semanal
```

**Resultado:**
El gerente recibe cada semana un archivo CSV con todos los registros de residuos de los últimos 7 días.

---

### Caso 2: Reporte Mensual a Múltiples Departamentos

**Configuración:**
```
Destinatarios:
- Gerente Operaciones (ops@secrets.com)
- Jefe de Mantenimiento (mantenimiento@secrets.com)
- Director Sustentabilidad (sustentabilidad@secrets.com)

Formato: PDF
Período: Mensual
```

**Resultado:**
Los tres departamentos reciben un PDF con el reporte mensual completo.

---

### Caso 3: Reporte JSON para Sistema Externo

**Configuración:**
```
Destinatarios:
- Sistema Automatizado (api@sistema-externo.com)

Formato: JSON
Período: Diario
```

**Resultado:**
El sistema externo recibe diariamente un archivo JSON estructurado para procesamiento automático.

---

## Contenido del Email

### Asunto del Email

```
Reporte [Diario/Semanal/Mensual] de Residuos Sólidos - [Fecha Inicio] a [Fecha Fin]
```

Ejemplo:
```
Reporte Semanal de Residuos Sólidos - 01/01/2025 a 07/01/2025
```

### Cuerpo del Email (Vista Previa)

```
┌─────────────────────────────────────────┐
│  Reporte de Residuos Sólidos           │
│  Secrets Playa Blanca Costa Mujeres    │
├─────────────────────────────────────────┤
│                                         │
│  Estimado/a,                           │
│                                         │
│  Adjunto encontrará el reporte Semanal │
│  de gestión de residuos sólidos.       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Resumen del Período               │ │
│  │                                   │ │
│  │ Período: 01/01/2025 - 07/01/2025 │ │
│  │ Total de registros: 145           │ │
│  │ Peso total: 1,234.5 kg           │ │
│  │ Formato: CSV                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  El archivo adjunto contiene el        │
│  detalle completo de todos los         │
│  registros del período seleccionado.   │
│                                         │
│  Saludos cordiales,                    │
│  Sistema de Gestión de Residuos       │
│  Sólidos                               │
│                                         │
├─────────────────────────────────────────┤
│  Este es un correo automático.         │
│  © 2025 Secrets Playa Blanca           │
└─────────────────────────────────────────┘

📎 Adjunto: reporte-semanal-2025-01-01_2025-01-07.csv
```

---

## Formatos de Archivo Adjunto

### CSV/Excel

**Estructura:**

```csv
Tipo de Residuo,Ubicación,Peso (kg),Fecha,Hora,Notas,Creado por
Orgánicos,Cocina central,45.5,01/01/2025,08:30,Sin notas,Juan Pérez
Pet,Bares,12.3,01/01/2025,10:15,Botellas de agua,María López
```

**Ventajas:**
- Fácil de abrir en Excel o Google Sheets
- Ideal para análisis y gráficos
- Compatible con cualquier sistema

---

### JSON

**Estructura:**

```json
{
  "titulo": "Reporte Semanal de Residuos Sólidos",
  "hotel": "Secrets Playa Blanca Costa Mujeres",
  "fechaGeneracion": "05/01/2025, 14:30:00",
  "periodo": {
    "tipo": "Semanal",
    "fechaInicio": "01/01/2025",
    "fechaFin": "07/01/2025"
  },
  "estadisticas": {
    "totalRegistros": 145,
    "pesoTotal": "1234.5 kg",
    "pesoPromedio": "8.5 kg",
    "tiposResiduos": 17,
    "ubicaciones": 48
  },
  "registros": [
    {
      "id": "uuid-1234",
      "type": "Orgánicos",
      "location": "Cocina central",
      "weight": 45.5,
      "date": "2025-01-01",
      "time": "08:30",
      "notes": "Sin notas",
      "createdBy": "Juan Pérez"
    }
  ]
}
```

**Ventajas:**
- Formato estructurado
- Ideal para APIs y sistemas automatizados
- Fácil de parsear programáticamente

---

### PDF/HTML

**Formato:**

Archivo HTML que puede abrirse en navegador e imprimirse como PDF.

**Ventajas:**
- Listo para imprimir
- Presentación visual profesional
- No requiere software adicional

---

## Solución de Problemas

### Error: "El correo no está configurado"

**Causa:** Las credenciales no están configuradas en la Edge Function.

**Solución:**
1. Ve al archivo `supabase/functions/send-report-email/index.ts`
2. Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctamente configurados
3. Redesplega la función

---

### Error: "Authentication failed"

**Causa:** Contraseña incorrecta o no es una contraseña de aplicación.

**Solución:**
1. Asegúrate de estar usando una **contraseña de aplicación**, NO tu contraseña normal de Gmail
2. Genera una nueva contraseña de aplicación siguiendo el PASO 2
3. Actualiza `EMAIL_PASSWORD` en el código
4. Redesplega la función

---

### Error: "Connection timeout"

**Causa:** Problemas de red o configuración SMTP incorrecta.

**Solución:**
1. Verifica que `SMTP_HOST` sea `"smtp.gmail.com"`
2. Verifica que `SMTP_PORT` sea `587`
3. Asegúrate de tener conexión a internet

---

### Los correos no llegan

**Posibles causas:**

1. **Correos en spam:**
   - Revisa la carpeta de spam de los destinatarios
   - Marca el correo como "No es spam"

2. **Correo destinatario incorrecto:**
   - Verifica que el email esté escrito correctamente
   - Elimina y vuelve a agregar el destinatario

3. **Límites de Gmail:**
   - Gmail tiene límites de envío (500 correos/día para cuentas gratuitas)
   - Si necesitas más, considera usar una cuenta de Google Workspace

---

### Error: "No hay correos configurados"

**Causa:** No has agregado destinatarios en la configuración.

**Solución:**
1. Ve a Reportes → Botón "Emails"
2. Agrega al menos un destinatario
3. Intenta enviar nuevamente

---

## Seguridad y Mejores Prácticas

### ✅ Recomendaciones

1. **Usa un correo dedicado:**
   - Crea una cuenta específica como `residuos.secrets@gmail.com`
   - No uses tu correo personal

2. **Protege las credenciales:**
   - Nunca compartas la contraseña de aplicación
   - Si crees que está comprometida, revócala y genera una nueva

3. **Revisa los destinatarios regularmente:**
   - Elimina destinatarios que ya no necesitan los reportes
   - Actualiza los correos si cambian

4. **Verifica antes de enviar:**
   - Revisa el reporte en pantalla antes de enviarlo
   - Confirma que el formato sea el correcto

5. **Monitorea el correo remitente:**
   - Revisa ocasionalmente la bandeja de enviados
   - Verifica que no haya rebotes o errores

---

### ⚠️ Advertencias

1. **NO compartas las credenciales:**
   - La contraseña de aplicación da acceso completo al correo
   - Guárdala en un lugar seguro

2. **NO uses correos personales:**
   - Mantén separado el correo del sistema de tus correos personales

3. **NO envíes reportes a destinatarios no autorizados:**
   - Los reportes pueden contener información sensible
   - Solo envía a personal autorizado

---

## Otros Proveedores de Email

Si prefieres usar otro proveedor en lugar de Gmail, modifica la configuración SMTP:

### Microsoft Outlook / Office 365

```typescript
const EMAIL_CONFIG = {
  EMAIL_USER: "tucorreo@outlook.com",
  EMAIL_PASSWORD: "tu_contraseña_aplicacion",
  SMTP_HOST: "smtp-mail.outlook.com",
  SMTP_PORT: 587,
  FROM_NAME: "Sistema de Residuos"
};
```

### Yahoo Mail

```typescript
const EMAIL_CONFIG = {
  EMAIL_USER: "tucorreo@yahoo.com",
  EMAIL_PASSWORD: "tu_contraseña_aplicacion",
  SMTP_HOST: "smtp.mail.yahoo.com",
  SMTP_PORT: 587,
  FROM_NAME: "Sistema de Residuos"
};
```

### Servidor SMTP Corporativo

Consulta con tu departamento de IT los valores de:
- SMTP_HOST
- SMTP_PORT
- Método de autenticación

---

## Preguntas Frecuentes (FAQ)

### ¿Puedo usar mi correo personal?

Técnicamente sí, pero **no es recomendable**. Es mejor crear un correo dedicado para el sistema.

---

### ¿Cuántos destinatarios puedo agregar?

No hay límite en el sistema, pero Gmail tiene un límite de **500 correos/día** para cuentas gratuitas.

---

### ¿Los destinatarios verán los correos de otros destinatarios?

Sí, todos los destinatarios aparecen en el campo "Para:" del correo. Si prefieres envíos individuales, contacta al desarrollador para modificar el código.

---

### ¿Puedo programar envíos automáticos?

Actualmente no. Los reportes se envían manualmente. Para envíos automáticos programados, se requiere configuración adicional (cron jobs).

---

### ¿El sistema guarda historial de envíos?

No. Los correos se envían directamente a través de Gmail. Puedes revisar el historial en la bandeja de "Enviados" del correo configurado.

---

### ¿Qué pasa si cambio el formato después de hacer clic en "Enviar"?

Nada. El sistema toma el formato seleccionado en el momento exacto en que haces clic en "Enviar".

---

### ¿Puedo enviar reportes filtrados?

Sí. Aplica los filtros que desees (tipo, ubicación, fecha) antes de hacer clic en "Enviar". El reporte incluirá solo los registros filtrados.

---

## Soporte Técnico

Si tienes problemas o dudas:

1. Revisa esta guía completa
2. Verifica la sección "Solución de Problemas"
3. Revisa los logs en Supabase Dashboard → Edge Functions → send-report-email → Logs
4. Contacta al administrador del sistema

---

## Resumen de Configuración

### Checklist de Configuración

- [ ] Cuenta de Gmail creada/identificada
- [ ] Verificación en dos pasos activada en Gmail
- [ ] Contraseña de aplicación generada
- [ ] Archivo `index.ts` editado con credenciales
- [ ] Edge Function redesplegada
- [ ] Destinatarios agregados en la aplicación
- [ ] Prueba de envío realizada exitosamente

---

## Ejemplo Completo de Configuración

### 1. Configuración en el Código

```typescript
const EMAIL_CONFIG = {
  EMAIL_USER: "residuos.secrets@gmail.com",
  EMAIL_PASSWORD: "abcd efgh ijkl mnop",
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,
  FROM_NAME: "Sistema de Gestión de Residuos - Secrets Playa Blanca"
};
```

### 2. Destinatarios en la App

```
• Gerente General (gerente@secrets.com)
• Jefe Operaciones (ops@secrets.com)
• Director Sustentabilidad (sustentabilidad@secrets.com)
```

### 3. Configuración de Envío

```
Formato: Excel/CSV
Período: Semanal
```

### 4. Resultado

Todos los lunes, haz clic en "Enviar" y los tres destinatarios recibirán:

```
De: Sistema de Gestión de Residuos - Secrets Playa Blanca
Para: gerente@secrets.com, ops@secrets.com, sustentabilidad@secrets.com
Asunto: Reporte Semanal de Residuos Sólidos - 01/01/2025 a 07/01/2025
Adjunto: reporte-semanal-2025-01-01_2025-01-07.csv
```

---

**Fecha de creación:** 2025-01-05
**Versión:** 1.0
**Estado:** Producción
