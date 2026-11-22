'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ravanaLocations, RavanaLocation } from '@/data/ravanaLocations';
import { Navbar, ChapterFilter } from '@/components/Navbar';
import { StoryPanel } from '@/components/StoryPanel';
import { MapWrapper } from '@/components/Map/MapWrapper';
import { LocationDetailDrawer } from '@/components/LocationDetailDrawer';
import { MyTrailDrawer } from '@/components/MyTrailDrawer';
import { AudioGuideBar } from '@/components/AudioGuideBar';
import { HeroLanding } from '@/components/HeroLanding';
import { EmperorLoreModal } from '@/components/EmperorLoreModal';
import { Map as MapIcon, List } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const STORAGE_KEY = 'ravana_trail_planner_ids_v1';

export default function RavanaTrailApp() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'overview' | 'map'>('overview');
  const [activeChapter, setActiveChapter] = useState<ChapterFilter>('All');
  const [activeLocation, setActiveLocation] = useState<RavanaLocation | null>(null);
  const [selectedDrawerLocation, setSelectedDrawerLocation] = useState<RavanaLocation | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isTrailDrawerOpen, setIsTrailDrawerOpen] = useState(false);
  const [isTrailOnlyMode, setIsTrailOnlyMode] = useState(false);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);
  const [trailIds, setTrailIds] = useState<Set<string>>(new Set());
  const [isMobileMapExpanded, setIsMobileMapExpanded] = useState(false);
  const [showVimanaNetwork, setShowVimanaNetwork] = useState(false);
  const [isEmperorModalOpen, setIsEmperorModalOpen] = useState(false);

  // Load saved trail from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTrailIds(new Set(parsed));
        }
      } else {
        // Default initial trail: 4 iconic locations (Laggala, Sigiriya, Hakgala, Yahangala)
        setTrailIds(new Set(['laggala-birthplace', 'sigiriya-citadel', 'hakgala-ashoka-vatika', 'yahangala-resting-place']));
      }
    } catch {
      // Fallback if localStorage is disabled or throws
    }
  }, []);

  // Save trail changes to localStorage
  const saveTrailToStorage = (newSet: Set<string>) => {
    setTrailIds(newSet);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)));
    } catch {
      // Ignore storage errors
    }
  };

  // Toggle location in custom trail
  const handleToggleTrail = useCallback((location: RavanaLocation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTrailIds((prev) => {
      const next = new Set(prev);
      if (next.has(location.id)) {
        next.delete(location.id);
      } else {
        next.add(location.id);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  // Remove specific location from trail
  const handleRemoveTrailLocation = useCallback((id: string) => {
    setTrailIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  // Clear all locations from trail
  const handleClearTrail = useCallback(() => {
    const empty = new Set<string>();
    saveTrailToStorage(empty);
    setIsTrailOnlyMode(false);
  }, []);

  // Add Recommended 5-Stop Highlights Trail
  const handleAddRecommendedTrail = useCallback(() => {
    const recommendedIds = [
      'laggala-birthplace',
      'sigiriya-citadel',
      'ritigala-sanctuary',
      'hakgala-ashoka-vatika',
      'yahangala-resting-place',
    ];
    saveTrailToStorage(new Set(recommendedIds));
  }, []);

  // Handle location selection (from card click or marker click)
  const handleSelectLocation = useCallback((location: RavanaLocation) => {
    setActiveLocation(location);
  }, []);

  // Handle opening explore drawer
  const handleExploreLocation = useCallback((location: RavanaLocation) => {
    setSelectedDrawerLocation(location);
    setActiveLocation(location);
    setIsDetailDrawerOpen(true);
  }, []);

  // Handle flying directly to Sigiriya Citadel from Hero Flank or Modal
  const handleExploreSigiriya = useCallback(() => {
    const sigiriya = ravanaLocations.find((l) => l.id === 'sigiriya-citadel');
    if (sigiriya) {
      setActiveChapter('All');
      setIsTrailOnlyMode(false);
      setActiveLocation(sigiriya);
      setCurrentView('map');
    }
  }, []);

  // Handle flying directly to Yudaganawa Battlefield from Apple Scroll Story
  const handleExploreYudaganawa = useCallback(() => {
    const yudaganawa = ravanaLocations.find((l) => l.id === 'yudaganawa-battlefield');
    if (yudaganawa) {
      setActiveChapter('The Great Conflict');
      setIsTrailOnlyMode(false);
      setActiveLocation(yudaganawa);
      setCurrentView('map');
    }
  }, []);

  // Reset map view to full island overview
  const handleResetView = useCallback(() => {
    setActiveLocation(null);
    setResetViewTrigger((prev) => prev + 1);
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setActiveChapter('All');
    setIsTrailOnlyMode(false);
    handleResetView();
  }, [handleResetView]);

  // Locations currently planned in user trail
  const trailLocationsList = useMemo(() => {
    return ravanaLocations
      .filter((l) => trailIds.has(l.id))
      .sort((a, b) => a.order - b.order);
  }, [trailIds]);

  // Locations to render on the map
  const mapLocations = useMemo(() => {
    if (isTrailOnlyMode) {
      return trailLocationsList;
    }
    if (activeChapter !== 'All') {
      return ravanaLocations.filter((l) => l.chapter === activeChapter);
    }
    return ravanaLocations;
  }, [isTrailOnlyMode, trailLocationsList, activeChapter]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-obsidian flex flex-col font-sans select-none">
      {/* Floating Navbar */}
      <Navbar
        currentView={currentView}
        onSwitchView={setCurrentView}
        activeChapter={activeChapter}
        onSelectChapter={(chap) => {
          setActiveChapter(chap);
          setIsTrailOnlyMode(false);
          setCurrentView('map');
        }}
        myTrailCount={trailIds.size}
        onOpenTrailDrawer={() => setIsTrailDrawerOpen(true)}
        onResetView={handleResetView}
        isTrailOnlyMode={isTrailOnlyMode}
        onToggleTrailOnlyMode={() => setIsTrailOnlyMode((prev) => !prev)}
      />

      {/* VIEW 1: CINEMATIC HERO OVERVIEW LANDING SECTION */}
      {currentView === 'overview' && (
        <HeroLanding
          onBeginExpedition={() => setCurrentView('map')}
          onSelectChapterAndExplore={(chap) => {
            setActiveChapter(chap);
            setIsTrailOnlyMode(false);
            const matchedSites = ravanaLocations.filter((l) => l.chapter === chap);
            if (matchedSites.length > 0) {
              setActiveLocation(matchedSites[0]);
            }
            setCurrentView('map');
          }}
          onOpenTrailDrawer={() => setIsTrailDrawerOpen(true)}
          totalLocationsCount={ravanaLocations.length}
          onExploreSigiriya={handleExploreSigiriya}
          onOpenEmperorModal={() => setIsEmperorModalOpen(true)}
        />
      )}

      {/* VIEW 2: INTERACTIVE SPLIT-SCREEN SCROLLYTELLING & MAP */}
      {currentView === 'map' && (
        <>
          <main className="w-full h-full flex flex-col lg:flex-row overflow-hidden relative pt-14 md:pt-16">
            {/* Story Panel: Left 40% on Desktop; Bottom 55vh on Mobile */}
            <div
              className={`w-full lg:w-[42%] xl:w-[38%] h-full z-10 transition-all duration-300 ${
                isMobileMapExpanded
                  ? 'h-[25vh] lg:h-full'
                  : 'h-[55vh] lg:h-full'
              }`}
            >
              <StoryPanel
                locations={ravanaLocations}
                activeLocation={activeLocation}
                activeChapter={activeChapter}
                trailIds={trailIds}
                isTrailOnlyMode={isTrailOnlyMode}
                onSelectLocation={handleSelectLocation}
                onExploreLocation={handleExploreLocation}
                onToggleTrail={handleToggleTrail}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Interactive Map: Right 60% on Desktop; Top 45vh on Mobile */}
            <div
              className={`w-full lg:w-[58%] xl:w-[62%] h-full relative z-0 transition-all duration-300 ${
                isMobileMapExpanded
                  ? 'h-[75vh] lg:h-full'
                  : 'h-[45vh] lg:h-full'
              }`}
            >
              <MapWrapper
                locations={mapLocations}
                allLocations={ravanaLocations}
                activeLocation={activeLocation}
                trailIds={trailIds}
                isTrailOnlyMode={isTrailOnlyMode}
                resetViewTrigger={resetViewTrigger}
                showVimanaNetwork={showVimanaNetwork}
                onToggleVimanaNetwork={() => setShowVimanaNetwork((prev) => !prev)}
                onSelectLocation={handleSelectLocation}
                onExploreLocation={handleExploreLocation}
                onToggleTrail={handleToggleTrail}
                onResetView={handleResetView}
              />

              {/* Mobile Height Toggle Pill (Offset below the top-right map style toggle) */}
              <div className="lg:hidden absolute top-16 right-3 z-20 pointer-events-auto">
                <button
                  onClick={() => setIsMobileMapExpanded((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg backdrop-blur-md"
                >
                  {isMobileMapExpanded ? (
                    <>
                      <List className="w-3.5 h-3.5" />
                      <span>{t.showStories}</span>
                    </>
                  ) : (
                    <>
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>{t.expandMap}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </main>

          {/* Sleek Bottom Floating Mini Audio Guide Bar */}
          <AudioGuideBar
            activeLocation={activeLocation}
            allLocations={ravanaLocations}
            onSelectLocation={handleSelectLocation}
          />
        </>
      )}

      {/* Location Detail Slide-Over Drawer */}
      <LocationDetailDrawer
        location={selectedDrawerLocation}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        isInTrail={selectedDrawerLocation ? trailIds.has(selectedDrawerLocation.id) : false}
        onToggleTrail={(loc) => handleToggleTrail(loc)}
      />

      {/* "My Trail" Custom Trip Planner Drawer */}
      <MyTrailDrawer
        isOpen={isTrailDrawerOpen}
        onClose={() => setIsTrailDrawerOpen(false)}
        trailLocations={trailLocationsList}
        onRemoveLocation={handleRemoveTrailLocation}
        onClearTrail={handleClearTrail}
        onSelectLocation={handleSelectLocation}
        onExploreLocation={handleExploreLocation}
        isTrailOnlyMode={isTrailOnlyMode}
        onToggleTrailOnlyMode={() => setIsTrailOnlyMode((prev) => !prev)}
        onAddRecommendedTrail={handleAddRecommendedTrail}
      />

      {/* Royal Emperor Ravana Lore & Biography Modal */}
      <EmperorLoreModal
        isOpen={isEmperorModalOpen}
        onClose={() => setIsEmperorModalOpen(false)}
        onExploreSigiriya={handleExploreSigiriya}
        onExploreVimanaNetwork={() => {
          setShowVimanaNetwork(true);
          setCurrentView('map');
        }}
      />
    </div>
  );
}
