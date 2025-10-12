# Quickstart: Enhanced UX/UI Experience

**Feature**: 006-make-the-ux  
**Branch**: `006-make-the-ux`  
**Date**: October 12, 2025

## Overview

This guide helps developers get started implementing the UX/UI enhancement feature. Follow these steps to set up your environment, understand the architecture, and begin development.

## Prerequisites

- Node.js 20+ and npm 10+
- Git access to the repository
- PostgreSQL database running (local or Supabase)
- Basic familiarity with Next.js 15, React 19, TypeScript, Prisma

## Quick Setup (5 minutes)

### 1. Checkout Feature Branch

```bash
git checkout 006-make-the-ux

# Or create from main
git checkout -b 006-make-the-ux origin/main
```

### 2. Install New Dependencies

```bash
# Install Framer Motion for animations
npm install framer-motion

# Verify installation
npm list framer-motion
# Should show: framer-motion@11.x.x
```

### 3. Run Database Migration

```bash
# Generate Prisma client with new UserPreference model
npx prisma generate

# Run migration to create user_preferences table
npx prisma migrate dev --name add_user_preferences

# Seed default preferences for existing users
npx tsx scripts/create-default-preferences.ts
```

### 4. Start Development Server

```bash
npm run dev
# Server starts on http://localhost:3000
```

### 5. Verify Setup

Open http://localhost:3000 and check:
- ✅ App loads without errors
- ✅ Console shows no TypeScript errors
- ✅ Sidebar renders correctly

## Architecture Overview

### High-Level Components

```
┌─────────────────────────────────────────────────┐
│             Browser (Client)                     │
├─────────────────────────────────────────────────┤
│  Components                                      │
│  ├── Animations (Framer Motion wrappers)        │
│  ├── Skeleton Loaders                           │
│  └── UI Components (enhanced with elevation)    │
│                                                  │
│  Client Cache (localStorage)                    │
│  └── UI state, view preferences, recent items   │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│          Next.js Server (App Router)            │
├─────────────────────────────────────────────────┤
│  API Routes                                      │
│  ├── /api/preferences (GET, PUT)                │
│  ├── /api/tags/[id] (DELETE with cascade)       │
│  ├── /api/cache/invalidate (POST)               │
│  └── /api/regional/* (GET currencies/platforms) │
│                                                  │
│  Server Cache (React cache, unstable_cache)     │
│  └── Query results, aggregations                │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│              Database (PostgreSQL)               │
├─────────────────────────────────────────────────┤
│  New: user_preferences                           │
│  Updated: Tag deletion with cascade              │
└─────────────────────────────────────────────────┘
```

### Key Files to Know

| File | Purpose | Priority |
|------|---------|----------|
| `src/components/Layout/Sidebar.tsx` | Add auth buttons + theme toggle | P1 |
| `src/components/ui/skeleton.tsx` | Skeleton component primitives | P1 |
| `src/services/tagService.ts` | Tag cascade deletion logic | P1 |
| `src/lib/cache/client-cache.ts` | Client-side caching utility | P1 |
| `src/lib/cache/server-cache.ts` | Server-side caching utility | P1 |
| `src/lib/design-tokens.ts` | Colors, elevation, spacing | P2 |
| `src/components/animations/` | Framer Motion wrappers | P2 |
| `src/lib/regional-config.ts` | Currencies, platforms config | P3 |

## Implementation Roadmap

### Week 1: Critical Fixes & Infrastructure (P1)

**Day 1-2: Sidebar & Authentication**
```bash
# Tasks
- Move ThemeToggle from dashboard to Sidebar
- Add Sign In button (when unauthenticated)
- Add Log Out button (when authenticated)
- Position controls at bottom of sidebar
- Test across auth states

# Files
src/components/Layout/Sidebar.tsx
src/app/dashboard/page.tsx (remove ThemeToggle)
```

**Day 3-4: Skeleton Loading**
```bash
# Tasks
- Create skeleton component library
- Add Suspense boundaries to dashboard
- Add Suspense boundaries to properties
- Add Suspense boundaries to other pages
- Test with throttled network

# Files
src/components/ui/skeleton.tsx (new)
src/app/dashboard/page.tsx
src/app/properties/page.tsx
src/components/dashboard/*
src/components/properties/*
```

