# API de Tipos de Vehículos

Esta API permite gestionar los tipos de vehículos en el sistema.

## Endpoints Disponibles

### 1. Obtener todos los tipos de vehículos
**GET** `/api/tipos-vehiculos`

#### Respuesta exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo": "AUTO",
      "nombre": "Automóvil",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "codigo": "MOTO",
      "nombre": "Motocicleta",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "message": "Tipos de vehículos obtenidos exitosamente"
}
```

### 2. Obtener un tipo de vehículo por ID
**GET** `/api/tipos-vehiculos/:id`

#### Parámetros
- `id`: ID del tipo de vehículo

#### Respuesta exitosa (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "codigo": "AUTO",
    "nombre": "Automóvil",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  "message": "Tipo de vehículo obtenido exitosamente"
}
```

#### Respuesta de error (404)
```json
{
  "success": false,
  "message": "Tipo de vehículo no encontrado",
  "error": "Row not found"
}
```

### 3. Crear un nuevo tipo de vehículo
**POST** `/api/tipos-vehiculos`

#### Cuerpo de la solicitud
```json
{
  "codigo": "SCOOTER",
  "nombre": "Scooter"
}
```

#### Validaciones
- `codigo`: requerido, string, 1-10 caracteres
- `nombre`: requerido, string, 1-100 caracteres

#### Respuesta exitosa (201)
```json
{
  "success": true,
  "data": {
    "id": 9,
    "codigo": "SCOOTER",
    "nombre": "Scooter",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  "message": "Tipo de vehículo creado exitosamente"
}
```

### 4. Actualizar un tipo de vehículo
**PUT** `/api/tipos-vehiculos/:id`

#### Parámetros
- `id`: ID del tipo de vehículo a actualizar

#### Cuerpo de la solicitud
```json
{
  "codigo": "SCOOTER_E",
  "nombre": "Scooter Eléctrico"
}
```

#### Validaciones
- `codigo`: opcional, string, 1-10 caracteres
- `nombre`: opcional, string, 1-100 caracteres

#### Respuesta exitosa (200)
```json
{
  "success": true,
  "data": {
    "id": 9,
    "codigo": "SCOOTER_E",
    "nombre": "Scooter Eléctrico",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  "message": "Tipo de vehículo actualizado exitosamente"
}
```

### 5. Eliminar un tipo de vehículo
**DELETE** `/api/tipos-vehiculos/:id`

#### Parámetros
- `id`: ID del tipo de vehículo a eliminar

#### Respuesta exitosa (200)
```json
{
  "success": true,
  "data": {
    "message": "Tipo de vehículo eliminado exitosamente"
  },
  "message": "Tipo de vehículo eliminado exitosamente"
}
```

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Ejemplos de Uso

### Obtener todos los tipos de vehículos
```bash
curl -X GET http://localhost:3333/api/tipos-vehiculos
```

### Crear un nuevo tipo de vehículo
```bash
curl -X POST http://localhost:3333/api/tipos-vehiculos \
  -H "Content-Type: application/json" \
  -d '{"codigo": "QUAD", "nombre": "Cuatrimoto"}'
```

### Actualizar un tipo de vehículo
```bash
curl -X PUT http://localhost:3333/api/tipos-vehiculos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Automóvil Particular"}'
```

### Eliminar un tipo de vehículo
```bash
curl -X DELETE http://localhost:3333/api/tipos-vehiculos/1
```
