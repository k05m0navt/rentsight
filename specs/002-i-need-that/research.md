# Research: Modern responsive design + dark mode

Date: 2025-10-09

Decisions and research notes resolving open items from the spec.

1) UI library choice

- Decision: Use **Aceternity UI** for design components if the project has access/licenses. If Aceternity is unavailable or integration proves difficult, use **shadcn/ui** as the fallback.
- Rationale: The user requested Aceternity as primary; shadcn/ui is a proven Tailwind-friendly alternative with examples and community support.
- Alternatives considered: Tailwind-only custom components (higher implementation cost), Chakra UI / Radix (different design language).

Action: Verify access to Aceternity package or design tokens before implementation (task in Phase 1).

2) CSS system

- Decision: Adopt Tailwind CSS for utility-first styling and theming. Use CSS variables for semantic tokens (colors, spacings) to support dark mode variants.
- Rationale: User requested Tailwind; existing repo already contains Tailwind/postcss configuration artifacts.

3) Theme persistence

- Decision: Persist theme preference client-side using browser localStorage (no server changes). Default to system color-scheme on first visit.
- Rationale: Minimizes backend work and satisfies user preference requirement; matches earlier clarification.

4) Accessibility targets

- Decision: Target WCAG AA contrast (4.5:1 normal text) and require full keyboard operability with visible focus states for interactive controls.
- Rationale: Explicitly set measurable targets per spec clarifications.

5) Performance target

- Decision: Primary above-the-fold content should be perceivable within 500ms on representative mobile devices (perceived load <= 500ms). This will guide resource prioritization and code-splitting.

6) Data model impact

- Decision: No server-side data model changes required. ThemePreference is stored client-side only. (Optional server API for cross-device sync deferred to planning.)

7) Unknowns / TODOs

- Verify Aceternity access and licensing. (Phase 1 task)
- Confirm exact browser/Node version targets for build/test matrix. (Phase 1)
- Decide on testing stack (recommend Vitest + Playwright). (Phase 1)