**Day 5: Tag Deletion Fix**
```bash
# Tasks
- Implement usage count query
- Add confirmation dialog
- Implement cascade deletion in transaction
- Add cache invalidation
- Write E2E tests

# Files
src/services/tagService.ts
src/app/api/tags/[id]/route.ts
src/components/tags/TagList.tsx
tests/e2e/tag-deletion.spec.ts
```

### Week 2: Visual Improvements (P2)

**Day 1-2: Light Mode & Elevation**
```bash
# Tasks
- Update color tokens for WCAG AA
- Add elevation system (3 levels)
- Apply shadows to cards
- Test contrast ratios
- Visual regression tests

# Files
src/lib/design-tokens.ts
src/styles/tokens.css
src/components/ui/card.tsx
tests/visual/light-mode.spec.ts
```

**Day 3-4: Animations**
```bash
# Tasks
- Create animation wrapper components
- Add page transitions
- Add modal animations
- Add list item animations
- Respect reduced motion
- Performance testing (60fps)

# Files
src/components/animations/FadeIn.tsx
src/components/animations/ScaleIn.tsx
src/components/animations/PageTransition.tsx
src/lib/animation-utils.ts
```

**Day 5: Color Consistency**
```bash
# Tasks
- Audit components for color usage
- Apply semantic colors
- Update buttons, badges, alerts
- Document color system

# Files
src/lib/design-tokens.ts
src/components/ui/* (multiple files)
docs/design-system/colors.md
```

### Week 3: Performance & Regional Support (P3)

**Day 1-2: Caching**
```bash
# Tasks
- Implement client cache utility
- Implement server cache wrappers
- Add cache invalidation
- Add cache metrics
- Test cache hit rates

# Files
src/lib/cache/client-cache.ts
src/lib/cache/server-cache.ts
src/services/cacheService.ts
src/app/api/cache/invalidate/route.ts
```

**Day 3-4: Russian Market Support**
```bash
# Tasks
- Create regional configuration
- Update database schema for preferences
- Add currency/platform selectors
- Implement number/date formatting
- Test with Russian settings

# Files
src/lib/regional-config.ts
src/types/regional.ts
src/components/forms/* (currency selectors)
prisma/schema.prisma (UserPreference)
```

**Day 5: Help Page Enhancement**
```bash
# Tasks
- Reorganize help content
- Add links to app pages
- Improve search
- Add screenshots/illustrations

# Files
src/app/help/page.tsx
src/components/help/*
public/help/articles/*
```

## Development Workflow

### 1. Pick a Task

Check [tasks.md](./tasks.md) (will be created by `/speckit.tasks`) for detailed task breakdown.

### 2. Create Feature Branch

```bash
# Branch naming: feature/006-{task-name}
git checkout -b feature/006-sidebar-auth
```

### 3. Implement with TDD

```bash
# Write test first (or alongside implementation)
npx playwright test tests/e2e/sidebar-auth.spec.ts --headed

# Implement feature
code src/components/Layout/Sidebar.tsx

# Verify tests pass
npm run test:e2e
```

### 4. Test Locally

```bash
# Development server
npm run dev

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:accessibility

# Visual regression (generates screenshots)
npx playwright test tests/visual/ --update-snapshots
```

### 5. Code Review Checklist

Before submitting PR:
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Linter passes (`npm run lint`)
- [ ] All tests pass (`npm run test:e2e`)
- [ ] Accessibility tests pass (`npm run test:accessibility`)
- [ ] Visual snapshots updated if UI changed
- [ ] Documentation updated (if public API changed)
- [ ] Database migration tested (if schema changed)

## Common Tasks

### Add a New Animation

```typescript
// 1. Create wrapper component
// src/components/animations/SlideIn.tsx

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideIn({ children, direction = 'up' }: SlideInProps) {
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 20 : -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// 2. Use in component
import { SlideIn } from '@/components/animations/SlideIn';

export function MyComponent() {
  return (
    <SlideIn direction="up">
      <Card>Content</Card>
    </SlideIn>
  );
}
```

### Add a New Skeleton

```typescript
// 1. Create skeleton component
// src/components/ui/skeleton.tsx

export function SkeletonPropertyCard() {
  return (
    <div className="p-4 border rounded-lg animate-pulse">
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );
}

// 2. Use with Suspense
import { Suspense } from 'react';
import { SkeletonPropertyCard } from '@/components/ui/skeleton';

export default function PropertiesPage() {
  return (
    <Suspense fallback={<SkeletonPropertyCard />}>
      <PropertyList />
    </Suspense>
  );
}
```

### Add Cache for New Resource

