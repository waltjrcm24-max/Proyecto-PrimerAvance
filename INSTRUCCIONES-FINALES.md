# Instrucciones Finales - Sistema de Reportes con Spring Boot

## Ya Está Todo Listo

Se ha creado un backend completo en Spring Boot configurado para usar tu correo **sustentabilidadsecrets@gmail.com** como remitente de reportes.

---

## Paso 1: Configura tu App Password

### Abre este archivo:
```
backend-springboot/src/main/resources/application.properties
```

### Busca esta línea:
```properties
spring.mail.password=AQUI_TU_APP_PASSWORD
```

### Reemplaza con tu contraseña de aplicación:
```properties
spring.mail.password=xxxx xxxx xxxx xxxx
```

**IMPORTANTE:** Usa tu contraseña de aplicación de Gmail, no tu contraseña normal.

---

## Paso 2: Ejecuta el Backend

### Requisitos (instalar si no los tienes):

**Java 17:**
- Windows: https://www.oracle.com/java/technologies/downloads/#java17
- Linux: `sudo apt install openjdk-17-jdk`
- Mac: `brew install openjdk@17`

**Maven:**
- Windows: https://maven.apache.org/download.cgi
- Linux: `sudo apt install maven`
- Mac: `brew install maven`

### Ejecutar:

```bash
cd backend-springboot
mvn spring-boot:run
```

Verás este mensaje cuando arranque:

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Sistema de Gestión de Residuos Sólidos - Backend       ║
║   Secrets Playa Blanca Costa Mujeres                      ║
║                                                           ║
║   Servidor corriendo en: http://localhost:8080            ║
║   Endpoint: /api/email/send-report                        ║
║   Health check: /api/email/health                         ║
║                                                           ║
║   Remitente: sustentabilidadsecrets@gmail.com             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Paso 3: Ejecuta el Frontend

En otra terminal:

```bash
npm run dev
```

Abre: http://localhost:5173

---

## Paso 4: Prueba el Sistema

1. **Login como Administrador**
2. **Ve a "Reportes"**
3. **Clic en el botón "Emails"**
4. **Agrega un destinatario de prueba** (tu correo personal)
5. **Selecciona formato:** CSV (recomendado)
6. **Clic en "Enviar"**

### Deberías recibir un correo:

**De:** Sistema de Gestión de Residuos - Secrets Playa Blanca
**Remitente:** sustentabilidadsecrets@gmail.com
**Con adjunto:** Archivo CSV con los datos del reporte

---

## Para Subir a Hostinger

### 1. Compila el Backend

```bash
cd backend-springboot
mvn clean package
```

Genera: `target/residuos-backend.jar`

### 2. Compila el Frontend

Primero edita `.env` con tu dominio:

```env
VITE_BACKEND_URL=https://tu-dominio.com
```

Luego compila:

```bash
npm run build
```

Genera: carpeta `dist/`

### 3. Sube los Archivos

Ver guía completa: **PREPARAR-PARA-HOSTINGER.md**

**Resumen:**
- Sube `dist/*` a `public_html/` de Hostinger
- Sube `residuos-backend.jar` a tu servidor VPS
- Crea `application.properties` en el servidor con tus credenciales
- Ejecuta: `java -jar residuos-backend.jar`

---

## Archivos Creados

### Backend Spring Boot

```
backend-springboot/
├── src/main/java/com/secrets/residuos/
│   ├── ResiduosApplication.java           # Clase principal
│   ├── config/WebConfig.java               # CORS
│   ├── controller/EmailController.java     # REST API
│   ├── service/EmailService.java           # Envío de correos
│   └── dto/
│       ├── EmailRequest.java
│       └── EmailResponse.java
├── src/main/resources/
│   └── application.properties              # ⭐ EDITA AQUÍ
├── pom.xml
└── README.md
```

### Frontend (Modificado)

```
src/components/Reports.tsx                  # Actualizado para usar Spring Boot
.env                                        # Nueva variable VITE_BACKEND_URL
```

