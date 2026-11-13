import React, { useRef } from 'react';
import { 
  User, 
  ShieldAlert, 
  EyeOff, 
  Eye, 
  SlidersHorizontal, 
  Globe, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  Camera, 
  Crown, 
  LogOut, 
  Star, 
  Trash2, 
  Upload, 
  MapPin,
  Check,
  ShieldCheck,
  HeartHandshake,
  Bell,
  BellRing
} from 'lucide-react';
import { AlarmPreferences, IntentionType, Language, Theme } from '../types';
import { translations } from '../i18n/translations';
import { datingBackend } from '../services/mockBackend';
import { INTENTION_OPTIONS } from '../constants/intentions';

interface ProfileViewProps {
  isGhostMode: boolean;
  onToggleGhostMode: () => void;
  hasPaidSubscription: boolean;
  onOpenSubscription: () => void;
  onOpenIgnoredList: () => void;
  onOpenFilters: () => void;
  onOpenAlarms: () => void;
  alarms: AlarmPreferences;
  onLogout: () => void;
  ignoredCount: number;
  theme: Theme;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLanguage: (lang: Language) => void;
  onResetData: () => void;
  onPhotosUpdated: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isGhostMode,
  onToggleGhostMode,
  hasPaidSubscription,
  onOpenSubscription,
  onOpenIgnoredList,
  onOpenFilters,
  onOpenAlarms,
  alarms,
  onLogout,
  ignoredCount,
  theme,
  onToggleTheme,
  lang,
  onToggleLanguage,
  onResetData,
  onPhotosUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const targetSlotRef = useRef<number>(0);

  const t = translations[lang];
  const currentUser = datingBackend.getCurrentUser();
  const sub = datingBackend.getSubscription();

  const photos = currentUser?.photos || [];
  const selectedIconIndex = currentUser?.selectedIconPhotoIndex ?? null;
  const isUsingAnonymousIcon = selectedIconIndex === null || photos.length === 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          const next = [...photos];
          const slot = targetSlotRef.current;
          if (next[slot]) {
            next[slot] = url;
          } else {
            next.push(url);
          }
          const nextIconIndex = selectedIconIndex === null ? 0 : selectedIconIndex;
          datingBackend.updateProfilePhotos(next, nextIconIndex);
          onPhotosUpdated();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectIcon = (index: number) => {
    datingBackend.updateProfilePhotos(photos, index);
    onPhotosUpdated();
  };

  const handleToggleAnonymousIcon = () => {
    if (isUsingAnonymousIcon) {
      // Pick first photo if available
      datingBackend.updateProfilePhotos(photos, photos.length > 0 ? 0 : null);
    } else {
      // Switch to anonymous icon only
      datingBackend.updateProfilePhotos(photos, null);
    }
    onPhotosUpdated();
  };

