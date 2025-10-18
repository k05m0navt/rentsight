# Data Model: Enhanced UX/UI Experience

**Feature**: 006-make-the-ux  
**Date**: October 12, 2025  
**Status**: Complete

## Overview

This document defines the data model changes required for the UX/UI enhancement feature. Most changes are additions to existing models to support user preferences, regional settings, and cache metadata.

## Schema Changes

### 1. User Preferences Extension

**Purpose**: Store user UI preferences for theme, regional settings, and motion preferences

**Existing Model**: `User` (in Prisma schema)

**New Model**: `UserPreference`

```prisma
model UserPreference {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Theme preferences
  theme     String   @default("system") // "light" | "dark" | "system"
  
  // Motion preferences
  reducedMotion Boolean @default(false)
  
  // Regional preferences
  currency       String   @default("USD") // "USD" | "EUR" | "RUB" | etc
  dateFormat     String   @default("MM/DD/YYYY") // "MM/DD/YYYY" | "DD.MM.YYYY"
  numberFormat   String   @default("en-US") // "en-US" | "ru-RU"
  
  // Platform preferences (array of platform IDs)
  preferredPlatforms String[] @default([])
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@map("user_preferences")
}

// Update User model
model User {
  id          String          @id @default(cuid())
  // ... existing fields ...
  preference  UserPreference?
  
  @@map("users")
}
```

**Validation Rules**:
- `theme`: Must be one of "light", "dark", "system"
- `currency`: Must be valid ISO 4217 currency code (USD, EUR, RUB, etc.)
- `dateFormat`: Must be valid format string
- `preferredPlatforms`: Array of platform IDs from regional config
- One preference record per user (enforced by @unique on userId)

**State Transitions**:
- Created: On first user login (default values)
- Updated: When user changes any preference
- Deleted: When user is deleted (cascade)

---

### 2. Cache Metadata (Client-Side)

**Purpose**: Track cache entries, expiration, and usage for client-side caching

**Storage**: Browser localStorage (not in database)

**TypeScript Interface**:

```typescript
// types/cache.ts

export interface CacheEntry<T = unknown> {
  /** Unique cache key (namespaced) */
  key: string;
  
  /** Cached data (generic type) */
  data: T;
  
  /** Timestamp when cached (Unix milliseconds) */
  timestamp: number;
  
  /** Expiration timestamp (Unix milliseconds) */
  expiresAt: number;
  
  /** Number of times accessed */
  hitCount?: number;
  
  /** Last access timestamp */
  lastAccess?: number;
  
  /** Version for cache busting */
  version?: string;
}

export interface CacheMetadata {
  /** Total entries in cache */
  totalEntries: number;
  
  /** Total size in bytes (approximate) */
  totalSize: number;
  
  /** Cache hit rate (0-1) */
  hitRate: number;
  
  /** Last cleanup timestamp */
  lastCleanup: number;
}

// localStorage structure
// Key: "cache:dashboard"
// Value: JSON.stringify(CacheEntry)
```

**Validation Rules**:
- `expiresAt` must be greater than `timestamp`
- `key` must follow pattern: "cache:{resource}"
- Maximum 50 entries per user (LRU eviction)
- Maximum 5MB total cache size

**State Transitions**:
- Created: When data is cached (set)
- Accessed: When data is retrieved (get)
- Expired: When expiresAt < Date.now()
- Evicted: When cache limit reached (LRU)
- Invalidated: When related data changes (write operation)

---

### 3. Tag Model Enhancement

**Purpose**: Support cascade deletion tracking and usage counts

**Existing Model**: `Tag`

**Changes**: No schema changes needed, but add computed fields in service layer

```prisma
// Existing Tag model (NO CHANGES)
model Tag {
  id     String  @id @default(cuid())
  name   String
  color  String?
  userId String
  user   User    @relation(fields: [userId], references: [id])
  
  // Relations (used for cascade deletion)
  properties     Property[]     @relation("PropertyTags")
  rentEntries    RentEntry[]    @relation("RentEntryTags")
  expenseEntries ExpenseEntry[] @relation("ExpenseEntryTags")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, name])
  @@map("tags")
}
```

