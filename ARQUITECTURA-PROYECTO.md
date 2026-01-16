# 🏗️ Arquitectura del Proyecto

## Resumen Ejecutivo

Tu proyecto **NO está usando backend**. Es una aplicación 100% frontend con almacenamiento local.

---

## 📦 Estructura Actual

### ✅ LO QUE SE USA ACTUALMENTE:

**Frontend (React + TypeScript + Vite)**
```
- Framework: React 18
- Lenguaje: TypeScript
- Build Tool: Vite
- Estilo: Tailwind CSS
- Gráficas: Chart.js
- Almacenamiento: localStorage (navegador)
```

**Servicios en la Nube (Supabase)**
```
- Edge Functions: Para enviar emails
- NO usa base de datos de Supabase
- Solo usa las funciones serverless
```

---

### ❌ LO QUE NO SE USA (Pero está en el proyecto):

**Backend Express (carpeta /backend/)**
- Tiene un servidor Express.js completo
- Con PostgreSQL
- Con autenticación JWT
- **NO está corriendo ni siendo usado**

**Backend Spring Boot (carpeta /backend-springboot/)**
- Tiene un proyecto Java con Spring Boot
- Con servicio de email usando JavaMailSender
- **NO está corriendo ni siendo usado**

---

## 🔄 Flujo Actual del Proyecto

```
Usuario
  ↓
Navegador (Chrome, Firefox, etc)
  ↓
React App (Frontend)
  ↓
localStorage (Datos guardados localmente)
  ↓
Supabase Edge Function → Resend → Email enviado
```

**No hay servidor intermedio, todo pasa en el navegador del usuario.**

---

## 🤔 ¿Por qué no usas Spring Boot?

**Razones:**

1. **Tu proyecto es una SPA (Single Page Application)**
   - Todo corre en el navegador
   - No necesita servidor backend
   - Los datos se guardan en localStorage

2. **Spring Boot requiere:**
   - Servidor Java corriendo 24/7
   - Hosting con soporte Java
   - Base de datos externa
   - Configuración compleja

3. **Para Hostinger:**
   - Hostinger solo sirve archivos estáticos (HTML, CSS, JS)
   - No puede ejecutar servidores Java o Node.js
   - Solo puede servir tu frontend

---

## 💡 Opciones para Email (Sin Resend)

### Opción 1: Nodemailer con SMTP (⭐ RECOMENDADA)
**Más orgánica y segura**

- Usas el servidor SMTP de tu hotel/empresa
- Control total del código
- Sin servicios de terceros
- Código abierto y auditado

**Ventajas:**
- ✅ Tu equipo tiene control total
- ✅ No depende de servicios externos
- ✅ Usa el servidor de correo de tu empresa
- ✅ Más seguro y confiable
- ✅ Código 100% visible y modificable

---

### Opción 2: Spring Boot con JavaMailSender
**Requiere servidor dedicado**

- Necesitas un servidor para correr Java
- Más complejo de desplegar
- Requiere cambiar toda la arquitectura

**No recomendada** porque:
- ❌ Muy complejo para este proyecto
- ❌ Necesitas hosting diferente
- ❌ Más caro (servidor dedicado)
- ❌ Requiere reescribir todo

---

### Opción 3: Backend Express con Nodemailer
**Medio término**

- Necesitas servidor Node.js corriendo
- Más simple que Spring Boot
- Hosting más accesible

**No ideal** porque:
- ❌ Requiere servidor separado
- ❌ Hostinger no soporta Node.js
- ❌ Más complejo de mantener

---

## 🎯 Solución Recomendada

### Edge Function de Supabase + Nodemailer + SMTP Propio

**¿Qué es esto?**
- Function serverless (como la que tienes ahora)
- Pero usa Nodemailer en lugar de Resend
- Se conecta al servidor SMTP que TÚ definas
- Puede ser el SMTP de tu hotel, Gmail, Outlook, etc.

**Ventajas:**
1. ✅ No cambias la arquitectura actual
2. ✅ Funciona con Hostinger tal como está
3. ✅ Control total del código
4. ✅ Usa el servidor de correo que tú elijas
5. ✅ No dependes de Resend
6. ✅ Más "orgánico" - conexión directa SMTP
7. ✅ Tu equipo puede auditar el código

**Configuración:**
```
Tu App → Supabase Edge Function → SMTP del Hotel → Email enviado
```

---

## 📊 Comparación Rápida

| Característica | Resend (Actual) | Nodemailer + SMTP | Spring Boot |
|----------------|-----------------|-------------------|-------------|
| Control total | ❌ | ✅ | ✅ |
| Fácil despliegue | ✅ | ✅ | ❌ |
| Sin servicios externos | ❌ | ✅ | ✅ |
| Funciona en Hostinger | ✅ | ✅ | ❌ |
| Código auditable | Parcial | ✅ | ✅ |
| Costo | Gratis limitado | Gratis total | Alto |
| Complejidad | Baja | Baja | Alta |
| Configuración | 5 min | 10 min | Horas |

---

## 🚀 Mi Recomendación

**Usa Nodemailer con SMTP en tu Edge Function actual**

Razones:
1. Es la solución más "orgánica"
2. No cambias nada de tu arquitectura
3. Funciona perfecto con Hostinger
4. Control total del código
5. Puedes usar el SMTP de tu hotel
6. Tu equipo puede auditar todo
7. No dependes de servicios externos
8. Es gratis y sin límites

**Te la implemento ahora mismo** ⬇️
