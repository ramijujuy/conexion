export type Language = 'es' | 'en';
export type Theme = 'dark' | 'light';

export type BodyType = 'athletic' | 'average' | 'slim' | 'curvy';
export type GenderPreference = 'all' | 'women' | 'men';
export type IntentionType = 'serious' | 'chats' | 'friendship' | 'moments' | 'casual';
export type TabKey = 'radar' | 'online' | 'chats' | 'filters' | 'subscription' | 'profile';
export type IgnoreReasonKey = 'spam' | 'harassment' | 'unwanted' | 'privacy' | 'other';

export type SubscriptionPlanId = 'monthly' | 'semiannual' | 'annual';
export type CurrencyCode = 'ARS' | 'MXN' | 'COP' | 'CLP' | 'PEN' | 'UYU' | 'BRL' | 'EUR' | 'USD';

export interface AlarmPreferences {
  enabled: boolean;
  newNearbyAlert: boolean;
  newOnlineAlert: boolean;
  newMessageAlert: boolean;
  soundEnabled: boolean;
}

export interface AlarmEvent {
  id: string;
  type: 'nearby' | 'online' | 'message';
  profileId: string;
  profileName: string;
  profileAvatar: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface SubscriptionInfo {
  isActive: boolean;
  planId?: SubscriptionPlanId;
  planName?: string;
  currencyCode?: CurrencyCode;
  startDate?: string;
  expiresDate?: string;
  paymentMethod?: 'paypal' | 'card' | 'crypto' | 'local';
  autoRenew: boolean;
}

export interface UserAuth {
  id: string;
  username: string;
  email: string;
  name: string;
  birthDate?: string;
  age?: number;
  isAdultVerified: boolean;
  intentions: IntentionType[];
  isEmailVerified: boolean;
  photos: string[]; // up to 3 profile photos
  selectedIconPhotoIndex: number | null; // null means anonymous icon
  isGhostMode: boolean;
  alarms: AlarmPreferences;
  preferredCurrency?: CurrencyCode;
  subscription: SubscriptionInfo;
}

export interface DatingProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  isAnonymousAvatar: boolean;
  distanceMeters: number;
  distanceText: string;
  quote: string;
  bio: {
    es: string;
    en: string;
  };
  heightCm: number;
  heightText: string;
  weightKg: number;
  bodyType: BodyType;
  bodyTypeText: {
    es: string;
    en: string;
  };
  interests: string[];
  intentions: IntentionType[];
  isOnline: boolean;
  isVerified: boolean;
  instantPhotosEnabled: boolean;
  radarAngle: number;
  radarDistancePct: number;
  isIgnored: boolean;
  ignoredAt?: string;
  ignoreReasonKey?: IgnoreReasonKey;
  ignoreReasonNote?: string;
  liveMomentPhoto?: string;
}

export interface RadarFilters {
  maxDistanceKm: number;
  prioritizeOnline: boolean;
  showOnlyOnline: boolean;
  minAge: number;
  maxAge: number;
  minHeightCm: number;
  bodyTypes: BodyType[];
  interests: string[];
  intentions: IntentionType[];
  instantPhotosOnly: boolean;
  genderPreference: GenderPreference;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  photoUrl?: string;
  isLiveMomentPhoto?: boolean;
  photoSource?: 'instant' | 'upload';
  visibleDurationSec?: number;
  expiresAt?: number;
  isRevealed?: boolean;
  timestamp: string;
  isRead: boolean;
}
