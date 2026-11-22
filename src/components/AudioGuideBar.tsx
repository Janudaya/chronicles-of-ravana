'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Gauge,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { RavanaLocation } from '@/data/ravanaLocations';
import { useLanguage } from '@/context/LanguageContext';
import { useAudioAtmosphere } from '@/context/AudioAtmosphereContext';

interface AudioGuideBarProps {
  activeLocation: RavanaLocation | null;
  allLocations: RavanaLocation[];
  onSelectLocation: (location: RavanaLocation) => void;
}

const SPEED_OPTIONS = [0.8, 1.0, 1.2, 1.5];

export const AudioGuideBar: React.FC<AudioGuideBarProps> = ({
  activeLocation,
  allLocations,
  onSelectLocation,
}) => {
  const { language, t, getLocationContent } = useLanguage();
  const { setIsAudioGuideSpeaking } = useAudioAtmosphere();

  // If no location is explicitly active, default to the first location (Laggala)
  const currentLoc = activeLocation || allLocations[0];
  const content = currentLoc ? getLocationContent(currentLoc.id) : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [supported, setSupported] = useState(true);

  // Keep a reference to the active utterance
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('speechSynthesis' in window)) {
        setSupported(false);
      }
    }
  }, []);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAudioGuideSpeaking(false);
    };
  }, [setIsAudioGuideSpeaking]);

  // When activeLocation or language changes, stop previous narration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setIsAudioGuideSpeaking(false);
    }
  }, [currentLoc?.id, language, setIsAudioGuideSpeaking]);

  // Construct text to narrate based on active location and language
  const getNarrationText = useCallback(() => {
    if (!currentLoc || !content) return '';
    const parts = [
      content.title,
      content.subTitle ? `${content.subTitle}.` : '',
      content.story,
    ];
    return parts.filter(Boolean).join(' ');
  }, [currentLoc, content]);

  // Find suitable voice for the selected language
  const getVoiceForLanguage = useCallback((langCode: string): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (langCode === 'hi') {
      return voices.find((v) => v.lang.startsWith('hi')) || null;
    }
    if (langCode === 'si') {
      return (
        voices.find((v) => v.lang.startsWith('si')) ||
        voices.find((v) => v.lang.includes('sinhala')) ||
        null
      );
    }
    // Default to English
    return (
      voices.find((v) => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null
    );
  }, []);

  // Start or resume narration
  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !currentLoc) return;

    const synth = window.speechSynthesis;

    // If currently paused, resume playback
    if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    // Cancel any previous utterances
    synth.cancel();

    const textToSpeak = getNarrationText();
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackSpeed;

    // Set voice & language
    const langMap: Record<string, string> = {
      en: 'en-US',
      si: 'si-LK',
      hi: 'hi-IN',
    };
    utterance.lang = langMap[language] || 'en-US';

    const chosenVoice = getVoiceForLanguage(language);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setIsAudioGuideSpeaking(true);
    };

    utterance.onpause = () => {
      setIsPaused(true);
      setIsAudioGuideSpeaking(false);
    };

    utterance.onresume = () => {
      setIsPaused(false);
      setIsAudioGuideSpeaking(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setIsAudioGuideSpeaking(false);
    };

    utterance.onerror = (e) => {
      // Ignore user-cancelled abort errors
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        setIsPlaying(false);
        setIsPaused(false);
      }
      setIsAudioGuideSpeaking(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  // Pause narration
  const handlePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsAudioGuideSpeaking(false);
  };

  // Stop / Reset narration
  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsAudioGuideSpeaking(false);
  };

  // Cycle speed (0.8x -> 1.0x -> 1.2x -> 1.5x)
  const handleCycleSpeed = () => {
    const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[nextIndex];
    setPlaybackSpeed(nextSpeed);

    // If currently playing, restart with new speed
    if (isPlaying && !isPaused) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        handlePlay();
      }, 50);
    }
  };

  if (!supported) return null;

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 w-[94%] max-w-xl ${
        isMinimized ? 'opacity-90 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* Minimized Pill View */}
      {isMinimized ? (
        <div
          onClick={() => setIsMinimized(false)}
          className="mx-auto flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-slate-950/90 border border-amber-500/40 shadow-gold-glow backdrop-blur-xl cursor-pointer group hover:border-amber-400 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif text-xs font-bold text-amber-300 tracking-wide">
              {t.audioGuide}
            </span>
            {content && (
              <span className="text-[11px] text-slate-300 font-medium truncate max-w-[150px] sm:max-w-[220px]">
                &bull; #{currentLoc.order} {content.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isPlaying && !isPaused && (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
                <span className="w-0.5 h-2 bg-amber-400 animate-ping" />
                <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
              </span>
            )}
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
          </div>
        </div>
      ) : (
        /* Full Expanded Mini Audio Bar */
        <div className="relative p-3 sm:p-3.5 rounded-2xl bg-slate-950/95 border border-amber-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-2xl">
          {/* Subtle top golden accent bar */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          <div className="flex items-center justify-between gap-2.5 sm:gap-4">
            {/* Left: Location Indicator & Waveform */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              {/* Animated Headphone / Soundwave Disc */}
              <div
                onClick={isPlaying && !isPaused ? handlePause : handlePlay}
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex-shrink-0 cursor-pointer shadow-gold-glow hover:scale-105 transition-all group"
              >
                {isPlaying && !isPaused ? (
                  <div className="flex items-end justify-center gap-[2.5px] h-4">
                    <span className="w-[2.5px] h-4 bg-slate-950 rounded-full animate-bounce" />
                    <span
                      className="w-[2.5px] h-2.5 bg-slate-950 rounded-full animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-[2.5px] h-4 bg-slate-950 rounded-full animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                ) : (
                  <Headphones className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                )}
              </div>

              {/* Title & Status */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>{t.nowNarrating}</span>
                  {currentLoc && (
                    <span className="text-slate-400 font-mono">
                      (#{String(currentLoc.order).padStart(2, '0')})
                    </span>
                  )}
                </div>

                <div className="truncate">
                  <span className="font-serif text-xs sm:text-sm font-bold text-slate-100 mr-2">
                    {content?.title || t.selectSiteToListen}
                  </span>
                  <span className="text-[11px] text-amber-400/80 font-sans hidden sm:inline">
                    {content?.subTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Controls (Play/Pause, Stop, Speed, Minimize) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Speed Controller */}
              <button
                onClick={handleCycleSpeed}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-[11px] font-bold font-mono transition-colors"
                title={`${t.audioSpeed}: ${playbackSpeed}x`}
              >
                <Gauge className="w-3 h-3 text-amber-400 hidden sm:inline" />
                <span>{playbackSpeed}x</span>
              </button>

              {/* Stop / Replay Button */}
              {isPlaying && (
                <button
                  onClick={handleStop}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-850 border border-slate-800 transition-colors"
                  title={t.stopAudio}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Play / Pause Toggle Button */}
              <button
                onClick={isPlaying && !isPaused ? handlePause : handlePlay}
                className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-bold transition-all shadow-sm ${
                  isPlaying && !isPaused
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-gold-glow'
                }`}
                title={isPlaying && !isPaused ? t.pauseAudio : t.playAudio}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 translate-x-0.5" />
                )}
              </button>

              {/* Minimize Drawer Button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors ml-0.5"
                title="Minimize Audio Guide"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
