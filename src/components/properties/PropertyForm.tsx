/**
 * PropertyForm Component
 *
 * Form for creating or editing a property.
 * Uses react-hook-form with Zod validation.
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, PropertyForm as PropertyFormType } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useState } from 'react';

interface PropertyFormProps {
  initialData?: {
    id?: string;
    name: string;
    address?: string | null;
    property_type?: string | null;
    start_date?: Date | null;
    notes?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropertyForm({ initialData, onSuccess, onCancel }: PropertyFormProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormType>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          address: initialData.address || '',
          property_type: initialData.property_type || undefined,
          start_date: initialData.start_date
            ? new Date(initialData.start_date).toISOString().split('T')[0]
            : '',
          notes: initialData.notes || '',
        }
      : {},
  });

  const onSubmit = async (data: PropertyFormType) => {
    setMessage(null);

    try {
      const url = isEditing ? `/api/properties/${initialData.id}` : '/api/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: isEditing ? 'Property updated successfully' : 'Property created successfully',
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save property' });
      }
    } catch (error) {
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
          Property Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          aria-invalid={!!errors.name}
          placeholder="e.g., Beach House, Downtown Apt 201"
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-2">
          Address
        </label>
        <Input
          id="address"
          type="text"
          {...register('address')}
          aria-invalid={!!errors.address}
          placeholder="Full address"
        />
        {errors.address && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.address.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="property_type" className="block text-sm font-medium mb-2">
          Property Type
        </label>
        <Select id="property_type" {...register('property_type')} aria-invalid={!!errors.property_type}>
          <option value="">Select type...</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
          <option value="duplex">Duplex</option>
          <option value="other">Other</option>
        </Select>
        {errors.property_type && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.property_type.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="start_date" className="block text-sm font-medium mb-2">
          Purchase/Start Date
        </label>
        <Input
          id="start_date"
          type="date"
          {...register('start_date')}
          aria-invalid={!!errors.start_date}
        />
        {errors.start_date && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.start_date.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Notes
        </label>
        <Textarea
          id="notes"
          {...register('notes')}
          aria-invalid={!!errors.notes}
          placeholder="Additional notes about this property"
          rows={4}
        />
        {errors.notes && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

