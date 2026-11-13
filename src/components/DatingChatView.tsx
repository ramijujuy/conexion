import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Camera, 
  ShieldAlert, 
  ShieldOff, 
  ArrowLeft, 
  EyeOff, 
  Eye,
  Lock,
  Sparkles,
  Zap,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { ChatMessage, DatingProfile, Language } from '../types';
import { translations } from '../i18n/translations';

interface DatingChatViewProps {
  profile: DatingProfile | null;
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, text: string) => void;
  onOpenLivePhoto: (profile: DatingProfile) => void;
  onOpenIgnoreModal: (profile: DatingProfile) => void;
  onUnignore: (profileId: string) => void;
  onBack: () => void;
  onPromptUpgrade: (trigger: 'chat' | 'photo', profile: DatingProfile) => void;
  onRevealInstantPhoto: (messageId: string) => void;
  canSendFreeFirstMessage: boolean;
  hasPaidSubscription: boolean;
  lang: Language;
}

export const DatingChatView: React.FC<DatingChatViewProps> = ({
  profile,
  messages,
  onSendMessage,
  onOpenLivePhoto,
  onOpenIgnoreModal,
  onUnignore,
  onBack,
  onPromptUpgrade,
  onRevealInstantPhoto,
  canSendFreeFirstMessage,
  hasPaidSubscription,
  lang,
}) => {
  const [inputText, setInputText] = useState('');
  const [nowMs, setNowMs] = useState(() => Date.now());
  const t = translations[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  if (!profile) return null;

  const canSendNow = hasPaidSubscription || canSendFreeFirstMessage;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (profile.isIgnored) return;

    if (!canSendNow) {
      onPromptUpgrade('chat', profile);
      return;
    }

    if (!inputText.trim()) return;

    onSendMessage(profile.id, inputText.trim());
    setInputText('');
  };

  const handleLivePhotoClick = () => {
    if (!hasPaidSubscription) {
      onPromptUpgrade('photo', profile);
      return;
    }
    onOpenLivePhoto(profile);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-xl mx-auto bg-[#070b14] text-white font-sans border-x border-slate-800/80">
      {/* Top Header */}
      <header className="px-4 py-3 bg-[#0c1322] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#162032] text-slate-300 hover:text-white transition-colors"
            aria-label="Volver a los chats"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className={`w-10 h-10 rounded-full object-cover ring-2 ${
                profile.isIgnored ? 'grayscale ring-rose-500' : 'ring-emerald-400'
              }`}
            />
            {profile.isOnline && !profile.isIgnored && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0c1322]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white truncate">
                {profile.name}, {profile.age}
              </h2>
              {profile.isIgnored ? (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-950 text-rose-400 border border-rose-800">
                  Ignorado
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  • {profile.distanceText}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {profile.isIgnored ? t.ignoreSystem.blockedNoticeChat : profile.quote}
            </p>
          </div>
        </div>

        {/* Right action in header */}
        <div className="flex items-center gap-2 shrink-0">
          {profile.isIgnored ? (
            <button
              onClick={() => onUnignore(profile.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1"
            >
              <ShieldOff className="w-3.5 h-3.5" />
              <span>{t.ignoreSystem.unignoreBtn}</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleLivePhotoClick}
                className="p-2 rounded-xl bg-sky-950/60 border border-sky-800 text-sky-400 hover:bg-sky-900/60 transition-colors"
                title={t.radarScreen.actionLivePhoto}
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenIgnoreModal(profile)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title={t.radarScreen.ignoreAction}
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {/* If Ignored Warning Callout */}
        {profile.isIgnored && (
          <div className="p-4 rounded-3xl bg-rose-950/40 border border-rose-800/60 text-center space-y-2 my-4">
            <div className="w-10 h-10 rounded-full bg-rose-900/60 text-rose-400 flex items-center justify-center mx-auto">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-rose-200">
              {t.ignoreSystem.blockedNoticeChat}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
              {t.ignoreSystem.rule1}
            </p>
            <button
              onClick={() => onUnignore(profile.id)}
              className="mt-2 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
            >
              {t.ignoreSystem.unignoreBtn}
            </button>
          </div>
        )}

        {/* Free 1st message banner if user hasn't sent first message yet */}
        {!hasPaidSubscription && !profile.isIgnored && canSendFreeFirstMessage && (
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-700/60 flex items-center gap-2.5 text-xs text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold leading-snug">
              {t.subscription.freeFirstMessageBanner}
            </span>
          </div>
        )}

        {/* Messages list */}
        {messages.map((m) => {
          const isMe = m.senderId === 'user_me';
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                />
              )}

              <div
                className={`max-w-[80%] rounded-3xl p-3.5 text-xs ${
                  isMe
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-br-xs shadow-md'
                    : 'bg-[#121a2c] border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Instant (30s) or Uploaded Photo rendering */}
                {m.photoUrl && (
                  <div className="mb-2 rounded-2xl overflow-hidden border border-white/20 relative">
                    {m.isLiveMomentPhoto ? (
                      !m.isRevealed ? (
                        <div className="w-56 h-44 bg-[#090e1a] flex flex-col items-center justify-center p-4 text-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-sky-950 border border-sky-700/60 text-sky-400 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                          </div>
                          <p className="text-[11px] font-bold text-sky-200 leading-tight">
                            {lang === 'es' ? 'Foto instantánea verificada (30s)' : 'Verified instant photo (30s)'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setNowMs(Date.now());
                              onRevealInstantPhoto(m.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t.livePhotoModal.revealBtn}</span>
                          </button>
                        </div>
                      ) : (() => {
                        const duration = m.visibleDurationSec || 30;
                        const secondsLeft = m.expiresAt
                          ? Math.max(0, Math.ceil((m.expiresAt - nowMs) / 1000))
                          : 0;
                        const pct = Math.max(0, Math.min(100, (secondsLeft / duration) * 100));

                        if (secondsLeft <= 0) {
                          return (
                            <div className="w-56 py-5 px-4 bg-[#090e1a] flex flex-col items-center justify-center text-center gap-1.5">
                              <EyeOff className="w-5 h-5 text-slate-500" />
                              <span className="text-[11px] font-semibold text-slate-400 leading-tight">
                                {t.livePhotoModal.expiredText}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div className="relative">
                            <img
                              src={m.photoUrl}
                              alt="Foto instantánea"
                              className="w-full max-h-56 object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-sky-300 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-sky-400" />
                              <span>{t.livePhotoModal.verifiedBadge30s}</span>
                            </div>
                            <div className="absolute top-2 right-2 bg-rose-600/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white flex items-center gap-1 shadow-md">
                              <Clock className="w-3 h-3" />
                              <span>{secondsLeft}s</span>
                            </div>
                            {/* 30-second countdown progress bar */}
                            <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
                              <div
                                className="h-full bg-gradient-to-r from-sky-400 to-rose-500 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="relative">
                        <img
                          src={m.photoUrl}
                          alt="Foto subida"
                          className="w-full max-h-56 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-300 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-amber-400" />
                          <span>{t.livePhotoModal.uploadedBadge}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {m.text && <p className="leading-relaxed">{m.text}</p>}

                <span
                  className={`text-[9px] block text-right mt-1 ${
                    isMe ? 'text-rose-200' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Post-free-exchange Lock Notice (NO prices or payment methods shown in mobile app) */}
        {!hasPaidSubscription && !profile.isIgnored && !canSendFreeFirstMessage && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#121a2c] to-indigo-950/60 border border-rose-900/60 text-center space-y-2.5 my-3 shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-rose-600/30 text-rose-400 flex items-center justify-center mx-auto">
              <Lock className="w-4 h-4 text-rose-300" />
            </div>
            <h4 className="text-xs font-bold text-white">
              {t.subscription.requiredToChatTitle}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto">
              {t.subscription.requiredToChatDesc}
            </p>
            <button
              type="button"
              onClick={() => onPromptUpgrade('chat', profile)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-rose-900/40 hover:from-rose-500"
            >
              {lang === 'es' ? 'Continuar chateando' : 'Continue chatting'}
            </button>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#0c1322] border-t border-slate-800">
        {profile.isIgnored ? (
          <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs text-center">
            {t.ignoreSystem.blockedNoticeChat}
          </div>
        ) : !canSendNow ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLivePhotoClick}
              className="p-2.5 rounded-2xl bg-[#141f32] text-sky-400 hover:bg-[#1c2c47] transition-colors"
              title={t.radarScreen.actionLivePhoto}
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onPromptUpgrade('chat', profile)}
              className="flex-1 px-4 py-2.5 text-left text-xs rounded-2xl bg-[#141f32] border border-slate-800 text-slate-400 hover:border-rose-500/60 hover:text-slate-200 transition-colors flex items-center justify-between"
            >
              <span>
                {lang === 'es'
                  ? '¿Continuar chateando o enviar fotos?'
                  : 'Continue chatting or send photos?'}
              </span>
              <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLivePhotoClick}
              className="p-2.5 rounded-2xl bg-[#141f32] text-sky-400 hover:bg-[#1c2c47] transition-colors"
              title={t.radarScreen.actionLivePhoto}
            >
              <Camera className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                hasPaidSubscription 
                  ? (lang === 'es' ? 'Escribe un mensaje para conectar...' : 'Type a message to connect...')
                  : (lang === 'es' ? 'Escribe tu primer mensaje gratis...' : 'Write your free 1st message...')
              }
              className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-[#141f32] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
