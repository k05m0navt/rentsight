# Tasks: Build a web application for renter to help to see analytics about his rents.

**Feature Branch**: `001-build-a-web`  
**Date**: 2025-10-09

## Summary

This document outlines the tasks required to implement the Rentsight Analytics web application, organized by user story and prioritized for incremental delivery.

**Total Task Count**: 35
**Task Count per User Story**:
- User Story 1: 6 tasks
- User Story 2: 7 tasks
- User Story 3: 4 tasks
**Parallel Opportunities Identified**: Yes, within and across user stories after foundational tasks.
**Independent Test Criteria per Story**: Yes, detailed in each story phase.
**Suggested MVP Scope**: User Story 1 - View Overall Rent Analytics.

## Phases

### Phase 1: Setup (Project Initialization)

*   ~~**T001**: Initialize Next.js project with TypeScript, Tailwind CSS, and ShadCN/UI in the root directory. (`/`)~~
*   ~~**T002**: Configure ESLint and Prettier for code consistency. (`/`)~~
*   ~~**T003**: Set up Supabase client and environment variables for local and production environments. (`/`)~~
*   ~~**T004**: Configure Prisma ORM and generate Prisma client for database interactions. (`/`)~~

### Phase 2: Foundational Tasks (Blocking Prerequisites)

*   ~~**T005**: Implement user authentication (sign up, log in, log out) using Supabase Auth. (`src/`)~~
*   ~~**T006**: Define Prisma schema for `User`, `RentEntry`, `ExpenseEntry`, `Tag`, `RentEntryTag`, and `ExpenseEntryTag` based on `data-model.md`. (`prisma/schema.prisma`)~~
*   ~~**T007**: Apply initial database migrations using Prisma Migrate. (`prisma/migrations/`)~~
*   ~~**T008**: Implement basic CRUD operations for the `Tag` entity. (`src/services/tagService.ts`, `src/app/api/tags/route.ts`)~~

### Phase 3: User Story 1 - View Overall Rent Analytics (P1)

*   **Story Goal**: As a renter, I want to see a comprehensive overview of my rent income, total booked days, and total income across all platforms so I can quickly understand my overall rental performance.
*   **Independent Test Criteria**: The user can log in, navigate to the analytics dashboard, and see key aggregated metrics displayed correctly (total rent income, total booked days, total income from all platforms).
*   **Tasks**:
    *   ~~**T009 [US1]**: Implement API endpoint to get aggregated rent and expense analytics summary (`GET /api/analytics/summary`). (`src/app/api/analytics/summary/route.ts`)~~
    *   ~~**T010 [US1]**: Create a dashboard page component to display overall rent analytics. (`src/app/dashboard/page.tsx`)~~
    *   ~~**T011 [US1] [P]**: Fetch and display total rent income on the dashboard. (`src/app/dashboard/page.tsx`)~~
    *   ~~**T012 [US1] [P]**: Fetch and display total number of booked days on the dashboard. (`src/app/dashboard/page.tsx`)~~
    *   ~~**T013 [US1] [P]**: Fetch and display total income from all platforms on the dashboard. (`src/app/dashboard/page.tsx`)~~
    *   ~~**T014 [US1]**: Implement UI to display a clear message when no data is available for analytics. (`src/app/dashboard/page.tsx`)~~
*   **CHECKPOINT: User Story 1 Complete**

### Phase 4: User Story 2 - Analyze Rent Income and Expenses with Filtering (P1)

