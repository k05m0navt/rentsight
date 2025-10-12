# Developer Quickstart: Create other pages

**Feature**: Create other pages  
**Date**: 2025-10-12  
**Related**: [plan.md](./plan.md) | [research.md](./research.md) | [data-model.md](./data-model.md)

## Overview

This guide provides step-by-step instructions for implementing the "Create other pages" feature, which adds five new pages to RentSight: Settings, Properties Management, Help, Reports, and About.

## Prerequisites

- Development environment set up (Node.js 20+, npm)
- Project dependencies installed (`npm install`)
- Supabase credentials configured
- PostgreSQL database running
- Familiarity with Next.js App Router, React, TypeScript, Prisma

## Implementation Phases

The implementation is divided into logical phases that can be worked on incrementally:

1. **Phase 1**: Database migration and Property entity
2. **Phase 2**: Settings page (profile and preferences)
3. **Phase 3**: Properties Management page
4. **Phase 4**: Help page
5. **Phase 5**: Reports page
6. **Phase 6**: About page
7. **Phase 7**: Integration and testing

Each phase can be implemented, tested, and merged independently.

---

## Phase 1: Database Migration

### Step 1.1: Update Prisma Schema

Edit `prisma/schema.prisma` to add new models and relationships:

```prisma
// Add Property model
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

// Add UserPreferences model
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

// Update User model - add relationships
model User {
  // ... existing fields
  properties       Property[]        // ADD THIS
  preferences      UserPreferences?  // ADD THIS
}

// Update RentEntry model - add property relationship
model RentEntry {
  // ... existing fields
  property_id String?  // ADD THIS
  property    Property? @relation(fields: [property_id], references: [id], onDelete: SetNull)  // ADD THIS
  
  @@index([property_id])  // ADD THIS
}

// Update ExpenseEntry model - add property relationship
model ExpenseEntry {
  // ... existing fields
  property_id String?  // ADD THIS
  property    Property? @relation(fields: [property_id], references: [id], onDelete: SetNull)  // ADD THIS
  
  @@index([property_id])  // ADD THIS
}
```

### Step 1.2: Create Migration

```bash
npx prisma migrate dev --name add_properties_and_preferences
```

This creates a new migration and applies it to the development database.

### Step 1.3: Create Default Preferences for Existing Users

Create a data migration script or run manually:

```typescript
// scripts/create-default-preferences.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      preferences: null
    }
  });

  for (const user of users) {
    await prisma.userPreferences.create({
      data: {
        user_id: user.id,
        currency_format: 'USD',
        date_format: 'MM/DD/YYYY',
        language: 'en',
        default_view: 'dashboard'
      }
    });
    console.log(`Created preferences for user ${user.id}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Step 1.4: Generate Prisma Client

```bash
npx prisma generate
```

---

## Phase 2: Settings Page

### Step 2.1: Install Dependencies (if needed)

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Step 2.2: Create Validation Schemas

Create `src/lib/validations.ts`:

```typescript
import { z } from 'zod';

export const userProfileSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const userPreferencesSchema = z.object({
  currency_format: z.string(),
  date_format: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  language: z.string(),
  default_view: z.enum(['dashboard', 'properties', 'reports', 'settings']),
  theme_preference: z.enum(['light', 'dark', 'system']).optional()
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;
export type UserPreferencesForm = z.infer<typeof userPreferencesSchema>;
```

### Step 2.3: Create API Routes

**Profile API** - `src/app/api/user/profile/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { userProfileSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma'; // Assume Prisma client singleton

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, created_at: true, updated_at: true }
  });
  
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const validation = userProfileSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }
  
  // Update email in Supabase Auth
  const { error: updateError } = await supabase.auth.updateUser({
    email: validation.data.email
  });
  
  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 400 }
    );
  }
  
  // Update in database
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { email: validation.data.email },
    select: { id: true, email: true, created_at: true, updated_at: true }
  });
  
  return NextResponse.json(updated);
}
```

**Password API** - `src/app/api/user/password/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { passwordChangeSchema } from '@/lib/validations';

export async function PUT(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const validation = passwordChangeSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }
  
  // Verify current password by attempting sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: validation.data.currentPassword
  });
  
  if (signInError) {
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 401 }
    );
  }
  
  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: validation.data.newPassword
  });
  
  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 400 }
    );
  }
  
  return NextResponse.json({ message: 'Password updated successfully' });
}
```

**Preferences API** - `src/app/api/user/preferences/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { userPreferencesSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  let preferences = await prisma.userPreferences.findUnique({
    where: { user_id: user.id }
  });
  
  // Create defaults if not exists
  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: {
        user_id: user.id,
        currency_format: 'USD',
        date_format: 'MM/DD/YYYY',
        language: 'en',
        default_view: 'dashboard'
      }
    });
  }
  
  return NextResponse.json(preferences);
}

export async function PUT(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const validation = userPreferencesSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }
  
  const updated = await prisma.userPreferences.upsert({
    where: { user_id: user.id },
    update: validation.data,
    create: {
      user_id: user.id,
      ...validation.data
    }
  });
  
  return NextResponse.json(updated);
}
```

