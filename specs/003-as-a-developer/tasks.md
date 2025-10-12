# Tasks: Complete Application Redesign

**Input**: Design documents from `/specs/003-as-a-developer/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/design-system.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- **Web app with src/**: `src/app/`, `src/components/`, `src/lib/`, `src/styles/`
- All paths shown below follow Next.js App Router structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and configuration for redesign implementation

- [x] T001 [P] Install required dependencies: `@tanstack/react-virtual`, `next-themes`, `postcss-preset-env`
- [x] T002 [P] Update `postcss.config.mjs` with Autoprefixer and IE11 compatibility settings
- [x] T003 [P] Add polyfills for IE11 support (Promise, fetch, IntersectionObserver, ResizeObserver) in `src/lib/polyfills.ts`
- [x] T004 Create `.browserslistrc` file with browser targets including IE11 and Edge 15+
- [x] T005 [P] Create `playwright.config.ts` updates for visual regression testing configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design system infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Update `tailwind.config.js` with complete design token system (colors, spacing, typography, borders, shadows, transitions)
- [x] T007 [P] Create `src/lib/design-tokens.ts` with TypeScript token exports for JavaScript access
- [x] T008 [P] Create `src/styles/tokens.css` with CSS custom properties and IE11 fallback values
- [x] T009 Update `src/app/globals.css` with base styles, dark mode variables, and design system foundations
- [x] T010 Update `src/components/ThemeProvider.tsx` to use next-themes with dark as default theme
- [x] T011 [P] Create `src/lib/animation-utils.ts` with GPU-accelerated transition utilities
- [x] T012 Update `src/app/layout.tsx` root layout to integrate ThemeProvider with dark mode support

**Checkpoint**: ✅ Foundation ready - design system configured, theme infrastructure in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - Navigate Updated Interface (Priority: P1) 🎯 MVP

**Goal**: Implement redesigned navigation (sidebar + bottom nav) and core layout infrastructure so users can navigate through the application with the new design system.

**Independent Test**: Log in and navigate through all primary pages (dashboard, rent entries, expense entries, tag manager) verifying new design is applied consistently and all features remain accessible. Test on desktop (sidebar) and mobile (bottom nav). Switch between light and dark themes.

### Core UI Primitives (Shared by All Pages)

- [x] T013 [P] [US1] Redesign `src/components/ui/button.tsx` with new variants (primary, secondary, ghost) using CVA
- [x] T014 [P] [US1] Redesign `src/components/ui/card.tsx` with new styles, shadows, and variants
- [x] T015 [P] [US1] Redesign `src/components/ui/input.tsx` with new border styles, focus states, and theme support
- [x] T016 [P] [US1] Redesign `src/components/ui/badge.tsx` with new colors and pill shape
- [x] T017 [P] [US1] Redesign `src/components/ui/dropdown-menu.tsx` with new styles and animations

### Layout Components

- [x] T018 [US1] Create `src/components/Layout/Sidebar.tsx` for desktop/tablet navigation (256px width, full height, icon+label items)
- [x] T019 [US1] Create `src/components/Layout/BottomNav.tsx` for mobile navigation (fixed bottom, 64px height, icon+label tabs)
- [x] T020 [US1] Update `src/components/Layout/Container.tsx` with new spacing system (8-point scale)
- [x] T021 [US1] Update `src/components/Layout/Grid.tsx` with responsive grid using new breakpoints
- [x] T022 [US1] Update `src/app/layout.tsx` to integrate Sidebar and BottomNav with responsive breakpoint at 768px

### Theme Toggle Component

- [x] T023 [US1] Create `src/components/ui/ThemeToggle.tsx` component with sun/moon icons for theme switching

### Page Layouts

- [x] T024 [US1] Update `src/app/page.tsx` (landing page) with redesigned layout, hero section, and CTAs
- [x] T025 [US1] Update `src/app/login/page.tsx` with redesigned authentication form layout
- [x] T026 [US1] Update `src/app/signup/page.tsx` with redesigned registration form layout

**Checkpoint**: ✅ Users can navigate the application with new sidebar/bottom nav, switch themes, and access all pages with consistent layout. Navigation foundation complete.

---

## Phase 4: User Story 2 - View Enhanced Analytics Visualizations (Priority: P1)

**Goal**: Redesign dashboard with enhanced data visualizations (charts, metrics cards) using new design system colors and supporting 10,000+ entries with optimal performance.

**Independent Test**: View analytics dashboard with rent and expense data. Verify charts use new color scheme (#DD1202, #1DCC5C), metrics cards follow new design, interactions provide feedback, and filtering by tags works smoothly. Test with 10,000+ entries for performance (<2s render).

### Dashboard Components

- [x] T027 [P] [US2] Create `src/components/dashboard/MetricsCard.tsx` with new card design, accent colors, and typography
- [x] T028 [P] [US2] Create `src/components/dashboard/ChartContainer.tsx` wrapper with consistent chart styling
- [x] T029 [US2] Update `src/app/dashboard/rent-analytics.tsx` with redesigned charts using new color palette (primary #DD1202, success #1DCC5C)
- [x] T030 [US2] Update `src/app/dashboard/expense-analytics.tsx` with redesigned expense visualizations
- [x] T031 [US2] Update `src/components/dashboard-content.tsx` with new layout, spacing, and card-based design

### Data Virtualization for Large Datasets

- [x] T032 [US2] Create `src/components/dashboard/VirtualizedTable.tsx` using @tanstack/react-virtual for 10,000+ entry support
- [x] T033 [US2] Implement data aggregation utility in `src/lib/data-aggregation.ts` for chart optimization
- [x] T034 [US2] Update `src/app/api/analytics/summary/route.ts` to support server-side pagination with cursor-based navigation

### Dashboard Page

- [x] T035 [US2] Update `src/app/dashboard/page.tsx` integrating redesigned components, virtualized tables, and new analytics layout

**Checkpoint**: ✅ Dashboard displays enhanced visualizations with new design system, handles 10,000+ entries performantly, and provides smooth interactions. Core value proposition redesigned.

---

## Phase 5: User Story 3 - Use Redesigned Forms (Priority: P2)

**Goal**: Redesign rent entry and expense entry forms with improved visual hierarchy, field styling, validation feedback, and error handling following the new design system.

**Independent Test**: Create and edit rent and expense entries. Verify form layouts are improved, input states (focus, error, success) follow new design, validation messages are clear with visual indicators, and submission flows work correctly.

### Form Components

- [x] T036 [P] [US3] Create `src/components/forms/FormField.tsx` wrapper component with consistent label, input, and error message styling
- [x] T037 [P] [US3] Create `src/components/forms/FormSelect.tsx` with redesigned dropdown styling and chevron icon
- [x] T038 [P] [US3] Create `src/components/forms/FormDatePicker.tsx` with new styling (if date picker used)
- [x] T039 [P] [US3] Create `src/components/ui/error-message.tsx` component with icon and error color styling

### Form Pages

- [x] T040 [US3] Update `src/components/forms/rent-entry-form.tsx` with redesigned layout, field grouping, and improved spacing
- [x] T041 [US3] Update `src/components/forms/expense-entry-form.tsx` with redesigned layout and consistent form patterns
- [x] T042 [US3] Add loading states with spinner component during form submission in both forms
- [x] T043 [US3] Update form validation error display with new error message component and inline field errors

**Checkpoint**: Forms are redesigned with improved usability, clear validation feedback, and consistent styling. Data entry experience enhanced.

---

## Phase 6: User Story 4 - Manage Tags with Improved Interface (Priority: P3)

**Goal**: Redesign tag management interface with improved tag display, creation/edit flows, and better visual organization using the new design system.

**Independent Test**: Access tag manager, create new tags, edit existing tags, and delete tags. Verify redesigned interface with improved display, consistent interaction patterns, and clear feedback following new design.

### Tag Components

- [x] T044 [P] [US4] Create `src/components/tags/TagList.tsx` with grid or list layout using new card design
- [x] T045 [P] [US4] Create `src/components/tags/TagItem.tsx` component with badge styling, edit/delete actions
- [x] T046 [P] [US4] Create `src/components/tags/TagForm.tsx` for create/edit with color picker using new input designs
- [x] T047 [P] [US4] Create `src/components/ui/color-picker.tsx` component with redesigned color selection UI

### Tag Manager Page

- [x] T048 [US4] Update `src/components/ui/tag-manager.tsx` integrating new tag components with improved layout
- [x] T049 [US4] Add empty state component in `src/components/tags/TagEmptyState.tsx` with helpful messaging and CTA
- [x] T050 [US4] Update tag filtering/search UI with new input styling and clear filter indicators

**Checkpoint**: Tag management interface redesigned with improved UX and consistent design patterns. All user stories complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality assurance, testing, browser compatibility, and final optimizations

### Testing & Validation

- [x] T051 [P] Update `tests/accessibility.spec.ts` to validate WCAG AA contrast ratios (4.5:1) in both themes
- [x] T052 [P] Create `tests/visual/navigation.spec.ts` for sidebar and bottom nav visual regression (desktop + mobile)
- [x] T053 [P] Create `tests/visual/dashboard.spec.ts` for dashboard page visual regression (light + dark themes)
- [x] T054 [P] Create `tests/visual/forms.spec.ts` for form pages visual regression
- [x] T055 [P] Create `tests/visual/themes.spec.ts` to verify theme switching across all pages
- [x] T056 [P] Create `tests/performance/large-datasets.spec.ts` to verify <2s render with 10,000+ entries

### Browser Compatibility

- [x] T057 [P] Manual IE11 testing with BrowserStack or local VM (test all pages, verify Flexbox layouts, check color fallbacks)
- [x] T058 [P] Cross-browser testing with Playwright (Chrome, Firefox, Safari, Edge) automated tests
- [x] T059 Fix any IE11-specific CSS issues identified during testing (add fallbacks, adjust Flexbox)

### Responsive Testing

- [x] T060 [P] Test responsive behavior at key breakpoints (375px mobile, 768px tablet transition, 1920px desktop)
- [x] T061 [P] Verify sidebar → bottom nav transition at 768px breakpoint on all pages
- [x] T062 Fix any responsive layout issues identified (adjust spacing, fix overlaps, test touch targets on mobile)

### Accessibility Polish

- [x] T063 [P] Verify keyboard navigation works on all interactive elements (Tab order, visible focus indicators)
- [x] T064 [P] Test screen reader compatibility (ARIA labels, semantic HTML, live regions)
- [x] T065 Update focus indicators to meet visibility requirements across both themes

### Performance Optimization

- [x] T066 [P] Optimize animation performance (verify 60fps, GPU acceleration, check IE11 fallbacks)
- [x] T067 [P] Review bundle size impact of new dependencies and optimize if needed
- [x] T068 Verify page load performance targets met (<=500ms primary content, <=2s visualizations)

### Documentation & Cleanup

- [x] T069 [P] Update `README.md` with redesign information and new theme features
- [x] T070 [P] Create visual design system documentation screenshot or style guide reference
- [x] T071 [P] Code cleanup: Remove unused old components, consolidate styles, remove console.logs
- [x] T072 Final QA pass: Test all acceptance scenarios from spec.md user stories

**Checkpoint**: All quality gates passed. Application ready for big bang deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Foundation for all pages
- **User Story 2 (Phase 4)**: Depends on Foundational + User Story 1 (uses navigation and UI primitives)
- **User Story 3 (Phase 5)**: Depends on Foundational + User Story 1 (uses navigation and UI primitives)
- **User Story 4 (Phase 6)**: Depends on Foundational + User Story 1 (uses navigation and UI primitives)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: FOUNDATIONAL - Must complete first. Provides navigation and core UI primitives used by all other stories.
- **User Story 2 (P1)**: Depends on US1 for navigation and primitives. Can proceed once US1 complete.
- **User Story 3 (P2)**: Depends on US1 for navigation and primitives. Can run in parallel with US2 if staffed.
- **User Story 4 (P3)**: Depends on US1 for navigation and primitives. Can run in parallel with US2/US3 if staffed.

**Note**: While US2, US3, US4 depend on US1's primitives, they can proceed in parallel once US1 is complete if team capacity allows.

### Within Each User Story

- UI primitives (T013-T017) can run in parallel within US1
- Layout components (T018-T022) sequential within US1 (depend on primitives)
- Different page updates (T024-T026) can run in parallel within US1
- Dashboard components (T027-T031) can start in parallel within US2
- Form components (T036-T039) can run in parallel within US3
- Tag components (T044-T047) can run in parallel within US4

### Parallel Opportunities

- **Setup Phase**: All tasks (T001-T005) can run in parallel
- **Foundational Phase**: T007, T008, T011 can run in parallel (different files)
- **US1 Primitives**: T013-T017 can all run in parallel (different component files)
- **US1 Pages**: T024-T026 can run in parallel (different page files)
- **US2 Components**: T027-T028 can run in parallel
- **US3 Components**: T036-T039 can run in parallel
- **US4 Components**: T044-T047 can run in parallel
- **Polish Testing**: T051-T056 can all run in parallel (different test files)
- **Polish Browser**: T057-T058 can run in parallel
- **Polish Responsive**: T060-T061 can run in parallel

---

## Parallel Example: User Story 1 (Navigation Foundation)

```bash
# Launch all UI primitives together (Phase 3, Step 1):
Task: "Redesign src/components/ui/button.tsx with new variants"
Task: "Redesign src/components/ui/card.tsx with new styles"
Task: "Redesign src/components/ui/input.tsx with new border styles"
Task: "Redesign src/components/ui/badge.tsx with new colors"
Task: "Redesign src/components/ui/dropdown-menu.tsx with new styles"

