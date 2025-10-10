import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagManager } from '@/components/ui/tag-manager';

interface RentEntryFormProps {
  userId: string;
}

export function RentEntryForm({ userId }: RentEntryFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [bookedDays, setBookedDays] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setDateError('End date cannot be before start date');
    } else {
      setDateError(null);
    }
  }, [startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) {
      alert(dateError);
      return;
    }
    // Handle form submission, including selectedTagIds
    console.log({
      amount,
      bookedDays,
      platform,
      startDate,
      endDate,
      selectedTagIds,
    });
    // Reset form or show success message
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <Input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="bookedDays" className="block text-sm font-medium text-gray-700">
          Booked Days
        </label>
        <Input
          type="number"
          id="bookedDays"
          value={bookedDays}
          onChange={(e) => setBookedDays(e.target.value)}
          required
          min="1"
        />
      </div>
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
          Platform
        </label>
        <Input
          type="text"
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
          minLength={1}
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <Input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <Input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
      <div>
        <h3 className="text-lg font-medium mb-2">Manage Tags</h3>
        <TagManager
          userId={userId}
          onTagsChange={(tags) => setSelectedTagIds(tags.map(tag => tag.id))}
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">Add Rent Entry</Button>
    </form>
  );
}
