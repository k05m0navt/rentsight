# API Contracts: Platform Management

**Date**: 2025-01-27  
**Feature**: Enhanced Platform Support with Russian Markets

## Base URL
```
/api/platforms
```

## Authentication
All endpoints require user authentication via Supabase session.

## Endpoints

### GET /api/platforms

**Purpose**: Get all available platforms (predefined + user's custom platforms)

**Request**:
```http
GET /api/platforms
Authorization: Bearer <supabase_token>
```

**Response**:
```json
{
  "predefined": [
    {
      "id": "avito",
      "name": "Avito",
      "url": "https://www.avito.ru",
      "region": "ru"
    },
    {
      "id": "cian",
      "name": "CIAN",
      "url": "https://www.cian.ru",
      "region": "ru"
    }
  ],
  "custom": [
    {
      "id": "uuid-123",
      "name": "My Custom Platform",
      "created_at": "2025-01-27T10:00:00Z",
      "usage_count": 5
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Success
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

### POST /api/platforms/custom

**Purpose**: Create a new custom platform

**Request**:
```http
POST /api/platforms/custom
Authorization: Bearer <supabase_token>
Content-Type: application/json

{
  "name": "My Custom Platform"
}
```

**Validation**:
- `name`: Required, 2-100 characters, unique per user

**Response**:
```json
{
  "id": "uuid-123",
  "name": "My Custom Platform",
  "created_at": "2025-01-27T10:00:00Z",
  "usage_count": 0
}
```

**Status Codes**:
- `201 Created`: Platform created successfully
- `400 Bad Request`: Validation error
- `409 Conflict`: Platform name already exists for user
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

### PUT /api/platforms/custom/{id}

**Purpose**: Update a custom platform

**Request**:
```http
PUT /api/platforms/custom/uuid-123
Authorization: Bearer <supabase_token>
Content-Type: application/json

{
  "name": "Updated Platform Name"
}
```

**Validation**:
- `name`: Required, 2-100 characters, unique per user
- `id`: Must exist and belong to authenticated user

**Response**:
```json
{
  "id": "uuid-123",
  "name": "Updated Platform Name",
  "created_at": "2025-01-27T10:00:00Z",
  "updated_at": "2025-01-27T11:00:00Z",
  "usage_count": 5
}
```

**Status Codes**:
- `200 OK`: Platform updated successfully
- `400 Bad Request`: Validation error
- `404 Not Found`: Platform not found or doesn't belong to user
- `409 Conflict`: Platform name already exists for user
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

### DELETE /api/platforms/custom/{id}

**Purpose**: Delete a custom platform

**Request**:
```http
DELETE /api/platforms/custom/uuid-123
Authorization: Bearer <supabase_token>
```

**Validation**:
- `id`: Must exist and belong to authenticated user
- Platform must not have associated rent entries

**Response**:
```json
{
  "message": "Platform deleted successfully"
}
```

**Status Codes**:
- `200 OK`: Platform deleted successfully
- `400 Bad Request`: Platform has associated rent entries
- `404 Not Found`: Platform not found or doesn't belong to user
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

### GET /api/platforms/custom/{id}/usage

**Purpose**: Check if a custom platform has associated rent entries

**Request**:
```http
GET /api/platforms/custom/uuid-123/usage
Authorization: Bearer <supabase_token>
```

**Response**:
```json
{
  "has_entries": true,
  "entry_count": 5,
  "message": "Platform has 5 associated rent entries"
}
```

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Platform not found or doesn't belong to user
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
```

## Rate Limiting

- Create/Update/Delete operations: 10 requests per minute per user
- Read operations: 100 requests per minute per user

## Caching

- Platform lists are cached for 5 minutes
- Custom platform changes invalidate cache immediately
