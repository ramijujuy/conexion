import React, { useState } from 'react';
import {
  Check,
  Lock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Globe,
  Smartphone,
  Coins,
} from 'lucide-react';
import { CurrencyCode, Language, SubscriptionPlanId } from '../types';
import { translations } from '../i18n/translations';
import { datingBackend } from '../services/mockBackend';
import {
  detectDefaultCurrency,
  formatLocalPriceFromUsd,
  getCurrencyConfig,
  PLAN_USD_PRICING,
  SUPPORTED_CURRENCIES,
} from '../constants/currency';

interface SubscriptionViewProps {
  onSuccessSubscribe: () => void;
  onBack?: () => void;
  lang: Language;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  onSuccessSubscribe,
  onBack,
  lang,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('annual');
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const userCurr = datingBackend.getCurrentUser()?.preferredCurrency;
    return userCurr || detectDefaultCurrency(lang);
  });
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | 'crypto' | 'local'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const t = translations[lang];
  const currentSub = datingBackend.getSubscription();
  const currencyConfig = getCurrencyConfig(currency);

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    try {
      localStorage.setItem('cercanias_currency', code);
    } catch {
      // ignore
    }
  };

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      datingBackend.subscribe(selectedPlan, paymentMethod, currency);
      setIsProcessing(false);
      setSuccessBanner(true);
      setTimeout(() => {
        onSuccessSubscribe();
      }, 1500);
    }, 1100);
  };

  const handleCancelSub = () => {
    datingBackend.cancelSubscription();
    onSuccessSubscribe();
  };

  const plans: {
    id: SubscriptionPlanId;
    title: string;
    badge?: string;
    monthlyLocal: string;
    monthlyUsdRef: string;
    billedText?: string;
    desc: string;
    isPopular?: boolean;
  }[] = [
    {
      id: 'monthly',
      title: t.subscription.monthlyTitle,
      monthlyLocal: formatLocalPriceFromUsd(PLAN_USD_PRICING.monthly.monthlyUsd, currency),
      monthlyUsdRef: `USD $${PLAN_USD_PRICING.monthly.monthlyUsd.toFixed(2)}`,
      desc: t.subscription.monthlyDesc,
    },
    {
      id: 'semiannual',
      title: t.subscription.semiannualTitle,
      badge: t.subscription.semiannualBadge,
      monthlyLocal: formatLocalPriceFromUsd(PLAN_USD_PRICING.semiannual.monthlyUsd, currency),
      monthlyUsdRef: `USD $${PLAN_USD_PRICING.semiannual.monthlyUsd.toFixed(2)}/mes`,
      billedText: `${t.subscription.semiannualBilledPrefix} ${formatLocalPriceFromUsd(
        PLAN_USD_PRICING.semiannual.totalUsd,
        currency
      )}`,
      desc: t.subscription.semiannualDesc,
    },
    {
      id: 'annual',
      title: t.subscription.annualTitle,
      badge: t.subscription.annualBadge,
      monthlyLocal: formatLocalPriceFromUsd(PLAN_USD_PRICING.annual.monthlyUsd, currency),
      monthlyUsdRef: `USD $${PLAN_USD_PRICING.annual.monthlyUsd.toFixed(2)}/mes`,
      billedText: `${t.subscription.annualBilledPrefix} ${formatLocalPriceFromUsd(
        PLAN_USD_PRICING.annual.totalUsd,
        currency
      )}`,
      desc: t.subscription.annualDesc,
      isPopular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-20 font-sans select-none">
      {/* Simulated Web Page Browser Bar (Solo en la página web oficial) */}
      <div className="bg-[#0b111e] border-b border-slate-800 px-4 py-2.5 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131c30] border border-slate-700/80 text-xs text-slate-300 flex-1 max-w-md">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-mono text-[11px]">https://cercanias.app/planes</span>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.subscription.backToMobileBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Portal Header */}
      <header className="px-5 py-5 border-b border-slate-800/80 bg-[#070b14]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">
                {t.subscription.webPortalTitle}
              </span>
              <h1 className="text-lg font-bold text-white">{t.subscription.title}</h1>
              <p className="text-xs text-slate-400">{t.subscription.webPortalSubtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {successBanner && (
          <div className="p-4 rounded-3xl bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{t.subscription.subscribedSuccess}</span>
          </div>
        )}

        {/* Active plan banner if already subscribed */}
        {currentSub.isActive ? (
          <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {t.subscription.currentPlanBadge}: {currentSub.planName}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-300">
                {lang === 'es' ? 'Activo' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'es'
                ? 'Tienes chats personales ilimitados, fotos instantáneas de 30s, subida de fotos y alarmas inteligentes activos.'
                : 'You have unlimited chats, 30s instant photos, gallery uploads, and smart alarms enabled.'}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCancelSub}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                {lang === 'es' ? 'Cancelar suscripción' : 'Cancel subscription'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-300 leading-relaxed">{t.subscription.subtitle}</p>
        )}

        {/* Country / Local Currency Converter Bar */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>{t.subscription.currencySelectorLabel}</span>
            </label>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
              {currencyConfig.countryFlag} {currencyConfig.code}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_CURRENCIES.map((c) => {
              const active = c.code === currency;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelectCurrency(c.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                      : 'bg-[#121a2c] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{c.countryFlag}</span>
                  <span>{c.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Subscription Plans Cards (Always shown in Local Currency first, built from $5 USD) */}
        <div className="space-y-3">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-950/50 via-[#101728] to-[#101728] border-rose-500 shadow-xl shadow-rose-900/20 ring-1 ring-rose-500/50'
                    : 'bg-[#0c1322] border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] shadow-sm uppercase tracking-wide">
                    {p.badge}
                  </span>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{p.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                    </h3>
                    <p className="text-xs text-slate-400">{p.desc}</p>
                    {p.billedText && (
                      <p className="text-[11px] text-rose-400 font-semibold">{p.billedText}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-extrabold text-white block leading-tight">
                      {p.monthlyLocal}
                    </span>
                    <span className="text-[10px] text-slate-300 font-semibold block">
                      {currency} {t.subscription.monthlyPeriod}
                    </span>
                    {currency !== 'USD' && (
                      <span className="text-[9px] text-slate-500 block mt-0.5">
                        {t.subscription.usdReferencePrefix} {p.monthlyUsdRef}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits breakdown */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-2.5 text-xs text-slate-300">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {lang === 'es' ? 'Beneficios Premium incluidos:' : 'Included Premium benefits:'}
          </h4>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.subscription.benefit1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.subscription.benefit2}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.subscription.benefit3}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.subscription.benefit4}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.subscription.benefit5}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 block">
            {t.subscription.paymentMethodTitle}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'local', label: t.subscription.optionLocal, badge: `${currencyConfig.countryFlag} Local (${currency})` },
              { id: 'card', label: t.subscription.optionCard, badge: 'Tarjeta' },
              { id: 'paypal', label: t.subscription.optionPaypal, badge: 'PayPal' },
              { id: 'crypto', label: t.subscription.optionCrypto, badge: 'Cripto / USDT' },
            ].map(({ id, label, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaymentMethod(id as 'paypal' | 'card' | 'crypto' | 'local')}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                  paymentMethod === id
                    ? 'bg-rose-950/50 border-rose-500 text-white shadow-md'
                    : 'bg-[#121a2c] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{badge}</span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5 truncate">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Discreet guarantee */}
        <div className="p-3 rounded-2xl bg-[#0b101c] border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>{t.subscription.secureGuarantee}</p>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-900/40 active:scale-95 transition-all"
        >
          {isProcessing ? (
            <span>
              {lang === 'es'
                ? `Procesando pago seguro en ${currency}...`
                : `Processing safe payment in ${currency}...`}
            </span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {t.subscription.selectPlanBtn} ({currency})
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
