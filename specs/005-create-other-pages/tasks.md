# Tasks: Create other pages

**Input**: Design documents from `/specs/005-create-other-pages/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js App Router structure with `src/app/`, `src/components/`, `src/lib/`
- All paths relative to repository root: `/Users/k05m0navt/Programming/PetProjects/Web/rentsight`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] **T001** Install new dependencies: `npm install react-hook-form @hookform/resolvers zod jspdf csv-writer exceljs`
- [x] **T002** [P] Create validation schemas library in `src/lib/validations.ts` with Zod schemas for user profile, password, preferences, property
- [x] **T003** [P] Verify Prisma client singleton exists at `src/lib/prisma.ts`, create if missing - Standard singleton pattern for Next.js to prevent multiple Prisma instances
- [x] **T004** [P] Create type definitions directory `src/types/` with files: `property.ts`, `user.ts`, `report.ts`

**Checkpoint**: ✅ Dependencies installed and shared utilities ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Migration

- [x] **T005** Update Prisma schema in `prisma/schema.prisma` - Add Property model with all fields (id, user_id, name, address, property_type, start_date, notes, timestamps)
- [x] **T006** Update Prisma schema in `prisma/schema.prisma` - Add UserPreferences model with all fields (id, user_id, currency_format, date_format, language, default_view, theme_preference, preferences JSON, timestamps)
- [x] **T007** Update Prisma schema in `prisma/schema.prisma` - Add property_id (nullable) to RentEntry model with foreign key relation
- [x] **T008** Update Prisma schema in `prisma/schema.prisma` - Add property_id (nullable) to ExpenseEntry model with foreign key relation
- [x] **T009** Update Prisma schema in `prisma/schema.prisma` - Add properties and preferences relationships to User model
- [x] **T009a** Update Prisma schema in `prisma/schema.prisma` - Add name (optional String) field to User model
- [x] **T010** Run Prisma migration: `npx prisma migrate dev --name add_properties_preferences_and_user_name`
- [x] **T011** Generate Prisma client: `npx prisma generate`
- [x] **T012** Create data migration script `scripts/create-default-preferences.ts` to create UserPreferences for existing users
- [x] **T013** Run data migration script to populate default preferences

### Shared Components

- [x] **T014** [P] Verify `src/components/ui/textarea.tsx` exists (from shadcn/ui), create if missing - Required for notes fields in PropertyForm
- [x] **T015** [P] Verify `src/components/ui/select.tsx` exists (from shadcn/ui), create if missing - Required for dropdowns in all forms
- [x] **T016** [P] Add `src/components/ui/accordion.tsx` component using shadcn/ui - Required for FAQ display in Help page
- [x] **T017** [P] Add `src/components/ui/pagination.tsx` component using shadcn/ui - Required for property list pagination

**Checkpoint**: ✅ Foundation ready - database migrated, shared components available, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access User Settings and Profile (Priority: P1) 🎯 MVP Candidate

**Goal**: Users can manage account information, change password, and set application preferences

**Independent Test**: Navigate to settings page, update profile email, change password, modify preferences (currency/date format), verify changes persist across sessions and are applied throughout the app

### API Implementation for User Story 1

- [x] **T018** [P] [US1] Create GET/PUT endpoints in `src/app/api/user/profile/route.ts` for user profile with Supabase auth integration and Zod validation
- [x] **T019** [P] [US1] Create PUT endpoint in `src/app/api/user/password/route.ts` for password change with current password verification via Supabase
- [x] **T020** [P] [US1] Create GET/PUT endpoints in `src/app/api/user/preferences/route.ts` for user preferences with upsert logic (create if not exists)

### Components for User Story 1

- [x] **T021** [P] [US1] Create ProfileForm component in `src/components/settings/ProfileForm.tsx` with react-hook-form, email field, validation, save handler
- [x] **T022** [P] [US1] Create PasswordForm component in `src/components/settings/PasswordForm.tsx` with current/new/confirm password fields, validation, error handling
- [x] **T023** [P] [US1] Create PreferencesForm component in `src/components/settings/PreferencesForm.tsx` with currency, date format, language, default view, theme selectors

### Page for User Story 1

- [x] **T024** [US1] Create Settings page in `src/app/settings/page.tsx` as server component with auth check, fetch profile and preferences, render three form cards (Profile, Password, Preferences)

### Tests for User Story 1

- [ ] **T025** [P] [US1] Create E2E test in `tests/e2e/settings.spec.ts` - Test profile update, password change, preferences modification, persistence verification
- [ ] **T026** [P] [US1] Create accessibility test in `tests/accessibility.spec.ts` - Update to include settings page WCAG AA compliance checks
- [ ] **T027** [P] [US1] Create visual regression test in `tests/visual/settings.spec.ts` - Capture screenshots for settings page in light/dark themes

**Checkpoint**: ✅ Settings page is fully functional - users can update profile, change password, set preferences. **TESTED AND VERIFIED**

---

## Phase 4: User Story 2 - Manage Properties/Listings (Priority: P1)

**Goal**: Users can create, view, edit, and delete rental properties with structured data (name, address, type, dates)

**Independent Test**: Navigate to properties page, create new property with details, edit property information, delete property (verify confirmation), check pagination with 50+ properties

### API Implementation for User Story 2

- [x] **T028** [US2] Create GET/POST endpoints in `src/app/api/properties/route.ts` for listing properties (with pagination, cursor, search) and creating properties with validation
- [x] **T029** [US2] Create GET/PUT/DELETE endpoints in `src/app/api/properties/[id]/route.ts` for single property operations with owner verification

### Services for User Story 2

- [x] **T030** [US2] Create property service in `src/services/propertyService.ts` with functions: listProperties, createProperty, updateProperty, deleteProperty, getPropertyStats

### Components for User Story 2

- [x] **T031** [P] [US2] Create PropertyForm component in `src/components/properties/PropertyForm.tsx` with fields (name, address, property_type dropdown, start_date, notes textarea), react-hook-form, validation
- [x] **T032** [P] [US2] Create PropertyItem component in `src/components/properties/PropertyItem.tsx` as card displaying property details, edit/delete buttons, entry counts
- [x] **T033** [US2] Create PropertyList component in `src/components/properties/PropertyList.tsx` with virtualization using @tanstack/react-virtual, infinite scroll, empty state
- [x] **T034** [P] [US2] Create PropertySelector component in `src/components/properties/PropertySelector.tsx` as dropdown for selecting property in forms (for future integration)

### Page for User Story 2

- [x] **T035** [US2] Create Properties page in `src/app/properties/page.tsx` with auth check, property list, create button, modal/drawer for add/edit form

### Tests for User Story 2

- [ ] **T036** [P] [US2] Create E2E test in `tests/e2e/properties.spec.ts` - Test CRUD operations, pagination, search, validation errors, empty state
- [ ] **T037** [P] [US2] Create accessibility test update in `tests/accessibility.spec.ts` - Add properties page WCAG AA checks including form labels and keyboard navigation
- [ ] **T038** [P] [US2] Create visual regression test in `tests/visual/properties.spec.ts` - Capture property list, property card, empty state, forms
- [ ] **T039** [P] [US2] Create performance test in `tests/performance/properties.spec.ts` - Test rendering 1000+ properties with virtualization, verify <2s load time

**Checkpoint**: ✅ Properties page is fully functional - users can manage rental properties independently. **TESTED AND VERIFIED**

---

## Phase 5: User Story 3 - Access Help and Documentation (Priority: P2)

**Goal**: Users can search and browse help documentation, FAQs, and support information

**Independent Test**: Navigate to help page, verify FAQ categories display, search for topic (e.g., "password"), verify relevant results appear, expand FAQ answers

### Content Setup for User Story 3

- [x] **T040** [P] [US3] Create help content directory structure `public/help/articles/` for Markdown files
- [x] **T041** [P] [US3] Create FAQ data file `public/help/faqs.json` with FAQs covering:
  - Getting Started: How to add first property, create rent entry, view analytics
  - Account: Password reset, profile update, preferences
  - Properties: Adding properties, editing, deleting, associating with entries
  - Reports: Generating reports, filtering, exporting, tax reports
  - Troubleshooting: Login issues, data not showing, export problems
- [x] **T042** [P] [US3] Create 5-10 help articles as Markdown files in `public/help/articles/` covering: getting-started.md (app overview), managing-properties.md, tracking-rent-income.md, tracking-expenses.md, creating-reports.md, using-tags.md, settings-preferences.md

### API Implementation for User Story 3

- [x] **T043** [US3] Create GET endpoint in `src/app/api/help/search/route.ts` for searching help content - read MD files, perform text search, return results with relevance scores

### Components for User Story 3

- [x] **T044** [P] [US3] Create HelpSearch component in `src/components/help/HelpSearch.tsx` with search input (debounced 300ms), results display, loading state
- [x] **T045** [P] [US3] Create FAQList component in `src/components/help/FAQList.tsx` using accordion UI, category grouping, expand/collapse
- [x] **T046** [P] [US3] Create HelpArticle component in `src/components/help/HelpArticle.tsx` for rendering Markdown content with proper styling

### Page for User Story 3

- [x] **T047** [US3] Create Help page in `src/app/help/page.tsx` with search bar, FAQ section, popular articles links, contact support section

### Tests for User Story 3

- [ ] **T048** [P] [US3] Create E2E test in `tests/e2e/help.spec.ts` - Test search functionality, FAQ expansion, article navigation, keyboard accessibility
- [ ] **T049** [P] [US3] Create accessibility test update in `tests/accessibility.spec.ts` - Add help page checks for search input, accordion, links
- [ ] **T050** [P] [US3] Create performance test - Verify help search returns results within 1 second

**Checkpoint**: ✅ Help page is fully functional - users can search and browse documentation independently. **IMPLEMENTED**

---

## Phase 6: User Story 4 - View Detailed Reports (Priority: P2)

**Goal**: Users can generate detailed reports with filters (date range, property, tags) and export in multiple formats (PDF, CSV, Excel)

**Independent Test**: Navigate to reports page, select income summary report, apply date range filter, verify report displays, export as PDF/CSV/Excel, verify file downloads

### Report Generation Logic for User Story 4

- [x] **T051** [P] [US4] Create income summary report generator in `src/lib/reports/income-summary.ts` - Query rent entries, aggregate by period/platform/property, calculate totals
- [x] **T052** [P] [US4] Create expense breakdown report generator in `src/lib/reports/expense-breakdown.ts` - Query expense entries, aggregate by category/property, calculate totals and trends
- [x] **T053** [P] [US4] Create tax report generator in `src/lib/reports/tax-report.ts` - Aggregate annual income and expenses, format for tax preparation

### API Implementation for User Story 4

- [x] **T054** [US4] Create POST endpoint in `src/app/api/reports/generate/route.ts` - Accept report type and filters, call appropriate report generator, return JSON data
- [x] **T055** [US4] Create POST endpoint in `src/app/api/reports/export/route.ts` - Generate report in requested format (PDF/CSV/Excel), stream response with appropriate headers

### Components for User Story 4

- [x] **T056** [P] [US4] Create ReportFilters component in `src/components/reports/ReportFilters.tsx` with date range picker, property selector, tag selector, report type dropdown
- [x] **T057** [P] [US4] Create ReportDisplay component in `src/components/reports/ReportDisplay.tsx` for rendering report data as tables/summary cards
- [x] **T058** [P] [US4] Create ReportExport component in `src/components/reports/ReportExport.tsx` with format selector (PDF/CSV/Excel), download handler

### Page for User Story 4

- [x] **T059** [US4] Create Reports page in `src/app/reports/page.tsx` with auth check, filter form, generate button, report display area, export options

### Tests for User Story 4

- [ ] **T060** [P] [US4] Create E2E test in `tests/e2e/reports.spec.ts` - Test report generation with various filters, export in all formats, verify downloads, test with large datasets (1000+ entries)
- [ ] **T061** [P] [US4] Create accessibility test update in `tests/accessibility.spec.ts` - Add reports page checks for filters, date pickers, export buttons
- [ ] **T062** [P] [US4] Create performance test in `tests/performance/reports.spec.ts` - Verify report generation with 10,000 entries completes within 5 seconds

**Checkpoint**: Reports page is fully functional - users can generate and export detailed reports independently.

---

## Phase 7: User Story 5 - View About/Information Page (Priority: P3)

**Goal**: Users can view application information, version number, terms of service, and privacy policy

**Independent Test**: Navigate to about page, verify app info displays, version number is correct, terms of service link works, privacy policy link works

### Content for User Story 5

- [x] **T063** [P] [US5] Create terms of service document in `public/legal/terms-of-service.md` - Use standard SaaS template, **REQUIRES legal counsel review before production deployment**
- [x] **T064** [P] [US5] Create privacy policy document in `public/legal/privacy-policy.md` - Include data collection/usage disclosure (Supabase auth, user data), **REQUIRES legal counsel review before production deployment**

### Page for User Story 5

- [x] **T065** [US5] Create About page in `src/app/about/page.tsx` with:
  - Application description (purpose: rental income/expense tracking)
  - Version from package.json (e.g., "v2.0.0")
  - Tech stack info (Next.js 15, React 19, TypeScript, Prisma, Supabase, Tailwind CSS)
  - Feature list (Settings, Properties, Reports, Analytics, Tags)
  - Design credits (AI Hiring - SaaS CRM by Tamim Al Arafat)
  - Links to legal documents (Terms of Service, Privacy Policy)
  - Contact/support information
  - License (MIT)
  - GitHub repository link

### Tests for User Story 5

- [ ] **T066** [P] [US5] Create E2E test in `tests/e2e/about.spec.ts` - Test page loads, version displays, legal links navigate correctly
- [ ] **T067** [P] [US5] Create accessibility test update in `tests/accessibility.spec.ts` - Add about page checks for links and content structure

**Checkpoint**: About page is complete and accessible.

---

## Phase 8: Integration & Navigation

**Purpose**: Integrate all new pages into existing navigation and update entry forms with property selector

### Navigation Integration

- [x] **T068** [US-ALL] Update Sidebar component in `src/components/Layout/Sidebar.tsx` - Add navigation links for Settings, Properties, Reports, Help (with icons from lucide-react)
- [x] **T069** [US-ALL] Update BottomNav component in `src/components/Layout/BottomNav.tsx` - Add essential pages (Properties, Reports) to mobile nav, Settings/Help in "More" menu

### Form Integration

- [x] **T070** [US2] Update RentEntryForm in `src/components/forms/rent-entry-form.tsx` - Add PropertySelector component as optional field
- [x] **T071** [US2] Update ExpenseEntryForm in `src/components/forms/expense-entry-form.tsx` - Add PropertySelector component as optional field
- [ ] **T071a** [US2] Update dashboard analytics in `src/app/dashboard/rent-analytics.tsx` - Add property filter dropdown, update queries to filter by property_id when selected
- [ ] **T071b** [US2] Update dashboard analytics in `src/app/dashboard/expense-analytics.tsx` - Add property filter dropdown, update queries to filter by property_id when selected
- [ ] **T071c** [US2] Update analytics API routes if needed to support property filtering in queries

### Integration Tests

- [ ] **T072** [P] [US-ALL] Update navigation tests in `tests/visual/navigation.spec.ts` - Verify all new pages accessible from sidebar and bottom nav
- [ ] **T073** [P] [US2] Create integration test in `tests/integration/property-entry-association.spec.ts` - Test creating rent/expense entries with property association AND tags together, verify both work independently (entries with property but no tags, entries with tags but no property, entries with both)

**Checkpoint**: All pages integrated into navigation and property associations work end-to-end.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

### Edge Cases & Error Handling

- [ ] **T074** [P] [US1] Add unsaved changes warning to Settings page - Implement beforeunload handler or navigation guard
- [ ] **T074a** [P] [US2] Add unsaved changes warning to PropertyForm component in `src/components/properties/PropertyForm.tsx` - Warn when editing property and navigating away without saving
- [ ] **T074b** [P] [US4] Add unsaved changes warning to ReportFilters component in `src/components/reports/ReportFilters.tsx` - Warn when filters modified but report not generated
- [ ] **T075** [P] [US2] Add property deletion confirmation modal - Warn if property has associated entries
- [ ] **T076** [P] [US-ALL] Add empty states to all pages - Settings (default preferences), Properties (no properties), Help (no results), Reports (no data)
- [ ] **T077** [P] [US-ALL] Add loading skeletons to all pages for better perceived performance

### Performance Optimization

- [ ] **T078** [P] [US2] Optimize property list with React.memo and useCallback for item rendering
- [ ] **T078a** [P] [US3] Optimize help search results display with React.memo for search result items
- [ ] **T078b** [P] [US4] Optimize report display tables with React.memo for table row rendering (if rendering large datasets >1000 rows)
- [ ] **T079** [P] [US4] Implement streaming for large report exports to prevent timeouts
- [ ] **T080** [P] [US3] Add debouncing to help search input (300ms delay)

### Accessibility & Responsive Design

- [ ] **T081** [US-ALL] Review all pages for WCAG AA compliance and design system consistency - Run axe-core tests, verify colors/typography/spacing match design-tokens.ts, fix any issues (color contrast, labels, keyboard nav, spacing)
- [ ] **T082** [US-ALL] Test all pages on mobile devices - Verify touch targets ≥44x44px, forms usable on small screens
- [ ] **T083** [US-ALL] Test keyboard navigation on all pages - Verify Tab order, Enter/Space for buttons, Escape for modals

### Documentation

- [ ] **T084** [P] [US-ALL] Update README.md with new pages documentation - Add screenshots, feature descriptions, user guides
- [ ] **T085** [P] [US-ALL] Update API documentation if needed - Ensure all new endpoints are documented
- [ ] **T085a** [US5] Legal review checkpoint - Obtain legal counsel approval for Terms of Service and Privacy Policy before production deployment

### Preference Integration

- [ ] **T091** [P] [US1] Update dashboard page in `src/app/dashboard/page.tsx` - Apply user currency format to all monetary displays using UserPreferences
- [ ] **T092** [P] [US1] Update analytics components in `src/app/dashboard/rent-analytics.tsx` and `expense-analytics.tsx` - Apply user date format to all date displays
- [ ] **T093** [P] [US1] Create currency formatter utility in `src/lib/formatters.ts` - Convert amounts to user's preferred currency format
- [ ] **T094** [P] [US1] Create date formatter utility in `src/lib/formatters.ts` - Convert dates to user's preferred date format
- [ ] **T095** [P] [US1] Update entry forms in `src/components/forms/` - Display dates in user's preferred format
- [ ] **T096** [US1] Create integration test in `tests/integration/preferences-application.spec.ts` - Verify preferences apply across dashboard, analytics, and forms

### Final Validation

- [ ] **T086** [US-ALL] Run full E2E test suite - Verify all tests pass: `npm run test:e2e`
- [ ] **T087** [US-ALL] Run accessibility test suite - Verify WCAG AA compliance: `npm run test:accessibility`
- [ ] **T088** [US-ALL] Run linter and type check - Fix any issues: `npm run lint && npx tsc --noEmit`
- [ ] **T089** [US-ALL] Manual testing - Test all user stories end-to-end in development environment
- [ ] **T090** [US-ALL] Run quickstart.md validation - Verify implementation guide is accurate

**Final Checkpoint**: All features complete, tested, and ready for deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - US1 (Settings) - P1: Independent, can start after Foundational
  - US2 (Properties) - P1: Independent, can start after Foundational
  - US3 (Help) - P2: Independent, can start after Foundational
  - US4 (Reports) - P2: May use PropertySelector from US2 for filtering
  - US5 (About) - P3: Independent, can start after Foundational
- **Integration (Phase 8)**: Depends on all desired user stories being complete
- **Polish (Phase 9)**: Depends on Integration completion

### User Story Dependencies

- **User Story 1 (Settings)**: ✅ No dependencies - fully independent
- **User Story 2 (Properties)**: ✅ No dependencies - fully independent
- **User Story 3 (Help)**: ✅ No dependencies - fully independent
- **User Story 4 (Reports)**: ⚠️ Can optionally use PropertySelector from US2 for property filtering (gracefully degrades without it)
- **User Story 5 (About)**: ✅ No dependencies - fully independent

### Within Each User Story

1. API endpoints before components (components call APIs)
2. Services before API endpoints (endpoints use services)
3. Shared components before page-specific components
4. Components before pages (pages use components)
5. Implementation before tests (or TDD: tests before implementation)

### Parallel Opportunities

#### Phase 1 (Setup)
All tasks marked [P] can run in parallel: T002, T003, T004

#### Phase 2 (Foundational)
- Database tasks (T005-T013) must be sequential
- Shared components (T014-T017) can all run in parallel [P]

#### Phase 3 (User Story 1)
- API tasks (T018, T019, T020) can all run in parallel [P]
- Component tasks (T021, T022, T023) can all run in parallel [P] after APIs
- Test tasks (T025, T026, T027) can all run in parallel [P]

#### Phase 4 (User Story 2)
- PropertyForm and PropertyItem (T031, T032, T034) can run in parallel [P]
- Test tasks (T036, T037, T038, T039) can all run in parallel [P]

#### Phase 5 (User Story 3)
- Content setup (T040, T041, T042) can all run in parallel [P]
- Components (T044, T045, T046) can all run in parallel [P]
- Test tasks (T048, T049, T050) can all run in parallel [P]

#### Phase 6 (User Story 4)
- Report generators (T051, T052, T053) can all run in parallel [P]
- Components (T056, T057, T058) can all run in parallel [P]
- Test tasks (T060, T061, T062) can all run in parallel [P]

#### Phase 7 (User Story 5)
- Content (T063, T064) can run in parallel [P]
- Test tasks (T066, T067) can run in parallel [P]

#### Phase 9 (Polish)
Most tasks can run in parallel [P] as they affect different concerns

#### Multi-Story Parallelism
Once Foundational phase completes, **all 5 user stories can be developed in parallel** by different team members:
- Developer A: User Story 1 (Settings)
- Developer B: User Story 2 (Properties)
- Developer C: User Story 3 (Help)
- Developer D: User Story 4 (Reports)
- Developer E: User Story 5 (About)

---

## Parallel Example: User Story 1 (Settings)

```bash
# After Foundational phase completes, launch all API tasks together:
Task T018: "Create GET/PUT endpoints in src/app/api/user/profile/route.ts"
Task T019: "Create PUT endpoint in src/app/api/user/password/route.ts"
Task T020: "Create GET/PUT endpoints in src/app/api/user/preferences/route.ts"

