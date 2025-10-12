# Implementation Plan: Enhanced UX/UI Experience

**Branch**: `006-make-the-ux` | **Date**: October 12, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/006-make-the-ux/spec.md`

## Summary

This feature enhances the overall UX/UI quality of the RentSight application through multiple improvements: adding sidebar authentication controls with theme toggle, implementing skeleton loading states, fixing tag deletion bugs with cascade logic, improving light mode design with proper contrast and depth, adding smooth animations, establishing consistent color usage, implementing hybrid caching, enhancing the help page, and adding Russian market support (currency, platforms, formatting). The technical approach leverages Framer Motion for animations, hybrid caching architecture (client-side for UI state, server-side for queries), and extends existing Tailwind CSS design system with improved elevation and color semantics.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4 (App Router)  
**Primary Dependencies**: 
- React 19.1.0 (UI framework)
- Next.js 15.5.4 (React framework with App Router)
- Framer Motion (animation library - to be added)
- Tailwind CSS 4.x (styling)
- Prisma 6.17.0 (ORM)
- Supabase SSR 0.7.0 (auth and backend)
- Radix UI (component primitives)
- Zod 3.25.76 (validation)

**Storage**: 
- Database: PostgreSQL via Prisma
- Client cache: Browser localStorage/sessionStorage
- Server cache: In-memory (Next.js cache or Redis if needed)
- User preferences: Database (Prisma User/UserPreference tables)

**Testing**: 
- E2E: Playwright 1.56.0
- Accessibility: @axe-core/playwright 4.10.2
- Visual regression: Playwright screenshots
- Unit: N/A (React components tested via E2E)

**Target Platform**: Web (modern browsers - last 2 versions of Chrome, Firefox, Safari, Edge)

**Project Type**: Web application (Next.js full-stack with server-side rendering)

**Performance Goals**: 
- Skeleton screens visible < 100ms after navigation
- Animation frame rate: 60 fps (16.67ms per frame)
- Cache hit rate: ≥ 60% for dashboard/properties on repeat visits
- Page transitions: complete within 300ms
- Light mode WCAG AA contrast: 4.5:1 (normal text), 3:1 (large text)
- Theme toggle response: < 50ms perceived delay

**Constraints**: 
- Must respect prefers-reduced-motion for accessibility
- Animations must not block user interactions
- Cache must never show data stale > 5 minutes
- All animations must gracefully degrade on older browsers
- Must maintain existing API contracts (no breaking changes)
- Sidebar controls must fit in existing layout without overflow

**Scale/Scope**: 
- ~15 existing pages to update with skeleton screens
- ~50 existing components to apply animations
- 4 new currencies to support (focus on RUB)
- 4 Russian platforms to add (Avito, CIAN, Domclick, Yandex.Realty)
- 3 elevation levels to define (flat, raised, overlay)
- 4-5 semantic colors to standardize (primary, success, warning, error, muted)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality ✅

**Status**: COMPLIANT

**Rationale**: 
- All new code follows existing TypeScript/React/Next.js conventions
- Framer Motion is well-documented industry-standard library
- Animation components will be modular and reusable
- Cache utilities will be properly typed and testable
- Color system and elevation tokens will be centralized in design tokens file
- Tag deletion logic will be refactored into service layer with clear separation of concerns

### II. Comprehensive Testing ✅

**Status**: COMPLIANT

**Rationale**:
- Existing Playwright E2E infrastructure covers all user scenarios
- New acceptance scenarios (10 user stories × 4-6 scenarios = ~50 tests) will be added
- Visual regression tests for light mode contrast and elevation changes
- Accessibility tests for WCAG compliance and reduced motion
- Cache behavior can be tested by monitoring network requests
- Animation tests can verify smooth transitions and timing
- Tag deletion will have specific tests for cascade logic

### III. Performance Optimization ✅

**Status**: COMPLIANT  

**Rationale**:
- Skeleton screens directly address perceived performance
- Hybrid caching strategy reduces server load and improves response times
- Framer Motion uses hardware-accelerated CSS transforms
- Animation performance monitored via 60fps requirement
- Light mode optimization improves rendering performance with proper CSS
- Russian market options stored as configuration (no runtime overhead)
- Performance metrics defined in success criteria (SC-002, SC-005, SC-006, SC-007)

**Gate Result**: ✅ PASS - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```
specs/006-make-the-ux/
├── spec.md             # Feature specification (/speckit.specify output)
├── plan.md             # This file (/speckit.plan output)
├── research.md         # Phase 0 output (technical research)
├── data-model.md       # Phase 1 output (database schema changes)
├── quickstart.md       # Phase 1 output (developer onboarding)
├── contracts/          # Phase 1 output (API contracts if needed)
│   └── openapi.yaml    # REST API specifications
└── checklists/         # Quality validation
    └── requirements.md # Specification quality checklist
