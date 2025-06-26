# API de Unidades Residenciales - Documentación

## Configuración de Autenticación

Todas las rutas de unidades residenciales requieren autenticación. Debes incluir el token JWT en el header de autorización:

```
Authorization: Bearer tu_jwt_token_aqui
```

## Base URL

```
http://localhost:3333/unidades-residenciales
```

---

## 1. Crear Unidad Residencial

**Endpoint:** `POST /unidades-residenciales`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer tu_jwt_token_aqui
```

**Body JSON:**
```json
{
  "documentTypeId": 1,
  "document": "123456789",
  "name": "Conjunto Residencial Los Pinos",
  "address": "Calle 123 #45-67",
  "city": "Bogotá",
  "adminPhone": "+57 301 234 5678",
  "supportPhone": "+57 301 876 5432",
  "contactEmail": "admin@lospinos.com",
  "description": "Conjunto residencial de 5 torres con 200 apartamentos"
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Unidad residencial creada exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "logoUrl": null,
    "documentTypeId": 1,
    "document": "123456789",
    "name": "Conjunto Residencial Los Pinos",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "adminPhone": "+57 301 234 5678",
    "supportPhone": "+57 301 876 5432",
    "contactEmail": "admin@lospinos.com",
    "description": "Conjunto residencial de 5 torres con 200 apartamentos",
    "companyId": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-06-25T10:30:00.000Z",
    "updatedAt": "2025-06-25T10:30:00.000Z",
    "documentType": {
      "id": 1,
      "name": "NIT",
      "baseType": {
        "id": 1,
        "name": "Jurídica"
      }
    },
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Mi Empresa",
      "email": "empresa@example.com"
    }
  }
}
```

---

## 2. Listar Unidades Residenciales

**Endpoint:** `GET /unidades-residenciales`

**Headers:**
```
Authorization: Bearer tu_jwt_token_aqui
```

**Query Parameters (opcionales):**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `search`: Término de búsqueda (busca en nombre, documento, dirección, ciudad)

**Ejemplos:**
```
GET /unidades-residenciales
GET /unidades-residenciales?page=2&limit=5
GET /unidades-residenciales?search=Los Pinos
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Lista de unidades residenciales obtenida exitosamente",
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
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "logoUrl": "/uploads/unidades/unidad_550e8400_abc123.jpg",
        "documentTypeId": 1,
        "document": "123456789",
        "name": "Conjunto Residencial Los Pinos",
        "address": "Calle 123 #45-67",
        "city": "Bogotá",
        "adminPhone": "+57 301 234 5678",
        "supportPhone": "+57 301 876 5432",
        "contactEmail": "admin@lospinos.com",
        "description": "Conjunto residencial de 5 torres con 200 apartamentos",
        "companyId": "550e8400-e29b-41d4-a716-446655440001",
        "createdAt": "2025-06-25T10:30:00.000Z",
        "updatedAt": "2025-06-25T10:30:00.000Z",
        "documentType": {
          "id": 1,
          "name": "NIT",
          "baseType": {
            "id": 1,
            "name": "Jurídica"
          }
        },
        "company": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Mi Empresa",
          "email": "empresa@example.com"
        }
      }
    ]
  }
}
```

---

## 3. Obtener Unidad Residencial por ID

**Endpoint:** `GET /unidades-residenciales/:id`

**Headers:**
```
Authorization: Bearer tu_jwt_token_aqui
```

**Ejemplo:**
```
GET /unidades-residenciales/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Unidad residencial obtenida exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "logoUrl": "/uploads/unidades/unidad_550e8400_abc123.jpg",
    "documentTypeId": 1,
    "document": "123456789",
    "name": "Conjunto Residencial Los Pinos",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "adminPhone": "+57 301 234 5678",
    "supportPhone": "+57 301 876 5432",
    "contactEmail": "admin@lospinos.com",
    "description": "Conjunto residencial de 5 torres con 200 apartamentos",
    "companyId": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-06-25T10:30:00.000Z",
    "updatedAt": "2025-06-25T10:30:00.000Z",
    "documentType": {
      "id": 1,
      "name": "NIT",
      "baseType": {
        "id": 1,
        "name": "Jurídica"
      }
    },
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Mi Empresa",
      "email": "empresa@example.com"
    }
  }
}
```

---

## 4. Actualizar Unidad Residencial

**Endpoint:** `PUT /unidades-residenciales/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer tu_jwt_token_aqui
```

**Nota:** Todos los campos son opcionales. Solo envía los campos que quieres actualizar.

**Body JSON (ejemplo actualizando solo algunos campos):**
```json
{
  "name": "Conjunto Residencial Los Pinos - Torre A",
  "address": "Calle 123 #45-67 Torre A",
  "adminPhone": "+57 301 999 8888",
  "description": "Conjunto residencial renovado con nuevas amenidades"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Unidad residencial actualizada exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "logoUrl": "/uploads/unidades/unidad_550e8400_abc123.jpg",
    "documentTypeId": 1,
    "document": "123456789",
    "name": "Conjunto Residencial Los Pinos - Torre A",
    "address": "Calle 123 #45-67 Torre A",
    "city": "Bogotá",
    "adminPhone": "+57 301 999 8888",
    "supportPhone": "+57 301 876 5432",
    "contactEmail": "admin@lospinos.com",
    "description": "Conjunto residencial renovado con nuevas amenidades",
    "companyId": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-06-25T10:30:00.000Z",
    "updatedAt": "2025-06-25T11:45:00.000Z",
    "documentType": {
      "id": 1,
      "name": "NIT",
      "baseType": {
        "id": 1,
        "name": "Jurídica"
      }
    },
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Mi Empresa",
      "email": "empresa@example.com"
    }
  }
}
```

---

## 5. Eliminar Unidad Residencial

**Endpoint:** `DELETE /unidades-residenciales/:id`

**Headers:**
```
Authorization: Bearer tu_jwt_token_aqui
```

**Ejemplo:**
```
DELETE /unidades-residenciales/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Unidad residencial eliminada exitosamente"
}
```

---

## 6. Subir Logo de Unidad Residencial

**Endpoint:** `POST /unidades-residenciales/:id/logo`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer tu_jwt_token_aqui
```

