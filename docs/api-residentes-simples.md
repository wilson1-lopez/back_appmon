# API de Residentes (Simples)

## Diferencia con Propietarios

Esta API es para **residentes simples** que solo viven en el apartamento, sin ser propietarios. A diferencia de los propietarios:
- **No incluye el campo `es_residente`** (siempre son residentes)
- **Más simple** - solo relación directa con apartamento
- **Usa la tabla `am_residentes_x_apto`** (sin campos adicionales)

## Endpoints disponibles

### 1. Crear un nuevo residente
**POST** `/api/residentes`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "María",
  "apellido": "García",
  "tipoDocumentoId": 1,
  "documento": "87654321",
  "telefono": "+57 300 987 6543",
  "correo": "maria.garcia@email.com",
  "fotoUrl": "https://ejemplo.com/foto.jpg",
  "apartamentoId": "uuid-del-apartamento",
  "generoId": 2,
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
  "message": "Residente creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "nombre": "María",
    "apellido": "García",
    // ... otros campos
    "apartamentos": [
      {
        "id": "uuid-del-apartamento",
        "numeroApto": "102"
        // ... otros campos del apartamento
      }
    ]
  }
}
```

### 1.1. Crear residente con foto
**POST** `/api/residentes/con-foto`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**FormData:**
- `nombre`: "María" (string, requerido)
- `apellido`: "García" (string, requerido)
- `tipoDocumentoId`: 1 (number, requerido)
- `documento`: "87654321" (string, opcional)
- `telefono`: "+57 300 987 6543" (string, opcional)
- `correo`: "maria.garcia@email.com" (string, opcional)
- `apartamentoId`: "uuid-del-apartamento" (string, requerido)
- `generoId`: 2 (number, opcional)
- `unidadResidencialId`: "uuid-de-la-unidad" (string, opcional)
- `foto`: archivo de imagen (file, opcional)

**Campos obligatorios:**
- `nombre`
- `apellido`
- `tipoDocumentoId`
- `apartamentoId`

**Formatos de foto soportados:**
- JPG, JPEG, PNG, GIF
- Tamaño máximo: 5MB
- La foto se guarda automáticamente en `/public/uploads/`

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Residente creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "nombre": "María",
    "apellido": "García",
    "fotoUrl": "/uploads/cuid-generado.jpg",
    // ... otros campos
    "apartamentos": [
      {
        "id": "uuid-del-apartamento",
        "numeroApto": "102"
        // ... otros campos del apartamento
      }
    ]
  }
}
```

### 2. Obtener residente por ID
**GET** `/api/residentes/:id`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Residente obtenido exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "María",
    "apellido": "García",
    // ... otros campos
    "apartamentos": [...],
    "unidadResidencial": {...}
  }
}
```

### 3. Obtener residentes de un apartamento
**GET** `/api/residentes/apartamento/:apartamentoId`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Residentes obtenidos exitosamente",
  "data": [
    {
      "id": "uuid",
      "nombre": "María",
      "apellido": "García",
      // ... otros campos
    }
  ]
}
```

### 4. Actualizar residente
**PUT** `/api/residentes/:id`

**Body:** (todos los campos son opcionales, **SIN `esResidente`**)
```json
{
  "nombre": "María Carmen",
  "telefono": "+57 300 111 2222",
  "correo": "nuevo.email@email.com",
  "fotoUrl": "https://nueva-foto.com/imagen.jpg"
}
```

### 4.1. Actualizar residente con foto
**PUT** `/api/residentes/:id/con-foto`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**FormData:** (todos los campos son opcionales)
- `nombre`: "María Carmen" (string, opcional)
- `apellido`: "García López" (string, opcional)
- `tipoDocumentoId`: 1 (number, opcional)
- `documento`: "87654321" (string, opcional)
- `telefono`: "+57 300 111 2222" (string, opcional)
- `correo`: "nuevo.email@email.com" (string, opcional)
- `generoId`: 2 (number, opcional)
- `unidadResidencialId`: "uuid-de-la-unidad" (string, opcional)
- `foto`: archivo de imagen (file, opcional)

**Comportamiento de la foto:**
- Si se envía una nueva foto: elimina la anterior y guarda la nueva
- Si no se envía foto: mantiene la foto existente
- Formatos soportados: JPG, JPEG, PNG, GIF
- Tamaño máximo: 5MB

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Residente actualizado exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "María Carmen",
    "apellido": "García López",
    "fotoUrl": "/uploads/nuevo-cuid.jpg",
    // ... otros campos actualizados
    "apartamentos": [...],
    "unidadResidencial": {...}
  }
}
```

### 5. Eliminar residente
**DELETE** `/api/residentes/:id`

**Lógica inteligente de eliminación:**
- Si el residente **también es propietario**: Solo se desasocia como residente, mantiene el registro como propietario
- Si **solo es residente**: Se elimina completamente de la base de datos

**Respuesta exitosa (200) - Eliminación completa:**
```json
{
  "success": true,
  "message": "Residente eliminado completamente",
  "data": {
    "eliminado": true,
    "mensaje": "Residente eliminado completamente"
  }
}
```

**Respuesta exitosa (200) - Solo desasociación:**
```json
{
  "success": true,
  "message": "Residente desasociado (mantiene rol de propietario)",
  "data": {
    "eliminado": false,
    "mensaje": "Residente desasociado (mantiene rol de propietario)"
  }
}
```

### 6. Asociar residente existente a apartamento
**POST** `/api/residentes/asociar-apartamento`

**Body:**
```json
{
  "residenteId": "uuid-del-residente",
  "apartamentoId": "uuid-del-apartamento"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Residente asociado al apartamento exitosamente"
}
```

### 7. Desasociar residente de apartamento
**DELETE** `/api/residentes/desasociar-apartamento`

**Body:**
```json
{
  "residenteId": "uuid-del-residente",
  "apartamentoId": "uuid-del-apartamento"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Residente desasociado del apartamento exitosamente"
}
```

## Características

### ✅ Simplicidad
- API más simple sin campos complejos
- Relación directa residente-apartamento
- Ideal para inquilinos o familiares

### ✅ Diferenciación clara
- **Residente:** Solo vive en el apartamento
- **Propietario:** Es dueño del apartamento (puede o no vivir ahí)

## Estructura de la base de datos

### Tabla: `am_personas`
- Misma tabla que propietarios
- **SIN el campo `es_residente`** (siempre son residentes)

### Tabla: `am_residentes_x_apto` (tabla intermedia)
- Relaciona residentes con apartamentos (many-to-many)
- **NO incluye el campo `es_residente`** (simplicidad)
- Campos: `id`, `apartamento_id`, `residente_id`, `created_at`, `updated_at`

## Casos de uso típicos

- **Inquilinos** que rentan el apartamento
- **Familiares** del propietario que viven ahí
- **Residentes temporales**
- **Personas que viven** pero no son dueñas