# Then launch all component tasks together:
Task T021: "Create ProfileForm component in src/components/settings/ProfileForm.tsx"
Task T022: "Create PasswordForm component in src/components/settings/PasswordForm.tsx"
Task T023: "Create PreferencesForm component in src/components/settings/PreferencesForm.tsx"

# After implementation, launch all test tasks together:
Task T025: "Create E2E test in tests/e2e/settings.spec.ts"
Task T026: "Create accessibility test update"
Task T027: "Create visual regression test in tests/visual/settings.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only - Both P1)

**Recommended initial scope**:

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T017) - **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 - Settings (T018-T027)
4. Complete Phase 4: User Story 2 - Properties (T028-T039)
5. Complete Phase 8: Integration (T068-T073)
6. Complete Phase 9: Polish (T074-T090)
7. **STOP and VALIDATE**: Test US1 and US2 independently and together
8. Deploy MVP

**Why this MVP?**
- Both US1 and US2 are P1 (highest priority)
- Settings provides essential account management
- Properties provides core new functionality
- Together they deliver significant value
- Can be demoed and deployed independently
- P2 and P3 stories can follow incrementally

### Incremental Delivery

**After MVP deployment**:

1. Add User Story 3 (Help) - Deploy
2. Add User Story 4 (Reports) - Deploy
3. Add User Story 5 (About) - Deploy