# Then launch page updates together (Phase 3, Step 3):
Task: "Update src/app/page.tsx landing page"
Task: "Update src/app/login/page.tsx authentication form"
Task: "Update src/app/signup/page.tsx registration form"
```

## Parallel Example: User Story 2 (Analytics Dashboard)

```bash
# Launch dashboard components together:
Task: "Create src/components/dashboard/MetricsCard.tsx"
Task: "Create src/components/dashboard/ChartContainer.tsx"
Task: "Update src/app/dashboard/rent-analytics.tsx"
Task: "Update src/app/dashboard/expense-analytics.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup → ~30 minutes
2. Complete Phase 2: Foundational → ~2 hours (design tokens, theme config)
3. Complete Phase 3: User Story 1 (Navigation) → ~6 hours (primitives + navigation + pages)
4. **CHECKPOINT**: Validate navigation works, themes switch, all pages accessible
5. Complete Phase 4: User Story 2 (Analytics) → ~6 hours (dashboard + visualizations + performance)
6. **CHECKPOINT**: Validate analytics render with 10,000+ entries, charts use new colors
7. **STOP and VALIDATE**: Test entire flow (login → navigate → view analytics)
8. Deploy/demo if ready (MVP with core navigation and analytics complete)

**MVP Scope**: User Stories 1 & 2 (both P1) = Fully navigable app with redesigned analytics

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~2.5 hours)
2. Add User Story 1 → Test navigation independently → **Deploy/Demo** (~6 hours)
3. Add User Story 2 → Test analytics independently → **Deploy/Demo** (~6 hours)
4. Add User Story 3 → Test forms independently → **Deploy/Demo** (~4 hours)
5. Add User Story 4 → Test tag management independently → **Deploy/Demo** (~3 hours)
6. Add Polish → Complete testing and QA → **Final Deployment** (~8 hours)

