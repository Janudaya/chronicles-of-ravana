'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Shield,
  Compass,
  ArrowRight,
  Flame,
  ChevronDown,
  Sparkles,
  MapPin,
  Swords,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ChapterFilter } from './Navbar';

interface AppleScrollBattleStoryProps {
  onExploreYudaganawa: () => void;
  onSelectChapter: (chapter: ChapterFilter) => void;
}

export const AppleScrollBattleStory: React.FC<AppleScrollBattleStoryProps> = ({
  onExploreYudaganawa,
  onSelectChapter,
}) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Compute scroll progress relative to parent scrollable container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Find nearest scrollable ancestor (HeroLanding div or window)
    const scrollParent = el.closest('.overflow-y-auto') || window;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight =
        scrollParent instanceof Window
          ? window.innerHeight
          : (scrollParent as HTMLElement).clientHeight;

      // Track height from top of sticky pin to bottom
      const stickyTopOffset = 80; // approximate top pin offset
      const scrolledPast = -(rect.top - stickyTopOffset);
      const totalScrollable = containerRef.current.offsetHeight - viewHeight;

      if (totalScrollable > 0) {
        const rawProgress = scrolledPast / totalScrollable;
        const clamped = Math.max(0, Math.min(1, rawProgress));
        setProgress(clamped);
      }
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Jump smoothly to a specific stage when clicking the scrubber dots
  const scrollToStage = useCallback((targetProgress: number) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollParent = el.closest('.overflow-y-auto') || window;
    const viewHeight =
      scrollParent instanceof Window
        ? window.innerHeight
        : (scrollParent as HTMLElement).clientHeight;
    const totalScrollable = el.offsetHeight - viewHeight;
    const targetScrollY = el.offsetTop + targetProgress * totalScrollable - 70;

    scrollParent.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }, []);

  // Dynamic transforms based on scroll progress
  // Scale zooms in during middle, then stabilizes
  const imageScale = 1.03 + progress * 0.24;
  // Dynamic subtle camera pan towards the lightning blast
  const imagePanX = progress * -4.5;
  const imagePanY = progress * -2.5;

  // Lightning intensity curve (peaks around stage 2: 0.35 - 0.70)
  const isLightningActive = progress > 0.32 && progress < 0.72;
  const lightningFlicker = isLightningActive
    ? 0.35 + Math.sin(progress * 45) * 0.25 + Math.sin(progress * 90) * 0.15
    : 0;

  // Active Story Stage (0, 1, or 2)
  const currentStage = progress < 0.35 ? 0 : progress < 0.7 ? 1 : 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[270vh] sm:h-[300vh] my-10 select-none"
    >
      {/* Sticky Stage Viewport (Pinned while scrolling through 280vh track) */}
      <div className="sticky top-16 sm:top-20 w-full h-[75vh] sm:h-[82vh] max-h-[820px] rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950 shadow-2xl shadow-black flex flex-col justify-between">
        {/* BACKGROUND 1: Photographic Epic Battle Layer with Hardware Acceleration */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/battle/ravana-celestial-battle.jpg"
            alt="Emperor Ravana Celestial Battle at Yudaganawa"
            className="w-full h-full object-cover object-center will-change-transform"
            style={{
              transform: `scale(${imageScale}) translate3d(${imagePanX}%, ${imagePanY}%, 0)`,
              transition: 'transform 0.1s linear',
              filter: `contrast(115%) brightness(${0.9 + lightningFlicker * 0.3}) saturate(105%)`,
            }}
          />

          {/* Electric Lightning Arc Flash Overlay during Phase 2 */}
          {isLightningActive && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-75 mix-blend-screen"
              style={{
                opacity: lightningFlicker,
                background:
                  'radial-gradient(circle at 60% 40%, rgba(56, 189, 248, 0.45) 0%, rgba(251, 191, 36, 0.25) 45%, transparent 75%)',
              }}
            />
          )}

          {/* Multi-layered Cinema Vignette & Contrast Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-transparent to-slate-950/85" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        {/* TOP BAR: Chapter Identifier & Scrubbing Badge */}
        <div className="relative z-20 px-6 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-gold-glow">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                  CHAPTER 03 SNEAK PEEK
                </span>
                <span className="text-[10px] font-mono text-slate-400">• Apple Scrollytelling</span>
              </div>
              <h3 className="font-serif font-black text-sm sm:text-base text-white tracking-wide">
                {language === 'si'
                  ? 'මහා සංග්‍රාමය: අහස් ගැබ දෙදරුම් කෑ සටන'
                  : language === 'hi'
                  ? 'महायुद्ध: आकाशीय शक्तियों का महासंग्राम'
                  : 'The Great Conflict: Celestial Warfare'}
              </h3>
            </div>
          </div>

          {/* Current Progress Percentage Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{Math.round(progress * 100)}% EXPLORED</span>
          </div>
        </div>

        {/* RIGHT SIDE: Apple-Style Vertical Scrubber Indicator */}
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4">
          <div className="relative flex flex-col items-center gap-6 py-4 px-2 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-md shadow-2xl">
            {/* Stage 1 Dot */}
            <button
              onClick={() => scrollToStage(0.1)}
              className={`group flex items-center gap-2 transition-all ${
                currentStage === 0 ? 'scale-125' : 'opacity-50 hover:opacity-100'
              }`}
              title="Stage 1: The Celestial Clash"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStage === 0
                    ? 'bg-amber-400 ring-4 ring-amber-500/30 shadow-gold-glow'
                    : 'bg-slate-500'
                }`}
              />
            </button>

            {/* Connecting Line 1-2 */}
            <div className="w-0.5 h-6 bg-slate-800">
              <div
                className="w-full bg-amber-400 transition-all"
                style={{
                  height: `${Math.min(100, Math.max(0, (progress - 0.1) * 200))}%`,
                }}
              />
            </div>

            {/* Stage 2 Dot */}
            <button
              onClick={() => scrollToStage(0.5)}
              className={`group flex items-center gap-2 transition-all ${
                currentStage === 1 ? 'scale-125' : 'opacity-50 hover:opacity-100'
              }`}
              title="Stage 2: Solar Astra & Lightning"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStage === 1
                    ? 'bg-sky-400 ring-4 ring-sky-500/30 shadow-lg shadow-sky-500/50'
                    : 'bg-slate-500'
                }`}
              />
            </button>

            {/* Connecting Line 2-3 */}
            <div className="w-0.5 h-6 bg-slate-800">
              <div
                className="w-full bg-sky-400 transition-all"
                style={{
                  height: `${Math.min(100, Math.max(0, (progress - 0.5) * 250))}%`,
                }}
              />
            </div>

            {/* Stage 3 Dot */}
            <button
              onClick={() => scrollToStage(0.85)}
              className={`group flex items-center gap-2 transition-all ${
                currentStage === 2 ? 'scale-125' : 'opacity-50 hover:opacity-100'
              }`}
              title="Stage 3: Yudaganawa Battlefield"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStage === 2
                    ? 'bg-emerald-400 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/50'
                    : 'bg-slate-500'
                }`}
              />
            </button>
          </div>
        </div>

        {/* CENTER NARRATIVE CARDS (Fading & Morphing Smoothly with Scroll) */}
        <div className="relative z-20 px-6 sm:px-12 py-4 max-w-2xl my-auto">
          {/* STAGE 1: 0% - 35% (The Great Celestial Conflict) */}
          <div
            className={`space-y-3.5 transition-all duration-500 ${
              currentStage === 0
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none absolute inset-x-6 sm:inset-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>STAGE 01 • THE COSMIC CONFRONTATION</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
              {language === 'si'
                ? 'ලංකා අහස් ගැබ දෙදරුම් කෑ මහා ගැටුම'
                : language === 'hi'
                ? 'जब लंका का आकाश महाशक्तियों से कांप उठा'
                : 'When the Skies of Lanka Trembled'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed drop-shadow bg-slate-950/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              {language === 'si'
                ? 'ලංකාද්වීපයේ ස්වෛරීභාවය සහ ආරක්ෂාව පතා, මහා රාවණාධිරාජයා සිය ආකාශ වාහනයට (Vimana) නැගී ඓරාවත ඇතු සහ දිව්‍ය සේනාවන්ට එරෙහිව මෙහෙයවූ ඓතිහාසික අභ්‍යවකාශ සංග්‍රාමය මෙසේ ඇරඹිණි.'
                : language === 'hi'
                ? 'लंका की संप्रभुता और मान की रक्षा हेतु, महाराज रावण ने अपने दिव्य पुष्पक विमान पर आरूढ़ होकर ऐरावत हाथी पर सवार शत्रु सेना के विरुद्ध यह ऐतिहासिक आकाशीय युद्ध आरंभ किया।'
                : 'Defending the sovereignty of the Hela Empire, Emperor Ravana embarked upon his aerodynamic aerial warship, engaging celestial adversaries and war-elephants in an unprecedented primordial clash of power.'}
            </p>
          </div>

          {/* STAGE 2: 35% - 70% (Solar Astra & Lightning Strike) */}
          <div
            className={`space-y-3.5 transition-all duration-500 ${
              currentStage === 1
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none absolute inset-x-6 sm:inset-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
              <span>STAGE 02 • HIGH-ENERGY WEAPONRY</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
              {language === 'si'
                ? 'සූර්ය ශක්ති කදම්භ සහ අකුණු අස්ත්‍ර'
                : language === 'hi'
                ? 'सूर्य अस्त्र एवं प्रचंड विद्युत प्रहार'
                : 'The Solar Plasma & Lightning Astras'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed drop-shadow bg-slate-950/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              {language === 'si'
                ? 'මහා රාවණ රජු විසින් ප්‍රගුණ කරන ලද ධනුර්වේද සහ ව්‍යෝම තාක්ෂණය තුළින් සූර්ය ශක්තිය සහ වායුගෝලීය ප්ලාස්මා ධාරාවන් සාන්ද්‍රණය කර විදින ලද විදුලි අස්ත්‍රයන්ගෙන් අහස් තලය ආලෝකමත් විය.'
                : language === 'hi'
                ? 'रावण द्वारा साधित धनुर्वेद और वायुगतिकी से उत्पन्न, सौर ऊर्जा और विद्युत किरणों के महाविस्फोटक प्रहारों से रणभूमि का संपूर्ण आकाश आलोकित हो उठा।'
                : 'Harnessing solar resonance and atmospheric vortex plasma, Emperor Ravana discharged concentrated high-energy lightning astras capable of piercing the defenses of advancing cosmic hosts.'}
            </p>
          </div>

          {/* STAGE 3: 70% - 100% (Yudaganawa Battlefield & Map CTA) */}
          <div
            className={`space-y-3.5 transition-all duration-500 ${
              currentStage === 2
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none absolute inset-x-6 sm:inset-x-12'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>STAGE 03 • SITE #11 AT YUDAGANAWA</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
              {language === 'si'
                ? 'යුදගනාව: සටන කෙළවර වූ පූජනීය බිම'
                : language === 'hi'
                ? 'युदगनावा: महायुद्ध की अमर साक्षी भूमि'
                : 'Yudaganawa: The Eternal Battlefield'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed drop-shadow bg-slate-950/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              {language === 'si'
                ? 'මෙම සටන අවසානයේ ලංකාවේ දක්ෂිණ තැනිතලාව වූ යුදගනාව වෙත කේන්ද්‍රගත විය. අදටත් කිසිදු තෘණ පැළෑටියක් නොවැවෙන මෙම අභිරහස් පිලිස්සුණු පස් තලාව සහ දැවැන්ත ස්තූපය එම මහා සටනේ නිහඬ සාක්ෂිකරුවන්ය.'
                : language === 'hi'
                ? 'इस महासंग्राम की अंतिम परिणति युदगनावा के विशाल मैदानों में हुई। आज भी जहाँ घास नहीं उगती, वह रहस्यमयी जली हुई भूमि और विशाल स्तूप उस महायुद्ध का अमर साक्षी है।'
                : 'The terrestrial climax raged across the plains of Yudaganawa. Today, the legendary scorched soil where vegetation refused to grow and the colossal brick stupa preserve the memory of this epochal confrontation.'}
            </p>

            {/* Direct Action Buttons for Stage 3 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreYudaganawa}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-serif font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all scale-100 hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4" />
                <span>
                  {language === 'si'
                    ? 'යුදගනාව සිතියමෙන් ගවේෂණය කරන්න'
                    : language === 'hi'
                    ? 'युदगनावा मानचित्र पर देखें'
                    : 'Fly to Yudaganawa on Map'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectChapter('The Great Conflict')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-amber-300 font-serif text-xs sm:text-sm transition-colors"
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span>
                  {language === 'si'
                    ? 'Chapter 03 ස්ථාන සියල්ල බලන්න'
                    : language === 'hi'
                    ? 'अध्याय 03 के सभी स्थल देखें'
                    : 'Explore All Chapter 03 Sites'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM HELPER BAR: Scroll scrubber progress & callout */}
        <div className="relative z-20 px-6 py-3.5 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              {progress < 0.95
                ? language === 'si'
                  ? 'පහළට Scroll කර සටනේ ඉදිරි අදියර නරඹන්න'
                  : language === 'hi'
                  ? 'युद्ध की अगली गाथा देखने के लिए नीचे स्क्रॉल करें'
                  : 'Scroll down to advance the battle animation'
                : language === 'si'
                ? 'සටනේ සියලු අදියර අවසන් • පහළින් පරිච්ඡේද තෝරන්න'
                : 'Animation Complete • Explore Chapters Below'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90">
            <span>STAGE 0{currentStage + 1} / 03</span>
          </div>
        </div>
      </div>
    </div>
  );
};
