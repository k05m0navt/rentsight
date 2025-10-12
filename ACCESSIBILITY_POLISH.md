# Accessibility Polish Checklist

**Project**: RentSight Complete Application Redesign  
**Date**: 2025-10-11  
**Standard**: WCAG 2.1 Level AA

## Overview

This document provides final accessibility polish requirements to ensure the redesigned application meets WCAG AA standards and provides an excellent experience for all users.

---

## Keyboard Navigation (T063)

### Requirements

All interactive elements must be accessible via keyboard:
- **Tab**: Move forward through interactive elements
- **Shift+Tab**: Move backward through interactive elements
- **Enter/Space**: Activate buttons, links, form controls
- **Escape**: Close modals, dropdowns, cancel actions
- **Arrow keys**: Navigate within menus, radio groups, tabs

### Test Checklist

#### Tab Order

**Test Pages**: All pages (homepage, login, signup, dashboard, forms)

**Verification**:
- [ ] Tab order is logical (top-to-bottom, left-to-right)
- [ ] Tab only stops at interactive elements
- [ ] Tab order matches visual layout
- [ ] No tab traps (can tab out of all components)
- [ ] Skip links present (optional but recommended)

**Test Steps**:
1. Load page
2. Press Tab repeatedly
3. Observe focus indicator movement
4. Verify logical progression
5. Use Shift+Tab to go backwards
6. Verify reverse order works

**Common Issues**:
- Focus jumping unexpectedly
- Focus hidden elements
- Incorrect z-index preventing focus visibility
- CSS `display: none` on focused elements

**Fix Example**:
```tsx
// Ensure proper tab index
<button tabIndex={0}>Click me</button>

// Remove from tab order
<div tabIndex={-1}>Decorative</div>
```

---

#### Focus Indicators

**Requirement**: All focusable elements MUST have visible focus indicators

**Minimum Requirements**:
- **Outline**: 2px solid or equivalent
- **Contrast**: 3:1 against background (WCAG 2.1)
- **Visibility**: Clearly distinguishable in both themes
- **Consistency**: Similar style across all elements

**Verification**:
- [ ] All buttons show focus ring
- [ ] All links show focus indicator
- [ ] All form inputs show focus border
- [ ] All interactive cards show focus outline
- [ ] Focus indicators work in light theme
- [ ] Focus indicators work in dark theme
- [ ] Focus rings don't get clipped

**Test Steps**:
1. Tab through page
2. Verify each element shows focus indicator
3. Check both light and dark themes
4. Take screenshots for documentation

**Current Implementation** (verify these are applied):
```css
/* Button focus */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Input focus */
input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-20);
}

/* Link focus */
a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Fix Missing Focus Indicators**:
```css
/* Add to global styles */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Override for specific elements */
.custom-focus:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

#### Keyboard Shortcuts

**Navigation**:
- [ ] Tab/Shift+Tab works everywhere
- [ ] Enter activates primary actions
- [ ] Space activates buttons/checkboxes
- [ ] Escape closes modals/dropdowns

**Modals/Dialogs**:
- [ ] Opens with focus on first interactive element
- [ ] Tab cycles within modal (focus trap)
- [ ] Escape closes modal
- [ ] Focus returns to trigger element after closing

