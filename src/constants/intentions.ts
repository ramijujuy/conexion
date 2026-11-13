import { IntentionType } from '../types';

export interface IntentionMeta {
  key: IntentionType;
  emoji: string;
  badgeClass: string;
}

export const INTENTION_OPTIONS: IntentionMeta[] = [
  {
    key: 'serious',
    emoji: '💍',
    badgeClass: 'bg-rose-950/60 border-rose-700/60 text-rose-300',
  },
  {
    key: 'chats',
    emoji: '💬',
    badgeClass: 'bg-sky-950/60 border-sky-700/60 text-sky-300',
  },
  {
    key: 'friendship',
    emoji: '🤝',
    badgeClass: 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300',
  },
  {
    key: 'moments',
    emoji: '✨',
    badgeClass: 'bg-amber-950/60 border-amber-700/60 text-amber-300',
  },
  {
    key: 'casual',
    emoji: '🔥',
    badgeClass: 'bg-purple-950/60 border-purple-700/60 text-purple-300',
  },
];

export function getIntentionMeta(key: IntentionType): IntentionMeta {
  return INTENTION_OPTIONS.find((item) => item.key === key) || INTENTION_OPTIONS[1];
}
