# API - Vehículos de Apartamento

Esta API permite gestionar los vehículos asociados a los apartamentos.

## Endpoints

### 1. Obtener todos los vehículos
```
GET /api/vehiculos-apartamento
```

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "apartamentoId": "uuid",
      "tipoId": 1,
      "placa": "ABC123",
      "otroTipoDescripcion": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "apartamento": {
        "id": "uuid",
        "numeroApto": "101",
        "torreBloqueId": "uuid"
      },
      "tipoVehiculo": {
        "id": 1,
        "codigo": "AUTO",
        "nombre": "Automóvil"
      }
    }
  ],
  "message": "Vehículos obtenidos exitosamente"
}
```

### 2. Obtener un vehículo por ID
```
GET /api/vehiculos-apartamento/{id}
```

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Parámetros:**
- `id` (UUID): ID del vehículo

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "apartamentoId": "uuid",
    "tipoId": 1,
    "placa": "ABC123",
    "otroTipoDescripcion": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "apartamento": {
      "id": "uuid",
      "numeroApto": "101",
      "torreBloqueId": "uuid"
    },
    "tipoVehiculo": {
      "id": 1,
      "codigo": "AUTO",
      "nombre": "Automóvil"
    }
  },
  "message": "Vehículo obtenido exitosamente"
}
```

### 3. Obtener vehículos de un apartamento específico
```
GET /api/vehiculos-apartamento/apartamento/{apartamentoId}
```

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Parámetros:**
- `apartamentoId` (UUID): ID del apartamento

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "apartamentoId": "uuid",
      "tipoId": 1,
      "placa": "ABC123",
      "otroTipoDescripcion": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "apartamento": {
        "id": "uuid",
        "numeroApto": "101",
        "torreBloqueId": "uuid"
      },
      "tipoVehiculo": {
        "id": 1,
        "codigo": "AUTO",
        "nombre": "Automóvil"
      }
    }
  ],
  "message": "Vehículos del apartamento obtenidos exitosamente"
}
```

### 4. Registrar un nuevo vehículo
```
POST /api/vehiculos-apartamento
```

**Headers requeridos:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Cuerpo de la solicitud:**
```json
{
  "apartamento_id": "uuid",
  "tipo_id": 1,
  "placa": "ABC123",
  "otro_tipo_descripcion": "Descripción opcional"
}
```

**Campos:**
- `apartamento_id` (UUID, requerido): ID del apartamento
- `tipo_id` (number, requerido): ID del tipo de vehículo
- `placa` (string, opcional): Placa del vehículo
- `otro_tipo_descripcion` (string, opcional): Descripción adicional del tipo

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "apartamentoId": "uuid",
    "tipoId": 1,
    "placa": "ABC123",
    "otroTipoDescripcion": "Descripción opcional",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "apartamento": {
      "id": "uuid",
      "numeroApto": "101",
      "torreBloqueId": "uuid"
    },
    "tipoVehiculo": {
      "id": 1,
      "codigo": "AUTO",
      "nombre": "Automóvil"
    }
  },
  "message": "Vehículo registrado exitosamente"
}
```

### 5. Actualizar un vehículo
```
PUT /api/vehiculos-apartamento/{id}
```

**Headers requeridos:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Parámetros:**
- `id` (UUID): ID del vehículo

**Cuerpo de la solicitud:**
```json
{
  "apartamento_id": "uuid",
  "tipo_id": 1,
  "placa": "XYZ789",
  "otro_tipo_descripcion": "Nueva descripción"
}
```

**Campos (todos opcionales):**
- `apartamento_id` (UUID): ID del apartamento
- `tipo_id` (number): ID del tipo de vehículo
- `placa` (string): Placa del vehículo
- `otro_tipo_descripcion` (string): Descripción adicional del tipo

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "apartamentoId": "uuid",
    "tipoId": 1,
    "placa": "XYZ789",
    "otroTipoDescripcion": "Nueva descripción",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "apartamento": {
      "id": "uuid",
      "numeroApto": "101",
      "torreBloqueId": "uuid"
    },
    "tipoVehiculo": {
      "id": 1,
      "codigo": "AUTO",
      "nombre": "Automóvil"
    }
  },
  "message": "Vehículo actualizado exitosamente"
}
```

### 6. Eliminar un vehículo
```
DELETE /api/vehiculos-apartamento/{id}
```

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Parámetros:**
- `id` (UUID): ID del vehículo

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Vehículo eliminado exitosamente"
}
```

### 7. Obtener estadísticas de vehículos
```
GET /api/vehiculos-apartamento/stats/general
```

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "por_tipo": [
      {
        "tipo": "Automóvil",
        "total": 85
      },
      {
        "tipo": "Motocicleta",
        "total": 45
      },
      {
        "tipo": "Bicicleta",
        "total": 20
      }
    ]
  },
  "message": "Estadísticas obtenidas exitosamente"
}
```

## Códigos de respuesta

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token de autenticación inválido
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: placa duplicada)
- `422 Unprocessable Entity`: Errores de validación
- `500 Internal Server Error`: Error interno del servidor

## Ejemplos de uso

### Registrar un vehículo
```bash
curl -X POST "http://localhost:3333/api/vehiculos-apartamento" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "apartamento_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "tipo_id": 1,
    "placa": "ABC123",
    "otro_tipo_descripcion": "Carro familiar"
  }'
```

### Obtener vehículos de un apartamento
```bash
curl -X GET "http://localhost:3333/api/vehiculos-apartamento/apartamento/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Actualizar un vehículo
```bash
curl -X PUT "http://localhost:3333/api/vehiculos-apartamento/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "XYZ789",
    "otro_tipo_descripcion": "Carro deportivo"
  }'
```
