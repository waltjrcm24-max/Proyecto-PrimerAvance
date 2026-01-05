# Backend Spring Boot - Sistema de Gestión de Residuos Sólidos

Backend para el envío automático de reportes por correo electrónico.

## Correo Configurado

**Remitente:** sustentabilidadsecrets@gmail.com

## Configuración Rápida

### 1. Editar Credenciales

Abre: `src/main/resources/application.properties`

Reemplaza `AQUI_TU_APP_PASSWORD` con tu contraseña de aplicación real:

```properties
spring.mail.password=xxxx xxxx xxxx xxxx
```

### 2. Configurar CORS

En el mismo archivo, actualiza con tu dominio de Hostinger:

```properties
app.cors.allowed-origins=http://localhost:5173,https://tu-dominio.com
```

### 3. Ejecutar

```bash
mvn spring-boot:run
```

Servidor disponible en: http://localhost:8080

## Verificar que Funciona

```bash
curl http://localhost:8080/api/email/health
```

Debería responder: `Email service is running - Sustentabilidad Secrets`

## Compilar para Producción

```bash
mvn clean package
```

Genera: `target/residuos-backend.jar`

## Ejecutar JAR

```bash
java -jar target/residuos-backend.jar
```

## Endpoints

### POST /api/email/send-report

Envía un reporte por correo.

**Request:**
```json
{
  "recipients": ["correo@ejemplo.com"],
  "reportData": {...},
  "reportFormat": "csv",
  "periodText": "Semanal",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-07T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reporte enviado exitosamente a 1 destinatario(s)",
  "recipients": ["correo@ejemplo.com"]
}
```

### GET /api/email/health

Verifica que el servicio está funcionando.

## Requisitos

- Java 17 o superior
- Maven 3.6 o superior

### Instalar Java

**Windows:**
https://www.oracle.com/java/technologies/downloads/#java17

**Linux:**
```bash
sudo apt install openjdk-17-jdk
```

**Mac:**
```bash
brew install openjdk@17
```

### Instalar Maven

**Windows:**
https://maven.apache.org/download.cgi

**Linux:**
```bash
sudo apt install maven
```

**Mac:**
```bash
brew install maven
```

## Desplegar en Hostinger

Ver documentación completa en:
- `../DESPLIEGUE-SPRINGBOOT-HOSTINGER.md`
- `../PREPARAR-PARA-HOSTINGER.md`

### Resumen:

1. Compilar: `mvn clean package`
2. Subir `target/residuos-backend.jar` al servidor
3. Crear `application.properties` en el servidor con tus credenciales
4. Ejecutar: `java -jar residuos-backend.jar`

## Estructura

```
src/main/java/com/secrets/residuos/
├── ResiduosApplication.java      # Clase principal
├── config/
│   └── WebConfig.java            # Configuración CORS
├── controller/
│   └── EmailController.java      # REST endpoints
├── service/
│   └── EmailService.java         # Lógica de envío
└── dto/
    ├── EmailRequest.java         # Request DTO
    └── EmailResponse.java        # Response DTO
```

## Solución de Problemas

### Error: "mvn: command not found"
Instala Maven

### Error: "java: command not found"
Instala Java 17

### Error: "Configuración de email incorrecta"
Edita `application.properties` y reemplaza `AQUI_TU_APP_PASSWORD`

### Error: "CORS policy"
Agrega tu dominio a `app.cors.allowed-origins`

## Contacto

Remitente configurado: sustentabilidadsecrets@gmail.com
