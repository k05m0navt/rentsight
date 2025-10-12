# Tasks: Enhanced UX/UI Experience

**Input**: Design documents from `/specs/006-make-the-ux/`  
**Branch**: `006-make-the-ux`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: ✅ Tests INCLUDED - This feature uses TDD with Playwright E2E tests per acceptance criteria

**Organization**: Tasks are grouped by user story (10 stories total) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US10)
- Include exact file paths in descriptions

## Path Conventions
- Next.js web app: `src/app/`, `src/components/`, `src/lib/`, `tests/`
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] **T001** Install Framer Motion animation library: `npm install framer-motion`
- [ ] **T002** Verify TypeScript compilation passes: `npx tsc --noEmit`
- [ ] **T003** [P] Update `.gitignore` to exclude cache files and animation build artifacts
- [ ] **T004** [P] Create directory structure for new components: `src/components/animations/`, `src/lib/cache/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] **T005** Create UserPreference Prisma model in `prisma/schema.prisma` (add theme, currency, dateFormat, numberFormat, preferredPlatforms, reducedMotion fields)
- [ ] **T006** Generate Prisma client: `npx prisma generate`
- [ ] **T007** Create and run database migration: `npx prisma migrate dev --name add_user_preferences`
- [ ] **T008** [P] Create type definitions in `src/types/cache.ts` (CacheEntry, CacheMetadata interfaces)
- [ ] **T009** [P] Create type definitions in `src/types/regional.ts` (Currency, Platform, DateFormatConfig interfaces)
- [ ] **T010** [P] Create base design tokens file `src/lib/design-tokens.ts` with elevation and color system exports
- [ ] **T011** [P] Create regional configuration file `src/lib/regional-config.ts` with currencies, platforms, dateFormats
- [ ] **T012** [P] Create animation utilities file `src/lib/animation-utils.ts` with Framer Motion variants (fadeIn, scaleIn, stagger)
- [ ] **T013** Create seed script `scripts/create-default-preferences.ts` to add preferences for existing users (this script will be created as part of this task and then executed in T014)
- [ ] **T014** Run seed script to populate default preferences: `npx tsx scripts/create-default-preferences.ts`
- [ ] **T015** Update CSS tokens in `src/styles/tokens.css` with elevation shadow variables and WCAG AA compliant light mode colors

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sidebar Authentication Controls (Priority: P1) 🎯 MVP

**Goal**: Move theme toggle to sidebar bottom and add Sign In/Log Out buttons for better UX and navigation clarity

**Independent Test**: Can be fully tested by viewing sidebar while logged out (Sign In button visible), logging in (Log Out button visible), and toggling theme (preference persisted)

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] **T016** [P] [US1] E2E test: Unauthenticated user sees Sign In button at sidebar bottom in `tests/e2e/sidebar-auth.spec.ts`
- [ ] **T017** [P] [US1] E2E test: Authenticated user sees Log Out button at sidebar bottom in `tests/e2e/sidebar-auth.spec.ts`
- [ ] **T018** [P] [US1] E2E test: Theme toggle visible at sidebar bottom in `tests/e2e/sidebar-auth.spec.ts`
- [ ] **T019** [P] [US1] E2E test: Theme preference persists across sessions in `tests/e2e/sidebar-auth.spec.ts`
- [ ] **T020** [P] [US1] E2E test: Log Out button logs out user and redirects to login in `tests/e2e/sidebar-auth.spec.ts`

### Implementation for User Story 1

- [ ] **T021** [US1] Remove ThemeToggle from dashboard page: delete/comment ThemeToggle import and usage in `src/app/dashboard/page.tsx`
- [ ] **T022** [US1] Update Sidebar component `src/components/Layout/Sidebar.tsx`:
  - Add Sign In button at bottom (visible when !user)
  - Add Log Out button at bottom (visible when user)
  - Move ThemeToggle to bottom section
  - Add bottom section container with proper spacing
  - Handle authentication state from Supabase
- [ ] **T023** [US1] Create API route `src/app/api/preferences/route.ts` for GET/PUT user preferences
- [ ] **T024** [US1] Update ThemeToggle component `src/components/ui/ThemeToggle.tsx` to persist theme to user preferences API
- [ ] **T025** [US1] Verify all tests pass: `npx playwright test tests/e2e/sidebar-auth.spec.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Skeleton Loading States (Priority: P1)

