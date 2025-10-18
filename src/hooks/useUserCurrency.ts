/**
 * Custom hook for fetching user currency preferences
 * Used in forms to display currency indicators
 */

import { useState, useEffect } from 'react';

interface UserCurrencyReturn {
  currency: string;
  loading: boolean;
  error: string | null;
}

export function useUserCurrency(userId: string): UserCurrencyReturn {
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/user/preferences');
        if (!response.ok) {
          throw new Error('Failed to fetch user preferences');
        }

        const data = await response.json();
        setCurrency(data.currency_format || 'USD');
      } catch (err) {
        console.error('Error fetching user currency:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch currency');
        // Fallback to USD if there's an error
        setCurrency('USD');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCurrency();
    }
  }, [userId]);

  return {
    currency,
    loading,
    error,
  };
}
