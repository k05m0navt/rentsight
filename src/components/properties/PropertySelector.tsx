/**
 * PropertySelector Component
 *
 * Dropdown for selecting a property in forms (rent entry, expense entry).
 * Loads properties from API and allows optional selection.
 */

'use client';

import { FormSelect } from '@/components/forms/FormSelect';
import { useEffect, useState } from 'react';
import { Property } from '@/types/property';

interface PropertySelectorProps {
  value?: string;
  onChange: (propertyId: string | undefined) => void;
  error?: string;
  required?: boolean;
}

export function PropertySelector({
  value,
  onChange,
  error,
  required = false,
}: PropertySelectorProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties?limit=100');
        if (response.ok) {
          const data = await response.json();
          setProperties(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue === '' ? undefined : newValue);
  };

  // Convert properties to FormSelect options format
  const propertyOptions = [
    {
      value: '',
      label: loading ? 'Loading properties...' : 'No property (use tags for categorization)',
    },
    ...properties.map((property) => ({
      value: property.id,
      label: `${property.name}${property.address ? ` - ${property.address}` : ''}`,
    })),
  ];

  return (
    <div>
      <label htmlFor="property" className="block text-sm font-medium mb-2">
        Property {!required && <span className="text-muted">(Optional)</span>}
      </label>
      <FormSelect
        id="property"
        value={value || ''}
        onChange={handleChange}
        options={propertyOptions}
        disabled={loading}
        aria-invalid={!!error}
        required={required}
        className="w-full"
      />
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
      {!required && properties.length === 0 && !loading && (
        <p className="text-sm text-muted mt-1">
          No properties yet. Create one in the Properties page.
        </p>
      )}
    </div>
  );
}
