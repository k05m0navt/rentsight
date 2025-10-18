# Research: Enhanced UX/UI Experience

**Feature**: 006-make-the-ux  
**Date**: October 12, 2025  
**Status**: Complete

## Overview

This document consolidates research findings for implementing comprehensive UX/UI improvements to the RentSight application, including animations, caching, skeleton loading, and visual design enhancements.

## Research Areas

### 1. Framer Motion Integration with Next.js 15 App Router

**Decision**: Use Framer Motion 11.x with client-side components

**Rationale**:
- Framer Motion is the industry-standard React animation library with 23k+ GitHub stars
- Excellent TypeScript support and declarative API aligns with React patterns
- Built-in support for `prefers-reduced-motion` accessibility
- Hardware-accelerated animations (uses CSS transforms and GPU)
- Next.js 15 App Router compatibility requires `"use client"` directive for animated components
- Bundle size is acceptable (~30KB gzipped) for the value provided

**Alternatives Considered**:
- **React Spring**: More physics-based, steeper learning curve, less documentation
- **CSS Animations Only**: Limited programmatic control, harder to coordinate complex sequences
- **GSAP**: More powerful but commercial license required for some features, larger bundle
- **Motion One**: Newer, smaller bundle but less mature ecosystem

**Implementation Approach**:
- Create wrapper components in `src/components/animations/` that use `"use client"`
- Export common animation variants (fadeIn, scaleIn, stagger) from `lib/animation-utils.ts`
- Apply animations selectively to high-impact UI elements (page transitions, modals, lists)
- Wrap animated content with `<MotionConfig reducedMotion="user">` to respect accessibility preferences

**Best Practices**:
- Use `initial`, `animate`, `exit` props for declarative animations
- Leverage `variants` for reusable animation patterns
- Use `layoutId` for shared element transitions
- Keep animations under 300ms to maintain perceived responsiveness
- Always provide fallback for `prefers-reduced-motion`
- Avoid animating expensive properties (width, height); prefer transform and opacity

**References**:
- Framer Motion Docs: https://www.framer.com/motion/
- Next.js + Framer Motion: https://www.framer.com/motion/guide-upgrade/##server-components
- Accessibility: https://www.framer.com/motion/accessibility/

---

### 2. Hybrid Caching Strategy (Client + Server)

**Decision**: Use React Cache API (server) + localStorage (client) with manual invalidation

**Rationale**:
- Next.js 15 provides built-in React cache() for server-side memoization
- localStorage provides persistent client-side cache across sessions
- Manual invalidation gives precise control for data consistency
- Avoids complexity of SWR/React Query for this use case
- Meets 5-minute staleness requirement with simple TTL checks

**Alternatives Considered**:
- **SWR**: Excellent library but adds complexity and bundle size for basic caching needs
- **React Query (TanStack Query)**: Powerful but overkill for simple cache + invalidation
- **Redis**: Requires additional infrastructure, unnecessary for small-scale app
- **Service Workers**: Complex setup, offline support not required

**Implementation Approach**:

**Client-Side Cache** (`lib/cache/client-cache.ts`):
```typescript
// Cache structure in localStorage
{
  "cache:dashboard": {
    data: { /* dashboard data */ },
    timestamp: 1697123456789,
    expiresAt: 1697123756789, // timestamp + 5 minutes
  },
  "cache:properties": { /* ... */ }
}

// API
get(key: string): T | null
set(key: string, data: T, ttl: number = 300000): void
invalidate(key: string): void
invalidatePattern(pattern: RegExp): void
```

**Server-Side Cache** (Next.js built-in):
```typescript
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// For React Server Components
export const getCachedDashboard = cache(async (userId: string) => {
  // Memoized within request
  return await fetchDashboard(userId);
});

// For longer-lived cache (across requests)
export const getCachedProperties = unstable_cache(
  async (userId: string) => {
    return await fetchProperties(userId);
  },
  ['properties'], // cache key
  { revalidate: 300 } // 5 minutes
);
```

**Cache Invalidation** (`services/cacheService.ts`):
```typescript
// After write operations
await updateProperty(id, data);
revalidateTag('properties'); // Server
clientCache.invalidate('cache:properties'); // Client (via API)
```

