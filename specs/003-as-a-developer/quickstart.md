# Developer Quickstart: Complete Application Redesign

**Feature**: Complete Application Redesign  
**Branch**: `003-as-a-developer`  
**Date**: 2025-10-11

## Overview

This guide helps developers get started implementing the complete application redesign. The redesign is a comprehensive visual and UX transformation while preserving all existing functionality.

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 20+ installed
- ✅ npm or yarn package manager
- ✅ Git access to the repository
- ✅ Access to Supabase project (for testing)
- ✅ Familiarity with Next.js 15, React 19, TypeScript, Tailwind CSS

**Recommended Tools**:
- VS Code with Tailwind CSS IntelliSense extension
- BrowserStack account (for IE11 testing) or Windows VM
- Playwright Test for VS Code extension

---

## Setup

### 1. Switch to Feature Branch

```bash
git checkout 003-as-a-developer
```

### 2. Install Dependencies

No new dependencies required yet. Existing package.json has everything needed:

```bash
npm install
```

**Key Existing Dependencies**:
- `next@15.5.4` - React framework
- `tailwindcss@4` - CSS framework
- `@radix-ui/*` - UI primitives
- `shadcn@3.4.0` - Component library CLI
- `lucide-react` - Icons
- `@tanstack/react-virtual` - Will be added for virtualization

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Implementation Approach

The redesign follows a **component-first, incremental development** strategy with **big bang deployment**:

### Phase 1: Foundation (Design Tokens & Theme)
1. Configure Tailwind with new design tokens
2. Update ThemeProvider for dark/light themes
3. Create design token TypeScript exports
4. Set up IE11 compatibility (PostCSS configuration)

### Phase 2: Core Components (Primitives)
1. Redesign shadcn/ui components (Button, Card, Input, Badge, etc.)
2. Implement consistent variants using `class-variance-authority`
3. Test accessibility (WCAG AA contrast, keyboard navigation)
4. Visual regression tests for each component

### Phase 3: Layout Components
1. Create Sidebar navigation (desktop/tablet)
2. Create BottomNav (mobile)
3. Update Layout/Container components
4. Implement responsive breakpoint logic (768px)

### Phase 4: Page Redesign
1. Dashboard (priority P1)
2. Rent Entry & Expense Entry forms (priority P2)
3. Tag Manager (priority P3)
4. Login/Signup pages

### Phase 5: Data Visualization
1. Integrate @tanstack/react-virtual for tables
2. Implement chart redesigns with new color palette
3. Add data aggregation for 10,000+ entries
4. Performance testing and optimization

### Phase 6: Testing & QA
1. E2E tests update (Playwright)
2. Accessibility tests (@axe-core)
3. Visual regression tests (all pages, both themes, multiple viewports)
4. Cross-browser testing (Chrome, Firefox, Safari, Edge, IE11)
5. Performance benchmarks

---

## Key Files to Modify

### Phase 1: Foundation

