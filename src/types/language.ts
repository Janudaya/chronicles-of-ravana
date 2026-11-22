export type Language = 'en' | 'si' | 'hi';

export interface LocationImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface LocalizedLocationContent {
  title: string;
  subTitle: string;
  district: string;
  difficulty: string;
  bestTime: string;
  story: string;
  archaeologyNote: string;
  folkloreNote: string;
  highlights: string[];
  imageUrl?: string;
  imageAlt?: string;
  gallery?: LocationImage[];
}

export interface UITranslations {
  brandTitle: string;
  brandTag: string;
  brandSubtitle: string;
  allFootsteps: string;
  showingMyTrail: string;
  fitSriLanka: string;
  myTrailBtn: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  searchPlaceholder: string;
  sitesCount: (count: number, total: number) => string;
  clearFilters: string;
  noSitesTitle: string;
  noSitesDesc: string;
  resetFiltersBtn: string;
  inTrail: string;
  addToTrail: string;
  removeFromTrail: string;
  exploreLocation: string;
  districtLabel: (district: string) => string;
  coordsLabel: string;
  // Detail Drawer
  difficultyLabel: string;
  bestSeasonLabel: string;
  tabStory: string;
  tabArchFolklore: string;
  tabGuide: string;
  narrativeTitle: string;
  epicRealmTitle: (title: string) => string;
  epicRealmDesc: (chapter: string) => string;
  keyHighlights: string;
  archTitle: string;
  archSub: string;
  folkloreTitle: string;
  folkloreSub: string;
  siteHighlightsTitle: string;
  travelInfoTitle: string;
  optimalWindowLabel: string;
  physicalPrepLabel: string;
  culturalEtiquetteLabel: string;
  openGoogleMaps: string;
  directionsBtn: string;
  plannedInTrail: string;
  // My Trail Drawer
  myCustomTrail: string;
  myTrailSubtitle: string;
  stopsMetric: string;
  durationMetric: string;
  districtsMetric: string;
  daysFormat: (days: number) => string;
  viewRouteOnMap: string;
  showingTrailRoute: string;
  shareItinerary: string;
  itineraryCopied: string;
  emptyTrailTitle: string;
  emptyTrailDesc: string;
  addRecommendedTrail: string;
  stopsSequenced: (count: number) => string;
  shareHeader: string;
  shareDuration: (stops: number, days: number) => string;
  shareDistricts: string;
  shareStopNumber: (stop: number) => string;
  shareFooter: string;
  // Map Legend
  mapOverview: string;
  sitesActive: (count: number) => string;
  legendPolyline: string;
  legendSites: string;
  // Mobile Controls
  showStories: string;
  expandMap: string;
  // Audio Guide Bar
  audioGuide: string;
  nowNarrating: string;
  selectSiteToListen: string;
  audioSpeed: string;
  playAudio: string;
  pauseAudio: string;
  stopAudio: string;
  // Vimana Flight Network
  vimanaNetwork: string;
  vimanaSub: string;
  vimanaAirfields: string;
  // Hero Landing Page
  heroLandingTag: string;
  heroLandingTitle: string;
  heroLandingSubtitle: string;
  heroLandingDesc: string;
  heroBtnBegin: string;
  heroBtnDirectMap: string;
  heroFeature1Title: string;
  heroFeature1Desc: string;
  heroFeature2Title: string;
  heroFeature2Desc: string;
  heroFeature3Title: string;
  heroFeature3Desc: string;
  heroFeature4Title: string;
  heroFeature4Desc: string;
  heroChaptersTitle: string;
  heroChaptersSubtitle: string;
  navModeOverview: string;
  navModeMap: string;
  // Map Layers
  styleDark: string;
  styleSatellite: string;
}