**Total Estimated Time**: ~30 hours for complete redesign with all user stories and polish

### Parallel Team Strategy

With multiple developers:

1. **Day 1**: Entire team completes Setup + Foundational together (~2.5 hours)
2. **Day 1-2**: Once Foundational done:
   - **Developer A**: User Story 1 (Navigation) - MUST complete first (~6 hours)
3. **Day 2-3**: Once US1 complete (primitives available):
   - **Developer A**: User Story 2 (Analytics) (~6 hours)
   - **Developer B**: User Story 3 (Forms) (~4 hours)
   - **Developer C**: User Story 4 (Tags) (~3 hours)
4. **Day 3-4**: Polish & Testing together (~8 hours)

**Parallel Benefit**: Reduces Days 2-3 from ~13 hours sequential to ~6 hours parallel

---

## Task Count Summary

- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 7 tasks ⚠️ BLOCKS all stories
- **Phase 3 (US1 - Navigation)**: 14 tasks 🎯 MVP Foundation
- **Phase 4 (US2 - Analytics)**: 9 tasks 🎯 MVP Core Value
- **Phase 5 (US3 - Forms)**: 8 tasks
- **Phase 6 (US4 - Tags)**: 7 tasks
- **Phase 7 (Polish)**: 22 tasks

**Total**: 72 tasks

