# 📧 Guía Completa: Nodemailer + SMTP (Solución Orgánica)

## ¿Qué es esta solución?

**Nodemailer** es una librería de código abierto para Node.js que envía emails usando protocolo SMTP estándar.

**Ventajas sobre Resend:**
- ✅ Código 100% abierto y auditable
- ✅ No dependes de servicios externos
- ✅ Usas tu propio servidor SMTP (del hotel, Gmail, Outlook, etc.)
- ✅ Control total del proceso
- ✅ Sin límites ni costos adicionales
- ✅ Más seguro y confiable
- ✅ Cumple con políticas corporativas

---

## 📋 Opciones de Servidores SMTP

### Opción 1: Gmail (Más Fácil) ⭐
**Recomendada para empezar**

**Requisitos:**
- Cuenta de Gmail
- Configurar "Contraseña de aplicación" (NO la contraseña normal)

**Configuración:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-16-caracteres
SMTP_FROM_NAME=Sistema de Residuos Sólidos
```

**¿Cómo obtener la contraseña de aplicación?**
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en 2 pasos (debes activarla)
3. Seguridad → Contraseñas de aplicación
4. Genera una nueva contraseña
5. Copia el código de 16 caracteres

---

### Opción 2: Outlook / Hotmail
**Alternativa confiable**

**Configuración:**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
SMTP_FROM_NAME=Sistema de Residuos Sólidos
```

---

### Opción 3: Servidor SMTP del Hotel (Más Profesional) ⭐⭐⭐
**Recomendada para producción**

**Configuración:**
```
SMTP_HOST=mail.tuhotel.com
SMTP_PORT=587 (o 465 si usa SSL)
SMTP_SECURE=false (true si puerto 465)
SMTP_USER=sustentabilidad@tuhotel.com
SMTP_PASS=contraseña-proporcionada-por-IT
SMTP_FROM_NAME=Secrets Playa Blanca - Sustentabilidad
```

**Necesitas pedir a tu departamento de IT:**
- Host SMTP del servidor
- Puerto (587 o 465)
- Usuario y contraseña
- Si requiere SSL/TLS

---

### Opción 4: Office 365 / Microsoft 365
**Para empresas con Office 365**

**Configuración:**
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@tuempresa.com
SMTP_PASS=tu-contraseña
SMTP_FROM_NAME=Sistema de Residuos
```

---

## 🔧 Configuración Paso a Paso

### Paso 1: Elegir tu servidor SMTP
Decide cuál de las opciones anteriores usarás (recomiendo Gmail para pruebas, servidor del hotel para producción)

### Paso 2: Configurar variables en Supabase

1. **Ve a Supabase Dashboard**
   - https://supabase.com/dashboard
   - Abre tu proyecto

2. **Ve a Settings → Edge Functions**
   - Busca la sección "Environment Variables"
   - O ve directo a: Project Settings → Edge Functions → Manage secrets

3. **Agrega las variables:**

```bash
# En la interfaz de Supabase, agrega una por una:

SMTP_HOST
Valor: smtp.gmail.com (o el que uses)

SMTP_PORT
Valor: 587

SMTP_SECURE
Valor: false

SMTP_USER
Valor: tu-email@gmail.com

SMTP_PASS
Valor: tu-contraseña-de-aplicacion

SMTP_FROM_NAME
Valor: Sistema de Residuos Sólidos - Secrets Playa Blanca
```

### Paso 3: Desplegar la Edge Function

**El archivo ya está creado en:**
```
supabase/functions/send-report-email/NODEMAILER-VERSION.ts
```

**Para desplegarlo:**

Opción A: Desde aquí, te ayudo a desplegarlo cuando me lo indiques

Opción B: Manual (si tienes Supabase CLI):
```bash
# Primero renombra el archivo
cd supabase/functions/send-report-email
mv index.ts index.ts.OLD
mv NODEMAILER-VERSION.ts index.ts