*   **Story Goal**: As a renter, I want to view detailed analytics on my rent income and expenses, and be able to filter this data using custom tags, so I can understand profitability and identify trends for specific properties or periods.
*   **Independent Test Criteria**: The user can apply tag filters on the analytics dashboard for both rent income and expenses, and the displayed data accurately reflects the applied filters.
*   **Tasks**:
    *   ~~**T015 [US2]**: Implement API endpoint to get all rent entries with optional tag filtering (`GET /api/rent_entries?tag_id=...`). (`src/app/api/rent_entries/route.ts`)~~
    *   ~~**T016 [US2]**: Implement API endpoint to get all expense entries with optional tag filtering (`GET /api/expense_entries?tag_id=...`). (`src/app/api/expense_entries/route.ts`)~~
    *   ~~**T017 [US2] [P]**: Create UI components for adding and managing tags (e.g., tag input, tag list). (`src/components/ui/tag-manager.tsx`)~~
    *   ~~**T018 [US2]**: Integrate tag management into rent and expense entry forms. (`src/components/forms/rent-entry-form.tsx`, `src/components/forms/expense-entry-form.tsx`)~~
    *   ~~**T019 [US2] [P]**: Implement UI for displaying detailed rent income analytics with tag filtering. (`src/app/dashboard/rent-analytics.tsx`)~~
    *   ~~**T020 [US2] [P]**: Implement UI for displaying detailed expense analytics with tag filtering. (`src/app/dashboard/expense-analytics.tsx`)~~
    *   ~~**T021 [US2]**: Ensure the displayed data updates dynamically based on selected tag filters. (`src/app/dashboard/page.tsx`)~~
*   **CHECKPOINT: User Story 2 Complete**

### Phase 5: User Story 3 - Export Analytics Data (P2)

*   **Story Goal**: As a renter, I want to export my analytics data in PDF, CSV, or Excel formats, so I can share it with others or perform further analysis offline.
*   **Independent Test Criteria**: The user can initiate an export for a selected format (PDF, CSV, Excel) and download a file in that format containing the currently displayed analytics data.
*   **Tasks**:
    *   ~~**T022 [US3]**: Implement API endpoint for exporting analytics data in PDF, CSV, and Excel formats (`GET /api/analytics/export?format=...&tag_ids=...`). (`src/app/api/analytics/export/route.ts`)~~
    *   ~~**T023 [US3]**: Create UI components for selecting export format and initiating the export process. (`src/components/ui/export-button.tsx`)~~
    *   ~~**T024 [US3]**: Integrate export functionality into the analytics dashboard. (`src/app/dashboard/page.tsx`)~~
    *   ~~**T025 [US3]**: Implement server-side logic to handle large data volumes during export, ensuring responsiveness and completion within reasonable timeframes. (`src/app/api/analytics/export/route.ts`)~~
*   **CHECKPOINT: User Story 3 Complete**

### Phase 6: Polish & Cross-Cutting Concerns

*   ~~**T026**: Enhance user login/registration UI and error handling. (`src/app/login/page.tsx`, `src/app/signup/page.tsx`)~~
*   ~~**T027**: Implement client-side validation for all `amount` fields to ensure they are positive. (`src/components/forms/*.tsx`)~~
*   ~~**T028**: Implement client-side validation for `booked_days` to ensure it is a positive integer. (`src/components/forms/rent-entry-form.tsx`)~~
*   ~~**T029**: Implement client-side validation for `platform` and `category` fields to ensure they are non-empty strings. (`src/components/forms/*.tsx`)~~
*   ~~**T030**: Implement client-side validation for `RentEntry` dates to ensure `start_date` is before or equal to `end_date`. (`src/components/forms/rent-entry-form.tsx`)~~
*   ~~**T031**: Ensure email input has valid format and uniqueness checks (client-side where possible, server-side via Supabase). (`src/app/signup/page.tsx`)~~
*   ~~**T032**: Leverage Supabase Auth for password complexity requirements. (`src/app/signup/page.tsx`)~~
*   ~~**T033**: Implement client-side validation for tag `name` to ensure uniqueness per user and non-empty. (`src/components/ui/tag-manager.tsx`)~~
*   ~~**T034**: Implement responsive design across all major UI components and pages. (`src/app/**/*.tsx`, `src/components/**/*.tsx`)~~
*   ~~**T035**: Conduct performance optimization for data fetching, filtering, and rendering, targeting specified success criteria (e.g., dashboard load time < 3s). (`src/app/**/*.tsx`, `src/services/*.ts`)~~