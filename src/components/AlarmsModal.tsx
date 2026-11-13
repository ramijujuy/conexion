import React from 'react';
import {
  Bell,
  BellRing,
  X,
  MapPin,
  Wifi,
  MessageSquare,
  Volume2,
  Crown,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AlarmEvent, AlarmPreferences, Language } from '../types';
import { translations } from '../i18n/translations';

interface AlarmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: AlarmPreferences;
  events: AlarmEvent[];
  hasPaidSubscription: boolean;
  onUpdateAlarms: (partial: Partial<AlarmPreferences>) => void;
  onTriggerTestAlarm: (type: 'nearby' | 'online' | 'message') => void;
  onPromptUpgrade: () => void;
  lang: Language;
}

export const AlarmsModal: React.FC<AlarmsModalProps> = ({
  isOpen,
  onClose,
  alarms,
  events,
  hasPaidSubscription,
  onUpdateAlarms,
  onTriggerTestAlarm,
  onPromptUpgrade,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const handleToggle = (key: keyof AlarmPreferences) => {
    if (!hasPaidSubscription) {
      onPromptUpgrade();
      return;
    }
    onUpdateAlarms({ [key]: !alarms[key] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col bg-[#0c1322] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                alarms.enabled && hasPaidSubscription
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-800/60 text-rose-400'
              }`}
            >
              {alarms.enabled && hasPaidSubscription ? (
                <BellRing className="w-5 h-5 animate-pulse" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{t.alarms.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 font-bold flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" />
                  <span>Premium</span>
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">{t.alarms.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Premium Lock Banner (NO prices/plans in mobile app) */}
          {!hasPaidSubscription && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-indigo-950/60 border border-rose-800/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="text-[11px] font-semibold text-rose-100 leading-snug">
                  {t.alarms.premiumOnlyNote}
                </p>
              </div>
              <button
                type="button"
                onClick={onPromptUpgrade}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shrink-0 shadow-md"
              >
                {t.alarms.unlockBtn}
              </button>
            </div>
          )}

          {/* Master Switch */}
          <div
            onClick={() => handleToggle('enabled')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              alarms.enabled && hasPaidSubscription
                ? 'bg-emerald-950/40 border-emerald-600/80'
                : 'bg-[#111927] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <BellRing
                className={`w-5 h-5 ${
                  alarms.enabled && hasPaidSubscription ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <div>
                <p className="text-xs font-bold text-white">{t.alarms.masterToggleTitle}</p>
                <p className="text-[11px] text-slate-400">{t.alarms.masterToggleDesc}</p>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                alarms.enabled && hasPaidSubscription ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  alarms.enabled && hasPaidSubscription ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Individual Alert Preferences */}
          <div className="space-y-2">
            {[
              {
                key: 'newNearbyAlert' as const,
                icon: MapPin,
                iconColor: 'text-rose-400',
                title: t.alarms.nearbyTitle,
                desc: t.alarms.nearbyDesc,
              },
              {
                key: 'newOnlineAlert' as const,
                icon: Wifi,
                iconColor: 'text-emerald-400',
                title: t.alarms.onlineTitle,
                desc: t.alarms.onlineDesc,
              },
              {
                key: 'newMessageAlert' as const,
                icon: MessageSquare,
                iconColor: 'text-sky-400',
                title: t.alarms.messageTitle,
                desc: t.alarms.messageDesc,
              },
              {
                key: 'soundEnabled' as const,
                icon: Volume2,
                iconColor: 'text-amber-400',
                title: t.alarms.soundTitle,
                desc: t.alarms.soundDesc,
              },
            ].map(({ key, icon: Icon, iconColor, title, desc }) => {
              const active = Boolean(alarms[key]) && hasPaidSubscription;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                    active && alarms.enabled
                      ? 'bg-[#131d31] border-slate-700'
                      : 'bg-[#0b111f] border-slate-800/80 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-800/90 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{title}</p>
                      <p className="text-[11px] text-slate-400 leading-tight">{desc}</p>
                    </div>
                  </div>

                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Test Controls (Premium) */}
          {hasPaidSubscription && (
            <div className="p-3.5 rounded-2xl bg-[#111927] border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.alarms.testSectionTitle}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onTriggerTestAlarm('nearby')}
                  className="py-2 px-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-[11px] font-bold text-rose-200 transition-colors"
                >
                  {t.alarms.testNearbyBtn}
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerTestAlarm('online')}
                  className="py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-[11px] font-bold text-emerald-200 transition-colors"
                >
                  {t.alarms.testOnlineBtn}
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerTestAlarm('message')}
                  className="py-2 px-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 text-[11px] font-bold text-sky-200 transition-colors"
                >
                  {t.alarms.testMessageBtn}
                </button>
              </div>
            </div>
          )}

          {/* Recent Alerts Log */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.alarms.recentTitle}
            </h4>
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 rounded-2xl bg-[#090e1a] border border-slate-800/70 text-center">
                {t.alarms.noEvents}
              </p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-2xl bg-[#111927] border border-slate-800 flex items-center gap-2.5"
                  >
                    <img
                      src={evt.profileAvatar}
                      alt={evt.profileName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 leading-snug">{evt.message}</p>
                      <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
