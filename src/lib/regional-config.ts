/**
 * Regional Configuration
 *
 * Currencies, platforms, and formatting rules for different regions
 */

import type { Currency, Platform, DateFormatConfig, RegionalConfig } from '@/types/regional';

/**
 * Supported Currencies
 */
export const currencies: Record<string, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    format: (amount: number) =>
      `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    format: (amount: number) =>
      `${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`,
  },
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    format: (amount: number) => {
      // Russian format uses space as thousands separator
      const formatted = amount.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${formatted} ₽`;
    },
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    format: (amount: number) =>
      `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
};

/**
 * Booking Platforms by Region
 */
export const platforms: Record<string, Platform[]> = {
  russian: [
    {
      id: 'avito',
      name: 'Avito',
      url: 'https://www.avito.ru',
      region: 'ru',
    },
    {
      id: 'cian',
      name: 'CIAN',
      url: 'https://www.cian.ru',
      region: 'ru',
    },
    {
      id: 'domclick',
      name: 'Domclick',
      url: 'https://domclick.ru',
      region: 'ru',
    },
    {
      id: 'yandex-realty',
      name: 'Yandex.Realty',
      url: 'https://realty.yandex.ru',
      region: 'ru',
    },
  ],
  us: [
    {
      id: 'zillow',
      name: 'Zillow',
      url: 'https://www.zillow.com',
      region: 'us',
    },
    {
      id: 'trulia',
      name: 'Trulia',
      url: 'https://www.trulia.com',
      region: 'us',
    },
    {
      id: 'realtor',
      name: 'Realtor.com',
      url: 'https://www.realtor.com',
      region: 'us',
    },
  ],
  eu: [
    {
      id: 'immobilienscout24',
      name: 'ImmobilienScout24',
      url: 'https://www.immobilienscout24.de',
      region: 'eu',
    },
    {
      id: 'rightmove',
      name: 'Rightmove',
      url: 'https://www.rightmove.co.uk',
      region: 'eu',
    },
  ],
};

/**
 * Date Format Configurations
 */
export const dateFormats: Record<string, DateFormatConfig> = {
  'en-US': {
    locale: 'en-US',
    format: 'MM/DD/YYYY',
    parse: (dateStr: string) => {
      const [month, day, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    },
  },
  'ru-RU': {
    locale: 'ru-RU',
    format: 'DD.MM.YYYY',
    parse: (dateStr: string) => {
      const [day, month, year] = dateStr.split('.').map(Number);
      return new Date(year, month - 1, day);
    },
  },
  'en-GB': {
    locale: 'en-GB',
    format: 'DD/MM/YYYY',
    parse: (dateStr: string) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    },
  },
};

/**
 * Complete Regional Configuration
 */
export const regionalConfig: RegionalConfig = {
  currencies,
  platforms,
  dateFormats,
};

/**
 * Get all platforms as a flat list
 */
export function getAllPlatforms(): Platform[] {
  return Object.values(platforms).flat();
}

/**
 * Get platforms for a specific region
 */
export function getPlatformsByRegion(region: string): Platform[] {
  return platforms[region] || [];
}

/**
 * Get currency by code
 */
export function getCurrency(code: string): Currency | undefined {
  return currencies[code];
}

/**
 * Format amount with currency
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode];
  if (!currency) {
    return `${amount} ${currencyCode}`;
  }
  return currency.format(amount);
}

/**
 * Format date based on locale
 */
export function formatDate(date: Date, locale: string): string {
  const config = dateFormats[locale] || dateFormats['en-US'];

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return config.format.replace('DD', day).replace('MM', month).replace('YYYY', String(year));
}
