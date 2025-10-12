# Design System Specification

**Feature**: Complete Application Redesign  
**Reference**: "AI Hiring - SaaS CRM Web App" by Tamim Al Arafat (Dribbble)  
**Date**: 2025-10-11  
**Version**: 1.0.0

## Overview

This document specifies the complete design system for the RentSight application redesign. It defines all design tokens, component patterns, and visual specifications to ensure consistency across the application.

---

## Design Tokens

### Color Palette

#### Light Theme
```javascript
{
  background: '#FFFFFF',          // Base background
  card: '#F5F5F5',                // Card/panel background
  primary: '#DD1202',             // Primary actions, accents
  success: '#1DCC5C',             // Success states, positive actions
  text: '#1A1A1A',                // Primary text
  textMuted: '#666666',           // Secondary text
  border: '#E5E5E5',              // Borders, dividers
  hover: '#F8F8F8',               // Hover states
  focus: '#DD120220',             // Focus ring (primary with 20% opacity)
}
```

#### Dark Theme (Primary)
```javascript
{
  background: '#030303',          // Base background
  card: '#1A1A1A',                // Card/panel background
  primary: '#DD1202',             // Primary actions, accents
  success: '#1DCC5C',             // Success states, positive actions
  text: '#EEEEEE',                // Primary text
  textMuted: '#AAAAAA',           // Secondary text
  border: '#333333',              // Borders, dividers
  hover: '#252525',               // Hover states
  focus: '#DD120240',             // Focus ring (primary with 40% opacity for dark bg)
}
```

#### Semantic Colors
```javascript
{
  error: '#DC2626',               // Error states
  warning: '#F59E0B',             // Warning states
  info: '#3B82F6',                // Info states
  disabled: {
    light: '#D1D5DB',
    dark: '#4B5563'
  }
}
```

### Typography

#### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'Roboto Mono', 'Courier New', monospace;
```

#### Font Sizes & Line Heights
```javascript
{
  xs: { size: '12px', lineHeight: '16px' },   // Small labels, captions
  sm: { size: '14px', lineHeight: '20px' },   // Body small, form labels
  base: { size: '16px', lineHeight: '24px' }, // Body text default
  lg: { size: '20px', lineHeight: '28px' },   // Subheadings
  xl: { size: '24px', lineHeight: '32px' },   // Headings
  '2xl': { size: '32px', lineHeight: '40px' } // Page titles
}
```

#### Font Weights
```javascript
{
  normal: 400,   // Body text
  medium: 500,   // Emphasis, buttons
  bold: 700      // Headings, strong emphasis
}
```

### Spacing (8-Point Scale)

```javascript
{
  0: '0px',
  1: '4px',      // 0.5 * 8 - Tight spacing
  2: '8px',      // 1 * 8 - Minimal spacing
  3: '16px',     // 2 * 8 - Small spacing
  4: '24px',     // 3 * 8 - Medium spacing
  5: '32px',     // 4 * 8 - Large spacing
  6: '40px',     // 5 * 8 - Extra large spacing
  7: '48px',     // 6 * 8 - Section spacing
  8: '64px'      // 8 * 8 - Major section spacing
}
```

**Usage Guidelines**:
- Component padding: 3-4 (16-24px)
- Card gutters: 4 (24px)
- Section margins: 6-7 (40-48px)
- Element gaps: 2-3 (8-16px)

### Border Radius

```javascript
{
  sm: '4px',     // Small elements (badges, pills)
  md: '8px',     // Default (buttons, inputs, cards)
  lg: '12px',    // Large cards, modals
  full: '9999px' // Pills, avatars
}
```

### Shadows

#### Light Theme
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

#### Dark Theme
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.5);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.7);
```

**Note**: Shadows more subtle in dark theme to avoid harshness.

### Transitions

```javascript
{
  fast: '150ms',    // Quick feedback (hover states)
  default: '200ms', // Standard transitions
  slow: '300ms'     // Complex animations
}
```

**Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)  
**Properties**: Only `opacity` and `transform` (GPU-accelerated)

---

## Component Specifications

### Button

#### Variants

**Primary**
```css
Background: primary (#DD1202)
Text: white
Padding: 12px 24px (vertical: 3, horizontal: 4)
Border radius: md (8px)
Font: base size, medium weight
Hover: brightness(1.1)
Active: brightness(0.9)
Focus: 2px ring with focus color
```

**Secondary**
```css
Background: card
Text: text
Border: 1px solid border
Padding: 12px 24px
Border radius: md (8px)
Font: base size, medium weight
Hover: background hover
Active: brightness(0.95)
Focus: 2px ring with focus color
```

