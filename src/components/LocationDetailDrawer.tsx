'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Compass,
  Scroll,
  Sparkles,
  BookOpen,
  Check,
  Plus,
  ExternalLink,
  Copy,
  CheckCheck,
  ShieldCheck,
  Mountain,
  Sun,
  Flame,
  Info,
  ChevronLeft,
  ChevronRight,
  Car,
  Clock,
  Footprints,
  Navigation,
} from 'lucide-react';
import { RavanaLocation } from '@/data/ravanaLocations';
import { useLanguage } from '@/context/LanguageContext';

interface LocationDetailDrawerProps {
  location: RavanaLocation | null;
  isOpen: boolean;
  onClose: () => void;
  isInTrail: boolean;
  onToggleTrail: (location: RavanaLocation) => void;
}

type DrawerTab = 'story' | 'archaeology' | 'guide';

interface TravelAdvisory {
  distanceKm: number;
  driveTime: string;
  vehicleAccess: string;
  vehicleType: 'car' | '4wd' | 'hike';
  roadNote: string;
  essentialGear: string[];
}

const SITE_TRAVEL_ADVISORY: Record<string, TravelAdvisory> = {
  'laggala-birthplace': {
    distanceKm: 175,
    driveTime: '4.5 hrs',
    vehicleAccess: '4WD / High-Clearance vehicle recommended for Meemure valley',
    vehicleType: '4wd',
    roadNote: 'Mountain winding roads and misty forest passes',
    essentialGear: ['Hiking boots', 'Rain jacket', 'Leech socks', 'Water 2L'],
  },
  'koneswaram-temple': {
    distanceKm: 260,
    driveTime: '5.5 hrs',
    vehicleAccess: 'All vehicles accessible to Fort Frederick gate',
    vehicleType: 'car',
    roadNote: 'A6 East Coast Highway to Trincomalee Swami Rock',
    essentialGear: ['Temple attire (knees & shoulders covered)', 'Slip-on shoes', 'Sun hat'],
  },
  'sigiriya-citadel': {
    distanceKm: 168,
    driveTime: '3.5 hrs (via Central Expressway)',
    vehicleAccess: 'All vehicles accessible (Car / Van / Bus)',
    vehicleType: 'car',
    roadNote: 'Paved highway and smooth provincial roads to visitor center',
    essentialGear: ['Sun hat / Sunscreen', 'Water bottle', 'Walking shoes', 'Camera'],
  },
  'wariyapola-airfield': {
    distanceKm: 98,
    driveTime: '2.5 hrs',
    vehicleAccess: 'All vehicles accessible via Kurunegala highway',
    vehicleType: 'car',
    roadNote: 'Smooth highway and provincial roads across historical plane',
    essentialGear: ['Walking shoes', 'Sun protection', 'Camera'],
  },
  'ritigala-sanctuary': {
    distanceKm: 185,
    driveTime: '4.0 hrs',
    vehicleAccess: 'All vehicles to Archaeological Forest Reserve base',
    vehicleType: 'car',
    roadNote: 'A9 highway, gravel pathway through nature reserve',
    essentialGear: ['Walking shoes', 'Insect repellent', 'Water bottle', 'Rain jacket'],
  },
  'hakgala-ashoka-vatika': {
    distanceKm: 165,
    driveTime: '4.5 hrs',
    vehicleAccess: 'All vehicles accessible (Nuwara Eliya - Badulla highway)',
    vehicleType: 'car',
    roadNote: 'Highland mountain highway through tea plantations',
    essentialGear: ['Warm sweater / Jacket', 'Umbrella', 'Walking shoes'],
  },
  'ravana-falls-cave': {
    distanceKm: 205,
    driveTime: '4.5 hrs',
    vehicleAccess: 'All vehicles accessible (Directly on Ella-Wellawaya road)',
    vehicleType: 'car',
    roadNote: 'Scenic winding hill country road through Ella gap',
    essentialGear: ['Sandals / Grip shoes', 'Camera', 'Cash for parking/tea'],
  },
  'nil-diya-pokuna': {
    distanceKm: 215,
    driveTime: '5.0 hrs',
    vehicleAccess: 'Car/Van accessible to base, local guide mandatory for cave descent',
    vehicleType: 'hike',
    roadNote: 'Steep hill road and underground rock descent',
    essentialGear: ['High-power Torch / Headlamp', 'Sturdy grip shoes', 'Extra change of clothes (muddy)'],
  },
  'rumassala-hill': {
    distanceKm: 125,
    driveTime: '1.5 hrs (via Southern Expressway to Galle)',
    vehicleAccess: 'All vehicles accessible up to Japanese Peace Pagoda',
    vehicleType: 'car',
    roadNote: 'Paved coastal road overlooking Galle harbor',
    essentialGear: ['Sunglasses', 'Sunscreen', 'Swimwear / Light clothes'],
  },
  'ussangoda-scorched-earth': {
    distanceKm: 210,
    driveTime: '3.0 hrs (via Southern Expressway to Barawakumbuka)',
    vehicleAccess: 'All vehicles to national park entrance, 500m walk to red cliff plateau',
    vehicleType: 'car',
    roadNote: 'Expressway + coastal tarmac road',
    essentialGear: ['Sun hat', 'Sunglasses', 'Camera for red earth landscapes', 'Water'],
  },
  'yudaganawa-battlefield': {
    distanceKm: 245,
    driveTime: '5.0 hrs',
    vehicleAccess: 'All vehicles accessible (Near Buttala)',
    vehicleType: 'car',
    roadNote: 'Smooth southern interior highway',
    essentialGear: ['Modest attire', 'Sun protection', 'Water bottle'],
  },
  'yahangala-resting-place': {
    distanceKm: 185,
    driveTime: '5.5 hrs',
    vehicleAccess: '4WD to Mahiyanganaya / Ududumbara base, 4-hour strenuous mountain hike',
    vehicleType: 'hike',
    roadNote: 'Wilderness foot trail across windswept rocky plateau',
    essentialGear: ['Hiking boots', 'Windbreaker', 'Camp tent (if overnight)', 'Water 3L', 'Leech protection'],
  },
};

