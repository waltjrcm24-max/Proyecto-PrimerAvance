# Guía de Manifiestos de Salida

## 📋 ¿Qué es la pestaña Manifiestos?

La pestaña **Manifiestos** es una sección independiente del Dashboard que permite registrar la salida de residuos con autorización oficial.

**Diferencia clave:**
- **Dashboard**: Muestra análisis e historial de registros de residuos ingresados
- **Manifiestos**: Registra cuándo y cómo salen los residuos del hotel (con fecha de salida y número de autorización)

---

## ✨ Características

### 1. Duplica la estructura de registros recientes
- Muestra el historial de residuos en tabla
- Permite visualizar todos los datos: tipo, ubicación, peso, fecha, etc.

### 2. Campos adicionales exclusivos
- **Fecha de Salida**: Cuándo sale el residuo del hotel
- **Número de Autorización**: Código de autorización (letras y números)
- **Notas**: Información adicional sobre el envío

### 3. Sistema de filtros completo
- Filtrar por **tipos de residuo** (multi-selección)
- Filtrar por **ubicación** (multi-selección)
- Filtrar por **rango de fechas**
- Ordenar por: Más recientes o Más antiguos

### 4. Gestión independiente
- Los manifiestos **NO duplican** la información de registros recientes
- Cada manifiesto está enlazado a un registro original
- Un registro puede tener múltiples manifiestos si se divide la salida

---

## 🚀 Cómo usar

### Paso 1: Ir a la pestaña Manifiestos

```
1. Inicia sesión como Administrador
2. Haz clic en la pestaña "Manifiestos" (ícono de Clipboard)
3. Verás la interfaz de gestión de manifiestos
```

### Paso 2: Agregar un nuevo Manifiesto

**Opción A: Sin filtros**
1. Haz clic en "Agregar Manifiesto"
2. Se despliega el formulario
3. Selecciona un registro de la lista disponible
4. Llena los campos:
   - **Fecha de Salida**: Selecciona la fecha
   - **Número de Autorización**: Escribe el código (ej: AUTH-12345-XYZ)
   - **Notas**: Información adicional (opcional)
5. Haz clic en "Guardar Manifiesto"

**Opción B: Usando filtros**
1. Haz clic en "Filtros"
2. Selecciona los residuos que quieres ver
3. Elige ubicaciones específicas
4. Filtra por fechas si es necesario
5. Los registros disponibles se actualizan
6. Haz clic en "Agregar Manifiesto"
7. Sigue los pasos de la Opción A

### Paso 3: Editar un Manifiesto

1. En la tabla "Manifiestos Registrados", haz clic en el ícono **Editar** (lápiz)
2. Los campos se vuelven editables:
   - Puedes cambiar la Fecha de Salida
   - Puedes actualizar el Número de Autorización
3. El cambio se guarda automáticamente
4. Haz clic en el ícono **Guardar** (✓) para confirmar

### Paso 4: Eliminar un Manifiesto

1. En la tabla "Manifiestos Registrados", haz clic en el ícono **Eliminar** (X)
2. El manifiesto se elimina inmediatamente
3. El registro original sigue disponible para crear otro manifiesto

---

## 🔍 Ejemplo de Uso

**Escenario:** El hotel recolectó plástico de la cocina central y albercas. Ahora quiere registrar la salida.

**Paso 1:** Filtrar registros
```
- Tipo: Selecciona "Pet", "Plástico duro"
- Ubicación: Selecciona "Cocina central", "Albercas"
- Fecha: Deja sin filtro (muestra todos)
- Orden: "Más Recientes"
```

**Paso 2:** Agregar Manifiesto
```
- Clic en "Agregar Manifiesto"
- Selecciona el primer registro filtrado
- Fecha de Salida: 15/01/2024
- Número de Autorización: MX-2024-00147
- Notas: "Entregado a recicladora Verde Futuro"
- Guardar
```

**Resultado:** El registro aparece en la tabla "Manifiestos Registrados"

---

## 📊 Tabla de Manifiestos Registrados

Muestra todos los manifiestos creados con columnas:

| Columna | Descripción |
|---------|-------------|
| **Tipo** | Tipo de residuo (con badge azul) |
| **Ubicación** | Dónde se recolectó (con badge naranja) |
| **Peso (kg)** | Cantidad en kilogramos |
| **Fecha Salida** | Cuándo salió del hotel |
| **Autorización** | Código único del transporte/autoridad |
| **Notas** | Información adicional |
| **Acciones** | Botones editar/eliminar |

