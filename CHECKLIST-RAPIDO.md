# ✅ Checklist Rápido de Despliegue

## Para Subir a Hostinger por Primera Vez

```bash
# 1. En tu computadora
npm run build:hostinger
```

```
# 2. En Hostinger (File Manager)
- Abre public_html/
- BORRA todo lo que esté ahí
- Sube TODO lo que está dentro de dist/
  (NO subas la carpeta dist, solo su contenido)
```

```
# 3. Verifica
- Abre tu dominio en el navegador
- Debe funcionar la app completa
```

---

## Para Actualizar Después de Cambios

```bash
# 1. Hiciste cambios en el código
npm run build:hostinger
```

```
# 2. Sube a Hostinger
- Borra public_html/
- Sube el nuevo contenido de dist/
```

```
# 3. Refresca el navegador
Ctrl + Shift + R
```

---

## Para Agregar Correos

```
1. Abre la app
2. Ve a "Reportes"
3. Clic en botón "Emails"
4. Agrega:
   - Nombre: "Gerente"
   - Email: gerente@hotel.com
5. Repite para todos los correos
```

---

## Estructura de Archivos en Hostinger

### ✅ CORRECTO:
```
public_html/
├── index.html
├── assets/
└── images/
```

### ❌ INCORRECTO:
```
public_html/
└── dist/
    ├── index.html
    └── ...
```

---

## Variables de Entorno

Si cambias `.env`:
```bash
# Debes recompilar
npm run build:hostinger

# Y volver a subir a Hostinger
```

---

## Problemas Comunes

| Problema | Solución |
|----------|----------|
| No veo cambios | Ctrl + Shift + R |
| Error 404 | Verifica estructura de archivos |
| No funciona nada | Revisa que index.html esté en public_html/ |
| No se envían emails | Verifica correos configurados en la app |

---

**Tiempo estimado:**
- Primera vez: 5-10 minutos
- Actualizaciones: 2-3 minutos
