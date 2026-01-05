# Resumen Rápido: Envío de Reportes por Email

## Qué hace

Permite enviar reportes de residuos sólidos por correo electrónico en formato PDF, CSV o JSON.

---

## Requisitos Previos

1. Cuenta de Gmail
2. Verificación en dos pasos activada
3. Generar contraseña de aplicación

---

## Configuración en 3 Pasos

### Paso 1: Generar Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Correo" → "Otro"
3. Nombre: "Sistema Residuos"
4. Copia la contraseña de 16 caracteres

### Paso 2: Configurar el Código

Edita: `supabase/functions/send-report-email/index.ts`

```typescript
const EMAIL_CONFIG = {
  EMAIL_USER: "residuos.secrets@gmail.com",    // ← Tu correo
  EMAIL_PASSWORD: "abcd efgh ijkl mnop",       // ← Contraseña de app
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,
  FROM_NAME: "Sistema de Residuos - Secrets Playa Blanca"
};
```

### Paso 3: Agregar Destinatarios

En la app:
1. Login como Administrador
2. Ir a "Reportes"
3. Clic en botón "Emails"
4. Agregar nombre y correo de destinatarios

---

## Uso

1. Selecciona formato: CSV, JSON o PDF
2. Selecciona período: Diario, Semanal, Mensual o Personalizado
3. Clic en "Enviar" (botón verde)
4. Espera confirmación

---

## Tipos de Contraseña

### ❌ Contraseña NORMAL de Gmail
```
NO uses tu contraseña normal
```

### ✅ Contraseña de APLICACIÓN
```
Ejemplo: abcd efgh ijkl mnop (16 caracteres)
```

**Importante:** SOLO funciona con contraseña de aplicación.

---

## Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| "El correo no está configurado" | Edita EMAIL_USER y EMAIL_PASSWORD en index.ts |
| "Authentication failed" | Verifica que uses contraseña de aplicación |
| Los correos no llegan | Revisa carpeta de spam |
| "No hay correos configurados" | Agrega destinatarios en la app |

---

## Documentación Completa

Ver: **GUIA-ENVIO-EMAIL.md** para instrucciones detalladas, ejemplos y casos de uso.

---

**Tiempo estimado de configuración:** 10 minutos
**Dificultad:** Media
