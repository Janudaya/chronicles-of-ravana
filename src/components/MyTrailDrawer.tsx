'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Compass,
  Share2,
  Trash2,
  CheckCheck,
  Eye,
  Route,
  Sparkles,
  Navigation,
  Download,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { RavanaLocation } from '@/data/ravanaLocations';
import { useLanguage } from '@/context/LanguageContext';

interface MyTrailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trailLocations: RavanaLocation[];
  onRemoveLocation: (id: string) => void;
  onClearTrail: () => void;
  onSelectLocation: (location: RavanaLocation) => void;
  onExploreLocation: (location: RavanaLocation) => void;
  isTrailOnlyMode: boolean;
  onToggleTrailOnlyMode: () => void;
  onAddRecommendedTrail: () => void;
}

export const MyTrailDrawer: React.FC<MyTrailDrawerProps> = ({
  isOpen,
  onClose,
  trailLocations,
  onRemoveLocation,
  onClearTrail,
  onSelectLocation,
  onExploreLocation,
  isTrailOnlyMode,
  onToggleTrailOnlyMode,
  onAddRecommendedTrail,
}) => {
  const { t, getLocationContent } = useLanguage();
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  // Calculate unique localized districts
  const districts = Array.from(
    new Set(trailLocations.map((l) => getLocationContent(l.id).district))
  );

  // Estimate travel duration: roughly 2-3 stops per day
  const estimatedDays = Math.max(1, Math.ceil(trailLocations.length / 2.5));

  // Copy formatted itinerary to clipboard in current language
  const handleShareItinerary = () => {
    if (trailLocations.length === 0) return;

    let text = `${t.shareHeader}\n`;
    text += `${t.shareDuration(trailLocations.length, estimatedDays)}\n`;
    text += `${t.shareDistricts}: ${districts.join(', ')}\n\n`;

    trailLocations.forEach((loc, idx) => {
      const content = getLocationContent(loc.id);
      text += `📍 ${t.shareStopNumber(idx + 1)}: ${content.title} (${content.subTitle})\n`;
      text += `   • ${t.districtLabel(content.district)} | ${content.difficulty}\n`;
      text += `   • GPS: ${loc.coordinates[0]}, ${loc.coordinates[1]}\n`;
      text += `   • ${content.story}\n\n`;
    });

    text += t.shareFooter;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Open Multi-Stop driving route in Google Maps
  const handleOpenMultiStopGoogleMaps = () => {
    if (trailLocations.length === 0) return;
    if (trailLocations.length === 1) {
      const lat = trailLocations[0].coordinates[0];
      const lng = trailLocations[0].coordinates[1];
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
      return;
    }

    const origin = `${trailLocations[0].coordinates[0]},${trailLocations[0].coordinates[1]}`;
    const destination = `${trailLocations[trailLocations.length - 1].coordinates[0]},${trailLocations[trailLocations.length - 1].coordinates[1]}`;

    // Intermediate stops as waypoints
    const waypoints = trailLocations
      .slice(1, -1)
      .map((loc) => `${loc.coordinates[0]},${loc.coordinates[1]}`)
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    window.open(url, '_blank');
  };

  // Share formatted itinerary directly to WhatsApp
  const handleWhatsAppShare = () => {
    if (trailLocations.length === 0) return;

    let text = `👑 *CHRONICLES OF RAVANA — EXPEDITION ITINERARY*\n`;
    text += `🇱🇰 ${trailLocations.length} Sacred Stops across ${districts.join(', ')} (${estimatedDays} Days)\n\n`;

    trailLocations.forEach((loc, idx) => {
      const content = getLocationContent(loc.id);
      text += `*Stop ${idx + 1}: ${content.title}*\n`;
      text += `📍 ${content.district} • ${content.difficulty} • Best Window: ${content.bestTime}\n`;
      text += `🗺️ Google Maps: https://www.google.com/maps/search/?api=1&query=${loc.coordinates[0]},${loc.coordinates[1]}\n\n`;
    });

    text += `✨ Planned via Chronicles of Ravana\n`;
    text += `Crafted by Janudaya (janudayakavinda@gmail.com)\n`;
    text += `Explore: http://localhost:3000`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Download offline trip plan as formatted text document
  const handleDownloadItinerary = () => {
    if (trailLocations.length === 0) return;

    let content = `====================================================\n`;
    content += `CHRONICLES OF RAVANA — EXPEDITION TRAVEL ITINERARY\n`;
    content += `A Sacred Journey Across Ancient Lanka\n`;
    content += `Conceived & Developed by Janudaya (janudayakavinda@gmail.com)\n`;
    content += `====================================================\n\n`;
    content += `SUMMARY:\n`;
    content += `Total Sacred Stops: ${trailLocations.length}\n`;
    content += `Estimated Duration: ${estimatedDays} Days\n`;
    content += `Districts Covered: ${districts.join(', ')}\n\n`;
    content += `----------------------------------------------------\n`;
    content += `DETAILED STOPS & TRAVEL DIRECTIONS:\n`;
    content += `----------------------------------------------------\n\n`;

    trailLocations.forEach((loc, idx) => {
      const item = getLocationContent(loc.id);
      content += `[STOP ${idx + 1} OF ${trailLocations.length}] ${item.title.toUpperCase()}\n`;
      content += `Sub-title: ${item.subTitle}\n`;
      content += `District: ${item.district}\n`;
      content += `Difficulty: ${item.difficulty}\n`;
      content += `Recommended Season: ${item.bestTime}\n`;
      content += `GPS Coordinates: ${loc.coordinates[0]} N, ${loc.coordinates[1]} E\n`;
      content += `Google Maps Link: https://www.google.com/maps/search/?api=1&query=${loc.coordinates[0]},${loc.coordinates[1]}\n\n`;
      content += `HISTORICAL & SACRED LORE:\n${item.story}\n\n`;
      content += `ARCHAEOLOGY & MYTHOLOGY:\n${item.archaeologyNote}\n${item.folkloreNote}\n\n`;
      content += `KEY HIGHLIGHTS:\n${item.highlights.map((h) => ' - ' + h).join('\n')}\n`;
      content += `----------------------------------------------------\n\n`;
    });

    content += `TRAVEL ADVICE FOR SRI LANKAN HIGHLANDS:\n`;
    content += `1. Modest clothing covering knees and shoulders is required at temple and sacred sites.\n`;
    content += `2. Carry drinking water (min 2L per hiker) and rain protection.\n`;
    content += `3. For mountain watchtowers like Lakegala and Yahangala, start ascents by 6:00 AM.\n`;
    content += `4. Ensure mobile phones and GPS devices are fully charged.\n\n`;
    content += `(c) 2026 Chronicles of Ravana. All Rights Reserved.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ravana_Expedition_Itinerary_${trailLocations.length}_Stops.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 cursor-pointer animate-fadeIn"
      />

      {/* Drawer Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl h-full bg-slate-950/95 border-l border-amber-500/25 shadow-2xl backdrop-blur-2xl flex flex-col z-10 overflow-hidden animate-slideLeft"
      >
        {/* Ambient Gold glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Drawer Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-transparent">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Route className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-100 tracking-wide">
                {t.myCustomTrail}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-light mb-4">
            {t.myTrailSubtitle}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.stopsMetric}</div>
              <div className="text-base font-bold text-amber-400 font-serif">
                {trailLocations.length}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.durationMetric}</div>
              <div className="text-base font-bold text-slate-200 font-serif">
                {trailLocations.length > 0 ? t.daysFormat(estimatedDays) : '—'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.districtsMetric}</div>
              <div className="text-base font-bold text-slate-200 font-serif">
                {districts.length}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        {trailLocations.length > 0 && (
          <div className="p-3 sm:px-6 bg-slate-900/60 border-b border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                onClick={onToggleTrailOnlyMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isTrailOnlyMode
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-amber-300'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                <span>{isTrailOnlyMode ? t.showingTrailRoute : t.viewRouteOnMap}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {/* WhatsApp Share Button */}
                <button
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-medium transition-all"
                  title="Share Expedition via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Download Offline Plan Button */}
                <button
                  onClick={handleDownloadItinerary}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-medium transition-all"
                  title="Download Offline Text Trip Plan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Offline</span>
                </button>

                {/* Copy Text Button */}
                <button
                  onClick={handleShareItinerary}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 font-medium transition-all"
                  title="Copy formatted itinerary to clipboard"
                >
                  {copiedShare ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{copiedShare ? 'Copied' : 'Copy'}</span>
                </button>

                {/* Clear Trail */}
                <button
                  onClick={onClearTrail}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Clear all stops from trail"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trail Stops List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 scrollbar-thin">
          {trailLocations.length > 0 ? (
            trailLocations.map((loc, index) => {
              const content = getLocationContent(loc.id);
              return (
                <div
                  key={loc.id}
                  className="group relative p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {content.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950 border border-slate-800">
                          <img
                            src={content.imageUrl}
                            alt={content.imageAlt || content.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-0 left-0 w-4 h-4 bg-amber-500 text-slate-950 font-serif font-black text-[10px] flex items-center justify-center rounded-br">
                            {index + 1}
                          </span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-serif font-black text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                      )}

                      <div>
                        <h4 className="font-serif font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                          {content.title}
                        </h4>
                        <p className="text-xs text-amber-400/90 font-sans mb-1">
                          {content.subTitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {content.district}
                          </span>
                          <span>&bull;</span>
                          <span className="text-amber-400/80">{content.difficulty}</span>
                          <span>&bull;</span>
                          <span className="text-slate-500">{content.bestTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for individual item */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          onSelectLocation(loc);
                          onClose();
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-md transition-colors"
                        title="Fly to location on map"
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onExploreLocation(loc);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-md transition-colors"
                        title="Open full location details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemoveLocation(loc.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                        title="Remove from custom trail"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <Route className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="font-serif text-slate-200 text-base font-bold mb-1">
                {t.emptyTrailTitle}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed">
                {t.emptyTrailDesc}
              </p>

              <button
                onClick={onAddRecommendedTrail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.addRecommendedTrail}</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {trailLocations.length > 0 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-400 text-center sm:text-left">
              <span className="font-semibold text-slate-200">{trailLocations.length} sacred stops</span>
              <span className="hidden sm:inline text-slate-500"> • Multi-stop route ready</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenMultiStopGoogleMaps}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-serif shadow-gold-glow transition-all"
                title="Launch Google Maps driving directions with all stops"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
                title="Share via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
