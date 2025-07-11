# API de Ubicaciones y Tipos de Documentos

## Endpoints disponibles

### Ubicaciones Geográficas

#### 1. Obtener todos los países
**GET** `/api/locations/countries`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Colombia",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Países obtenidos exitosamente"
}
```

#### 2. Obtener departamentos por país
**GET** `/api/locations/countries/:countryId/departments`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "country": {
      "id": 1,
      "name": "Colombia"
    },
    "departments": [
      {
        "id": 1,
        "name": "Antioquia",
        "countryId": 1
      }
    ]
  },
  "message": "Departamentos obtenidos exitosamente"
}
```

#### 3. Obtener ciudades por departamento
**GET** `/api/locations/departments/:departmentId/cities`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "department": {
      "id": 1,
      "name": "Antioquia",
      "countryId": 1
    },
    "cities": [
      {
        "id": 1,
        "name": "Medellín",
        "departmentId": 1
      }
    ]
  },
  "message": "Ciudades obtenidas exitosamente"
}
```

#### 4. Obtener jerarquía completa de un país
**GET** `/api/locations/countries/:countryId/hierarchy`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Colombia",
    "departments": [
      {
        "id": 1,
        "name": "Antioquia",
        "cities": [
          {
            "id": 1,
            "name": "Medellín"
          }
        ]
      }
    ]
  },
  "message": "Jerarquía completa obtenida exitosamente"
}
```

### Tipos de Documentos

#### 5. Obtener todos los tipos de documentos base
**GET** `/api/locations/document-types/base`

**Descripción:** Obtiene los tipos de documentos base (CC, CE, TI, etc.) sin filtrar por país.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "CC",
      "name": "Cédula de Ciudadanía",
      "status": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "code": "CE",
      "name": "Cédula de Extranjería",
      "status": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "code": "TI",
      "name": "Tarjeta de Identidad",
      "status": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Tipos de documentos base obtenidos exitosamente"
}
```

#### 6. Obtener tipos de documentos por país
**GET** `/api/locations/countries/:countryId/document-types`

**Descripción:** Obtiene los tipos de documentos disponibles para un país específico.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "country": {
      "id": 1,
      "name": "Colombia"
    },
    "documentTypes": [
      {
        "id": 1,
        "baseTypeId": 1,
        "countryId": 1,
        "status": true,
        "baseType": {
          "id": 1,
          "code": "CC",
          "name": "Cédula de Ciudadanía"
        }
      },
      {
        "id": 2,
        "baseTypeId": 2,
        "countryId": 1,
        "status": true,
        "baseType": {
          "id": 2,
          "code": "CE",
          "name": "Cédula de Extranjería"
        }
      }
    ]
  },
  "message": "Tipos de documentos por país obtenidos exitosamente"
}
```

#### 7. Obtener todos los tipos de documentos
**GET** `/api/locations/document-types`

**Descripción:** Obtiene todos los tipos de documentos con información completa de país y tipo base.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "baseTypeId": 1,
      "countryId": 1,
      "status": true,
      "baseType": {
        "id": 1,
        "code": "CC",
        "name": "Cédula de Ciudadanía"
      }
    },
    {
      "id": 2,
      "baseTypeId": 2,
      "countryId": 1,
      "status": true,
      "baseType": {
        "id": 2,
        "code": "CE",
        "name": "Cédula de Extranjería"
      }
    }
  ],
  "message": "Todos los tipos de documentos obtenidos exitosamente"
}
```

## Estructura de la base de datos

### Tabla: `am_tipos_documento_base`
- Almacena los tipos de documentos base
- Campos: `id`, `codigo`, `nombre`, `estado`, `created_at`, `updated_at`
- Ejemplos: CC, CE, TI, RC, etc.

### Tabla: `am_tipos_documento`
- Relaciona tipos base con países específicos
- Campos: `id`, `tipo_base_id`, `pais_id`, `estado`, `created_at`, `updated_at`
- Permite que cada país tenga tipos de documentos específicos

### Relaciones
- `am_tipos_documento.tipo_base_id` → `am_tipos_documento_base.id`
- `am_tipos_documento.pais_id` → `am_paises.id`

## Casos de uso

### Para formularios de registro
1. **Obtener países:** `GET /api/locations/countries`
2. **Obtener tipos de documentos para el país seleccionado:** `GET /api/locations/countries/:countryId/document-types`
3. **Obtener departamentos del país:** `GET /api/locations/countries/:countryId/departments`
4. **Obtener ciudades del departamento:** `GET /api/locations/departments/:departmentId/cities`

### Para campos de selección dependientes
```javascript
// 1. Cargar países y tipos de documentos base
const countries = await fetch('/api/locations/countries');
const baseDocTypes = await fetch('/api/locations/document-types/base');

// 2. Cuando se selecciona un país, cargar tipos específicos
const documentTypes = await fetch(`/api/locations/countries/${countryId}/document-types`);
const departments = await fetch(`/api/locations/countries/${countryId}/departments`);

// 3. Cuando se selecciona un departamento, cargar ciudades
const cities = await fetch(`/api/locations/departments/${departmentId}/cities`);
```

## Características de la implementación

### ✅ Filtrado por estado
- Solo se devuelven registros con `status: true`
- Filtrado aplicado tanto a tipos base como a tipos por país

### ✅ Ordenamiento
- Países y departamentos ordenados alfabéticamente
- Tipos de documentos ordenados por ID para consistencia

### ✅ Relaciones optimizadas
- Uso de `preload()` para cargar relaciones de manera eficiente
- Evita el problema N+1 queries

### ✅ Respuestas estructuradas
- Formato consistente en todas las respuestas
- Información contextual (país, departamento) incluida donde corresponde

### ✅ Manejo de errores
- Validación de existencia de registros padre
- Respuestas de error consistentes
- Logs de errores para debugging
