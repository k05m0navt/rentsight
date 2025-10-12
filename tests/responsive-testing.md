# Responsive Testing Guide

**Project**: RentSight Complete Application Redesign  
**Date**: 2025-10-11  
**Target Range**: 320px - 2560px

## Overview

This guide provides comprehensive instructions for testing the application's responsive behavior across all viewport sizes to ensure proper layout adaptation and usability.

---

## Key Breakpoints

### Tailwind CSS Breakpoints

```javascript
{
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets (CRITICAL: sidebar ↔ bottom nav transition)
  lg: '1024px',  // Desktops
  xl: '1280px',  // Large desktops
  '2xl': '1536px' // Extra large desktops
}
```

### Critical Breakpoint: 768px

**Above 768px (md)**: Sidebar navigation visible  
**Below 768px**: Bottom navigation bar visible

This is the **most important** breakpoint to test thoroughly.

---

## Test Viewport Sizes

### Mobile Devices

#### iPhone SE (Small Mobile)
- **Size**: 375x667
- **Orientation**: Portrait
- **Key Tests**:
  - [ ] Bottom nav visible and functional
  - [ ] No horizontal scrolling
  - [ ] Touch targets ≥ 44x44px
  - [ ] Text readable without zooming
  - [ ] Forms fit viewport width
  - [ ] Cards stack vertically

#### iPhone 12/13/14 (Standard Mobile)
- **Size**: 390x844
- **Orientation**: Portrait
- **Key Tests**:
  - [ ] Same as iPhone SE
  - [ ] Optimal spacing utilization
  - [ ] No excessive whitespace

#### iPhone 12/13/14 (Landscape)
- **Size**: 844x390
- **Orientation**: Landscape
- **Key Tests**:
  - [ ] Bottom nav still visible
  - [ ] Content adapts to wider viewport
  - [ ] No content hidden by bottom nav

#### Small Mobile (Minimum)
- **Size**: 320x568
- **Orientation**: Portrait
- **Notes**: Smallest supported mobile size
- **Key Tests**:
  - [ ] All content accessible
  - [ ] No broken layouts
  - [ ] Text doesn't overflow
  - [ ] Buttons are tappable

---

### Tablet Devices

#### iPad Mini (Small Tablet)
- **Size**: 744x1133
- **Orientation**: Portrait
- **Expected**: Bottom nav (below 768px)
- **Key Tests**:
  - [ ] Bottom nav visible
  - [ ] Content uses available width
  - [ ] Touch targets appropriate

#### iPad (Tablet - Critical Transition)
- **Size**: 768x1024
- **Orientation**: Portrait
- **Expected**: Sidebar appears (at 768px)
- **Key Tests**:
  - [ ] Sidebar visible at exactly 768px
  - [ ] Sidebar properly positioned
  - [ ] Content margin accounts for sidebar
  - [ ] Navigation items all visible
  - [ ] Smooth transition

#### iPad (Tablet Landscape)
- **Size**: 1024x768
- **Orientation**: Landscape
- **Expected**: Sidebar visible
- **Key Tests**:
  - [ ] Sidebar displays fully
  - [ ] Content area sufficient
  - [ ] Dashboard charts render well
  - [ ] Tables have adequate space

#### iPad Pro 11"
- **Size**: 834x1194
- **Orientation**: Portrait/Landscape
- **Expected**: Sidebar visible
- **Key Tests**:
  - [ ] Optimal sidebar sizing
  - [ ] Content scales appropriately

---

### Desktop Sizes

#### Standard Desktop
- **Size**: 1920x1080
- **Expected**: Full sidebar, optimal layout
- **Key Tests**:
  - [ ] Sidebar fixed at 256px
  - [ ] Content area well-utilized
  - [ ] Charts display optimally
  - [ ] No excessive whitespace
  - [ ] Grid layouts use multiple columns

#### Large Desktop
- **Size**: 2560x1440
- **Expected**: Same layout, increased content area
- **Key Tests**:
  - [ ] Content centered or well-distributed
  - [ ] Max-width constraints work
  - [ ] No stretched elements
  - [ ] Readable line lengths

#### Laptop (Common)
- **Size**: 1366x768
- **Expected**: Sidebar visible, compact layout
- **Key Tests**:
  - [ ] All UI elements visible
  - [ ] No content cut off
  - [ ] Sidebar doesn't dominate

---

## Component-Specific Testing

### Navigation (Sidebar ↔ Bottom Nav Transition)

**Test at these exact widths**:
- 767px: Bottom nav should be visible
- 768px: Sidebar should be visible
- 769px: Sidebar should be visible