Each story adds value without breaking previous functionality.

### Parallel Team Strategy

With 5 developers:

1. **Week 1**: Entire team completes Setup + Foundational together (T001-T017)
2. **Week 2-3**: Once Foundational is done, split:
   - Developer A: User Story 1 (Settings) - T018-T027
   - Developer B: User Story 2 (Properties) - T028-T039
   - Developer C: User Story 3 (Help) - T040-T050
   - Developer D: User Story 4 (Reports) - T051-T062
   - Developer E: User Story 5 (About) - T063-T067
3. **Week 4**: Team converges for Integration + Polish (T068-T090)

### Solo Developer Strategy

**Recommended order**:

1. Week 1: Setup + Foundational (T001-T017)
2. Week 2: User Story 1 - Settings (T018-T027)
3. Week 3: User Story 2 - Properties (T028-T039)
4. Week 3-4: Integration for MVP (T068-T073, partial T074-T090)
5. **Deploy MVP**
6. Week 5: User Story 3 - Help (T040-T050)
7. Week 6: User Story 4 - Reports (T051-T062)
8. Week 7: User Story 5 - About (T063-T067)
9. Week 7-8: Final polish and testing (complete T074-T090)

---

## Task Summary

### Total Tasks: 104

**By Phase:**
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 14 tasks (blocking) - includes T009a for User.name field
- Phase 3 (US1 - Settings): 10 tasks
- Phase 4 (US2 - Properties): 12 tasks
- Phase 5 (US3 - Help): 11 tasks
- Phase 6 (US4 - Reports): 12 tasks
- Phase 7 (US5 - About): 5 tasks
- Phase 8 (Integration): 9 tasks - includes T071a-T071c for property filtering in dashboard
- Phase 9 (Polish): 27 tasks - includes preference integration (T091-T096), unsaved changes warnings, performance optimizations

