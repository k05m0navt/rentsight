/**
 * Regional Configuration Types
 *
 * Types for currency, platform, and date formatting configurations
 */

export interface Currency {
  /** ISO 4217 currency code */
  code: string;

  /** Display symbol (e.g., $, €, ₽) */
  symbol: string;

  /** Full currency name */
  name: string;

  /** Formatting function for amounts */
  format: (amount: number) => string;
}

export interface Platform {
  /** Unique platform identifier */
  id: string;

  /** Display name */
  name: string;

  /** Platform URL */
  url: string;

  /** Region code (ru, us, eu, etc.) */
  region: string;

  /** Optional icon path */
  icon?: string;
}

export interface CustomPlatform {
  /** Unique platform identifier (UUID) */
  id: string;

  /** User ID who created this platform */
  user_id: string;

  /** Platform name (2-100 characters) */
  name: string;

  /** Creation timestamp */
  created_at: Date;

  /** Last update timestamp */
  updated_at: Date;

  /** Number of rent entries using this platform */
  usage_count: number;
}

export interface PlatformWithCustom extends Platform {
  /** Indicates if this is a custom platform */
  isCustom?: boolean;
}

export interface DateFormatConfig {
  /** Locale code (en-US, ru-RU, etc.) */
  locale: string;

  /** Display format pattern (MM/DD/YYYY, DD.MM.YYYY, etc.) */
  format: string;

  /** Parsing function */
  parse: (date: string) => Date;
}

export interface RegionalConfig {
  /** Available currencies by code */
  currencies: Record<string, Currency>;

  /** Available platforms by region */
  platforms: Record<string, Platform[]>;

  /** Available date formats by locale */
  dateFormats: Record<string, DateFormatConfig>;
}

/**
 * User regional preferences
 */
export interface UserRegionalPreferences {
  currency: string;
  dateFormat: string;
  numberFormat: string;
  preferredPlatforms: string[];
}
