'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type SoundscapeType = 'celestial-mountain' | 'ancient-veena' | 'battle-storm';

interface AudioAtmosphereContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isPlaying: boolean;
  isAudioGuideSpeaking: boolean;
  setIsAudioGuideSpeaking: (speaking: boolean) => void;
  playSacredChime: (pitchFactor?: number) => void;
  playThunderRumble: (intensity?: number) => void;
  playVimanaWhoosh: () => void;
  activeSoundscape: SoundscapeType;
  setActiveSoundscape: (type: SoundscapeType) => void;
}

const AudioAtmosphereContext = createContext<AudioAtmosphereContextType | undefined>(undefined);

const AUDIO_STORAGE_KEY = 'ravana_audio_atmosphere_muted_v1';
const VOLUME_STORAGE_KEY = 'ravana_audio_atmosphere_volume_v1';

export const AudioAtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true); // Default muted to comply with browser autoplay policies
  const [volume, setVolumeState] = useState<number>(0.4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioGuideSpeaking, setIsAudioGuideSpeaking] = useState<boolean>(false);
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('celestial-mountain');

  // Web Audio API refs
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);

  // Active sound generator nodes
  const windSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);
  const droneNodesRef = useRef<OscillatorNode[]>([]);
  const periodicTimerRef = useRef<number | null>(null);

  // Initialize Audio Context on demand
  const getOrCreateContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    if (!ctxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;

      const ctx = new AudioCtxClass();
      ctxRef.current = ctx;

      // Master Gain
      const master = ctx.createGain();
      master.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Ambient Sub-Gain
      const ambGain = ctx.createGain();
      ambGain.gain.setValueAtTime(0.7, ctx.currentTime);
      ambGain.connect(master);
      ambientGainRef.current = ambGain;

      // SFX Sub-Gain
      const sfxGain = ctx.createGain();
      sfxGain.gain.setValueAtTime(0.85, ctx.currentTime);
      sfxGain.connect(master);
      sfxGainRef.current = sfxGain;
    }

    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }

    return ctxRef.current;
  }, [isMuted, volume]);

  // Generate pink/brownian noise buffer for mountain winds
  const createMountainWindBuffer = (ctx: AudioContext, seconds: number = 8): AudioBuffer => {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian filtered integration with leak
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  };

  // Start procedural ambient soundscape
  const startSoundscape = useCallback((type: SoundscapeType) => {
    const ctx = getOrCreateContext();
    if (!ctx || !ambientGainRef.current) return;

    // Stop current generators if running
    stopSoundscape();

    try {
      // 1. Mountain Winds (Pink/Brown noise passed through swept resonant filter)
      const windBuffer = createMountainWindBuffer(ctx, 6);
      const windSource = ctx.createBufferSource();
      windSource.buffer = windBuffer;
      windSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(420, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(type === 'battle-storm' ? 0.45 : 0.28, ctx.currentTime);

      // Low frequency oscillator (LFO) to modulate wind gusts naturally
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 1 gust every ~8 seconds
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(180, ctx.currentTime); // sweep filter +-180Hz

      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ambientGainRef.current);

      windSource.start();
      windSourceRef.current = windSource;
      windFilterRef.current = windFilter;

      // 2. Harmonic Resonant Drone (Deep ancient D/A root chords)
      // D1 (36.7Hz), A1 (55Hz), D2 (73.4Hz), A2 (110Hz), F#2 (92.5Hz - peaceful or battle minor F2 87.3Hz)
      const droneFreqs = type === 'battle-storm'
        ? [36.7, 55.0, 73.4, 87.31, 130.81] // Dark mystical minor chord
        : type === 'ancient-veena'
        ? [55.0, 110.0, 164.8, 220.0, 329.6] // Acoustic harmonic chord
        : [55.0, 73.4, 110.0, 146.8, 220.0]; // Open mountain drone

      const oscs: OscillatorNode[] = [];

      droneFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slight detune for rich choral chorus effect
        osc.detune.setValueAtTime((idx - 2) * 4.5, ctx.currentTime);

        const oscGain = ctx.createGain();
        // Lower frequencies have more presence, higher are ethereal whisper
        const baseAmp = 0.08 / (idx + 1);
        oscGain.gain.setValueAtTime(baseAmp, ctx.currentTime);

        const oscFilter = ctx.createBiquadFilter();
        oscFilter.type = 'lowpass';
        oscFilter.frequency.setValueAtTime(type === 'battle-storm' ? 380 : 300, ctx.currentTime);

        osc.connect(oscFilter);
        oscFilter.connect(oscGain);
        oscGain.connect(ambientGainRef.current!);

        osc.start();
        oscs.push(osc);
      });

      droneNodesRef.current = oscs;
      setIsPlaying(true);

      // 3. Periodic Sacred Bell / Sing Bowl shimmer (every 14-20 seconds)
      const triggerPeriodicChime = () => {
        if (!isMuted && isPlaying) {
          playSacredChime(1.0);
        }
        periodicTimerRef.current = window.setTimeout(triggerPeriodicChime, 14000 + Math.random() * 8000);
      };
      periodicTimerRef.current = window.setTimeout(triggerPeriodicChime, 9000);

    } catch (err) {
      console.warn('Could not start ambient soundscape:', err);
    }
  }, [getOrCreateContext, isMuted, isPlaying]);

  // Stop procedural ambient soundscape
  const stopSoundscape = useCallback(() => {
    if (windSourceRef.current) {
      try {
        windSourceRef.current.stop();
        windSourceRef.current.disconnect();
      } catch {}
      windSourceRef.current = null;
    }

    droneNodesRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    droneNodesRef.current = [];

    if (periodicTimerRef.current) {
      clearTimeout(periodicTimerRef.current);
      periodicTimerRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  // Sacred Temple Bell / Singing Bowl Chime SFX
  const playSacredChime = useCallback((pitchFactor: number = 1.0) => {
    const ctx = getOrCreateContext();
    if (!ctx || !sfxGainRef.current) return;

    try {
      const now = ctx.currentTime;
      // High-purity overtone frequencies (Harmonic series like singing bowls)
      const baseFreq = 528 * pitchFactor; // 528 Hz (Ancient Solfeggio / Miracle frequency)
      const overtones = [baseFreq, baseFreq * 1.5, baseFreq * 2.05, baseFreq * 2.76];

      overtones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const gain = ctx.createGain();
        const amp = 0.08 / (idx * 0.9 + 1);
        gain.gain.setValueAtTime(amp, now);
        // Exponential decay over 4.5 seconds
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2 - idx * 0.4);

        osc.connect(gain);
        gain.connect(sfxGainRef.current!);

        osc.start(now);
        osc.stop(now + 4.5);
      });
    } catch {}
  }, [getOrCreateContext]);

  // Battle Thunder Rumble & Lightning Crack SFX (triggered on battle scrubbing)
  const lastThunderTime = useRef<number>(0);
  const playThunderRumble = useCallback((intensity: number = 1.0) => {
    const ctx = getOrCreateContext();
    if (!ctx || !sfxGainRef.current) return;

    const now = Date.now();
    // Throttle thunder triggers to avoid harsh clipping
    if (now - lastThunderTime.current < 280) return;
    lastThunderTime.current = now;

    try {
      const audioTime = ctx.currentTime;

      // 1. Low sub-rumble oscillator (38Hz -> 28Hz pitch bend)
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(50 * Math.max(0.7, intensity), audioTime);
      subOsc.frequency.exponentialRampToValueAtTime(26, audioTime + 1.2);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.25 * intensity, audioTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, audioTime + 1.4);

      subOsc.connect(subGain);
      subGain.connect(sfxGainRef.current);

      subOsc.start(audioTime);
      subOsc.stop(audioTime + 1.5);

      // 2. Crackling celestial energy noise burst
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(280, audioTime);
      noiseFilter.Q.setValueAtTime(2.2, audioTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18 * intensity, audioTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, audioTime + 0.8);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(sfxGainRef.current);

      noiseSource.start(audioTime);
      noiseSource.stop(audioTime + 0.85);

    } catch {}
  }, [getOrCreateContext]);

  // Vimana Whoosh SFX (triggered on flight transitions)
  const playVimanaWhoosh = useCallback(() => {
    const ctx = getOrCreateContext();
    if (!ctx || !sfxGainRef.current) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(90, now + 1.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(sfxGainRef.current);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch {}
  }, [getOrCreateContext]);

  // Master Volume adjustments
  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
    } catch {}

    if (masterGainRef.current && ctxRef.current) {
      if (!isMuted) {
        masterGainRef.current.gain.setTargetAtTime(clamped, ctxRef.current.currentTime, 0.05);
      }
    }
  }, [isMuted]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    const willBeMuted = !isMuted;
    setIsMuted(willBeMuted);
    try {
      localStorage.setItem(AUDIO_STORAGE_KEY, willBeMuted ? 'true' : 'false');
    } catch {}

    const ctx = getOrCreateContext();
    if (!ctx || !masterGainRef.current) return;

    if (willBeMuted) {
      masterGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      stopSoundscape();
    } else {
      masterGainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.08);
      startSoundscape(activeSoundscape);
      // Play a gentle welcome chime when unmuted
      setTimeout(() => playSacredChime(1.0), 150);
    }
  }, [isMuted, volume, getOrCreateContext, stopSoundscape, startSoundscape, activeSoundscape, playSacredChime]);

  // Duck ambient volume when Audio Guide speaks
  useEffect(() => {
    if (!ambientGainRef.current || !ctxRef.current) return;
    const now = ctxRef.current.currentTime;
    if (isAudioGuideSpeaking) {
      // Gently reduce ambient to 15% so spoken voice is clear
      ambientGainRef.current.gain.setTargetAtTime(0.12, now, 0.4);
    } else {
      // Restore ambient sound to full 70%
      ambientGainRef.current.gain.setTargetAtTime(0.7, now, 0.6);
    }
  }, [isAudioGuideSpeaking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSoundscape();
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, [stopSoundscape]);

  return (
    <AudioAtmosphereContext.Provider
      value={{
        isMuted,
        toggleMute,
        volume,
        setVolume,
        isPlaying,
        isAudioGuideSpeaking,
        setIsAudioGuideSpeaking,
        playSacredChime,
        playThunderRumble,
        playVimanaWhoosh,
        activeSoundscape,
        setActiveSoundscape: (type) => {
          setActiveSoundscape(type);
          if (!isMuted) {
            startSoundscape(type);
          }
        },
      }}
    >
      {children}
    </AudioAtmosphereContext.Provider>
  );
};

export const useAudioAtmosphere = () => {
  const context = useContext(AudioAtmosphereContext);
  if (!context) {
    throw new Error('useAudioAtmosphere must be used within an AudioAtmosphereProvider');
  }
  return context;
};
