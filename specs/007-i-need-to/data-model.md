# Data Model: Enhanced Platform Support

**Date**: 2025-01-27  
**Feature**: Enhanced Platform Support with Russian Markets

## Entities

### CustomPlatform

**Purpose**: Store user-created platform entries for personalized platform management

**Fields**:
- `id` (String, UUID, Primary Key)
- `user_id` (String, Foreign Key to User.id)
- `name` (String, 2-100 characters, required)
- `created_at` (DateTime, auto-generated)
- `updated_at` (DateTime, auto-updated)
- `usage_count` (Integer, default 0) - tracks how many rent entries use this platform

**Validation Rules**:
- `name`: Required, 2-100 characters, unique per user
- `user_id`: Required, must reference existing user
- International characters and special symbols allowed in name

**Relationships**:
- Belongs to User (many-to-one)
- Referenced by RentEntry (one-to-many, optional)

**State Transitions**:
- Created → Active (immediate)
- Active → Deleted (only if no associated rent entries)

### Platform (Updated)

**Purpose**: Represents predefined rental platforms (Russian and others)

**Fields**:
- `id` (String, unique identifier)
- `name` (String, display name)
- `url` (String, platform website)
- `region` (String, region code: 'ru', 'us', 'eu', etc.)
- `icon` (String, optional icon path)

**Validation Rules**:
- `id`: Required, unique across all platforms
- `name`: Required, non-empty string
- `region`: Required, valid region code

### RentEntry (Existing, Updated)

**Purpose**: Track rental income entries with platform information

**Fields** (existing + updates):
- All existing fields remain unchanged
- `platform` (String) - can reference either predefined Platform.id or CustomPlatform.id
- `custom_platform_name` (String, optional) - stores custom platform name for "Other" entries

**Validation Rules**:
- If `platform` is "other", `custom_platform_name` is required
- If `platform` references CustomPlatform, `custom_platform_name` should be empty

## Database Schema Changes

### New Table: CustomPlatform

```sql
CREATE TABLE "CustomPlatform" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usage_count" INTEGER NOT NULL DEFAULT 0,
  
  CONSTRAINT "CustomPlatform_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "CustomPlatform_user_id_name_key" UNIQUE ("user_id", "name")
);
```

### Updated Table: RentEntry

```sql
-- Add new column for custom platform name
ALTER TABLE "RentEntry" ADD COLUMN "custom_platform_name" TEXT;

-- Add constraint for custom platform validation
ALTER TABLE "RentEntry" ADD CONSTRAINT "RentEntry_custom_platform_check" 
  CHECK (
    (platform = 'other' AND custom_platform_name IS NOT NULL) OR
    (platform != 'other' AND custom_platform_name IS NULL)
  );
```

## Data Migration Strategy

### Existing Data Handling

1. **Existing "Other" entries**: Keep as-is with `custom_platform_name` set to NULL
2. **Existing platform entries**: No changes required
3. **Backward compatibility**: All existing queries continue to work

### Migration Script

```sql
-- Update existing "Other" entries to have empty custom_platform_name
UPDATE "RentEntry" 
SET "custom_platform_name" = '' 
WHERE "platform" = 'other' AND "custom_platform_name" IS NULL;
```

## Indexes

```sql
-- Index for user-specific custom platform queries
CREATE INDEX "CustomPlatform_user_id_idx" ON "CustomPlatform"("user_id");

-- Index for platform name searches
CREATE INDEX "CustomPlatform_name_idx" ON "CustomPlatform"("name");

-- Index for rent entry platform queries
CREATE INDEX "RentEntry_platform_idx" ON "RentEntry"("platform");
```

## Constraints

1. **Unique constraint**: `(user_id, name)` on CustomPlatform prevents duplicate platform names per user
2. **Foreign key constraint**: CustomPlatform.user_id references User.id with CASCADE delete
3. **Check constraint**: RentEntry platform validation ensures data consistency
4. **Length constraints**: CustomPlatform.name between 2-100 characters