**Goal**: Replace jarring "Loading..." text with skeleton screens that match content layout for better perceived performance

**Independent Test**: Can be tested by throttling network speed and observing skeleton screens on dashboard, properties, and other pages

### Tests for User Story 2

- [ ] **T026** [P] [US2] E2E test: Dashboard shows skeleton screens during loading in `tests/e2e/skeleton-loading.spec.ts`
- [ ] **T027** [P] [US2] E2E test: Properties page shows skeleton screens during loading in `tests/e2e/skeleton-loading.spec.ts`
- [ ] **T028** [P] [US2] E2E test: Skeleton screens match actual content layout in `tests/e2e/skeleton-loading.spec.ts`
- [ ] **T029** [P] [US2] E2E test: Smooth transition from skeleton to content in `tests/e2e/skeleton-loading.spec.ts`
- [ ] **T030** [P] [US2] E2E test: Skeletons appear immediately on navigation in `tests/e2e/skeleton-loading.spec.ts`

### Implementation for User Story 2

- [ ] **T031** [P] [US2] Create base skeleton component in `src/components/ui/skeleton.tsx` with Tailwind animate-pulse
- [ ] **T032** [P] [US2] Create SkeletonCard component in `src/components/ui/skeleton.tsx`
- [ ] **T033** [P] [US2] Create SkeletonTable component in `src/components/ui/skeleton.tsx`
- [ ] **T034** [P] [US2] Create SkeletonText component in `src/components/ui/skeleton.tsx`
- [ ] **T035** [US2] Create DashboardSkeleton component in `src/components/dashboard/DashboardSkeleton.tsx` matching dashboard layout
- [ ] **T036** [US2] Add Suspense boundary to `src/app/dashboard/page.tsx` with DashboardSkeleton fallback
- [ ] **T037** [US2] Create PropertyListSkeleton component in `src/components/properties/PropertyListSkeleton.tsx`
- [ ] **T038** [US2] Add Suspense boundary to `src/app/properties/page.tsx` with PropertyListSkeleton fallback
- [ ] **T039** [US2] Create RentEntrySkeleton component in `src/components/rent-entries/RentEntrySkeleton.tsx`
- [ ] **T040** [US2] Add Suspense boundary to `src/app/rent-entries/page.tsx` with RentEntrySkeleton fallback
- [ ] **T041** [US2] Create ExpenseEntrySkeleton component in `src/components/expense-entries/ExpenseEntrySkeleton.tsx`
- [ ] **T042** [US2] Add Suspense boundary to `src/app/expense-entries/page.tsx` with ExpenseEntrySkeleton fallback
- [ ] **T043** [US2] Create TagListSkeleton component in `src/components/tags/TagListSkeleton.tsx`
- [ ] **T044** [US2] Add Suspense boundary to `src/app/tags/page.tsx` with TagListSkeleton fallback
- [ ] **T045** [US2] Create ReportsSkeleton component in `src/components/reports/ReportsSkeleton.tsx`
- [ ] **T046** [US2] Add Suspense boundary to `src/app/reports/page.tsx` with ReportsSkeleton fallback
- [ ] **T047** [US2] Verify all tests pass: `npx playwright test tests/e2e/skeleton-loading.spec.ts`

**Checkpoint**: Skeleton loading states functional across all major pages

---

## Phase 5: User Story 3 - Tag Deletion Fix (Priority: P1)

**Goal**: Fix tag deletion errors with cascade deletion logic, confirmation dialog, and proper feedback

**Independent Test**: Can be tested by creating tags, assigning them to properties/entries, and attempting deletion with various scenarios

### Tests for User Story 3

- [ ] **T048** [P] [US3] E2E test: Delete unused tag successfully in `tests/e2e/tag-deletion.spec.ts`
- [ ] **T049** [P] [US3] E2E test: Show confirmation with counts for tag in use in `tests/e2e/tag-deletion.spec.ts`
- [ ] **T050** [P] [US3] E2E test: Cascade deletion removes tag from all associations in `tests/e2e/tag-deletion.spec.ts`
- [ ] **T051** [P] [US3] E2E test: Success message shows association count in `tests/e2e/tag-deletion.spec.ts`
- [ ] **T052** [P] [US3] E2E test: Tag list updates immediately after deletion in `tests/e2e/tag-deletion.spec.ts`

### Implementation for User Story 3

