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
  currency_format: z.string(),
  language: z.string(),
  default_view: z.enum(['dashboard', 'properties', 'reports', 'settings']),
  theme_preference: z.enum(['light', 'dark', 'system']).optional(),
});

export type UserPreferencesForm = z.infer<typeof userPreferencesSchema>;

// Property Validation
export const propertySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  address: z.string().max(500, 'Address is too long').optional(),
  property_type: z.enum(['apartment', 'house', 'condo', 'townhouse', 'duplex', 'other']).optional(),
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

// Custom Platform Validation
export const customPlatformSchema = z.object({
  name: z
    .string()
    .min(2, 'Platform name must be at least 2 characters')
    .max(100, 'Platform name must be less than 100 characters')
    .regex(/^[a-zA-Zа-яА-Я0-9\s\-_.,()]+$/, 'Platform name contains invalid characters'),
});

export type CustomPlatformForm = z.infer<typeof customPlatformSchema>;

// Platform Selection Validation
export const platformSelectionSchema = z
  .object({
    platform: z.string().min(1, 'Platform is required'),
    custom_platform_name: z
      .string()
      .min(2, 'Custom platform name must be at least 2 characters')
      .max(100, 'Custom platform name must be less than 100 characters')
      .optional(),
  })
  .refine(
    (data) => {
      // If platform is "other", custom_platform_name is required
      if (data.platform === 'other') {
        return data.custom_platform_name && data.custom_platform_name.length >= 2;
      }
      return true;
    },
    {
      message: 'Custom platform name is required when selecting "Other"',
      path: ['custom_platform_name'],
    },
  );

export type PlatformSelectionForm = z.infer<typeof platformSelectionSchema>;

// Rent Entry with Platform Validation
export const rentEntryWithPlatformSchema = z
  .object({
    amount: z.number().positive('Amount must be positive'),
    booked_days: z.number().int().positive('Booked days must be a positive integer'),
    platform: z.string().min(1, 'Platform is required'),
    custom_platform_name: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    property_id: z.string().optional(),
  })
  .refine(
    (data) => {
      // If platform is "other", custom_platform_name is required
      if (data.platform === 'other') {
        return data.custom_platform_name && data.custom_platform_name.length >= 2;
      }
      return true;
    },
    {
      message: 'Custom platform name is required when selecting "Other"',
      path: ['custom_platform_name'],
    },
  );

export type RentEntryWithPlatformForm = z.infer<typeof rentEntryWithPlatformSchema>;

// Custom Category Validation
export const customCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters')
    .regex(/^[a-zA-Zа-яА-Я0-9\s\-_.,()]+$/, 'Category name contains invalid characters'),
});

export type CustomCategoryForm = z.infer<typeof customCategorySchema>;
