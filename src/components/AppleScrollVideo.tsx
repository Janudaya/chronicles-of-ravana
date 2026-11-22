'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Swords,
  Sparkles,
  Zap,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ChapterFilter } from './Navbar';

interface AppleScrollVideoProps {
  onExploreChapter?: (chapter: ChapterFilter) => void;
  onExploreLocation?: (id: string) => void;
}

export const AppleScrollVideo: React.FC<AppleScrollVideoProps> = ({
  onExploreChapter,
  onExploreLocation,
}) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'scrub' | 'playback'>('scrub');
  const [duration, setDuration] = useState(0);

  // Target time ref for smooth requestAnimationFrame lerp
  const targetTimeRef = useRef(0);
  const animFrameRef = useRef<number>();

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 5);
    }
  };

  // Scroll listener to scrub video
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Find nearest scrollable parent (.overflow-y-auto or window)
    const scrollParent = el.closest('.overflow-y-auto') || window;

    const handleScroll = () => {
      if (mode === 'playback') return; // Do not scrub if user clicked Play
      if (!containerRef.current || !videoRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight =
        scrollParent instanceof Window
          ? window.innerHeight
          : (scrollParent as HTMLElement).clientHeight;

      // Track how much of this section has passed through the viewport
      const startOffset = viewHeight * 0.8;
      const endOffset = -rect.height * 0.2;
      const totalRange = startOffset - endOffset;
      const currentPos = startOffset - rect.top;

      const rawProgress = currentPos / totalRange;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      setProgress(clamped);

      if (videoRef.current.duration) {
        targetTimeRef.current = clamped * videoRef.current.duration;
      }
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll);
    };
  }, [mode]);

  // Smooth lerp update for video currentTime during scrub mode
  useEffect(() => {
    let active = true;

    const updateVideoTime = () => {
      if (mode === 'scrub' && videoRef.current && videoRef.current.duration) {
        const current = videoRef.current.currentTime;
        const target = targetTimeRef.current;
        const diff = target - current;

        // Smooth interpolation
        if (Math.abs(diff) > 0.02) {
          videoRef.current.currentTime = current + diff * 0.25;
        }
      }

      if (active) {
        animFrameRef.current = requestAnimationFrame(updateVideoTime);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateVideoTime);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mode]);

  // Toggle Play / Pause mode
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setMode('scrub');
    } else {
      setMode('playback');
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Handle autoplay policy
      });
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Fullscreen video
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Reset video to start
  const handleReset = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    targetTimeRef.current = 0;
    setProgress(0);
  };

  return (
    <section ref={containerRef} className="relative w-full my-12 sm:my-16 select-none">
      {/* Dynamic Ambient Glow behind the video frame */}
      <div
        className="absolute -inset-4 sm:-inset-8 rounded-[40px] opacity-40 blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background:
            progress > 0.35 && progress < 0.75
              ? 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.45), rgba(251, 191, 36, 0.3), transparent 70%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.25), rgba(15, 23, 42, 0.8), transparent 70%)',
        }}
      />

      {/* Main Apple-Grade Cinematic Video Container */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950/90 shadow-2xl shadow-black/80 backdrop-blur-xl">
        {/* Top Header Strip */}
        <div className="relative z-20 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-gold-glow">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25">
                  CINEMATIC SCROLL REVEAL
                </span>
                <span className="hidden sm:inline text-[11px] font-mono text-slate-400">
                  • 1080p Ultra HD
                </span>
              </div>
              <h3 className="font-serif font-black text-sm sm:text-lg text-white tracking-wide">
                {language === 'si'
                  ? 'මහා රාවණ රජුගේ සූර්ය අස්ත්‍ර ප්‍රහාරය (King Ravana Blasts Lord Indra)'
                  : language === 'hi'
                  ? 'महाराज रावण का प्रचंड वज्र प्रहार (Ravana Blasts Indra)'
                  : 'King Ravana Blasts Lord Indra & The Celestial Forces'}
              </h3>
            </div>
          </div>

          {/* Mode Pill Indicator */}
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {mode === 'scrub' ? 'Scroll-Scrub Active' : 'Realtime Playback'}
            </span>
          </div>
        </div>

        {/* Video Screen Area */}
        <div className="relative w-full aspect-video sm:max-h-[640px] bg-black overflow-hidden flex items-center justify-center group">
          <video
            ref={videoRef}
            src="/videos/king-ravana-blasts-indra.mp4"
            playsInline
            muted={isMuted}
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              setMode('scrub');
            }}
            className="w-full h-full object-cover object-center pointer-events-auto"
          />

          {/* Cinematic Letterbox Gradient Overlays */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />

          {/* Quick Play/Pause Center Button on Hover */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950/75 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-950 flex items-center justify-center shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 hover:scale-105 z-20"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Floating Subtitle Caption Banner */}
          <div className="absolute bottom-4 inset-x-6 sm:inset-x-10 pointer-events-none z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-serif text-slate-200 drop-shadow-lg text-center sm:text-left bg-slate-950/70 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10">
              {language === 'si'
                ? '⚡ ලංකා අහස් ගැබ දෙදරුම් කවමින් සූර්ය ශක්තිය හා අකුණු අස්ත්‍ර මුදාහළ ඓතිහාසික සංග්‍රාමය'
                : language === 'hi'
                ? '⚡ लंका के आकाश में सौर ऊर्जा और विद्युत किरणों का महाविनाशक प्रहार'
                : '⚡ The clash of primordial celestial energies above the prehistoric skies of Lanka'}
            </p>

            {/* Scroll instruction indicator */}
            <span className="text-[11px] font-mono text-amber-400 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-md shadow-sm">
              {mode === 'scrub' ? '↕ Scroll to Scrub' : '▶ Video Playing'}
            </span>
          </div>
        </div>

        {/* Apple-Style Bottom Scrub Bar & Controls */}
        <div className="relative z-20 px-5 sm:px-8 py-3.5 bg-slate-950/85 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs shadow-gold-glow transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play 1080p'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          {/* Center: Video scrub scrubber bar */}
          <div className="flex-1 max-w-md mx-2 flex items-center gap-2">
            <div className="relative flex-1 h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-sky-400 rounded-full transition-all duration-75"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
              {Math.round(progress * 100)}%
            </span>
          </div>

          {/* Right: Fullscreen & Quick Map Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExploreChapter && onExploreChapter('The Great Conflict')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-amber-300 text-xs font-serif transition-colors"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>
                {language === 'si' ? 'Chapter 03 ස්ථාන' : 'Chapter 03 Sites'}
              </span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