- [ ] **T053** [US3] Implement `getTagWithUsage` function in `src/services/tagService.ts` to count associations
- [ ] **T054** [US3] Implement `deleteTagWithCascade` function in `src/services/tagService.ts` with Prisma transaction
- [ ] **T055** [US3] Update DELETE endpoint in `src/app/api/tags/[id]/route.ts` to use cascade deletion logic
- [ ] **T056** [US3] Create GET endpoint in `src/app/api/tags/[id]/usage/route.ts` for usage counts
- [ ] **T057** [US3] Add confirmation dialog to `src/components/tags/TagList.tsx` showing usage counts
- [ ] **T058** [US3] Update delete button handler in `src/components/tags/TagList.tsx` to call usage endpoint first
- [ ] **T059** [US3] Add success toast notification in `src/components/tags/TagList.tsx` after successful deletion
- [ ] **T060** [US3] Implement cache invalidation in `src/services/cacheService.ts` for tag-related caches
- [ ] **T061** [US3] Verify all tests pass: `npx playwright test tests/e2e/tag-deletion.spec.ts`

**Checkpoint**: Tag deletion works reliably with cascade logic and proper user feedback

---

## Phase 6: User Story 4 - Enhanced Light Mode Design (Priority: P2)

**Goal**: Improve light mode with WCAG AA contrast, better colors, and professional appearance

**Independent Test**: Can be tested by switching to light mode and evaluating all pages for readability, contrast, and visual appeal

### Tests for User Story 4

- [ ] **T062** [P] [US4] Visual test: Light mode meets WCAG AA contrast (4.5:1) in `tests/visual/light-mode.spec.ts`
- [ ] **T063** [P] [US4] Visual test: Cards have proper shadows and borders in light mode in `tests/visual/light-mode.spec.ts`
- [ ] **T064** [P] [US4] Visual test: Buttons are vibrant and clearly interactive in light mode in `tests/visual/light-mode.spec.ts`
- [ ] **T065** [P] [US4] Visual test: Color palette is cohesive across all pages in `tests/visual/light-mode.spec.ts`
- [ ] **T066** [P] [US4] Accessibility test: Light mode passes automated contrast tests in `tests/accessibility.spec.ts`

### Implementation for User Story 4

- [ ] **T067** [P] [US4] Update light mode color tokens in `src/styles/tokens.css` with WCAG AA compliant colors
- [ ] **T068** [P] [US4] Update text color variables for proper contrast in `src/styles/tokens.css`
- [ ] **T069** [US4] Update Card component `src/components/ui/card.tsx` with light mode shadows and borders
- [ ] **T070** [US4] Update Button component `src/components/ui/button.tsx` with vibrant light mode colors
- [ ] **T071** [US4] Update Input component `src/components/ui/input.tsx` with proper light mode styling
- [ ] **T072** [US4] Update Badge component `src/components/ui/badge.tsx` with light mode variants
- [ ] **T073** [US4] Update Alert component `src/components/ui/alert.tsx` with proper light mode colors
- [ ] **T074** [US4] Test all pages in light mode manually for consistency
- [ ] **T075** [US4] Run Playwright visual regression tests: `npx playwright test tests/visual/light-mode.spec.ts --update-snapshots`
- [ ] **T076** [US4] Verify all tests pass: `npx playwright test tests/visual/light-mode.spec.ts tests/accessibility.spec.ts`

**Checkpoint**: Light mode is polished, accessible, and professional across all pages

---

## Phase 7: User Story 5 - Smooth Animations (Priority: P2)

**Goal**: Add smooth Framer Motion animations to page transitions, modals, and interactive elements

**Independent Test**: Can be tested by interacting with UI elements and observing smooth transitions

### Tests for User Story 5

- [ ] **T077** [P] [US5] Visual test: Page transitions fade smoothly (200-300ms) in `tests/visual/animations.spec.ts`
- [ ] **T078** [P] [US5] Visual test: Modals scale in smoothly in `tests/visual/animations.spec.ts`
- [ ] **T079** [P] [US5] Visual test: Hover states animate smoothly in `tests/visual/animations.spec.ts`
- [ ] **T080** [P] [US5] Visual test: List items animate with stagger effect in `tests/visual/animations.spec.ts`
- [ ] **T081** [P] [US5] Accessibility test: Animations respect prefers-reduced-motion in `tests/accessibility.spec.ts`

