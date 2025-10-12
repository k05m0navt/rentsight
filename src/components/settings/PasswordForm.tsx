/**
 * PasswordForm Component
 *
 * Form for changing user password.
 * Requires current password verification.
 * Uses react-hook-form with Zod validation.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordChangeSchema, PasswordChangeForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function PasswordForm() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeForm) => {
    setMessage(null);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully' });
        reset(); // Clear form fields
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to change password' });
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
            message.type === 'success'
              ? 'bg-success/10 text-success dark:bg-success/20'
              : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          aria-invalid={!!errors.currentPassword}
          placeholder="Enter current password"
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          aria-invalid={!!errors.newPassword}
          placeholder="Enter new password (min 8 characters)"
        />
        {errors.newPassword && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
          Confirm New Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
          placeholder="Confirm new password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Changing Password...' : 'Change Password'}
      </Button>
    </form>
  );
}
