import { CurrencyCode, Language, SubscriptionPlanId } from '../types';

export interface CurrencyConfig {
  code: CurrencyCode;
  countryFlag: string;
  countryName: { es: string; en: string };
  currencyName: string;
  locale: string;
  rateFromUsd: number;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'ARS',
    countryFlag: '🇦🇷',
    countryName: { es: 'Argentina', en: 'Argentina' },
    currencyName: 'ARS',
    locale: 'es-AR',
    rateFromUsd: 1150,
    decimals: 0,
  },
  {
    code: 'MXN',
    countryFlag: '🇲🇽',
    countryName: { es: 'México', en: 'Mexico' },
    currencyName: 'MXN',
    locale: 'es-MX',
    rateFromUsd: 20,
    decimals: 0,
  },
  {
    code: 'COP',
    countryFlag: '🇨🇴',
    countryName: { es: 'Colombia', en: 'Colombia' },
    currencyName: 'COP',
    locale: 'es-CO',
    rateFromUsd: 4350,
    decimals: 0,
  },
  {
    code: 'CLP',
    countryFlag: '🇨🇱',
    countryName: { es: 'Chile', en: 'Chile' },
    currencyName: 'CLP',
    locale: 'es-CL',
    rateFromUsd: 960,
    decimals: 0,
  },
  {
    code: 'PEN',
    countryFlag: '🇵🇪',
    countryName: { es: 'Perú', en: 'Peru' },
    currencyName: 'PEN',
    locale: 'es-PE',
    rateFromUsd: 3.75,
    decimals: 2,
  },
  {
    code: 'UYU',
    countryFlag: '🇺🇾',
    countryName: { es: 'Uruguay', en: 'Uruguay' },
    currencyName: 'UYU',
    locale: 'es-UY',
    rateFromUsd: 42,
    decimals: 0,
  },
  {
    code: 'BRL',
    countryFlag: '🇧🇷',
    countryName: { es: 'Brasil', en: 'Brazil' },
    currencyName: 'BRL',
    locale: 'pt-BR',
    rateFromUsd: 5.8,
    decimals: 2,
  },
  {
    code: 'EUR',
    countryFlag: '🇪🇸',
    countryName: { es: 'España / Europa', en: 'Spain / Europe' },
    currencyName: 'EUR',
    locale: 'es-ES',
    rateFromUsd: 0.93,
    decimals: 2,
  },
  {
    code: 'USD',
    countryFlag: '🇺🇸',
    countryName: { es: 'EE.UU. / Global', en: 'USA / Global' },
    currencyName: 'USD',
    locale: 'en-US',
    rateFromUsd: 1,
    decimals: 2,
  },
];

export const PLAN_USD_PRICING: Record<
  SubscriptionPlanId,
  { monthlyUsd: number; totalUsd: number; months: number; discountPct: number }
> = {
  monthly: {
    monthlyUsd: 5,
    totalUsd: 5,
    months: 1,
    discountPct: 0,
  },
  semiannual: {
    monthlyUsd: 4,
    totalUsd: 24,
    months: 6,
    discountPct: 20,
  },
  annual: {
    monthlyUsd: 3,
    totalUsd: 36,
    months: 12,
    discountPct: 40,
  },
};

export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
}

export function detectDefaultCurrency(lang: Language): CurrencyCode {
  try {
    const saved = localStorage.getItem('cercanias_currency') as CurrencyCode | null;
    if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
      return saved;
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const navLang = (navigator.language || '').toLowerCase();

    if (tz.includes('Argentina') || navLang === 'es-ar') return 'ARS';
    if (tz.includes('Mexico') || navLang === 'es-mx') return 'MXN';
    if (tz.includes('Bogota') || navLang === 'es-co') return 'COP';
    if (tz.includes('Santiago') || navLang === 'es-cl') return 'CLP';
    if (tz.includes('Lima') || navLang === 'es-pe') return 'PEN';
    if (tz.includes('Montevideo') || navLang === 'es-uy') return 'UYU';
    if (tz.includes('Sao_Paulo') || tz.includes('Brazil') || navLang.startsWith('pt')) return 'BRL';
    if (tz.startsWith('Europe/') || navLang === 'es-es') return 'EUR';

    // Default to local Latin American currency when app is in Spanish so dollar shock is avoided
    return lang === 'es' ? 'ARS' : 'USD';
  } catch {
    return lang === 'es' ? 'ARS' : 'USD';
  }
}

export function formatLocalPriceFromUsd(usdAmount: number, currencyCode: CurrencyCode): string {
  const cfg = getCurrencyConfig(currencyCode);
  const rawConverted = usdAmount * cfg.rateFromUsd;
  const converted = cfg.decimals === 0 ? Math.round(rawConverted) : Number(rawConverted.toFixed(2));

  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.code,
      minimumFractionDigits: cfg.decimals,
      maximumFractionDigits: cfg.decimals,
    }).format(converted);
  } catch {
    return `${cfg.code} ${converted}`;
  }
}
