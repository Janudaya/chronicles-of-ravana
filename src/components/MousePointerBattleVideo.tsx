'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAudioAtmosphere } from '@/context/AudioAtmosphereContext';
import { Zap } from 'lucide-react';

interface MousePointerBattleVideoProps {
  className?: string;
}

export const MousePointerBattleVideo: React.FC<MousePointerBattleVideoProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { playThunderRumble } = useAudioAtmosphere();
  const playThunderRef = useRef(playThunderRumble);
  playThunderRef.current = playThunderRumble;

  // Scrubbing state
  const targetProgressRef = useRef<number>(0.2);
  const currentProgressRef = useRef<number>(0.2);
  const isSeekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);
  const isPointerInsideRef = useRef<boolean>(false);
  const isTouchDeviceRef = useRef<boolean>(false);

  const [sliderProgress, setSliderProgress] = useState<number>(20);

  // Hardware-optimized seek function (fastSeek on Safari/iOS, safe seek on Android/Desktop)
  const applyVideoSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (video.seeking) {
      pendingTimeRef.current = time;
      return;
    }

    try {
      if ('fastSeek' in video && typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === 'function') {
        (video as unknown as { fastSeek: (t: number) => void }).fastSeek(time);
      } else {
        video.currentTime = time;
      }
    } catch {
      video.currentTime = time;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    // Detect touch device
    isTouchDeviceRef.current =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const onSeeking = () => {
      isSeekingRef.current = true;
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
      if (pendingTimeRef.current !== null) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        applyVideoSeek(nextTime);
      }
    };

    video.addEventListener('seeking', onSeeking);
    video.addEventListener('seeked', onSeeked);

    // 1. Desktop Mouse Move Tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const topBound = rect.top - 80;
      const bottomBound = rect.bottom + 80;
      const totalHeight = bottomBound - topBound;

      if (e.clientY >= topBound && e.clientY <= bottomBound && totalHeight > 0) {
        isPointerInsideRef.current = true;
        const ratio = (e.clientY - topBound) / totalHeight;
        targetProgressRef.current = Math.max(0, Math.min(1, ratio));
      } else {
        isPointerInsideRef.current = false;
      }
    };

    // 2. Mobile & Window Scroll-Driven Auto Scrubbing
    // As the user scrolls naturally down the page on mobile, the battle scrubs automatically!
    const handleScroll = () => {
      if (!containerRef.current) return;
      // If user is actively hovering on desktop, let mouse control it
      if (!isTouchDeviceRef.current && isPointerInsideRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Range: from 85% into viewport (entering) to 15% from top (exiting)
      const startY = vh * 0.85;
      const endY = vh * 0.15;
      const totalDist = startY - endY;

      if (rect.top <= startY && rect.bottom >= endY && totalDist > 0) {
        const ratio = (startY - rect.top) / totalDist;
        targetProgressRef.current = Math.max(0, Math.min(1, ratio));
      }
    };

    // 3. Touch Drag Tracking across the section
    let touchStartY = 0;
    let initialTouchProgress = 0.2;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        initialTouchProgress = currentProgressRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && containerRef.current) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - touchStartY;
        // Dragging down progresses, dragging up rewinds
        const deltaRatio = deltaY / (window.innerHeight * 0.45);
        const newProgress = Math.max(0, Math.min(1, initialTouchProgress + deltaRatio));
        targetProgressRef.current = newProgress;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('touchstart', handleTouchStart, { passive: true });
      containerEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // Smooth RequestAnimationFrame loop with Adaptive Lerp
    let animFrameId: number;
    let lastReportedProgress = 0.2;

    const scrubLoop = () => {
      if (video && video.duration && video.readyState >= 1) {
        // Smooth lerp factor (0.12 provides silky-smooth fluid motion without overshoot)
        currentProgressRef.current +=
          (targetProgressRef.current - currentProgressRef.current) * 0.12;

        const targetTime = currentProgressRef.current * video.duration;
        const diff = Math.abs(video.currentTime - targetTime);

        // Sound FX trigger on high velocity scrub
        const deltaProgress = Math.abs(targetProgressRef.current - currentProgressRef.current);
        if (deltaProgress > 0.03) {
          playThunderRef.current(Math.min(1.4, deltaProgress * 7));
        }

        // Only seek if difference exceeds threshold to avoid decoding thrash on mobile
        if (diff > 0.035) {
          applyVideoSeek(targetTime);
        }

        // Update slider UI throttled
        if (Math.abs(currentProgressRef.current - lastReportedProgress) > 0.02) {
          lastReportedProgress = currentProgressRef.current;
          setSliderProgress(Math.round(currentProgressRef.current * 100));
        }
      }
      animFrameId = requestAnimationFrame(scrubLoop);
    };

    animFrameId = requestAnimationFrame(scrubLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (containerEl) {
        containerEl.removeEventListener('touchstart', handleTouchStart);
        containerEl.removeEventListener('touchmove', handleTouchMove);
      }
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('seeked', onSeeked);
      cancelAnimationFrame(animFrameId);
    };
  }, [applyVideoSeek]);

  // Handle direct manual timeline slider scrub (Mobile & Desktop friendly)
  const handleManualSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) / 100;
    targetProgressRef.current = val;
    currentProgressRef.current = val;
    setSliderProgress(Math.round(val * 100));

    if (videoRef.current && videoRef.current.duration) {
      applyVideoSeek(val * videoRef.current.duration);
      playThunderRef.current(0.9);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Hardware-accelerated Video Element */}
      <video
        ref={videoRef}
        src="/videos/king-ravana-blasts-indra.mp4"
        playsInline
        muted
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="w-full h-full object-cover object-[center_35%] filter brightness-95 contrast-110 saturate-105 pointer-events-none"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* Cinematic Gradient Overlays for seamless blending */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/65 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      {/* Interactive Mobile & Desktop Scrubber Bar at the bottom */}
      <div className="absolute bottom-3 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-amber-300 font-bold tracking-wider bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-md shadow-md flex-shrink-0">
          <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>⚡ BATTLE SCRUBBER: {sliderProgress}%</span>
        </div>

        {/* Draggable Progress Slider */}
        <div className="flex-1 max-w-xs sm:max-w-md flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderProgress}
            onChange={handleManualSlider}
            className="w-full h-1.5 bg-slate-800/90 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-slate-700/60 shadow-inner"
            title="Drag slider to scrub lightning strike"
          />
        </div>
      </div>
    </div>
  );
};
