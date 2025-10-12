# Data Model: Create other pages

**Feature**: Create other pages  
**Date**: 2025-10-12  
**Related**: [plan.md](./plan.md) | [research.md](./research.md)

## Overview

This document defines the data model changes required for the "Create other pages" feature. The primary addition is the Property entity, which provides structured property management alongside the existing tag system. Additional changes include UserPreferences for settings management.

## Entity Relationship Diagram

```
User (existing)
  |
  |-- (1:many) --> RentEntry (existing, updated)
  |-- (1:many) --> ExpenseEntry (existing, updated)
  |-- (1:many) --> Tag (existing)
  |-- (1:many) --> Property (NEW)
  |-- (1:1) -----> UserPreferences (NEW)

Property (NEW)
  |
  |-- (1:many) --> RentEntry
  |-- (1:many) --> ExpenseEntry

RentEntry (existing, updated)
  |
  |-- (many:1) --> Property (optional)
  |-- (many:many) -> Tag (via RentEntryTag)

ExpenseEntry (existing, updated)
  |
  |-- (many:1) --> Property (optional)
  |-- (many:many) -> Tag (via ExpenseEntryTag)
```

## Entities

### 1. Property (NEW)

Represents a rental property with structured attributes.

**Fields**:
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK → User.id): Owner of the property
- `name` (String, required): Property name/identifier (e.g., "Beach House", "Downtown Apt 201")
- `address` (String, optional): Full address of the property
- `property_type` (String, optional): Type of property (apartment, house, condo, townhouse, etc.)
- `start_date` (Date, optional): Purchase date or lease start date
- `notes` (Text, optional): Additional notes about the property
- `created_at` (Timestamp): Creation timestamp
- `updated_at` (Timestamp): Last update timestamp

**Relationships**:
- Belongs to User (many-to-one)
- Has many RentEntries (one-to-many, optional)
- Has many ExpenseEntries (one-to-many, optional)

**Indexes**:
- Primary key on `id`
- Index on `user_id` (for queries)
- Composite index on `(user_id, name)` for uniqueness validation

**Constraints**:
- `user_id` NOT NULL (every property belongs to a user)
- `name` NOT NULL (every property must have a name)
- Unique constraint on `(user_id, name)` - user cannot have duplicate property names

**Validation Rules**:
- Name: 1-255 characters, required
- Address: 0-500 characters, optional
- Property type: if provided, must be one of: apartment, house, condo, townhouse, duplex, other
- Start date: if provided, must be valid date (not in future)
- Notes: 0-2000 characters, optional

**Business Rules**:
- Properties cannot be deleted if associated with entries (soft delete or reassignment required)
- Property names must be unique per user
- When property is deleted, associated entries' property_id is set to NULL

---

### 2. UserPreferences (NEW)

Stores user-specific application preferences and settings.

**Fields**:
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK → User.id, unique): Owner of preferences
- `currency_format` (String, default: "USD"): Preferred currency display format
- `date_format` (String, default: "MM/DD/YYYY"): Preferred date format
- `language` (String, default: "en"): Preferred language (for future i18n)
- `default_view` (String, default: "dashboard"): Default page on login
- `theme_preference` (String, optional): Explicit theme preference (light/dark/system)
- `preferences` (JSON, optional): Additional preferences as JSON object
- `created_at` (Timestamp): Creation timestamp
- `updated_at` (Timestamp): Last update timestamp

**Relationships**:
- Belongs to User (one-to-one)

**Indexes**:
- Primary key on `id`
- Unique index on `user_id`

**Constraints**:
- `user_id` NOT NULL and UNIQUE (one preference record per user)
- `currency_format` NOT NULL with default
- `date_format` NOT NULL with default
- `language` NOT NULL with default
- `default_view` NOT NULL with default

**Validation Rules**:
- Currency format: Must be valid currency code (ISO 4217) - e.g., USD, EUR, GBP, JPY
- Date format: Must be one of: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
- Language: Must be valid locale code - e.g., en, es, fr, de, ja
- Default view: Must be one of: dashboard, properties, reports, settings
- Theme preference: Must be one of: light, dark, system, or NULL

**Business Rules**:
- Created automatically when user registers (with defaults)
- Cannot be deleted (only updated)
- Invalid preferences fall back to defaults
- JSON preferences field allows extensibility without migrations

---

### 3. RentEntry (EXISTING, UPDATED)

**New Fields**:
- `property_id` (UUID, FK → Property.id, optional): Associated property

**Changes**:
- Add optional foreign key relationship to Property
- If property is deleted, property_id is set to NULL
- No other changes to existing fields

**Validation Rules**:
- Property must belong to the same user as the rent entry

---

### 4. ExpenseEntry (EXISTING, UPDATED)

**New Fields**:
- `property_id` (UUID, FK → Property.id, optional): Associated property