```typescript
// 1. Client cache
import { clientCache } from '@/lib/cache/client-cache';

// Set cache
clientCache.set('reports', reportsData, 300000); // 5 minutes

// Get cache
const cachedReports = clientCache.get('reports');

// Invalidate cache
clientCache.invalidate('reports');

// 2. Server cache (React Server Component)
import { cache } from 'react';

export const getCachedReports = cache(async (userId: string) => {
  // This is memoized within the request
  return await fetchReports(userId);
});

// 3. Server cache (across requests)
import { unstable_cache } from 'next/cache';

export const getCachedProperties = unstable_cache(
  async (userId: string) => await fetchProperties(userId),
  ['properties'],
  { revalidate: 300 } // 5 minutes
);
```

### Test Cascade Deletion

```typescript
// tests/e2e/tag-deletion.spec.ts

import { test, expect } from '@playwright/test';

test('cascade delete tag with confirmation', async ({ page }) => {
  await page.goto('/tags');
  
  // Create tag and assign to property
  await page.click('button:has-text("New Tag")');
  await page.fill('input[name="name"]', 'Test Tag');
  await page.click('button:has-text("Save")');
  
  await page.goto('/properties');
  await page.click('button:has-text("New Property")');
  // ... assign tag to property
  
  // Delete tag
  await page.goto('/tags');
  await page.click('[data-testid="delete-tag-test-tag"]');
  
  // Should show confirmation
  await expect(page.locator('text=This tag is used by')).toBeVisible();
  await expect(page.locator('text=1 properties')).toBeVisible();
  
  // Confirm deletion
  await page.click('button:has-text("Delete Anyway")');
  
  // Verify success
  await expect(page.locator('text=Tag deleted successfully')).toBeVisible();
  
  // Verify cascade
  await page.goto('/properties');
  await expect(page.locator('text=Test Tag')).not.toBeVisible();
});
```

## Debugging Tips

### Animation Issues

```bash
# Check if Framer Motion loaded
# In browser console:
window.__FRAMER_MOTION_DEBUG__ = true

# Disable animations for debugging
# src/app/layout.tsx
<MotionConfig reducedMotion="always">
  {children}
</MotionConfig>
```

### Cache Issues

```bash
# Clear client cache
localStorage.clear()

# Clear server cache (Next.js)
rm -rf .next/cache

# Log cache hits/misses
# Add to cache utilities:
console.log('Cache hit:', key, !!cachedData);
```

### Contrast Issues

```bash
# Test specific element
# Chrome DevTools > Elements > Styles > Color picker
# Shows contrast ratio automatically

# Run automated test
npx playwright test tests/visual/light-mode.spec.ts
```

## Troubleshooting

### "Framer Motion requires client component"

**Error**: `You're importing a component that needs "use client"`

**Solution**: Add `"use client"` directive at top of file:

```typescript
'use client';

import { motion } from 'framer-motion';
```

### "UserPreference relation not found"

**Error**: `Unknown field 'preference' on model 'User'`

**Solution**: Regenerate Prisma client:

```bash
npx prisma generate
```

### "Tag deletion transaction failed"

**Error**: `Transaction failed: deadlock detected`

**Solution**: Retry with exponential backoff or check for concurrent deletions

### Cache size exceeded

**Error**: `QuotaExceededError: localStorage full`

**Solution**: Implement LRU eviction in `client-cache.ts`:

```typescript
if (entries.length >= MAX_ENTRIES) {
  evictLRU();
}
```

## Resources

### Documentation
- [Feature Spec](./spec.md)
- [Implementation Plan](./plan.md)
- [Research](./research.md)
- [Data Model](./data-model.md)
- [API Contracts](./contracts/openapi.yaml)

### External Resources
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Playwright Docs](https://playwright.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Motion Docs: https://motion.dev
- Tailwind Config Viewer: `npx tailwindcss-config-viewer`

## Need Help?

1. Check [spec.md](./spec.md) for requirements clarification
2. Check [research.md](./research.md) for technical decisions
3. Check existing implementation in similar components
4. Ask in team chat/Slack #rentsight-dev

## Next Steps

1. ✅ Setup complete
2. → Review [tasks.md](./tasks.md) for detailed task breakdown (coming from `/speckit.tasks`)
3. → Start with P1 tasks (Sidebar, Skeleton, Tag Deletion)
4. → Follow implementation roadmap above
5. → Submit PRs with tests

Happy coding! 🚀

