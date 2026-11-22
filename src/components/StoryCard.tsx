'use client';

import React from 'react';
import { MapPin, Navigation, Calendar, ChevronRight, Check, Plus } from 'lucide-react';
import { RavanaLocation } from '@/data/ravanaLocations';
import { useLanguage } from '@/context/LanguageContext';

interface StoryCardProps {
  location: RavanaLocation;
  isActive: boolean;
  isInTrail: boolean;
  onSelect: (location: RavanaLocation) => void;
  onExplore: (location: RavanaLocation) => void;
  onToggleTrail: (location: RavanaLocation, e: React.MouseEvent) => void;
}

const chapterBadgeColors: Record<RavanaLocation['chapter'], { bg: string; text: string; border: string }> = {
  'Birth & Rise': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  'Sovereignty & Science': {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  'The Great Conflict': {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  'Final Resting': {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
};

const difficultyBadgeColors: Record<RavanaLocation['difficulty'], { bg: string; text: string; border: string }> = {
  'Easy': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  'Moderate': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  'Challenging Hike': {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
};

export const StoryCard: React.FC<StoryCardProps> = ({
  location,
  isActive,
  isInTrail,
  onSelect,
  onExplore,
  onToggleTrail,
}) => {
  const { t, getChapterName, getLocationContent } = useLanguage();
  const content = getLocationContent(location.id);

  const chapStyle = chapterBadgeColors[location.chapter];
  const diffStyle = difficultyBadgeColors[location.difficulty];

  return (
    <div
      id={`story-card-${location.id}`}
      onClick={() => onSelect(location)}
      className={`group relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive
          ? 'glass-panel border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50 scale-[1.01]'
          : 'bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 hover:shadow-lg'
      }`}
    >
      {/* Top golden accent line when active */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 animate-pulse" />
      )}

      {/* Scenic Top Photo Banner with Cinematic Dark Gradient Overlay */}
      {content.imageUrl ? (
        <div className="relative w-full h-40 overflow-hidden bg-slate-950">
          <img
            src={content.imageUrl}
            alt={content.imageAlt || content.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88] group-hover:brightness-100"
          />
          {/* Subtle vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent" />

          {/* Floating Badges over the image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-serif font-black text-xs shadow-lg">
                #{String(location.order).padStart(2, '0')}
              </span>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-md ${chapStyle.bg} ${chapStyle.text} ${chapStyle.border}`}
              >
                {getChapterName(location.chapter)}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => onToggleTrail(location, e)}
              className={`pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md shadow-lg transition-all ${
                isInTrail
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/40'
                  : 'bg-slate-950/80 text-slate-300 border border-slate-700/80 hover:text-amber-300 hover:border-amber-500/50 hover:bg-slate-900'
              }`}
              title={isInTrail ? t.removeFromTrail : t.addToTrail}
            >
              {isInTrail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.inTrail}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.addToTrail}</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Photo Count Badge if multi-photo gallery exists */}
          {content.gallery && content.gallery.length > 1 && (
            <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-slate-950/85 border border-amber-500/30 text-[11px] font-semibold text-amber-300 backdrop-blur-md shadow-md flex items-center gap-1 pointer-events-none">
              <span>📷</span>
              <span>{content.gallery.length} Photos</span>
            </div>
          )}
        </div>
      ) : null}

      <div className="p-4 sm:p-5">
        {/* Header Meta: Order number, Chapter Badge, Trail Toggle (only shown when no banner image) */}
        {!content.imageUrl && (
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-serif font-black text-xs shadow-md">
                {String(location.order).padStart(2, '0')}
              </span>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${chapStyle.bg} ${chapStyle.text} ${chapStyle.border}`}
              >
                {getChapterName(location.chapter)}
              </span>
            </div>

            <button
              onClick={(e) => onToggleTrail(location, e)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isInTrail
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-800'
              }`}
              title={isInTrail ? t.removeFromTrail : t.addToTrail}
            >
              {isInTrail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.inTrail}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.addToTrail}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Titles: Localized Title & SubTitle */}
        <div className="mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-slate-100 group-hover:text-amber-300 transition-colors">
            {content.title}
          </h3>
          <p className="text-xs sm:text-sm text-amber-400/90 font-medium tracking-wide font-sans mt-0.5">
            {content.subTitle}
          </p>
        </div>

        {/* Meta badges: District, Difficulty, Best Time */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1 text-slate-300 bg-slate-800/70 px-2 py-0.5 rounded-md border border-slate-700/50">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{t.districtLabel(content.district)}</span>
          </div>

          <div
            className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
          >
            {content.difficulty}
          </div>

          <div className="flex items-center gap-1 text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded-md text-[11px]">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{content.bestTime}</span>
          </div>
        </div>

        {/* Brief story preview */}
        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed line-clamp-2 mb-4 font-normal">
          {content.story}
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Navigation className="w-3 h-3 text-amber-400" />
            <span>
              {location.coordinates[0].toFixed(3)}° N, {location.coordinates[1].toFixed(3)}° E
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExplore(location);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              onExplore(location);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 font-semibold transition-all group/btn cursor-pointer select-none"
          >
            <span>{t.exploreLocation}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
