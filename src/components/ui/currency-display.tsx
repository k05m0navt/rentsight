/**
 * Currency Display Component
 *
 * Displays formatted currency values based on user preferences.
 * Features:
 * - Automatic currency formatting
 * - Support for multiple currencies including RUB
 * - Consistent styling across the app
 */

import { formatAmount } from '@/lib/format-utils';

interface CurrencyDisplayProps {
  value: number;
  currency?: string;
  className?: string;
  showSymbol?: boolean;
}

export function CurrencyDisplay({ value, currency = 'USD', className = '' }: CurrencyDisplayProps) {
  const formattedValue = formatAmount(value, currency);

  return <span className={className}>{formattedValue}</span>;
}