**Verification Steps**:
1. Open browser DevTools
2. Set responsive mode
3. Set width to 1024px
4. Slowly decrease width
5. Watch for transition at 768px
6. Verify smooth switch between navigation types

**Expected Behavior**:
```css
/* Above 768px */
.sidebar { display: block; }
.bottom-nav { display: none; }
main { margin-left: 256px; }

/* Below 768px */
.sidebar { display: none; }
.bottom-nav { display: block; }
main { margin-left: 0; padding-bottom: 64px; }
```

**Test Checklist**:
- [ ] Sidebar completely hidden on mobile
- [ ] Bottom nav completely hidden on desktop
- [ ] Active navigation item highlighted in both modes
- [ ] All navigation links accessible in both modes
- [ ] Logo/branding visible in both modes
- [ ] Theme toggle accessible in both modes

---

### Dashboard

**Mobile (< 768px)**:
- [ ] Metrics cards stack vertically
- [ ] Charts fill available width
- [ ] Touch-friendly controls
- [ ] Scrolling smooth
- [ ] No horizontal scroll

**Tablet (768px - 1024px)**:
- [ ] Metrics cards in 2-column grid
- [ ] Charts side-by-side where appropriate
- [ ] Adequate spacing
- [ ] Readable labels

**Desktop (> 1024px)**:
- [ ] Metrics cards in 3-4 column grid
- [ ] Charts use full available width
- [ ] Optimal data visualization
- [ ] Multi-column layouts

---

### Forms (Rent Entry, Expense Entry)

**Mobile**:
- [ ] Form fields full width
- [ ] Labels above inputs
- [ ] Adequate input height (44px+)
- [ ] Buttons full width
- [ ] Comfortable field spacing
- [ ] Keyboard doesn't obscure fields

**Tablet**:
- [ ] Form max-width applied
- [ ] Centered or left-aligned
- [ ] Two-column layout for related fields
- [ ] Comfortable button sizing

**Desktop**:
- [ ] Form max-width (600-800px)
- [ ] Multi-column layout for short fields
- [ ] Buttons right-aligned or grouped
- [ ] Optimal label/input spacing

---

### Cards

**Mobile**:
- [ ] Cards full width (minus padding)
- [ ] Stack vertically
- [ ] Padding: 16px (space-3)
- [ ] Readable content

**Tablet/Desktop**:
- [ ] Cards in grid layout
- [ ] Columns: 2-3-4 based on viewport
- [ ] Equal height in rows
- [ ] Padding: 24px (space-4)

---

### Data Tables

**Mobile**:
- [ ] Horizontal scroll enabled
- [ ] Sticky first column (optional)
- [ ] Minimum column widths maintained
- [ ] Scroll indicators visible
- [ ] Alternative: Card view for small screens

**Tablet/Desktop**:
- [ ] Table fits viewport width
- [ ] Columns proportionally sized
- [ ] Pagination visible
- [ ] Sorting controls accessible

---

## Testing Procedures

### Manual Testing Steps

1. **Open Browser DevTools**
   - Chrome: F12 or Cmd+Option+I
   - Firefox: F12 or Cmd+Option+I
   - Safari: Cmd+Option+I (after enabling Developer menu)

2. **Enable Responsive Design Mode**
   - Chrome: Cmd+Shift+M
   - Firefox: Cmd+Shift+M
   - Safari: Enter Responsive Design Mode

3. **Test Each Breakpoint**
   - Set exact width
   - Check layout
   - Test interactions
   - Take screenshots if issues found

4. **Test Transitions**
   - Slowly resize between breakpoints
   - Watch for layout shifts
   - Verify smooth transitions
   - Check for flickering or jumps

5. **Test Orientation Changes**
   - Portrait → Landscape
   - Landscape → Portrait
   - Verify layout adapts

---

### Automated Testing

**Run responsive tests**:
```bash
# Visual regression at key viewports
npx playwright test tests/visual/ --grep responsive

# Specific viewport test
npx playwright test --grep "375px"
```

---

## Common Responsive Issues and Fixes

### Issue: Horizontal scrolling on mobile

**Causes**:
- Fixed widths exceeding viewport
- Images without max-width
- Tables without overflow scroll
- Negative margins

**Fixes**:
```css
/* Ensure max-width */
img {
  max-width: 100%;
  height: auto;
}

/* Contain wide content */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Prevent viewport overflow */
body {
  overflow-x: hidden;
}
```

---

### Issue: Bottom nav overlaps content

**Cause**: Missing bottom padding on main content