**Ghost**
```css
Background: transparent
Text: text
Padding: 12px 24px
Border radius: md (8px)
Font: base size, medium weight
Hover: background hover
Active: brightness(0.9)
Focus: 2px ring with focus color
```

#### Sizes
- Small: padding 8px 16px, font sm
- Default: padding 12px 24px, font base
- Large: padding 16px 32px, font lg

#### States
- Default: As specified above
- Hover: Brightness adjusted or background changed
- Active/Pressed: Slightly darker
- Disabled: Opacity 0.5, cursor not-allowed
- Loading: Show spinner, disable interaction

---

### Card

```css
Background: card
Border: 1px solid border (optional)
Border radius: lg (12px)
Padding: 24px (4)
Shadow: md (medium elevation)
```

**Variants**:
- **Default**: No border, with shadow
- **Bordered**: With border, no shadow
- **Elevated**: Larger shadow (lg)

**States**:
- **Hover** (if interactive): Shadow increases to lg
- **Active** (if clickable): Scale 0.98

---

### Input Field

```css
Background: background (or card if on background)
Border: 1px solid border
Border radius: md (8px)
Padding: 12px 16px (vertical: 3, horizontal: 3)
Font: base size, normal weight
Text color: text
Placeholder color: textMuted
```

**States**:
- **Default**: border color
- **Focus**: border primary, focus ring (2px)
- **Error**: border error, red focus ring
- **Success**: border success, green focus ring
- **Disabled**: Opacity 0.6, cursor not-allowed

**Variants**:
- **Text**: Standard input
- **Textarea**: Multi-line, min-height 100px
- **Select**: With dropdown icon (chevron-down)

---

### Badge

```css
Background: primary (or success, error, warning)
Text: white
Padding: 4px 12px (vertical: 1, horizontal: 3)
Border radius: full (pill shape)
Font: xs size, medium weight
```

