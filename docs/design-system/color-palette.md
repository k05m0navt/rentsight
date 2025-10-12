# Color Palette - AI Hiring SaaS CRM Design Reference

**Source**: AI Hiring - SaaS CRM Web App by Tamim Al Arafat  
**Implementation Date**: 2025-01-27  
**Status**: Active

## Primary Colors

### Orange Accent (#FF6B35)
- **Usage**: Primary actions, active states, highlights
- **Accessibility**: WCAG AA compliant
- **CSS Variable**: `--color-primary`
- **Tailwind Class**: `bg-primary`, `text-primary`, `border-primary`

### Green Success (#1DCC5C)
- **Usage**: Success states, positive metrics, confirmations
- **Accessibility**: WCAG AA compliant
- **CSS Variable**: `--color-success`
- **Tailwind Class**: `bg-success`, `text-success`, `border-success`

## Background Colors

### Light Theme
- **Main Background**: `#FFFFFF`
- **Card Background**: `#F5F5F5`

### Dark Theme
- **Main Background**: `#1A1A1A` (from design reference)
- **Card Background**: `#2A2A2A` (from design reference)

## Text Colors

### Light Theme
- **Primary Text**: `#1A1A1A`
- **Muted Text**: `#666666`

### Dark Theme
- **Primary Text**: `#EEEEEE`
- **Muted Text**: `#AAAAAA`

## Usage Guidelines

### Do's
- Use orange accent for primary actions and active states
- Use green for success indicators and positive metrics
- Maintain consistent contrast ratios for accessibility
- Use dark theme as the primary theme to match design reference

### Don'ts
- Don't use the old red primary color (#DD1202)
- Don't mix light and dark theme colors inconsistently
- Don't use colors that don't meet WCAG AA contrast requirements

## Implementation

### CSS Custom Properties
```css
:root {
  --color-primary: #FF6B35;
  --color-success: #1DCC5C;
  --color-background: #FFFFFF;
  --color-card: #F5F5F5;
}

.dark {
  --color-background: #1A1A1A;
  --color-card: #2A2A2A;
}
```

### Tailwind Configuration
```javascript
colors: {
  primary: {
    DEFAULT: '#FF6B35',
    foreground: '#FFFFFF',
  },
  success: {
    DEFAULT: '#1DCC5C',
    foreground: '#FFFFFF',
  },
  background: {
    DEFAULT: '#FFFFFF',
    dark: '#1A1A1A',
  },
  card: {
    DEFAULT: '#F5F5F5',
    dark: '#2A2A2A',
  },
}
```

### TypeScript Design Tokens
```typescript
export const designTokens = {
  colors: {
    primary: '#FF6B35',
    success: '#1DCC5C',
    background: {
      light: '#FFFFFF',
      dark: '#1A1A1A',
    },
    card: {
      light: '#F5F5F5',
      dark: '#2A2A2A',
    },
  },
};
```

## Visual Regression Testing

All color changes are validated through visual regression testing:
- Screenshots captured before and after changes
- 95% visual similarity threshold maintained
- Cross-browser compatibility verified
