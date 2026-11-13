import React, { useState, useEffect } from 'react';
import { 
  AlarmEvent,
  AlarmPreferences,
  DatingProfile, 
  IgnoreReasonKey, 
  Language, 
  RadarFilters, 
  TabKey, 
  Theme 
} from './types';
import { datingBackend } from './services/mockBackend';
import { translations } from './i18n/translations';
import { playAlarmChime } from './utils/alarmAudio';
import { AuthView } from './components/AuthView';
import { RadarView } from './components/RadarView';
import { GridView } from './components/GridView';
import { FiltersView } from './components/FiltersView';
import { DatingBottomNav } from './components/DatingBottomNav';
import { OnlineListView } from './components/OnlineListView';
import { ChatsListView } from './components/ChatsListView';
import { DatingChatView } from './components/DatingChatView';
import { SubscriptionView } from './components/SubscriptionView';
import { LivePhotoModal } from './components/LivePhotoModal';
import { DatingIgnoreModal } from './components/DatingIgnoreModal';
import { IgnoredListView } from './components/IgnoredListView';
import { ProfileView } from './components/ProfileView';
import { MobileUpgradePromptModal } from './components/MobileUpgradePromptModal';
import { AlarmsModal } from './components/AlarmsModal';
import { ToastNotification } from './components/ToastNotification';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('cercanias_lang');
    return saved === 'en' ? 'en' : 'es';
  });

  const [theme, setTheme] = useState<Theme>('dark');
  const [activeTab, setActiveTab] = useState<TabKey>('radar');
  const [viewMode, setViewMode] = useState<'radar' | 'grid'>('radar');
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(true);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => datingBackend.getCurrentUser());

  // Backend state
  const [profiles, setProfiles] = useState<DatingProfile[]>(() => datingBackend.getProfiles());
  const [radarProfiles, setRadarProfiles] = useState<DatingProfile[]>(() => datingBackend.getFilteredRadarProfiles());
  const [filters, setFilters] = useState<RadarFilters>(() => datingBackend.getFilters());
  const [hasPaidSubscription, setHasPaidSubscription] = useState<boolean>(() => datingBackend.hasActiveSubscription());

  const [selectedProfile, setSelectedProfile] = useState<DatingProfile | null>(() => {
    const list = datingBackend.getFilteredRadarProfiles();
    return list.find((p) => p.id === 'profile_valeria') || list[0] || null;
  });

  // Navigation to sub-views & Web Portal separation
  const [activeChatProfile, setActiveChatProfile] = useState<DatingProfile | null>(null);
  const [isIgnoredListOpen, setIsIgnoredListOpen] = useState(false);
  const [isWebPortalOpen, setIsWebPortalOpen] = useState(false);

  // Mobile Prompt Window ("¿Deseas continuar chateando o enviar fotos instantáneas?")
  const [isMobilePromptOpen, setIsMobilePromptOpen] = useState(false);
  const [mobilePromptTrigger, setMobilePromptTrigger] = useState<'chat' | 'photo' | 'alarms' | 'account'>('chat');
  const [mobilePromptProfile, setMobilePromptProfile] = useState<DatingProfile | null>(null);

  // Alarms state (Premium)
  const [isAlarmsModalOpen, setIsAlarmsModalOpen] = useState(false);
  const [alarmPrefs, setAlarmPrefs] = useState<AlarmPreferences>(() => datingBackend.getAlarmPreferences());
  const [alarmEvents, setAlarmEvents] = useState<AlarmEvent[]>(() => datingBackend.getAlarmEvents());
  const [unreadAlarmsCount, setUnreadAlarmsCount] = useState<number>(() => datingBackend.getUnreadAlarmCount());

  // Live photo & Ignore Modals
  const [isLivePhotoOpen, setIsLivePhotoOpen] = useState(false);
  const [livePhotoTarget, setLivePhotoTarget] = useState<DatingProfile | null>(null);
  const [isIgnoreModalOpen, setIsIgnoreModalOpen] = useState(false);
  const [ignoreTarget, setIgnoreTarget] = useState<DatingProfile | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'alert'>('success');

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('cercanias_lang', lang);
  }, [lang]);

  // Background radar alarm watcher for Premium users who opted in
  useEffect(() => {
    if (!currentUser || !hasPaidSubscription || !alarmPrefs.enabled) return;
    if (!alarmPrefs.newNearbyAlert && !alarmPrefs.newOnlineAlert) return;

    const interval = setInterval(() => {
      const types: ('nearby' | 'online')[] = [];
      if (alarmPrefs.newNearbyAlert) types.push('nearby');
      if (alarmPrefs.newOnlineAlert) types.push('online');
      if (types.length === 0) return;

      const pickedType = types[Math.floor(Math.random() * types.length)];
      const evt = datingBackend.simulateRadarEvent(pickedType, lang);
      if (evt) {
        if (alarmPrefs.soundEnabled) playAlarmChime(pickedType);
        refreshData();
        showToast(`🔔 ${evt.message}`, 'success');
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [currentUser, hasPaidSubscription, alarmPrefs, lang]);

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3500);
  };

  const refreshData = () => {
    const all = datingBackend.getProfiles();
    const filtered = datingBackend.getFilteredRadarProfiles();
    setProfiles(all);
    setRadarProfiles(filtered);
    setFilters(datingBackend.getFilters());
    setHasPaidSubscription(datingBackend.hasActiveSubscription());
    setCurrentUser(datingBackend.getCurrentUser());
    setAlarmPrefs(datingBackend.getAlarmPreferences());
    setAlarmEvents(datingBackend.getAlarmEvents());
    setUnreadAlarmsCount(datingBackend.getUnreadAlarmCount());

    if (selectedProfile) {
      setSelectedProfile(filtered.find((p) => p.id === selectedProfile.id) || filtered[0] || null);
    }
    if (activeChatProfile) {
      setActiveChatProfile(all.find((p) => p.id === activeChatProfile.id) || null);
    }
  };

  // Auth handlers
  const handleSuccessAuth = () => {
    refreshData();
    showToast(t.auth.verificationSuccess, 'success');
  };

  const handleLogout = () => {
    datingBackend.logout();
    setCurrentUser(null);
    setIsWebPortalOpen(false);
    showToast(lang === 'es' ? 'Sesión cerrada.' : 'Logged out.');
  };

  // Filter & radar handlers
  const handleSaveFilters = (newFilters: RadarFilters) => {
    datingBackend.updateFilters(newFilters);
    refreshData();
    showToast(lang === 'es' ? 'Filtros aplicados al radar.' : 'Filters applied to radar.');
  };

  // Ignore handlers
  const handleIgnore = (profileId: string, reasonKey: IgnoreReasonKey, note?: string) => {
    datingBackend.ignoreProfile(profileId, reasonKey, note);
    refreshData();
    showToast(t.ignoreSystem.ignoredSuccess, 'alert');
  };

  const handleUnignore = (profileId: string) => {
    datingBackend.unignoreProfile(profileId);
    refreshData();
    showToast(t.ignoreSystem.unignoredSuccess, 'success');
  };

  // Trigger mobile prompt window before navigating to web portal
  const openMobileUpgradePrompt = (
    trigger: 'chat' | 'photo' | 'alarms' | 'account',
    profile: DatingProfile | null = null
  ) => {
    setMobilePromptTrigger(trigger);
    setMobilePromptProfile(profile);
    setIsMobilePromptOpen(true);
  };

  // Alarms handlers (Premium only)
  const handleOpenAlarms = () => {
    datingBackend.markAlarmEventsRead();
    refreshData();
    setIsAlarmsModalOpen(true);
  };

  const handleUpdateAlarms = (partial: Partial<AlarmPreferences>) => {
    if (!hasPaidSubscription) {
      setIsAlarmsModalOpen(false);
      openMobileUpgradePrompt('alarms');
      return;
    }
    datingBackend.updateAlarmPreferences(partial);
    refreshData();
  };

  const handleTriggerTestAlarm = (type: 'nearby' | 'online' | 'message') => {
    if (!hasPaidSubscription) {
      setIsAlarmsModalOpen(false);
      openMobileUpgradePrompt('alarms');
      return;
    }

    if (type === 'message') {
      const target = profiles.find((p) => !p.isIgnored) || profiles[0];
      if (!target) return;
      datingBackend.receiveSimulatedReply(target.id, lang);
      const evt = datingBackend.recordAlarmEvent(
        'message',
        target,
        lang === 'es'
          ? `💬 Nuevo mensaje de ${target.name} (${target.distanceText})`
          : `💬 New message from ${target.name} (${target.distanceText})`
      );
      if (alarmPrefs.soundEnabled) playAlarmChime('message');
      refreshData();
      showToast(`🔔 ${evt.message}`, 'success');
      return;
    }

    const evt = datingBackend.simulateRadarEvent(type, lang);
    if (evt) {
      if (alarmPrefs.soundEnabled) playAlarmChime(type);
      refreshData();
      showToast(`🔔 ${evt.message}`, 'success');
    }
  };

  // Personal chat handlers (First message & reply FREE)
  const handleOpenChat = (profile: DatingProfile) => {
    setActiveChatProfile(profile);
  };

  const handleSendMessage = (receiverId: string, text: string) => {
    const quotaBefore = datingBackend.getChatQuotaStatus(receiverId);
    datingBackend.sendMessage(receiverId, text);
    refreshData();

    // If user just sent their 1st free message without subscription, simulate the free 1st reply
    if (!hasPaidSubscription && quotaBefore.hasFreeFirstMessageLeft) {
      showToast(
        lang === 'es'
          ? 'Primer mensaje enviado gratis. Esperando respuesta...'
          : 'Free 1st message sent. Waiting for reply...',
        'success'
      );
      setTimeout(() => {
        const reply = datingBackend.receiveSimulatedReply(receiverId, lang);
        if (reply) {
          refreshData();
          const sender = datingBackend.getProfileById(receiverId);
          showToast(
            lang === 'es'
              ? `¡${sender?.name || 'Alguien'} respondió tu primer mensaje!`
              : `${sender?.name || 'Someone'} replied to your first message!`,
            'success'
          );
        }
      }, 950);
    } else if (hasPaidSubscription && alarmPrefs.enabled && alarmPrefs.newMessageAlert) {
      // Simulate reply triggering new message alarm for opted-in Premium user
      setTimeout(() => {
        const reply = datingBackend.receiveSimulatedReply(receiverId, lang);
        if (reply) {
          const sender = datingBackend.getProfileById(receiverId);
          if (sender) {
            const evt = datingBackend.recordAlarmEvent(
              'message',
              sender,
              lang === 'es'
                ? `💬 Nuevo mensaje de ${sender.name}`
                : `💬 New message from ${sender.name}`
            );
            if (alarmPrefs.soundEnabled) playAlarmChime('message');
            refreshData();
            showToast(`🔔 ${evt.message}`, 'success');
          }
        }
      }, 1100);
    }
  };

  const handleOpenLivePhoto = (profile: DatingProfile) => {
    if (!hasPaidSubscription) {
      openMobileUpgradePrompt('photo', profile);
      return;
    }
    setLivePhotoTarget(profile);
    setIsLivePhotoOpen(true);
  };

  const handleSendLivePhoto = (
    receiverId: string,
    photoUrl: string,
    source: 'instant' | 'upload' = 'instant'
  ) => {
    datingBackend.sendLiveMomentPhoto(receiverId, photoUrl, source, lang);
    refreshData();
    showToast(
      source === 'instant' ? t.livePhotoModal.sentInstantSuccess : t.livePhotoModal.sentSuccess,
      'success'
    );
  };

  const handleRevealInstantPhoto = (messageId: string) => {
    datingBackend.revealInstantPhoto(messageId);
    refreshData();
  };

  // Subscription handlers (Web Portal ONLY)
  const handleSuccessSubscribe = () => {
    refreshData();
    setIsWebPortalOpen(false);
    showToast(t.subscription.subscribedSuccess, 'success');
  };

  // Ghost handler
  const handleToggleGhostMode = () => {
    const nextVal = !currentUser?.isGhostMode;
    datingBackend.updateUserSettings({ isGhostMode: nextVal });
    refreshData();
    showToast(
      nextVal
        ? (lang === 'es' ? 'Modo Fantasma activado: estás invisible en el radar.' : 'Ghost mode active.')
        : (lang === 'es' ? 'Modo Visible activado: personas cercanas pueden verte.' : 'Visible on radar.'),
      nextVal ? 'alert' : 'success'
    );
  };

  const handleResetData = () => {
    datingBackend.resetDefaults();
    refreshData();
    showToast(lang === 'es' ? 'Datos restablecidos a los valores originales.' : 'Data reset to defaults.');
  };

  const ignoredProfiles = profiles.filter((p) => p.isIgnored);

  // If user is not authenticated, render Login / Register Authenticator View
  if (!currentUser) {
    return (
      <DeviceFrameWrapper
        isMobileSimulator={isMobileSimulator}
        onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        lang={lang}
      >
        <AuthView onSuccessAuth={handleSuccessAuth} lang={lang} />
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      </DeviceFrameWrapper>
    );
  }

  // WEB PORTAL VIEW: Only on the official app website do we show plans & payment methods!
  if (isWebPortalOpen) {
    return (
      <div className="relative min-h-screen bg-[#070b14] text-white">
        <SubscriptionView
          onSuccessSubscribe={handleSuccessSubscribe}
          onBack={() => setIsWebPortalOpen(false)}
          lang={lang}
        />
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      </div>
    );
  }

  // Compute user's chosen map icon thumbnail (or null if none/anonymous)
  const mapIconPhoto = datingBackend.getUserMapIconUrl();

  // Active Mobile App view content (ZERO payment plans or payment methods rendered inside Mobile App)
  let content = null;

  if (activeChatProfile) {
    const chatQuota = datingBackend.getChatQuotaStatus(activeChatProfile.id);
    content = (
      <DatingChatView
        profile={activeChatProfile}
        messages={datingBackend.getChat(activeChatProfile.id)}
        onSendMessage={handleSendMessage}
        onOpenLivePhoto={handleOpenLivePhoto}
        onOpenIgnoreModal={(p) => {
          setIgnoreTarget(p);
          setIsIgnoreModalOpen(true);
        }}
        onUnignore={handleUnignore}
        onBack={() => setActiveChatProfile(null)}
        onPromptUpgrade={(trigger, p) => openMobileUpgradePrompt(trigger, p)}
        onRevealInstantPhoto={handleRevealInstantPhoto}
        canSendFreeFirstMessage={chatQuota.hasFreeFirstMessageLeft}
        hasPaidSubscription={hasPaidSubscription}
        lang={lang}
      />
    );
  } else if (isIgnoredListOpen) {
    content = (
      <IgnoredListView
        ignoredProfiles={ignoredProfiles}
        onUnignore={handleUnignore}
        onBack={() => setIsIgnoredListOpen(false)}
        lang={lang}
      />
    );
  } else if (activeTab === 'filters') {
    content = (
      <FiltersView
        initialFilters={filters}
        onSaveFilters={handleSaveFilters}
        onBack={() => setActiveTab('radar')}
        lang={lang}
      />
    );
  } else if (activeTab === 'online') {
    content = (
      <OnlineListView
        profiles={profiles}
        onSelectProfile={setSelectedProfile}
        onOpenChat={handleOpenChat}
        onOpenLivePhoto={handleOpenLivePhoto}
        onOpenIgnoreModal={(p) => {
          setIgnoreTarget(p);
          setIsIgnoreModalOpen(true);
        }}
        lang={lang}
      />
    );
  } else if (activeTab === 'chats') {
    content = (
      <ChatsListView
        profiles={profiles.filter((p) => !p.isIgnored)}
        onOpenChat={handleOpenChat}
        onOpenSubscription={() => openMobileUpgradePrompt('account')}
        hasPaidSubscription={hasPaidSubscription}
        lang={lang}
      />
    );
  } else if (activeTab === 'profile') {
    content = (
      <ProfileView
        isGhostMode={Boolean(currentUser.isGhostMode)}
        onToggleGhostMode={handleToggleGhostMode}
        hasPaidSubscription={hasPaidSubscription}
        onOpenSubscription={() => openMobileUpgradePrompt('account')}
        onOpenIgnoredList={() => setIsIgnoredListOpen(true)}
        onOpenFilters={() => setActiveTab('filters')}
        onOpenAlarms={handleOpenAlarms}
        alarms={alarmPrefs}
        onLogout={handleLogout}
        ignoredCount={ignoredProfiles.length}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        lang={lang}
        onToggleLanguage={setLang}
        onResetData={handleResetData}
        onPhotosUpdated={refreshData}
      />
    );
  } else {
    // Default 'radar' tab with STRICT PREFERENCES
    if (viewMode === 'grid') {
      content = (
        <GridView
          profiles={radarProfiles}
          filters={filters}
          onSelectProfile={setSelectedProfile}
          onOpenChat={handleOpenChat}
          onOpenLivePhoto={handleOpenLivePhoto}
          onOpenIgnoreModal={(p) => {
            setIgnoreTarget(p);
            setIsIgnoreModalOpen(true);
          }}
          onToggleViewMode={() => setViewMode('radar')}
          onOpenFilters={() => setActiveTab('filters')}
          onOpenSubscription={() => openMobileUpgradePrompt('chat', selectedProfile)}
          hasPaidSubscription={hasPaidSubscription}
          lang={lang}
        />
      );
    } else {
      content = (
        <RadarView
          profiles={radarProfiles}
          filters={filters}
          selectedProfile={selectedProfile}
          mapIconPhoto={mapIconPhoto}
          onSelectProfile={setSelectedProfile}
          onOpenChat={handleOpenChat}
          onOpenLivePhoto={handleOpenLivePhoto}
          onOpenIgnoreModal={(p) => {
            setIgnoreTarget(p);
            setIsIgnoreModalOpen(true);
          }}
          onOpenFilters={() => setActiveTab('filters')}
          onOpenSubscription={() => openMobileUpgradePrompt('chat', selectedProfile)}
          onOpenAlarms={handleOpenAlarms}
          onToggleViewMode={() => setViewMode('grid')}
          isGhostMode={Boolean(currentUser.isGhostMode)}
          onToggleGhostMode={handleToggleGhostMode}
          hasPaidSubscription={hasPaidSubscription}
          alarmsEnabled={alarmPrefs.enabled}
          unreadAlarmsCount={unreadAlarmsCount}
          lang={lang}
        />
      );
    }
  }

  return (
    <DeviceFrameWrapper
      isMobileSimulator={isMobileSimulator}
      onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
      lang={lang}
    >
      <div className="relative min-h-screen bg-[#070b14] text-white">
        {content}

        {/* Bottom Tab Bar (hidden when in 1-on-1 chat or fullscreen filter edit) */}
        {!activeChatProfile && activeTab !== 'filters' && !isIgnoredListOpen && (
          <DatingBottomNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            unreadChatsCount={1}
            useAnonymousAvatar={currentUser.selectedIconPhotoIndex === null || currentUser.photos.length === 0}
            hasPaidSubscription={hasPaidSubscription}
            userPhoto={mapIconPhoto}
            lang={lang}
          />
        )}

        {/* Live Photo Modal */}
        <LivePhotoModal
          profile={livePhotoTarget}
          isOpen={isLivePhotoOpen}
          onClose={() => {
            setIsLivePhotoOpen(false);
            setLivePhotoTarget(null);
          }}
          onSendPhoto={handleSendLivePhoto}
          lang={lang}
        />

        {/* Ignore Confirmation Modal */}
        <DatingIgnoreModal
          profile={ignoreTarget}
          isOpen={isIgnoreModalOpen}
          onClose={() => {
            setIsIgnoreModalOpen(false);
            setIgnoreTarget(null);
          }}
          onConfirm={handleIgnore}
          lang={lang}
        />

        {/* Smart Alarms Settings & Alert Log Modal (Premium) */}
        <AlarmsModal
          isOpen={isAlarmsModalOpen}
          onClose={() => setIsAlarmsModalOpen(false)}
          alarms={alarmPrefs}
          events={alarmEvents}
          hasPaidSubscription={hasPaidSubscription}
          onUpdateAlarms={handleUpdateAlarms}
          onTriggerTestAlarm={handleTriggerTestAlarm}
          onPromptUpgrade={() => {
            setIsAlarmsModalOpen(false);
            openMobileUpgradePrompt('alarms');
          }}
          lang={lang}
        />

        {/* Mobile App Upgrade Prompt Window (NO prices or payment methods shown) */}
        <MobileUpgradePromptModal
          isOpen={isMobilePromptOpen}
          triggerType={mobilePromptTrigger}
          profile={mobilePromptProfile}
          onGoToWebPage={() => {
            setIsMobilePromptOpen(false);
            setIsWebPortalOpen(true);
          }}
          onClose={() => setIsMobilePromptOpen(false)}
          lang={lang}
        />

        {/* Action Toast Feedback */}
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </DeviceFrameWrapper>
  );
}
