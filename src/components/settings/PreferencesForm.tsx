/**
 * PreferencesForm Component
 *
 * Form for updating user application preferences.
 * Includes currency format, date format, language, default view, and theme.
 * Uses react-hook-form with Zod validation.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userPreferencesSchema, UserPreferencesForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { FormSelect } from '@/components/forms/FormSelect';
import { useState } from 'react';

interface PreferencesFormProps {
  initialData: {
    currency_format: string;
    default_view: string;
  };
}

export function PreferencesForm({ initialData }: PreferencesFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserPreferencesForm>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      currency_format: initialData.currency_format,
      default_view: initialData.default_view as 'dashboard' | 'properties' | 'reports' | 'settings',
    },
  });

  const onSubmit = async (data: UserPreferencesForm) => {
    setMessage(null);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preferences updated successfully' });
        // Refresh to apply new preferences
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update preferences' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.type === 'success' ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-600'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="currency_format" className="block text-sm font-medium mb-2">
          Currency Format
        </label>
        <FormSelect
          id="currency_format"
          {...register('currency_format')}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'JPY', label: 'JPY (¥)' },
            { value: 'CAD', label: 'CAD (C$)' },
            { value: 'AUD', label: 'AUD (A$)' },
            { value: 'RUB', label: 'RUB (₽)' },
          ]}
          className="w-full"
          aria-invalid={!!errors.currency_format}
        />
        {errors.currency_format && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.currency_format.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="default_view" className="block text-sm font-medium mb-2">
          Default View
        </label>
        <FormSelect
          id="default_view"
          {...register('default_view')}
          options={[
            { value: 'dashboard', label: 'Dashboard' },
            { value: 'properties', label: 'Properties' },
            { value: 'reports', label: 'Reports' },
            { value: 'settings', label: 'Settings' },
          ]}
          className="w-full"
          aria-invalid={!!errors.default_view}
        />
        {errors.default_view && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.default_view.message}
          </p>
        )}
        <p className="text-sm text-muted mt-1">Page to show when you log in</p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  );
}