### Documentación

```
GUIA-CONFIGURACION-SUSTENTABILIDAD.md      # ⭐ Guía específica para tu correo
INSTRUCCIONES-FINALES.md                   # ⭐ Este archivo
RESUMEN-SPRING-BOOT.md                     # Resumen general
FUNCIONALIDAD-EMAIL-SPRINGBOOT.md          # Documentación técnica
DESPLIEGUE-SPRINGBOOT-HOSTINGER.md         # Guía de despliegue
PREPARAR-PARA-HOSTINGER.md                 # Compilar y subir
```

---

## Verificar que Funciona

### Test 1: Health Check

```bash
curl http://localhost:8080/api/email/health
```

Debería responder:
```
Email service is running - Sustentabilidad Secrets
```

### Test 2: Envío de Correo (con cURL)

```bash
curl -X POST http://localhost:8080/api/email/send-report \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["tu-correo@gmail.com"],
    "reportData": {
      "estadisticas": {"totalRegistros": 1, "pesoTotal": "10 kg"},
      "registros": [{"type":"Orgánicos","location":"Cocina","weight":10,"date":"2025-01-05","time":"08:00"}]
    },
    "reportFormat": "csv",
    "periodText": "Prueba",
    "startDate": "2025-01-05T00:00:00Z",
    "endDate": "2025-01-05T23:59:59Z"
  }'
```

---

## Solución de Problemas

### Error: "mvn: command not found"
Instala Maven (ver Paso 2)

### Error: "java: command not found"
Instala Java 17 (ver Paso 2)

### Error: "Configuración de email incorrecta"
Edita `application.properties` y pega tu App Password

### Error: CORS
Agrega tu dominio a `app.cors.allowed-origins` en `application.properties`

### El correo no llega
1. Verifica que el App Password sea correcto
2. Revisa la carpeta de Spam
3. Verifica los logs del backend en la terminal

---

## Estructura para Hostinger

Cuando subas a Hostinger, tendrás:

```
Tu Servidor:
├── public_html/                    # Frontend
│   ├── index.html
│   └── assets/
└── backend/                        # Backend
    ├── residuos-backend.jar
    └── application.properties
```

---

## Ventajas de Esta Implementación

✅ Usa tu correo oficial: sustentabilidadsecrets@gmail.com
✅ Envía correos profesionales con logo y formato
✅ Soporta 3 formatos: CSV, JSON, PDF
✅ Múltiples destinatarios
✅ Listo para producción
✅ Totalmente documentado

---

## Próximos Pasos

1. [ ] Instalar Java 17 y Maven (si no los tienes)
2. [ ] Pegar tu App Password en `application.properties`
3. [ ] Ejecutar backend: `mvn spring-boot:run`
4. [ ] Ejecutar frontend: `npm run dev`
5. [ ] Probar envío de correo desde la aplicación
6. [ ] Si funciona, compilar para Hostinger
7. [ ] Subir archivos a Hostinger

---

## Documentación Completa

Lee estos archivos en orden:

1. **GUIA-CONFIGURACION-SUSTENTABILIDAD.md** ← ⭐ Empieza aquí
2. **INSTRUCCIONES-FINALES.md** ← Estás aquí
3. **PREPARAR-PARA-HOSTINGER.md** ← Para subir a servidor
4. **backend-springboot/README.md** ← Detalles del backend

Documentación técnica (opcional):
- FUNCIONALIDAD-EMAIL-SPRINGBOOT.md
- DESPLIEGUE-SPRINGBOOT-HOSTINGER.md
- RESUMEN-SPRING-BOOT.md

---

## Contacto y Soporte

**Correo configurado:** sustentabilidadsecrets@gmail.com

Si tienes problemas:
1. Revisa los logs en la terminal
2. Consulta la documentación
3. Verifica que las credenciales sean correctas

---

**Estado:** ✅ Listo para usar
**Fecha:** 5 de Enero, 2026
**Framework:** Spring Boot 3.2.1
**Java:** 17
