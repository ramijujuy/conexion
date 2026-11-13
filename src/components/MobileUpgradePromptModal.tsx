import React from 'react';
import { MessageSquare, Camera, ExternalLink, Globe, X, ShieldCheck } from 'lucide-react';
import { DatingProfile, Language } from '../types';
import { translations } from '../i18n/translations';

interface MobileUpgradePromptModalProps {
  isOpen: boolean;
  triggerType: 'chat' | 'photo' | 'alarms' | 'account';
  profile?: DatingProfile | null;
  onGoToWebPage: () => void;
  onClose: () => void;
  lang: Language;
}

export const MobileUpgradePromptModal: React.FC<MobileUpgradePromptModalProps> = ({
  isOpen,
  triggerType,
  profile,
  onGoToWebPage,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#0c1322] border border-slate-800 p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dual Icon Header (Chat & Instant Photo) */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-700/60 text-rose-400 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-950/80 border border-sky-700/60 text-sky-400 flex items-center justify-center shadow-lg">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        {/* Prompt Title & Context */}
        <div className="text-center space-y-2">
          {profile && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-[11px] font-bold text-slate-300">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{profile.name}, {profile.age}</span>
            </span>
          )}

          <h3 className="text-base font-extrabold text-white leading-snug">
            {triggerType === 'alarms'
              ? t.subscription.mobilePromptAlarmsTitle
              : t.subscription.mobilePromptTitle}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {triggerType === 'photo'
              ? t.subscription.mobilePromptPhotoDesc
              : triggerType === 'alarms'
              ? t.subscription.mobilePromptAlarmsDesc
              : t.subscription.mobilePromptDesc}
          </p>
        </div>

        {/* Web-only portal notice (No payment plans or payment methods shown in mobile app) */}
        <div className="p-3 rounded-2xl bg-[#111927] border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-snug">{t.subscription.mobilePromptWebNote}</p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onGoToWebPage}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-900/30 transition-all active:scale-95"
          >
            <Globe className="w-4 h-4" />
            <span>{t.subscription.mobilePromptGoWebBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[#141e30] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-colors"
          >
            {t.subscription.mobilePromptCancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
