# Performance Optimization Guide

**Project**: RentSight Complete Application Redesign  
**Date**: 2025-10-11  
**Performance Targets**: 500ms primary content, 2s visualizations, 60fps animations

## Overview

This document provides comprehensive performance optimization guidelines and verification steps to ensure the redesigned application meets all performance targets.

---

## Performance Targets (from spec.md)

### Page Load Performance
- **Primary content**: ≤ 500ms (above-the-fold content visible)
- **Visualization render**: ≤ 2 seconds with 10,000+ entries
- **Total page load**: Reasonable for full content

### Animation Performance
- **Frame rate**: 60fps maintained during animations
- **Smooth interactions**: No janky scrolling or interactions
- **GPU acceleration**: Only transform and opacity animated

### Data Handling
- **Large datasets**: 10,000+ entries supported
- **Virtualization**: Efficient DOM rendering
- **Memory usage**: < 100MB for virtualized content

---

## Animation Performance Optimization (T066)

### Requirements

All animations must:
- Maintain 60fps (16.67ms per frame)
- Use GPU-accelerated properties only
- Have IE11 fallbacks (instant transitions)

### GPU-Accelerated Properties

**ONLY animate these properties**:
```css
/* ✅ Good - GPU accelerated */
.element {
  transition: opacity 200ms ease, transform 200ms ease;
}

.element:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}
```

**AVOID animating these properties**:
```css
/* ❌ Bad - Causes layout recalculation */
.element {
  transition: width 200ms, height 200ms, top 200ms, left 200ms;
}

/* ❌ Bad - Causes repaint */
.element {
  transition: color 200ms, background-color 200ms, border-color 200ms;
}
```

---

### Animation Audit Checklist

**Check all animation/transition usage in**:
- [ ] `src/components/ui/*.tsx` - UI components
- [ ] `src/components/Layout/*.tsx` - Layout components
- [ ] `src/app/globals.css` - Global styles
- [ ] `src/styles/tokens.css` - Token definitions

**For each animation, verify**:
- [ ] Only opacity/transform animated
- [ ] Duration ≤ 300ms (slow)
- [ ] Easing function defined
- [ ] will-change used sparingly
- [ ] IE11 fallback exists

---

### Current Implementation Verification

**Check `/src/lib/animation-utils.ts`**:
```typescript
export const performantTransition = {
  opacity: 'transition-opacity duration-200',
  transform: 'transition-transform duration-200',
  both: 'transition-[opacity,transform] duration-200',
}
```

**Verify usage in components**:
```tsx
// ✅ Good
<button className="transition-[opacity,transform] duration-200 hover:opacity-90 hover:scale-105">

// ❌ Bad - Would need fixing
<button className="transition-colors duration-200">
```

---

### Testing Animation Performance

**Manual Testing**:
1. Open Chrome DevTools
2. Go to Performance tab
3. Start recording
4. Interact with animated elements
5. Stop recording
6. Check for frame drops (should stay above 60fps)

**Check for**:
- Green bars (good performance)
- No red/orange bars (layout thrashing)
- Consistent ~60fps

**Automated Testing**:
```bash
npx playwright test tests/performance/animation.spec.ts
```

**Performance Metrics**:
```typescript
// Check FPS during animation
const fps = await page.evaluate(() => {
  return new Promise((resolve) => {
    let frameCount = 0;
    const startTime = performance.now();
    
    function countFrames() {
      frameCount++;
      if (performance.now() - startTime < 1000) {
        requestAnimationFrame(countFrames);
      } else {
        resolve(frameCount);
      }
    }
    
    requestAnimationFrame(countFrames);
  });
});

console.log(`FPS: ${fps}`); // Should be ~60
```

---

### IE11 Animation Fallbacks

**Verify these are applied**:

**Option 1: CSS Media Query**
```css
/* IE11 detection */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  * {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }
}
```

**Option 2: JavaScript Detection**
```typescript
// In src/lib/polyfills.ts or similar
const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

if (isIE11) {
  document.body.classList.add('no-animations');
}
```

