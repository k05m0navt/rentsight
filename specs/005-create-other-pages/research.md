# Technical Research: Create other pages

**Feature**: Create other pages  
**Date**: 2025-10-12  
**Related**: [plan.md](./plan.md) | [spec.md](./spec.md)

## Overview

This document captures technical research and decisions for implementing five new pages in RentSight: Settings, Properties, Help, Reports, and About. The implementation introduces a new Property entity and extends existing functionality while maintaining consistency with the current architecture.

## Key Technical Decisions

### 1. Property Entity Integration

**Decision**: Implement Property as a separate entity with optional foreign keys on RentEntry and ExpenseEntry tables.

**Rationale**:
- Maintains backward compatibility (existing entries without properties remain valid)
- Properties can have dedicated attributes (address, type, dates) not suitable for tags
- Tags remain for flexible categorization across multiple dimensions
- Allows filtering by property, tags, or both

**Alternatives Considered**:
- **Replace tags with properties**: Rejected - loses flexibility for multi-dimensional categorization (e.g., "maintenance", "utilities")
- **Properties as special tags**: Rejected - doesn't support structured property-specific fields like address
- **Required property on all entries**: Rejected - breaks backward compatibility and forces migration

**Implementation Details**:
- Add `property_id` as nullable foreign key to RentEntry and ExpenseEntry
- Create Property table with fields: id, user_id, name, address, property_type, start_date, notes
- Update forms to include optional property selector alongside tag selector
- Add property filtering to analytics and reports

---

### 2. User Preferences Storage

**Decision**: Store user preferences in a new UserPreferences table with JSON field for extensibility.

**Rationale**:
- Centralized preferences management
- JSON field allows adding new preferences without migrations
- One-to-one relationship with User table keeps data normalized
- Easy to extend with new preference types

**Alternatives Considered**:
- **Store in User table**: Rejected - clutters user table with preference columns
- **Local storage only**: Rejected - preferences don't sync across devices
- **Separate table per preference type**: Rejected - over-normalized, requires multiple queries

**Implementation Details**:
- Create UserPreferences table with user_id (FK), currency_format, date_format, default_view, theme_preference
- Add preferences field as JSON for additional settings
- Default preferences created on user registration
- API endpoint for updating preferences (PUT /api/user/preferences)

---

### 3. Password Change Mechanism

**Decision**: Use Supabase Auth API's updateUser method for password changes.

**Rationale**:
- Leverages existing Supabase authentication infrastructure
- Handles password hashing, validation, and security automatically
- Maintains consistency with current auth implementation
- Provides built-in security features (rate limiting, breach detection)

**Alternatives Considered**:
- **Custom password hashing**: Rejected - reinventing the wheel, security risk
- **Direct database update**: Rejected - bypasses Supabase security layer

**Implementation Details**:
- Use `supabase.auth.updateUser({ password: newPassword })` from server-side client
- Require current password verification before change
- Return appropriate error messages for validation failures
- Session remains valid after password change

---

### 4. Help Content Management

**Decision**: Store help content as static Markdown files in `/public/help/` directory with runtime search.

**Rationale**:
- Simple content management without database complexity
- Easy to version control help content
- Markdown provides rich formatting without complexity
- Can upgrade to CMS later if needed
- Fast initial implementation

**Alternatives Considered**:
- **Database storage**: Rejected - overkill for initial implementation, adds complexity
- **External CMS**: Rejected - adds dependency, authentication overhead
- **Hardcoded in components**: Rejected - difficult to maintain and update

**Implementation Details**:
- Help articles as `.md` files in `/public/help/articles/`
- FAQ data in `/public/help/faqs.json`
- Search endpoint reads files and performs text search
- Client-side rendering of Markdown content
- Future upgrade path to database if content grows

---

### 5. Report Generation Approach

**Decision**: Server-side report generation with streaming for large datasets.

**Rationale**:
- Handles large datasets (10,000+ entries) efficiently
- Keeps business logic on server (secure, maintainable)
- Export formats (PDF, CSV, Excel) generated server-side
- Streaming prevents timeout on large reports

**Alternatives Considered**:
- **Client-side generation**: Rejected - performance issues with large datasets, exposes logic
- **Background job queue**: Rejected - over-engineered for initial implementation
- **Pre-generated reports**: Rejected - doesn't support dynamic filtering

**Implementation Details**:
- API endpoint: POST /api/reports/generate with filters
- Server aggregates data using Prisma queries
- Returns JSON for display in UI
- Export endpoint: POST /api/reports/export with format parameter
- Use libraries: `jsPDF` (PDF), `csv-writer` (CSV), `exceljs` (Excel)
- Stream response for large datasets

