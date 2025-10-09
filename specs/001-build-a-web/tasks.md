# Tasks: Build a web application for renter to help to see analytics about his rents.

**Input**: Design documents from `/specs/001-build-a-web/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the project constitution (II. Comprehensive Testing).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Paths shown below assume monorepo structure with `apps/web/` for the Next.js application and `prisma/` for database.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create monorepo structure with `apps/web` and `prisma` directories
- [ ] T002 Initialize Next.js project in `apps/web` with TypeScript, Tailwind CSS, and ShadCN/UI
- [ ] T003 [P] Configure Tailwind CSS in `apps/web/tailwind.config.ts` and `apps/web/postcss.config.js`
- [ ] T004 [P] Configure `tsconfig.json` for monorepo and Next.js
- [ ] T005 [P] Setup Supabase client in `apps/web/lib/supabase/client.ts`
- [ ] T006 [P] Configure environment variables (`.env.local`) for Supabase and Database URL
- [ ] T007 Initialize Prisma in `prisma/` and configure `schema.prisma` for PostgreSQL
- [ ] T008 [P] Configure linting (ESLint) and formatting (Prettier) tools
- [ ] T009 Create `design.md` file with UI/UX guidelines in `specs/001-build-a-web/design.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create initial Prisma schema for `User`, `RentEntry`, `ExpenseEntry`, `Tag`, `RentEntryTag`, `ExpenseEntryTag` in `prisma/schema.prisma` (from data-model.md)
- [ ] T011 Apply initial Prisma migration and push schema to Supabase database
- [ ] T012 Implement Supabase authentication flow (sign up, sign in, sign out) in `apps/web/lib/supabase/auth.ts` and relevant Next.js API routes (`apps/web/src/app/api/auth/*`)
- [ ] T013 Create a base layout and protected routes for authenticated users in `apps/web/src/app/layout.tsx` and middleware
- [ ] T014 Implement global error handling and logging mechanisms

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Overall Rent Analytics (Priority: P1) 🎯 MVP

**Goal**: Provide a high-level overview of rental performance.

**Independent Test**: Can be fully tested by logging in and navigating to the analytics dashboard, displaying key aggregated metrics.

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Unit test for `calculateRentSummary` utility in `apps/web/src/lib/analytics.test.ts`
- [ ] T015 [P] [US1] Integration test for analytics summary API endpoint in `apps/web/src/app/api/analytics/summary.test.ts`
- [ ] T016 [P] [US1] E2E test: User logs in and sees analytics dashboard with aggregated data in `apps/web/tests/e2e/analytics.spec.ts`

### Implementation for User Story 1

- [ ] T017 [US1] Create Prisma client instance and related types for data access
- [ ] T018 [P] [US1] Implement server-side function to fetch `RentEntry` and `ExpenseEntry` data for a user
- [ ] T019 [P] [US1] Implement utility function to calculate total rent income, total booked days, total platform income, and total expenses (e.g., `apps/web/src/lib/analytics.ts`)
- [ ] T020 [US1] Create API endpoint `/api/analytics/summary` to return aggregated analytics data (refer to `contracts/openapi.yaml`)
- [ ] T021 [US1] Design and implement the analytics dashboard UI components (using ShadCN/UI) in `apps/web/src/components/analytics-dashboard.tsx`
- [ ] T022 [US1] Create the analytics dashboard page (`apps/web/src/app/dashboard/page.tsx`) to display the aggregated data fetched from `/api/analytics/summary`
- [ ] T023 [US1] Add basic loading and error states to the analytics dashboard page

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Analyze Rent Income and Expenses with Filtering (Priority: P1)

**Goal**: Enable detailed analysis of rent income and expenses with tag-based filtering.

**Independent Test**: Can be fully tested by applying filters on the analytics dashboard and verifying the displayed data reflects the tags.

### Tests for User Story 2

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [P] [US2] Unit test for `filterEntriesByTags` utility in `apps/web/src/lib/analytics.test.ts`
- [ ] T025 [P] [US2] Integration test for filtered rent/expense API endpoints in `apps/web/src/app/api/rent_entries.test.ts` and `apps/web/src/app/api/expense_entries.test.ts`
- [ ] T026 [P] [US2] E2E test: User applies a tag filter and verifies filtered data on dashboard in `apps/web/tests/e2e/filtering.spec.ts`

### Implementation for User Story 2

