# Quickstart

Steps to begin implementing the UI updates locally.

1. Install dependencies

```bash
npm install
# Install Tailwind if not present: follow project README
```

2. Verify Tailwind setup and PostCSS

3. Check Aceternity UI availability

- If `@aceternity/ui` is available, install and follow its integration guide.
- Otherwise, install `@/shadcn/ui` components and follow shadcn setup.

4. Start dev server

```bash
npm run dev
```

5. QA and measurement notes

- Measuring SC-002 (theme persistence): Toggle the theme, reload the page, and verify `localStorage` contains the theme key (e.g., `theme = "dark"`). Repeat across sample devices/browsers (recommend 30 attempts per device) and report the % of successful persistence checks.
- Measuring SC-005 (perceived load): Run the provided Lighthouse/perf smoke script (added by T003) against primary pages and record "First Contentful Paint" / "Largest Contentful Paint" and custom perceived-primary-content timing. Use CI budgets to detect regressions.