**Changes**:
- Add optional foreign key relationship to Property
- If property is deleted, property_id is set to NULL
- No other changes to existing fields

**Validation Rules**:
- Property must belong to the same user as the expense entry

---

### 5. User (EXISTING, UPDATED)

**New Fields**:
- `name` (String, optional): User's full name for display purposes

**New Relationships**:
- Has many Properties (one-to-many)
- Has one UserPreferences (one-to-one)

**Changes**:
- Add optional name field for profile customization
- Add relationships to Properties and UserPreferences

**Validation Rules**:
- Name: 0-255 characters, optional

**Business Rules**:
- Name can be set and updated through profile settings
- If name is not provided, email can be used as display name

---

## Prisma Schema

```prisma
// NEW: Property model
model Property {
  id            String         @id @default(uuid())
  user_id       String
  name          String
  address       String?
  property_type String?
  start_date    DateTime?      @db.Date
  notes         String?        @db.Text
  created_at    DateTime       @default(now())
  updated_at    DateTime       @updatedAt
  
  user           User           @relation(fields: [user_id], references: [id], onDelete: Cascade)
  rentEntries    RentEntry[]
  expenseEntries ExpenseEntry[]
  
  @@unique([user_id, name])
  @@index([user_id])
}

// NEW: UserPreferences model
model UserPreferences {
  id               String   @id @default(uuid())
  user_id          String   @unique
  currency_format  String   @default("USD")
  date_format      String   @default("MM/DD/YYYY")
  language         String   @default("en")
  default_view     String   @default("dashboard")
  theme_preference String?
  preferences      Json?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
  
  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
}

// UPDATED: User model (add name field and relationships)
model User {
  id               String            @id @default(uuid())
  email            String            @unique
  name             String?           // NEW
  password_hash    String
  created_at       DateTime          @default(now())
  updated_at       DateTime          @updatedAt
  
  rentEntries      RentEntry[]
  expenseEntries   ExpenseEntry[]
  tags             Tag[]
  properties       Property[]        // NEW
  preferences      UserPreferences?  // NEW
}

// UPDATED: RentEntry model (add property relationship)
model RentEntry {
  id          String   @id @default(uuid())
  user_id     String
  amount      Float
  booked_days Int
  platform    String
  start_date  DateTime @db.Date
  end_date    DateTime @db.Date
  property_id String?  // NEW (optional)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  user     User              @relation(fields: [user_id], references: [id])
  property Property?         @relation(fields: [property_id], references: [id], onDelete: SetNull)  // NEW
  tags     RentEntryTag[]
  
  @@index([property_id])  // NEW
}

// UPDATED: ExpenseEntry model (add property relationship)
model ExpenseEntry {
  id          String   @id @default(uuid())
  user_id     String
  amount      Float
  category    String
  description String?
  date        DateTime @db.Date
  property_id String?  // NEW (optional)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  user     User                @relation(fields: [user_id], references: [id])
  property Property?           @relation(fields: [property_id], references: [id], onDelete: SetNull)  // NEW
  tags     ExpenseEntryTag[]
  
  @@index([property_id])  // NEW
}

// EXISTING: Tag, RentEntryTag, ExpenseEntryTag (no changes)
model Tag {
  id              String            @id @default(uuid())
  user_id         String
  name            String
  created_at      DateTime          @default(now())
  updated_at      DateTime          @updatedAt
  user            User              @relation(fields: [user_id], references: [id])
  rentEntries     RentEntryTag[]
  expenseEntries  ExpenseEntryTag[]

  @@unique([user_id, name])
}

model RentEntryTag {
  rent_entry_id String
  tag_id        String
  rentEntry     RentEntry @relation(fields: [rent_entry_id], references: [id])
  tag           Tag       @relation(fields: [tag_id], references: [id])

  @@id([rent_entry_id, tag_id])
}

model ExpenseEntryTag {
  expense_entry_id String
  tag_id           String
  expenseEntry     ExpenseEntry @relation(fields: [expense_entry_id], references: [id])
  tag              Tag          @relation(fields: [tag_id], references: [id])

  @@id([expense_entry_id, tag_id])
}
```

## Migration Strategy

### Migration Steps

1. **Create Property table**
   - Add table with all columns
   - Add indexes
   - Add unique constraint on (user_id, name)

2. **Create UserPreferences table**
   - Add table with all columns
   - Add unique index on user_id

3. **Add property_id to RentEntry**
   - Add column as nullable
   - Add foreign key constraint with ON DELETE SET NULL
   - Add index on property_id

4. **Add property_id to ExpenseEntry**
   - Add column as nullable
   - Add foreign key constraint with ON DELETE SET NULL
   - Add index on property_id

5. **Create default preferences for existing users**
   - Run data migration to create UserPreferences for all existing users

### Migration SQL (PostgreSQL)

