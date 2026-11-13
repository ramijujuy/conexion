import { 
  AlarmEvent,
  AlarmPreferences,
  ChatMessage, 
  CurrencyCode,
  DatingProfile, 
  IgnoreReasonKey, 
  IntentionType,
  RadarFilters, 
  SubscriptionPlanId, 
  UserAuth 
} from '../types';
import { formatLocalPriceFromUsd, PLAN_USD_PRICING } from '../constants/currency';

export function calculateAgeFromBirthDate(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const birth = new Date(birthDateStr);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const INITIAL_PROFILES: DatingProfile[] = [
  {
    id: 'profile_valeria',
    name: 'Valeria',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isAnonymousAvatar: false,
    distanceMeters: 450,
    distanceText: '450 m',
    quote: 'Disfruto correr por las mañanas y...',
    bio: {
      es: 'Disfruto correr por las mañanas, el café de especialidad y descubrir terrazas con buena música.',
      en: 'Enjoy morning runs, specialty coffee, and discovering rooftops with great live music.',
    },
    heightCm: 168,
    heightText: '1.68 m (5\'6")',
    weightKg: 56,
    bodyType: 'athletic',
    bodyTypeText: {
      es: 'Fitness / 56 kg',
      en: 'Fitness / 56 kg',
    },
    interests: ['Café & Brunch', 'Fitness & Gym', 'Música en vivo', 'Fotografía'],
    intentions: ['serious', 'moments'],
    isOnline: true,
    isVerified: true,
    instantPhotosEnabled: true,
    radarAngle: 50,
    radarDistancePct: 40,
    isIgnored: false,
    liveMomentPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'profile_mateo',
    name: 'Mateo',
    age: 29,
    avatar: '/src/assets/images/avatar_lucas_dev_1794487402802.jpg',
    isAnonymousAvatar: false,
    distanceMeters: 1200,
    distanceText: '1.2 km',
    quote: 'Música en vivo, arquitectura urbana y buena charla.',
    bio: {
      es: 'Diseñador de sonido y amante del buen café. Buscando conectar con alguien para salidas espontáneas.',
      en: 'Sound designer & coffee lover. Looking to connect for spontaneous hangouts.',
    },
    heightCm: 182,
    heightText: '1.82 m (6\'0")',
    weightKg: 78,
    bodyType: 'athletic',
    bodyTypeText: {
      es: 'Atlética / 78 kg',
      en: 'Athletic / 78 kg',
    },
    interests: ['Música en vivo', 'Café & Brunch', 'Viajes espontáneos'],
    intentions: ['chats', 'friendship', 'moments'],
    isOnline: true,
    isVerified: true,
    instantPhotosEnabled: true,
    radarAngle: 210,
    radarDistancePct: 62,
    isIgnored: false,
  },
  {
    id: 'profile_camila',
    name: 'Camila',
    age: 24,
    avatar: '/src/assets/images/avatar_sofia_martinez_1794487401626.jpg',
    isAnonymousAvatar: false,
    distanceMeters: 800,
    distanceText: '800 m',
    quote: 'Fotógrafa buscando cómplice para brunch los domingos.',
    bio: {
      es: 'Fotógrafa de moda y amante de los animales. Me encanta salir a caminar y ver el atardecer.',
      en: 'Fashion photographer & animal lover. Love walking around and watching sunsets.',
    },
    heightCm: 165,
    heightText: '1.65 m (5\'5")',
    weightKg: 54,
    bodyType: 'slim',
    bodyTypeText: {
      es: 'Delgada / 54 kg',
      en: 'Slim / 54 kg',
    },
    interests: ['Fotografía', 'Mascotas', 'Café & Brunch'],
    intentions: ['serious', 'friendship'],
    isOnline: true,
    isVerified: true,
    instantPhotosEnabled: true,
    radarAngle: 320,
    radarDistancePct: 50,
    isIgnored: false,
  },
  {
    id: 'profile_lucas',
    name: 'Lucas',
    age: 27,
    avatar: '/src/assets/images/avatar_mateo_producer_1794487402736.jpg',
    isAnonymousAvatar: false,
    distanceMeters: 2400,
    distanceText: '2.4 km',
    quote: 'Entrenador físico, viajes espontáneos y comida rica.',
    bio: {
      es: 'Personal trainer y apasionado por los deportes al aire libre. Charlas directas y sin rodeos.',
      en: 'Personal trainer passionate about outdoor sports. Real, honest conversations.',
    },
    heightCm: 178,
    heightText: '1.78 m (5\'10")',
    weightKg: 74,
    bodyType: 'athletic',
    bodyTypeText: {
      es: 'Fitness / 74 kg',
      en: 'Fitness / 74 kg',
    },
    interests: ['Fitness & Gym', 'Viajes espontáneos', 'Mascotas'],
    intentions: ['casual', 'moments', 'chats'],
    isOnline: false,
    isVerified: false,
    instantPhotosEnabled: false,
    radarAngle: 140,
    radarDistancePct: 80,
    isIgnored: false,
  },
  {
    id: 'profile_elena_spam',
    name: 'Elena Crypto',
    age: 23,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    isAnonymousAvatar: false,
    distanceMeters: 600,
    distanceText: '600 m',
    quote: 'Gana dinero con este bot de trading...',
    bio: {
      es: 'Perfil bloqueado por enviar mensajes de spam.',
      en: 'Profile blocked for spamming links.',
    },
    heightCm: 160,
    heightText: '1.60 m',
    weightKg: 50,
    bodyType: 'slim',
    bodyTypeText: {
      es: 'Normal',
      en: 'Normal',
    },
    interests: ['Spam', 'Crypto'],
    intentions: ['casual'],
    isOnline: false,
    isVerified: false,
    instantPhotosEnabled: false,
    radarAngle: 95,
    radarDistancePct: 45,
    isIgnored: true,
    ignoredAt: '2026-11-10T12:00:00Z',
    ignoreReasonKey: 'spam',
    ignoreReasonNote: 'Envió enlaces comerciales sin consentimiento.',
  },
  {
    id: 'profile_carlos_rude',
    name: 'Carlos M.',
    age: 31,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    isAnonymousAvatar: false,
    distanceMeters: 3100,
    distanceText: '3.1 km',
    quote: 'Comentarios fuera de lugar.',
    bio: {
      es: 'Ignorado por comportamiento inadecuado.',
      en: 'Ignored for inappropriate behavior.',
    },
    heightCm: 185,
    heightText: '1.85 m',
    weightKg: 85,
    bodyType: 'average',
    bodyTypeText: {
      es: 'Promedio',
      en: 'Average',
    },
    interests: ['Debates'],
    intentions: ['chats'],
    isOnline: true,
    isVerified: false,
    instantPhotosEnabled: false,
    radarAngle: 280,
    radarDistancePct: 85,
    isIgnored: true,
    ignoredAt: '2026-11-09T18:20:00Z',
    ignoreReasonKey: 'harassment',
    ignoreReasonNote: 'Mensajes molestos tras no aceptar cita.',
  },
];

export const INITIAL_FILTERS: RadarFilters = {
  maxDistanceKm: 5,
  prioritizeOnline: true,
  showOnlyOnline: false,
  minAge: 22,
  maxAge: 34,
  minHeightCm: 165,
  bodyTypes: ['athletic', 'average', 'slim'],
  interests: ['Café & Brunch', 'Fitness & Gym', 'Música en vivo'],
  intentions: ['serious', 'chats', 'friendship', 'moments', 'casual'],
  instantPhotosOnly: false,
  genderPreference: 'all',
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'cm_1',
    senderId: 'profile_valeria',
    receiverId: 'user_me',
    text: '¡Hola! Te vi en el radar de cercanías cerca de Palermo. ¿Estás por salir a correr o a tomar un café?',
    timestamp: '11:15',
    isRead: true,
  },
  {
    id: 'cm_2',
    senderId: 'user_me',
    receiverId: 'profile_valeria',
    text: 'Hola Valeria! Sí, estoy a unas 4 cuadras. Justo terminando de entrenar.',
    timestamp: '11:17',
    isRead: true,
  },
  {
    id: 'cm_3',
    senderId: 'profile_valeria',
    receiverId: 'user_me',
    text: '¡Genial! Te comparto una foto tomada al momento con la cámara del rostro para que verifiques que soy yo 📸',
    timestamp: '11:18',
    isRead: true,
  },
  {
    id: 'cm_4',
    senderId: 'profile_valeria',
    receiverId: 'user_me',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    isLiveMomentPhoto: true,
    photoSource: 'instant',
    visibleDurationSec: 30,
    isRevealed: false,
    timestamp: '11:19',
    isRead: true,
  },
];

