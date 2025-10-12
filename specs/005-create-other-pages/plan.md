# Implementation Plan: Create other pages

**Branch**: `005-create-other-pages` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/005-create-other-pages/spec.md`

## Summary

Create five new pages for the RentSight application: Settings (user profile and preferences), Properties Management (formal property entity with CRUD operations), Help & Documentation (FAQs and searchable content), Reports (advanced reporting with tax preparation), and About (application info and legal documents). The Properties Management page introduces a new formal Property entity that works alongside existing tags, providing structured property data (name, address, type, dates, notes) while maintaining tag-based categorization flexibility. All pages must follow the existing design system, maintain WCAG AA accessibility compliance, and support responsive layouts with sidebar navigation (desktop/tablet) and bottom navigation (mobile).

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15.5.4 (React 19.1.0)  
**Primary Dependencies**: 
- UI: Tailwind CSS 4, shadcn/ui 3.4.0, Radix UI primitives, lucide-react
- Data: Prisma 6.17.0, @supabase/ssr 0.7.0
- State: React hooks, next-themes for theme management
- Forms: Native React forms with validation
- Virtualization: @tanstack/react-virtual (for large lists if needed)

**Storage**: PostgreSQL via Prisma ORM, Supabase for authentication  
**Testing**: Playwright 1.56.0 (E2E + accessibility), @axe-core/playwright 4.10.2  
**Target Platform**: Web (responsive: mobile/tablet/desktop), browsers: Chrome, Firefox, Safari, Edge (latest 2 versions). IE11 legacy support with acceptable fidelity (core functionality works, animations may degrade gracefully).  
**Project Type**: Web application (Next.js App Router with src/ structure)

**Performance Goals**: 
- Settings page loads in <= 1 second
- Properties page handles 1000+ properties with pagination, initial load <= 2 seconds
- Help search returns results <= 1 second
- Reports generation for 10,000 entries <= 5 seconds
- All pages maintain 60fps animations
- Page navigation perceived load time < 300ms

**Constraints**:
- Must follow existing design system (colors, typography, spacing from design-tokens.ts)
- Must maintain WCAG AA accessibility compliance (4.5:1 contrast ratio)
- Must support sidebar navigation (≥768px) and bottom navigation (<768px)
- Must support both dark and light themes
- Must work with existing Supabase authentication
- Must maintain existing API patterns
- Password changes require Supabase Auth API integration
- Property entity must coexist with existing tag system
- IE11 support provides acceptable fidelity only (no animations, basic CSS fallbacks)
- Modern browsers (Chrome, Firefox, Safari, Edge) receive full experience

**Scale/Scope**: 
- 5 new pages (Settings, Properties, Help, Reports, About)
- 1 new database entity (Property) with relations to RentEntry and ExpenseEntry
- ~15-20 new components (page components, forms, lists, cards)
- API routes for property CRUD and reports generation
- Support for 1000+ properties per user
- Support for help content search
- Export functionality for reports (PDF, CSV, Excel)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality
- ✅ **PASS**: All new code will follow existing TypeScript strict mode, ESLint, and Prettier configurations
- ✅ **PASS**: Components will use existing design system and shadcn/ui patterns
- ✅ **PASS**: All new pages will follow Next.js App Router conventions
- ✅ **PASS**: Code will be modular and reusable, following DRY principles
- ✅ **PASS**: All code will be reviewed before merging

### II. Comprehensive Testing
- ✅ **PASS**: Playwright E2E tests for all new pages and user flows
- ✅ **PASS**: Accessibility tests for WCAG AA compliance on all pages
- ✅ **PASS**: Form validation testing for Settings and Properties forms
- ✅ **PASS**: Responsive testing across mobile, tablet, and desktop breakpoints
- ✅ **PASS**: Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ **PASS**: Integration tests for property-entry associations
- ✅ **PASS**: Performance tests for large property lists and report generation

### III. Performance Optimization
- ✅ **PASS**: Properties page will use pagination/virtualization for large lists
- ✅ **PASS**: Help search will be optimized with debouncing
- ✅ **PASS**: Reports will use server-side processing for large datasets
- ✅ **PASS**: All pages will use Next.js server components where appropriate
- ✅ **PASS**: Images and assets will be optimized
- ✅ **PASS**: Performance budgets defined and will be monitored

**Constitution Status**: ✅ **APPROVED** - All core principles satisfied

## Project Structure

### Documentation (this feature)

```
specs/005-create-other-pages/
├── plan.md              # This file
├── research.md          # Technical research and decisions
├── data-model.md        # Database schema updates
├── quickstart.md        # Developer implementation guide
├── contracts/           # API contracts
│   └── openapi.yaml    # API endpoints specification
├── checklists/
│   └── requirements.md  # Quality validation (complete)
└── tasks.md             # Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```
src/
├── app/
│   ├── settings/              # NEW: Settings page
│   │   └── page.tsx          # User profile and preferences
│   ├── properties/            # NEW: Properties management page
│   │   └── page.tsx          # Property list and CRUD
│   ├── help/                  # NEW: Help and documentation page
│   │   └── page.tsx          # FAQs and searchable content
│   ├── reports/               # NEW: Reports page
│   │   └── page.tsx          # Advanced reporting
│   ├── about/                 # NEW: About page
│   │   └── page.tsx          # App info and legal
│   ├── api/
│   │   ├── properties/        # NEW: Property CRUD endpoints
│   │   │   ├── route.ts      # GET all, POST create
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET, PUT, DELETE by ID
│   │   ├── user/              # NEW: User profile endpoints
│   │   │   ├── profile/
│   │   │   │   └── route.ts  # GET, PUT profile
│   │   │   └── preferences/
│   │   │       └── route.ts  # GET, PUT preferences
│   │   ├── reports/           # NEW: Report generation endpoints
│   │   │   ├── generate/
│   │   │   │   └── route.ts  # POST generate report
│   │   │   └── export/
│   │   │       └── route.ts  # POST export report
│   │   └── help/              # NEW: Help search endpoint
│   │       └── search/
│   │           └── route.ts  # GET search help content
│   ├── dashboard/             # EXISTING (reference for integration)
│   ├── layout.tsx             # EXISTING (navigation includes new pages)
│   └── globals.css            # EXISTING (no changes)
│
├── components/
│   ├── settings/              # NEW: Settings components
│   │   ├── ProfileForm.tsx   # Profile edit form
│   │   ├── PasswordForm.tsx  # Password change form
│   │   └── PreferencesForm.tsx # Preferences form
│   ├── properties/            # NEW: Property components
│   │   ├── PropertyList.tsx  # Property list with pagination
│   │   ├── PropertyItem.tsx  # Individual property card
│   │   ├── PropertyForm.tsx  # Property create/edit form
│   │   └── PropertySelector.tsx # Dropdown for selecting property
│   ├── help/                  # NEW: Help components
│   │   ├── HelpSearch.tsx    # Search bar with results
│   │   ├── FAQList.tsx       # FAQ accordion
│   │   └── HelpArticle.tsx   # Article display
│   ├── reports/               # NEW: Report components
│   │   ├── ReportFilters.tsx # Filter form for reports
│   │   ├── ReportDisplay.tsx # Report visualization
│   │   └── ReportExport.tsx  # Export button with format options
│   ├── forms/                 # EXISTING (update for property selector)
│   │   ├── rent-entry-form.tsx # UPDATE: Add property selector
│   │   └── expense-entry-form.tsx # UPDATE: Add property selector
│   ├── ui/                    # EXISTING (may add new components)
│   │   ├── button.tsx         # EXISTING
│   │   ├── card.tsx           # EXISTING
│   │   ├── input.tsx          # EXISTING
│   │   ├── select.tsx         # EXISTING or NEW
│   │   ├── textarea.tsx       # EXISTING or NEW
│   │   ├── accordion.tsx      # NEW for FAQs
│   │   └── pagination.tsx     # NEW for property list
│   └── Layout/                # EXISTING (update navigation)
│       ├── Sidebar.tsx        # UPDATE: Add new page links
│       └── BottomNav.tsx      # UPDATE: Add new page links
│
├── lib/
│   ├── design-tokens.ts       # EXISTING (no changes)
│   ├── utils.ts               # EXISTING (may add utilities)
│   ├── supabase/              # EXISTING (use for auth operations)
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── validations.ts         # NEW: Form validation utilities
│   └── reports/               # NEW: Report generation logic
│       ├── income-summary.ts
│       ├── expense-breakdown.ts
│       └── tax-report.ts
│
├── services/
│   ├── propertyService.ts     # NEW: Property CRUD operations
│   ├── userService.ts         # NEW: User profile operations
│   └── tagService.ts          # EXISTING (no changes)
│
└── types/
    ├── property.ts            # NEW: Property type definitions
    ├── user.ts                # NEW: User profile type definitions
    └── report.ts              # NEW: Report type definitions

