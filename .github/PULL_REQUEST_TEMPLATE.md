---
name: Feature or Bug Fix
about: Propose a new feature or fix a bug
title: "[TYPE]: Short description of changes"
labels:
  - "enhancement"
assignees:
  - your_github_handle # Replace with your GitHub handle
---

## Description

<!-- Briefly describe the changes made in this pull request. -->

## Related Issues/Tasks

<!-- Link any relevant issues or tasks (e.g., #123, T001). -->

## Changes Made

<!-- List the specific code changes and their purpose. -->

## How to Test

<!-- Provide clear, step-by-step instructions for testing the changes. -->

### Responsive Checks

- [ ] **Desktop**: Verify layout and functionality on typical desktop resolutions.
- [ ] **Tablet**: Check responsiveness at tablet breakpoints (e.g., 768px wide).
- [ ] **Mobile**: Confirm mobile-friendly behavior at phone breakpoints (e.g., 360px, 414px wide).
- [ ] No horizontal scrollbars introduced.

### Accessibility Checks

- [ ] **Keyboard Navigation**: All interactive elements are reachable and operable via keyboard.
- [ ] **Focus States**: Visible focus indicators are present on all interactive elements.
- [ ] **Color Contrast**: Text and interactive elements meet WCAG AA contrast ratios in both light and dark modes.
- [ ] **Screen Reader**: Basic content and interactive elements are announced correctly by a screen reader.

### Performance Checks

- [ ] Check Lighthouse CI report in the PR checks for performance regressions.

## Screenshots/Videos (if applicable)

<!-- Add any relevant screenshots or videos demonstrating the changes. -->

## Checklist

- [ ] My code follows the project's style guidelines.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings or errors.
- [ ] I have added tests that prove my fix is effective or my feature works.
- [ ] New and existing unit tests pass locally with my changes.
- [ ] I have checked my code for accessibility issues and fixed them.