### Implementation for User Story 5

- [ ] **T082** [P] [US5] Create FadeIn animation component in `src/components/animations/FadeIn.tsx` with "use client"
- [ ] **T083** [P] [US5] Create ScaleIn animation component in `src/components/animations/ScaleIn.tsx` with "use client"
- [ ] **T084** [P] [US5] Create StaggerChildren animation component in `src/components/animations/StaggerChildren.tsx` with "use client"
- [ ] **T085** [P] [US5] Create PageTransition animation component in `src/components/animations/PageTransition.tsx` with "use client"
- [ ] **T086** [US5] Wrap dashboard content with PageTransition in `src/app/dashboard/page.tsx`
- [ ] **T087** [US5] Wrap properties page with PageTransition in `src/app/properties/page.tsx`
- [ ] **T088** [US5] Add FadeIn to dashboard cards in `src/components/dashboard/DashboardContent.tsx`
- [ ] **T089** [US5] Add StaggerChildren to property list in `src/components/properties/PropertyList.tsx`
- [ ] **T090** [US5] Add ScaleIn to modal dialogs (look for Dialog/Modal components)
- [ ] **T091** [US5] Add hover animations to Card component `src/components/ui/card.tsx` with transition-transform
- [ ] **T092** [US5] Add MotionConfig with reducedMotion="user" to root layout `src/app/layout.tsx`
- [ ] **T093** [US5] Test animations with Chrome DevTools Performance tab (60fps target)
- [ ] **T094** [US5] Verify all tests pass: `npx playwright test tests/visual/animations.spec.ts`

**Checkpoint**: Smooth animations throughout app with accessibility support

---

## Phase 8: User Story 6 - Improved Color Usage (Priority: P2)

**Goal**: Establish and apply consistent semantic color system (primary, success, warning, error, muted)

**Independent Test**: Can be tested by auditing all UI components for color usage patterns and verifying semantic consistency

### Tests for User Story 6

- [ ] **T095** [P] [US6] Visual test: Similar actions use same color scheme in `tests/visual/color-palette.spec.ts`
- [ ] **T096** [P] [US6] Visual test: Destructive actions consistently use error colors in `tests/visual/color-palette.spec.ts`
- [ ] **T097** [P] [US6] Visual test: Success messages use consistent green in `tests/visual/color-palette.spec.ts`
- [ ] **T098** [P] [US6] Visual test: Primary actions use consistent brand color in `tests/visual/color-palette.spec.ts`
- [ ] **T099** [P] [US6] Visual test: No more than 4 semantic colors for interactions in `tests/visual/color-palette.spec.ts`

### Implementation for User Story 6

- [ ] **T100** [US6] Define semantic color constants in `src/lib/design-tokens.ts` (primary, success, warning, error, muted)
- [ ] **T101** [US6] Update Button component `src/components/ui/button.tsx` with semantic color variants
- [ ] **T102** [US6] Update Badge component `src/components/ui/badge.tsx` with semantic color variants
- [ ] **T103** [US6] Update Alert component `src/components/ui/alert.tsx` with semantic colors
- [ ] **T104** [US6] Audit and update all delete buttons to use error/destructive variant across components
- [ ] **T105** [US6] Audit and update all success messages/toasts to use success color
- [ ] **T106** [US6] Audit and update all primary CTAs to use primary brand color
- [ ] **T107** [US6] Update CSS tokens in `src/styles/tokens.css` with semantic color variables
- [ ] **T108** [US6] Document color system in `docs/design-system/colors.md`
- [ ] **T109** [US6] Verify all tests pass: `npx playwright test tests/visual/color-palette.spec.ts`

**Checkpoint**: Consistent semantic color usage across entire application

---

## Phase 9: User Story 7 - Depth and Visual Realism (Priority: P2)

**Goal**: Add subtle shadows, layering, and 3-level elevation system for visual depth

**Independent Test**: Can be tested by comparing before/after screenshots and evaluating visual clarity

### Tests for User Story 7

- [ ] **T110** [P] [US7] Visual test: Cards have subtle resting shadows in `tests/visual/elevation.spec.ts`
- [ ] **T111** [P] [US7] Visual test: Hover increases shadow depth in `tests/visual/elevation.spec.ts`
- [ ] **T112** [P] [US7] Visual test: Modals have strong overlay shadows in `tests/visual/elevation.spec.ts`
- [ ] **T113** [P] [US7] Visual test: Clear visual hierarchy in page layouts in `tests/visual/elevation.spec.ts`
- [ ] **T114** [P] [US7] Visual test: Input focus shows elevation change in `tests/visual/elevation.spec.ts`