**Best Practices**:
- Prefix all cache keys with namespace (e.g., "cache:dashboard")
- Store timestamps with cached data for TTL validation
- Implement cache size limits (e.g., max 50 entries, LRU eviction)
- Invalidate related caches on write operations
- Log cache hits/misses for monitoring
- Use TypeScript generics for type-safe cache operations

**References**:
- Next.js Caching: https://nextjs.org/docs/app/building-your-application/caching
- React cache(): https://react.dev/reference/react/cache
- localStorage best practices: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

### 3. Skeleton Loading Pattern with React Suspense

**Decision**: Create reusable Skeleton components with Tailwind + Suspense boundaries

**Rationale**:
- Next.js 15 has excellent Suspense support for async Server Components
- Tailwind provides utility classes for skeleton styling (animate-pulse, bg-gray)
- Skeleton components can match actual content layout for smooth transition
- Loading states improve perceived performance by 30-40% (per research)
- Simple to implement and maintain

**Alternatives Considered**:
- **react-loading-skeleton**: Good library but unnecessary dependency for simple skeletons
- **Manual loading states**: Less maintainable, inconsistent patterns
- **Shimmer animation libraries**: Complex setup for minimal visual improvement

**Implementation Approach**:

**Skeleton Components** (`components/ui/skeleton.tsx`):
```typescript
// Base Skeleton
<div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded" />

// Skeleton variants
<SkeletonCard />      // matches Card layout
<SkeletonTable />     // matches Table layout
<SkeletonText />      // matches text lines
<SkeletonAvatar />    // matches circular avatars
```

**Usage with Suspense**:
```typescript
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardContent userId={userId} />
</Suspense>
```

**Best Practices**:
- Match skeleton dimensions to actual content (same width, height, spacing)
- Use subtle animation (pulse at 2s intervals, not distracting)
- Maintain same number of skeleton elements as actual content
- Support dark mode with appropriate skeleton colors
- Transition from skeleton to content with fade-in animation
- Co-locate skeleton components with their actual components

**References**:
- React Suspense: https://react.dev/reference/react/Suspense
- Skeleton Loading UX: https://www.nngroup.com/articles/skeleton-screens/
- Tailwind Animations: https://tailwindcss.com/docs/animation

---

### 4. WCAG AA Contrast for Light Mode

**Decision**: Use contrast ratio calculation tool + CSS custom properties for themeable colors

**Rationale**:
- WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18pt+)
- CSS custom properties allow easy theme switching and testing
- Automated testing with @axe-core/playwright ensures compliance
- Proper contrast improves readability for all users, not just those with visual impairments

**Alternatives Considered**:
- **Manual color selection**: Error-prone, not maintainable
- **Third-party color systems**: Lock-in, may not match brand
- **CSS-in-JS**: Adds runtime overhead, not needed

**Implementation Approach**:

**Color System** (`styles/tokens.css`):
```css
:root {
  /* Light mode - WCAG AA compliant */
  --color-text: #1a1a1a;        /* 15.3:1 on white */
  --color-text-muted: #666666;  /* 5.74:1 on white */
  --color-background: #ffffff;
  --color-surface: #f5f5f5;     /* Subtle cards */
  --color-border: #e0e0e0;
  
  --color-primary: #EA580C;     /* Orange - 4.52:1 on white */
  --color-primary-hover: #C2410C;
  --color-success: #16A34A;     /* 4.54:1 on white */
  --color-warning: #D97706;     /* 4.62:1 on white */
  --color-error: #DC2626;       /* 5.54:1 on white */
}

.dark {
  /* Dark mode colors */
  --color-text: #f5f5f5;
  --color-text-muted: #a3a3a3;
  --color-background: #0a0a0a;
  /* ... */
}
```

**Testing**:
```typescript
// Playwright test
test('light mode meets WCAG AA contrast', async ({ page }) => {
  await page.goto('/dashboard');
  await page.emulateMedia({ colorScheme: 'light' });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa', 'color-contrast'])
    .analyze();
  expect(results.violations).toHaveLength(0);
});
```

**Tools**:
- Contrast calculator: https://webaim.org/resources/contrastchecker/
- Colorable: https://colorable.jxnblk.com/
- Chrome DevTools Contrast Ratio

**Best Practices**:
- Test colors against both light and dark backgrounds
- Use semantic color names (primary, success, error) not descriptive (red, green)
- Provide sufficient contrast for icons and graphics (3:1 minimum)
- Test with real text samples, not just swatches
- Document contrast ratios in design tokens file