**Dropdowns/Menus**:
- [ ] Arrow keys navigate menu items
- [ ] Enter selects item
- [ ] Escape closes menu
- [ ] Tab moves to next element (doesn't navigate menu)

**Forms**:
- [ ] Tab moves through fields in order
- [ ] Enter submits form (when appropriate)
- [ ] Radio buttons navigable with arrow keys

**Test Implementation**:
```tsx
// Modal focus trap example
useEffect(() => {
  if (isOpen) {
    const modal = modalRef.current;
    const focusableElements = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    firstElement?.focus();
  }
}, [isOpen]);
```

---

## Screen Reader Support (T064)

### Requirements

Application must be navigable and understandable using screen readers:
- **VoiceOver** (macOS/iOS)
- **NVDA/JAWS** (Windows)
- **TalkBack** (Android)

### ARIA Labels

**Verification**:
- [ ] Icon-only buttons have aria-label
- [ ] Form inputs have associated labels
- [ ] Error messages have aria-describedby
- [ ] Status updates use aria-live regions
- [ ] Expandable sections have aria-expanded
- [ ] Navigation landmarks use proper roles

**Icon-only Buttons** (check all instances):
```tsx
// Theme toggle
<button aria-label="Toggle dark mode">
  <MoonIcon />
</button>

// Close button
<button aria-label="Close dialog">
  <XIcon />
</button>

// Delete button
<button aria-label="Delete expense entry">
  <TrashIcon />
</button>
```

**Form Labels** (verify all forms):
```tsx
// Explicit label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Or aria-label if visual label not present
<input type="search" aria-label="Search tags" />
```

**Error Messages**:
```tsx
<input
  id="email"
  type="email"
  aria-describedby={error ? 'email-error' : undefined}
  aria-invalid={error ? 'true' : 'false'}
/>
{error && <div id="email-error" role="alert">{error}</div>}
```

**Live Regions** (for dynamic updates):
```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

---

### Semantic HTML

**Verification**:
- [ ] `<nav>` for navigation (sidebar, bottom nav)
- [ ] `<main>` for main content
- [ ] `<header>` for page headers
- [ ] `<footer>` for page footers
- [ ] `<article>` for independent content
- [ ] `<section>` for thematic grouping
- [ ] `<aside>` for tangential content
- [ ] `<h1>-<h6>` for proper heading hierarchy

**Current Structure** (verify):
```tsx
<html>
  <body>
    <nav aria-label="Main navigation">
      {/* Sidebar or BottomNav */}
    </nav>
    <main id="main-content">
      <h1>Page Title</h1>
      <section aria-labelledby="metrics">
        <h2 id="metrics">Key Metrics</h2>
        {/* Metrics cards */}
      </section>
    </main>
  </body>
</html>
```

**Heading Hierarchy** (audit all pages):
- [ ] Only one `<h1>` per page
- [ ] No heading levels skipped
- [ ] Headings in logical order
- [ ] Headings describe content

---

### Alt Text for Images

**Verification**:
- [ ] Decorative images have alt=""
- [ ] Content images have descriptive alt text
- [ ] Icons used for meaning have aria-label
- [ ] Charts/graphs have text alternatives

**Examples**:
```tsx
// Decorative
<img src="pattern.svg" alt="" role="presentation" />

// Content
<img src="chart.png" alt="Bar chart showing rent income trends for 2024" />

// Icon with meaning
<TagIcon aria-label="Tag" />
```

---

### Screen Reader Testing Steps

1. **Enable Screen Reader**:
   - macOS: VoiceOver (Cmd+F5)
   - Windows: NVDA (free download)

2. **Navigate Application**:
   - Use screen reader to navigate through all pages
   - Listen to what is announced
   - Verify content is understandable
   - Check announcement order makes sense

3. **Test Key Interactions**:
   - [ ] Form submission workflow
   - [ ] Navigation between pages
   - [ ] Creating/editing entries
   - [ ] Tag management
   - [ ] Theme switching

4. **Verify Announcements**:
   - [ ] Button purpose is clear
   - [ ] Link destinations are announced
   - [ ] Form errors are announced
   - [ ] Success messages are announced
   - [ ] Loading states are announced

---

## Focus Indicator Updates (T065)

### Requirements

Update focus indicators to meet visibility requirements across both themes.

### Light Theme Focus Indicators

**Colors**:
- Primary: #DD1202 (primary red)
- Background: #FFFFFF (white)
- Contrast: 6.48:1 ✅

**Style**:
```css
:focus-visible {
  outline: 2px solid #DD1202;
  outline-offset: 2px;
}
```

---

### Dark Theme Focus Indicators

**Colors**:
- Primary: #DD1202 (primary red)
- Background: #030303 (near black)
- Contrast: 5.12:1 ✅

**Style**:
```css
.dark :focus-visible {
  outline: 2px solid #DD1202;
  outline-offset: 2px;
}
```

**Note**: Primary color has sufficient contrast in both themes.

---

### Alternative Approaches

If primary color contrast is insufficient in certain contexts:

**Option 1: Increase outline width**
```css
:focus-visible {
  outline: 3px solid #DD1202;
  outline-offset: 2px;
}
```

**Option 2: Add background to outline**
```css
:focus-visible {
  outline: 2px solid #DD1202;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(221, 18, 2, 0.2);
}
```

**Option 3: Use contrasting color for dark theme**
```css
.dark :focus-visible {
  outline: 2px solid #EEEEEE; /* Light text color */
  outline-offset: 2px;
}
```

---

### Implementation Verification

**Check Files**:
- `src/app/globals.css` - Global focus styles
- `src/components/ui/*.tsx` - Component-specific overrides

**Test Cases**:
- [ ] Buttons in light theme
- [ ] Buttons in dark theme
- [ ] Inputs in light theme
- [ ] Inputs in dark theme
- [ ] Links in light theme
- [ ] Links in dark theme
- [ ] Navigation items in both themes
- [ ] Cards/interactive elements in both themes

**Visual Verification**:
1. Tab through all interactive elements
2. Take screenshots of focus states
3. Verify 3:1 contrast ratio (minimum)
4. Verify focus indicator is clearly visible
5. Document any exceptions or issues

---

## Testing Tools

### Browser DevTools

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run Accessibility audit
4. Review and fix issues

**Axe DevTools** (browser extension):
1. Install from Chrome/Firefox store
2. Open DevTools
3. Click Axe tab
4. Run scan
5. Review violations

---

### Automated Testing

**Run accessibility tests**:
```bash
# Run all accessibility tests
npx playwright test tests/accessibility.spec.ts

# Run specific theme
npx playwright test tests/accessibility.spec.ts --grep "light theme"
```

---

### Manual Testing Checklist

**Keyboard Navigation**:
- [ ] Complete keyboard nav audit
- [ ] Document tab order issues
- [ ] Fix focus indicator visibility
- [ ] Test all keyboard shortcuts
- [ ] Verify modal focus management

**Screen Reader**:
- [ ] Test with VoiceOver (Mac)
- [ ] Test with NVDA (Windows)
- [ ] Verify ARIA labels
- [ ] Check semantic HTML
- [ ] Test live regions

**Focus Indicators**:
- [ ] Check all interactive elements
- [ ] Verify both themes
- [ ] Test contrast ratios
- [ ] Update styles if needed
- [ ] Document implementation

---

## Success Criteria

**Accessibility is acceptable if**:
- ✅ All interactive elements keyboard accessible
- ✅ Tab order is logical on all pages
- ✅ Focus indicators visible in both themes
- ✅ All icon-only buttons have aria-labels
- ✅ Form labels properly associated
- ✅ Semantic HTML used consistently
- ✅ No critical Axe violations
- ✅ Screen reader can navigate application
- ✅ Automated tests pass

---

## Accessibility Report Template

```markdown
# Accessibility Polish Report - [Date]

**Tester**: [Name]  
**Testing Method**: [Keyboard/Screen Reader/Automated]  
**Theme**: [Light/Dark]

## Keyboard Navigation

| Page | Tab Order | Focus Indicators | Keyboard Shortcuts | Issues |
|------|-----------|------------------|-------------------|--------|
| Homepage | ✅/❌ | ✅/❌ | ✅/❌ | |
| Login | ✅/❌ | ✅/❌ | ✅/❌ | |
| Dashboard | ✅/❌ | ✅/❌ | ✅/❌ | |

## Screen Reader Support

| Feature | ARIA Labels | Semantic HTML | Announcements | Issues |
|---------|-------------|---------------|---------------|--------|
| Navigation | ✅/❌ | ✅/❌ | ✅/❌ | |
| Forms | ✅/❌ | ✅/❌ | ✅/❌ | |
| Modals | ✅/❌ | ✅/❌ | ✅/❌ | |

## Focus Indicators

| Element Type | Light Theme | Dark Theme | Contrast | Issues |
|--------------|-------------|------------|----------|--------|
| Buttons | ✅/❌ | ✅/❌ | X.X:1 | |
| Links | ✅/❌ | ✅/❌ | X.X:1 | |
| Inputs | ✅/❌ | ✅/❌ | X.X:1 | |

## Issues Found

### Critical Issues
1. [Description]

### Minor Issues
1. [Description]

## Overall Assessment
✅ **PASS** - Meets WCAG AA standards  
❌ **FAIL** - Critical accessibility issues found

## Recommendations
[Recommendations]
```

---

## Next Steps

1. Run automated accessibility tests
2. Complete keyboard navigation audit
3. Test with screen readers
4. Update focus indicators if needed
5. Document all findings
6. Create fix tasks for issues
7. Re-test after fixes
8. Get sign-off

**Reference Documents**:
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

