# API de Apartamentos

Esta API permite gestionar apartamentos en el sistema de administración de condominios.

## Endpoints Disponibles

### 1. Listar Apartamentos
**GET** `/api/apartamentos`

**Parámetros de consulta (query params):**
- `page` (número): Página actual (por defecto: 1)
- `limit` (número): Elementos por página (por defecto: 10)
- `torreBloqueId` (UUID): Filtrar por torre/bloque específico
- `estadoId` (número): Filtrar por estado del apartamento
- `alquilado` (booleano): Filtrar por estado de alquiler (true/false)
- `numeroApto` (string): Buscar por número de apartamento (búsqueda parcial)

**Ejemplo de solicitud:**
```bash
GET /api/apartamentos?page=1&limit=10&torreBloqueId=550e8400-e29b-41d4-a716-446655440000&alquilado=false
```

**Respuesta exitosa (200):**
```json
{
  "message": "Apartamentos obtenidos exitosamente",
  "data": {
    "meta": {
      "total": 50,
      "perPage": 10,
      "currentPage": 1,
      "lastPage": 5,
      "firstPage": 1,
      "firstPageUrl": "/?page=1",
      "lastPageUrl": "/?page=5",
      "nextPageUrl": "/?page=2",
      "previousPageUrl": null
    },
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "torreBloqueId": "550e8400-e29b-41d4-a716-446655440000",
        "numeroApto": "101",
        "nroParqueadero": "P-01",
        "coeficiente": 0.025,
        "numeroCuartoUtil": "CU-01",
        "areaLibre": "10m2",
        "coeApto": 0.02,
        "coeParqueadero": 0.003,
        "coeCuartoUtil": 0.002,
        "coeAreaLibre": 0.001,
        "facturaDigital": true,
        "estadoId": 1,
        "alquilado": false,
        "agenciaId": null,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "torreBloque": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nombre": "Torre A",
          "pisos": 10,
          "descripcion": "Torre principal del conjunto"
        }
      }
    ]
  }
}
```

### 2. Crear Apartamento
**POST** `/api/apartamentos`

**Cuerpo de la solicitud:**
```json
{
  "torreBloqueId": "550e8400-e29b-41d4-a716-446655440000",
  "numeroApto": "102",
  "nroParqueadero": "P-02",
  "coeficiente": 0.025,
  "numeroCuartoUtil": "CU-02",
  "areaLibre": "12m2",
  "coeApto": 0.02,
  "coeParqueadero": 0.003,
  "coeCuartoUtil": 0.002,
  "coeAreaLibre": 0.001,
  "facturaDigital": true,
  "estadoId": 1,
  "alquilado": false,
  "agenciaId": null
}
```

**Campos requeridos:**
- `torreBloqueId` (UUID): ID de la torre/bloque
- `numeroApto` (string, máx 20 caracteres): Número del apartamento
- `estadoId` (número): ID del estado del apartamento

**Campos opcionales:**
- `nroParqueadero` (string, máx 20 caracteres): Número del parqueadero
- `coeficiente` (decimal): Coeficiente del apartamento
- `numeroCuartoUtil` (string, máx 20 caracteres): Número del cuarto útil
- `areaLibre` (string, máx 20 caracteres): Área libre
- `coeApto` (decimal): Coeficiente del apartamento
- `coeParqueadero` (decimal): Coeficiente del parqueadero
- `coeCuartoUtil` (decimal): Coeficiente del cuarto útil
- `coeAreaLibre` (decimal): Coeficiente del área libre
- `facturaDigital` (booleano): Si tiene facturación digital (por defecto: false)
- `alquilado` (booleano): Si está alquilado (por defecto: false)
- `agenciaId` (UUID): ID de la agencia (si aplica)

**Respuesta exitosa (201):**
```json
{
  "message": "Apartamento creado exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "torreBloqueId": "550e8400-e29b-41d4-a716-446655440000",
    "numeroApto": "102",
    // ... resto de campos
  }
}
```

### 3. Obtener Apartamento por ID
**GET** `/api/apartamentos/:id`

**Respuesta exitosa (200):**
```json
{
  "message": "Apartamento obtenido exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "torreBloqueId": "550e8400-e29b-41d4-a716-446655440000",
    "numeroApto": "101",
    // ... resto de campos
    "torreBloque": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombre": "Torre A",
      "pisos": 10
    }
  }
}
```

### 4. Actualizar Apartamento
**PUT** `/api/apartamentos/:id`

**Cuerpo de la solicitud:** (todos los campos son opcionales)
```json
{
  "numeroApto": "102A",
  "nroParqueadero": "P-02A",
  "facturaDigital": true,
  "alquilado": true
}
```

### 5. Eliminar Apartamento
**DELETE** `/api/apartamentos/:id`

**Respuesta exitosa (200):**
```json
{
  "message": "Apartamento eliminado exitosamente"
}
```

### 6. Obtener Apartamentos por Torre/Bloque
**GET** `/api/apartamentos/torre-bloque/:torreBloqueId`

**Parámetros de consulta:**
- `page` (número): Página actual
- `limit` (número): Elementos por página

### 7. Obtener Estadísticas de Apartamentos
**GET** `/api/apartamentos/stats/general`

**Parámetros de consulta:**
- `torreBloqueId` (UUID, opcional): Filtrar estadísticas por torre/bloque

**Respuesta exitosa (200):**
```json
{
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 100,
    "alquilados": 75,
    "disponibles": 25,
    "facturaDigital": 80
  }
}
```

### 8. Cambiar Estado de Alquiler
**PATCH** `/api/apartamentos/:id/toggle-alquiler`

Cambia el estado de alquiler del apartamento (de alquilado a disponible o viceversa).

### 9. Cambiar Estado de Facturación Digital
**PATCH** `/api/apartamentos/:id/toggle-factura-digital`

Activa o desactiva la facturación digital del apartamento.

## Códigos de Error

- **400 Bad Request**: Datos de entrada inválidos o errores de validación
- **401 Unauthorized**: Token de autenticación requerido o inválido
- **404 Not Found**: Apartamento no encontrado
- **409 Conflict**: Número de apartamento duplicado en la misma torre/bloque

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT en el header:
```
Authorization: Bearer <token>
```

## Validaciones

- El número de apartamento debe ser único dentro de cada torre/bloque
- La torre/bloque debe existir antes de crear un apartamento
- Los campos de tipo UUID deben tener formato válido
- Los campos numéricos deben ser válidos y positivos
- Los campos de texto tienen límites de longitud específicos
