/**
 * ProfileForm Component
 *
 * Form for updating user profile information (name, email).
 * Uses react-hook-form with Zod validation.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, UserProfileForm } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ProfileFormProps {
  initialData: {
    name?: string | null;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email,
    },
  });

  const onSubmit = async (data: UserProfileForm) => {
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        // Refresh the page to reflect changes
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update profile' });
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
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          aria-invalid={!!errors.name}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
