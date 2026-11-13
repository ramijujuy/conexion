import React, { useState, useRef } from 'react';
import { 
  Radar as RadarIcon, 
  User, 
  Lock, 
  Mail, 
  Camera, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Upload, 
  Trash2, 
  Star,
  MapPin,
  EyeOff,
  Calendar,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { IntentionType, Language } from '../types';
import { translations } from '../i18n/translations';
import { calculateAgeFromBirthDate, datingBackend } from '../services/mockBackend';
import { INTENTION_OPTIONS } from '../constants/intentions';

interface AuthViewProps {
  onSuccessAuth: () => void;
  lang: Language;
}

const PRESET_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
];

export const AuthView: React.FC<AuthViewProps> = ({ onSuccessAuth, lang }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'credentials' | 'otp' | 'photos'>('credentials');

  // Credentials
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Age verification (18+)
  const [birthDate, setBirthDate] = useState('');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);

  // Intentions
  const [selectedIntentions, setSelectedIntentions] = useState<IntentionType[]>(['chats', 'moments']);

  // OTP
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('482910');

  // Photos (up to 3)
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number | null>(null);
  const [useOnlyAnonymousIcon, setUseOnlyAnonymousIcon] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetSlotIndex, setTargetSlotIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = translations[lang];
  const calculatedAge = birthDate ? calculateAgeFromBirthDate(birthDate) : null;
  const isUnderage = calculatedAge !== null && calculatedAge < 18;

  const toggleIntention = (key: IntentionType) => {
    setSelectedIntentions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMsg(lang === 'es' ? 'Ingresa tu usuario y clave' : 'Enter username and password');
      return;
    }
    if (!isAdultConfirmed) {
      setErrorMsg(t.auth.mustConfirmAgeError);
      return;
    }
    datingBackend.login(usernameOrEmail);
    onSuccessAuth();
  };

  // Register step 1: submit credentials + 18+ age check -> start email verification
  const handleStartRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMsg(lang === 'es' ? 'Completa los datos requeridos' : 'Fill required fields');
      return;
    }
    if (!birthDate) {
      setErrorMsg(lang === 'es' ? 'Ingresa tu fecha de nacimiento para verificar mayoría de edad (+18).' : 'Enter your date of birth to verify 18+ age.');
      return;
    }
    const age = calculateAgeFromBirthDate(birthDate);
    if (age < 18) {
      setErrorMsg(t.auth.underageError);
      return;
    }
    if (!isAdultConfirmed) {
      setErrorMsg(t.auth.mustConfirmAgeError);
      return;
    }
    const emailToUse = regEmail.trim() || (usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@cercanias.app`);
    const { code } = datingBackend.startRegistration(usernameOrEmail, emailToUse, birthDate, selectedIntentions);
    setGeneratedCode(code);
    setStep('otp');
    setErrorMsg(null);
  };

  // Register step 2: verify OTP -> go to photos & intentions step
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() === generatedCode || otpCode.trim() === '482910' || otpCode.length === 6) {
      setStep('photos');
      setErrorMsg(null);
    } else {
      setErrorMsg(lang === 'es' ? 'Código incorrecto. Ingresa los 6 dígitos.' : 'Invalid 6-digit code');
    }
  };

  // Add photo
  const handleAddPhotoUrl = (url: string) => {
    if (photos.length < 3) {
      const nextPhotos = [...photos, url];
      setPhotos(nextPhotos);
      setUseOnlyAnonymousIcon(false);
      if (selectedIconIndex === null) {
        setSelectedIconIndex(0);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          if (photos[targetSlotIndex]) {
            const next = [...photos];
            next[targetSlotIndex] = url;
            setPhotos(next);
          } else {
            handleAddPhotoUrl(url);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    if (selectedIconIndex === index) {
      setSelectedIconIndex(next.length > 0 ? 0 : null);
      if (next.length === 0) {
        setUseOnlyAnonymousIcon(true);
      }
    } else if (selectedIconIndex !== null && selectedIconIndex > index) {
      setSelectedIconIndex(selectedIconIndex - 1);
    }
  };

  // Final register completion
  const handleFinishRegistration = () => {
    if (selectedIntentions.length === 0) {
      setErrorMsg(t.auth.selectAtLeastOneIntention);
      return;
    }
    const finalIconIndex = useOnlyAnonymousIcon || photos.length === 0 ? null : selectedIconIndex;
    datingBackend.verifyEmailCode(generatedCode, photos, finalIconIndex);
    datingBackend.updateUserIntentions(selectedIntentions);
    onSuccessAuth();
  };

  const handleDemoLogin = () => {
    datingBackend.login('ramiro_radar');
    onSuccessAuth();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-center px-4 py-8 select-none font-sans">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-indigo-600 p-0.5 shadow-xl shadow-rose-600/30">
            <div className="w-full h-full rounded-[22px] bg-[#0c1322] flex items-center justify-center">
              <RadarIcon className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {t.appTitle}
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-700/70 text-rose-300 text-[10px] font-extrabold tracking-wider">
              +18
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {t.auth.welcomeSubtitle}
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Main Card */}
        <div className="rounded-3xl bg-[#0c1322] border border-slate-800/90 p-6 shadow-2xl space-y-5">
          {/* STEP: PHOTO MANAGEMENT & INTENTIONS */}
          {step === 'photos' ? (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">
                  {lang === 'es' ? 'PASO 3 DE 3 • FOTOS E INTENCIONES' : 'STEP 3 OF 3 • PHOTOS & INTENTIONS'}
                </span>
                <h2 className="text-base font-bold text-white">
                  {t.auth.photosStepTitle}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.auth.photosStepSubtitle}
                </p>
              </div>

              {/* 3 Photo Slots */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {[0, 1, 2].map((slotIdx) => {
                  const photoUrl = photos[slotIdx];
                  const isMapIcon = selectedIconIndex === slotIdx && !useOnlyAnonymousIcon;

                  return (
                    <div
                      key={slotIdx}
                      className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden transition-all ${
                        photoUrl
                          ? isMapIcon
                            ? 'border-rose-500 ring-2 ring-rose-500/40 bg-slate-900'
                            : 'border-slate-700 bg-slate-900'
                          : 'border-dashed border-slate-800 bg-[#0f1728] hover:border-slate-700'
                      }`}
                    >
                      {photoUrl ? (
                        <>
                          <img
                            src={photoUrl}
                            alt={`Foto ${slotIdx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Map Icon Badge */}
                          {isMapIcon && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[9px] flex items-center gap-1 shadow-md">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              <span className="truncate">Mapa</span>
                            </span>
                          )}

                          {/* Overlay Controls */}
                          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedIconIndex(slotIdx);
                                setUseOnlyAnonymousIcon(false);
                              }}
                              className={`p-1 rounded-md text-[10px] font-bold transition-colors ${
                                isMapIcon
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-black/60 text-slate-300 hover:text-white'
                              }`}
                              title={t.auth.setIconBtn}
                            >
                              <MapPin className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(slotIdx)}
                              className="p-1 rounded-md bg-black/60 hover:bg-rose-900 text-slate-300 hover:text-rose-200 transition-colors"
                              title={t.auth.removePhoto}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTargetSlotIndex(slotIdx);
                            fileInputRef.current?.click();
                          }}
                          className="w-full h-full flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors p-2 text-center"
                        >
                          <Camera className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-semibold leading-tight">
                            + {t.auth.slotLabel} {slotIdx + 1}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sample Quick Preset Photos (for instant testing) */}
              <div className="p-3 rounded-2xl bg-[#111927] border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'es' ? 'O elige fotos de prueba rápidas:' : 'Or pick quick demo photos:'}
                </span>
                <div className="flex items-center gap-2">
                  {PRESET_SAMPLE_PHOTOS.map((sampleUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPhotoUrl(sampleUrl)}
                      disabled={photos.length >= 3}
                      className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-700 hover:ring-rose-500 disabled:opacity-40 transition-all shrink-0"
                    >
                      <img src={sampleUrl} alt="Sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setTargetSlotIndex(photos.length);
                      fileInputRef.current?.click();
                    }}
                    disabled={photos.length >= 3}
                    className="flex-1 h-10 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 disabled:opacity-40 text-slate-400 text-[11px] font-semibold flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.auth.uploadPhoto}</span>
                  </button>
                </div>
              </div>

              {/* Option to NOT upload any photo and use ANONYMOUS ICON ONLY */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUseOnlyAnonymousIcon(!useOnlyAnonymousIcon);
                  }}
                  className={`w-full p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    useOnlyAnonymousIcon
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-md'
                      : 'bg-[#111927] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <EyeOff className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="leading-tight">{t.auth.noPhotosOption}</span>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      useOnlyAnonymousIcon ? 'border-rose-500 bg-rose-500' : 'border-slate-700'
                    }`}
                  >
                    {useOnlyAnonymousIcon && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </span>
                </button>
              </div>

              {/* Intentions Selector */}
              <div className="p-3.5 rounded-2xl bg-[#111927] border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">{t.auth.intentionsStepLabel}</p>
                    <p className="text-[11px] text-slate-400">{t.auth.intentionsStepHint}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {INTENTION_OPTIONS.map(({ key, emoji }) => {
                    const isSelected = selectedIntentions.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleIntention(key)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                            : 'bg-[#0c1322] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{t.intentions[key]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 text-center font-medium">{errorMsg}</p>
              )}

              {/* Finish Registration Button */}
              <button
                type="button"
                onClick={handleFinishRegistration}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-rose-900/30 transition-all active:scale-95"
              >
                <span>{t.auth.finishRegisterBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : step === 'otp' ? (
            /* STEP: EMAIL AUTHENTICATOR (Código de verificación) */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-800 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white">
                  {t.auth.verifyTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  {t.auth.verifySubtitle}
                </p>
                <p className="text-xs font-semibold text-rose-400">
                  {datingBackend.getPendingEmail()}
                </p>
              </div>

              {/* Simulation code box */}
              <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 text-center space-y-1">
                <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold block">
                  {lang === 'es' ? 'Código de autenticación generado' : 'Generated authenticator code'}
                </span>
                <p className="font-mono text-base font-extrabold text-white tracking-widest">
                  {generatedCode}
                </p>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedCode)}
                  className="text-[11px] underline text-sky-300 hover:text-white"
                >
                  {lang === 'es' ? 'Pegar este código' : 'Paste this code'}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  {lang === 'es' ? 'Código de 6 dígitos' : '6-digit code'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="482910"
                  className="w-full py-3 text-center tracking-widest font-mono text-lg font-bold rounded-2xl bg-[#141e30] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 text-center font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={otpCode.length < 6}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all active:scale-95"
              >
                <span>{t.auth.verifyBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP: LOGIN OR REGISTRATION CREDENTIALS (Usuario y Clave + Edad 18+) */
            <>
              {/* Tab Selector: Iniciar Sesión / Registrarse */}
              <div className="flex p-1 rounded-2xl bg-[#111927] border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === 'login'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.auth.tabLogin}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === 'register'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.auth.tabRegister}
                </button>
              </div>

              <form onSubmit={tab === 'login' ? handleLogin : handleStartRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t.auth.usernameOrEmailLabel}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder={lang === 'es' ? 'tu_usuario o correo' : 'username or email'}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#141e30] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {tab === 'register' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {lang === 'es' ? 'Correo para Autenticador' : 'Email for Authenticator'}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="tu_correo@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#141e30] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    {/* Verificación Obligatoria de Mayoría de Edad (+18) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-300">
                          {t.auth.birthDateLabel}
                        </label>
                        {calculatedAge !== null && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isUnderage
                                ? 'bg-rose-950 text-rose-400 border border-rose-700'
                                : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                            }`}
                          >
                            {calculatedAge} {lang === 'es' ? 'años' : 'yrs'} {isUnderage ? '(< 18)' : '✓ +18'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#141e30] border text-white focus:outline-none ${
                            isUnderage ? 'border-rose-500' : 'border-slate-800 focus:border-rose-500'
                          }`}
                        />
                      </div>
                      {isUnderage && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-rose-400 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.auth.underageError}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {t.auth.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-[#141e30] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Adult 18+ Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#111927] border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAdultConfirmed}
                    onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-rose-500 shrink-0"
                  />
                  <span className="text-[11px] text-slate-300 leading-snug">
                    <strong className="text-rose-400">+18: </strong>
                    {t.auth.adultConfirmCheckbox}
                  </span>
                </label>

                {errorMsg && (
                  <p className="text-xs text-rose-400 text-center font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={tab === 'register' && isUnderage}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all active:scale-95"
                >
                  <span>{tab === 'login' ? t.auth.loginBtn : t.auth.registerBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-click Demo Login */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 rounded-2xl bg-[#141e30] hover:bg-[#1b2940] border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.auth.demoLoginBtn}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
