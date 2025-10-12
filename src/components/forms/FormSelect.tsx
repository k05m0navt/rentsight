/**
 * FormSelect Component
 *
 * Redesigned select dropdown with consistent styling.
 * Features chevron icon and improved visual states.
 *
 * Per FR-004: Redesigned form inputs following new design patterns
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ options, placeholder, className, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'h-10 w-full rounded-md border border-border dark:border-border-dark',
            'bg-background dark:bg-background-dark',
            'px-3 py-3 pr-10 text-base appearance-none',
            'text-text dark:text-text-dark',
            'transition-[border-color,box-shadow] duration-200',
            'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'aria-invalid:border-error aria-invalid:focus-visible:ring-error/20',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-muted-dark pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