### Implementation for User Story 7

- [ ] **T115** [US7] Define 3 elevation levels in `src/lib/design-tokens.ts` (flat, raised, overlay)
- [ ] **T116** [US7] Add elevation shadow utilities to `tailwind.config.js` (elevation-1, elevation-2, elevation-3)
- [ ] **T117** [US7] Update Card component `src/components/ui/card.tsx` with raised elevation by default
- [ ] **T118** [US7] Add hover elevation increase to interactive cards
- [ ] **T119** [US7] Update Dialog/Modal components with overlay elevation (search for dialog components)
- [ ] **T120** [US7] Update Sidebar `src/components/Layout/Sidebar.tsx` with appropriate elevation separation
- [ ] **T121** [US7] Add focus elevation to Input component `src/components/ui/input.tsx`
- [ ] **T122** [US7] Update table rows in table components with flat elevation
- [ ] **T123** [US7] Test elevation consistency across all pages manually
- [ ] **T124** [US7] Verify all tests pass: `npx playwright test tests/visual/elevation.spec.ts`

**Checkpoint**: Visual depth and hierarchy established throughout application

---

## Phase 10: User Story 8 - Caching (Priority: P3)

**Goal**: Implement hybrid caching (client + server) for improved performance on repeat visits

**Independent Test**: Can be tested by measuring page load times on repeat visits and monitoring network requests

### Tests for User Story 8

- [ ] **T125** [P] [US8] E2E test: Dashboard data cached on repeat visit in `tests/e2e/cache-behavior.spec.ts`
- [ ] **T126** [P] [US8] E2E test: Properties appear instantly from cache in `tests/e2e/cache-behavior.spec.ts`
- [ ] **T127** [P] [US8] E2E test: Cache invalidated after write operation in `tests/e2e/cache-behavior.spec.ts`
- [ ] **T128** [P] [US8] E2E test: Stale cache not served beyond 5 minutes in `tests/e2e/cache-behavior.spec.ts`
- [ ] **T129** [P] [US8] E2E test: Cache hit rate ≥60% on repeat visits in `tests/e2e/cache-behavior.spec.ts`

### Implementation for User Story 8

- [ ] **T130** [US8] Implement client cache utility in `src/lib/cache/client-cache.ts` (get, set, invalidate, evict)
- [ ] **T131** [US8] Implement server cache wrappers in `src/lib/cache/server-cache.ts` using React cache() and unstable_cache()
- [ ] **T131a** [US8] Verify hybrid cache architecture: Test that client cache (localStorage) and server cache (React cache) work independently and together as designed
- [ ] **T132** [US8] Implement cache service in `src/services/cacheService.ts` for orchestrating invalidation
- [ ] **T133** [US8] Create cache invalidation API route in `src/app/api/cache/invalidate/route.ts`
- [ ] **T134** [US8] Add client-side caching to dashboard data fetching
- [ ] **T135** [US8] Add server-side caching to dashboard queries with getCachedDashboard wrapper
- [ ] **T136** [US8] Add client-side caching to properties list
- [ ] **T137** [US8] Add server-side caching to properties queries with getCachedProperties wrapper
- [ ] **T138** [US8] Add cache invalidation calls to property create/update/delete operations
- [ ] **T139** [US8] Add cache invalidation calls to tag delete operations
- [ ] **T140** [US8] Implement LRU eviction in client-cache.ts (max 50 entries)
- [ ] **T141** [US8] Add cache metrics logging (hits, misses, hit rate)
- [ ] **T142** [US8] Verify all tests pass: `npx playwright test tests/e2e/cache-behavior.spec.ts`

**Checkpoint**: Hybrid caching functional with 60%+ hit rate and proper invalidation

---

## Phase 11: User Story 9 - Enhanced Help Page (Priority: P3)

**Goal**: Improve help page with better organization, search, and links to app pages

**Independent Test**: Can be tested by navigating help page and evaluating content quality, organization, and usefulness

### Tests for User Story 9

