# Ejemplo de creación de usuario para una unidad residencial (UUID)

**Request:**
```
POST /users/unidad-residencial/9aa96ab5-f65f-440d-a573-cf25e0bc534e/users
Authorization: Bearer tu_jwt_token_aqui
Content-Type: application/json

{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "email": "carlos.ramirez@residencial.com",
  "username": "carlosramirez",
  "password": "Password123!",
  "roleId": 3
}
```

**Respuesta esperada:**
```json
{
  "message": "Usuario creado exitosamente en la unidad residencial",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "firstName": "Carlos",
    "lastName": "Ramírez",
    "email": "carlos.ramirez@residencial.com",
    "username": "carlosramirez",
    "isActive": true,
    "companyId": null,
    "unidadResidencialId": "9aa96ab5-f65f-440d-a573-cf25e0bc534e",
    "createdAt": "2025-06-28T12:20:00.000Z",
    "updatedAt": "2025-06-28T12:20:00.000Z",
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
