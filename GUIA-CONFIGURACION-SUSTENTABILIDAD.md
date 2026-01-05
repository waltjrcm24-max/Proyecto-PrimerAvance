# Guía de Configuración - sustentabilidadsecrets@gmail.com

Esta guía te explica cómo configurar el sistema con tu correo de Sustentabilidad Secrets.

## Ya Está Configurado

El correo **sustentabilidadsecrets@gmail.com** ya está configurado como remitente en:

```
backend-springboot/src/main/resources/application.properties
```

## Lo Único que Debes Hacer

### 1. Pegar tu App Password

Abre el archivo:
```
backend-springboot/src/main/resources/application.properties
```

Busca esta línea:
```properties
spring.mail.password=AQUI_TU_APP_PASSWORD
```

Reemplaza `AQUI_TU_APP_PASSWORD` con tu contraseña de aplicación de 16 caracteres.

Ejemplo:
```properties
spring.mail.password=abcd efgh ijkl mnop
```

### 2. Configurar tu Dominio de Hostinger

En el mismo archivo, busca:
```properties
app.cors.allowed-origins=http://localhost:5173,https://tu-dominio-hostinger.com
```

Reemplaza `tu-dominio-hostinger.com` con tu dominio real.

Ejemplo:
```properties
app.cors.allowed-origins=http://localhost:5173,https://secretsplayablanca.com
```

### 3. Ejecutar

```bash
cd backend-springboot
mvn spring-boot:run
```

## Verificar que Funciona

```bash
curl http://localhost:8080/api/email/health
```

Respuesta esperada:
```
Email service is running - Sustentabilidad Secrets
```

## Probar Envío de Correo

### Desde el Frontend

1. Abre http://localhost:5173
2. Login como Administrador
3. Ve a Reportes
4. Clic en "Emails" → Agregar destinatario
5. Agrega tu correo de prueba
6. Selecciona formato (CSV recomendado)
7. Clic en "Enviar"

### Con cURL (Prueba Técnica)

```bash
curl -X POST http://localhost:8080/api/email/send-report \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["tu-correo-prueba@gmail.com"],
    "reportData": {
      "estadisticas": {
        "totalRegistros": 5,
        "pesoTotal": "50 kg"
      },
      "registros": [
        {
          "type": "Orgánicos",
          "location": "Cocina central",
          "weight": 10,
          "date": "2025-01-05",
          "time": "08:00",
          "notes": "Prueba",
          "createdBy": "Sistema"
        }
      ]
    },
    "reportFormat": "csv",
    "periodText": "Prueba",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-01-05T23:59:59Z"
  }'
```

## Correo que Recibirás

**De:** Sistema de Gestión de Residuos - Secrets Playa Blanca
**Remitente:** sustentabilidadsecrets@gmail.com
**Asunto:** Reporte Prueba de Residuos Sólidos - 2025-01-01 a 2025-01-05
**Adjunto:** reporte-prueba-2025-01-01_2025-01-05.csv

El correo incluye:
- Resumen del período
- Total de registros
- Peso total
- Archivo adjunto en el formato seleccionado

## Formatos Disponibles

### CSV (Recomendado)
Archivo de Excel compatible con hojas de cálculo.

### JSON
Archivo de datos en formato JSON para análisis técnico.

### PDF/HTML
Archivo HTML que se puede imprimir como PDF desde el navegador.

## Compilar para Hostinger

### 1. Compilar Backend

```bash
cd backend-springboot
mvn clean package
```

Resultado: `target/residuos-backend.jar`

### 2. Compilar Frontend

Primero, configura la URL del backend en `.env`:

```env
VITE_BACKEND_URL=https://tu-dominio.com
```

Luego compila:

```bash
npm run build
```

Resultado: carpeta `dist/`

### 3. Subir a Hostinger

Ver guía completa: `PREPARAR-PARA-HOSTINGER.md`

**Archivos a subir:**

- `dist/*` → `public_html/` (frontend)
- `target/residuos-backend.jar` → servidor VPS o carpeta backend
- `application.properties` → junto al JAR (con credenciales)

## Estructura de Archivos para Hostinger

```
Tu Servidor Hostinger:
├── public_html/              # Frontend compilado
│   ├── index.html
│   └── assets/
├── backend/                  # Backend Spring Boot
│   ├── residuos-backend.jar
│   └── application.properties (con tu app password)
```

## Configuración para Producción

En el servidor, edita `application.properties`:

```properties
spring.mail.username=sustentabilidadsecrets@gmail.com
spring.mail.password=tu_app_password_real
app.cors.allowed-origins=https://tu-dominio-real.com
```

## Seguridad

**IMPORTANTE:**

1. NUNCA subas `application.properties` a Git
2. NUNCA compartas tu App Password
3. Usa diferentes App Passwords para desarrollo y producción
4. Regenera el App Password si crees que fue comprometido

## Archivo .env del Frontend

En tu servidor Hostinger, el frontend debe tener configurado:

```env
VITE_BACKEND_URL=https://tu-dominio.com
```

O si el backend está en un subdominio:

```env
VITE_BACKEND_URL=https://api.tu-dominio.com
```

## Solución de Problemas

### El correo no llega

1. Verifica que el App Password sea correcto
2. Revisa los logs del backend
3. Verifica que Gmail no lo marcó como spam
4. Confirma que el correo destinatario existe

### Error: "Configuración de email incorrecta"

Has olvidado reemplazar `AQUI_TU_APP_PASSWORD` en `application.properties`.

### Error: CORS

Agrega el dominio correcto a `app.cors.allowed-origins`.

### El backend no arranca

Verifica que Java 17 y Maven estén instalados:

```bash
java -version
mvn -version
```

## Ver Logs

Cuando ejecutas el backend con `mvn spring-boot:run`, los logs aparecen en la terminal.

Busca líneas como:

```
INFO - Iniciando envío de reporte a 1 destinatarios
INFO - Reporte enviado exitosamente a: correo@ejemplo.com
```

Si hay errores, aparecerán como:

```
ERROR - Error al enviar reporte
```

## Probar en Desarrollo

### Terminal 1: Backend

```bash
cd backend-springboot
mvn spring-boot:run
```

### Terminal 2: Frontend

```bash
npm run dev
```

Luego abre: http://localhost:5173

## Resumen Rápido

1. Edita `application.properties` → Pega tu App Password
2. Ejecuta `mvn spring-boot:run`
3. Ejecuta `npm run dev` (en otra terminal)
4. Prueba desde el frontend
5. Si funciona, compila y sube a Hostinger

## Checklist

- [ ] App Password configurado en `application.properties`
- [ ] Dominio configurado en `app.cors.allowed-origins`
- [ ] Java 17 instalado
- [ ] Maven instalado
- [ ] Backend ejecutándose en puerto 8080
- [ ] Frontend ejecutándose en puerto 5173
- [ ] Health check responde correctamente
- [ ] Correo de prueba enviado y recibido
- [ ] Listo para compilar y subir a Hostinger

## Soporte Adicional

Ver documentación completa:

- `RESUMEN-SPRING-BOOT.md` - Resumen general
- `FUNCIONALIDAD-EMAIL-SPRINGBOOT.md` - Detalles técnicos
- `DESPLIEGUE-SPRINGBOOT-HOSTINGER.md` - Despliegue en servidor
- `PREPARAR-PARA-HOSTINGER.md` - Compilar y subir archivos
- `backend-springboot/README.md` - Instrucciones del backend

---

**Correo configurado:** sustentabilidadsecrets@gmail.com
**Fecha:** 5 de Enero, 2026
**Estado:** Listo para usar