- [ ] **T143** [P] [US9] E2E test: Help content organized into clear categories in `tests/e2e/help-page.spec.ts`
- [ ] **T144** [P] [US9] E2E test: Help search shows relevant results with highlights in `tests/e2e/help-page.spec.ts`
- [ ] **T145** [P] [US9] E2E test: Help articles include screenshots in `tests/e2e/help-page.spec.ts`
- [ ] **T146** [P] [US9] E2E test: Links to app pages open in new tabs in `tests/e2e/help-page.spec.ts`
- [ ] **T147** [P] [US9] E2E test: FAQ answers expand smoothly in `tests/e2e/help-page.spec.ts`

### Implementation for User Story 9

- [ ] **T148** [US9] Reorganize help content structure in `public/help/` with category subdirectories
- [ ] **T149** [US9] Update help page component `src/app/help/page.tsx` with improved category navigation
- [ ] **T150** [US9] Enhance HelpSearch component `src/components/help/HelpSearch.tsx` with better result highlighting
- [ ] **T151** [US9] Update help articles to include links to app pages (e.g., /dashboard, /properties)
- [ ] **T152** [US9] Add target="_blank" and rel="noopener" to all help article app links
- [ ] **T153** [US9] Update FAQ component `src/components/help/FAQList.tsx` with smooth expand animations
- [ ] **T154** [US9] Add screenshots/illustrations to key help articles in `public/help/articles/`
- [ ] **T155** [US9] Update contact support section with more prominent display
- [ ] **T156** [US9] Verify all tests pass: `npx playwright test tests/e2e/help-page.spec.ts`

**Checkpoint**: Help page provides excellent self-service support with clear navigation

---

## Phase 12: User Story 10 - Russian Market Options (Priority: P3)

**Goal**: Add Russian Ruble, Russian platforms, and regional formatting options

**Independent Test**: Can be tested by creating properties with RUB currency, selecting Russian platforms, and verifying formatting

### Tests for User Story 10

- [ ] **T157** [P] [US10] E2E test: RUB currency available in property forms in `tests/e2e/russian-market.spec.ts`
- [ ] **T158** [P] [US10] E2E test: Russian platforms (Avito, CIAN) available in dropdowns in `tests/e2e/russian-market.spec.ts`
- [ ] **T159** [P] [US10] E2E test: RUB amounts formatted with space separator in `tests/e2e/russian-market.spec.ts`
- [ ] **T160** [P] [US10] E2E test: DD.MM.YYYY date format option works in `tests/e2e/russian-market.spec.ts`
- [ ] **T161** [P] [US10] E2E test: Regional preferences persisted across sessions in `tests/e2e/russian-market.spec.ts`
- [ ] **T161a** [P] [US10] E2E test: Cache invalidated when currency or date format preference changes in `tests/e2e/russian-market.spec.ts`

### Implementation for User Story 10

- [ ] **T162** [US10] Add RUB currency configuration to `src/lib/regional-config.ts` (code, symbol, format function)
- [ ] **T163** [US10] Add Russian platforms to `src/lib/regional-config.ts` (Avito, CIAN, Domclick, Yandex.Realty)
- [ ] **T164** [US10] Add DD.MM.YYYY date format to `src/lib/regional-config.ts`
- [ ] **T165** [US10] Create regional API routes in `src/app/api/regional/currencies/route.ts`
- [ ] **T166** [US10] Create regional API routes in `src/app/api/regional/platforms/route.ts`
- [ ] **T167** [US10] Add currency selector to property form in `src/components/forms/PropertyForm.tsx`
- [ ] **T168** [US10] Add platform selector to property form in `src/components/forms/PropertyForm.tsx`
- [ ] **T169** [US10] Update user preference API to handle currency and dateFormat fields
- [ ] **T170** [US10] Create format helper functions in `src/lib/format-utils.ts` for currency and dates
- [ ] **T171** [US10] Apply RUB formatting to amount displays using format helpers
- [ ] **T172** [US10] Add date format preference to settings page
- [ ] **T173** [US10] Update help documentation to explain Russian market options
- [ ] **T174** [US10] Verify all tests pass: `npx playwright test tests/e2e/russian-market.spec.ts`
- [ ] **T174a** [US10] Verify cache invalidation works when user changes regional preferences (related to edge case in spec.md)