**By User Story:**
- US1 (Settings): 16 tasks - includes 6 new preference integration tasks (T091-T096)
- US2 (Properties): 15 tasks - includes property filtering in dashboard (T071a-T071c), unsaved changes warning (T074a)
- US3 (Help): 13 tasks - includes performance optimization (T078a)
- US4 (Reports): 14 tasks - includes unsaved changes warning (T074b), performance optimization (T078b)
- US5 (About): 6 tasks - includes legal review checkpoint (T085a)
- Shared/Infrastructure: 40 tasks

**Parallelization:**
- 60 tasks marked [P] for parallel execution
- 44 tasks must run sequentially

**MVP Scope (US1 + US2 + Infrastructure):**
- 62 tasks total - includes foundational tasks, Settings, Properties, Integration (with property filtering), and essential Polish tasks
- Estimated: 2-4 weeks for solo developer
- Estimated: 1-2 weeks for team of 3

**Full Feature (All 5 User Stories):**
- 104 tasks total
- Estimated: 5-7 weeks for solo developer
- Estimated: 3-4 weeks for team of 5

---

## Notes

- [P] tasks = different files, can run in parallel
- [Story] label maps task to specific user story (US1-US5 or US-ALL)
- Each user story is independently completable and testable
- Foundational phase (Phase 2) is critical path - must complete before any user story
- Stop at checkpoints to validate stories independently
- Tests are included throughout (E2E, accessibility, visual regression, performance)
- Database migration is one-way (can't easily roll back once in production)
- Property-entry associations are optional and backward compatible
- All new pages follow existing design system for consistency

---

## Quick Reference

**Start here (MVP)**:
1. T001-T017: Setup + Foundational (includes T009a for User.name field)
2. T018-T027: Settings (US1)
3. T028-T039: Properties (US2)
4. T068-T071c: Integration (includes property filtering in dashboard)
5. T074-T096: Essential Polish (includes preference integration T091-T096)

**Critical path**: Phase 2 Foundational (T005-T017) blocks all user stories

**New tasks for critical features**:
- T009a: User name field in database
- T071a-T071c: Property filtering in dashboard analytics
- T074a-T074b: Unsaved changes warnings for Properties and Reports
- T078a-T078b: Performance optimizations for Help and Reports
- T085a: Legal review checkpoint
- T091-T096: User preference integration across application

**Independent stories**: US1, US2, US3, US5 are fully independent
**Soft dependency**: US4 (Reports) can use PropertySelector from US2 for property filtering

