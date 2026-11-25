'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Music, Zap, Mountain, Disc } from 'lucide-react';
import { useAudioAtmosphere, SoundscapeType } from '@/context/AudioAtmosphereContext';
import { useLanguage } from '@/context/LanguageContext';

export const AmbientSoundController: React.FC = () => {
  const {
    isMuted,
    toggleMute,
    volume,
    setVolume,
    isPlaying,
    activeSoundscape,
    setActiveSoundscape,
    playSacredChime,
  } = useAudioAtmosphere();

  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const soundscapes: { id: SoundscapeType; labelEn: string; labelSi: string; icon: React.ReactNode; descEn: string }[] = [
    {
      id: 'celestial-mountain',
      labelEn: 'Mountain Winds',
      labelSi: 'සීගිරි ආකාශ සුළං',
      icon: <Mountain className="w-3.5 h-3.5 text-amber-400" />,
      descEn: 'Deep mountain winds & celestial sacred drones',
    },
    {
      id: 'ancient-veena',
      labelEn: 'Ravana Veena',
      labelSi: 'රාවණා වීණා නාදය',
      icon: <Disc className="w-3.5 h-3.5 text-amber-400" />,
      descEn: 'Harmonic acoustic drone & temple bells',
    },
    {
      id: 'battle-storm',
      labelEn: 'Battle Storm',
      labelSi: 'සටන් කුණාටුව',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      descEn: 'Stormy skies, low thunder & battle winds',
    },
  ];

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Main Trigger Button in Navbar */}
      <div className="flex items-center">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Play Royal Ambient Soundscape' : 'Mute Soundscape'}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-serif transition-all duration-300 shadow-sm ${
            !isMuted
              ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 border-amber-500/50 text-amber-300 shadow-gold-glow'
              : 'bg-slate-900/90 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-amber-500/30'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          ) : (
            <div className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
              {/* Equalizer Wave Animation */}
              <div className="flex items-end gap-[2px] h-3.5 w-3.5">
                <span className="w-[2px] bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-full" />
                <span className="w-[2px] bg-amber-300 rounded-full animate-[bounce_0.8s_infinite_300ms] h-2/3" />
                <span className="w-[2px] bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_200ms] h-4/5" />
                <span className="w-[2px] bg-amber-200 rounded-full animate-[bounce_0.8s_infinite_400ms] h-1/2" />
              </div>
            </div>
          )}

          <span className="hidden sm:inline-block font-semibold tracking-wide">
            {isMuted
              ? language === 'si'
                ? 'හඬ: නිහඬයි'
                : 'Audio: OFF'
              : language === 'si'
              ? 'වාතාවරණය'
              : 'Soundscape'}
          </span>
        </button>

        {/* Dropdown Options Gear Trigger */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`p-1.5 ml-0.5 rounded-lg border text-slate-400 hover:text-amber-300 transition-colors ${
            isOpen
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'border-transparent hover:border-slate-700'
          }`}
          title="Soundscape Settings & Theme"
        >
          <Sliders className="w-3 h-3" />
        </button>
      </div>

      {/* Floating Soundscape Settings Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] rounded-2xl bg-slate-950/95 border border-amber-500/40 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl z-50 space-y-3.5 sm:space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <h4 className="font-serif text-xs sm:text-sm font-bold text-slate-100">
                {language === 'si' ? 'රාජකීය වාතාවරණ ශ්‍රව්‍යය' : 'Royal Ambient Soundscape'}
              </h4>
            </div>
            <button
              onClick={() => playSacredChime(1.0)}
              className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              title="Test chime sound"
            >
              🔔 Test Bell
            </button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
              <span>{language === 'si' ? 'ශබ්ද මට්ටම (Volume)' : 'Volume'}</span>
              <span className="font-mono text-amber-400">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Soundscape Atmosphere Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-slate-400 block font-serif">
              {language === 'si' ? 'වාතාවරණ තේමාව (Soundscape Theme)' : 'Atmosphere Theme'}
            </label>
            <div className="space-y-1.5">
              {soundscapes.map((sc) => {
                const isSelected = activeSoundscape === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveSoundscape(sc.id);
                      if (isMuted) toggleMute();
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-slate-800/80">{sc.icon}</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {language === 'si' ? sc.labelSi : sc.labelEn}
                        </div>
                        <div className="text-[10px] text-slate-400 font-light">{sc.descEn}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-gold-glow flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info footnote */}
          <p className="text-[10px] text-slate-500 leading-tight border-t border-slate-800/80 pt-2 font-light">
            ⚡ {language === 'si' 
              ? 'කතාන්දර ශ්‍රවණය කරන විට (Audio Guide) මෙම නාදය ස්වයංක්‍රීයව අඩුවේ.' 
              : 'Ambient volume automatically ducks when the Audio Guide narration plays.'}
          </p>
        </div>
      )}
    </div>
  );
};