#### `tailwind.config.js`
Update theme with design tokens:

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#FFFFFF', dark: '#030303' },
        card: { DEFAULT: '#F5F5F5', dark: '#1A1A1A' },
        primary: { DEFAULT: '#DD1202', foreground: '#FFFFFF' },
        success: { DEFAULT: '#1DCC5C', foreground: '#FFFFFF' },
        text: { DEFAULT: '#1A1A1A', dark: '#EEEEEE' },
        muted: { DEFAULT: '#666666', dark: '#AAAAAA' },
        border: { DEFAULT: '#E5E5E5', dark: '#333333' },
      },
      spacing: {
        0: '0', 1: '4px', 2: '8px', 3: '16px',
        4: '24px', 5: '32px', 6: '40px', 7: '48px', 8: '64px'
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['20px', { lineHeight: '28px' }],
        xl: ['24px', { lineHeight: '32px' }],
        '2xl': ['32px', { lineHeight: '40px' }],
      },
      borderRadius: {
        sm: '4px', DEFAULT: '8px', lg: '12px',
      },
      transitionDuration: {
        fast: '150ms', DEFAULT: '200ms', slow: '300ms',
      }
    }
  }
}
```

#### `src/lib/design-tokens.ts` (NEW)
Create TypeScript token exports:

```typescript
export const designTokens = {
  colors: {
    primary: '#DD1202',
    success: '#1DCC5C',
    background: { light: '#FFFFFF', dark: '#030303' },
    card: { light: '#F5F5F5', dark: '#1A1A1A' },
    text: { light: '#1A1A1A', dark: '#EEEEEE' },
    muted: { light: '#666666', dark: '#AAAAAA' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12 },
  transitions: { fast: '150ms', default: '200ms', slow: '300ms' },
} as const

export type DesignTokens = typeof designTokens
```

#### `postcss.config.mjs`
Add IE11 support:

```javascript
export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {
      overrideBrowserslist: ['last 2 versions', 'IE 11', 'Edge >= 15']
    },
    'postcss-preset-env': {
      stage: 3,
      features: { 'custom-properties': { preserve: true } }
    }
  }
}
```

#### `src/components/ThemeProvider.tsx`
Update theme provider:

```typescript
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="rentsight-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
```

---

### Phase 2: Components

#### `src/components/ui/button.tsx`
Redesign button component:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-[opacity,transform] duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:brightness-110 active:brightness-90',
        secondary: 'bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark hover:bg-hover dark:hover:bg-hover-dark',
        ghost: 'bg-transparent text-text dark:text-text-dark hover:bg-hover dark:hover:bg-hover-dark',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

Repeat pattern for Card, Input, Badge, etc.

---

### Phase 3: Layout

#### `src/components/Layout/Sidebar.tsx` (NEW)
Create desktop sidebar:

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Receipt, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/rent-entries', icon: Home, label: 'Rent Entries' },
  { href: '/expense-entries', icon: Receipt, label: 'Expenses' },
  { href: '/tags', icon: Tag, label: 'Tags' },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-card dark:bg-card-dark border-r border-border dark:border-border-dark">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary">RentSight</h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-md transition-[background,color] duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text dark:text-text-dark hover:bg-hover dark:hover:bg-hover-dark'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

#### `src/components/Layout/BottomNav.tsx` (NEW)
Create mobile bottom nav:

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Receipt, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/rent-entries', icon: Home, label: 'Rent' },
  { href: '/expense-entries', icon: Receipt, label: 'Expenses' },
  { href: '/tags', icon: Tag, label: 'Tags' },
]

export function BottomNav() {
  const pathname = usePathname()
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card dark:bg-card-dark border-t border-border dark:border-border-dark z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted dark:text-muted-dark'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

#### `src/app/layout.tsx`
Update root layout:

```typescript
import { Sidebar } from '@/components/Layout/Sidebar'
import { BottomNav } from '@/components/Layout/BottomNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
            <Sidebar />
            <main className="pb-16 md:pb-0 md:pl-64 p-5">
              {children}
            </main>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

### Phase 5: Data Virtualization

Install virtualization library:

```bash
npm install @tanstack/react-virtual
```

#### Example virtualized table:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function VirtualizedTable({ data }: { data: RentEntry[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  })
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <RentEntryRow entry={data[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Testing

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Accessibility Tests

```bash
npm run test:accessibility
```

### Visual Regression Tests

Create new test file:

```typescript
// tests/visual/redesign.spec.ts
import { test, expect } from '@playwright/test'

const pages = ['/', '/dashboard', '/login']
const themes = ['light', 'dark']
const viewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' }
]

for (const page of pages) {
  for (const theme of themes) {
    for (const viewport of viewports) {
      test(`${page} - ${theme} - ${viewport.name}`, async ({ page: p }) => {
        await p.setViewportSize(viewport)
        await p.goto(page)
        await p.evaluate((t) => {
          localStorage.setItem('rentsight-theme', t)
          document.documentElement.classList.toggle('dark', t === 'dark')
        }, theme)
        await p.waitForLoadState('networkidle')
        await expect(p).toHaveScreenshot(`${page.replace('/', 'home')}-${theme}-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixels: 100
        })
      })
    }
  }
}
```

Run tests:
```bash
npx playwright test tests/visual --update-snapshots  # Create baselines
npx playwright test tests/visual                      # Compare
```

---

## Browser Testing

### Modern Browsers
Use Playwright's built-in browsers:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit  # Safari
```

