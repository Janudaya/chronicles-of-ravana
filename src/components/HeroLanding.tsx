'use client';

import React, { useState, useRef } from 'react';
import {
  Crown,
  Compass,
  MapPin,
  Plane,
  Headphones,
  Route,
  ChevronRight,
  Sparkles,
  Mountain,
  Sun,
  Shield,
  Moon,
  ArrowRight,
  Zap,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAudioAtmosphere } from '@/context/AudioAtmosphereContext';
import { ChapterFilter } from './Navbar';
import { MousePointerBattleVideo } from './MousePointerBattleVideo';
import { RavanaImperialLogo } from './RavanaImperialLogo';

interface HeroLandingProps {
  onBeginExpedition: () => void;
  onSelectChapterAndExplore: (chapter: ChapterFilter) => void;
  onOpenTrailDrawer: () => void;
  totalLocationsCount: number;
  onExploreSigiriya?: () => void;
  onOpenEmperorModal?: () => void;
}

interface ChapterPreview {
  key: ChapterFilter;
  titleKey: string;
  sitesSubtitle: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  badgeColor: string;
  bgImage: string;
  previewSites: string[];
}

interface TiltChapterCardProps {
  chap: ChapterPreview;
  idx: number;
  label: string;
  onSelect: () => void;
}