prisma/
├── schema.prisma              # UPDATE: Add Property model
└── migrations/                # NEW migration for Property table
    └── [timestamp]_add_properties/
        └── migration.sql

tests/
├── e2e/
│   ├── settings.spec.ts       # NEW: Settings page tests
│   ├── properties.spec.ts     # NEW: Properties page tests
│   ├── help.spec.ts           # NEW: Help page tests
│   ├── reports.spec.ts        # NEW: Reports page tests
│   └── about.spec.ts          # NEW: About page tests
├── accessibility.spec.ts      # UPDATE: Test new pages
└── visual/
    ├── settings.spec.ts       # NEW: Visual regression for settings
    └── properties.spec.ts     # NEW: Visual regression for properties
```

**Structure Decision**: Web application structure using Next.js App Router. Five new page routes in `src/app/` with corresponding component directories in `src/components/`. API routes follow RESTful patterns under `src/app/api/`. New Property entity added to Prisma schema with migration. Navigation components updated to include new pages. All new code follows existing patterns and integrates seamlessly with current architecture.

## Complexity Tracking

*No constitution violations requiring justification.*

This implementation adheres to all constitution principles:
- Code quality maintained through existing tooling and patterns
- Comprehensive testing for all new functionality
- Performance optimization with pagination, server-side processing, and efficient queries

The feature extends the existing architecture with new pages and a single new entity while maintaining consistency with established patterns.
