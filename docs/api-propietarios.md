# API de Propietarios

## Endpoi### Campos opcionales:
- `documento`
- `telefono`
- `correo`
- `esResidente` (boolean, default: false)
- `generoId`
- `unidadResidencialId`
- `foto` (archivo JPG, JPEG, PNG, WEBP, máximo 5MB)

**Nota:** El endpoint maneja automáticamente la subida de la foto junto con la creación del propietario. No es necesario un paso separado para la foto.

**Nota sobre tipos de documentos:** Para obtener los tipos de documentos disponibles, use la API de ubicaciones: `GET /api/locations/document-types` o `GET /api/locations/countries/:countryId/document-types`ibles

### 1. Crear un nuevo propietario
**POST** `/api/propietarios`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
nombre: "Juan"
apellido: "Pérez"
tipoDocumentoId: 1
documento: "12345678"
telefono: "+57 300 123 4567"
correo: "juan.perez@email.com"
esResidente: true
apartamentoId: "uuid-del-apartamento"
generoId: 1
unidadResidencialId: "uuid-de-la-unidad"
foto: [archivo de imagen] (opcional)
```

**Campos obligatorios:**
- `nombre`
- `apellido`
- `tipoDocumentoId`
- `apartamentoId`

**Campos opcionales:**
- `documento`
- `telefono`
- `correo`
- `esResidente` (boolean, default: false)
- `generoId`
- `unidadResidencialId`
- `foto` (archivo JPG, JPEG, PNG, WEBP, máximo 5MB)

**Nota:** El endpoint maneja automáticamente la subida de la foto junto con la creación del propietario. No es necesario un paso separado para la foto.

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Propietario creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "nombre": "Juan",
    "apellido": "Pérez",
    "fotoUrl": "/uploads/fotos/uuid-generado_abc123.jpg",
    // ... otros campos
    "apartamentos": [
      {
        "id": "uuid-del-apartamento",
        "numeroApto": "101"
        // ... otros campos del apartamento
      }
    ]
  }
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "message": "Los campos nombre, apellido, tipoDocumentoId y apartamentoId son obligatorios"
}
```

**Ejemplo de uso con curl:**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "nombre=Juan" \
  -F "apellido=Pérez" \
  -F "tipoDocumentoId=1" \
  -F "apartamentoId=uuid-del-apartamento" \
  -F "documento=12345678" \
  -F "telefono=+57 300 123 4567" \
  -F "correo=juan.perez@email.com" \
  -F "esResidente=true" \
  -F "foto=@/path/to/photo.jpg" \
  http://localhost:3333/api/propietarios
```

**Ejemplo desde JavaScript (Frontend):**
```javascript
const formData = new FormData();
formData.append('nombre', 'Juan');
formData.append('apellido', 'Pérez');
formData.append('tipoDocumentoId', '1');
formData.append('apartamentoId', 'uuid-del-apartamento');
formData.append('documento', '12345678');
formData.append('telefono', '+57 300 123 4567');
formData.append('correo', 'juan.perez@email.com');
formData.append('esResidente', 'true');
formData.append('foto', fileInput.files[0]); // File from input

fetch('/api/propietarios', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

### 2. Obtener propietario por ID
**GET** `/api/propietarios/:id`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nombre": "Juan",
    "apellido": "Pérez",
    // ... otros campos
    "apartamentos": [...],
    "unidadResidencial": {...}
  }
}
```

### 3. Obtener propietarios de un apartamento
**GET** `/api/propietarios/apartamento/:apartamentoId`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Juan",
      "apellido": "Pérez",
      // ... otros campos
    }
  ]
}
```

### 4. Actualizar propietario
**PUT** `/api/propietarios/:id`

**Body:** (todos los campos son opcionales)
```json
{
  "nombre": "Juan Carlos",
  "telefono": "+57 300 999 8888",
  "correo": "nuevo.email@email.com",
  "esResidente": false,
  "fotoUrl": "https://nueva-foto.com/imagen.jpg"
}
```