**Fix**:
```css
main {
  padding-bottom: 64px; /* Height of bottom nav */
}

@media (min-width: 768px) {
  main {
    padding-bottom: 0; /* No bottom nav on desktop */
  }
}
```

---

### Issue: Sidebar doesn't hide on mobile

**Cause**: Missing responsive display classes

**Fix**:
```tsx
<aside className="hidden md:block">
  {/* Sidebar content */}
</aside>
```

---

### Issue: Text too small on mobile

**Cause**: Fixed font sizes below 14px

**Fix**:
```css
/* Minimum 14px on mobile */
body {
  font-size: 14px;
}

@media (min-width: 768px) {
  body {
    font-size: 16px;
  }
}
```

---

### Issue: Touch targets too small

**Minimum size**: 44x44px (iOS) or 48x48px (Android)

**Fix**:
```css
button,
a {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

---

## Testing Checklist by Page

### Homepage (/)

**Mobile**:
- [ ] Bottom nav visible
- [ ] Hero section readable
- [ ] CTAs are tappable
- [ ] Images scale properly

**Tablet**:
- [ ] Sidebar appears at 768px
- [ ] Content well-spaced

**Desktop**:
- [ ] Optimal hero layout
- [ ] Content centered or well-distributed

---

### Login/Signup Pages

**Mobile**:
- [ ] Form full width
- [ ] Inputs easy to tap
- [ ] Submit button prominent

**Tablet/Desktop**:
- [ ] Form centered
- [ ] Max-width applied
- [ ] Adequate whitespace

---

### Dashboard

**Mobile**:
- [ ] Bottom nav visible
- [ ] Metrics cards stack
- [ ] Charts scrollable
- [ ] Touch controls work

**Tablet**:
- [ ] Sidebar visible at 768px
- [ ] 2-column card layout
- [ ] Charts side-by-side

**Desktop**:
- [ ] Full sidebar
- [ ] 3-4 column layout
- [ ] Optimal chart sizes

---

### Forms (Rent/Expense Entry)

**Mobile**:
- [ ] Fields stack vertically
- [ ] Full width inputs
- [ ] Bottom nav accessible

**Tablet/Desktop**:
- [ ] Sidebar visible
- [ ] Form max-width
- [ ] Multi-column for short fields

---

### Tag Manager

**Mobile**:
- [ ] Tags wrap properly
- [ ] Create button accessible
- [ ] Modal/form full screen

**Tablet/Desktop**:
- [ ] Grid layout for tags
- [ ] Modal centered
- [ ] Color picker accessible

---

## Responsive Testing Report Template

```markdown
# Responsive Testing Report - [Date]

**Tester**: [Name]  
**Browser**: [Chrome/Firefox/Safari]  
**OS**: [macOS/Windows/Linux]

## Viewport Testing Results

| Viewport Size | Layout | Navigation | Content | Issues |
|---------------|--------|------------|---------|--------|
| 320x568 | ✅/❌ | ✅/❌ | ✅/❌ | |
| 375x667 | ✅/❌ | ✅/❌ | ✅/❌ | |
| 768x1024 | ✅/❌ | ✅/❌ | ✅/❌ | |
| 1920x1080 | ✅/❌ | ✅/❌ | ✅/❌ | |

## Breakpoint Transitions

| Transition | Status | Notes |
|------------|--------|-------|
| 767px → 768px (Critical) | ✅/❌ | |
| Mobile → Tablet | ✅/❌ | |
| Tablet → Desktop | ✅/❌ | |

## Issues Found

### Critical Issues
1. [Description]

### Minor Issues
1. [Description]

## Screenshots
[Attach screenshots of issues]

## Overall Assessment
✅ **PASS** - Responsive behavior acceptable across all viewports  
❌ **FAIL** - Critical responsive issues found

## Recommendations
[Recommendations]
```

---

## Success Criteria

**Application is considered responsive if**:
- ✅ No horizontal scrolling at any viewport
- ✅ Sidebar/bottom nav transition works at 768px
- ✅ All content accessible at all sizes
- ✅ Touch targets meet minimum size requirements
- ✅ Text readable without zooming
- ✅ Forms usable on mobile devices
- ✅ Navigation always accessible
- ✅ No overlapping content

---

## Next Steps

1. Run automated responsive tests
2. Manually test critical breakpoints
3. Test on real devices if possible
4. Document all issues
5. Create fix tasks
6. Re-test after fixes
7. Sign off on responsive behavior

**Reference Documents**:
- `/specs/003-as-a-developer/research.md` - Mobile navigation strategy
- `/specs/003-as-a-developer/contracts/design-system.md` - Responsive breakpoints

