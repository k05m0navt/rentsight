# Implementation Tasks: Enhanced Platform Support with Russian Markets

**Branch**: `007-i-need-to` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-i-need-to/spec.md`

## Summary

Replace current hardcoded platform options with Russian rental platforms (Avito, Cian, Sutochno.ru) and enable custom platform entry with user-specific management. This addresses the limitation where users can only select from 4 generic options and cannot specify custom platform names when selecting "Other".

**Total Tasks**: 55 tasks (47 original + 8 additional coverage tasks)

## Implementation Strategy

**MVP Scope**: User Story 1 (Russian Platform Selection) - provides immediate value for Russian users  
**Incremental Delivery**: Each user story is independently testable and deployable  
**Parallel Development**: Database and API tasks can be developed in parallel with UI components

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize project structure and dependencies for platform management feature

- [x] T001 Initialize platform management feature branch from main
- [x] T002 [P] Create platform-specific component directory structure in `src/app/components/platform/`
- [x] T003 [P] Create platform API routes directory structure in `src/app/api/platforms/`
- [x] T004 [P] Update TypeScript types for platform management in `src/types/regional.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create CustomPlatform database schema in `prisma/schema.prisma`
- [x] T006 [P] Add custom_platform_name column to RentEntry table in `prisma/schema.prisma`
- [x] T007 [P] Generate and run Prisma migration for CustomPlatform table
- [x] T008 [P] Update regional-config.ts with Russian platforms (completely replace current 4 options with 8+ Russian platforms)
- [x] T009 [P] Create platform validation schemas in `src/lib/validations.ts`
- [x] T010 Create platform service layer in `src/lib/services/platformService.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Russian Platform Selection (Priority: P1) 🎯 MVP

**Goal**: Russian property managers can select from popular Russian rental platforms when creating rent entries

**Independent Test**: Create a rent entry and verify that Russian platforms appear in the platform dropdown and can be selected successfully

### Implementation for User Story 1

- [x] T011 [US1] Update rent-entry-form.tsx to use Russian platforms from regional-config.ts
- [x] T012 [US1] Replace hardcoded platformOptions array with dynamic platform loading
- [x] T013 [US1] Update platform dropdown to display Russian platform names correctly
- [x] T014 [US1] Ensure platform selection saves correctly to database
- [x] T015 [US1] Update reports/analytics to display Russian platform names
- [x] T016 [US1] Test platform selection performance (must load within 2 seconds)
- [x] T016a [US1] Add performance monitoring for platform dropdown loading time

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Custom Platform Entry (Priority: P2)

**Goal**: Users can add custom platform names when "Other" option is selected, allowing them to specify exactly which platform they used

**Independent Test**: Select "Other" platform option and verify that a text input appears allowing custom platform name entry

### Implementation for User Story 2

- [x] T017 [US2] Create CustomPlatform API endpoints in `src/app/api/platforms/custom/route.ts`
- [x] T018 [US2] Create CustomPlatform API endpoints in `src/app/api/platforms/custom/[id]/route.ts`
- [x] T019 [US2] Create CustomPlatform API endpoints in `src/app/api/platforms/custom/[id]/usage/route.ts`
- [x] T020 [US2] Update rent-entry-form.tsx to show text input when "Other" is selected
- [x] T021 [US2] Add custom platform name validation (2-100 characters, error preservation)
- [x] T021a [US2] Test international character support in custom platform names
- [x] T022 [US2] Implement custom platform creation logic in form submission
- [x] T023 [US2] Update platform dropdown to include user's custom platforms
- [x] T024 [US2] Update rent entries API to handle custom_platform_name field
- [x] T025 [US2] Update reports to display custom platform names correctly
- [x] T025a [US2] Update dashboard analytics to show custom platform names
- [x] T025b [US2] Update income summary reports to display custom platform names
- [x] T025c [US2] Update export functionality to include custom platform names
- [x] T026 [US2] Test custom platform persistence and retrieval

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Platform Management (Priority: P3)

**Goal**: Users can manage their custom platforms through a dedicated interface, allowing them to edit, delete, or organize their frequently used platforms

**Independent Test**: Access platform management interface and perform CRUD operations on custom platforms

### Implementation for User Story 3

- [x] T027 [US3] Create PlatformManagementModal component in `src/app/components/platform/PlatformManagementModal.tsx`
- [x] T028 [US3] Create CustomPlatformList component in `src/app/components/platform/CustomPlatformList.tsx`
- [x] T029 [US3] Create CustomPlatformForm component in `src/app/components/platform/CustomPlatformForm.tsx`
- [x] T030 [US3] Add platform management button to rent-entry-form.tsx
- [x] T031 [US3] Implement platform management modal opening/closing logic
- [x] T032 [US3] Implement custom platform editing functionality
- [x] T033 [US3] Implement custom platform deletion with usage check
- [x] T034 [US3] Add usage count tracking for custom platforms
- [x] T035 [US3] Implement duplicate platform name prevention
- [x] T036 [US3] Add platform management error handling and user feedback
- [x] T037 [US3] Test platform management operations (create, edit, delete)

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, performance optimization, and cross-cutting concerns

- [x] T038 Update all existing rent entry queries to handle custom_platform_name field
- [x] T039 [P] Add platform display name logic to all reports and analytics views
- [x] T040 [P] Implement platform caching for performance optimization
- [x] T041 [P] Add comprehensive error handling for platform operations
- [x] T042 [P] Update database indexes for optimal platform query performance
- [x] T043 [P] Add platform management logging and monitoring
- [x] T044 [P] Update documentation for new platform features
- [x] T045 [P] Test backward compatibility with existing rent entries
- [x] T045a [P] Test existing "Other" platform entries display correctly
- [x] T045b [P] Test existing predefined platform entries continue to work
- [x] T045c [P] Test data migration preserves all existing rent entry data
- [x] T046 [P] Performance testing for platform selection and management
- [x] T047 [P] End-to-end testing of complete platform workflow
- [x] T047a [P] E2E test: User creates rent entry with Russian platform selection
- [x] T047b [P] E2E test: User creates rent entry with custom platform name
- [x] T047c [P] E2E test: User manages custom platforms (create, edit, delete)
- [x] T047d [P] E2E test: User views reports with custom platform names

---

## Dependencies

### User Story Completion Order
1. **User Story 1** (P1) - Can be implemented immediately after Phase 2
2. **User Story 2** (P2) - Depends on User Story 1 for platform dropdown integration
3. **User Story 3** (P3) - Depends on User Story 2 for custom platform data

### Critical Path
- **T005 → T007**: Database schema must be complete before any user story implementation
- **T008 → T011**: Russian platforms must be configured before form updates
- **T017-T019 → T020-T026**: Custom platform API must be complete before form integration
- **T027-T037**: Platform management depends on custom platform functionality

## Parallel Execution Examples

### Phase 2 (Foundational) - Can run in parallel:
- T006, T007, T008, T009, T010 can all be developed simultaneously

### Phase 3 (User Story 1) - Can run in parallel:
- T011, T012, T013 can be developed simultaneously
- T014, T015, T016 can be developed simultaneously

### Phase 4 (User Story 2) - Can run in parallel:
- T017, T018, T019 can be developed simultaneously
- T020, T021, T022 can be developed simultaneously
- T023, T024, T025, T026 can be developed simultaneously

### Phase 5 (User Story 3) - Can run in parallel:
- T027, T028, T029 can be developed simultaneously
- T030, T031, T032 can be developed simultaneously
- T033, T034, T035, T036, T037 can be developed simultaneously

## Success Criteria Validation

- **SC-001**: Users can select from at least 8 Russian platforms within 2 seconds (T016)
- **SC-002**: 95% of users can successfully create a rent entry with custom platform name in under 30 seconds (T026)
- **SC-003**: Custom platform names are accurately displayed in 100% of reports and analytics views (T025, T039)
- **SC-004**: Platform management operations complete successfully for 99% of user actions (T037)
- **SC-005**: System maintains data integrity with zero data loss when managing custom platforms (T045)

## Task Summary

- **Total Tasks**: 47
- **Setup Tasks**: 4 (T001-T004)
- **Foundational Tasks**: 6 (T005-T010)
- **User Story 1 Tasks**: 6 (T011-T016)
- **User Story 2 Tasks**: 10 (T017-T026)
- **User Story 3 Tasks**: 11 (T027-T037)
- **Polish Tasks**: 10 (T038-T047)

**Parallel Opportunities**: 23 tasks can be developed in parallel across different phases

**MVP Scope**: Tasks T001-T016 (Setup + Foundational + User Story 1) provide complete Russian platform selection functionality