### 5. Eliminar propietario
**DELETE** `/api/propietarios/:id`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Propietario eliminado exitosamente"
}
```

### 6. Asociar propietario existente a apartamento
**POST** `/api/propietarios/asociar-apartamento`

**Body:**
```json
{
  "propietarioId": "uuid-del-propietario",
  "apartamentoId": "uuid-del-apartamento",
  "esResidente": true
}
```

### 7. Desasociar propietario de apartamento
**DELETE** `/api/propietarios/desasociar-apartamento`

**Body:**
```json
{
  "propietarioId": "uuid-del-propietario",
  "apartamentoId": "uuid-del-apartamento"
}
```

### 8. Subir foto del propietario
**POST** `/api/propietarios/:id/foto`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `foto`: Archivo de imagen (JPG, JPEG, PNG, WEBP)
- Tamaño máximo: 5MB

**Respuesta exitosa (200):**
```json
{
  "message": "Foto guardada exitosamente",
  "data": {
    "foto_url": "/uploads/fotos/uuid-propietario_abc123.jpg",
    "propietario": {
      "id": "uuid-del-propietario",
      "nombre": "Juan",
      "apellido": "Pérez",
      "fotoUrl": "/uploads/fotos/uuid-propietario_abc123.jpg",
      // ... otros campos
    }
  }
}
```

**Respuesta de error (400):**
```json
{
  "error": "No se ha enviado ningún archivo de foto"
}
```

```json
{
  "error": "Propietario no encontrado"
}
```

```json
{
  "error": "Archivo inválido: Tamaño de archivo excede el límite de 5MB"
}
```

### 9. Obtener foto del propietario
**GET** `/uploads/fotos/:filename`

**Descripción:** Endpoint público para servir las fotos de los propietarios.

**Ejemplo:**
```
GET /uploads/fotos/uuid-propietario_abc123.jpg
```

**Headers de respuesta:**
```
Content-Type: image/jpeg (o image/png, image/webp según el archivo)
Cache-Control: public, max-age=31536000
```

**Respuesta exitosa:** Archivo de imagen

**Respuesta de error (404):**
```json
{
  "error": "Archivo no encontrado"
}
```

## Características de la implementación

### ✅ Transacciones
- La creación de propietarios usa transacciones para garantizar consistencia
- Incluye manejo de subida de foto en la misma transacción
- Si falla la creación de la persona, la foto o la asociación, se revierte todo
- Las eliminaciones también usan transacciones

### ✅ Validaciones
- Validación de datos de entrada (manual para multipart/form-data)
- Verificación de existencia de apartamentos antes de asociar
- Validación de archivo de foto (formato y tamaño)
- Validación de email y formato de datos

### ✅ Relaciones
- Manejo de relaciones many-to-many con apartamentos
- Carga automática de relaciones en las respuestas
- Soporte para múltiples apartamentos por propietario

### ✅ Manejo de errores
- Respuestas consistentes en formato JSON
- Manejo de errores de validación
- Rollback automático en caso de errores en transacciones

### ✅ Subida de archivos
- **Creación con foto:** La foto se puede subir junto con la creación del propietario
- **Endpoint separado:** `POST /api/propietarios/:id/foto` para actualizar foto después
- Validación de tipos de archivo (JPG, JPEG, PNG, WEBP)
- Límite de tamaño de 5MB
- Eliminación automática de fotos anteriores (al actualizar)
- Nombres de archivo únicos para evitar conflictos
- Almacenamiento en directorio `/public/uploads/fotos/`
- **Manejo transaccional:** La foto se procesa dentro de la transacción de creación

## Estructura de la base de datos

### Tabla: `am_personas`
- Almacena la información básica del propietario
- Incluye el campo `foto_url` para la fotografía opcional
- **NO incluye el campo `es_residente`** (esto se maneja en la tabla pivote)
- Campos principales: `nombre`, `apellido`, `documento`, `telefono`, `correo`, `foto_url`

### Tabla: `am_propietarios_x_apto` (tabla intermedia)
- Relaciona propietarios con apartamentos (many-to-many)
- Permite múltiples propietarios por apartamento
- Permite múltiples apartamentos por propietario
- **Incluye el campo `es_residente`** para indicar si el propietario también reside en el apartamento
- Campos: `id`, `apartamento_id`, `propietario_id`, `es_residente`, `created_at`, `updated_at`

### Tabla: `am_residentes_x_apto` (tabla intermedia para residentes)
- Se llena automáticamente cuando un propietario tiene `es_residente = true`
- Relaciona residentes con apartamentos
- Campos: `id`, `apartamento_id`, `residente_id`, `created_at`, `updated_at`
- **Gestión automática:** Se sincroniza automáticamente con el campo `es_residente` de la tabla de propietarios

## Campos y validaciones

### Campos obligatorios para crear propietario:
- `nombre` (string, 2-100 caracteres)
- `apellido` (string, 2-100 caracteres)
- `tipoDocumentoId` (number, positivo)
- `apartamentoId` (string, UUID válido)

### Campos opcionales:
- `documento` (string, nullable)
- `telefono` (string, nullable)
- `correo` (string, email válido, nullable)
- `fotoUrl` (string, nullable)
- `esResidente` (boolean, default: false) - **Se guarda en la tabla pivote**
- `generoId` (number, positivo, nullable)
- `unidadResidencialId` (string, UUID válido, nullable)

## Notas importantes

### Switch "Es residente"
- El campo `esResidente` indica si el propietario también reside en el apartamento
- Se almacena en la tabla pivote `am_propietarios_x_apto`
- Por defecto es `false` (un propietario no necesariamente reside en su propiedad)
- Puede ser actualizado posteriormente
- **Diferencia clave:** Un propietario puede ser dueño sin vivir ahí
- **Funcionalidad dual:** Si `esResidente = true`, la persona se registra automáticamente en **AMBAS** tablas:
  - `am_propietarios_x_apto` (como propietario con `es_residente = true`)
  - `am_residentes_x_apto` (como residente)
- **Gestión automática:** Al cambiar el estado de `esResidente`, se actualiza automáticamente la tabla de residentes

### Fotografía
- El campo `fotoUrl` almacena la URL/path de la imagen
- Es completamente opcional según los requisitos
- **Método 1 (Recomendado):** Subir foto durante la creación usando `multipart/form-data` en `POST /api/propietarios`
- **Método 2:** Subir/actualizar foto después usando `POST /api/propietarios/:id/foto`
- **Formatos soportados:** JPG, JPEG, PNG, WEBP
- **Tamaño máximo:** 5MB
- **Almacenamiento:** `/public/uploads/fotos/`
- **Nombres únicos:** Se genera automáticamente para evitar conflictos
- **Limpieza automática:** Se elimina la foto anterior al subir una nueva (solo en actualizaciones)
- **Transaccional:** La subida durante la creación se maneja dentro de la transacción
- **Acceso público:** Las fotos se pueden acceder directamente mediante `GET /uploads/fotos/:filename`
- **Cache:** Las fotos se sirven con headers de cache para optimizar la carga

### Transacciones
- La creación utiliza transacciones para garantizar que tanto la persona como la relación apartamento-propietario se creen correctamente
- Si cualquier parte falla, se revierte toda la operación

## Lógica de negocio: Propietarios vs Residentes

### **Concepto clave:**
- **Propietario:** Persona que es dueña del apartamento (puede o no vivir ahí)
- **Residente:** Persona que vive en el apartamento (puede o no ser propietaria)
- **Propietario-Residente:** Persona que es dueña Y vive en el apartamento

### **Implementación en base de datos:**
1. **Tabla `am_propietarios_x_apto`:** Registra TODOS los propietarios
   - Campo `es_residente`: Indica si este propietario también vive en el apartamento
   
2. **Tabla `am_residentes_x_apto`:** Registra SOLO los residentes
   - Se llena automáticamente cuando `es_residente = true` en la tabla de propietarios
   - También puede tener residentes que NO son propietarios (inquilinos, familiares, etc.)

### **Flujo automático:**
- ✅ **Crear propietario con `esResidente = true`:** Se registra en ambas tablas
- ✅ **Crear propietario con `esResidente = false`:** Solo se registra como propietario
- ✅ **Cambiar `esResidente` a `true`:** Se agrega automáticamente a la tabla de residentes
- ✅ **Cambiar `esResidente` a `false`:** Se elimina automáticamente de la tabla de residentes
- ✅ **Eliminar propietario:** Se elimina de ambas tablas automáticamente

## Ejemplos de uso

### **Escenario 1: Propietario que NO vive en el apartamento**
```javascript
// Crear propietario que no es residente (inversionista)
formData.append('esResidente', 'false'); // o simplemente omitir el campo

// Resultado:
// ✅ Registro en am_propietarios_x_apto con es_residente = false
// ❌ NO se registra en am_residentes_x_apto
```

### **Escenario 2: Propietario que SÍ vive en el apartamento**
```javascript
// Crear propietario que también es residente
formData.append('esResidente', 'true');

// Resultado:
// ✅ Registro en am_propietarios_x_apto con es_residente = true
// ✅ Registro en am_residentes_x_apto
```

### **Escenario 3: Cambiar estado de residencia**
```javascript
// Propietario decide mudarse al apartamento
PUT /api/propietarios/actualizar-es-residente
{
  "propietarioId": "uuid",
  "apartamentoId": "uuid", 
  "esResidente": true
}

// Resultado:
// ✅ Actualiza am_propietarios_x_apto: es_residente = true
// ✅ Agrega registro en am_residentes_x_apto
```