---

## 🎯 Flujo de Datos

```
1. Operador registra residuo → Tabla de Registros (Captura)
2. Administrador ve registro → Dashboard (análisis)
3. Administrador crea Manifiesto → Tabla de Manifiestos
   - Asigna Fecha de Salida
   - Asigna Número de Autorización
   - Añade notas si es necesario
4. Sistema almacena Manifiesto separadamente
   - Registro original sigue disponible
   - Manifiesto es editable/eliminable
```

---

## 💾 Almacenamiento de Datos

**Registros y Manifiestos son independientes:**

```javascript
// Registros de Residuos (en Dashboard)
{
  id: "123456",
  type: "Pet",
  location: "Cocina central",
  weight: 12.5,
  date: "2024-01-15",
  time: "10:30",
  notes: "Botellas de bebida"
}

// Manifiestos (en esta pestaña)
{
  id: "789012",
  type: "Pet",
  location: "Cocina central",
  weight: 12.5,
  date: "2024-01-15",
  time: "10:30",
  exitDate: "2024-01-15",        // Nuevo
  authorizationNumber: "MX-2024-00147", // Nuevo
  notes: "Entregado a recicladora"
}
```

---

## 🔒 Restricciones y Validaciones

1. **Campos obligatorios:**
   - Fecha de Salida (requerido)
   - Número de Autorización (requerido)
   - Registro seleccionado (requerido)

2. **Número de Autorización:**
   - Acepta letras y números
   - Se convierte automáticamente a mayúsculas
   - Ej: `MX-2024-147`, `AUTH-XYZ-123`

3. **Fecha de Salida:**
   - Es una fecha completa
   - Generalmente igual o posterior a la fecha del registro original

---

## 📋 Filtros Disponibles

### Tipos de Residuo (Multi-selección)
```
✓ Orgánicos
✓ Orgánicos (naranja/limón)
✓ Inorgánicos - no valorizables
✓ Pet
✓ Plástico duro
✓ Emplaye
✓ BOPP (envolturas)
✓ Vidrio
✓ Aluminio
✓ Cartón
... y más
```

### Ubicaciones (Multi-selección)
```
✓ Cocina central
✓ Albercas
✓ Almacén
✓ Lavandería
✓ Mantenimiento
... y más
```

### Rango de Fechas
- Fecha Inicio: Selecciona la fecha mínima
- Fecha Fin: Selecciona la fecha máxima

### Ordenamiento
- **Más Recientes**: Orden descendente por fecha
- **Más Antiguos**: Orden ascendente por fecha

---

## ✅ Checklist de Uso

- [ ] Accede a la pestaña "Manifiestos"
- [ ] Ves la sección "Registros Disponibles" o lista de registros
- [ ] Filtras los residuos que deseas (opcional)
- [ ] Haces clic en "Agregar Manifiesto"
- [ ] Seleccionas un registro
- [ ] Ingresas Fecha de Salida
- [ ] Ingresas Número de Autorización
- [ ] Añades notas (opcional)
- [ ] Guardas el manifiesto
- [ ] Ves el registro en "Manifiestos Registrados"
- [ ] Editas si es necesario (haces clic en el ícono Editar)
- [ ] Eliminas si es necesario (haces clic en el ícono X)

---

## 🆘 Preguntas Frecuentes

**P: ¿Se elimina el registro original si elimino el manifiesto?**
R: No. El registro original sigue en el Dashboard. El manifesto es solo una referencia a ese registro.

**P: ¿Puedo crear múltiples manifiestos del mismo registro?**
R: Sí, si divides la salida de un residuo en varios envíos.

**P: ¿Puedo editar la información del registro original desde Manifiestos?**
R: No. Solo puedes editar la Fecha de Salida y Número de Autorización del manifesto.

**P: ¿Los datos de Manifiestos se usan en los reportes?**
R: No actualmente. Los manifiestos son un registro independiente. Esto puede cambiar en futuras versiones.

**P: ¿Qué pasa si cambio el Número de Autorización de un manifesto ya guardado?**
R: El sistema permite editar el número. Solo usa el ícono Editar y luego Guardar.

---

## 📞 Soporte

Para dudas o problemas con los manifiestos, contacta al administrador del sistema.
