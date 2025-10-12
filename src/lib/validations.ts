import { z } from 'zod';

// User Profile Validation
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  email: z.string().email('Invalid email address'),
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;

// Password Change Validation
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

// User Preferences Validation
export const userPreferencesSchema = z.object({
  currency_format: z.string().default('USD'),
  date_format: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
  language: z.string().default('en'),
  default_view: z.enum(['dashboard', 'properties', 'reports', 'settings']).default('dashboard'),
  theme_preference: z.enum(['light', 'dark', 'system']).optional(),
});

export type UserPreferencesForm = z.infer<typeof userPreferencesSchema>;

// Property Validation
export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  address: z.string().max(500, 'Address is too long').optional(),
  property_type: z
    .enum(['apartment', 'house', 'condo', 'townhouse', 'duplex', 'other'])
    .optional(),
  start_date: z.string().optional(), // ISO date string
  notes: z.string().max(2000, 'Notes are too long').optional(),
});

export type PropertyForm = z.infer<typeof propertySchema>;

// Report Filters Validation
export const reportFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  propertyId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  platform: z.string().optional(),
  category: z.string().optional(),
});

export type ReportFilters = z.infer<typeof reportFiltersSchema>;

// Report Request Validation
export const reportRequestSchema = z.object({
  reportType: z.enum(['income_summary', 'expense_breakdown', 'tax_report']),
  filters: reportFiltersSchema.optional(),
});

export type ReportRequest = z.infer<typeof reportRequestSchema>;

