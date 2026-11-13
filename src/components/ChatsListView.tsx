import React from 'react';
import { 
  MessageSquare, 
  Camera, 
  ShieldAlert, 
  EyeOff, 
  Zap, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import { DatingProfile, Language } from '../types';
import { datingBackend } from '../services/mockBackend';

interface ChatsListViewProps {
  profiles: DatingProfile[];
  onOpenChat: (profile: DatingProfile) => void;
  onOpenSubscription: () => void;
  hasPaidSubscription: boolean;
  lang: Language;
}

export const ChatsListView: React.FC<ChatsListViewProps> = ({
  profiles,
  onOpenChat,
  onOpenSubscription,
  hasPaidSubscription,
  lang,
}) => {
  const threads = datingBackend.getAllChatThreads();

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-28 font-sans select-none">
      <header className="px-5 py-4 border-b border-slate-800 sticky top-0 bg-[#070b14]/95 backdrop-blur-md z-20 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">
            {lang === 'es' ? 'Conversaciones Personales' : 'Personal Chats'}
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'es' ? 'Tus charlas 1-a-1 con personas del radar' : 'Your 1-on-1 private conversations'}
          </p>
        </div>

        {!hasPaidSubscription && (
          <button
            onClick={onOpenSubscription}
            className="px-3 py-1.5 rounded-full bg-[#111927] border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'es' ? 'Acceso Web' : 'Web Portal'}</span>
          </button>
        )}
      </header>

      {/* Free first message + reply info banner (no plans/prices shown inside mobile app) */}
      {!hasPaidSubscription && (
        <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1628] to-indigo-950/40 border border-emerald-800/50 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'es'
                ? 'Primer mensaje y su respuesta son libres en cada chat'
                : 'Your first message and reply are free in every chat'}
            </span>
          </div>
          <button
            onClick={onOpenSubscription}
            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shrink-0"
          >
            {lang === 'es' ? 'Continuar' : 'Continue'}
          </button>
        </div>
      )}

      {/* Multiple Personal Conversations Thread List */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-2.5">
        {threads.map(({ profile, lastMessage, unreadCount }) => (
          <div
            key={profile.id}
            onClick={() => onOpenChat(profile)}
            className="p-3.5 rounded-3xl bg-[#0c1322] border border-slate-800/90 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-400 bg-slate-800"
                />
                {profile.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0c1322]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white truncate">
                    {profile.name}, {profile.age}
                  </h4>
                  {lastMessage && (
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {lastMessage.timestamp}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {lastMessage?.photoUrl ? (
                    <span className="text-sky-400 font-medium flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Foto instantánea compartida
                    </span>
                  ) : (
                    lastMessage?.text || profile.quote
                  )}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-900 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
