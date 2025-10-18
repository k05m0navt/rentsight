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
import { Select } from '@/components/ui/select';
import { useState } from 'react';

interface PreferencesFormProps {
  initialData: {
    currency_format: string;
    language: string;
    default_view: string;
    theme_preference?: string | null;
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
      language: initialData.language,
      default_view: initialData.default_view as 'dashboard' | 'properties' | 'reports' | 'settings',
      theme_preference:
        (initialData.theme_preference as 'light' | 'dark' | 'system' | undefined) || undefined,
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
        <Select
          id="currency_format"
          {...register('currency_format')}
          aria-invalid={!!errors.currency_format}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="CAD">CAD (C$)</option>
          <option value="AUD">AUD (A$)</option>
          <option value="RUB">RUB (₽)</option>
        </Select>
        {errors.currency_format && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.currency_format.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-2">
          Language
        </label>
        <Select id="language" {...register('language')} aria-invalid={!!errors.language}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
          <option value="ru">Русский</option>
        </Select>
        {errors.language && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.language.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="default_view" className="block text-sm font-medium mb-2">
          Default View
        </label>
        <Select
          id="default_view"
          {...register('default_view')}
          aria-invalid={!!errors.default_view}
        >
          <option value="dashboard">Dashboard</option>
          <option value="properties">Properties</option>
          <option value="reports">Reports</option>
          <option value="settings">Settings</option>
        </Select>
        {errors.default_view && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.default_view.message}
          </p>
        )}
        <p className="text-sm text-muted mt-1">Page to show when you log in</p>
      </div>

      <div>
        <label htmlFor="theme_preference" className="block text-sm font-medium mb-2">
          Theme Preference
        </label>
        <Select
          id="theme_preference"
          {...register('theme_preference')}
          aria-invalid={!!errors.theme_preference}
        >
          <option value="">System Default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">Follow System</option>
        </Select>
        {errors.theme_preference && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.theme_preference.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  );
}