### IE11 Testing

Option 1: BrowserStack (recommended)
- Sign up at browserstack.com
- Use their live testing feature for manual QA
- Select Windows 7/10 with IE11

Option 2: Local VM
- Download Windows 10 VM from Microsoft
- Install IE11 (or use Edge Legacy mode)
- Test manually

**IE11 Checklist**:
- ✅ Layout renders correctly (Flexbox, no Grid)
- ✅ Colors display (fallback values before custom properties)
- ✅ Navigation works (Sidebar/BottomNav)
- ✅ Forms submit correctly
- ✅ Charts render (with aggregated data)
- ⚠️ Animations may be instant (acceptable per spec)

---

## Performance Testing

### Large Dataset Test

```typescript
// tests/performance/large-datasets.spec.ts
import { test, expect } from '@playwright/test'

test('dashboard handles 10,000 entries', async ({ page }) => {
  // Seed database with 10,000 entries (test helper)
  await seedDatabase(10000)
  
  await page.goto('/dashboard')
  
  // Measure initial render
  const startTime = Date.now()
  await page.waitForSelector('[data-testid="analytics-chart"]')
  const renderTime = Date.now() - startTime
  
  expect(renderTime).toBeLessThan(2000) // 2-second target
  
  // Test interaction performance
  await page.click('[data-testid="filter-button"]')
  await page.waitForSelector('[data-testid="filter-dropdown"]')
  
  // Verify smooth scrolling (60fps)
  const scrollPerformance = await page.evaluate(() => {
    const table = document.querySelector('[data-testid="rent-table"]')
    return new Promise((resolve) => {
      let frameCount = 0
      const start = performance.now()
      
      function countFrames() {
        frameCount++
        if (performance.now() - start < 1000) {
          requestAnimationFrame(countFrames)
        } else {
          resolve(frameCount)
        }
      }
      
      table?.scrollBy(0, 100)
      requestAnimationFrame(countFrames)
    })
  })
  
  expect(scrollPerformance).toBeGreaterThan(55) // ~60fps
})
```

---

## Troubleshooting

### Issue: Tailwind classes not applying
**Solution**: Restart dev server after `tailwind.config.js` changes

### Issue: Dark mode not persisting
**Solution**: Check localStorage in browser DevTools, ensure `rentsight-theme` key exists

### Issue: IE11 layout broken
**Solution**: Check for CSS Grid usage (not supported), use Flexbox instead

### Issue: Animations janky
**Solution**: Ensure only `opacity` and `transform` animated, check GPU acceleration

### Issue: Visual regression tests failing
**Solution**: Minor pixel differences acceptable (anti-aliasing), use `maxDiffPixels` option

---

## Resources

- **Specification**: `specs/003-as-a-developer/spec.md`
- **Research**: `specs/003-as-a-developer/research.md`
- **Design System**: `specs/003-as-a-developer/contracts/design-system.md`
- **Plan**: `specs/003-as-a-developer/plan.md`
- **Dribbble Reference**: https://dribbble.com/shots/26618807-AI-Hiring-SaaS-CRM-Web-App

**External Docs**:
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [Playwright](https://playwright.dev/)

---

## Next Steps

1. ✅ Read the specification (`spec.md`)
2. ✅ Review research decisions (`research.md`)
3. ✅ Study design system (`contracts/design-system.md`)
4. ⏭️ Begin Phase 1: Foundation (Tailwind config, theme setup)
5. ⏭️ Continue with Phase 2: Core components redesign
6. ⏭️ Tasks will be generated via `/speckit.tasks` command

**Ready to start coding!** 🚀

