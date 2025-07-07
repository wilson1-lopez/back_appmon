# Ejemplos de Uso de la API de Usuarios

## Crear Usuario para Empresa

**Request:**
```
POST /users/company/users
Authorization: Bearer tu_jwt_token_aqui
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@empresa.com",
  "username": "juanperez",
  "password": "Password123!",
  "roleId": 2
}
```

**Respuesta esperada:**
```json
{
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@empresa.com",
    "username": "juanperez",
    "isActive": true,
    "companyId": "550e8400-e29b-41d4-a716-446655440001",
    "unidadResidencialId": null,
    "createdAt": "2025-06-28T12:00:00.000Z",
    "updatedAt": "2025-06-28T12:00:00.000Z",
    "roles": [
      {
        "id": 2,
        "name": "Usuario",
        "description": "Acceso básico solo lectura"
      }
    ]
  }
}
```

---

## Crear Usuario para Unidad Residencial

**Request:**
```
POST /users/unidad-residencial/5/users
Authorization: Bearer tu_jwt_token_aqui
Content-Type: application/json

{
  "firstName": "Ana",
  "lastName": "Gómez",
  "email": "ana.gomez@residencial.com",
  "username": "anagomez",
  "password": "Password123!",
  "roleId": 3
}
```

**Respuesta esperada:**
```json
{
  "message": "Usuario creado exitosamente en la unidad residencial",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "firstName": "Ana",
    "lastName": "Gómez",
    "email": "ana.gomez@residencial.com",
    "username": "anagomez",
    "isActive": true,
    "companyId": null,
    "unidadResidencialId": 5,
    "createdAt": "2025-06-28T12:10:00.000Z",
    "updatedAt": "2025-06-28T12:10:00.000Z",
    "roles": [
      {
        "id": 3,
        "name": "Residente",
        "description": "Acceso para residentes"
      }
    ]
  }
}
```

---

## Errores Comunes

**Usuario no autenticado:**
```json
{
  "error": "Usuario no autenticado"
}
```

**Correo ya registrado en la empresa:**
```json
{
  "error": "El correo ya está registrado en la empresa"
}
```

**Correo ya registrado en la unidad residencial:**
```json
{
  "error": "El correo ya está registrado en la unidad residencial"
}
```

**Empresa no encontrada:**
```json
{
  "error": "Empresa no encontrada"
}
```