```sql
-- Create Property table
CREATE TABLE "Property" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT,
  "property_type" TEXT,
  "start_date" DATE,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Property_user_id_name_key" ON "Property"("user_id", "name");
CREATE INDEX "Property_user_id_idx" ON "Property"("user_id");

-- Create UserPreferences table
CREATE TABLE "UserPreferences" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "currency_format" TEXT NOT NULL DEFAULT 'USD',
  "date_format" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
  "language" TEXT NOT NULL DEFAULT 'en',
  "default_view" TEXT NOT NULL DEFAULT 'dashboard',
  "theme_preference" TEXT,
  "preferences" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "UserPreferences_user_id_key" ON "UserPreferences"("user_id");

-- Add property_id to RentEntry
ALTER TABLE "RentEntry" ADD COLUMN "property_id" TEXT;
ALTER TABLE "RentEntry" ADD CONSTRAINT "RentEntry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "RentEntry_property_id_idx" ON "RentEntry"("property_id");

-- Add property_id to ExpenseEntry
ALTER TABLE "ExpenseEntry" ADD COLUMN "property_id" TEXT;
ALTER TABLE "ExpenseEntry" ADD CONSTRAINT "ExpenseEntry_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "ExpenseEntry_property_id_idx" ON "ExpenseEntry"("property_id");

-- Add name field to User table
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- Create default preferences for existing users
INSERT INTO "UserPreferences" ("id", "user_id", "currency_format", "date_format", "language", "default_view", "updated_at")
SELECT gen_random_uuid(), "id", 'USD', 'MM/DD/YYYY', 'en', 'dashboard', CURRENT_TIMESTAMP
FROM "User"
WHERE "id" NOT IN (SELECT "user_id" FROM "UserPreferences");
```

### Rollback SQL

```sql
-- Remove foreign keys first
ALTER TABLE "RentEntry" DROP CONSTRAINT IF EXISTS "RentEntry_property_id_fkey";
ALTER TABLE "ExpenseEntry" DROP CONSTRAINT IF EXISTS "ExpenseEntry_property_id_fkey";

-- Drop columns
ALTER TABLE "RentEntry" DROP COLUMN IF EXISTS "property_id";
ALTER TABLE "ExpenseEntry" DROP COLUMN IF EXISTS "property_id";
ALTER TABLE "User" DROP COLUMN IF EXISTS "name";

-- Drop tables
DROP TABLE IF EXISTS "UserPreferences";
DROP TABLE IF EXISTS "Property";
```

## Data Access Patterns

### Common Queries

**1. Get all properties for a user (with entry counts)**
```typescript
const properties = await prisma.property.findMany({
  where: { user_id: userId },
  include: {
    _count: {
      select: {
        rentEntries: true,
        expenseEntries: true
      }
    }
  },
  orderBy: { name: 'asc' }
});
```

**2. Get entries for a specific property**
```typescript
const entries = await prisma.rentEntry.findMany({
  where: {
    user_id: userId,
    property_id: propertyId
  },
  include: {
    property: true,
    tags: { include: { tag: true } }
  }
});
```

**3. Get user preferences**
```typescript
const preferences = await prisma.userPreferences.findUnique({
  where: { user_id: userId }
});
```

**4. Get properties with pagination**
```typescript
const properties = await prisma.property.findMany({
  where: { user_id: userId },
  take: 50,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { name: 'asc' }
});
```

**5. Search properties by name**
```typescript
const properties = await prisma.property.findMany({
  where: {
    user_id: userId,
    name: { contains: searchTerm, mode: 'insensitive' }
  }
});
```

## Performance Considerations

### Indexes
- All foreign keys are indexed
- Composite unique indexes for user-scoped uniqueness
- user_id indexed on all user-owned entities

### Query Optimization
- Use `select` to limit returned fields
- Use `include` judiciously (avoid N+1 queries)
- Implement pagination for large lists
- Use `_count` for aggregations instead of loading all relations

### Scaling
- Current design supports 1000+ properties per user
- Indexes ensure fast lookups and joins
- If needed, can add caching layer
- Property search can be enhanced with full-text search later

## Data Integrity

### Constraints
- Cascade deletes: When user deleted, all properties and preferences deleted
- Set NULL on property delete: Entries remain but lose property association
- Unique constraints prevent duplicate property names per user
- Foreign key constraints maintain referential integrity

### Validation
- Application-level validation using Zod schemas
- Database-level constraints as safety net
- User-scoped data isolation enforced in queries

## Backup and Recovery

### Considerations
- New columns are nullable (safe for rollback)
- No data loss on rollback (property data is new)
- Existing entries unaffected by property addition
- Test migration on staging before production
- Take database backup before production migration

## Conclusion

The data model introduces two new entities (Property, UserPreferences) and extends existing entities (RentEntry, ExpenseEntry) with optional property relationships. All changes are backward compatible and follow established patterns. Ready for API contract definition.

