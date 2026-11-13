import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Language } from '../types';

interface DeviceFrameWrapperProps {
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  lang: Language;
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  isMobileSimulator,
  onToggleSimulator,
  lang,
  children,
}) => {
  if (!isMobileSimulator) {
    return (
      <div className="relative min-h-screen bg-[#070b14]">
        <div className="fixed bottom-20 right-4 z-50 hidden lg:block">
          <button
            onClick={onToggleSimulator}
            className="px-3.5 py-2 rounded-full bg-[#111927]/95 hover:bg-[#1a253b] border border-slate-700 text-xs font-bold text-slate-200 shadow-xl flex items-center gap-2 backdrop-blur-md transition-all"
            title={lang === 'es' ? 'Ver en Simulador Móvil' : 'Switch to Mobile Simulator'}
          >
            <Smartphone className="w-4 h-4 text-rose-400" />
            <span>{lang === 'es' ? 'Modo App Móvil' : 'Mobile App Mode'}</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04070e] sm:p-4 lg:py-8 flex flex-col items-center justify-center transition-colors">
      {/* Floating Mode Switch Banner for Desktop Reviewers */}
      <div className="mb-4 hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#0c1322] border border-slate-800 shadow-md">
        <Smartphone className="w-4 h-4 text-rose-400" />
        <span className="text-xs font-semibold text-slate-200">
          {lang === 'es'
            ? 'Versión App Móvil (React Native)'
            : 'Mobile App Version (React Native)'}
        </span>
        <button
          onClick={onToggleSimulator}
          className="ml-2 text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Vista Ancha' : 'Wide View'}</span>
        </button>
      </div>

      {/* Phone Hardware Mockup Bezel (fullscreen on real mobile devices, bezel on tablet/desktop) */}
      <div className="relative w-full sm:max-w-[410px] h-dvh sm:h-[850px] bg-[#070b14] sm:bg-slate-950 sm:rounded-[50px] sm:p-3 sm:shadow-2xl sm:ring-1 sm:ring-slate-800 sm:border-4 sm:border-slate-800 overflow-hidden">
        {/* Dynamic Island / Speaker Pill */}
        <div className="hidden sm:flex absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 items-center justify-end pr-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
        </div>

        {/* Screen container (transform keeps fixed nav/modals contained inside phone bezel) */}
        <div className="w-full h-full bg-[#070b14] sm:rounded-[40px] overflow-hidden flex flex-col relative transform-gpu">
          {/* Status bar mock */}
          <div className="hidden sm:flex h-10 pt-2 px-6 items-center justify-between text-[11px] font-bold text-white shrink-0 z-40 bg-[#070b14]/90 backdrop-blur-md">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span>5G</span>
              <span className="w-4 h-2.5 rounded-xs border border-current inline-block relative">
                <span className="w-2.5 h-full bg-current block" />
              </span>
            </div>
          </div>

          {/* App Content */}
          <div className="flex-1 overflow-y-auto relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