**Service Layer Computed Fields**:

```typescript
// services/tagService.ts

export interface TagWithUsage extends Tag {
  _count: {
    properties: number;
    rentEntries: number;
    expenseEntries: number;
  };
  totalUsage: number; // sum of all counts
}

export async function getTagWithUsage(tagId: string): Promise<TagWithUsage> {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      _count: {
        select: {
          properties: true,
          rentEntries: true,
          expenseEntries: true,
        }
      }
    }
  });
  
  return {
    ...tag,
    totalUsage: tag._count.properties + 
                tag._count.rentEntries + 
                tag._count.expenseEntries
  };
}
```

**Validation Rules**:
- Tag cannot be deleted without confirmation if `totalUsage > 0`
- Cascade deletion must be atomic (database transaction)
- All associated records must be updated before tag deletion

---

### 4. Regional Configuration (Static Data)

**Purpose**: Define available currencies, platforms, and formatting rules

**Storage**: TypeScript configuration file (not in database)

**TypeScript Types**:

```typescript
// types/regional.ts

export interface Currency {
  code: string;        // ISO 4217 code
  symbol: string;      // Display symbol
  name: string;        // Full name
  format: (amount: number) => string; // Formatting function
}

export interface Platform {
  id: string;          // Unique identifier
  name: string;        // Display name
  url: string;         // Platform URL
  region: string;      // Region code (ru, us, eu)
  icon?: string;       // Optional icon path
}

export interface DateFormatConfig {
  locale: string;      // Locale code (en-US, ru-RU)
  format: string;      // Display format (MM/DD/YYYY, DD.MM.YYYY)
  parse: (date: string) => Date; // Parsing function
}

export interface RegionalConfig {
  currencies: Record<string, Currency>;
  platforms: Record<string, Platform[]>;
  dateFormats: Record<string, DateFormatConfig>;
}
```

**No Database Changes**: This is static configuration loaded from code

---

## Migration Scripts

### Migration 1: Create UserPreference Table

```sql
-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "numberFormat" TEXT NOT NULL DEFAULT 'en-US',
    "preferredPlatforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "user_preferences_userId_idx" ON "user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Migration 2: Seed Default Preferences

```typescript
// prisma/seed-default-preferences.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDefaultPreferences() {
  // Get all users without preferences
  const users = await prisma.user.findMany({
    where: {
      preference: null
    }
  });
  
  // Create default preferences for each user
  for (const user of users) {
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        theme: 'system',
        reducedMotion: false,
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
        preferredPlatforms: [],
      }
    });
  }
  
  console.log(`Created default preferences for ${users.length} users`);
}

seedDefaultPreferences()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Entity Relationships

```
User (1) ─────────── (1) UserPreference
  │
  ├─── (1:N) Tag
  │      │
  │      ├─── (N:M) Property
  │      ├─── (N:M) RentEntry
  │      └─── (N:M) ExpenseEntry
  │
  ├─── (1:N) Property
  ├─── (1:N) RentEntry
  └─── (1:N) ExpenseEntry

[Client-Side Only]
CacheEntry (localStorage)
  - Not related to database models
  - Managed by cacheService
```

---

## Data Integrity Rules

### UserPreference
1. **Referential Integrity**: UserPreference.userId MUST reference valid User.id
2. **Uniqueness**: One preference per user (enforced by unique constraint)
3. **Cascade**: Delete preference when user is deleted
4. **Defaults**: All fields have sensible defaults for new users

### Cache
1. **Expiration**: Cached data MUST NOT be served if expired
2. **Size Limits**: Total cache size MUST NOT exceed 5MB
3. **Count Limits**: MUST NOT store more than 50 entries (LRU eviction)
4. **Invalidation**: Cache MUST be invalidated after write operations