- [ ] T027 [US2] Implement API endpoints for `rent_entries` and `expense_entries` that support filtering by `tag_id` (refer to `contracts/openapi.yaml`)
- [ ] T028 [P] [US2] Implement client-side logic to fetch `RentEntry` and `ExpenseEntry` data with tag filters
- [ ] T029 [P] [US2] Create API endpoints for `tags` (CRUD operations) in `apps/web/src/app/api/tags/*` (refer to `contracts/openapi.yaml`)
- [ ] T030 [P] [US2] Design and implement UI components for tag management (create, edit, delete tags) in `apps/web/src/components/tag-manager.tsx`
- [ ] T031 [US2] Enhance `RentEntry` and `ExpenseEntry` forms to allow assigning existing tags or creating new ones
- [ ] T032 [US2] Integrate tag filtering functionality into the analytics dashboard UI, allowing users to select tags to filter data
- [ ] T033 [US2] Update the analytics data display to react to applied tag filters

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Export Analytics Data (Priority: P2)

**Goal**: Provide the ability to export analytics data in multiple formats.

**Independent Test**: Can be fully tested by initiating an export for a selected format and verifying that a file in that format is downloaded containing the displayed data.

### Tests for User Story 3

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T034 [P] [US3] Unit test for PDF generation utility in `apps/web/src/lib/export/pdf.test.ts`
- [ ] T035 [P] [US3] Unit test for CSV generation utility in `apps/web/src/lib/export/csv.test.ts`
- [ ] T036 [P] [US3] Unit test for Excel generation utility in `apps/web/src/lib/export/excel.test.ts`
- [ ] T037 [P] [US3] Integration test for export API endpoint with different formats and filters in `apps/web/src/app/api/analytics/export.test.ts`
- [ ] T038 [P] [US3] E2E test: User exports data to PDF, CSV, and Excel in `apps/web/tests/e2e/export.spec.ts`

### Implementation for User Story 3

- [ ] T039 [US3] Implement server-side utilities for generating PDF reports from analytics data
- [ ] T040 [P] [US3] Implement server-side utilities for generating CSV files from analytics data
- [ ] T041 [P] [US3] Implement server-side utilities for generating Excel files from analytics data
- [ ] T042 [US3] Create API endpoint `/api/analytics/export` that handles different formats (pdf, csv, excel) and optional tag filters (refer to `contracts/openapi.yaml`)
- [ ] T043 [US3] Design and implement export options in the analytics dashboard UI, allowing users to select format and apply current filters
- [ ] T044 [US3] Implement client-side logic to trigger data export and handle file downloads

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T045 [P] Review and refine UI/UX for consistency and responsiveness across all features
- [ ] T046 Optimize database queries and Prisma usage for analytics endpoints
- [ ] T047 [P] Implement caching strategies for frequently accessed analytics data
- [ ] T048 Enhance logging and monitoring for performance and error tracking
- [ ] T049 Conduct security review for authentication, data access, and API endpoints
- [ ] T050 [P] Update documentation (README, quickstart) with new features and refined instructions
- [ ] T051 Perform comprehensive end-to-end testing of the entire application flow
- [ ] T052 Refactor and clean up any technical debt identified during development

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 components (e.g., existing data display) but should be independently testable.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Relies on data fetched by US1/US2 but can be independently tested for export functionality.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models (Prisma schema) before API endpoints/services
- Server-side logic (API routes, data fetching) before client-side UI integration
- Core implementation before validation and error handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Many Foundational tasks can be parallelized (e.g., Prisma setup vs. Auth implementation)
- Once Foundational phase completes, User Stories 1, 2 and 3 can be worked on in parallel by different team members.
- Within each user story, tasks marked [P] can run in parallel (e.g., separate test files, different UI components).

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for `calculateRentSummary` utility in `apps/web/src/lib/analytics.test.ts`"
Task: "Integration test for analytics summary API endpoint in `apps/web/src/app/api/analytics/summary.test.ts`"
Task: "E2E test: User logs in and sees analytics dashboard with aggregated data in `apps/web/tests/e2e/analytics.spec.ts`"

# Launch parallel implementation tasks for User Story 1:
Task: "Implement server-side function to fetch RentEntry and ExpenseEntry data for a user"
Task: "Implement utility function to calculate total rent income, total booked days, total platform income, and total expenses (e.g., apps/web/src/lib/analytics.ts)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
