import React from 'react';
import { 
  Radar as RadarIcon, 
  MapPin, 
  Camera, 
  MessageSquare, 
  ShieldAlert, 
  Check, 
  SlidersHorizontal,
  Crown
} from 'lucide-react';
import { DatingProfile, Language, RadarFilters } from '../types';
import { translations } from '../i18n/translations';
import { getIntentionMeta } from '../constants/intentions';

interface GridViewProps {
  profiles: DatingProfile[];
  filters: RadarFilters;
  onSelectProfile: (profile: DatingProfile) => void;
  onOpenChat: (profile: DatingProfile) => void;
  onOpenLivePhoto: (profile: DatingProfile) => void;
  onOpenIgnoreModal: (profile: DatingProfile) => void;
  onToggleViewMode: () => void;
  onOpenFilters: () => void;
  onOpenSubscription: () => void;
  hasPaidSubscription: boolean;
  lang: Language;
}

export const GridView: React.FC<GridViewProps> = ({
  profiles,
  filters,
  onSelectProfile,
  onOpenChat,
  onOpenLivePhoto,
  onOpenIgnoreModal,
  onToggleViewMode,
  onOpenFilters,
  onOpenSubscription,
  hasPaidSubscription,
  lang,
}) => {
  const t = translations[lang];

  const visible = profiles;

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-white pb-24 font-sans select-none">
      {/* Top Bar Header */}
      <header className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-500 shadow-sm">
            <RadarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {t.radarScreen.title}
            </h1>
            <p className="text-xs font-semibold text-emerald-400">
              • {visible.filter(p => p.isOnline).length} {t.radarScreen.onlineBadge} • {filters.maxDistanceKm} km
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSubscription}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              hasPaidSubscription
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                : 'bg-[#111927] border border-slate-700 text-slate-300'
            }`}
          >
            <span>{hasPaidSubscription ? (lang === 'es' ? 'Activo' : 'Active') : (lang === 'es' ? '1er Msg Gratis' : '1st Msg Free')}</span>
          </button>
          <button
            onClick={onOpenFilters}
            className="w-10 h-10 rounded-full bg-[#111927] border border-slate-800 flex items-center justify-center text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Switcher Bar */}
      <div className="px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center p-1 rounded-full bg-[#111927] border border-slate-800">
          <button
            onClick={onToggleViewMode}
            className="px-4 py-1.5 rounded-full text-slate-400 font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            <RadarIcon className="w-3.5 h-3.5" />
            <span>{t.radarScreen.viewRadar}</span>
          </button>
          <button
            className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-900/40 flex items-center gap-1.5"
          >
            <span>{t.radarScreen.viewGrid}</span>
          </button>
        </div>

        <span className="text-xs text-slate-400">
          {visible.length} {lang === 'es' ? 'coincidencias' : 'matches'}
        </span>
      </div>

      {/* 2-column Dating Cards Grid */}
      <div className="max-w-lg mx-auto w-full px-4 grid grid-cols-2 gap-3.5 pt-2">
        {visible.map((profile) => (
          <div
            key={profile.id}
            className="rounded-3xl bg-[#0c1322] border border-slate-800/90 overflow-hidden flex flex-col justify-between shadow-xl transition-transform active:scale-[0.98]"
          >
            {/* Image container */}
            <div 
              className="relative aspect-4/5 bg-slate-900 overflow-hidden cursor-pointer"
              onClick={() => onSelectProfile(profile)}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-black/30" />

              {/* Status badge */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-sky-400" />
                  <span>{profile.distanceText}</span>
                </span>

                {profile.isOnline && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
                )}
              </div>

              {/* Instant photo chip */}
              {profile.instantPhotosEnabled && (
                <div className="absolute bottom-2 left-2.5 bg-sky-950/80 border border-sky-800/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-sky-300 flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5" />
                  <span>Foto en vivo</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {profile.name}, {profile.age}
                </h4>
                {profile.isVerified && (
                  <Check className="w-3.5 h-3.5 text-sky-400 stroke-[3]" />
                )}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                "{profile.quote}"
              </p>

              {profile.intentions && profile.intentions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.intentions.slice(0, 2).map((intentKey) => {
                    const meta = getIntentionMeta(intentKey);
                    return (
                      <span
                        key={intentKey}
                        className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold flex items-center gap-0.5 ${meta.badgeClass}`}
                      >
                        <span>{meta.emoji}</span>
                        <span>{t.intentions[intentKey]}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => onOpenChat(profile)}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>

                <button
                  onClick={() => onOpenIgnoreModal(profile)}
                  className="p-2 rounded-xl bg-[#141e30] border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Ignorar"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
