import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldOff, 
  Search, 
  EyeOff, 
  ArrowLeft, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { DatingProfile, Language } from '../types';
import { translations } from '../i18n/translations';

interface IgnoredListViewProps {
  ignoredProfiles: DatingProfile[];
  onUnignore: (profileId: string) => void;
  onBack: () => void;
  lang: Language;
}

export const IgnoredListView: React.FC<IgnoredListViewProps> = ({
  ignoredProfiles,
  onUnignore,
  onBack,
  lang,
}) => {
  const [search, setSearch] = useState('');
  const t = translations[lang];

  const filtered = ignoredProfiles.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.ignoreReasonNote && p.ignoreReasonNote.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-24 font-sans select-none">
      {/* Header */}
      <header className="px-5 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#070b14]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#111927] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white">
              {t.ignoreSystem.ignoredListTitle}
            </h1>
            <p className="text-[11px] text-slate-400">
              {ignoredProfiles.length} {lang === 'es' ? 'personas bloqueadas' : 'blocked profiles'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Privacy Shield Info */}
        <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <EyeOff className="w-4 h-4" />
            <span>{lang === 'es' ? 'Invisibilidad Mutua Activa' : 'Mutual Stealth Active'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.ignoreSystem.rule1}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar en lista de ignorados...' : 'Search ignored list...'}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#0c1322] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* List of Ignored */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((profile) => (
              <div
                key={profile.id}
                className="p-3.5 rounded-3xl bg-[#0c1322] border border-slate-800/80 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover grayscale ring-2 ring-rose-500/50 bg-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {profile.name}, {profile.age}
                    </h4>
                    <p className="text-[11px] text-rose-400 font-medium">
                      {profile.ignoreReasonKey ? t.reasons[profile.ignoreReasonKey] : t.reasons.other}
                    </p>
                    {profile.ignoreReasonNote && (
                      <p className="text-[10px] text-slate-400 italic truncate">
                        "{profile.ignoreReasonNote}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onUnignore(profile.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  <span>{t.ignoreSystem.unignoreBtn}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl border border-dashed border-slate-800 bg-[#0c1322]/40 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-white">{t.ignoreSystem.emptyList}</p>
          </div>
        )}
      </div>
    </div>
  );
};