**Checkpoint**: Russian market users can use RUB currency and local platforms effectively

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [ ] **T175** [P] Run full E2E test suite: `npm run test:e2e`
- [ ] **T176** [P] Run accessibility test suite: `npm run test:accessibility`
- [ ] **T177** [P] Update all visual regression snapshots: `npx playwright test tests/visual/ --update-snapshots`
- [ ] **T177a** [P] Optional: Create consolidated test command in package.json: `"test:all": "npm run test:e2e && npm run test:accessibility && npx playwright test tests/visual/"` for single-command testing
- [ ] **T178** Run linter and fix issues: `npm run lint`
- [ ] **T179** Run TypeScript compiler check: `npx tsc --noEmit`
- [ ] **T180** [P] Update README.md with:
  - New features section (animations, caching, skeleton loading, Russian support)
  - Updated setup instructions (Framer Motion installation, database migration)
  - New dependencies list (add framer-motion)
  - Performance improvements section
  - Updated screenshots if UI changed significantly
- [ ] **T181** [P] Update quickstart.md if setup process changed
- [ ] **T182** Performance audit: Check that all animations run at 60fps
- [ ] **T183** Performance audit: Verify cache hit rate ≥60% on repeat visits
- [ ] **T184** Performance audit: Verify WCAG AA contrast compliance on all pages
- [ ] **T185** Manual testing: Test all 10 user stories end-to-end
- [ ] **T186** Create pull request with comprehensive description and test results
- [ ] **T187** Code review and address feedback
- [ ] **T188** Merge to main branch after approval

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phases 3-12)**: All depend on Foundational phase completion
  - P1 stories (US1-US3) should complete first (critical fixes)
  - P2 stories (US4-US7) can proceed in parallel after P1 or sequentially
  - P3 stories (US8-US10) can proceed in parallel after P2 or sequentially
- **Polish (Phase 13)**: Depends on all desired user stories being complete

### User Story Dependencies

All user stories are designed to be independently testable:

- **US1 - Sidebar Auth**: No dependencies, can start after Foundational
- **US2 - Skeleton Loading**: No dependencies, can start after Foundational
- **US3 - Tag Deletion**: No dependencies, can start after Foundational
- **US4 - Light Mode**: No dependencies, can start after Foundational
- **US5 - Animations**: No dependencies, can start after Foundational
- **US6 - Color Usage**: Recommended after US4 (Light Mode) for color consistency
- **US7 - Elevation**: Can work with US4, US6 but independently testable
- **US8 - Caching**: No dependencies, can start after Foundational
- **US9 - Help Page**: No dependencies, can start after Foundational
- **US10 - Russian Market**: No dependencies, can start after Foundational

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Components marked [P] can be built in parallel
- Services depend on models
- UI depends on services/APIs
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: All 4 tasks can run in parallel
- **Foundational Phase**: T008, T009, T010, T011, T012 can run in parallel
- **Test Phase**: All tests within a story marked [P] can run in parallel
- **Implementation Phase**: All tasks marked [P] within a story can run in parallel
- **User Stories**: Once Foundational complete, all user stories can start in parallel (if team capacity allows)

---

## Parallel Example: User Story 2 (Skeleton Loading)

