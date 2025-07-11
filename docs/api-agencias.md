# API de Agencias

Esta API permite gestionar agencias inmobiliarias en el sistema de administración de condominios.

## Endpoints Disponibles

### 1. Listar Agencias
**GET** `/api/agencias`

**Parámetros de consulta (query params):**
- `page` (número): Página actual (por defecto: 1)
- `limit` (número): Elementos por página (por defecto: 10)
- `nombre` (string): Filtrar por nombre de agencia (búsqueda parcial)
- `ciudad` (string): Filtrar por ciudad (búsqueda parcial)
- `correo` (string): Filtrar por correo electrónico (búsqueda parcial)

**Ejemplo de solicitud:**
```bash
GET /api/agencias?page=1&limit=10&ciudad=Bogotá&nombre=Inmobiliaria
```

**Respuesta exitosa (200):**
```json
{
  "message": "Agencias obtenidas exitosamente",
  "data": {
    "meta": {
      "total": 25,
      "perPage": 10,
      "currentPage": 1,
      "lastPage": 3,
      "firstPage": 1,
      "firstPageUrl": "/?page=1",
      "lastPageUrl": "/?page=3",
      "nextPageUrl": "/?page=2",
      "previousPageUrl": null
    },
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "nombre": "Inmobiliaria Premium",
        "contactoNombre": "Juan Pérez",
        "correo": "contacto@inmobiliariapremium.com",
        "telefono": "+57 300 123 4567",
        "direccion": "Calle 123 #45-67",
        "ciudad": "Bogotá",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 2. Crear Agencia
**POST** `/api/agencias`

**Cuerpo de la solicitud:**
```json
{
  "nombre": "Inmobiliaria Premium",
  "contactoNombre": "Juan Pérez",
  "correo": "contacto@inmobiliariapremium.com",
  "telefono": "+57 300 123 4567",
  "direccion": "Calle 123 #45-67",
  "ciudad": "Bogotá"
}
```

**Campos requeridos:**
- `nombre` (string, máx 255 caracteres): Nombre de la agencia

**Campos opcionales:**
- `contactoNombre` (string, máx 255 caracteres): Nombre del contacto principal
- `correo` (string, máx 255 caracteres): Correo electrónico (debe ser válido)
- `telefono` (string, máx 50 caracteres): Número de teléfono
- `direccion` (string, máx 500 caracteres): Dirección física
- `ciudad` (string, máx 255 caracteres): Ciudad donde se ubica

**Respuesta exitosa (201):**
```json
{
  "message": "Agencia creada exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Inmobiliaria Premium",
    "contactoNombre": "Juan Pérez",
    "correo": "contacto@inmobiliariapremium.com",
    "telefono": "+57 300 123 4567",
    "direccion": "Calle 123 #45-67",
    "ciudad": "Bogotá",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Obtener Agencia por ID
**GET** `/api/agencias/:id`

**Respuesta exitosa (200):**
```json
{
  "message": "Agencia obtenida exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Inmobiliaria Premium",
    "contactoNombre": "Juan Pérez",
    "correo": "contacto@inmobiliariapremium.com",
    "telefono": "+57 300 123 4567",
    "direccion": "Calle 123 #45-67",
    "ciudad": "Bogotá",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "apartamentos": [
      {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "numeroApto": "101",
        "alquilado": true,
        "torreBloque": {
          "nombre": "Torre A"
        }
      }
    ]
  }
}
```

### 4. Actualizar Agencia
**PUT** `/api/agencias/:id`

**Cuerpo de la solicitud:** (todos los campos son opcionales)
```json
{
  "nombre": "Inmobiliaria Premium Actualizada",
  "contactoNombre": "Juan Carlos Pérez",
  "telefono": "+57 300 987 6543"
}
```

### 5. Eliminar Agencia
**DELETE** `/api/agencias/:id`

**Respuesta exitosa (200):**
```json
{
  "message": "Agencia eliminada exitosamente"
}
```

**Nota:** No se puede eliminar una agencia que tenga apartamentos asociados.

### 6. Obtener Todas las Agencias (Sin paginación)
**GET** `/api/agencias/all`

Útil para llenar selects o dropdowns en formularios.

**Respuesta exitosa (200):**
```json
{
  "message": "Listado de agencias obtenido exitosamente",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nombre": "Inmobiliaria Premium",
      "contactoNombre": "Juan Pérez",
      "correo": "contacto@inmobiliariapremium.com",
      "telefono": "+57 300 123 4567"
    }
  ]
}
```

### 7. Buscar Agencias
**GET** `/api/agencias/search`

**Parámetros de consulta:**
- `q` (string, requerido): Término de búsqueda
- `limit` (número): Máximo de resultados (por defecto: 10)

Busca en los campos: nombre, contacto, correo y ciudad.

**Ejemplo de solicitud:**
```bash
GET /api/agencias/search?q=Premium&limit=5
```

### 8. Obtener Estadísticas de Agencias
**GET** `/api/agencias/stats`

**Respuesta exitosa (200):**
```json
{
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 50,
    "conApartamentos": 35,
    "sinApartamentos": 15,
    "porCiudad": [
      {
        "ciudad": "Bogotá",
        "total": 20
      },
      {
        "ciudad": "Medellín",
        "total": 15
      },
      {
        "ciudad": "Cali",
        "total": 10
      }
    ]
  }
}
```

### 9. Obtener Apartamentos de una Agencia
**GET** `/api/agencias/:id/apartamentos`

**Parámetros de consulta:**
- `page` (número): Página actual
- `limit` (número): Elementos por página

**Respuesta exitosa (200):**
```json
{
  "message": "Apartamentos de la agencia obtenidos exitosamente",
  "data": {
    "meta": {
      "total": 25,
      "perPage": 10,
      "currentPage": 1
    },
    "data": [
      {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "numeroApto": "101",
        "alquilado": true,
        "facturaDigital": true,
        "torreBloqueNombre": "Torre A"
      }
    ]
  }
}
```

## Códigos de Error

- **400 Bad Request**: 
  - Datos de entrada inválidos
  - Nombre de agencia duplicado
  - Correo electrónico duplicado
  - Agencia tiene apartamentos asociados (al eliminar)
- **401 Unauthorized**: Token de autenticación requerido o inválido
- **404 Not Found**: Agencia no encontrada

## Validaciones

- **Nombre**: Requerido, máximo 255 caracteres, debe ser único
- **Correo**: Opcional, formato de email válido, máximo 255 caracteres, debe ser único si se proporciona
- **Contacto**: Opcional, máximo 255 caracteres
- **Teléfono**: Opcional, máximo 50 caracteres
- **Dirección**: Opcional, máximo 500 caracteres
- **Ciudad**: Opcional, máximo 255 caracteres

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT en el header:
```
Authorization: Bearer <token>
```

## Relaciones

- Una agencia puede tener múltiples apartamentos asociados
- Los apartamentos pueden tener una agencia asignada (relación opcional)
- Al obtener una agencia por ID, se incluyen sus apartamentos asociados
- Al obtener apartamentos, se incluye la información de la agencia si está asignada

## Casos de Uso

1. **Gestión de agencias inmobiliarias** que manejan apartamentos en alquiler
2. **Seguimiento de contactos** y información comercial de las agencias
3. **Reportes y estadísticas** de distribución geográfica de agencias
4. **Asignación de apartamentos** a agencias específicas para su gestión
5. **Búsqueda rápida** de agencias por diferentes criterios
