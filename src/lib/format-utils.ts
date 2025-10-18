/**
 * Format utility functions for currency, dates, and numbers
 * Handles regional formatting based on user preferences
 */

import { formatCurrency, formatDate } from './regional-config';
import type { Currency } from '@/types/regional';

/**
 * Format amount with currency based on user preference
 */
export function formatAmount(amount: number, currencyCode: string = 'USD'): string {
  return formatCurrency(amount, currencyCode);
}

/**
 * Format date in DD.MM.YYYY format
 */
export function formatUserDate(date: Date): string {
  // Format as DD.MM.YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Format number based on locale
 */
export function formatNumber(number: number, locale: string = 'en-US'): string {
  return number.toLocaleString(locale);
}

/**
 * Parse date string in DD.MM.YYYY format
 */
export function parseUserDate(dateStr: string): Date {
  // Parse DD.MM.YYYY format
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format currency for display with proper spacing and symbols
 */
export function formatCurrencyDisplay(amount: number, currency: Currency): string {
  return currency.format(amount);
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(currencyStr: string, currency: Currency): number {
  // Remove currency symbol and spaces
  let cleaned = currencyStr.replace(currency.symbol, '').trim();

  // Handle different thousands separators
  if (currency.code === 'RUB') {
    // Russian format uses space as separator
    cleaned = cleaned.replace(/\s/g, '');
  } else {
    // US/EU format uses comma as separator
    cleaned = cleaned.replace(/,/g, '');
  }

  // Parse as float
  return parseFloat(cleaned) || 0;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format duration (e.g., "3 days", "2 weeks")
 */
export function formatDuration(days: number): string {
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 14) return '1 week';
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days < 60) return '1 month';
  return `${Math.round(days / 30)} months`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date, locale: string = 'en-US'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString(locale);
}

/**
 * Validate currency amount input
 */
export function validateCurrencyInput(input: string, currency: Currency): boolean {
  // Remove currency symbol and spaces
  let cleaned = input.replace(currency.symbol, '').trim();

  // Handle different thousands separators
  if (currency.code === 'RUB') {
    cleaned = cleaned.replace(/\s/g, '');
  } else {
    cleaned = cleaned.replace(/,/g, '');
  }

  // Check if it's a valid number
  const num = parseFloat(cleaned);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate date input in DD.MM.YYYY format
 */
export function validateDateInput(dateStr: string): boolean {
  try {
    const date = parseUserDate(dateStr);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