const getTravelAdvisory = (id: string): TravelAdvisory => {
  return (
    SITE_TRAVEL_ADVISORY[id] || {
      distanceKm: 180,
      driveTime: '4.0 hrs',
      vehicleAccess: 'Car / Van accessible',
      vehicleType: 'car',
      roadNote: 'Paved provincial roads',
      essentialGear: ['Walking shoes', 'Water bottle', 'Camera'],
    }
  );
};

export const LocationDetailDrawer: React.FC<LocationDetailDrawerProps> = ({
  location,
  isOpen,
  onClose,
  isInTrail,
  onToggleTrail,
}) => {
  const { t, getChapterName, getLocationContent } = useLanguage();
  const [activeTab, setActiveTab] = useState<DrawerTab>('story');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [location?.id]);

  if (!location || !isOpen) return null;

  const content = getLocationContent(location.id);
  const advisory = getTravelAdvisory(location.id);
  const lat = location.coordinates[0];
  const lng = location.coordinates[1];
  const coordsFormatted = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
  const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  const photos =
    content.gallery && content.gallery.length > 0
      ? content.gallery
      : content.imageUrl
      ? [{ url: content.imageUrl, alt: content.imageAlt || content.title, caption: content.imageAlt }]
      : [];

  const currentPhoto = photos[activePhotoIndex] || photos[0];

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end pointer-events-auto">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 cursor-pointer animate-fadeIn"
      />

      {/* Slide-Over Drawer Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl h-full bg-slate-950/95 border-l border-amber-500/25 shadow-2xl backdrop-blur-2xl flex flex-col z-10 overflow-hidden animate-slideLeft"
      >
        {/* Decorative ambient gold glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Scenic Location Hero Banner / Interactive Multi-Photo Gallery */}
        {currentPhoto && (
          <div className="relative w-full overflow-hidden bg-slate-950 flex-shrink-0 group select-none">
            <div className="relative w-full h-52 sm:h-64 overflow-hidden">
              <img
                key={currentPhoto.url}
                src={currentPhoto.url}
                alt={currentPhoto.alt || content.title}
                className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
              />
              {/* Deep dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

              {/* Top action & tag over image */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-950/85 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {getChapterName(location.chapter)}
                </span>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md transition-all shadow-lg"
                  title="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prev / Next photo controls when multi-photo */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-amber-300 backdrop-blur-md transition-all shadow-lg z-10"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-amber-300 backdrop-blur-md transition-all shadow-lg z-10"
                    title="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 z-10">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === activePhotoIndex
                            ? 'w-5 bg-amber-400'
                            : 'w-2 bg-slate-600 hover:bg-slate-400'
                        }`}
                        title={`View photo ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Active Image caption */}
              <div className="absolute bottom-2.5 left-4 right-4 text-[11px] text-slate-300/90 italic truncate drop-shadow-md flex items-center justify-between gap-2 z-10">
                <span className="truncate">
                  📷 {currentPhoto.caption || currentPhoto.alt}
                </span>
                {photos.length > 1 && (
                  <span className="text-[10px] text-amber-400/90 font-mono font-medium flex-shrink-0 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/20">
                    {activePhotoIndex + 1}/{photos.length}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip (if multiple photos) */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
                {photos.map((p, idx) => (
                  <button
                    key={p.url}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      idx === activePhotoIndex
                        ? 'border-amber-400 shadow-md ring-1 ring-amber-400/50 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                    }`}
                    title={p.caption || p.alt}
                  >
                    <img src={p.url} alt={p.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Drawer Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-transparent">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-serif font-black text-xs shadow-md">
                #{String(location.order).padStart(2, '0')}
              </span>
              {!content.imageUrl && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {getChapterName(location.chapter)}
                </span>
              )}
            </div>

            {!content.imageUrl && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-100 tracking-wide mb-1">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base text-amber-400 font-medium font-sans mb-3">
            {content.subTitle}
          </p>

          {/* District & GPS Coordinates */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.districtLabel(content.district)}</span>
            </div>

            <button
              onClick={copyCoordinates}
              className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
              title="Copy GPS coordinates"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{coordsFormatted}</span>
              {copiedCoords ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Direct Google Maps Navigation Pill in Drawer Header */}
            <a
              href={googleMapsDirUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 rounded-lg border border-amber-500/35 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
              title="Open direct Google Maps directions"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          {/* Quick Metrics Badges (Difficulty, Best Season, Distance from Colombo) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Mountain className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.difficultyLabel}</div>
                <div className="text-xs font-semibold text-slate-200 truncate">{content.difficulty}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.bestSeasonLabel}</div>
                <div className="text-xs font-semibold text-slate-200 truncate">{content.bestTime}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">From Colombo</div>
                <div className="text-xs font-semibold text-amber-300 truncate">~{advisory.distanceKm} km ({advisory.driveTime})</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800/80 px-5 sm:px-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === 'story'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.tabStory}</span>
          </button>

          <button
            onClick={() => setActiveTab('archaeology')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === 'archaeology'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>{t.tabArchFolklore}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.tabGuide}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin text-slate-200">
          {/* TAB 1: STORY */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{t.narrativeTitle}</span>
                </div>
                <p className="font-serif text-slate-100 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{content.story}&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
                <h4 className="font-serif text-amber-300 font-bold text-sm">
                  {t.epicRealmTitle(content.title)}
                </h4>
                <p>
                  {t.epicRealmDesc(getChapterName(location.chapter))}
                </p>
              </div>

              {/* Highlights summary */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t.keyHighlights}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHAEOLOGY VS FOLKLORE */}
          {activeTab === 'archaeology' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Card 1: Archaeology Note */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.archTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {content.archaeologyNote}
                </p>
                <div className="mt-3 text-[11px] text-sky-300/70 font-mono">
                  {t.archSub}
                </div>
              </div>

              {/* Card 2: Folklore Note */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Flame className="w-4 h-4" />
                  <span>{t.folkloreTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {content.folkloreNote}
                </p>
                <div className="mt-3 text-[11px] text-amber-300/70 font-mono">
                  {t.folkloreSub}
                </div>
              </div>

              {/* Highlights Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.siteHighlightsTitle}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {content.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISITOR GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Distance & Travel Duration Card from Colombo */}
              {advisory && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                      <Car className="w-3.5 h-3.5" />
                      <span>Distance from Colombo</span>
                    </div>
                    <div className="text-base font-bold font-serif text-slate-100">
                      ~{advisory.distanceKm} km
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{advisory.driveTime}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                      <Footprints className="w-3.5 h-3.5" />
                      <span>Accessibility</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      {advisory.vehicleType === 'car' ? '🚗 Car / Van Access' : advisory.vehicleType === '4wd' ? '🚙 4WD Recommended' : '🥾 Foot Hike Required'}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {advisory.roadNote}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommended Gear Checklist */}
              {advisory && (
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recommended Travel Gear</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {advisory.essentialGear.map((item, gIdx) => (
                      <span
                        key={gIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>{t.travelInfoTitle}</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p>
                    <strong className="text-slate-100">{t.optimalWindowLabel}:</strong> {content.bestTime}
                  </p>
                  <p>
                    <strong className="text-slate-100">{t.physicalPrepLabel}:</strong> {content.difficulty}
                  </p>
                  <p>
                    <strong className="text-slate-100">{t.culturalEtiquetteLabel}:</strong> Modest attire and respectful conduct are recommended for these sacred sanctuaries.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <a
                  href={googleMapsDirUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-serif font-bold text-xs sm:text-sm transition-all shadow-md group cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Google Maps GPS Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <button
                  onClick={() => onToggleTrail(location)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-gold-glow ${
                    isInTrail
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                  }`}
                >
                  {isInTrail ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>{t.removeFromTrail}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t.addToTrail}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Pin Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between gap-3 text-xs">
          <a
            href={googleMapsDirUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.directionsBtn} (Google Maps)</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            onClick={() => onToggleTrail(location)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              isInTrail
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isInTrail ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.plannedInTrail}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addToTrail}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
