/**
 * Expense Entry Form - Redesigned
 *
 * Updated with new form components and consistent patterns.
 * Features:
 * - FormField wrapper for labeling and errors
 * - FormSelect for category dropdown
 * - Card-based section grouping
 * - Loading states and improved validation
 *
 * Per FR-004: Redesigned form inputs with consistent patterns
 */
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TagManager } from '@/components/ui/tag-manager';
import { PropertySelector } from '@/components/properties/PropertySelector';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useUserCurrency } from '@/hooks/useUserCurrency';
import { CategoryManagementModal } from '@/components/category/CategoryManagementModal';

interface ExpenseEntryFormProps {
  userId: string;
}

const predefinedCategories = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'repairs', label: 'Repairs' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'taxes', label: 'Taxes' },
  { value: 'other', label: 'Other' },
];

export function ExpenseEntryForm({ userId }: ExpenseEntryFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  const [customCategoryError, setCustomCategoryError] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(predefinedCategories);
  // Get user's currency preference
  const { currency, loading: currencyLoading } = useUserCurrency(userId);

  // Fetch custom categories and update options
  const fetchCustomCategories = async () => {
    try {
      const response = await fetch('/api/categories/custom');
      if (response.ok) {
        const customCategories = await response.json();
        const customOptions = customCategories.map((cat: { name: string }) => ({
          value: cat.name,
          label: cat.name,
        }));
        setCategoryOptions([...predefinedCategories, ...customOptions]);
      }
    } catch (error) {
      console.error('Error fetching custom categories:', error);
    }
  };

  // Load custom categories on component mount
  React.useEffect(() => {
    fetchCustomCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const response = await fetch('/api/expense_entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(amount),
          category,
          custom_category_name: category === 'other' ? customCategoryName : null,
          description,
          date,
          property_id: propertyId || null,
          tag_ids: selectedTagIds,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add expense entry');
      }

      // Reset form on success
      setAmount('');
      setCategory('');
      setCustomCategoryName('');
      setCustomCategoryError('');
      setDescription('');
      setDate('');
      setPropertyId(undefined);
      setSelectedTagIds([]);

      // Trigger a page reload to refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error adding expense entry:', error);
      alert(error instanceof Error ? error.message : 'Failed to add expense entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Expense Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Amount" required>
            <CurrencyInput
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              currency={currency}
              loading={currencyLoading}
            />
          </FormField>

          <FormField label="Category" required>
            <div className="space-y-3">
              <FormSelect
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
                placeholder="Select category"
                required
                className="w-full"
              />
              <div className="flex justify-end">
                <CategoryManagementModal
                  onCategoryChange={() => {
                    // Refresh custom categories when they change
                    fetchCustomCategories();
                  }}
                />
              </div>
            </div>
          </FormField>

          {category === 'other' && (
            <FormField
              label="Custom Category Name"
              required
              error={customCategoryError || undefined}
            >
              <Input
                type="text"
                id="customCategoryName"
                value={customCategoryName}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomCategoryName(value);

                  // Client-side validation
                  if (value.length > 0 && value.length < 2) {
                    setCustomCategoryError('Category name must be at least 2 characters');
                  } else if (value.length > 100) {
                    setCustomCategoryError('Category name must be less than 100 characters');
                  } else if (value.length > 0 && !/^[a-zA-Zа-яА-Я0-9\s\-_.,()]+$/.test(value)) {
                    setCustomCategoryError('Category name contains invalid characters');
                  } else {
                    setCustomCategoryError('');
                  }
                }}
                placeholder="Enter custom category name"
                maxLength={100}
                required
              />
            </FormField>
          )}

          <FormField label="Date" required>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Description" helperText="Optional - add any additional details">
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Plumbing repair in unit 2B"
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Property Card */}
      <Card>
        <CardHeader>
          <CardTitle>Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertySelector value={propertyId} onChange={setPropertyId} />
        </CardContent>
      </Card>

      {/* Tags Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <TagManager
            userId={userId}
            selectedTagIds={selectedTagIds}
            onSelectedTagIdsChange={setSelectedTagIds}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            /* Handle cancel */
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Expense Entry'}
        </Button>
      </div>
    </form>
  );
}
