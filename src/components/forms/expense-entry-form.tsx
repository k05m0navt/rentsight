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

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TagManager } from '@/components/ui/tag-manager';
import { PropertySelector } from '@/components/properties/PropertySelector';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';

interface ExpenseEntryFormProps {
  userId: string;
}

const categoryOptions = [
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
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Amount" required>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </FormField>

            <FormField label="Category" required>
              <FormSelect
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
                placeholder="Select category"
                required
              />
            </FormField>
          </div>

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
