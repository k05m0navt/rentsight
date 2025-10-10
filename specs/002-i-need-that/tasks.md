# Tasks: Modern responsive design and dark mode

Feature: Modern responsive design and dark mode
Branch: `002-i-need-that`

Total tasks: 19

Terminology: In this task list and related docs, **Primary pages** = Dashboard, Rent entry form, Expense entry form, Tag manager. Use this canonical term in all task descriptions and PR titles.

## Phase 1 — Setup (shared)

T001. Initialize design system and tooling [P]
- Goal: Add Tailwind configuration, tokens, and a theme provider skeleton.
- Files/paths: `src/styles/tailwind.config.js`, `src/styles/globals.css`, `src/styles/tokens.css`, `src/components/ThemeProvider.tsx`
- Steps:
  1. Add/verify Tailwind config matches project (colors, darkMode: 'class').
  2. Create CSS variables file `tokens.css` for semantic color tokens and include in `globals.css`.
  3. Add `ThemeProvider.tsx` placeholder exporting context and hook (no server persistence).
- Notes: Parallelizable with other setup tasks.

- [X] T002. Verify Aceternity UI availability & prepare fallback [P]
- Goal: Check if `@aceternity/ui` is accessible; if not, prepare `shadcn/ui`.
- Files/paths: `package.json`, `src/components/ui/` directory
- Steps:
  1. Attempt `npm view @aceternity/ui` or check license/access.
  2. If available, add `@aceternity/ui` to `package.json` and create shim components in `src/components/ui/`.
  3. If not available, add `shadcn/ui` dependencies and component shims.
- Notes: [P] parallel with T001.

- [X] T003. Add accessibility and performance verification tasks to CI [P]
- Goal: Create scripts to run basic accessibility checks (axe) and Lighthouse/perf checks in CI.
- Files/paths: `.github/workflows/ui-ci.yml`, `package.json` scripts
- Steps:
  1. Add `axe` or Playwright accessibility checks script.
  2. Add a Lighthouse/perf smoke script for primary pages.
  3. Wire into CI as optional checks for PRs.
  4. Add Lighthouse budgets and CI enforcement step to fail on regressions.
  5. Add tasks for performance optimizations (critical CSS, code-splitting, image optimization) and link to T008/T009/T012 as implementation targets.

## Phase 2 — Foundational (blocking prerequisites)

T004. Implement ThemeProvider and localStorage persistence
- Goal: Provide runtime theme switching and persistence via `localStorage`.
- Files/paths: `src/components/ThemeProvider.tsx`, `src/hooks/useTheme.ts`
- Steps:
  1. Implement `useTheme` hook: read `localStorage` or fallback to `window.matchMedia('(prefers-color-scheme: dark)')`.
  2. Implement `ThemeProvider` that wraps `html` or app layout to toggle `dark` class on root element.
  3. Add minimal unit tests if testing is desired (not required by spec).
- Notes: Blocking for UI stories that rely on theme.

T005. Add semantic color tokens and dark mode CSS variables
- Goal: Define color tokens (primary, background, surface, text) and dark variants.
- Files/paths: `src/styles/tokens.css`, `src/styles/globals.css`
- Steps:
  1. Define `--color-bg`, `--color-surface`, `--color-text-primary`, `--color-text-secondary`, etc.
  2. Provide `:root` and `.dark` variants for tokens.
  3. Use tokens in `globals.css` for base elements.

- [X] T006. Create responsive layout primitives
- Goal: Implement container and grid primitives used across pages.
- Files/paths: `src/components/Layout/Container.tsx`, `src/components/Layout/Grid.tsx`
- Steps:
  1. Create `Container` component with responsive max widths and padding.
  2. Create `Grid` helper for responsive columns.

T019. Implement performance optimizations (critical path & budgets) [P]
- Goal: Implement concrete optimizations to meet SC-005 (perceived load <= 500ms for primary content).
- Files/paths: `src/styles/` (critical CSS output), `src/components/` (lazy boundaries), `public/images/` (responsive images), `.github/workflows/ui-ci.yml`
- Steps:
  1. Extract and inline critical CSS for primary pages (dashboard, rent/expense, tag manager).
  2. Add code-splitting and lazy-loading boundaries for non-critical UI (defer heavy widgets).
  3. Implement responsive image pipeline (srcset, WebP generation, compression).
  4. [X] Add resource hints (preconnect/prefetch) for external assets.
  5. Add Lighthouse budgets and CI enforcement (fail on regressions) and measurement script to record perceived primary-content render times.
- Notes: Parallelizable across components and assets; link owners from T008/T009/T012.

## Phase 3 — User Story 1 (P1): Use app comfortably on any device

Story goal: Ensure dashboard and primary pages render and function on mobile and desktop without horizontal scrolling; primary actions reachable within 2 taps.

Independent test: Open dashboard at viewport widths 360px, 768px, 1024px — 95% of layouts render without horizontal scroll and primary actions reachable.

- [X] T007. Update main layout and navigation for responsive behavior
- Files/paths: `src/app/layout.tsx`, `src/components/Nav/TopNav.tsx`, `src/components/Nav/MobileNav.tsx`
- Steps:
  1. Ensure nav collapses to a mobile-friendly drawer/menu for small viewports.
  2. Ensure primary CTA is visible and reachable (tappable area >= 44px) on mobile.