const DEFAULT_ALARMS: AlarmPreferences = {
  enabled: false,
  newNearbyAlert: true,
  newOnlineAlert: true,
  newMessageAlert: true,
  soundEnabled: true,
};

const DEFAULT_USER: UserAuth = {
  id: 'user_me',
  username: 'ramiro_radar',
  email: 'ramijujuy@gmail.com',
  name: 'Ramiro',
  birthDate: '1996-05-14',
  age: 30,
  isAdultVerified: true,
  intentions: ['serious', 'moments', 'chats'],
  isEmailVerified: true,
  // Initial demo photos (user can add up to 3 or leave empty for icon-only)
  photos: [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  ],
  selectedIconPhotoIndex: 0, // 0 = first photo is the map icon. If null, anonymous icon only
  isGhostMode: false,
  alarms: { ...DEFAULT_ALARMS },
  subscription: {
    isActive: false,
    autoRenew: true,
  },
};

const STORAGE_KEYS = {
  PROFILES: 'cercanias_profiles_v4',
  FILTERS: 'cercanias_filters_v4',
  CHATS: 'cercanias_chats_v4',
  USER: 'cercanias_user_v4',
  ALARMS_LOG: 'cercanias_alarms_log_v1',
};

class DatingRadarService {
  private profiles: DatingProfile[] = [];
  private filters: RadarFilters = INITIAL_FILTERS;
  private chatMessages: ChatMessage[] = [];
  private alarmEvents: AlarmEvent[] = [];
  private currentUser: UserAuth | null = null;
  private pendingVerificationCode: string = '482910';
  private pendingEmail: string = '';
  private pendingUsername: string = '';
  private pendingBirthDate: string = '';
  private pendingIntentions: IntentionType[] = ['chats', 'moments'];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const f = localStorage.getItem(STORAGE_KEYS.FILTERS);
      const c = localStorage.getItem(STORAGE_KEYS.CHATS);
      const u = localStorage.getItem(STORAGE_KEYS.USER);