**Report Types**:
1. **Income Summary**: Total income by period, platform, property, tags
2. **Expense Breakdown**: Expenses by category, property, tags with trends
3. **Tax Report**: Annual income and expenses formatted for tax preparation

---

### 6. Navigation Integration

**Decision**: Add new pages to both Sidebar (desktop/tablet) and BottomNav (mobile) components.

**Rationale**:
- Maintains consistency with existing navigation patterns
- Responsive design already established
- Minimal changes to existing components

**Implementation Details**:
- Update `src/components/Layout/Sidebar.tsx` with new nav items
- Update `src/components/Layout/BottomNav.tsx` with new nav items (limit to essential pages)
- Use appropriate icons from lucide-react
- Settings and Properties as P1 pages get prominent placement
- Help accessible from dropdown/menu
- About in footer or settings menu

**Navigation Structure**:
```
Sidebar (Desktop/Tablet):
- Dashboard
- Rent Entries
- Expense Entries
- Properties (NEW)
- Tags
- Reports (NEW)
- Settings (NEW)
- Help (NEW - icon only or in menu)

Bottom Nav (Mobile - max 5 items):
- Dashboard
- Entries (combined or dropdown)
- Properties (NEW)
- Reports (NEW)
- More (Settings, Help, About)
```

---

### 7. Form Validation Strategy

**Decision**: Use React Hook Form with Zod schema validation for all new forms.

**Rationale**:
- Type-safe validation with TypeScript
- Consistent validation between client and server
- Good DX with minimal boilerplate
- Matches modern Next.js patterns

**Alternatives Considered**:
- **Native form validation**: Rejected - less flexible, inconsistent UX
- **Custom validation**: Rejected - more code, harder to maintain
- **Yup**: Rejected - Zod has better TypeScript integration

**Implementation Details**:
- Install dependencies: `react-hook-form`, `@hookform/resolvers`, `zod`
- Define validation schemas in `src/lib/validations.ts`
- Reuse validation schemas on server-side API routes
- Display validation errors inline with form fields

---

### 8. Pagination Strategy for Properties

**Decision**: Cursor-based pagination with infinite scroll on client.

**Rationale**:
- Scales better than offset-based for large datasets
- Handles real-time updates better
- Better performance for large tables
- Provides smooth UX with infinite scroll

**Alternatives Considered**:
- **Offset-based**: Rejected - performance degrades with large offsets
- **Server-rendered pagination**: Rejected - less smooth UX
- **Load all in memory**: Rejected - doesn't scale to 1000+ properties

**Implementation Details**:
- API returns `{ items: [], nextCursor: string | null }`
- Client uses `@tanstack/react-virtual` for virtual scrolling
- Load more when user scrolls near bottom
- Default page size: 50 items
- Search/filter resets cursor

---

### 9. Accessibility Considerations

**Decision**: Maintain WCAG AA compliance for all new pages.

**Key Requirements**:
- Form labels and error messages properly associated
- Keyboard navigation fully supported
- Focus management for modals and dropdowns
- Screen reader announcements for dynamic content
- Color contrast ratios ≥ 4.5:1
- Touch targets ≥ 44x44px

**Implementation Details**:
- Use semantic HTML elements
- ARIA labels where semantic HTML insufficient
- Skip links for keyboard users
- Focus trap in modals
- Test with @axe-core/playwright
- Manual testing with screen readers

---

### 10. Performance Optimization

**Decision**: Apply performance best practices from existing implementation.

**Key Optimizations**:
- Server Components for static content (Help, About)
- Client Components only where interactivity needed
- Lazy loading for property list with virtualization
- Debounced search (300ms)
- Optimistic UI updates for form submissions
- Next.js Image component for any images
- Code splitting for large components (report visualizations)

**Monitoring**:
- Settings page load: ≤ 1s
- Property list initial load: ≤ 2s
- Help search results: ≤ 1s
- Report generation: ≤ 5s (10k entries)
- All animations: 60fps

---

## Technology Stack Summary

### New Dependencies Required

**Production**:
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration with React Hook Form
- `jspdf` - PDF generation for reports
- `csv-writer` - CSV export
- `exceljs` - Excel export
- `react-markdown` (optional) - Markdown rendering for help content

**Development**:
- None (use existing Playwright and testing tools)

### Existing Dependencies Used

- Next.js 15.5.4 (App Router, Server Components, API Routes)
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4
- shadcn/ui 3.4.0
- Prisma 6.17.0
- @supabase/ssr 0.7.0
- @tanstack/react-virtual 3.13.12
- lucide-react (icons)
- Playwright 1.56.0 (testing)