- Parallelizable: No (modifies the same layout files).

- [X] T008. Refactor dashboard content cards for responsive stacking
- Files/paths: `src/components/Dashboard/Card.tsx`, `src/app/dashboard/page.tsx`
- Steps:
  1. Convert fixed-width cards to fluid cards using Tailwind responsive utilities.
  2. Add stacking behavior and spacing tokens.
- Parallelizable: Yes ([P])

- [X] T009. Ensure forms are mobile-friendly (rent/expense entry)
- Files/paths: `src/components/forms/rent-entry-form.tsx`, `src/components/forms/expense-entry-form.tsx`
- Steps:
  1. Increase input sizes, ensure labels and inputs stack vertically on small screens.
  2. Ensure submit controls are reachable and not obscured by mobile UI.
- Parallelizable: Yes ([P])

- [X] T010. Add responsive tests (manual checklist)
- Goal: Create a testing checklist for QA to validate the responsive behavior.
- Files/paths: `specs/002-i-need-that/checklists/responsive-testing.md`
- Steps:
  1. List viewport widths and test steps for dashboard, forms, tag manager.

Checkpoint: Finish US1 tasks before US2. [X]

## Phase 4 — User Story 2 (P2): Dark mode support with easy toggle

Story goal: Provide dark mode with theme toggle and ensure visual consistency for all components.

Independent test: Toggle dark mode; verify no contrast violations and icons/images render appropriately.

T011. Implement global theme toggle UI
- Files/paths: `src/components/ui/ThemeToggle.tsx`, `src/app/layout.tsx`
- Steps:
  1. Add ThemeToggle component using accessible button semantics.
  2. Hook toggle into `useTheme` and `ThemeProvider` from T004.
- Parallelizable: Yes ([P])

- [X] T012. Update all UI components to use semantic tokens and dark variants
- Files/paths: `src/components/ui/` (components like `Button.tsx`, `Card.tsx`, `Badge.tsx`)
- Steps:
  1. Replace hardcoded colors with CSS variables defined in tokens.css.
  2. Verify icons/images have dark mode variants or filters.
- Parallelizable: Yes ([P])

- [X] T013. Run accessibility contrast checks and fix issues
- Files/paths: `src/components/ui/*`, `specs/002-i-need-that/checklists/requirements.md`
- Steps:
  1. Run color contrast tests (axe or manual sampling) and log failures.
  2. Adjust tokens to meet WCAG AA (4.5:1) for normal text.
  3. Ensure images/icons have accessible alternatives or dark variants.
- Parallelizable: Yes ([P])

Checkpoint: Finish US2 tasks before US3. [X]

## Phase 5 — User Story 3 (P3): Accessibility and visual polish

Story goal: Improve typography, spacing, focus states, and ensure keyboard operability.

Independent test: Run manual accessibility checks and keyboard navigation to ensure all primary controls are reachable and show focus.

- [X] T014. Implement visible focus styles and logical tab order
- Files/paths: `src/styles/tokens.css`, `src/components/*`
- Steps:
  1. Define `:focus` styles that are visible and meet contrast.
  2. Audit tab order on key pages and fix traps.
- Parallelizable: Yes ([P])

- [X] T015. Improve typography scale and spacing
- Files/paths: `src/styles/tokens.css`, `src/components/Typography/*`
- Steps:
  1. Define typographic scale variables and apply to headings/paragraphs.
  2. Ensure readable line-height and sizes for mobile.
- Parallelizable: Yes ([P])

- [X] T016. Accessibility regression checklist and QA run
- Files/paths: `specs/002-i-need-that/checklists/requirements.md`, `specs/002-i-need-that/checklists/responsive-testing.md`
- Steps:
  1. Create an accessibility regression checklist.
  2. Run manual QA and document any remaining issues.

Checkpoint: Finish US3 tasks before US4. [X]

## Phase 6 — Polish & Cross-cutting

- [X] T017. Integrate CI checks and PR templates for accessibility/perf
- Files/paths: `.github/workflows/ui-ci.yml`, `.github/PULL_REQUEST_TEMPLATE.md`
- Steps:
  1. Ensure CI runs accessibility/perf smoke tests.
  2. Add PR template reminding reviewers to run responsive and accessibility checks.

T018. Final UX review and usability testing (MVP scope)
- Files/paths: `specs/002-i-need-that/research.md`, `specs/002-i-need-that/plan.md`
- Steps:
  1. Conduct a 20-participant usability review focusing on mobile and dark mode.
  2. Collect scores for "modern and usable" metric; aim for >=85%.

## Dependencies

- Order: Setup (T001-T003) → Foundational (T004-T006) → US1 (T007-T010) → US2 (T011-T013) → US3 (T014-T016) → Polish (T017-T018)

## Parallel execution examples

- While T004 (ThemeProvider) is required before T011 (ThemeToggle), tasks like T008, T009, T012, T015 can run in parallel across different component files.

## Suggested MVP

- Implement Phase 1 Setup + Phase 2 Foundational + Phase 3 User Story 1 (T001-T010). This delivers a usable mobile-friendly UI baseline.