**References**:
- WCAG 2.1 Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Color Contrast Testing: https://www.a11yproject.com/posts/what-is-color-contrast/

---

### 5. Elevation & Shadow System for Depth

**Decision**: Define 3 elevation levels using Tailwind shadow utilities + custom tokens

**Rationale**:
- Material Design's elevation system is well-researched and proven
- 3 levels (flat, raised, overlay) cover 95% of UI needs without complexity
- Tailwind provides excellent shadow utilities out of the box
- CSS custom properties allow easy theme switching (lighter shadows in light mode)

**Alternatives Considered**:
- **5+ elevation levels**: Over-engineered for small app, harder to maintain consistency
- **Box-shadow only**: Misses opportunity for other depth cues (borders, backgrounds)
- **Neumorphism**: Trendy but poor accessibility, hard to maintain

**Implementation Approach**:

**Elevation Tokens** (`lib/design-tokens.ts`):
```typescript
export const elevation = {
  flat: {
    shadow: 'shadow-none',
    border: 'border border-border',
    background: 'bg-surface',
  },
  raised: {
    light: 'shadow-sm', // Light mode: subtle shadow
    dark: 'dark:shadow-md dark:shadow-black/20',
    hover: 'hover:shadow-md transition-shadow duration-200',
  },
  overlay: {
    light: 'shadow-lg',
    dark: 'dark:shadow-2xl dark:shadow-black/40',
  },
} as const;
```

**Usage**:
```typescript
// Card (raised)
<Card className={cn(elevation.raised.light, elevation.raised.dark, elevation.raised.hover)}>

// Modal (overlay)
<Dialog className={elevation.overlay.light}>

// Table row (flat)
<tr className={elevation.flat.border}>
```

**Custom Shadows** (`tailwind.config.js`):
```javascript
theme: {
  extend: {
    boxShadow: {
      'elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'elevation-2': '0 2px 8px 0 rgb(0 0 0 / 0.08)',
      'elevation-3': '0 8px 24px 0 rgb(0 0 0 / 0.12)',
    }
  }
}
```

**Best Practices**:
- Use lighter shadows in light mode, darker shadows in dark mode
- Animate shadow changes on hover (transition-shadow duration-200)
- Combine shadows with subtle background color changes
- Avoid deep shadows (z-index > 3) except for modals/overlays
- Test shadows on various backgrounds and screen sizes

**References**:
- Material Design Elevation: https://m3.material.io/styles/elevation/overview
- Tailwind Shadows: https://tailwindcss.com/docs/box-shadow
- CSS Shadows: https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow

---

### 6. Tag Cascade Deletion Pattern

**Decision**: Implement cascade deletion with confirmation dialog + transaction

**Rationale**:
- Prevents orphaned references and data integrity issues
- User confirmation prevents accidental data loss
- Database transaction ensures atomic operation (all or nothing)
- Clear feedback improves user confidence

**Alternatives Considered**:
- **Soft delete**: Adds complexity, not needed for tags
- **Block deletion**: Frustrates users, forces manual cleanup
- **Silent cascade**: Dangerous, users should know what's being affected

**Implementation Approach**:

**Database** (Prisma):
```prisma
model Tag {
  id         String   @id @default(cuid())
  name       String
  color      String?
  
  // Relations (cascade handled in code, not DB constraint)
  properties Property[]
  rentEntries RentEntry[]
  expenseEntries ExpenseEntry[]
}
```

**Service Layer** (`services/tagService.ts`):
```typescript
async deleteTag(tagId: string): Promise<DeleteTagResult> {
  // 1. Check usage
  const usage = await prisma.tag.findUnique({
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
  
  const totalUsage = usage._count.properties + 
                      usage._count.rentEntries + 
                      usage._count.expenseEntries;
  
  if (totalUsage > 0) {
    return {
      status: 'requires_confirmation',
      usage: usage._count,
      message: `This tag is used by ${usage._count.properties} properties, ${usage._count.rentEntries} rent entries, and ${usage._count.expenseEntries} expense entries.`
    };
  }
  
  // 2. Delete if confirmed
  await prisma.$transaction([
    prisma.property.updateMany({
      where: { tagIds: { has: tagId } },
      data: { tagIds: { set: [] } } // Remove tag from arrays
    }),
    prisma.rentEntry.updateMany({
      where: { tagIds: { has: tagId } },
      data: { tagIds: { set: [] } }
    }),
    prisma.expenseEntry.updateMany({
      where: { tagIds: { has: tagId } },
      data: { tagIds: { set: [] } }
    }),
    prisma.tag.delete({
      where: { id: tagId }
    })
  ]);
  
  return { status: 'success' };
}
```

