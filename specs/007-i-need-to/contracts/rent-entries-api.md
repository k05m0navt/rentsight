# API Contracts: Rent Entries (Updated)

**Date**: 2025-01-27  
**Feature**: Enhanced Platform Support with Russian Markets

## Base URL
```
/api/rent_entries
```

## Authentication
All endpoints require user authentication via Supabase session.

## Updated Endpoints

### POST /api/rent_entries

**Purpose**: Create a new rent entry with enhanced platform support

**Request**:
```http
POST /api/rent_entries
Authorization: Bearer <supabase_token>
Content-Type: application/json

{
  "amount": 150.00,
  "booked_days": 3,
  "platform": "avito",
  "start_date": "2025-01-27",
  "end_date": "2025-01-30",
  "property_id": "uuid-456",
  "custom_platform_name": null
}
```

**Platform Options**:
- Predefined platforms: `"avito"`, `"cian"`, `"sutochno"`, `"domclick"`, `"yandex-realty"`, etc.
- Custom platforms: Use custom platform ID from `/api/platforms/custom`
- Other: `"other"` with required `custom_platform_name`

**Validation**:
- `platform`: Required, must be valid predefined platform ID, custom platform ID, or "other"
- `custom_platform_name`: Required if `platform` is "other", must be 2-100 characters
- All other existing validation rules apply

**Response**:
```json
{
  "id": "uuid-789",
  "amount": 150.00,
  "booked_days": 3,
  "platform": "avito",
  "custom_platform_name": null,
  "start_date": "2025-01-27",
  "end_date": "2025-01-30",
  "property_id": "uuid-456",
  "created_at": "2025-01-27T10:00:00Z"
}
```

**Status Codes**:
- `201 Created`: Rent entry created successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

### PUT /api/rent_entries/{id}

**Purpose**: Update an existing rent entry with enhanced platform support

**Request**:
```http
PUT /api/rent_entries/uuid-789
Authorization: Bearer <supabase_token>
Content-Type: application/json

{
  "platform": "other",
  "custom_platform_name": "My Custom Platform"
}
```

**Validation**:
- Same platform validation as POST
- `id`: Must exist and belong to authenticated user

**Response**:
```json
{
  "id": "uuid-789",
  "amount": 150.00,
  "booked_days": 3,
  "platform": "other",
  "custom_platform_name": "My Custom Platform",
  "start_date": "2025-01-27",
  "end_date": "2025-01-30",
  "property_id": "uuid-456",
  "updated_at": "2025-01-27T11:00:00Z"
}
```

**Status Codes**:
- `200 OK`: Rent entry updated successfully
- `400 Bad Request`: Validation error
- `404 Not Found`: Rent entry not found or doesn't belong to user
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

### GET /api/rent_entries

**Purpose**: Get rent entries with enhanced platform information

**Request**:
```http
GET /api/rent_entries
Authorization: Bearer <supabase_token>
```

**Response**:
```json
{
  "entries": [
    {
      "id": "uuid-789",
      "amount": 150.00,
      "booked_days": 3,
      "platform": "avito",
      "custom_platform_name": null,
      "platform_display_name": "Avito",
      "start_date": "2025-01-27",
      "end_date": "2025-01-30",
      "property_id": "uuid-456",
      "created_at": "2025-01-27T10:00:00Z"
    },
    {
      "id": "uuid-790",
      "amount": 200.00,
      "booked_days": 2,
      "platform": "other",
      "custom_platform_name": "My Custom Platform",
      "platform_display_name": "My Custom Platform",
      "start_date": "2025-01-25",
      "end_date": "2025-01-27",
      "property_id": "uuid-456",
      "created_at": "2025-01-25T10:00:00Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Success
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Server error

## Platform Display Logic

The `platform_display_name` field is computed as follows:

1. If `platform` is a predefined platform ID: Use predefined platform name
2. If `platform` is a custom platform ID: Use custom platform name
3. If `platform` is "other": Use `custom_platform_name`

## Backward Compatibility

- Existing rent entries with `platform: "other"` and `custom_platform_name: null` continue to work
- API responses include `platform_display_name` for consistent display across all platform types
- No breaking changes to existing API contracts

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

## Common Error Codes

- `INVALID_PLATFORM`: Platform ID is not valid
- `MISSING_CUSTOM_PLATFORM_NAME`: Custom platform name required when platform is "other"
- `CUSTOM_PLATFORM_NOT_FOUND`: Referenced custom platform doesn't exist
- `CUSTOM_PLATFORM_NAME_TOO_SHORT`: Custom platform name must be at least 2 characters
- `CUSTOM_PLATFORM_NAME_TOO_LONG`: Custom platform name must be at most 100 characters
