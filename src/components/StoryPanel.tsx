'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Compass, Sparkles, X } from 'lucide-react';
import { RavanaLocation } from '@/data/ravanaLocations';
import { StoryCard } from './StoryCard';
import { ChapterFilter } from './Navbar';
import { useLanguage } from '@/context/LanguageContext';

interface StoryPanelProps {
  locations: RavanaLocation[];
  activeLocation: RavanaLocation | null;
  activeChapter: ChapterFilter;
  trailIds: Set<string>;
  isTrailOnlyMode: boolean;
  onSelectLocation: (location: RavanaLocation) => void;
  onExploreLocation: (location: RavanaLocation) => void;
  onToggleTrail: (location: RavanaLocation, e: React.MouseEvent) => void;
  onClearFilters: () => void;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({
  locations,
  activeLocation,
  activeChapter,
  trailIds,
  isTrailOnlyMode,
  onSelectLocation,
  onExploreLocation,
  onToggleTrail,
  onClearFilters,
}) => {
  const { t, getChapterName, getLocationContent } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filtered locations based on chapter, trail-only mode, and localized search query
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Trail only filter
      if (isTrailOnlyMode && !trailIds.has(loc.id)) {
        return false;
      }

      // Chapter filter
      if (activeChapter !== 'All' && loc.chapter !== activeChapter) {
        return false;
      }

      // Search query filter (search across English, Sinhala, Hindi content)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const content = getLocationContent(loc.id);

        const matchesTitle = loc.title.toLowerCase().includes(query) || content.title.toLowerCase().includes(query);
        const matchesSinhala = loc.sinhalaTitle.includes(query) || content.subTitle.includes(query);
        const matchesDistrict = loc.district.toLowerCase().includes(query) || content.district.toLowerCase().includes(query);
        const matchesStory = loc.story.toLowerCase().includes(query) || content.story.toLowerCase().includes(query);
        return matchesTitle || matchesSinhala || matchesDistrict || matchesStory;
      }

      return true;
    });
  }, [locations, activeChapter, isTrailOnlyMode, trailIds, searchQuery, getLocationContent]);

  // Scroll active card into view when activeLocation changes from map
  useEffect(() => {
    if (activeLocation) {
      const cardEl = document.getElementById(`story-card-${activeLocation.id}`);
      if (cardEl && scrollContainerRef.current) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLocation]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-4 lg:px-6 pt-24 pb-20 space-y-5 scrollbar-thin select-text"
    >
      {/* Intro Hero Header */}
      <div className="relative rounded-2xl p-5 overflow-hidden border border-amber-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-amber-950/20 backdrop-blur-md shadow-lg">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.heroBadge}</span>
        </div>
        <h2 className="font-serif text-2xl font-black text-slate-100 tracking-wide mb-2">
          {t.heroTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          {t.heroDescription}
        </p>

        {/* Quick Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            {t.sitesCount(filteredLocations.length, locations.length)}
          </span>
          {activeChapter !== 'All' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px]">
              {getChapterName(activeChapter)}
            </span>
          )}
          {isTrailOnlyMode && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
              {t.showingMyTrail}
            </span>
          )}
        </div>

        {(activeChapter !== 'All' || isTrailOnlyMode || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              onClearFilters();
            }}
            className="text-amber-400 hover:text-amber-300 hover:underline text-[11px] font-medium"
          >
            {t.clearFilters}
          </button>
        )}
      </div>

      {/* Story Cards List */}
      {filteredLocations.length > 0 ? (
        <div className="space-y-4">
          {filteredLocations.map((loc) => (
            <StoryCard
              key={loc.id}
              location={loc}
              isActive={activeLocation?.id === loc.id}
              isInTrail={trailIds.has(loc.id)}
              onSelect={onSelectLocation}
              onExplore={onExploreLocation}
              onToggleTrail={onToggleTrail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-slate-300 font-serif text-base mb-1">{t.noSitesTitle}</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
            {t.noSitesDesc}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onClearFilters();
            }}
            className="px-4 py-1.5 text-xs rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-medium transition-colors"
          >
            {t.resetFiltersBtn}
          </button>
        </div>
      )}
    </div>
  );
};