### Step 2.4: Create Settings Components

**ProfileForm** - `src/components/settings/ProfileForm.tsx`:

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, UserProfileForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileFormProps {
  initialData: { email: string };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: initialData
  });
  
  const onSubmit = async (data: UserProfileForm) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to update profile');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
```

Create similar components for `PasswordForm.tsx` and `PreferencesForm.tsx` following the same pattern.

### Step 2.5: Create Settings Page

**Settings Page** - `src/app/settings/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { PasswordForm } from '@/components/settings/PasswordForm';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Fetch profile and preferences
  const [profileRes, preferencesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences`)
  ]);
  
  const profile = await profileRes.json();
  const preferences = await preferencesRes.json();
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm initialData={profile} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <PreferencesForm initialData={preferences} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Phase 3: Properties Management Page

### Step 3.1: Create Property Validation Schema

Add to `src/lib/validations.ts`:

```typescript
export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  address: z.string().max(500).optional(),
  property_type: z.enum(['apartment', 'house', 'condo', 'townhouse', 'duplex', 'other']).optional(),
  start_date: z.string().optional(), // ISO date string
  notes: z.string().max(2000).optional()
});

export type PropertyForm = z.infer<typeof propertySchema>;
```

### Step 3.2: Create Property API Routes

**Properties API** - `src/app/api/properties/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search');
  
  const where = {
    user_id: user.id,
    ...(search && { name: { contains: search, mode: 'insensitive' as const } })
  };
  
  const properties = await prisma.property.findMany({
    where,
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor }
    }),
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
  
  const hasMore = properties.length > limit;
  const items = hasMore ? properties.slice(0, -1) : properties;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  const total = await prisma.property.count({ where });
  
  return NextResponse.json({ items, nextCursor, total });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const validation = propertySchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }
  
  try {
    const property = await prisma.property.create({
      data: {
        user_id: user.id,
        ...validation.data,
        start_date: validation.data.start_date ? new Date(validation.data.start_date) : null
      }
    });
    
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Property with this name already exists' },
        { status: 409 }
      );
    }
    throw error;
  }
}
```

Create similar routes for `src/app/api/properties/[id]/route.ts` with GET, PUT, DELETE methods.

### Step 3.3: Create Property Components

Create components in `src/components/properties/`:
- `PropertyList.tsx` - List with pagination
- `PropertyItem.tsx` - Property card
- `PropertyForm.tsx` - Create/edit form
- `PropertySelector.tsx` - Dropdown for forms

### Step 3.4: Create Properties Page

**Properties Page** - `src/app/properties/page.tsx`:

Similar structure to Settings page, fetching properties and rendering list with create/edit/delete functionality.

---

## Phase 4-6: Help, Reports, About Pages

Follow similar patterns:
1. Create API routes (if needed)
2. Create components
3. Create page in `src/app/[page-name]/page.tsx`
4. Add navigation links

**Help Page**: Static content with search functionality  
**Reports Page**: Use existing analytics APIs with new filters  
**About Page**: Static content page

---

## Phase 7: Integration

### Step 7.1: Update Navigation

Edit `src/components/Layout/Sidebar.tsx` and `src/components/Layout/BottomNav.tsx` to add links to new pages.

### Step 7.2: Update Forms with Property Selector

Edit `src/components/forms/rent-entry-form.tsx` and `expense-entry-form.tsx` to include property selector.

### Step 7.3: Testing

```bash
# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:accessibility

# Run specific test file
npx playwright test tests/e2e/settings.spec.ts
```

---

## Common Commands

```bash
# Development
npm run dev

# Database
npx prisma studio           # Open database GUI
npx prisma migrate dev      # Create and apply migration
npx prisma migrate reset    # Reset database (dev only)
npx prisma generate         # Regenerate Prisma Client

# Testing
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Run tests with UI
npx playwright test --debug # Debug tests

# Linting
npm run lint               # Run ESLint

# Build
npm run build              # Production build
```

---

## Troubleshooting

### Issue: Migration fails
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check for conflicting migrations
- Try `npx prisma migrate reset` (dev only)

### Issue: Type errors after schema changes
- Run `npx prisma generate`
- Restart TypeScript server in IDE
- Check Prisma Client import paths

### Issue: Authentication errors
- Verify Supabase credentials in .env
- Check token expiration
- Ensure middleware is configured

### Issue: API returns 401
- Check authentication in API route
- Verify Supabase client configuration
- Check session validity

---

## Next Steps

After implementation:
1. Run full test suite
2. Manual testing on all pages
3. Accessibility testing
4. Performance testing
5. Update documentation
6. Create PR for review

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Playwright Testing](https://playwright.dev/)

## Support

For questions or issues:
- Check project README
- Review existing implementations in codebase
- Consult API contracts in `contracts/openapi.yaml`
- Refer to data model in `data-model.md`

