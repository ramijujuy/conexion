import React from 'react';
import { 
  Radar as RadarIcon, 
  SlidersHorizontal, 
  Bell, 
  BellRing,
  MapPin, 
  MessageSquare, 
  Camera, 
  Check, 
  ShieldAlert, 
  EyeOff, 
  Zap, 
  Navigation,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react';
import { DatingProfile, Language, RadarFilters } from '../types';
import { translations } from '../i18n/translations';
import { getIntentionMeta } from '../constants/intentions';

interface RadarViewProps {
  profiles: DatingProfile[];
  filters: RadarFilters;
  selectedProfile: DatingProfile | null;
  mapIconPhoto: string | null;
  onSelectProfile: (profile: DatingProfile) => void;
  onOpenChat: (profile: DatingProfile) => void;
  onOpenLivePhoto: (profile: DatingProfile) => void;
  onOpenIgnoreModal: (profile: DatingProfile) => void;
  onOpenFilters: () => void;
  onOpenSubscription: () => void;
  onOpenAlarms: () => void;
  onToggleViewMode: () => void;
  isGhostMode: boolean;
  onToggleGhostMode: () => void;
  hasPaidSubscription: boolean;
  alarmsEnabled: boolean;
  unreadAlarmsCount: number;
  lang: Language;
}

export const RadarView: React.FC<RadarViewProps> = ({
  profiles,
  filters,
  selectedProfile,
  mapIconPhoto,
  onSelectProfile,
  onOpenChat,
  onOpenLivePhoto,
  onOpenIgnoreModal,
  onOpenFilters,
  onOpenSubscription,
  onOpenAlarms,
  onToggleViewMode,
  isGhostMode,
  onToggleGhostMode,
  hasPaidSubscription,
  alarmsEnabled,
  unreadAlarmsCount,
  lang,
}) => {
  const t = translations[lang];

  // Candidates in radar strictly match preferences and are not ignored
  const visibleProfiles = profiles;
  const onlineCount = visibleProfiles.filter((p) => p.isOnline).length;
  const activeSelected = selectedProfile || visibleProfiles[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-white select-none pb-24 font-sans">
      {/* Ghost Mode Alert if active */}
      {isGhostMode && (
        <div className="bg-rose-950/80 border-b border-rose-800/60 px-4 py-2 text-center text-xs flex items-center justify-center gap-2 text-rose-200">
          <EyeOff className="w-3.5 h-3.5" />
          <span>{t.radarScreen.stealthModeBanner}</span>
          <button
            onClick={onToggleGhostMode}
            className="underline font-bold text-white ml-2 hover:text-rose-100"
          >
            {t.radarScreen.makeVisible}
          </button>
        </div>
      )}

      {/* Top Bar Header (Matches Stitch screen 1) */}
      <header className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-500 shadow-sm shadow-rose-900/30">
            <RadarIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {t.radarScreen.title}
            </h1>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>• {t.radarScreen.title} activo • {filters.maxDistanceKm} km</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Account status chip (no pricing shown in mobile app) */}
          <button
            onClick={onOpenSubscription}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              hasPaidSubscription
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                : 'bg-[#111927] border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {hasPaidSubscription ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'es' ? 'Activo' : 'Active'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>{lang === 'es' ? '1er Msg Gratis' : '1st Msg Free'}</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenFilters}
            className="w-10 h-10 rounded-full bg-[#111927] border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Filtros"
            aria-label="Filtros"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAlarms}
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              alarmsEnabled && hasPaidSubscription
                ? 'bg-emerald-950/70 border-emerald-600/80 text-emerald-400'
                : 'bg-[#111927] border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={t.alarms.title}
            aria-label={t.alarms.title}
          >
            {alarmsEnabled && hasPaidSubscription ? (
              <BellRing className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
            {unreadAlarmsCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#070b14]">
                {unreadAlarmsCount}
              </span>
            ) : !hasPaidSubscription ? (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-[#070b14]" />
            ) : null}
          </button>
        </div>
      </header>

      {/* Stats row chips */}
      <div className="px-5 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>{onlineCount} {t.radarScreen.onlineBadge}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#111927] border border-slate-800 text-slate-300 font-medium">
            {visibleProfiles.length} {t.radarScreen.nearbyToday}
          </span>
        </div>

        <div className="flex items-center gap-1 text-sky-400 font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.radarScreen.radiusLabel}: {filters.maxDistanceKm} km</span>
        </div>
      </div>

      {/* Controls row: Radar vs Cuadrícula & Preference badge (No public general chat) */}
      <div className="px-5 py-2 flex items-center justify-between gap-3">
        {/* Toggle segmented */}
        <div className="flex items-center p-1 rounded-full bg-[#111927] border border-slate-800">
          <button
            className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-900/40 flex items-center gap-1.5 transition-all"
          >
            <RadarIcon className="w-3.5 h-3.5" />
            <span>{t.radarScreen.viewRadar}</span>
          </button>
          <button
            onClick={onToggleViewMode}
            className="px-4 py-1.5 rounded-full text-slate-400 hover:text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            <span>{t.radarScreen.viewGrid}</span>
          </button>
        </div>

        {/* Preference notice chip */}
        <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-900/50 px-3 py-1.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span>{lang === 'es' ? 'Solo preferencias' : 'Preferences only'}</span>
        </span>
      </div>

      {/* Circular Radar Simulation Viewport */}
      <div className="relative flex-1 flex items-center justify-center py-6 px-4 overflow-hidden min-h-[380px]">
        {visibleProfiles.length === 0 ? (
          <div className="p-8 text-center max-w-xs space-y-3 bg-[#0c1322]/80 border border-slate-800 rounded-3xl">
            <RadarIcon className="w-10 h-10 text-rose-400 mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-white">
              {t.radarScreen.noMatches}
            </h3>
            <button
              onClick={onOpenFilters}
              className="px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-md"
            >
              {t.radarScreen.adjustFilters}
            </button>
          </div>
        ) : (
          <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-full border border-slate-800/80 flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-slate-800/60" />
            {/* Middle ring 1 */}
            <div className="absolute w-[260px] h-[260px] sm:w-[290px] sm:h-[290px] rounded-full border border-slate-800/80" />
            {/* Middle ring 2 */}
            <div className="absolute w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full border border-slate-800" />
            {/* Inner ring */}
            <div className="absolute w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-full border border-rose-900/30" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/40" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-slate-800/40" />

            {/* Radar sweep beam animation */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none opacity-20"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(244, 63, 94, 0.4) 360deg)',
                animation: 'spin 6s linear infinite'
              }}
            />

            {/* Center Point: Tú (Centro) with user's selected map icon photo or anonymous icon */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 p-0.5 shadow-lg shadow-rose-600/50 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0a0f1d] flex items-center justify-center overflow-hidden">
                  {mapIconPhoto ? (
                    <img
                      src={mapIconPhoto}
                      alt="Tú"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Navigation className="w-5 h-5 text-rose-500 transform rotate-45" />
                  )}
                </div>
              </div>
              <span className="mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 flex items-center gap-1">
                <span>{t.radarScreen.youCenter}</span>
              </span>
            </div>

            {/* Floating Orbiting Blips (Candidates matching user preferences) */}
            {visibleProfiles.map((candidate) => {
              const isSelected = activeSelected?.id === candidate.id;
              const rad = (candidate.radarAngle * Math.PI) / 180;
              const r = (candidate.radarDistancePct / 100) * 140;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;

              return (
                <div
                  key={candidate.id}
                  onClick={() => onSelectProfile(candidate)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute z-20 flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                >
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full p-0.5 transition-all ${
                        isSelected
                          ? 'ring-4 ring-rose-500 shadow-xl shadow-rose-600/40'
                          : 'ring-2 ring-emerald-400/80 shadow-md'
                      }`}
                    >
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover bg-slate-800"
                      />
                    </div>
                    {candidate.isOnline && (
                      <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#070b14]" />
                    )}
                  </div>

                  <span className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111927]/90 border border-slate-700/80 text-white shadow-sm flex items-center gap-1">
                    {candidate.instantPhotosEnabled && (
                      <Camera className="w-2.5 h-2.5 text-sky-400" />
                    )}
                    <span>{candidate.distanceText}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Candidate Card */}
      {activeSelected && (
        <div className="px-4 z-30">
          <div className="w-full max-w-lg mx-auto rounded-3xl bg-[#0c1322] border border-slate-800/90 p-4 shadow-2xl backdrop-blur-xl space-y-3.5">
            {/* Top row of card */}
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={activeSelected.avatar}
                  alt={activeSelected.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 bg-slate-800"
                />
                {activeSelected.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0c1322]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <h3 className="text-base font-bold text-white truncate">
                      {activeSelected.name}, {activeSelected.age}
                    </h3>
                    {activeSelected.isVerified && (
                      <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 shrink-0">
                    {activeSelected.distanceText} {t.radarScreen.nearDistance}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic">
                  "{activeSelected.quote}"
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#162032] border border-slate-700/60 text-slate-300 font-medium">
                    {activeSelected.heightText.split(' ')[0]} m
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#162032] border border-slate-700/60 text-slate-300 font-medium">
                    {activeSelected.bodyTypeText[lang]}
                  </span>
                  {activeSelected.intentions?.map((intentKey) => {
                    const meta = getIntentionMeta(intentKey);
                    return (
                      <span
                        key={intentKey}
                        className={`px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${meta.badgeClass}`}
                      >
                        <span>{meta.emoji}</span>
                        <span>{t.intentions[intentKey]}</span>
                      </span>
                    );
                  })}
                </div>

                {activeSelected.instantPhotosEnabled && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2.5 py-0.5 rounded-md w-fit">
                    <Zap className="w-3 h-3 text-sky-400" />
                    <span>{t.radarScreen.livePhotosOn}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <button
                onClick={() => onOpenLivePhoto(activeSelected)}
                className="flex-1 h-11 px-3 rounded-2xl bg-[#0f2838] hover:bg-[#15384e] border border-sky-800/50 text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Camera className="w-4 h-4 text-sky-400" />
                <span className="truncate">{t.radarScreen.actionLivePhoto}</span>
              </button>

              <button
                onClick={() => onOpenChat(activeSelected)}
                className="flex-1 h-11 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-rose-600/30 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span className="truncate">{t.radarScreen.actionOpenChat}</span>
              </button>

              <button
                onClick={() => onOpenIgnoreModal(activeSelected)}
                className="w-11 h-11 rounded-2xl bg-[#162032] border border-slate-800 hover:border-rose-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all shrink-0 active:scale-95"
                title={t.radarScreen.ignoreAction}
                aria-label={t.radarScreen.ignoreAction}
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