**Parallel Opportunities**: 32 tasks marked [P] can run in parallel with others in their phase

**Critical Path**: Setup → Foundational → US1 → US2/US3/US4 (parallel) → Polish

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label (US1, US2, US3, US4) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **User Story 1 is FOUNDATIONAL**: Provides navigation and UI primitives for all other stories
- **Big Bang Deployment**: All user stories must complete before deployment (per spec clarification)
- Comprehensive testing in Phase 7 is critical for big bang deployment confidence
- Stop at any checkpoint to validate story independently before proceeding
- IE11 testing requires manual validation (BrowserStack or Windows VM)
- Visual regression tests require baseline creation on first run (`--update-snapshots`)
- Performance testing with 10,000+ entries requires test data seeding
- Commit after each task or logical group for easier rollback if needed

---

## Success Criteria Validation

After completing all tasks, verify against spec.md success criteria:

- ✅ **SC-001**: 100% of existing pages functional after redesign
- ✅ **SC-002**: WCAG AA contrast ratios (4.5:1) in both themes (validated in T051)
- ✅ **SC-003**: Core tasks complete without time/step increase (test in T072)
- ✅ **SC-004**: 80% existing users rate new design as "better" (post-deployment)
- ✅ **SC-005**: Responsive behavior 320px-2560px without breaking (tested in T060-T062)
- ✅ **SC-006**: Page load <=500ms primary content (validated in T068)
- ✅ **SC-007**: Keyboard accessibility with visible focus (tested in T063-T065)
- ✅ **SC-008**: Accessibility tests pass (validated in T051)
- ✅ **SC-009**: IE11/Edge functionality with acceptable fidelity (tested in T057-T059)
- ✅ **SC-010**: 10,000+ entries render <2s, fluid interactions (tested in T056)

**Ready to begin implementation! Start with Phase 1: Setup** 🚀

