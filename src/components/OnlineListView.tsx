import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  MessageSquare, 
  Camera, 
  ShieldAlert, 
  Check, 
  Zap 
} from 'lucide-react';
import { DatingProfile, Language } from '../types';
import { translations } from '../i18n/translations';
import { getIntentionMeta } from '../constants/intentions';

interface OnlineListViewProps {
  profiles: DatingProfile[];
  onSelectProfile: (profile: DatingProfile) => void;
  onOpenChat: (profile: DatingProfile) => void;
  onOpenLivePhoto: (profile: DatingProfile) => void;
  onOpenIgnoreModal: (profile: DatingProfile) => void;
  lang: Language;
}

export const OnlineListView: React.FC<OnlineListViewProps> = ({
  profiles,
  onSelectProfile,
  onOpenChat,
  onOpenLivePhoto,
  onOpenIgnoreModal,
  lang,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'online'>('online');
  const [search, setSearch] = useState('');
  const t = translations[lang];

  // Ignored profiles are filtered out completely for privacy
  const visible = profiles.filter((p) => {
    if (p.isIgnored) return false;
    if (filterMode === 'online' && !p.isOnline) return false;
    if (search.trim()) {
      const match =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.interests.some((i) => i.toLowerCase().includes(search.toLowerCase())) ||
        p.quote.toLowerCase().includes(search.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-24 font-sans select-none">
      {/* Header */}
      <header className="px-5 py-4 border-b border-slate-800 sticky top-0 bg-[#070b14]/95 backdrop-blur-md z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">
              {lang === 'es' ? 'Personas en tu Perímetro' : 'Nearby People'}
            </h1>
            <p className="text-xs text-emerald-400 font-semibold">
              {visible.filter(p => p.isOnline).length} {t.radarScreen.onlineBadge}
            </p>
          </div>

          <div className="flex items-center p-1 rounded-full bg-[#111927] border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFilterMode('online')}
              className={`px-3 py-1 rounded-full transition-all ${
                filterMode === 'online'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'es' ? 'Conectados' : 'Online'}
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-full transition-all ${
                filterMode === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'es' ? 'Todos' : 'All'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar por afición, café, running...' : 'Search by hobbies, coffee...'}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-[#0c1322] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </header>

      {/* List */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {visible.map((profile) => (
          <div
            key={profile.id}
            className="p-3.5 rounded-3xl bg-[#0c1322] border border-slate-800/90 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-colors cursor-pointer"
            onClick={() => onSelectProfile(profile)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-700 bg-slate-800"
                />
                {profile.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0c1322]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">
                    {profile.name}, {profile.age}
                  </h4>
                  {profile.isVerified && (
                    <Check className="w-3 h-3 text-sky-400 stroke-[3]" />
                  )}
                  <span className="text-[10px] text-slate-400">
                    • {profile.distanceText}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 italic truncate mt-0.5">
                  "{profile.quote}"
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.2 bg-[#121a2c] rounded">
                    {profile.heightText.split(' ')[0]} m
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#121a2c] rounded">
                    {profile.bodyTypeText[lang]}
                  </span>
                  {profile.intentions?.slice(0, 2).map((intentKey) => {
                    const meta = getIntentionMeta(intentKey);
                    return (
                      <span
                        key={intentKey}
                        className={`px-1.5 py-0.2 rounded border font-semibold ${meta.badgeClass}`}
                      >
                        {meta.emoji} {t.intentions[intentKey]}
                      </span>
                    );
                  })}
                  {profile.instantPhotosEnabled && (
                    <span className="text-sky-400 flex items-center gap-0.5 font-bold">
                      <Zap className="w-2.5 h-2.5" />
                      Fotos ON
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onOpenLivePhoto(profile)}
                className="p-2 rounded-xl bg-[#0f2838] border border-sky-800/50 text-sky-400 hover:bg-sky-900/40"
                title="Foto al momento"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenChat(profile)}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-900/30"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => onOpenIgnoreModal(profile)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400"
                title="Ignorar"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