---

## Database Migration Strategy

### Migration: Add Property Entity

**Changes**:
1. Create Property table
2. Add property_id foreign key to RentEntry (nullable)
3. Add property_id foreign key to ExpenseEntry (nullable)
4. Create UserPreferences table

**Migration Script**:
```prisma
// Property model
model Property {
  id            String   @id @default(uuid())
  user_id       String
  name          String
  address       String?
  property_type String?  // apartment, house, condo, etc.
  start_date    DateTime? @db.Date
  notes         String?
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  user          User     @relation(fields: [user_id], references: [id])
  rentEntries   RentEntry[]
  expenseEntries ExpenseEntry[]
  
  @@index([user_id])
}

// Update existing models
model RentEntry {
  // ... existing fields
  property_id   String?
  property      Property? @relation(fields: [property_id], references: [id])
}

model ExpenseEntry {
  // ... existing fields
  property_id   String?
  property      Property? @relation(fields: [property_id], references: [id])
}

// New UserPreferences model
model UserPreferences {
  id              String   @id @default(uuid())
  user_id         String   @unique
  currency_format String   @default("USD")
  date_format     String   @default("MM/DD/YYYY")
  language        String   @default("en")
  default_view    String   @default("dashboard")
  preferences     Json?    // Additional preferences as JSON
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  user            User     @relation(fields: [user_id], references: [id])
}
```

**Rollback Plan**:
- Migration is additive (no data loss)
- property_id fields are nullable (backward compatible)
- Can safely roll back by removing new tables and columns

---

## API Design Patterns

### RESTful Conventions

All new API endpoints follow REST patterns:

- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT** - Update resources (full update)
- **PATCH** - Update resources (partial update)
- **DELETE** - Remove resources

### Error Handling

Standard error responses:
```typescript
{
  error: string,      // User-friendly message
  code: string,       // Error code for client handling
  details?: object    // Additional error details
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Authentication

All API routes require authentication:
- Use `createClient()` from `@/lib/supabase/server`
- Check `user` from `supabase.auth.getUser()`
- Return 401 if not authenticated
- Filter queries by `user.id` to ensure data isolation

---

## Testing Strategy

### Unit Tests
- Form validation schemas
- Utility functions (formatters, calculators)
- Report generation logic

### Integration Tests
- API endpoints (property CRUD, preferences, reports)
- Database operations
- Property-entry associations

### E2E Tests (Playwright)
- Settings page: profile update, password change, preferences
- Properties page: create, edit, delete, pagination
- Help page: search, FAQ interaction
- Reports page: generate, filter, export
- About page: display content, links
- Navigation: new pages accessible from sidebar/bottom nav

### Accessibility Tests
- All new pages tested with @axe-core/playwright
- Keyboard navigation verified
- Screen reader compatibility checked

### Performance Tests
- Property list with 1000+ items
- Report generation with 10,000+ entries
- Help search responsiveness
- Page load times

---

## Security Considerations

### Authentication & Authorization
- All API routes require authentication
- User can only access their own data
- Password changes require current password verification
- Rate limiting on password change endpoint

### Input Validation
- All form inputs validated with Zod schemas
- Server-side validation on all API endpoints
- SQL injection prevented by Prisma (parameterized queries)
- XSS prevented by React's automatic escaping

### Data Privacy
- User preferences stored securely in database
- Property data isolated per user
- No sensitive data in URLs or logs
- Help content is public (no user data)

---

## Deployment Considerations

### Database Migration
- Run `npx prisma migrate dev` for development
- Run `npx prisma migrate deploy` for production
- Backup database before production migration
- Test migration on staging environment first

### Environment Variables
- Use existing Supabase credentials
- No new environment variables required

### Rollout Strategy
- Deploy in phases: Settings → Properties → Help → Reports → About
- Enable feature flags if needed for gradual rollout
- Monitor error rates and performance metrics
- Rollback plan: revert migration and deployment

---

## Future Enhancements

### Phase 2 Considerations (Out of Scope)
- Property images/photos
- Property financials (purchase price, mortgage, ROI)
- Advanced reporting with charts
- Help content CMS
- Multi-language support
- Export report scheduling
- Property templates
- Bulk import/export for properties

### Scalability
- Current design scales to 1000+ properties per user
- Report generation scales to 10,000+ entries
- If needed, can add caching layer for reports
- If needed, can move to background jobs for large exports

---

## Conclusion

All technical decisions are documented and aligned with project requirements. The implementation uses existing patterns and technologies, ensuring consistency and maintainability. No blocking technical issues identified. Ready to proceed to Phase 1 (data model and contracts).