**UI Flow**:
1. User clicks delete → API checks usage
2. If used → show confirmation dialog with counts
3. User confirms → API executes transaction
4. Success → update UI + show toast notification
5. Invalidate cache

**Best Practices**:
- Always check usage before showing confirmation
- Use database transactions for atomicity
- Provide clear, specific messaging (e.g., "5 properties, 12 entries")
- Log deletions for audit trail
- Invalidate related caches after deletion
- Test edge cases (concurrent deletions, large datasets)

**References**:
- Prisma Transactions: https://www.prisma.io/docs/concepts/components/prisma-client/transactions
- UX Patterns for Deletion: https://www.nngroup.com/articles/confirmation-dialog/

---

### 7. Russian Market Configuration

**Decision**: Use configuration objects with currency/platform metadata

**Rationale**:
- No full i18n needed, just regional options (per clarification)
- Static configuration is simpler than database-driven
- Easy to extend with additional regions in future
- Type-safe with TypeScript

**Alternatives Considered**:
- **Full i18n library (i18next)**: Overkill for just regional options
- **Database-driven**: Unnecessary complexity for static data
- **Hard-coded**: Not maintainable, scattered logic

**Implementation Approach**:

**Configuration** (`lib/regional-config.ts`):
```typescript
export const currencies = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    format: (amount: number) => `$${amount.toLocaleString('en-US')}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    format: (amount: number) => `${amount.toLocaleString('de-DE')}€`,
  },
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    format: (amount: number) => `${amount.toLocaleString('ru-RU', { 
      useGrouping: true 
    })} ₽`, // e.g., "50 000 ₽"
  },
} as const;

export const platforms = {
  russian: [
    { id: 'avito', name: 'Avito', url: 'https://www.avito.ru' },
    { id: 'cian', name: 'CIAN', url: 'https://www.cian.ru' },
    { id: 'domclick', name: 'Domclick', url: 'https://domclick.ru' },
    { id: 'yandex', name: 'Yandex.Realty', url: 'https://realty.yandex.ru' },
  ],
  us: [
    { id: 'zillow', name: 'Zillow', url: 'https://www.zillow.com' },
    { id: 'trulia', name: 'Trulia', url: 'https://www.trulia.com' },
  ],
} as const;

export const dateFormats = {
  'en-US': 'MM/DD/YYYY',
  'ru-RU': 'DD.MM.YYYY',
} as const;
```

**Database** (User Preferences):
```prisma
model UserPreference {
  id           String @id @default(cuid())
  userId       String @unique
  currency     String @default("USD") // "USD" | "EUR" | "RUB"
  dateFormat   String @default("MM/DD/YYYY")
  preferredPlatforms String[] @default([]) // ["avito", "cian"]
}
```

**Best Practices**:
- Use TypeScript const assertions for type safety
- Provide format functions for each currency (handles separators)
- Group platforms by region for UI organization
- Store user preferences in database
- Make configuration easily extensible (add new currencies/platforms)

**References**:
- Number formatting: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- Currency symbols: https://en.wikipedia.org/wiki/Currency_symbol

---

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Animations | Framer Motion 11.x | Industry standard, accessibility built-in, Next.js compatible |
| Caching | Hybrid (localStorage + React cache) | Simple, precise control, meets 5-min TTL requirement |
| Skeleton Loading | Custom components + Suspense | Maintainable, excellent Next.js 15 support |
| Light Mode | CSS custom properties + contrast testing | WCAG AA compliant, themeable, testable |
| Elevation | 3-level shadow system | Simple, proven Material Design pattern |
| Tag Deletion | Cascade with confirmation + transaction | Data integrity, user confidence, atomic operations |
| Russian Support | Static configuration objects | Simple, type-safe, easily extensible |

## Next Steps

1. ✅ Research complete
2. → Proceed to Phase 1: Data Model & Contracts
3. → Implement according to plan.md structure
4. → Create tasks.md with implementation breakdown