```

### Source Code (repository root)

This is a Next.js full-stack web application with the following structure:

```
src/
├── app/                        # Next.js App Router pages
│   ├── dashboard/              # Update: move ThemeToggle to Sidebar
│   ├── tags/                   # Update: fix deletion logic
│   ├── help/                   # Update: enhance with links
│   ├── api/                    # Update: add cache invalidation
│   │   ├── tags/[id]/          # Update: cascade deletion endpoint
│   │   └── cache/              # New: cache management endpoints
│   └── globals.css             # Update: light mode colors, elevation tokens
│
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx         # Update: add auth buttons + theme toggle at bottom
│   │   └── Navbar.tsx          # No changes needed
│   ├── ui/
│   │   ├── skeleton.tsx        # New: skeleton component primitives
│   │   ├── ThemeToggle.tsx     # Move to Sidebar
│   │   ├── card.tsx            # Update: add elevation variants
│   │   └── button.tsx          # Update: add color semantics
│   ├── tags/
│   │   └── TagList.tsx         # Update: fix delete handlers
│   ├── dashboard/              # Update: add skeleton loading
│   ├── properties/             # Update: add skeleton loading
│   ├── help/                   # Update: add page links
│   └── animations/             # New: Framer Motion wrapper components
│       ├── FadeIn.tsx
│       ├── ScaleIn.tsx
│       ├── StaggerChildren.tsx
│       └── PageTransition.tsx
│
├── lib/
│   ├── cache/                  # New: caching utilities
│   │   ├── client-cache.ts     # Client-side cache (localStorage)
│   │   └── server-cache.ts     # Server-side cache (memory/Redis)
│   ├── design-tokens.ts        # Update: add elevation, improve colors
│   ├── animation-utils.ts      # Update: add Framer Motion variants
│   └── regional-config.ts      # New: currency, platform, format configs
│
├── services/
│   ├── tagService.ts           # Update: add cascade deletion logic
│   └── cacheService.ts         # New: cache invalidation orchestration
│
├── types/
│   ├── regional.ts             # New: currency, platform types
│   └── cache.ts                # New: cache entry types
│
└── styles/
    ├── tokens.css              # Update: add CSS custom properties for elevation
    └── animations.css          # New: animation keyframes and utilities

prisma/
└── schema.prisma               # Update: add UserPreference fields (currency, dateFormat)

tests/
├── visual/
│   ├── light-mode.spec.ts      # New: WCAG contrast tests
│   ├── animations.spec.ts      # New: animation smoothness tests
│   └── elevation.spec.ts       # New: shadow/depth tests
├── e2e/
│   ├── sidebar-auth.spec.ts    # New: auth controls tests
│   ├── skeleton-loading.spec.ts # New: loading states tests
│   ├── tag-deletion.spec.ts    # Update: cascade deletion tests
│   └── cache-behavior.spec.ts  # New: cache invalidation tests
└── accessibility.spec.ts       # Update: add reduced-motion tests
```

**Structure Decision**: This is a standard Next.js 15 App Router web application. We're extending the existing structure with new animation components, caching utilities, and regional configuration. The App Router pattern keeps pages in `src/app/` with collocated API routes. Components follow atomic design principles with UI primitives in `components/ui/` and feature-specific components in dedicated folders. The addition of `lib/cache/` and `components/animations/` provides new infrastructure while maintaining existing conventions.

## Complexity Tracking

*No constitutional violations - this section intentionally left empty*

All implementation choices align with the project's constitutional principles:
- Code quality maintained through TypeScript, modular components, and design tokens
- Testing comprehensively covers all user scenarios with E2E, visual, and accessibility tests
- Performance optimized through caching, skeleton screens, and hardware-accelerated animations