const TiltChapterCard: React.FC<TiltChapterCardProps> = ({ chap, idx, label, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.12s ease-out, box-shadow 0.3s ease',
      }}
      className={`relative min-h-[350px] rounded-2xl overflow-hidden border ${chap.borderColor} cursor-pointer shadow-xl hover:shadow-gold-glow-lg flex flex-col justify-between p-5 group select-none`}
    >
      {/* Real Background Image with 3D Depth */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        style={{ transform: 'translateZ(0px)' }}
      >
        <img
          src={chap.bgImage}
          alt={label}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-105"
        />
        {/* Multi-stage gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/45" />
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-colors duration-500" />
      </div>

      {/* Dynamic 3D Glare Sheen following cursor */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(251, 191, 36, ${glare.opacity}) 0%, transparent 60%)`,
        }}
      />

      {/* Top Content floating in 3D (translateZ 30px) */}
      <div 
        className="relative z-20 pointer-events-none"
        style={{ transform: 'translateZ(30px)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-amber-400 shadow-md">
            {chap.icon}
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-300">
            {chap.sitesSubtitle}
          </span>
        </div>

        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
          Chapter 0{idx + 1}
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-3 drop-shadow-md">
          {label}
        </h3>

        {/* Preview Sites list */}
        <div className="space-y-1.5 text-xs text-slate-200">
          {chap.previewSites.map((site, sIdx) => (
            <div key={sIdx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 shadow-sm" />
              <span className="truncate drop-shadow">{site}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Explore Button floating in 3D (translateZ 25px) */}
      <div 
        className="relative z-20 mt-6 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-amber-400 group-hover:text-amber-300 font-semibold pointer-events-none"
        style={{ transform: 'translateZ(25px)' }}
      >
        <span className="tracking-wide">Explore Chapter</span>
        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onBeginExpedition,
  onSelectChapterAndExplore,
  onOpenTrailDrawer,
  totalLocationsCount,
  onExploreSigiriya,
  onOpenEmperorModal,
}) => {
  const { t, language, getChapterName } = useLanguage();
  const { playSacredChime, playVimanaWhoosh } = useAudioAtmosphere();

  const chapters: ChapterPreview[] = [
    {
      key: 'Birth & Rise',
      titleKey: 'Birth & Rise',
      sitesSubtitle: 'Sites #01 & #02',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      bgGradient: 'from-amber-950/30 via-slate-900/80 to-slate-950',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      bgImage: '/images/koneswaram/koneswaram-cliff-temple-view.jpg',
      previewSites: ['Laggala (Knuckles)', 'Thirukoneswaram Cut'],
    },
    {
      key: 'Sovereignty & Science',
      titleKey: 'Sovereignty & Science',
      sitesSubtitle: 'Sites #03 to #05',
      icon: <Plane className="w-5 h-5 text-sky-400" />,
      bgGradient: 'from-sky-950/30 via-slate-900/80 to-slate-950',
      borderColor: 'border-sky-500/30 hover:border-sky-400',
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      bgImage: '/images/sigiriya/sigiriya-aerial-citadel.jpg',
      previewSites: ['Sigiriya Sky Citadel', 'Wariyapola Airfield', 'Ritigala Herb Garden'],
    },
    {
      key: 'The Great Conflict',
      titleKey: 'The Great Conflict',
      sitesSubtitle: 'Sites #06 to #11',
      icon: <Shield className="w-5 h-5 text-rose-400" />,
      bgGradient: 'from-rose-950/30 via-slate-900/80 to-slate-950',
      borderColor: 'border-rose-500/30 hover:border-rose-400',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      bgImage: '/images/ravana-falls/ravana-falls-wide-cascade.jpg',
      previewSites: ['Hakgala (Ashoka Vatika)', 'Ravana Falls & Cave', 'Nil Diya Pokuna', 'Rumassala & Ussangoda', 'Yudaganawa Battlefield'],
    },
    {
      key: 'Final Resting',
      titleKey: 'Final Resting',
      sitesSubtitle: 'Site #12',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      bgGradient: 'from-indigo-950/30 via-slate-900/80 to-slate-950',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      bgImage: '/images/yahangala/yahangala-bed-rock-monolith.jpg',
      previewSites: ['Yahangala (The Final Slumber)'],
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-obsidian text-slate-100 pt-16 sm:pt-20 pb-28 px-4 sm:px-6 lg:px-12 scrollbar-thin select-text">
      {/* Background ambient lighting effects */}
      <div className="absolute top-96 left-12 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-12 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* OPTION 1 - LEFT FLANK: The Ancient Sky Citadel (Sigiriya / Alakamanda) */}
      <div
        onClick={() => {
          playVimanaWhoosh();
          if (onExploreSigiriya) onExploreSigiriya();
        }}
        className="hidden lg:block absolute top-6 left-0 w-[420px] xl:w-[540px] 2xl:w-[620px] h-[580px] cursor-pointer group overflow-hidden z-20 select-none"
        title={
          language === 'si'
            ? 'සීගිරිය (අලකමන්දාව) සිතියමෙන් ගවේෂණය කරන්න'
            : language === 'hi'
            ? 'सिगिरिया (अलकामंदा) मानचित्र देखें'
            : 'Click to explore Sigiriya (Alakamanda) on the interactive map'
        }
      >
        <div className="relative w-full h-full">
          <img
            src="/images/sigiriya/sigiriya-aerial-citadel.jpg"
            alt="Alakamanda Sky Citadel of Lanka"
            className="w-full h-full object-cover object-[center_35%] opacity-40 xl:opacity-50 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 filter contrast-110 brightness-90 saturate-90"
            style={{
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 10%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 85%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 10%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 85%)',
            }}
          />
          {/* Ambient Fade Overlays - Smooth transition to solid black */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-obsidian/60 to-obsidian group-hover:via-obsidian/30 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-obsidian to-transparent" />

          {/* Interactive Callout Badge */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-serif text-xs group-hover:border-emerald-400 group-hover:bg-emerald-950/80 group-hover:shadow-lg group-hover:shadow-emerald-950/60 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>🏰 අලකමන්දාව • Sky Citadel</span>
            <span className="text-[10px] font-mono text-emerald-300/90 border-l border-emerald-500/40 pl-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              FlyTo Map <ArrowRight className="w-3 h-3 inline" />
            </span>
          </div>
        </div>
      </div>

      {/* OPTION 1 - RIGHT FLANK: The Sovereign Monarch (Emperor Ravana on Golden Throne) */}
      <div
        onClick={() => {
          playSacredChime(1.0);
          if (onOpenEmperorModal) onOpenEmperorModal();
        }}
        className="hidden lg:block absolute top-6 right-0 w-[420px] xl:w-[540px] 2xl:w-[620px] h-[580px] cursor-pointer group overflow-hidden z-20 select-none"
        title={
          language === 'si'
            ? 'මහා රාවණ චරිතාපදානය සහ දස විද්‍යාවන් කියවන්න'
            : language === 'hi'
            ? 'महाराज रावण की गाथा एवं 10 महाविद्याएं देखें'
            : 'Click to view Emperor Ravana biography and the 10 Sciences'
        }
      >
        <div className="relative w-full h-full">
          <img
            src="/images/ravana/ravana-throne.jpg"
            alt="Emperor Ravana on the Golden Throne"
            className="w-full h-full object-cover object-[center_15%] opacity-45 xl:opacity-55 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 filter contrast-115 brightness-95"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 85%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 85%)',
            }}
          />
          {/* Ambient Fade Overlays - Smooth transition to solid black */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-obsidian/60 to-obsidian group-hover:via-obsidian/30 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-obsidian to-transparent" />

          {/* Interactive Callout Badge */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 font-serif text-xs group-hover:border-amber-400 group-hover:bg-amber-950/80 group-hover:shadow-lg group-hover:shadow-amber-950/60 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>👑 මහා රාවණාධිරාජයා • Solar King</span>
            <span className="text-[10px] font-mono text-amber-300/90 border-l border-amber-500/40 pl-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Read Lore <ArrowRight className="w-3 h-3 inline" />
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-30 space-y-16 sm:space-y-20">
        {/* HERO INTRO SECTION */}
        <section className="text-center pt-6 sm:pt-10 max-w-4xl mx-auto space-y-6">
          {/* Top Tag Badges with Creator Credit */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-gold-glow">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-serif tracking-widest text-amber-300 font-semibold uppercase">
                {t.heroLandingTag}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs font-serif shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>
                {language === 'si' ? 'සංකල්පය, සැලසුම සහ සංවර්ධනය:' : 'Concept, Design & Developed by'}{' '}
                <strong className="font-bold text-amber-200 tracking-wide">Janudaya</strong>
              </span>
            </div>
          </div>

          {/* Main Epic Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent">
              {t.heroLandingTitle}
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-base sm:text-xl lg:text-2xl font-serif text-amber-400/90 font-medium tracking-wide">
            {t.heroLandingSubtitle}
          </h2>

          {/* Prose Narrative Introduction */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">
            {t.heroLandingDesc}
          </p>

          {/* Call to Actions (CTAs) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onBeginExpedition}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-black text-sm tracking-wide shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 scale-100 hover:scale-[1.02] group"
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300 text-slate-950" />
              <span>{t.heroBtnBegin}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onBeginExpedition}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 font-semibold text-sm transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.heroBtnDirectMap}</span>
            </button>
          </div>

          {/* Mobile / Tablet Quick Exploration Chips for Sigiriya & Emperor Lore */}
          <div className="flex lg:hidden flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={onExploreSigiriya}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-serif transition-colors shadow-sm"
            >
              <span>🏰</span>
              <span>අලකමන්දාව (සීගිරිය) සිතියමෙන්</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
            </button>
            <button
              onClick={onOpenEmperorModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-serif transition-colors shadow-sm"
            >
              <span>👑</span>
              <span>මහා රාවණ චරිතාපදානය & දස විද්‍යා</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>

          {/* Quick Metrics Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-slate-200">{totalLocationsCount}</strong> Sacred Coordinates
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800">
              <Plane className="w-3.5 h-3.5 text-cyan-400" />
              <strong className="text-slate-200">4</strong> Ancient Airfield Ports
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-slate-200">3</strong> Languages (EN | සිං | हिं)
            </span>
          </div>
        </section>

        {/* SLEEK FEATURE HIGHLIGHTS RIBBON */}
        <section className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 px-3 py-2 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                  {t.heroFeature1Title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 font-light">
                  {t.heroFeature1Desc}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:pl-4 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Plane className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                  {t.heroFeature2Title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 font-light">
                  {t.heroFeature2Desc}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:pl-4 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                  {t.heroFeature3Title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 font-light">
                  {t.heroFeature3Desc}
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5 px-3 py-2 sm:pl-4 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Route className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                  {t.heroFeature4Title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 font-light">
                  {t.heroFeature4Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03 CINEMATIC SHOWCASE: THE GREAT CONFLICT (POINTER & TOUCH SCRUBBED) */}
        <section className="relative my-8 sm:my-12 rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950/80 shadow-2xl min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-10 group">
          {/* Mouse-Pointer & Mobile Scroll/Touch Scrubbed Video UNDERNEATH this content */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <MousePointerBattleVideo className="w-full h-full" />
          </div>

          {/* Foreground Content (100% accessible and readable) */}
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>CHAPTER 03 • THE GREAT CONFLICT</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
              {language === 'si'
                ? 'මහා රාවණ රජුගේ සූර්ය අස්ත්‍ර ප්‍රහාරය'
                : language === 'hi'
                ? 'महाराज रावण का प्रचंड वज्र प्रहार'
                : 'King Ravana Blasts Lord Indra & Celestial Armies'}
            </h2>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectChapterAndExplore('The Great Conflict')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold text-xs sm:text-sm shadow-gold-glow transition-all scale-100 hover:scale-[1.02]"
              >
                <span>{language === 'si' ? 'Chapter 03 සිතියමෙන් ගවේෂණය කරන්න' : 'Explore Chapter 03 Sites'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 4 EPIC CHAPTERS PREVIEW SECTION WITH REAL VISUAL BACKDROPS */}
        <section className="space-y-6 pt-2">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-100">
              {t.heroChaptersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              {t.heroChaptersSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {chapters.map((chap, idx) => {
              const label = getChapterName(chap.key);
              return (
                <TiltChapterCard
                  key={chap.key}
                  chap={chap}
                  idx={idx}
                  label={label}
                  onSelect={() => {
                    playSacredChime(1.15);
                    onSelectChapterAndExplore(chap.key);
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="relative rounded-3xl p-6 sm:p-10 border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-950 overflow-hidden shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
              Ready to Embark on the Sacred Odyssey?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Launch the full-screen interactive cartography, listen to spoken chronicles, and plan your custom journey.
            </p>
          </div>

          <button
            onClick={() => {
              playVimanaWhoosh();
              onBeginExpedition();
            }}
            className="flex-shrink-0 flex items-center gap-2 px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs sm:text-sm shadow-gold-glow transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Interactive Map</span>
          </button>
        </section>

        {/* IMPERIAL FOOTER & CREATOR ACCREDITATION */}
        <footer className="relative pt-12 pb-14 border-t border-amber-500/20 text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/30 via-amber-600/20 to-amber-900/30 p-1.5 border border-amber-500/40 shadow-gold-glow-lg flex items-center justify-center">
              <RavanaImperialLogo size={46} />
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              CHRONICLES OF RAVANA • රාවණ වංශය
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg font-light mx-auto leading-relaxed">
              {language === 'si'
                ? 'හෙළයේ අභිමානවත් මහා රාවණ අධිරාජ්‍යයේ නොදුටු ඉතිහාසය හා ඓතිහාසික ස්ථාන ගවේෂණය.'
                : 'A cinematic digital expedition into the celestial empire and sacred cartography of Emperor Ravana.'}
            </p>
          </div>

          {/* Creator & Contact Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {/* Creator Royal Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-gold-glow backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-slate-300 font-serif font-medium">
                Concept, Design & Developed by:
              </span>
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-serif font-black text-xs sm:text-sm tracking-wider shadow-md">
                JANUDAYA
              </span>
            </div>

            {/* Direct Email Contact Pill */}
            <a
              href="mailto:janudayakavinda@gmail.com?subject=Inquiry%20-%20Chronicles%20of%20Ravana%20Project"
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all duration-300 shadow-md hover:shadow-gold-glow hover:scale-[1.02]"
              title="Send an email to Janudaya"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  {language === 'si' ? 'සම්බන්ධ කරගන්න • Get in Touch' : 'Get in Touch'}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-amber-300 font-mono tracking-tight">
                  janudayakavinda@gmail.com
                </div>
              </div>
            </a>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 font-mono flex flex-wrap items-center justify-center gap-3">
            <span>© 2026 Chronicles of Ravana</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">Concept, Design & Developed by Janudaya</span>
            <span>•</span>
            <a
              href="mailto:janudayakavinda@gmail.com"
              className="text-slate-400 hover:text-amber-300 transition-colors underline decoration-amber-500/30"
            >
              janudayakavinda@gmail.com
            </a>
            <span>•</span>
            <span>Proudly Crafted in Sri Lanka 🇱🇰</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
