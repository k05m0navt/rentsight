/**
 * Rent Entry Form - Redesigned
 *
 * Updated with new form components and improved visual hierarchy.
 * Features:
 * - FormField wrapper for consistent labeling and error display
 * - Improved field grouping with cards
 * - Better validation feedback
 * - Enhanced spacing using 8-point scale
 *
 * Per FR-004: Redesigned form inputs following new design patterns
 */

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TagManager } from '@/components/ui/tag-manager';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { ErrorMessage } from '@/components/ui/error-message';

interface RentEntryFormProps {
  userId: string;
}

const platformOptions = [
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking', label: 'Booking.com' },
  { value: 'vrbo', label: 'VRBO' },
  { value: 'other', label: 'Other' },
];

export function RentEntryForm({ userId }: RentEntryFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [bookedDays, setBookedDays] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setDateError('End date cannot be before start date');
    } else {
      setDateError(null);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) {
      return;
    }

    setSubmitting(true);
    try {
      // Handle form submission, including selectedTagIds
      console.log({
        amount,
        bookedDays,
        platform,
        startDate,
        endDate,
        selectedTagIds,
      });
      // Reset form on success
      setAmount('');
      setBookedDays('');
      setPlatform('');
      setStartDate('');
      setEndDate('');
      setSelectedTagIds([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rental Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Details</CardTitle>
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

            <FormField label="Booked Days" required>
              <Input
                type="number"
                id="bookedDays"
                value={bookedDays}
                onChange={(e) => setBookedDays(e.target.value)}
                placeholder="Number of days"
                min="1"
                required
              />
            </FormField>
          </div>

          <FormField label="Platform" required>
            <FormSelect
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              options={platformOptions}
              placeholder="Select platform"
              required
            />
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Start Date" required error={dateError || undefined}>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                aria-invalid={!!dateError}
              />
            </FormField>

            <FormField label="End Date" required error={dateError || undefined}>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                aria-invalid={!!dateError}
              />
            </FormField>
          </div>

          {dateError && <ErrorMessage message={dateError} />}
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
        <Button type="submit" disabled={submitting || !!dateError}>
          {submitting ? 'Adding...' : 'Add Rent Entry'}
        </Button>
      </div>
    </form>
  );
}
