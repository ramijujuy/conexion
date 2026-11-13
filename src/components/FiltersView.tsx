import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Ruler, 
  Heart, 
  Camera, 
  Check, 
  Radar,
  HeartHandshake
} from 'lucide-react';
import { BodyType, IntentionType, Language, RadarFilters } from '../types';
import { translations } from '../i18n/translations';
import { INTENTION_OPTIONS } from '../constants/intentions';

interface FiltersViewProps {
  initialFilters: RadarFilters;
  onSaveFilters: (filters: RadarFilters) => void;
  onBack: () => void;
  lang: Language;
}

export const FiltersView: React.FC<FiltersViewProps> = ({
  initialFilters,
  onSaveFilters,
  onBack,
  lang,
}) => {
  const [filters, setFilters] = useState<RadarFilters>({
    ...initialFilters,
    intentions: initialFilters.intentions || ['serious', 'chats', 'friendship', 'moments', 'casual'],
  });
  const t = translations[lang];

  const toggleBodyType = (type: BodyType) => {
    setFilters((prev) => {
      const exists = prev.bodyTypes.includes(type);
      const updated = exists 
        ? prev.bodyTypes.filter((t) => t !== type)
        : [...prev.bodyTypes, type];
      return { ...prev, bodyTypes: updated };
    });
  };

  const toggleInterest = (interest: string) => {
    setFilters((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists 
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const toggleIntention = (intention: IntentionType) => {
    setFilters((prev) => {
      const current = prev.intentions || [];
      const exists = current.includes(intention);
      const updated = exists
        ? current.filter((i) => i !== intention)
        : [...current, intention];
      return { ...prev, intentions: updated };
    });
  };

  const handleSave = () => {
    onSaveFilters(filters);
    onBack();
  };

  const availableInterests = [
    { label: 'Café & Brunch', icon: '☕' },
    { label: 'Fitness & Gym', icon: '🏋️' },
    { label: 'Música en vivo', icon: '🎵' },
    { label: 'Fotografía', icon: '📷' },
    { label: 'Mascotas', icon: '🐶' },
    { label: 'Viajes espontáneos', icon: '✈️' },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-32 font-sans select-none">
      {/* Top Header matching stitch screenshot 2 */}
      <header className="sticky top-0 z-30 bg-[#070b14]/95 backdrop-blur-md px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#111927] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            {t.filtersScreen.stepBadge}
          </p>
          <h1 className="text-lg font-bold text-white tracking-tight">
            {t.filtersScreen.title}
          </h1>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
        >
          {t.filtersScreen.skip}
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Card 1: Custom Radar Hero Intro */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#0e1626] to-[#0e1626] border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>{t.filtersScreen.cardCustomRadar}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.filtersScreen.customRadarDesc}
          </p>
        </div>

        {/* Card 2: Distancia a la redonda */}
        <div className="p-5 rounded-3xl bg-[#0c1322] border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 text-rose-500 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.filtersScreen.distanceTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.filtersScreen.distanceSubtitle}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/50 text-rose-400 font-bold text-xs">
              {filters.maxDistanceKm} km
            </span>
          </div>

          {/* Slider */}
          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={filters.maxDistanceKm}
              onChange={(e) => setFilters({ ...filters, maxDistanceKm: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>500 m ({t.filtersScreen.sameNeighborhood})</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{t.filtersScreen.prioritizeOnline}</span>
              </div>
              <input
                type="checkbox"
                checked={filters.prioritizeOnline}
                onChange={(e) => setFilters({ ...filters, prioritizeOnline: e.target.checked })}
                className="w-4 h-4 rounded-md accent-rose-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>{t.filtersScreen.showOnlyOnline}</span>
              </div>
              <input
                type="checkbox"
                checked={filters.showOnlyOnline}
                onChange={(e) => setFilters({ ...filters, showOnlyOnline: e.target.checked })}
                className="w-4 h-4 rounded-md accent-rose-500"
              />
            </label>
          </div>
        </div>

        {/* Card 3: Rango de edad */}
        <div className="p-5 rounded-3xl bg-[#0c1322] border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.filtersScreen.ageTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.filtersScreen.ageSubtitle}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-bold text-xs">
              {filters.minAge} - {filters.maxAge} {t.filtersScreen.years}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-[#111927] border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">
                {t.filtersScreen.minAgeLabel}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white tabular-nums">{filters.minAge}</span>
                <span className="text-xs text-slate-400">{t.filtersScreen.years}</span>
              </div>
              <input
                type="range"
                min="18"
                max={filters.maxAge - 1}
                value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: parseInt(e.target.value) })}
                className="w-full mt-2 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#111927] border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">
                {t.filtersScreen.maxAgeLabel}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white tabular-nums">{filters.maxAge}</span>
                <span className="text-xs text-slate-400">{t.filtersScreen.years}</span>
              </div>
              <input
                type="range"
                min={filters.minAge + 1}
                max="65"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: parseInt(e.target.value) })}
                className="w-full mt-2 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Card 3b: Intenciones (Algo serio, Charlas, Amistad, Compartir momentos, Casual) */}
        <div className="p-5 rounded-3xl bg-[#0c1322] border border-slate-800/90 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 text-rose-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.filtersScreen.intentionsTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.filtersScreen.intentionsSubtitle}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-400">
              {filters.intentions.length}/5
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {INTENTION_OPTIONS.map(({ key, emoji }) => {
              const isSelected = filters.intentions.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleIntention(key)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-900/30'
                      : 'bg-[#111927] border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{t.intentions[key]}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 4: Preferencias físicas */}
        <div className="p-5 rounded-3xl bg-[#0c1322] border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-950/80 text-sky-400 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {t.filtersScreen.physicalTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.filtersScreen.physicalSubtitle}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-400">
              {(filters.minHeightCm / 100).toFixed(2)} m
            </span>
          </div>

          {/* Height Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t.filtersScreen.minHeightLabel}</span>
              <span className="text-sky-300 font-bold">{(filters.minHeightCm / 100).toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="150"
              max="205"
              value={filters.minHeightCm}
              onChange={(e) => setFilters({ ...filters, minHeightCm: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>1.50 m</span>
              <span>1.75 m</span>
              <span>2.05 m</span>
            </div>
          </div>

          {/* Body types grid */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              {t.filtersScreen.bodyTypeLabel}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'athletic' as BodyType, label: t.filtersScreen.bodyAthletic },
                { type: 'average' as BodyType, label: t.filtersScreen.bodyAverage },
                { type: 'slim' as BodyType, label: t.filtersScreen.bodySlim },
                { type: 'curvy' as BodyType, label: t.filtersScreen.bodyCurvy },
              ].map(({ type, label }) => {
                const isSelected = filters.bodyTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleBodyType(type)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-900/40'
                        : 'bg-[#111927] border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 5: Mis intereses */}
        <div className="p-5 rounded-3xl bg-[#0c1322] border border-slate-800/90 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-950/80 text-pink-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.filtersScreen.interestsTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.filtersScreen.interestsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableInterests.map(({ label, icon }) => {
              const isSelected = filters.interests.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleInterest(label)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-900/30'
                      : 'bg-[#111927] border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 6: Intercambio de fotos en vivo */}
        <div className="p-5 rounded-3xl bg-[#0c1322] border border-slate-800/90 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t.filtersScreen.livePhotoTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.filtersScreen.livePhotoSubtitle}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-[#111927] border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-white">
                  {t.filtersScreen.instantPhotosToggle}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.filtersScreen.instantPhotosDesc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={filters.instantPhotosOnly}
                onChange={(e) => setFilters({ ...filters, instantPhotosOnly: e.target.checked })}
                className="w-4 h-4 mt-1 rounded-md accent-sky-400"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Save Button matching stitch screenshot 3 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#070b14] via-[#070b14]/95 to-transparent z-40">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/40 active:scale-[0.98] transition-all"
          >
            <Radar className="w-5 h-5" />
            <span>{t.filtersScreen.saveAndActivate} (14 {t.filtersScreen.nearbyMatchesCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
