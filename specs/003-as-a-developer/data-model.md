# Data Model: Complete Application Redesign

**Feature**: Complete Application Redesign  
**Date**: 2025-10-11  
**Status**: No Changes to Existing Data Model

## Overview

This redesign is a **visual and UX transformation only**. All existing data models, database schema, and API contracts remain unchanged. This document confirms that no data model changes are required for this feature.

---

## Existing Entities (Preserved)

The following entities exist in the current system and will **not be modified** by this redesign:

### 1. User
Represents a renter using the application.

**Attributes**:
- `id`: Unique identifier (managed by Supabase Auth)
- `email`: User email address
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:
- Has many `RentEntry`
- Has many `ExpenseEntry`
- Has many `Tag`

**State**: Active (authenticated) or Inactive
**Validation**: Email format, unique email constraint

---

### 2. RentEntry
Represents a single rental period/booking.

**Attributes**:
- `id`: Unique identifier (UUID)
- `userId`: Foreign key to User
- `amount`: Rent income amount (decimal)
- `platform`: Publishing platform name (string)
- `startDate`: Rental start date
- `endDate`: Rental end date
- `days`: Number of days booked (calculated or stored)
- `createdAt`: Entry creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:
- Belongs to `User`
- Has many `Tag` (many-to-many via junction table)

**Validation**:
- Amount > 0
- endDate >= startDate
- days = endDate - startDate (if calculated)

---

### 3. ExpenseEntry
Represents a single expense related to rental operations.

**Attributes**:
- `id`: Unique identifier (UUID)
- `userId`: Foreign key to User
- `amount`: Expense amount (decimal)
- `category`: Expense category (string, e.g., "Maintenance", "Utilities")
- `description`: Optional description (text)
- `date`: Expense date
- `createdAt`: Entry creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:
- Belongs to `User`
- Has many `Tag` (many-to-many via junction table)

**Validation**:
- Amount > 0
- Date not in future (optional constraint)

---

### 4. Tag
Represents a custom label for categorizing rent and expense entries.

**Attributes**:
- `id`: Unique identifier (UUID)
- `userId`: Foreign key to User
- `name`: Tag name (string)
- `color`: Optional color code for visual differentiation
- `createdAt`: Tag creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:
- Belongs to `User`
- Has many `RentEntry` (many-to-many)
- Has many `ExpenseEntry` (many-to-many)

**Validation**:
- Name unique per user
- Name length 1-50 characters

---

## Design System Entities (New - Non-Database)

While database entities remain unchanged, the redesign introduces **conceptual entities** for the design system. These are **not stored in the database** but are implemented in code:

### 1. DesignTokens
A TypeScript type representing the design system token structure.

**Attributes** (TypeScript constants):
- `colors`: Object with semantic color tokens
- `spacing`: 8-point spacing scale
- `typography`: Font sizes, weights, line heights
- `borderRadius`: Consistent radius values
- `transitions`: Animation duration constants

**Location**: `src/lib/design-tokens.ts`  
**Purpose**: Centralized design system configuration for consistency

---

### 2. ThemeConfiguration
Represents theme-specific styling (light vs. dark).

**Attributes**:
- `mode`: 'light' | 'dark'
- `colors`: Theme-specific color mappings
- `stored`: localStorage key for persistence

**Location**: `src/components/ThemeProvider.tsx`  
**Purpose**: Manage theme switching and persistence

---

### 3. ComponentVariants
Represents design variants for UI components (e.g., button styles).

**Example Variants**:
- Button: primary, secondary, outline, ghost
- Card: default, elevated, bordered
- Input: default, error, success

**Implementation**: Using `class-variance-authority` library  
**Location**: Individual component files in `src/components/ui/`

---

## Data Flow (Unchanged)

The redesign does **not alter** any data flow patterns:

```
User Action (UI) → API Route → Prisma ORM → PostgreSQL → Response → UI Update
```

**Example: Adding a Rent Entry**
1. User fills redesigned form
2. Form submission calls `/api/rent_entries` POST endpoint
3. API validates data, creates RentEntry via Prisma
4. Response returned to client
5. UI updates with new entry (now with new visual design)

**Note**: Only the UI layer (step 1 and 5) is affected by the redesign.

---

## Scale Considerations

While data models don't change, the redesign must handle existing scale requirements:

**Current Scale**:
- Users: Unknown (multi-tenant via Supabase)
- RentEntry: Up to 10,000+ per user
- ExpenseEntry: Up to 10,000+ per user
- Tags: Typically 10-50 per user

**Performance Requirements** (from spec):
- Visualizations must render 10,000+ entries within 2 seconds
- Implemented via:
  - Data virtualization (@tanstack/react-virtual)
  - Server-side pagination with cursor-based navigation
  - Chart data aggregation

**Database Queries** (existing, unchanged):
```sql
-- Virtualized table query (paginated)
SELECT * FROM rent_entries 
WHERE user_id = ? 
ORDER BY created_at DESC 
LIMIT 50 OFFSET ?;

-- Chart aggregation query
SELECT 
  DATE_TRUNC('month', start_date) as month,
  SUM(amount) as total_income
FROM rent_entries
WHERE user_id = ?
GROUP BY DATE_TRUNC('month', start_date)
ORDER BY month DESC;
```

---

## Migration Requirements

**Database Migrations**: ❌ None required  
**Data Migrations**: ❌ None required  
**API Changes**: ❌ None required

This redesign is a pure frontend/UI change. All existing APIs, database schemas, and data structures remain identical.

---

## Validation Rules (Preserved)

All existing validation rules remain in effect:

**RentEntry**:
- ✅ Amount must be positive decimal
- ✅ End date must be >= start date
- ✅ Platform name required
- ✅ User association required

**ExpenseEntry**:
- ✅ Amount must be positive decimal
- ✅ Category required
- ✅ User association required

**Tag**:
- ✅ Name required (1-50 characters)
- ✅ Name unique per user
- ✅ User association required

**User**:
- ✅ Email format validation
- ✅ Unique email constraint
- ✅ Password strength requirements (managed by Supabase)

---

## Summary

**No database changes are required for this feature.** The redesign is purely a visual and UX transformation that:

1. ✅ Preserves all existing data models
2. ✅ Maintains all existing API contracts
3. ✅ Keeps all existing validation rules
4. ✅ Does not require database migrations
5. ✅ Introduces design system concepts (code-level only, not database)

The implementation focus is on:
- UI component redesign
- Design token configuration
- Theme management
- Responsive layout adaptation
- Performance optimization for rendering large datasets

All data operations (CRUD for rent entries, expense entries, tags) remain functionally identical - only the visual presentation layer changes.

