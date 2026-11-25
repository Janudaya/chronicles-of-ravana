'use client';

import React from 'react';
import { Crown, Compass, MapPin, Globe, Sparkles, Map } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/types/language';
import { AmbientSoundController } from './AmbientSoundController';
import { RavanaImperialLogo } from './RavanaImperialLogo';

export type ChapterFilter = 'All' | 'Birth & Rise' | 'Sovereignty & Science' | 'The Great Conflict' | 'Final Resting';

interface NavbarProps {
  currentView: 'overview' | 'map';
  onSwitchView: (view: 'overview' | 'map') => void;
  activeChapter: ChapterFilter;
  onSelectChapter: (chapter: ChapterFilter) => void;
  myTrailCount: number;
  onOpenTrailDrawer: () => void;
  onResetView: () => void;
  isTrailOnlyMode: boolean;
  onToggleTrailOnlyMode: () => void;
}

const chapters: ChapterFilter[] = [
  'All',
  'Birth & Rise',
  'Sovereignty & Science',
  'The Great Conflict',
  'Final Resting',
];

const languages: { code: Language; label: string; title: string }[] = [
  { code: 'en', label: 'EN', title: 'English' },
  { code: 'si', label: 'සිං', title: 'සිංහල (Sinhala)' },
  { code: 'hi', label: 'हिं', title: 'हिन्दी (Hindi)' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  activeChapter,
  onSelectChapter,
  myTrailCount,
  onOpenTrailDrawer,
  onResetView,
  isTrailOnlyMode,
  onToggleTrailOnlyMode,
}) => {
  const { language, setLanguage, t, getChapterName } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-nav px-3 sm:px-4 lg:px-6 py-2.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Brand Logo: Clicking returns to Overview Home */}
        <div 
          onClick={() => {
            onSwitchView('overview');
            onResetView();
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
        >
          <div className="flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400/40 via-amber-600/20 to-amber-900/40 p-0.5 sm:p-1 border border-amber-500/40 shadow-gold-glow group-hover:shadow-gold-glow-lg group-hover:border-amber-400 transition-all duration-300 flex-shrink-0">
            <RavanaImperialLogo size={26} className="sm:hidden" />
            <RavanaImperialLogo size={36} className="hidden sm:inline-flex" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif tracking-widest text-sm xs:text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent truncate">
                {t.brandTitle}
              </h1>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden md:inline-block">
                {t.brandTag}
              </span>
              <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 hidden lg:inline-flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                <span className="font-serif">
                  {language === 'si' ? 'නිර්මාණය:' : 'by'}{' '}
                  <strong className="font-bold text-amber-200">Janudaya</strong>
                </span>
              </span>
            </div>
            <p className="text-[10px] lg:text-xs text-slate-400 tracking-wide font-light hidden sm:block truncate">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Overview vs Interactive Map) & Chapter Pills */}
        <div className="hidden md:flex items-center gap-2">
          {/* View Mode Toggle Pill */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-full border border-amber-500/30">
            <button
              onClick={() => onSwitchView('overview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentView === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.navModeOverview}</span>
            </button>

            <button
              onClick={() => onSwitchView('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentView === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{t.navModeMap}</span>
            </button>
          </div>

          {/* Chapter Quick-Filter Pills (shown on Map View or Desktop) */}
          {currentView === 'map' && (
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-amber-500/20 backdrop-blur-md overflow-x-auto max-w-[380px] lg:max-w-[420px]">
              {chapters.map((chap) => {
                const isActive = activeChapter === chap && !isTrailOnlyMode;
                const label = getChapterName(chap);
                return (
                  <button
                    key={chap}
                    onClick={() => onSelectChapter(chap)}
                    className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-gold-glow'
                        : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Mobile View Switcher */}
          <div className="flex md:hidden items-center bg-slate-900/90 p-0.5 rounded-lg border border-amber-500/30">
            <button
              onClick={() => onSwitchView('overview')}
              className={`px-1.5 xs:px-2 py-0.5 xs:py-1 text-[10px] xs:text-[11px] font-bold rounded transition-all ${
                currentView === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              {t.navModeOverview}
            </button>
            <button
              onClick={() => onSwitchView('map')}
              className={`px-1.5 xs:px-2 py-0.5 xs:py-1 text-[10px] xs:text-[11px] font-bold rounded transition-all ${
                currentView === 'map' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              {t.navModeMap}
            </button>
          </div>

          {/* Language Switcher (EN | සිං | हिं) */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg sm:rounded-xl border border-amber-500/30 shadow-inner">
            <div className="hidden xl:flex items-center pl-1.5 pr-1 text-amber-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  title={item.title}
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Ambient Soundscape Controller */}
          <AmbientSoundController />

          {/* Trail Only Mode Indicator */}
          {isTrailOnlyMode && currentView === 'map' && (
            <button
              onClick={onToggleTrailOnlyMode}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors"
              title={t.showingMyTrail}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.showingMyTrail}</span>
            </button>
          )}

          {/* Reset Overview Button */}
          {currentView === 'map' && (
            <button
              onClick={onResetView}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg border border-slate-700/50 transition-colors hidden sm:flex items-center justify-center"
              title={t.fitSriLanka}
            >
              <Compass className="w-4 h-4" />
            </button>
          )}

          {/* My Trail Drawer Button */}
          <button
            onClick={onOpenTrailDrawer}
            className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 transition-all shadow-sm group flex-shrink-0"
            title={t.myTrailBtn}
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap hidden sm:inline">{t.myTrailBtn}</span>
            <span className="flex items-center justify-center min-w-[17px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-1.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-amber-400 text-slate-950 shadow-inner">
              {myTrailCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Chapter Scroll Bar when in Map view */}
      {currentView === 'map' && (
        <div className="flex md:hidden items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
          {chapters.map((chap) => {
            const isActive = activeChapter === chap && !isTrailOnlyMode;
            const label = getChapterName(chap);
            return (
              <button
                key={chap}
                onClick={() => onSelectChapter(chap)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-gold-glow'
                    : 'text-slate-300 bg-slate-900/90 border border-slate-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