  const handleRemovePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    let nextIcon: number | null = selectedIconIndex;
    if (selectedIconIndex === index) {
      nextIcon = next.length > 0 ? 0 : null;
    } else if (selectedIconIndex !== null && selectedIconIndex > index) {
      nextIcon = selectedIconIndex - 1;
    }
    datingBackend.updateProfilePhotos(next, nextIcon);
    onPhotosUpdated();
  };

  const userIntentions = currentUser?.intentions || [];

  const handleToggleIntention = (key: IntentionType) => {
    const exists = userIntentions.includes(key);
    if (exists && userIntentions.length === 1) return; // keep at least 1
    const next = exists
      ? userIntentions.filter((i) => i !== key)
      : [...userIntentions, key];
    datingBackend.updateUserIntentions(next);
    onPhotosUpdated();
  };

  const activeMapPhoto = selectedIconIndex !== null && photos[selectedIconIndex] 
    ? photos[selectedIconIndex] 
    : null;

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-32 font-sans select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="px-5 pt-6 pb-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card Header */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-[#0c1322] border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-rose-500/60 bg-slate-800 flex items-center justify-center">
                {activeMapPhoto ? (
                  <img
                    src={activeMapPhoto}
                    alt="Ícono de mapa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-300">
                    <User className="w-7 h-7" />
                    <span className="text-[8px] font-bold mt-0.5">Ícono</span>
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-rose-600 text-[9px] font-bold text-white flex items-center gap-0.5 shadow-sm">
                <MapPin className="w-2.5 h-2.5" />
                <span>Mapa</span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="text-base font-bold text-white">
                  {currentUser?.name || currentUser?.username || 'Usuario'}
                  {currentUser?.age ? `, ${currentUser.age}` : ''}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {lang === 'es' ? 'En línea' : 'Online'}
                </span>
                {currentUser?.isAdultVerified && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-sky-400" />
                    <span>{t.auth.ageVerifiedBadge}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[190px]">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={t.auth.logout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Photos & Map Icon Manager (User request: hasta 3 fotos, elegir una para el icono en los mapas, o ninguna solo icono) */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-3.5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.profileScreen.photosTitle}
              </h3>
              <span className="text-[11px] font-semibold text-rose-400">
                {photos.length}/3 {lang === 'es' ? 'cargadas' : 'uploaded'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.profileScreen.photosSubtitle}
            </p>
          </div>

          {/* 3 slots */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {[0, 1, 2].map((slotIdx) => {
              const photoUrl = photos[slotIdx];
              const isSelectedForMap = selectedIconIndex === slotIdx && !isUsingAnonymousIcon;

              return (
                <div
                  key={slotIdx}
                  className={`relative aspect-square rounded-2xl border-2 overflow-hidden flex flex-col items-center justify-center transition-all ${
                    photoUrl
                      ? isSelectedForMap
                        ? 'border-rose-500 ring-2 ring-rose-500/40 bg-slate-900'
                        : 'border-slate-700 bg-slate-900'
                      : 'border-dashed border-slate-800 bg-[#0f1728]'
                  }`}
                >
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt={`Foto ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Map Icon Label */}
                      {isSelectedForMap && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[9px] flex items-center gap-1 shadow-md">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>Ícono</span>
                        </span>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSelectIcon(slotIdx)}
                          className={`p-1 rounded-md text-[10px] font-bold transition-colors ${
                            isSelectedForMap
                              ? 'bg-rose-600 text-white'
                              : 'bg-black/60 text-slate-300 hover:text-white'
                          }`}
                          title="Usar como ícono en el mapa"
                        >
                          <MapPin className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(slotIdx)}
                          className="p-1 rounded-md bg-black/60 hover:bg-rose-900 text-slate-300 hover:text-rose-200 transition-colors"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        targetSlotRef.current = slotIdx;
                        fileInputRef.current?.click();
                      }}
                      className="w-full h-full flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors p-2 text-center"
                    >
                      <Camera className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-semibold leading-tight">
                        + Foto {slotIdx + 1}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toggle "Usar solo ícono anónimo en los mapas" */}
          <button
            type="button"
            onClick={handleToggleAnonymousIcon}
            className={`w-full p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
              isUsingAnonymousIcon
                ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                : 'bg-[#111927] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-rose-400" />
              <span>{t.profileScreen.anonymousIconToggle}</span>
            </div>
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                isUsingAnonymousIcon ? 'border-rose-500 bg-rose-500' : 'border-slate-700'
              }`}
            >
              {isUsingAnonymousIcon && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </span>
          </button>
        </div>

        {/* Mis Intenciones (Algo serio, Charlas, Amistad, Compartir momentos, Casual) */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-950/70 text-rose-400 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {t.profileScreen.intentionsTitle}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {t.profileScreen.intentionsSubtitle}
                </p>
              </div>
            </div>
            {currentUser?.birthDate && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                +18 ✓
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {INTENTION_OPTIONS.map(({ key, emoji }) => {
              const isSelected = userIntentions.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleToggleIntention(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                      : 'bg-[#111927] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{t.intentions[key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Access Status Card (No prices/plans inside Mobile App) */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#0e1628] to-indigo-950/60 border border-rose-900/40 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>
                  {hasPaidSubscription
                    ? (lang === 'es' ? 'Membresía Activa ✓' : 'Active Membership ✓')
                    : (lang === 'es' ? 'Cuenta Gratuita (1er Msg Libre)' : 'Free Account (1st Msg Free)')}
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {hasPaidSubscription
                  ? (lang === 'es' ? 'Chats ilimitados y fotos en vivo activos' : 'Unlimited chats and live photos enabled')
                  : (lang === 'es' ? 'Gestiona tu cuenta en cercanias.app' : 'Manage your access on cercanias.app')}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSubscription}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/40 shrink-0"
          >
            {lang === 'es' ? 'Web Oficial' : 'Website'}
          </button>
        </div>

        {/* Privacy & Stealth Settings */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-3.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'es' ? 'Privacidad & Anonimato' : 'Privacy & Stealth'}
          </h3>

          {/* Toggle Ghost Mode */}
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                {isGhostMode ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {t.profileScreen.visibilityTitle}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isGhostMode
                    ? (lang === 'es' ? 'Navegando sin ser visto en el radar' : 'Browsing invisibly on radar')
                    : (lang === 'es' ? 'Apareces en el radar de personas cercanas' : 'Showing on nearby radar')}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleGhostMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isGhostMode
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isGhostMode ? (lang === 'es' ? 'Oculto' : 'Hidden') : (lang === 'es' ? 'Visible' : 'Visible')}
            </button>
          </div>

          {/* Ignored List Button */}
          <div className="flex items-center justify-between gap-3 py-1 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {t.profileScreen.ignoredListBtn}
                </p>
                <p className="text-[11px] text-slate-400">
                  {ignoredCount} {lang === 'es' ? 'personas bloqueadas con invisibilidad' : 'blocked profiles'}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenIgnoredList}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              {lang === 'es' ? 'Ver lista' : 'View list'}
            </button>
          </div>
        </div>

        {/* Smart Alarms Settings Card (Premium feature) */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                alarms.enabled && hasPaidSubscription
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/60'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {alarms.enabled && hasPaidSubscription ? (
                <BellRing className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{t.alarms.title}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-700/50 text-amber-300 font-bold">
                  Premium
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {alarms.enabled && hasPaidSubscription
                  ? (lang === 'es' ? 'Alertas activas (cercanías, online y mensajes)' : 'Alerts active (nearby, online & messages)')
                  : (lang === 'es' ? 'Configura alertas opcionales en tu radar' : 'Configure optional radar & chat alerts')}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAlarms}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
              alarms.enabled && hasPaidSubscription
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {lang === 'es' ? 'Configurar' : 'Configure'}
          </button>
        </div>

        {/* Preferences */}
        <div className="p-4 rounded-3xl bg-[#0c1322] border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'es' ? 'Configuración de App' : 'App Settings'}
          </h3>

          {/* Language */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">
                {t.profileScreen.languageToggle}
              </span>
            </div>

            <div className="flex gap-1 bg-[#111927] p-1 rounded-xl">
              <button
                onClick={() => onToggleLanguage('es')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  lang === 'es' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  lang === 'en' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Edit Filters link */}
          <div className="flex items-center justify-between py-1 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">
                {t.profileScreen.myPreferences}
              </span>
            </div>

            <button
              onClick={onOpenFilters}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
            >
              {lang === 'es' ? 'Ajustar' : 'Edit'}
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-800/80 flex justify-end">
            <button
              onClick={onResetData}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Restablecer datos demo' : 'Reset demo data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