### Tag Cascade Deletion
1. **Atomicity**: All operations in cascade deletion MUST succeed or all fail
2. **Confirmation**: User MUST confirm deletion if tag is in use
3. **Audit**: Tag deletions SHOULD be logged for audit trail
4. **Ordering**: Remove tag from relations BEFORE deleting tag record

---

## Query Patterns

### Get User Preferences

```typescript
// Optimized query with user
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    preference: true // Include preferences in single query
  }
});

// Access preferences
const theme = user.preference?.theme ?? 'system';
const currency = user.preference?.currency ?? 'USD';
```

### Update Preferences

```typescript
// Upsert pattern (create if not exists, update if exists)
await prisma.userPreference.upsert({
  where: { userId: userId },
  create: {
    userId: userId,
    theme: 'dark',
    currency: 'RUB',
  },
  update: {
    theme: 'dark',
    currency: 'RUB',
  }
});
```

### Tag with Usage Counts

```typescript
// Single query with counts
const tag = await prisma.tag.findUnique({
  where: { id: tagId },
  include: {
    _count: {
      select: {
        properties: true,
        rentEntries: true,
        expenseEntries: true,
      }
    }
  }
});

const isInUse = (tag._count.properties + 
                 tag._count.rentEntries + 
                 tag._count.expenseEntries) > 0;
```

### Cascade Delete Tag

```typescript
// Transaction ensures atomicity
await prisma.$transaction(async (tx) => {
  // Remove tag from all properties
  await tx.property.updateMany({
    where: {
      tags: {
        some: { id: tagId }
      }
    },
    data: {
      tags: {
        disconnect: { id: tagId }
      }
    }
  });
  
  // Remove tag from all rent entries
  await tx.rentEntry.updateMany({
    where: {
      tags: {
        some: { id: tagId }
      }
    },
    data: {
      tags: {
        disconnect: { id: tagId }
      }
    }
  });
  
  // Remove tag from all expense entries
  await tx.expenseEntry.updateMany({
    where: {
      tags: {
        some: { id: tagId }
      }
    },
    data: {
      tags: {
        disconnect: { id: tagId }
      }
    }
  });
  
  // Delete the tag
  await tx.tag.delete({
    where: { id: tagId }
  });
});
```

---

## Performance Considerations

1. **Indexes**: UserPreference has index on userId for fast lookups
2. **Caching**: User preferences should be cached client-side (rarely change)
3. **Lazy Loading**: Only load preference when needed (use `include` selectively)
4. **Batch Operations**: Use transactions for cascade deletions to minimize DB round-trips
5. **Cache Strategy**: Preference changes should invalidate client cache

---

## Testing Strategy

### Unit Tests (Prisma Operations)
- Create user preference with valid data
- Upsert preference (create + update)
- Cascade delete when user is deleted
- Query user with preferences included

### Integration Tests
- Tag deletion with cascade (transaction)
- Cache invalidation after preference update
- Regional formatting with different currencies

### E2E Tests
- User changes theme preference → persisted across sessions
- User changes currency → amounts formatted correctly
- User deletes tag with associations → confirmation shown
- Tag deletion confirmed → all associations removed

---

## Rollback Plan

If migration causes issues:

1. **Rollback UserPreference Migration**:
```sql
DROP INDEX "user_preferences_userId_idx";
DROP INDEX "user_preferences_userId_key";
DROP TABLE "user_preferences" CASCADE;
```

2. **Remove Preference from User Model** (Prisma schema)
3. **Deploy Previous Code Version** (preferences default to system theme)
4. **Clear Client-Side Caches** (localStorage.clear())

---

## Summary

### New Tables
- `user_preferences`: Stores user UI and regional preferences

### Modified Tables
- `users`: Add relation to UserPreference (no column changes)

### Client-Side Only
- `CacheEntry`: localStorage structure for client cache
- `RegionalConfig`: TypeScript configuration (no DB storage)

### Service Layer Additions
- Tag usage count computation
- Cascade deletion transaction logic
- Cache invalidation orchestration

