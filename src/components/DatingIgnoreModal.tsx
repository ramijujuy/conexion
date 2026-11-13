import React, { useState } from 'react';
import { ShieldAlert, X, EyeOff, Ban, Lock, AlertTriangle } from 'lucide-react';
import { DatingProfile, IgnoreReasonKey, Language } from '../types';
import { translations } from '../i18n/translations';

interface DatingIgnoreModalProps {
  profile: DatingProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (profileId: string, reason: IgnoreReasonKey, note?: string) => void;
  lang: Language;
}

export const DatingIgnoreModal: React.FC<DatingIgnoreModalProps> = ({
  profile,
  isOpen,
  onClose,
  onConfirm,
  lang,
}) => {
  const [selectedReason, setSelectedReason] = useState<IgnoreReasonKey>('spam');
  const [note, setNote] = useState('');

  if (!isOpen || !profile) return null;

  const t = translations[lang];

  const reasons: { key: IgnoreReasonKey; label: string }[] = [
    { key: 'spam', label: t.reasons.spam },
    { key: 'harassment', label: t.reasons.harassment },
    { key: 'unwanted', label: t.reasons.unwanted },
    { key: 'privacy', label: t.reasons.privacy },
    { key: 'other', label: t.reasons.other },
  ];

  const handleConfirm = () => {
    onConfirm(profile.id, selectedReason, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0c1322] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 text-rose-500 border border-rose-800/50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.ignoreSystem.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {profile.name}, {profile.age} ({profile.distanceText})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mutual Stealth Guarantee */}
        <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-2">
          <p className="text-xs font-bold text-rose-300">
            {t.ignoreSystem.subtitle}
          </p>
          <ul className="text-[11px] text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <EyeOff className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{t.ignoreSystem.rule1}</span>
            </li>
            <li className="flex items-start gap-2">
              <Ban className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{t.ignoreSystem.rule2}</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{t.ignoreSystem.rule3}</span>
            </li>
          </ul>
        </div>

        {/* Reason choices */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            {t.ignoreSystem.reasonPrompt}
          </label>
          <div className="space-y-1.5">
            {reasons.map(({ key, label }) => {
              const isSelected = selectedReason === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedReason(key)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                      : 'bg-[#121a2c] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-rose-500 bg-rose-500' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {t.ignoreSystem.cancelBtn}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-11 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-900/40"
          >
            {t.ignoreSystem.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