# Despliega
supabase functions deploy send-report-email
```

---

## 🧪 Prueba de Configuración

### Prueba Rápida con cURL:

```bash
curl -i --location --request POST \
  'https://tu-proyecto.supabase.co/functions/v1/send-report-email' \
  --header 'Authorization: Bearer TU_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "reportData": {
      "titulo": "Prueba de Email",
      "hotel": "Test Hotel",
      "fechaGeneracion": "2024-01-01",
      "periodo": {
        "tipo": "Diario",
        "fechaInicio": "2024-01-01",
        "fechaFin": "2024-01-01"
      },
      "estadisticas": {
        "totalRegistros": 1,
        "pesoTotal": "10.5 kg",
        "pesoPromedio": "10.5 kg",
        "tiposResiduos": 1,
        "ubicaciones": 1
      },
      "registros": []
    },
    "recipients": ["tu-email@prueba.com"]
  }'
```

---

## 🔒 Seguridad

### ¿Por qué es más seguro que Resend?

1. **Control Total**
   - Tú controlas el servidor SMTP
   - Nadie más tiene acceso a tus emails
   - No pasa por servidores de terceros

2. **Código Auditable**
   - Nodemailer es código abierto
   - Tu equipo puede revisar el código completo
   - Sin cajas negras

3. **SMTP del Hotel**
   - Si usas el servidor del hotel, todo queda interno
   - Cumple con políticas de seguridad corporativa
   - Trazabilidad completa

4. **Sin Límites**
   - No hay límites de envío (depende de tu servidor)
   - Sin costos adicionales
   - Sin bloqueos por cuotas

---

## 📊 Comparación Visual

```
┌─────────────────────────────────────────────────┐
│  ANTES (Resend)                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tu App → Supabase → Resend API → Email        │
│            ↓            ↓                       │
│         API Key    Servidores                   │
│                    de Resend                    │
│                    (Terceros)                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  AHORA (Nodemailer + SMTP)                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tu App → Supabase → SMTP del Hotel → Email    │
│            ↓            ↓                       │
│         Config     Tu Servidor                  │
│                    (Control Total)              │
└─────────────────────────────────────────────────┘
```

---

## ⚙️ Configuraciones Comunes

### Para Gmail con Seguridad Alta:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=email@gmail.com
SMTP_PASS=app-password-16-chars
```

### Para servidores corporativos:
```env
SMTP_HOST=mail.empresa.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@empresa.com
SMTP_PASS=password
```

### Con autenticación personalizada:
Si tu servidor requiere configuración especial, Nodemailer soporta:
- TLS/STARTTLS
- OAuth2
- NTLM (Windows)
- Certificados personalizados

---

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica usuario y contraseña
- Si es Gmail, usa contraseña de aplicación
- Verifica que la cuenta no esté bloqueada

### Error: "Connection timeout"
- Verifica el SMTP_HOST
- Revisa el puerto (587 o 465)
- Verifica firewall/red

### Error: "Self-signed certificate"
- Tu servidor usa certificado no confiable
- Contacta a IT para certificado válido

### Error: "Authentication failed"
- Revisa las credenciales
- Verifica que el servidor permita SMTP

---

## 📝 Checklist de Implementación

- [ ] Elegir servidor SMTP (Gmail, Hotel, Outlook)
- [ ] Obtener credenciales SMTP
- [ ] Configurar variables en Supabase Dashboard
- [ ] Desplegar la Edge Function con Nodemailer
- [ ] Hacer prueba de envío
- [ ] Verificar que llegue el email
- [ ] Probar con múltiples destinatarios
- [ ] Documentar configuración para tu equipo

---

## 🎯 Siguiente Paso

**¿Ya tienes las credenciales SMTP?**

Si ya tienes:
1. Dime qué servidor usarás (Gmail, Hotel, etc.)
2. Te ayudo a configurar las variables en Supabase
3. Desplegamos la función juntos

Si NO tienes:
1. Empieza con Gmail (es más rápido)
2. Luego migra al servidor del hotel cuando lo tengas
3. Te guío paso a paso

---

¿Con qué servidor SMTP quieres empezar?
