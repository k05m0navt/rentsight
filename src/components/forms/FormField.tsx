/**
 * FormField Component
 *
 * Wrapper component for form fields with consistent label, input, and error styling.
 * Provides improved visual hierarchy and accessibility.
 *
 * Features:
 * - Consistent label positioning and spacing
 * - Error message display with icon
 * - Helper text support
 * - Dark theme support
 *
 * Per FR-004: Redesigned form inputs with new design patterns
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  helperText,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium text-text dark:text-text-dark">
        {label}
        {required && (
          <span className="text-error ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-xs text-muted dark:text-muted-dark">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