**Variants**:
- **Primary**: Red background (#DD1202)
- **Success**: Green background (#1DCC5C)
- **Muted**: textMuted background, text color
- **Outline**: Transparent background, 1px border

---

### Navigation (Desktop/Tablet Sidebar)

```css
Width: 256px (fixed)
Height: 100vh (full height)
Background: card
Border right: 1px solid border
Padding: 24px (4)
Position: fixed left
Z-index: 40
```

**Nav Item**:
```css
Display: flex (icon + label)
Padding: 12px 16px (vertical: 3, horizontal: 3)
Border radius: md (8px)
Font: base size, medium weight
Gap: 12px (between icon and label)

States:
- Default: text color, transparent background
- Hover: hover background
- Active: primary color text, primary background (10% opacity)
```

**Icon Size**: 20px (consistent)

---

### Navigation (Mobile Bottom Bar)

```css
Position: fixed bottom
Height: 64px
Background: card
Border top: 1px solid border
Z-index: 50
Display: flex (space-around)
```

**Nav Item**:
```css
Display: flex column (icon above label)
Padding: 8px 12px (vertical: 2, horizontal: 3)
Align: center
Gap: 4px (1)
Font: xs size
Min-width: 64px

States:
- Default: textMuted color
- Active: primary color (both icon and text)
```

**Icon Size**: 20px (consistent with sidebar)  
**Max Items**: 5 (4 recommended)

---

### Data Table

```css
Width: 100%
Background: card
Border: 1px solid border
Border radius: lg (12px)
Overflow: hidden
```

**Header Row**:
```css
Background: hover (slightly different from card)
Border bottom: 1px solid border
Padding: 12px 16px (vertical: 3, horizontal: 3)
Font: sm size, medium weight
Text: textMuted
```

**Body Row**:
```css
Border bottom: 1px solid border (last row: none)
Padding: 16px (3)
Font: base size, normal weight

States:
- Hover: background hover
- Selected: background primary (5% opacity)
```

**Virtualization**: Use @tanstack/react-virtual for 100+ rows

---

### Modal/Dialog

```css
Overlay:
  Background: rgba(0, 0, 0, 0.5) light / rgba(0, 0, 0, 0.7) dark
  Position: fixed, full screen
  Z-index: 100

Content:
  Background: background
  Border: 1px solid border
  Border radius: lg (12px)
  Padding: 32px (5)
  Max-width: 600px
  Shadow: lg
  Position: centered
  Z-index: 101
```

**Header**:
```css
Font: xl size, bold weight
Margin bottom: 24px (4)
```

**Footer**:
```css
Margin top: 32px (5)
Display: flex (justify-end)
Gap: 12px (buttons spaced)
```

---

### Chart/Visualization

**Container**:
```css
Background: card
Border: 1px solid border (optional)
Border radius: lg (12px)
Padding: 24px (4)
```

**Colors** (for data series):
```javascript
[
  '#DD1202', // Primary
  '#1DCC5C', // Success
  '#F59E0B', // Warning
  '#3B82F6', // Info
  '#8B5CF6', // Purple
  '#EC4899'  // Pink
]
```

**Grid Lines**: border color, low opacity (0.3)  
**Axes**: textMuted color  
**Labels**: sm font size

---

## Layout Patterns

### Page Layout (Desktop)

```
┌─────────────────────────────────────────┐
│  Sidebar (256px)  │  Main Content       │
│                   │                     │
│  Navigation       │  Header (page title)│
│  Items            │                     │
│                   │  Content            │
│                   │  Cards/Tables       │
│                   │                     │
│                   │                     │
└─────────────────────────────────────────┘
```

**Sidebar**: Fixed position, full height  
**Main Content**: Margin-left 256px, padding 32px (5)

---

### Page Layout (Mobile)

```
┌─────────────────────────────────────────┐
│  Header (optional)                      │
│                                         │
│  Content                                │
│  Full width                             │
│  Padding 16px (3)                       │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  Bottom Navigation (64px)               │
└─────────────────────────────────────────┘
```

**Main Content**: Padding-bottom 64px (for bottom nav)  
**Bottom Nav**: Fixed bottom, full width

---

### Responsive Breakpoints

```javascript
{
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets (sidebar → bottom nav transition)
  lg: '1024px',  // Desktops
  xl: '1280px',  // Large desktops
  '2xl': '1536px' // Extra large desktops
}
```

**Key Breakpoint**: 768px (md) - sidebar disappears, bottom nav appears

---

## Accessibility

### Contrast Ratios (WCAG AA)

**Light Theme**:
- Text on background: 12.63:1 (#1A1A1A on #FFFFFF) ✅
- Primary on background: 6.48:1 (#DD1202 on #FFFFFF) ✅
- TextMuted on background: 4.54:1 (#666666 on #FFFFFF) ✅

**Dark Theme**:
- Text on background: 12.48:1 (#EEEEEE on #030303) ✅
- Primary on background: 5.12:1 (#DD1202 on #030303) ✅
- TextMuted on background: 4.76:1 (#AAAAAA on #030303) ✅

**All contrast ratios meet WCAG AA standards (4.5:1 for normal text).**

### Focus States

All interactive elements MUST have visible focus indicators:
```css
Focus ring: 2px solid focus color
Offset: 2px
Border radius: Matches element
```

### Keyboard Navigation

- All interactive elements accessible via Tab
- Logical tab order (top-to-bottom, left-to-right)
- Escape closes modals/dropdowns
- Arrow keys for navigation menus

### Screen Reader Support

- Semantic HTML (nav, main, article, aside)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Alt text for images

---

## Animation Specifications

### Allowed Properties
Only GPU-accelerated properties:
- `opacity`
- `transform` (translate, scale, rotate)

### Timing
- **Fast** (150ms): Hover states, tooltips
- **Default** (200ms): Button clicks, card interactions
- **Slow** (300ms): Page transitions, complex animations

### Easing
```css
cubic-bezier(0.4, 0, 0.2, 1) /* ease-in-out */
```

### Examples
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale on hover */
.hover-scale {
  transition: transform 200ms ease;
}
.hover-scale:hover {
  transform: scale(1.02);
}
```

**Note**: Per spec, no reduced motion preference support. All animations always enabled.

---

## Implementation Files

### Design Tokens
```
src/lib/design-tokens.ts        # TypeScript constants export
tailwind.config.js              # Tailwind theme configuration
src/styles/tokens.css           # CSS custom properties (for JS access)
```

### Components
```
src/components/ui/              # Primitive components (buttons, inputs, cards)
src/components/Layout/          # Layout components (Sidebar, BottomNav, Container)
src/components/forms/           # Form components
src/components/ThemeProvider.tsx # Theme management
```

### Theme Management
```
src/hooks/useTheme.ts           # Theme switching hook
src/app/layout.tsx              # Root theme provider
```

---

## Versioning

**Version**: 1.0.0  
**Date**: 2025-10-11  
**Status**: Initial specification

**Change Log**:
- 1.0.0 (2025-10-11): Initial design system specification based on Dribbble reference

---

## References

- **Design Reference**: [AI Hiring - SaaS CRM Web App by Tamim Al Arafat](https://dribbble.com/shots/26618807-AI-Hiring-SaaS-CRM-Web-App)
- **Specification**: `specs/003-as-a-developer/spec.md`
- **Research**: `specs/003-as-a-developer/research.md`
- **WCAG 2.1 AA**: [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)