**Body (Form Data):**
- `logo`: Archivo de imagen (JPG, JPEG, PNG, WEBP, máximo 5MB)

**Ejemplo con cURL:**
```bash
curl -X POST \
  http://localhost:3333/unidades-residenciales/550e8400-e29b-41d4-a716-446655440000/logo \
  -H "Authorization: Bearer tu_jwt_token_aqui" \
  -F "logo=@/ruta/a/tu/imagen.jpg"
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Logo de unidad residencial guardado exitosamente",
  "data": {
    "logo_url": "/uploads/unidades/unidad_550e8400_def456.jpg",
    "unidad_residencial": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "logoUrl": "/uploads/unidades/unidad_550e8400_def456.jpg",
      "documentTypeId": 1,
      "document": "123456789",
      "name": "Conjunto Residencial Los Pinos",
      "address": "Calle 123 #45-67",
      "city": "Bogotá",
      "adminPhone": "+57 301 234 5678",
      "supportPhone": "+57 301 876 5432",
      "contactEmail": "admin@lospinos.com",
      "description": "Conjunto residencial de 5 torres con 200 apartamentos",
      "companyId": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-06-25T10:30:00.000Z",
      "updatedAt": "2025-06-25T12:00:00.000Z"
    }
  }
}
```

---

## 7. Obtener Logo de Unidad Residencial

**Endpoint:** `GET /uploads/unidades/:filename`

**Nota:** Esta ruta no requiere autenticación y sirve directamente el archivo de imagen.

**Ejemplo:**
```
GET /uploads/unidades/unidad_550e8400_def456.jpg
```

**Respuesta:** Archivo de imagen

---

## Errores Comunes

### Error 401 - No Autenticado
```json
{
  "error": "Usuario no autenticado"
}
```

### Error 400 - Validación
```json
{
  "error": "Ya existe una unidad residencial con este número de documento"
}
```

### Error 404 - No Encontrado
```json
{
  "error": "Unidad residencial no encontrada"
}
```

### Error 400 - Empresa No Activa
```json
{
  "error": "La empresa no está activa"
}
```

---

## Validaciones de Campos

### Campos Requeridos (Crear):
- `documentTypeId`: Número entero
- `document`: String, máximo 50 caracteres
- `name`: String, máximo 255 caracteres
- `address`: String, máximo 500 caracteres
- `city`: String, máximo 100 caracteres
- `adminPhone`: String, máximo 20 caracteres
- `supportPhone`: String, máximo 20 caracteres
- `contactEmail`: String, formato email válido, máximo 255 caracteres

### Campos Opcionales:
- `description`: String, máximo 1000 caracteres

### Logo:
- Formatos permitidos: JPG, JPEG, PNG, WEBP
- Tamaño máximo: 5MB

---

## Ejemplo de Flujo Completo

### 1. Primero obtener el token de autenticación:
```bash
POST /login
{
  "identifier": "empresa@example.com",
  "password": "tu_password"
}
```

### 2. Crear unidad residencial:
```bash
POST /unidades-residenciales
Authorization: Bearer tu_token
{
  "documentTypeId": 1,
  "document": "123456789",
  "name": "Conjunto Los Pinos",
  "address": "Calle 123 #45-67",
  "city": "Bogotá",
  "adminPhone": "+57 301 234 5678",
  "supportPhone": "+57 301 876 5432",
  "contactEmail": "admin@lospinos.com"
}
```

### 3. Subir logo:
```bash
POST /unidades-residenciales/{id}/logo
Authorization: Bearer tu_token
Content-Type: multipart/form-data
[archivo de imagen]
```

### 4. Listar unidades:
```bash
GET /unidades-residenciales
Authorization: Bearer tu_token
```

¡Y eso es todo! La API está lista para usar desde el frontend.
