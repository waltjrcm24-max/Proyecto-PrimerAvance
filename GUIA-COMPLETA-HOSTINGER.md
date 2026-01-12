# Guía Completa: Correos, Hostinger y Actualizaciones

## 1️⃣ Enviar Reportes a Múltiples Correos

### Ya está implementado, solo sigue estos pasos:

**Método 1: Desde Reportes**
1. Ve a la sección "Reportes"
2. Haz clic en el botón "Emails" (al lado de los filtros)
3. Agrega los correos que quieras:
   - Nombre: "Gerente General"
   - Email: gerente@hotel.com
   - Clic en "Agregar"
4. Puedes agregar todos los correos que necesites
5. Cuando envíes un reporte, se enviará a TODOS los correos activos

**Método 2: Desde Configuración**
1. Ve a "Configuración"
2. Selecciona la pestaña "Correos"
3. Agrega los correos necesarios
4. Elimina correos con el ícono de basura si ya no los necesitas

### Cómo funciona:
- El sistema envía el reporte a TODOS los correos configurados
- Si tienes 5 correos, se envía a los 5 a la vez
- No hay límite de correos

---

## 2️⃣ Preparar para Subir a Hostinger

### Paso 1: Generar los archivos para producción
```bash
npm run build:hostinger
```

Este comando:
- Compila todo el proyecto
- Optimiza los archivos
- Crea una carpeta `dist/` con todo listo

### Paso 2: Subir a Hostinger

**Opción A: Con File Manager de Hostinger**
1. Entra a tu panel de Hostinger
2. Ve a "Archivos" → "Administrador de archivos"
3. Navega a la carpeta `public_html/`
4. **IMPORTANTE**: Borra todo lo que esté en `public_html/`
5. Sube TODO el contenido de la carpeta `dist/`
   - NO subas la carpeta `dist`, sube su CONTENIDO
   - Deben quedar los archivos directamente en `public_html/`

**Opción B: Con FTP (FileZilla)**
1. Descarga FileZilla
2. Conéctate con tus credenciales FTP de Hostinger
3. Navega a `public_html/`
4. Borra todo lo que esté ahí
5. Arrastra TODO el contenido de `dist/` a `public_html/`

### Estructura correcta en Hostinger:
```
public_html/
  ├── index.html
  ├── assets/
  │   ├── index-xxxxx.js
  │   ├── index-xxxxx.css
  │   └── ...
  └── images/
```

**❌ INCORRECTO:**
```
public_html/
  └── dist/
      ├── index.html
      └── ...
```

---

## 3️⃣ Actualizar Cuando Cambias el Código

### Proceso completo:

**1. Haces cambios en tu código**
```
- Modificas src/components/Dashboard.tsx
- Cambias estilos
- Agregas funcionalidades
- etc.
```

**2. Generas nueva versión**
```bash
npm run build:hostinger
```

**3. Subes SOLO la nueva carpeta `dist/`**
- Borra todo en `public_html/`
- Sube el nuevo contenido de `dist/`

### ⚠️ IMPORTANTE:

**Lo que SE ACTUALIZA automáticamente:**
- Todo el frontend (React)
- Estilos y diseño
- Funcionalidades de la interfaz
- Gráficas y reportes

**Lo que NO necesita actualización:**
- La Edge Function de Supabase (se actualiza automáticamente cuando la despliegas)
- Los datos en la base de datos (se mantienen)
- Las imágenes en `/public/images/` (solo si las vuelves a subir)

---

## 4️⃣ Variables de Entorno en Hostinger

### Antes de subir, verifica tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

**IMPORTANTE**:
- Estas variables se "compilan" en el build
- Si cambias las variables, DEBES hacer `npm run build:hostinger` de nuevo
- No puedes cambiar variables directamente en Hostinger

---

## 5️⃣ Checklist de Despliegue

### Primera vez:
- [ ] Configurar variables en `.env`
- [ ] Ejecutar `npm run build:hostinger`
- [ ] Subir contenido de `dist/` a `public_html/`
- [ ] Verificar que funcione en tu dominio
- [ ] Configurar correos en la app
- [ ] Hacer prueba de envío de email

### Actualizaciones:
- [ ] Hacer cambios en el código
- [ ] Ejecutar `npm run build:hostinger`
- [ ] Borrar contenido de `public_html/`
- [ ] Subir nuevo contenido de `dist/`
- [ ] Verificar cambios en el navegador
- [ ] Hacer refresh forzado (Ctrl + Shift + R)

---

## 6️⃣ Solución de Problemas

### "No veo mis cambios"
- Haz refresh forzado: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
- Borra caché del navegador
- Verifica que subiste los archivos correctos

### "Las variables de entorno no funcionan"
- Verifica `.env`
- Ejecuta `npm run build:hostinger` de nuevo
- Vuelve a subir `dist/`

### "No se envían los emails"
- Verifica que la Edge Function esté desplegada en Supabase
- Revisa que configuraste correos en la app
- Verifica que las variables de Supabase sean correctas

### "Error 404 en las rutas"
- Asegúrate de que `index.html` esté en la raíz de `public_html/`
- Verifica que subiste TODO el contenido de `dist/`

---

## 7️⃣ Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Compilar y optimizar para Hostinger
npm run build:hostinger

# Vista previa local de producción
npm run preview:production
```

---

## 📧 Resumen de Correos

**Para agregar múltiples correos:**
1. Ve a Reportes → Botón "Emails"
2. Agrega todos los correos que necesites
3. Al enviar reporte, se envía a TODOS

**Ejemplo de configuración:**
- gerente@hotel.com
- sustentabilidad@hotel.com
- direccion@hotel.com
- reportes@hotel.com

Todos recibirán el reporte cuando presiones "Enviar por Email"

---

¿Dudas? Cualquier cosa me preguntas.