      const parsedProfiles: DatingProfile[] = p ? JSON.parse(p) : INITIAL_PROFILES;
      this.profiles = parsedProfiles.map((prof) => {
        const fallback = INITIAL_PROFILES.find((ip) => ip.id === prof.id);
        return {
          ...prof,
          intentions: prof.intentions || fallback?.intentions || ['chats'],
        };
      });

      const parsedFilters: RadarFilters = f ? JSON.parse(f) : INITIAL_FILTERS;
      this.filters = {
        ...INITIAL_FILTERS,
        ...parsedFilters,
        intentions: parsedFilters.intentions || INITIAL_FILTERS.intentions,
      };

      this.chatMessages = c ? JSON.parse(c) : INITIAL_CHAT_MESSAGES;

      const a = localStorage.getItem(STORAGE_KEYS.ALARMS_LOG);
      this.alarmEvents = a ? JSON.parse(a) : [];

      if (u) {
        const parsedUser: UserAuth = JSON.parse(u);
        this.currentUser = {
          ...DEFAULT_USER,
          ...parsedUser,
          isAdultVerified: parsedUser.isAdultVerified ?? true,
          intentions: parsedUser.intentions || DEFAULT_USER.intentions,
          alarms: { ...DEFAULT_ALARMS, ...(parsedUser.alarms || {}) },
        };
      } else {
        this.currentUser = { ...DEFAULT_USER, alarms: { ...DEFAULT_ALARMS } };
      }
    } catch {
      this.profiles = INITIAL_PROFILES;
      this.filters = INITIAL_FILTERS;
      this.chatMessages = INITIAL_CHAT_MESSAGES;
      this.alarmEvents = [];
      this.currentUser = { ...DEFAULT_USER, alarms: { ...DEFAULT_ALARMS } };
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(this.profiles));
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(this.filters));
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(this.chatMessages));
      localStorage.setItem(STORAGE_KEYS.ALARMS_LOG, JSON.stringify(this.alarmEvents.slice(0, 20)));
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }

  // Auth API
  getCurrentUser(): UserAuth | null {
    return this.currentUser;
  }

  login(identifier: string, verifiedBirthDate?: string): boolean {
    const isEmail = identifier.includes('@');
    const age = verifiedBirthDate ? calculateAgeFromBirthDate(verifiedBirthDate) : DEFAULT_USER.age;
    this.currentUser = {
      ...DEFAULT_USER,
      email: isEmail ? identifier : `${identifier}@cercanias.app`,
      username: isEmail ? identifier.split('@')[0] : identifier,
      name: isEmail ? identifier.split('@')[0] : identifier,
      birthDate: verifiedBirthDate || DEFAULT_USER.birthDate,
      age,
      isAdultVerified: true,
      isEmailVerified: true,
    };
    this.save();
    return true;
  }

  startRegistration(
    usernameOrEmail: string,
    email: string,
    birthDate: string,
    intentions: IntentionType[]
  ): { code: string } {
    this.pendingEmail = email.includes('@') ? email : `${usernameOrEmail}@cercanias.app`;
    this.pendingUsername = usernameOrEmail.replace('@', '');
    this.pendingBirthDate = birthDate;
    this.pendingIntentions = intentions.length > 0 ? intentions : ['chats'];
    this.pendingVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return { code: this.pendingVerificationCode };
  }

  getPendingEmail(): string {
    return this.pendingEmail || 'usuario@ejemplo.com';
  }

  verifyEmailCode(code: string, photos: string[] = [], selectedIconIndex: number | null = null): boolean {
    if (code.trim() === this.pendingVerificationCode || code.trim() === '482910' || code.length === 6) {
      const birthDate = this.pendingBirthDate || '1998-01-01';
      const age = calculateAgeFromBirthDate(birthDate);
      this.currentUser = {
        ...DEFAULT_USER,
        email: this.pendingEmail || 'usuario@cercanias.app',
        username: this.pendingUsername || 'usuario',
        name: this.pendingUsername || 'Usuario',
        birthDate,
        age: age >= 18 ? age : 18,
        isAdultVerified: true,
        intentions: this.pendingIntentions,
        photos,
        selectedIconPhotoIndex: photos.length > 0 ? selectedIconIndex : null,
        isEmailVerified: true,
      };
      this.save();
      return true;
    }
    return false;
  }

  updateProfilePhotos(photos: string[], iconIndex: number | null) {
    if (this.currentUser) {
      this.currentUser.photos = photos.slice(0, 3);
      this.currentUser.selectedIconPhotoIndex = 
        photos.length > 0 && iconIndex !== null && iconIndex < photos.length 
          ? iconIndex 
          : null;
      this.save();
    }
  }

  updateUserIntentions(intentions: IntentionType[]) {
    if (this.currentUser) {
      this.currentUser.intentions = intentions;
      this.save();
    }
  }

  getUserMapIconUrl(): string | null {
    if (!this.currentUser) return null;
    const { photos, selectedIconPhotoIndex } = this.currentUser;
    if (selectedIconPhotoIndex !== null && photos[selectedIconPhotoIndex]) {
      return photos[selectedIconPhotoIndex];
    }
    return null; // Anonymous icon
  }

  logout() {
    this.currentUser = null;
    this.save();
  }

  // Alarms API (Premium only)
  getAlarmPreferences(): AlarmPreferences {
    return this.currentUser?.alarms || { ...DEFAULT_ALARMS };
  }

  updateAlarmPreferences(prefs: Partial<AlarmPreferences>): AlarmPreferences {
    if (this.currentUser) {
      this.currentUser.alarms = {
        ...DEFAULT_ALARMS,
        ...(this.currentUser.alarms || {}),
        ...prefs,
      };
      this.save();
    }
    return this.getAlarmPreferences();
  }

  getAlarmEvents(): AlarmEvent[] {
    return [...this.alarmEvents];
  }

  getUnreadAlarmCount(): number {
    return this.alarmEvents.filter((e) => !e.isRead).length;
  }

  markAlarmEventsRead() {
    this.alarmEvents = this.alarmEvents.map((e) => ({ ...e, isRead: true }));
    this.save();
  }

  recordAlarmEvent(
    type: 'nearby' | 'online' | 'message',
    profile: DatingProfile,
    message: string
  ): AlarmEvent {
    const evt: AlarmEvent = {
      id: `alm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      profileId: profile.id,
      profileName: profile.name,
      profileAvatar: profile.avatar,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    this.alarmEvents = [evt, ...this.alarmEvents].slice(0, 20);
    this.save();
    return evt;
  }

  simulateRadarEvent(type: 'nearby' | 'online', lang: 'es' | 'en' = 'es'): AlarmEvent | null {
    const candidates = this.getFilteredRadarProfiles();
    const pool = candidates.length > 0 ? candidates : this.profiles.filter((p) => !p.isIgnored);
    if (pool.length === 0) return null;

    const target = pool[Math.floor(Math.random() * pool.length)];
    if (type === 'online') {
      target.isOnline = true;
    }

    const msg =
      type === 'nearby'
        ? lang === 'es'
          ? `¡Nueva cercanía compatible! ${target.name} está a ${target.distanceText} de ti.`
          : `New nearby match! ${target.name} is ${target.distanceText} away.`
        : lang === 'es'
        ? `${target.name} (${target.distanceText}) acaba de conectarse en línea.`
        : `${target.name} (${target.distanceText}) just came online.`;

    return this.recordAlarmEvent(type, target, msg);
  }

  // Subscription API
  hasActiveSubscription(): boolean {
    return Boolean(this.currentUser?.subscription?.isActive);
  }

  getSubscription() {
    return this.currentUser?.subscription || { isActive: false, autoRenew: false };
  }

  subscribe(
    planId: SubscriptionPlanId,
    paymentMethod: 'paypal' | 'card' | 'crypto' | 'local',
    currencyCode: CurrencyCode = 'ARS'
  ) {
    if (!this.currentUser) return;

    const plan = PLAN_USD_PRICING[planId];
    const formattedTotal = formatLocalPriceFromUsd(plan.totalUsd, currencyCode);
    const formattedMonthly = formatLocalPriceFromUsd(plan.monthlyUsd, currencyCode);

    const names: Record<SubscriptionPlanId, string> = {
      monthly: `Plan Mensual (${formattedMonthly}/mes)`,
      semiannual: `Plan Semestral (${formattedTotal} / 6 meses)`,
      annual: `Plan Anual (${formattedTotal} / año)`,
    };

    const exp = new Date();
    if (planId === 'monthly') exp.setMonth(exp.getMonth() + 1);
    else if (planId === 'semiannual') exp.setMonth(exp.getMonth() + 6);
    else exp.setFullYear(exp.getFullYear() + 1);

    this.currentUser.preferredCurrency = currencyCode;
    this.currentUser.subscription = {
      isActive: true,
      planId,
      planName: names[planId],
      currencyCode,
      startDate: new Date().toISOString(),
      expiresDate: exp.toISOString(),
      paymentMethod,
      autoRenew: true,
    };
    this.save();
  }

  cancelSubscription() {
    if (this.currentUser) {
      this.currentUser.subscription.isActive = false;
      this.save();
    }
  }

  // Profiles and Radar Filtering
  getProfiles(): DatingProfile[] {
    return [...this.profiles];
  }

  getFilteredRadarProfiles(): DatingProfile[] {
    return this.profiles.filter((p) => {
      if (p.isIgnored) return false;
      if (p.age < 18) return false; // Safety guard 18+
      if (p.distanceMeters > this.filters.maxDistanceKm * 1000) return false;
      if (this.filters.showOnlyOnline && !p.isOnline) return false;
      if (p.age < this.filters.minAge || p.age > this.filters.maxAge) return false;
      if (p.heightCm < this.filters.minHeightCm) return false;
      if (this.filters.bodyTypes.length > 0 && !this.filters.bodyTypes.includes(p.bodyType)) {
        return false;
      }
      if (this.filters.interests.length > 0) {
        const hasMutualInterest = p.interests.some((i) => this.filters.interests.includes(i));
        if (!hasMutualInterest) return false;
      }
      if (this.filters.intentions && this.filters.intentions.length > 0) {
        const hasMutualIntention = p.intentions.some((i) => this.filters.intentions.includes(i));
        if (!hasMutualIntention) return false;
      }
      if (this.filters.instantPhotosOnly && !p.instantPhotosEnabled) {
        return false;
      }
      return true;
    });
  }

  getProfileById(id: string): DatingProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  getIgnoredProfiles(): DatingProfile[] {
    return this.profiles.filter((p) => p.isIgnored);
  }

  getFilters(): RadarFilters {
    return { ...this.filters };
  }

  updateFilters(newFilters: Partial<RadarFilters>): RadarFilters {
    this.filters = { ...this.filters, ...newFilters };
    this.save();
    return this.filters;
  }

  updateUserSettings(settings: Partial<UserAuth>) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...settings };
      this.save();
    }
  }

  // Ignore / Block system
  ignoreProfile(id: string, reasonKey: IgnoreReasonKey, note?: string): boolean {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) return false;

    profile.isIgnored = true;
    profile.ignoredAt = new Date().toISOString();
    profile.ignoreReasonKey = reasonKey;
    profile.ignoreReasonNote = note || '';

    this.save();
    return true;
  }

  unignoreProfile(id: string): boolean {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) return false;

    profile.isIgnored = false;
    profile.ignoredAt = undefined;
    profile.ignoreReasonKey = undefined;
    profile.ignoreReasonNote = undefined;

    this.save();
    return true;
  }

  // Chats API
  getChat(profileId: string): ChatMessage[] {
    return this.chatMessages.filter(
      (m) =>
        (m.senderId === profileId && m.receiverId === 'user_me') ||
        (m.senderId === 'user_me' && m.receiverId === profileId)
    );
  }

  getAllChatThreads(): { profile: DatingProfile; lastMessage?: ChatMessage; unreadCount: number }[] {
    return this.profiles
      .filter((p) => !p.isIgnored)
      .map((profile) => {
        const chat = this.getChat(profile.id);
        const lastMessage = chat[chat.length - 1];
        return {
          profile,
          lastMessage,
          unreadCount: lastMessage && !lastMessage.isRead && lastMessage.senderId !== 'user_me' ? 1 : 0,
        };
      })
      .sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return b.lastMessage.timestamp.localeCompare(a.lastMessage.timestamp);
      });
  }

  getChatQuotaStatus(profileId: string): {
    mySentCount: number;
    theirReplyCount: number;
    hasFreeFirstMessageLeft: boolean;
    canSendMessage: boolean;
    isFreeLimitReached: boolean;
  } {
    const msgs = this.getChat(profileId);
    const mySentCount = msgs.filter((m) => m.senderId === 'user_me').length;
    const theirReplyCount = msgs.filter((m) => m.senderId === profileId).length;
    const subscribed = this.hasActiveSubscription();
    const hasFreeFirstMessageLeft = mySentCount === 0;
    const canSendMessage = subscribed || hasFreeFirstMessageLeft;
    const isFreeLimitReached = !subscribed && mySentCount >= 1;

    return {
      mySentCount,
      theirReplyCount,
      hasFreeFirstMessageLeft,
      canSendMessage,
      isFreeLimitReached,
    };
  }

  sendMessage(receiverId: string, text: string): ChatMessage | null {
    const target = this.getProfileById(receiverId);
    if (target?.isIgnored) return null;

    const newMsg: ChatMessage = {
      id: `cm_${Date.now()}`,
      senderId: 'user_me',
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    this.chatMessages.push(newMsg);
    this.save();
    return newMsg;
  }

  receiveSimulatedReply(senderId: string, lang: 'es' | 'en' = 'es'): ChatMessage | null {
    const target = this.getProfileById(senderId);
    if (!target || target.isIgnored) return null;

    const repliesEs = [
      `¡Hola! Qué bueno verte cerca por el radar (${target.distanceText}). Me encantaría seguir charlando contigo 😊`,
      `¡Hola! Justo acabo de ver tu mensaje. ¡Sí, me interesa conectar! ¿Qué planes tienes hoy?`,
      `¡Hola! Qué buena onda. Si quieres seguimos la charla por acá o compartimos fotos del momento.`,
    ];
    const repliesEn = [
      `Hey there! Great seeing you nearby on radar (${target.distanceText}). Would love to keep chatting! 😊`,
      `Hi! Just saw your message. Yes, I'd love to connect! What are you up to today?`,
      `Hey! Nice to hear from you. Let's keep chatting or share an instant face photo!`,
    ];

    const pool = lang === 'es' ? repliesEs : repliesEn;
    const text = pool[Math.floor(Math.random() * pool.length)];

    const replyMsg: ChatMessage = {
      id: `cm_reply_${Date.now()}`,
      senderId,
      receiverId: 'user_me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    this.chatMessages.push(replyMsg);
    this.save();
    return replyMsg;
  }

  revealInstantPhoto(messageId: string): ChatMessage | null {
    const msg = this.chatMessages.find((m) => m.id === messageId);
    if (!msg) return null;
    if (!msg.isRevealed) {
      msg.isRevealed = true;
      msg.visibleDurationSec = msg.visibleDurationSec || 30;
      msg.expiresAt = Date.now() + msg.visibleDurationSec * 1000;
      this.save();
    }
    return msg;
  }

  sendLiveMomentPhoto(
    receiverId: string,
    photoUrl: string,
    source: 'instant' | 'upload' = 'instant',
    lang: 'es' | 'en' = 'es'
  ): ChatMessage | null {
    const target = this.getProfileById(receiverId);
    if (target?.isIgnored) return null;

    const isInstant = source === 'instant';
    const newMsg: ChatMessage = {
      id: `cm_photo_${Date.now()}`,
      senderId: 'user_me',
      receiverId,
      photoUrl,
      isLiveMomentPhoto: isInstant,
      photoSource: source,
      visibleDurationSec: isInstant ? 30 : undefined,
      expiresAt: isInstant ? Date.now() + 30 * 1000 : undefined,
      isRevealed: true,
      text: isInstant
        ? lang === 'es'
          ? '📸 Foto instantánea verificada (visible 30 segundos)'
          : '📸 Verified instant photo (visible for 30 seconds)'
        : lang === 'es'
        ? '🖼️ Foto subida desde archivo (sin verificación en vivo)'
        : '🖼️ Uploaded gallery photo (not live-verified)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    this.chatMessages.push(newMsg);
    this.save();
    return newMsg;
  }

  resetDefaults() {
    this.profiles = [...INITIAL_PROFILES];
    this.filters = { ...INITIAL_FILTERS };
    this.chatMessages = [...INITIAL_CHAT_MESSAGES];
    this.alarmEvents = [];
    this.currentUser = { ...DEFAULT_USER, alarms: { ...DEFAULT_ALARMS } };
    this.save();
  }
}

export const datingBackend = new DatingRadarService();