```css
.no-animations * {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

---

## Bundle Size Optimization (T067)

### Requirements

- Monitor bundle size impact of new dependencies
- Optimize if bundles exceed reasonable size
- Use code splitting for large features

### Dependency Audit

**New Dependencies Added**:
- `@tanstack/react-virtual` (~15KB)
- `next-themes` (~5KB)
- Existing: `tailwindcss`, `@radix-ui/*`, etc.

**Check Bundle Size**:
```bash
npm run build

# Analyze bundle
npx @next/bundle-analyzer
```

**Target Sizes**:
- Main bundle: < 200KB (gzipped)
- First load JS: < 100KB
- Total page weight: < 500KB

---

### Bundle Optimization Strategies

**1. Dynamic Imports**
```tsx
// Lazy load heavy components
const DashboardCharts = dynamic(() => import('./DashboardCharts'), {
  loading: () => <div>Loading charts...</div>,
  ssr: false // If charts don't need SSR
});
```

**2. Tree Shaking**
```tsx
// ✅ Good - Only imports needed function
import { clsx } from 'clsx';

// ❌ Bad - Imports entire library
import * as utils from './utils';
```

**3. Remove Unused Dependencies**
```bash
# Check for unused dependencies
npx depcheck

# Remove unused
npm uninstall [package]
```

**4. Optimize Images**
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // For above-the-fold images
/>
```

---

### Bundle Size Report

**Check after build**:
```bash
npm run build
```

**Example output**:
```
Route (app)                           Size     First Load JS
┌ ○ /                                 5.2 kB        95.3 kB
├ ○ /dashboard                        8.7 kB        98.8 kB
├ ○ /login                            3.1 kB        93.2 kB
└ ○ /signup                           3.5 kB        93.6 kB

○  (Static)  prerendered as static content

First Load JS shared by all            90.1 kB
  ├ chunks/main-app.js                 85.2 kB
  └ other shared chunks                 4.9 kB
```

**Verify**:
- [ ] First Load JS < 100KB
- [ ] No route exceeds 200KB
- [ ] Shared chunks are reasonable

---

## Page Load Performance (T068)

### Requirements

- Primary content: ≤ 500ms
- Visualizations: ≤ 2s with 10,000+ entries
- Smooth interactions

### Performance Audit

**Run Lighthouse**:
```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance"
4. Click "Analyze page load"
```

**Target Scores**:
- Performance: ≥ 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

### Optimization Strategies

**1. Server-Side Rendering (SSR)**
```tsx
// Already enabled in Next.js for static content
export const metadata = {
  title: 'Dashboard | RentSight',
};
```

**2. Code Splitting**
```tsx
// Automatically done by Next.js per route
// Additional manual splitting for heavy components
const Charts = dynamic(() => import('./Charts'));
```

**3. Prefetching**
```tsx
// Next.js automatically prefetches links in viewport
<Link href="/dashboard" prefetch>Dashboard</Link>
```

**4. Caching**
```tsx
// API routes with proper cache headers
export async function GET(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

**5. Font Optimization**
```tsx
// In layout.tsx - already using next/font
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
});
```

---

### Critical Rendering Path

**Optimize loading sequence**:
1. HTML shell loads (< 100ms)
2. Critical CSS applied (< 200ms)
3. Primary content visible (< 500ms) ✅ Target
4. Fonts loaded (swap with fallback)
5. JavaScript parsed (< 1s)
6. Interactive (< 2s)
7. Visualizations render (< 2s) ✅ Target

**Verify with Performance API**:
```typescript
// Measure primary content timing
const contentTiming = performance.measure('content-render', {
  start: 'navigationStart',
  end: 'content-visible',
});

console.log(`Primary content: ${contentTiming.duration}ms`);
// Should be < 500ms
```

---

### Large Dataset Optimization

**Virtualization** (verify implementation):

File: `src/components/dashboard/VirtualizedTable.tsx`
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// Check these settings:
const rowVirtualizer = useVirtualizer({
  count: data.length,          // Total rows
  getScrollElement: () => ref.current,
  estimateSize: () => 50,      // Row height
  overscan: 5,                 // Extra rows to render
});
```

**Benefits**:
- Only renders visible rows (~20 instead of 10,000)
- Maintains 60fps scrolling
- Reduces memory usage

---

**Data Aggregation** (verify implementation):

File: `src/lib/data-aggregation.ts`
```typescript
// For charts - aggregate 10,000 entries to ~100 data points
export function aggregateData(entries: Entry[], bucketSize: number) {
  return entries.reduce((acc, entry, idx) => {
    const bucketIdx = Math.floor(idx / bucketSize);
    if (!acc[bucketIdx]) acc[bucketIdx] = { total: 0, count: 0 };
    acc[bucketIdx].total += entry.value;
    acc[bucketIdx].count++;
    return acc;
  }, [] as Array<{ total: number; count: number }>);
}
```

---

**Pagination** (verify API implementation):

File: `src/app/api/analytics/summary/route.ts`
```typescript
// Cursor-based pagination for efficient queries
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = 50;
  
  const entries = await prisma.rentEntry.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  
  const hasMore = entries.length > limit;
  const data = hasMore ? entries.slice(0, -1) : entries;
  
  return Response.json({
    data,
    nextCursor: hasMore ? entries[limit].id : null,
  });
}
```

---

### Performance Testing

**Run performance tests**:
```bash
npx playwright test tests/performance/large-datasets.spec.ts
```

**Key Metrics to Verify**:
- [ ] Dashboard renders < 2s with 10,000 entries
- [ ] Scroll maintains ~60fps
- [ ] Chart rendering < 1s
- [ ] Filter response < 300ms
- [ ] Page navigation < 500ms
- [ ] Memory usage < 100MB

---

### Performance Monitoring

**Add performance marks**:
```typescript
// Mark when content is visible
performance.mark('content-visible');

// Measure from navigation start
const measure = performance.measure('content-load', {
  start: 'navigationStart',
  end: 'content-visible',
});

console.log(`Content loaded in ${measure.duration}ms`);
```

**Monitor in production**:
```typescript
// Send to analytics
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    // Send to analytics service
  });
}
```

---

## Performance Report Template

```markdown
# Performance Optimization Report - [Date]

**Tester**: [Name]  
**Environment**: [Development/Production]  
**Browser**: [Chrome/Firefox/Safari]

## Animation Performance

| Component | FPS | Issues | Status |
|-----------|-----|--------|--------|
| Navigation hover | 60 | None | ✅ |
| Button transitions | 58 | Slight stutter | ⚠️ |
| Modal animations | 60 | None | ✅ |

## Bundle Size

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| First Load JS | 95 KB | < 100 KB | ✅ |
| Dashboard route | 103 KB | < 200 KB | ✅ |
| Total page weight | 450 KB | < 500 KB | ✅ |

## Page Load Performance

| Page | FCP | LCP | TTI | CLS | Status |
|------|-----|-----|-----|-----|--------|
| Homepage | 0.8s | 1.2s | 2.1s | 0.05 | ✅ |
| Dashboard | 1.1s | 1.8s | 2.8s | 0.08 | ✅ |

## Large Dataset Performance

| Test | Result | Target | Status |
|------|--------|--------|--------|
| Dashboard render (10k entries) | 1.8s | < 2s | ✅ |
| Scroll FPS | 59 | ~60 | ✅ |
| Chart render | 0.9s | < 1s | ✅ |
| Memory usage | 85 MB | < 100 MB | ✅ |

## Issues Found

### Critical Issues
1. [Description]

### Optimization Opportunities
1. [Description]

## Overall Assessment
✅ **PASS** - All performance targets met  
❌ **FAIL** - Performance issues found

## Recommendations
[Recommendations]
```

---

## Success Criteria

**Performance is acceptable if**:
- ✅ Animations maintain 60fps
- ✅ Only GPU-accelerated properties animated
- ✅ IE11 fallbacks implemented
- ✅ First Load JS < 100KB
- ✅ Primary content < 500ms
- ✅ Visualizations < 2s with 10,000+ entries
- ✅ Lighthouse Performance score ≥ 90
- ✅ No layout shifts (CLS < 0.1)

---

## Next Steps

1. Run performance tests
2. Analyze bundle size
3. Check animation FPS
4. Test with large datasets
5. Run Lighthouse audits
6. Document findings
7. Optimize if needed
8. Re-test and verify

**Reference Documents**:
- `/specs/003-as-a-developer/research.md` - Performance strategies
- `/specs/003-as-a-developer/spec.md` - Performance requirements

