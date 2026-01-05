# Edge Function: send-report-email

Esta Edge Function permite enviar reportes de residuos sólidos por correo electrónico.

## Configuración Requerida

### Paso 1: Edita el archivo `index.ts`

Busca la sección `EMAIL_CONFIG` y reemplaza los valores:

```typescript
const EMAIL_CONFIG = {
  EMAIL_USER: "tucorreo@gmail.com",        // ← TU CORREO AQUÍ
  EMAIL_PASSWORD: "xxxx xxxx xxxx xxxx",   // ← CONTRASEÑA DE APLICACIÓN AQUÍ
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587,
  FROM_NAME: "Sistema de Gestión de Residuos - Secrets Playa Blanca"
};
```

### Paso 2: Genera una Contraseña de Aplicación de Gmail

1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Otro"
3. Escribe un nombre: "Sistema Residuos"
4. Copia la contraseña de 16 caracteres
5. Pégala en `EMAIL_PASSWORD`

### Paso 3: Redesplegar la Función

La función se despliega automáticamente cuando guardas los cambios.

## Documentación Completa

Ver: `GUIA-ENVIO-EMAIL.md` en la raíz del proyecto.
