# Responsive Testing Checklist: Modern Responsive Design

**Feature**: Modern responsive design and dark mode
**Date**: 2025-10-09
**Reference**: `specs/002-i-need-that/spec.md` (User Story 1)

## Purpose

To ensure the application's UI is responsive and usable across various device sizes, with a focus on core pages and interactions.

## Test Environment

-   Browser Developer Tools (Responsive Design Mode)
-   Target Viewport Widths:
    -   Mobile Small: 360px
    -   Mobile Large: 414px
    -   Tablet: 768px
    -   Desktop Small: 1024px
    -   Desktop Large: 1440px (or native resolution)

## Core Scenarios & Pages to Test

### 1. Global Layout & Navigation (Primary pages: Dashboard, Rent Entry, Expense Entry, Tag Manager)

-   [ ] **Viewport: Mobile Small (360px)**
    -   [ ] No horizontal scrollbars are present on any primary page.
    -   [ ] Main navigation collapses into a mobile-friendly menu/drawer.
    -   [ ] All primary navigation links are accessible and clickable within the mobile menu.
    -   [ ] The ThemeToggle is visible and functional within the navigation.
    -   [ ] Primary call-to-action buttons/elements are visible and have sufficient tap targets (>= 44px).
-   [ ] **Viewport: Tablet (768px)**
    -   [ ] No horizontal scrollbars are present on any primary page.
    -   [ ] Navigation adapts appropriately (e.g., still mobile menu or tablet-optimized navigation).
    -   [ ] Content layout is well-spaced and readable.
-   [ ] **Viewport: Desktop Small (1024px) / Desktop Large (1440px)**
    -   [ ] Main navigation is fully expanded and functional.
    -   [ ] Content scales appropriately without excessive empty space or crowding.

### 2. Dashboard Page (`/dashboard`)

-   [ ] **Viewport: Mobile Small (360px)**
    -   [ ] Summary cards (Total Rent Income, Booked Days, etc.) stack vertically and are readable.
    -   [ ] Analytics charts (if present) are readable and interactable; no overflow.
    -   [ ] Export button is visible and usable.
-   [ ] **Viewport: Tablet (768px)**
    -   [ ] Summary cards arrange into 2 columns (or optimized for tablet width).
    -   [ ] Charts are well-sized and legible.

### 3. Forms (Rent Entry: `/rent_entries/new`, Expense Entry: `/expense_entries/new`)

-   [ ] **Viewport: Mobile Small (360px)**
    -   [ ] Input fields and labels stack vertically and are clearly associated.
    -   [ ] Input fields are sufficiently large for touch interaction.
    -   [ ] Date pickers (if custom) are mobile-friendly.
    -   [ ] Submit button is full-width and easily tappable.
    -   [ ] TagManager component is usable and doesn't overflow.
-   [ ] **Viewport: Tablet (768px)**
    -   [ ] Form layout is efficient, possibly with 2-column layout for some fields, or still stacked but wider.

### 4. Tag Manager Page (`/tags`)

-   [ ] **Viewport: Mobile Small (360px)**
    -   [ ] Tag list displays clearly; long tag names wrap or truncate gracefully.
    -   [ ] Add Tag input and button are usable.
    -   [ ] Edit/Delete actions for tags are accessible.

## Accessibility Check (Manual - Perceptual)

-   [ ] **All Viewports (Light and Dark Mode)**
    -   [ ] Text and interactive elements meet WCAG AA contrast (4.5:1 minimum).
    -   [ ] Visible focus indicators are present when tabbing through interactive elements.
    -   [ ] Logical tab order is maintained on primary pages.
    -   [ ] Images and icons have appropriate dark mode treatments/alternatives where necessary.

## Performance Check (Perceptual)

-   [ ] **Mobile (simulated Slow 3G / Fast 3G)**
    -   [ ] Primary content on Dashboard is perceived to load within 0.5 seconds (SC-005).
    -   [ ] Subsequent navigations feel fluid (not blocking).
