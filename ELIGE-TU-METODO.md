# Elige tu Método para Enviar Reportes

Tu app password está configurada: `lzly bjsh ggho nqyb`

Tienes **2 opciones**. Te recomiendo la Opción 1 (más sencilla).

---

## ✅ OPCIÓN 1: Resend.com (RECOMENDADA - Más Sencilla)

### Ventajas
- No requiere Java ni Maven
- No requiere servidor adicional
- Solo necesitas una API Key (gratis)
- 100 emails/día gratis (3000/mes)
- Más fácil de desplegar en Hostinger
- 5 minutos de configuración

### Cómo usarla

**1. Regístrate en Resend (2 min)**
- Ve a: https://resend.com/signup
- Crea cuenta gratis
- Copia tu API Key (empieza con `re_`)

**2. Configura la función (1 min)**

Copia el archivo con Resend:
```bash
cp supabase/functions/send-report-email/RESEND-VERSION.ts supabase/functions/send-report-email/index.ts
```

Edita `supabase/functions/send-report-email/index.ts` línea 14:
```typescript
const RESEND_API_KEY = "re_TU_API_KEY_AQUI"; // Pega tu API key
```

**3. Despliega (1 min)**

Opción A - Desde Supabase Dashboard:
1. Ve a: https://supabase.com/dashboard
2. Abre tu proyecto
3. Ve a "Edge Functions"
4. Sube la carpeta `supabase/functions/send-report-email`

Opción B - Con CLI:
```bash
npx supabase functions deploy send-report-email
```

**4. Prueba**
```bash
npm run dev
```

Abre http://localhost:5173 → Reportes → Enviar

**Listo!**

---

## OPCIÓN 2: Spring Boot (Configurado)

Ya está configurado con tu app password.

### Ventajas
- Control total del SMTP
- No dependes de servicios externos
- Ilimitado (pero necesitas servidor 24/7)

### Cómo usarla

**1. Instala requisitos**

Java 17:
- Windows: https://www.oracle.com/java/technologies/downloads/#java17
- Linux: `sudo apt install openjdk-17-jdk`
- Mac: `brew install openjdk@17`

Maven:
- Windows: https://maven.apache.org/download.cgi
- Linux: `sudo apt install maven`
- Mac: `brew install maven`

**2. Ejecuta el backend**

Terminal 1:
```bash
cd backend-springboot
mvn spring-boot:run
```

Terminal 2:
```bash
npm run dev
```

**3. Prueba**

Abre http://localhost:5173 → Reportes → Enviar

**4. Para Hostinger**

Compila:
```bash
cd backend-springboot
mvn clean package
```

Sube `target/residuos-backend.jar` a tu servidor y ejecuta:
```bash
java -jar residuos-backend.jar
```

---

## Comparación Rápida

| Característica | Resend | Spring Boot |
|---|---|---|
| Requisitos | API Key | Java + Maven |
| Configuración | 5 min | 15 min |
| Servidor adicional | No | Sí |
| Correos/mes gratis | 3000 | Ilimitado |
| Hosting | Solo frontend | Frontend + Backend |
| Complejidad | Baja | Media |
| Despliegue Hostinger | Fácil | Requiere VPS |

---

## Mi Recomendación

### Usa RESEND si:
- Quieres lo más sencillo
- No quieres instalar Java/Maven
- 3000 emails/mes son suficientes
- Quieres desplegar rápido en Hostinger
- Prefieres menos mantenimiento

### Usa SPRING BOOT si:
- Ya tienes servidor Java
- Necesitas más de 3000 emails/mes
- Prefieres control total del SMTP
- Tienes VPS en Hostinger

---

## Estado Actual

### ✅ Spring Boot
- App password configurada: `lzly bjsh ggho nqyb`
- Archivos listos en: `backend-springboot/`
- Listo para ejecutar con `mvn spring-boot:run`

### ✅ Resend
- Código listo en: `supabase/functions/send-report-email/RESEND-VERSION.ts`
- Solo falta: API Key de Resend
- Listo para desplegar

---

## Decisión Rápida

**¿Cuál es más sencillo?**
→ Resend (solo API key, sin Java/Maven)

**¿Cuál es más económico?**
→ Resend gratis hasta 3000/mes
→ Spring Boot gratis pero necesitas servidor

**¿Cuál recomiendo?**
→ **RESEND** para tu caso

---

## Siguiente Paso

### Si eliges Resend:
1. Lee: `METODO-MAS-SENCILLO-RESEND.md`
2. Regístrate en https://resend.com
3. Copia API key
4. Despliega función
5. Listo

### Si eliges Spring Boot:
1. Lee: `INSTRUCCIONES-FINALES.md`
2. Instala Java y Maven
3. Ejecuta `mvn spring-boot:run`
4. Ejecuta `npm run dev`
5. Prueba

---

## Archivos de Ayuda

**Para Resend:**
- `METODO-MAS-SENCILLO-RESEND.md` ← Guía completa
- `supabase/functions/send-report-email/RESEND-VERSION.ts` ← Código listo

**Para Spring Boot:**
- `INSTRUCCIONES-FINALES.md` ← Guía paso a paso
- `GUIA-CONFIGURACION-SUSTENTABILIDAD.md` ← Configuración
- `backend-springboot/README.md` ← Documentación técnica

---

**Mi consejo:** Empieza con Resend. Si después necesitas más control, cambia a Spring Boot.

**Correo configurado:** sustentabilidadsecrets@gmail.com
**App Password:** lzly bjsh ggho nqyb ✅
