# Tasks: Visual Design System Adoption from AI Hiring SaaS CRM

**Input**: Design documents from `/specs/004-as-a-developer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Visual regression testing is explicitly requested in the feature specification for validating design compliance.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths based on existing Next.js application structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and visual testing infrastructure

- [X] T001 Create visual regression testing structure in tests/visual/
- [X] T002 [P] Setup Playwright configuration for visual testing in playwright.config.ts
- [X] T003 [P] Create screenshot baseline directory structure in tests/__screenshots__/
- [X] T004 [P] Initialize design token documentation structure in docs/design-system/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design system infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create design token system in src/lib/design-tokens.ts with color palette from AI Hiring SaaS CRM design reference
- [X] T006 [P] Update Tailwind configuration in tailwind.config.js with new color palette (#FF6B35, #1DCC5C, dark theme colors)
- [X] T007 [P] Update global styles in src/app/globals.css with new CSS custom properties and design tokens
- [X] T008 [P] Create design system documentation in docs/design-system/color-palette.md with usage guidelines
- [X] T009 Setup visual regression testing framework with baseline screenshot capture

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Design System Analysis (Priority: P1) 🎯 MVP

**Goal**: Identify and document all visual design elements from the AI Hiring SaaS CRM design that can be adopted for the rental analytics app

**Independent Test**: Can be fully tested by comparing current visual styling against design reference and documenting specific visual elements that can be adopted (colors, typography, spacing, component styles)

### Tests for User Story 1 ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Create visual regression test for color palette analysis in tests/visual/color-palette.spec.ts
- [X] T011 [P] [US1] Create visual regression test for typography analysis in tests/visual/typography.spec.ts
- [X] T012 [P] [US1] Create visual regression test for spacing analysis in tests/visual/spacing.spec.ts

### Implementation for User Story 1

- [X] T013 [US1] Create design analysis report in docs/design-system/analysis-report.md documenting color palette differences
- [X] T014 [US1] Create component styling analysis in docs/design-system/component-analysis.md documenting card designs, button styles, and layout patterns
- [X] T015 [US1] Create typography analysis in docs/design-system/typography-analysis.md documenting font weights, sizes, and spacing patterns
- [X] T016 [US1] Create actionable styling recommendations in docs/design-system/recommendations.md
- [X] T017 [US1] Validate design analysis against AI Hiring SaaS CRM design reference

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Component Styling Analysis (Priority: P2)

**Goal**: Analyze visual styling patterns from the design reference and identify specific styling patterns that can be applied to existing components

**Independent Test**: Can be fully tested by comparing current component styles against design reference and documenting specific styling attributes that can be adopted

### Tests for User Story 2 ⚠️

- [X] T018 [P] [US2] Create visual regression test for card component styling in tests/visual/card-styling.spec.ts
- [X] T019 [P] [US2] Create visual regression test for button component styling in tests/visual/button-styling.spec.ts
- [X] T020 [P] [US2] Create visual regression test for interactive elements in tests/visual/interactive-elements.spec.ts

### Implementation for User Story 2

- [X] T021 [P] [US2] Update card component styling in src/components/ui/card.tsx with rounded corners, shadows, and spacing from design reference
- [X] T022 [P] [US2] Update input component styling in src/components/ui/input.tsx with new focus states and colors
- [X] T023 [US2] Create component styling documentation in docs/design-system/component-styling.md
- [X] T024 [US2] Validate component styling against design reference

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Layout and Spacing Analysis (Priority: P3)

**Goal**: Analyze layout patterns, spacing, and visual hierarchy from the design reference to identify improvements for current dashboard layout

**Independent Test**: Can be fully tested by comparing current layout patterns against design reference and documenting spacing, grid, and hierarchy improvements

### Tests for User Story 3 ⚠️

- [X] T026 [P] [US3] Create visual regression test for layout components in tests/visual/layout-components.spec.ts
- [X] T027 [P] [US3] Create visual regression test for dashboard layout in tests/visual/dashboard-layout.spec.ts
- [X] T028 [P] [US3] Create visual regression test for spacing consistency in tests/visual/spacing-consistency.spec.ts

### Implementation for User Story 3

- [X] T029 [P] [US3] Update bottom navigation in src/components/Layout/BottomNav.tsx with new color palette and spacing
- [X] T030 [P] [US3] Update dashboard layout in src/app/dashboard/page.tsx with improved grid layouts and spacing patterns
- [X] T031 [US3] Update dashboard content in src/components/dashboard-content.tsx with improved visual hierarchy and typography
- [X] T032 [US3] Create layout documentation in docs/design-system/layout-patterns.md
- [X] T033 [US3] Validate layout improvements against design reference

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Implementation and Integration

**Purpose**: Apply the design system analysis to implement the complete visual redesign

### Layout Components Implementation (Priority Order from Clarifications)

**CRITICAL**: Layout components must be updated first as specified in clarifications

- [X] T034 [P] Update sidebar navigation styling in src/components/Layout/Sidebar.tsx with orange accent colors for active states, improved spacing, and hierarchical menu organization
- [X] T035 [P] Update header component styling in src/app/layout.tsx with improved typography hierarchy and spacing (maintain existing structure)
- [X] T036 [P] Update navigation components with proper spacing and typography hierarchy

### Dashboard Components Implementation

**DEPENDENCY**: Can proceed after layout components are complete

- [X] T037 [P] Update metrics cards in src/components/dashboard/MetricsCard.tsx with new card styling, shadows, and spacing
- [X] T038 [P] Update chart components in src/app/dashboard/rent-analytics.tsx and expense-analytics.tsx with new color palette

### UI Components Implementation

**DEPENDENCY**: Can proceed after layout components are complete

- [X] T039 [P] Update button component styling in src/components/ui/button.tsx with orange primary (#FF6B35) and green success (#1DCC5C) colors
- [X] T040 [P] Update export button styling in src/components/ui/export-button.tsx with green success color (#1DCC5C)
- [X] T041 [P] Update form components in src/components/forms/ with new styling patterns and focus states
- [X] T042 [P] Update tag components in src/components/tags/ with new color scheme and spacing

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cross-cutting improvements

- [X] T043 [P] Run comprehensive visual regression testing suite
- [X] T044 [P] Validate all components match AI Hiring SaaS CRM design reference with 95% visual similarity
- [X] T045 [P] Run comprehensive visual redesign validation to ensure complete implementation of design system adoption
- [X] T046 [P] Update design system documentation in docs/design-system/
- [X] T047 [P] Define performance budget for visual changes (CSS bundle size, render time, layout shift metrics)
- [X] T048 [P] Performance testing to ensure no degradation from visual changes against defined budget
- [X] T049 [P] Accessibility testing for visual changes
- [X] T050 [P] Code cleanup and refactoring of styling implementations
- [X] T051 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Implementation (Phase 6)**: Depends on all analysis user stories (US1, US2, US3)
- **Polish (Final Phase)**: Depends on implementation phase completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent analysis of component styling
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent analysis of layout and spacing

### Within Each User Story

- Tests (included) MUST be written and FAIL before implementation
- Analysis documentation before implementation tasks
- Component updates before validation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Analysis tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Implementation tasks marked [P] can run in parallel across different components

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create visual regression test for color palette analysis in tests/visual/color-palette.spec.ts"
Task: "Create visual regression test for typography analysis in tests/visual/typography.spec.ts"
Task: "Create visual regression test for spacing analysis in tests/visual/spacing.spec.ts"

# Launch all analysis tasks for User Story 1 together:
Task: "Create design analysis report in docs/design-system/analysis-report.md"
Task: "Create component styling analysis in docs/design-system/component-analysis.md"
Task: "Create typography analysis in docs/design-system/typography-analysis.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Visual Design System Analysis)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Analysis MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Component Analysis!)
4. Add User Story 3 → Test independently → Deploy/Demo (Layout Analysis!)
5. Add Implementation Phase → Complete Visual Redesign
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Visual Design System Analysis)
   - Developer B: User Story 2 (Component Styling Analysis)
   - Developer C: User Story 3 (Layout and Spacing Analysis)
3. Stories complete and integrate independently
4. Implementation phase can proceed with multiple developers working on different components in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Visual regression testing is required for all component updates
- Maintain backward compatibility with existing component APIs
- Focus on visual design adoption without changing core functionality
