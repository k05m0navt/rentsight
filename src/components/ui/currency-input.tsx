/**
 * Currency Input Component
 *
 * Input field with currency symbol display
 * Shows the user's selected currency symbol next to the input
 */

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currency: string;
  loading?: boolean;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  RUB: '₽',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
  RSD: 'дин',
  UAH: '₴',
  BYN: 'Br',
  KZT: '₸',
  GEL: '₾',
  AMD: '֏',
  AZN: '₼',
  KGS: 'сом',
  TJS: 'SM',
  TMT: 'T',
  UZS: 'сўм',
  MNT: '₮',
  KRW: '₩',
  THB: '฿',
  VND: '₫',
  IDR: 'Rp',
  MYR: 'RM',
  SGD: 'S$',
  PHP: '₱',
  INR: '₹',
  PKR: '₨',
  BDT: '৳',
  LKR: '₨',
  NPR: '₨',
  AFN: '؋',
  IRR: '﷼',
  IQD: 'ع.د',
  JOD: 'د.ا',
  KWD: 'د.ك',
  LBP: 'ل.ل',
  OMR: 'ر.ع.',
  QAR: 'ر.ق',
  SAR: 'ر.س',
  SYP: 'ل.س',
  AED: 'د.إ',
  YER: '﷼',
  ILS: '₪',
  TRY: '₺',
  EGP: '£',
  MAD: 'د.م.',
  TND: 'د.ت',
  DZD: 'د.ج',
  LYD: 'ل.د',
  SDG: 'ج.س.',
  ETB: 'Br',
  KES: 'KSh',
  UGX: 'USh',
  TZS: 'TSh',
  ZAR: 'R',
  BWP: 'P',
  ZMW: 'ZK',
  MZN: 'MT',
  AOA: 'Kz',
  GHS: '₵',
  NGN: '₦',
  XOF: 'CFA',
  XAF: 'FCFA',
  CDF: 'FC',
  RWF: 'RF',
  BIF: 'FBu',
  MGA: 'Ar',
  KMF: 'CF',
  DJF: 'Fdj',
  SOS: 'S',
  ERN: 'Nfk',
  SLL: 'Le',
  GMD: 'D',
  GNF: 'FG',
  LRD: 'L$',
  SHP: '£',
  STN: 'Db',
  CVE: '$',
  MOP: 'MOP$',
  HKD: 'HK$',
  TWD: 'NT$',
  MXN: '$',
  ARS: '$',
  BRL: 'R$',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
  UYU: '$U',
  VES: 'Bs',
  BOB: 'Bs',
  PYG: '₲',
  CRC: '₡',
  GTQ: 'Q',
  HNL: 'L',
  NIO: 'C$',
  PAB: 'B/.',
  DOP: 'RD$',
  JMD: 'J$',
  TTD: 'TT$',
  BBD: 'Bds$',
  XCD: 'EC$',
  AWG: 'ƒ',
  BMD: '$',
  KYD: '$',
  FKP: '£',
  GIP: '£',
  MSR: '$',
  SBD: 'SI$',
  TVD: '$',
  WST: 'WS$',
  TOP: 'T$',
  VUV: 'Vt',
  FJD: 'FJ$',
  PGK: 'K',
  SBD: 'SI$',
  NZD: 'NZ$',
};

export function CurrencyInput({ currency, loading, className, ...props }: CurrencyInputProps) {
  const symbol = currencySymbols[currency] || currency;

  return (
    <div className="relative">
      <Input
        {...props}
        className={cn('pr-8', className)}
        placeholder={loading ? 'Loading...' : '0.00'}
        disabled={loading}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-sm font-medium text-muted">{loading ? '...' : symbol}</span>
      </div>
    </div>
  );
}
