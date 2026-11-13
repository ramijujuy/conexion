import React from 'react';
import { 
  Radar as RadarIcon, 
  Users, 
  MessageSquare, 
  SlidersHorizontal, 
  Crown,
  User 
} from 'lucide-react';
import { Language, TabKey } from '../types';
import { translations } from '../i18n/translations';

interface DatingBottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  unreadChatsCount: number;
  useAnonymousAvatar: boolean;
  hasPaidSubscription: boolean;
  userPhoto?: string | null;
  lang: Language;
}

export const DatingBottomNav: React.FC<DatingBottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadChatsCount,
  useAnonymousAvatar,
  hasPaidSubscription,
  userPhoto,
  lang,
}) => {
  const t = translations[lang];

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; isProfile?: boolean; badge?: number; isCrown?: boolean }[] = [
    {
      key: 'radar',
      label: t.nav.radar,
      icon: <RadarIcon className="w-5 h-5" />,
    },
    {
      key: 'online',
      label: t.nav.online,
      icon: <Users className="w-5 h-5" />,
    },
    {
      key: 'chats',
      label: t.nav.chats,
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadChatsCount,
    },
    {
      key: 'filters',
      label: t.nav.filters,
      icon: <SlidersHorizontal className="w-5 h-5" />,
    },
    {
      key: 'profile',
      label: t.nav.profile,
      icon: <User className="w-5 h-5" />,
      isProfile: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-t border-slate-800 pb-safe select-none">
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16 items-center">
        {tabs.map(({ key, label, icon, isProfile, badge }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onSelectTab(key)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] relative py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-rose-500 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {isProfile ? (
                  <div
                    className={`w-6 h-6 rounded-full overflow-hidden ring-1 ${
                      isActive ? 'ring-rose-500' : 'ring-slate-700'
                    }`}
                  >
                    {useAnonymousAvatar || !userPhoto ? (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <img
                        src={userPhoto}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  icon
                )}

                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 leading-none">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
