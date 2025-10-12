/**
 * ErrorMessage Component
 *
 * Displays error messages with icon and consistent styling.
 * Used for form validation feedback and general error states.
 *
 * Features:
 * - Error color (#DC2626) with background tint
 * - Warning icon for visual indication
 * - Border for emphasis
 * - Dark theme support
 *
 * Per FR-004: Clear visual indicators for validation errors
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 p-3 rounded-md',
        'bg-error/10 border border-error/20 text-error',
        'text-sm',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
