# Accessibility Regression Checklist

**Feature**: Modern responsive design and dark mode
**Date**: 2025-10-09
**Reference**: `specs/002-i-need-that/spec.md` (User Story 3)

## Purpose

To ensure that recent changes have not introduced new accessibility issues and that the application continues to meet WCAG AA standards for critical user flows.

## Test Environment

-   Browser Developer Tools (Accessibility Tab, Lighthouse Audit)
-   Screen Reader (e.g., VoiceOver on macOS, NVDA/JAWS on Windows, TalkBack on Android)
-   Keyboard-only navigation

## Core Scenarios & Pages to Test (Primary Pages: Dashboard, Rent Entry Form, Expense Entry Form, Tag Manager)

### 1. Keyboard Operability

-   [ ] **Tab Order**: Verify a logical and predictable tab order through all interactive elements on primary pages (buttons, links, inputs, dropdowns).
-   [ ] **Focus Indicators**: Ensure all interactive elements display a clear and visible focus indicator (outline/ring) when navigated to via keyboard.
-   [ ] **Interactive Elements**: All interactive elements (buttons, links, form controls) are operable using only the keyboard (e.g., Enter/Space to activate, Arrow keys for dropdowns).
-   [ ] **No Keyboard Traps**: Ensure no element traps keyboard focus, preventing users from tabbing away.

### 2. Semantic HTML & ARIA

-   [ ] **Semantic Elements**: Verify appropriate semantic HTML5 elements are used (e.g., `<nav>`, `<header>`, `<main>`, `<footer>`, `<button>`, `<input>`).
-   [ ] **ARIA Attributes**: Check for correct use of ARIA attributes where native HTML semantics are insufficient (e.g., `aria-label`, `aria-expanded`, `aria-controls` for custom widgets).
-   [ ] **Headings**: Ensure logical heading structure (h1, h2, h3, etc.) is maintained, providing an outline of the page content.

### 3. Visual & Perceptual

-   [ ] **Color Contrast (WCAG AA)**:
    -   [ ] Verify text and interactive elements maintain a contrast ratio of at least 4.5:1 against their background in both light and dark modes.
    -   [ ] Check non-text elements (e.g., icons, focus indicators) have sufficient contrast (3:1).
-   [ ] **Responsive Layout**: Confirm the layout remains consistent and usable, without horizontal scrolling, across various screen sizes (360px, 768px, 1024px).
-   [ ] **Images & Icons**: All informational images have appropriate `alt` text. Decorative images are properly ignored by assistive technologies. Icons convey meaning or have alternative text if standalone.
-   [ ] **Dark Mode Visuals**: Confirm all visual elements (text, backgrounds, borders, icons) transition correctly and maintain legibility/aesthetics in dark mode.

### 4. Form Accessibility (Rent Entry, Expense Entry, Tag Manager Forms)

-   [ ] **Labels**: All form input fields have clearly associated, visible labels.
-   [ ] **Error Handling**: Form validation errors are clearly communicated to all users (visual, programmatic) and easily discoverable.
-   [ ] **Required Fields**: Required fields are programmatically identified (e.g., `aria-required`).

### 5. Screen Reader Compatibility

-   [ ] **Read-aloud Test**: Navigate primary pages using a screen reader. Ensure content is read in a logical order and interactive elements are correctly announced.
-   [ ] **Dynamic Content**: Verify dynamic updates (e.g., form submissions, loading states, modal openings) are announced or perceptible to screen reader users.

## QA Run Notes

-   Document any identified issues with screenshots, steps to reproduce, and severity.
-   Verify fixes for previously reported accessibility bugs.

*** End Patch
