# API de Propietarios

## Endpoints disponibles

### 1. Crear un nuevo propietario
**POST** `/api/propietarios`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "tipoDocumentoId": 1,
  "documento": "12345678",
  "telefono": "+57 300 123 4567",
  "correo": "juan.perez@email.com",
  "fotoUrl": "https://ejemplo.com/foto.jpg",
  "esResidente": true,
  "apartamentoId": "uuid-del-apartamento",
  "generoId": 1,
  "unidadResidencialId": "uuid-de-la-unidad"
}
```

**Campos obligatorios:**
- `nombre`
- `apellido`
- `tipoDocumentoId`
- `apartamentoId`

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Propietario creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "nombre": "Juan",
    "apellido": "Pérez",
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

## Características de la implementación

### ✅ Transacciones
- La creación de propietarios usa transacciones para garantizar consistencia
- Si falla la creación de la persona o la asociación, se revierte todo
- Las eliminaciones también usan transacciones

### ✅ Validaciones
- Validación de datos de entrada usando VineJS
- Verificación de existencia de apartamentos antes de asociar
- Validación de email y formato de datos

### ✅ Relaciones
- Manejo de relaciones many-to-many con apartamentos
- Carga automática de relaciones en las respuestas
- Soporte para múltiples apartamentos por propietario

### ✅ Manejo de errores
- Respuestas consistentes en formato JSON
- Manejo de errores de validación
- Rollback automático en caso de errores en transacciones

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

### Fotografía
- El campo `fotoUrl` almacena la URL/path de la imagen
- Es completamente opcional según los requisitos
- Puede ser actualizado en cualquier momento

### Transacciones
- La creación utiliza transacciones para garantizar que tanto la persona como la relación apartamento-propietario se creen correctamente
- Si cualquier parte falla, se revierte toda la operación