```bash
# Launch all tests for User Story 2 together (TDD):
Task T026: E2E test for dashboard skeleton
Task T027: E2E test for properties skeleton
Task T028: E2E test for layout matching
Task T029: E2E test for smooth transition
Task T030: E2E test for immediate appearance

# Launch all skeleton components together:
Task T031: Base skeleton component
Task T032: SkeletonCard component
Task T033: SkeletonTable component
Task T034: SkeletonText component

# Launch page-specific skeletons together:
Task T035: DashboardSkeleton
Task T037: PropertyListSkeleton
Task T039: RentEntrySkeleton
Task T041: ExpenseEntrySkeleton
Task T043: TagListSkeleton
Task T045: ReportsSkeleton
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only - All P1)

1. Complete Phase 1: Setup (4 tasks)
2. Complete Phase 2: Foundational (11 tasks) - **CRITICAL - blocks all stories**
3. Complete Phase 3: Sidebar Auth (10 tasks)
4. **STOP and VALIDATE**: Test US1 independently
5. Complete Phase 4: Skeleton Loading (22 tasks)
6. **STOP and VALIDATE**: Test US1+US2 independently
7. Complete Phase 5: Tag Deletion (14 tasks)
8. **STOP and VALIDATE**: Test US1+US2+US3 independently
9. Deploy MVP with all P1 features

**MVP Totals**: 61 tasks covering critical UX fixes

### Incremental Delivery

1. **Sprint 1**: Setup + Foundational + US1-US3 (P1) → Critical fixes deployed (61 tasks)
2. **Sprint 2**: US4-US7 (P2) → Visual improvements deployed (70 tasks)
3. **Sprint 3**: US8-US10 (P3) → Performance and regional support (50 tasks)
4. **Sprint 4**: Polish & integration → Production ready (14 tasks)

**Total**: 195 tasks

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

**Week 1 (P1 Stories)**:
- Developer A: US1 - Sidebar Auth (10 tasks)
- Developer B: US2 - Skeleton Loading (22 tasks)
- Developer C: US3 - Tag Deletion (14 tasks)

**Week 2 (P2 Stories - Part 1)**:
- Developer A: US4 - Light Mode (15 tasks)
- Developer B: US5 - Animations (18 tasks)
- Developer C: US6 - Color Usage (15 tasks)

**Week 3 (P2 Stories - Part 2 + P3)**:
- Developer A: US7 - Elevation (15 tasks)
- Developer B: US8 - Caching (18 tasks)
- Developer C: US9 - Help Page (14 tasks)

**Week 4 (P3 + Polish)**:
- Developer A: US10 - Russian Market (18 tasks)
- Developer B+C: Polish & testing (14 tasks)

---

## Task Count Summary

| Phase | User Story | Priority | Tasks | Tests | Impl |
|-------|------------|----------|-------|-------|------|
| 1 | Setup | - | 4 | 0 | 4 |
| 2 | Foundational | - | 11 | 0 | 11 |
| 3 | US1: Sidebar Auth | P1 | 10 | 5 | 5 |
| 4 | US2: Skeleton Loading | P1 | 22 | 5 | 17 |
| 5 | US3: Tag Deletion | P1 | 14 | 5 | 9 |
| 6 | US4: Light Mode | P2 | 15 | 5 | 10 |
| 7 | US5: Animations | P2 | 18 | 5 | 13 |
| 8 | US6: Color Usage | P2 | 15 | 5 | 10 |
| 9 | US7: Elevation | P2 | 15 | 5 | 10 |
| 10 | US8: Caching | P3 | 19 | 5 | 14 |
| 11 | US9: Help Page | P3 | 14 | 5 | 9 |
| 12 | US10: Russian Market | P3 | 20 | 6 | 14 |
| 13 | Polish | - | 15 | 0 | 15 |
| **Total** | | | **192** | **51** | **141** |

**Breakdown**:
- **P1 (Critical)**: 46 tasks (24% of total)
- **P2 (High Impact)**: 63 tasks (33% of total)
- **P3 (Enhancement)**: 53 tasks (28% of total)
- **Infrastructure**: 30 tasks (15% of total)

**MVP Scope**: Phases 1-5 (Setup + Foundational + US1-US3) = 61 tasks

**Note on Terminology**: The spec.md uses "motion library" (technology-agnostic) while tasks.md specifies "Framer Motion" (concrete implementation). This is intentional - specifications remain technology-agnostic while implementation plans are specific.

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label (US1-US10) maps task to specific user story for traceability
- Each user story is independently completable and testable
- Tests written FIRST (TDD approach) - they should FAIL before implementation
- Commit after each task or logical group
- Stop at checkpoints to validate story independence
- 50 E2E tests total (~5 per user story) covering all acceptance criteria
- All file paths are relative to repository root

---

## Success Criteria Validation

After completing all tasks, verify success criteria from spec.md:

- [ ] **SC-001**: Users find auth controls in sidebar within 3 seconds
- [ ] **SC-002**: Perceived loading time improves by 40% (user survey + metrics)
- [ ] **SC-003**: Tag deletion success rate 100%
- [ ] **SC-004**: Light mode passes WCAG AA (100% of pages)
- [ ] **SC-005**: Animations complete within 300ms
- [ ] **SC-006**: Cache hit rate ≥60% on repeat visits
- [ ] **SC-007**: Task completion time reduces by 20%
- [ ] **SC-008**: Help search finds results in <1 second (95% of queries)
- [ ] **SC-009**: Russian users complete tasks without workarounds
- [ ] **SC-010**: User satisfaction improves by 30%
- [ ] **SC-011**: Help page bounce rate decreases by 25%
- [ ] **SC-012**: 90% report interface feels smooth/responsive

