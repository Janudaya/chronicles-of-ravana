'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RavanaLocation } from '@/data/ravanaLocations';
import { MapController } from './MapController';
import { Compass, Check, Plus, Eye, MapPin, Plane, Moon, Layers, Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RavanaMapProps {
  locations: RavanaLocation[];
  allLocations: RavanaLocation[];
  activeLocation: RavanaLocation | null;
  trailIds: Set<string>;
  isTrailOnlyMode: boolean;
  resetViewTrigger: number;
  showVimanaNetwork?: boolean;
  onToggleVimanaNetwork?: () => void;
  onSelectLocation: (location: RavanaLocation) => void;
  onExploreLocation: (location: RavanaLocation) => void;
  onToggleTrail: (location: RavanaLocation, e: React.MouseEvent) => void;
  onResetView: () => void;
}

// 4 Ancient Vimana Ports
interface VimanaAirfield {
  id: string;
  name: string;
  sinhalaName: string;
  coordinates: [number, number];
  role: string;
}

const VIMANA_PORTS: VimanaAirfield[] = [
  {
    id: 'sigiriya-citadel',
    name: 'Sigiriya (Alakamandawa)',
    sinhalaName: 'සීගිරිය ආලකමන්දාව',
    coordinates: [7.9570, 80.7603],
    role: 'Central Sky Citadel & Command Hub',
  },
  {
    id: 'wariyapola-airfield',
    name: 'Wariyapola (Vimana Port)',
    sinhalaName: 'වාරියපොළ ගුවන් තොටුපළ',
    coordinates: [7.6258, 80.2442],
    role: 'Western Wind-Chariot Aerodrome',
  },
  {
    id: 'ravana-falls-cave',
    name: 'Ravana Falls & Cave',
    sinhalaName: 'රාවණා ඇල්ල සහ ගුහාව',
    coordinates: [6.8409, 81.0543],
    role: 'Highland Subterranean Hangar',
  },
  {
    id: 'ussangoda-scorched-earth',
    name: 'Ussangoda Plateau',
    sinhalaName: 'උස්සන්ගොඩ ධාවන පථය',
    coordinates: [6.0964, 80.9867],
    role: 'Southern Coastal Thermal Runway',
  },
];

// Helper to calculate realistic curved quadratic Bezier arcs between two GPS coordinates
const computeCurvedArcPoints = (
  start: [number, number],
  end: [number, number],
  bowMultiplier = 0.16,
  numPoints = 35
): [number, number][] => {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);

  // Normal vector perpendicular to chord
  const normLat = -dLng / dist;
  const normLng = dLat / dist;

  const offset = dist * bowMultiplier;
  const ctrlLat = midLat + normLat * offset;
  const ctrlLng = midLng + normLng * offset;

  const curve: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const invT = 1 - t;
    const lat = invT * invT * lat1 + 2 * invT * t * ctrlLat + t * t * lat2;
    const lng = invT * invT * lng1 + 2 * invT * t * ctrlLng + t * t * lng2;
    curve.push([lat, lng]);
  }
  return curve;
};

// Function to generate high-fidelity glowing golden marker icon
const createGoldenMarkerIcon = (
  order: number,
  isActive: boolean,
  isInTrail: boolean
) => {
  const size = isActive ? 42 : 34;
  const half = size / 2;

  const html = `
    <div style="width: ${size}px; height: ${size}px;" class="relative flex items-center justify-center cursor-pointer select-none transition-transform duration-300 ${
      isActive ? 'z-50' : 'hover:scale-110'
    }">
      <!-- Outer Glowing Pulse (for active marker) -->
      ${
        isActive
          ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(245, 158, 11, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ''
      }

      <!-- Soft Halo Shadow -->
      <div style="
        position: absolute;
        inset: 0px;
        border-radius: 9999px;
        background: ${isActive ? 'rgba(245, 158, 11, 0.55)' : 'rgba(217, 119, 6, 0.25)'};
        box-shadow: ${
          isActive
            ? '0 0 24px 6px rgba(245, 158, 11, 0.8), 0 0 10px rgba(254, 240, 138, 0.9)'
            : '0 0 12px 2px rgba(245, 158, 11, 0.35)'
        };
      "></div>

      <!-- Core Disc -->
      <div style="
        width: ${size - 8}px;
        height: ${size - 8}px;
        border-radius: 9999px;
        background: radial-gradient(circle at 35% 35%, #FDE68A 0%, #F59E0B 50%, #92400E 100%);
        border: ${isActive ? '2.5px solid #FFFFFF' : '2px solid rgba(253, 230, 138, 0.9)'};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
        color: #0B0F19;
        font-family: 'Cinzel', serif;
        font-weight: 800;
        font-size: ${isActive ? '13px' : '11px'};
      ">
        ${order}
      </div>

      <!-- In Trail Badge -->
      ${
        isInTrail
          ? `<div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 15px;
              height: 15px;
              border-radius: 9999px;
              background: #10B981;
              border: 1.5px solid #0B0F19;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 9px;
              font-weight: bold;
              box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            ">✓</div>`
          : ''
      }
    </div>
  `;

  return L.divIcon({
    className: 'custom-gold-marker',
    html,
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half],
  });
};

// Function to generate futuristic cyan beacon icon for ancient Vimana ports
const createVimanaBeaconIcon = () => {
  const html = `
    <div style="width: 32px; height: 32px;" class="relative flex items-center justify-center cursor-pointer select-none">
      <!-- Radar Ping Outer Ring -->
      <div style="position: absolute; inset: -4px; border-radius: 9999px; border: 1.5px solid rgba(6, 182, 212, 0.8); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      
      <!-- Cyan Glow Aura -->
      <div style="position: absolute; inset: 0px; border-radius: 9999px; background: rgba(6, 182, 212, 0.35); box-shadow: 0 0 16px 4px rgba(6, 182, 212, 0.7);"></div>
      
      <!-- Inner Core Aircraft Beacon -->
      <div style="
        width: 22px;
        height: 22px;
        border-radius: 9999px;
        background: radial-gradient(circle, #A5F3FC 0%, #06B6D4 60%, #083344 100%);
        border: 2px solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #083344;
        box-shadow: 0 2px 8px rgba(0,0,0,0.8);
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-vimana-beacon',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Imperative Basemap Controller for Leaflet (Ensures instant, clean switching without DOM artifacts or layer conflicts)
const TileLayerController: React.FC<{ mapStyle: 'dark' | 'satellite' }> = ({ mapStyle }) => {
  const map = useMap();

  useEffect(() => {
    let layer: L.TileLayer;
    if (mapStyle === 'satellite') {
      // High-resolution Google Hybrid Satellite (Vivid natural vegetation, mountain terrain, and crisp place labels)
      layer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Satellite Imagery &bull; Natural Earth Terrain',
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        className: 'satellite-tiles',
      });
    } else {
      // Free Cinematic Dark Mode OpenStreetMap (No API key, darkened via CSS filter)
      layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: 'dark-osm-tiles',
      });
    }

    layer.addTo(map);

    return () => {
      if (map && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    };
  }, [map, mapStyle]);

  return null;
};

// Interactive Marker Popup Content (Direct native listeners + pointer handlers to guarantee clicks are never swallowed by Leaflet's DOM event wrapper)
const MarkerPopupContent: React.FC<{
  loc: RavanaLocation;
  isInTrail: boolean;
  content: ReturnType<ReturnType<typeof useLanguage>['getLocationContent']>;
  onExploreLocation: (loc: RavanaLocation) => void;
  onToggleTrail: (loc: RavanaLocation, e: React.MouseEvent) => void;
  t: ReturnType<typeof useLanguage>['t'];
  getChapterName: (chapter: string) => string;
}> = ({ loc, isInTrail, content, onExploreLocation, onToggleTrail, t, getChapterName }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const exploreBtn = el.querySelector<HTMLButtonElement>('[data-action="explore"]');
    const trailBtn = el.querySelector<HTMLButtonElement>('[data-action="trail"]');

    const handleExplore = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      onExploreLocation(loc);
    };

    const handleTrail = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleTrail(loc, e as any);
    };

    if (exploreBtn) {
      exploreBtn.addEventListener('click', handleExplore);
      exploreBtn.addEventListener('touchend', handleExplore);
    }
    if (trailBtn) {
      trailBtn.addEventListener('click', handleTrail);
      trailBtn.addEventListener('touchend', handleTrail);
    }

    return () => {
      if (exploreBtn) {
        exploreBtn.removeEventListener('click', handleExplore);
        exploreBtn.removeEventListener('touchend', handleExplore);
      }
      if (trailBtn) {
        trailBtn.removeEventListener('click', handleTrail);
        trailBtn.removeEventListener('touchend', handleTrail);
      }
    };
  }, [loc, onExploreLocation, onToggleTrail]);

  return (
    <div ref={containerRef} className="p-3.5 max-w-xs text-slate-100 bg-slate-900/95 rounded-xl border border-amber-500/30">
      {/* Thumbnail Photo Preview */}
      {content.imageUrl && (
        <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2.5 bg-slate-950">
          <img
            src={content.imageUrl}
            alt={content.imageAlt || content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          {content.gallery && content.gallery.length > 1 && (
            <span className="absolute bottom-1.5 right-2 text-[10px] font-semibold text-amber-300 bg-slate-950/85 px-1.5 py-0.5 rounded border border-amber-500/30">
              📷 {content.gallery.length} Photos
            </span>
          )}
        </div>
      )}

      {/* Popup Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-serif font-bold text-xs">
          #{loc.order}
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          {getChapterName(loc.chapter)}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-serif font-bold text-sm text-slate-100 mb-0.5">
        {content.title}
      </h4>
      <p className="text-xs text-amber-400 font-sans mb-2 font-medium">
        {content.subTitle}
      </p>

      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          {content.district}
        </span>
        <span>&bull;</span>
        <span className="text-amber-300 font-medium">{content.difficulty}</span>
      </div>

      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
        {content.story}
      </p>

      {/* Popup Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          data-action="explore"
          type="button"
          onClick={() => onExploreLocation(loc)}
          onPointerUp={() => onExploreLocation(loc)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer select-none"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.exploreLocation}</span>
        </button>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates[0]},${loc.coordinates[1]}&travelmode=driving`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/50 transition-colors flex items-center justify-center cursor-pointer"
          title="Direct Google Maps Navigation"
          onClick={(e) => e.stopPropagation()}
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
        </a>

        <button
          data-action="trail"
          type="button"
          onClick={(e) => onToggleTrail(loc, e)}
          onPointerUp={(e) => onToggleTrail(loc, e as any)}
          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer select-none ${
            isInTrail
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/50'
          }`}
          title={isInTrail ? t.removeFromTrail : t.addToTrail}
        >
          {isInTrail ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export const RavanaMap: React.FC<RavanaMapProps> = ({
  locations,
  allLocations,
  activeLocation,
  trailIds,
  isTrailOnlyMode,
  resetViewTrigger,
  showVimanaNetwork: externalShowVimana,
  onToggleVimanaNetwork: externalToggleVimana,
  onSelectLocation,
  onExploreLocation,
  onToggleTrail,
  onResetView,
}) => {
  const { t, getChapterName, getLocationContent } = useLanguage();

  // Local state for Vimana toggle if not controlled externally
  const [localShowVimana, setLocalShowVimana] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');
  const showVimana = externalShowVimana !== undefined ? externalShowVimana : localShowVimana;
  const toggleVimana = externalToggleVimana || (() => setLocalShowVimana((p) => !p));

  // Sort locations by order for continuous polyline trail
  const trailLocations = useMemo(() => {
    return [...locations].sort((a, b) => a.order - b.order);
  }, [locations]);

  // Coordinates array for polyline
  const polylineCoords = useMemo(() => {
    return trailLocations.map((loc) => loc.coordinates);
  }, [trailLocations]);

  // Pre-calculate curved aerial flight arcs between the 4 ancient Vimana ports
  const vimanaArcs = useMemo(() => {
    const pSigiriya = VIMANA_PORTS.find((p) => p.id === 'sigiriya-citadel')!.coordinates;
    const pWariyapola = VIMANA_PORTS.find((p) => p.id === 'wariyapola-airfield')!.coordinates;
    const pRavanaFalls = VIMANA_PORTS.find((p) => p.id === 'ravana-falls-cave')!.coordinates;
    const pUssangoda = VIMANA_PORTS.find((p) => p.id === 'ussangoda-scorched-earth')!.coordinates;

    return [
      // Corridor 1: Wariyapola <-> Sigiriya (Aviation port to Sky Fortress)
      computeCurvedArcPoints(pWariyapola, pSigiriya, 0.18),
      // Corridor 2: Sigiriya <-> Ravana Falls (Sky Citadel to Highland Caverns)
      computeCurvedArcPoints(pSigiriya, pRavanaFalls, 0.15),
      // Corridor 3: Ravana Falls <-> Ussangoda (Ella mountains to Southern Coastal runway)
      computeCurvedArcPoints(pRavanaFalls, pUssangoda, 0.16),
      // Corridor 4: Wariyapola <-> Ussangoda (Western coastline to Southern thermal strip)
      computeCurvedArcPoints(pWariyapola, pUssangoda, -0.22),
      // Corridor 5: Wariyapola <-> Ravana Falls (Cross-island aviation diagonal)
      computeCurvedArcPoints(pWariyapola, pRavanaFalls, 0.12),
    ];
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-obsidian">
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={8}
        minZoom={7}
        maxZoom={16}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapController
          activeLocation={activeLocation}
          resetViewTrigger={resetViewTrigger}
        />

        {/* Dynamic Basemap with Imperative Controller (Google Hybrid Satellite & Dark Mode) */}
        <TileLayerController mapStyle={mapStyle} />

        {/* 1. Ground Chronological Journey Polyline (Golden) */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#F59E0B',
              weight: 6,
              opacity: 0.22,
              lineCap: 'round',
            }}
          />
        )}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#F59E0B',
              weight: 2.5,
              opacity: 0.85,
              dashArray: '7, 9',
              lineCap: 'round',
            }}
          />
        )}

        {/* 2. Ancient Vimana Aerial Flight Network (Glowing Curved Arcs) */}
        {showVimana && (
          <>
            {/* Render curved aerial arcs with double-layered electric cyan glow */}
            {vimanaArcs.map((arcCoords, idx) => (
              <React.Fragment key={`vimana-arc-${idx}`}>
                {/* Outer Electric Cyan Glow */}
                <Polyline
                  positions={arcCoords}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 7,
                    opacity: 0.38,
                    lineCap: 'round',
                  }}
                />
                {/* Inner Bright Neon Aerial Core with animated flight dashes */}
                <Polyline
                  positions={arcCoords}
                  pathOptions={{
                    color: '#A5F3FC',
                    weight: 2.5,
                    opacity: 0.95,
                    dashArray: '8, 12',
                    lineCap: 'round',
                  }}
                />
              </React.Fragment>
            ))}

            {/* Glowing Vimana Beacon Markers on the 4 Airfields */}
            {VIMANA_PORTS.map((port) => (
              <Marker
                key={`vimana-port-${port.id}`}
                position={port.coordinates}
                icon={createVimanaBeaconIcon()}
                zIndexOffset={100}
                eventHandlers={{
                  click: (e) => {
                    const matched = allLocations.find((l) => l.id === port.id);
                    if (matched) onSelectLocation(matched);
                    if (e.target && e.target._map) {
                      e.target._map.flyTo(port.coordinates, 13, {
                        duration: 1.8,
                        easeLinearity: 0.25,
                      });
                    }
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
                  <div className="bg-slate-950 px-2 py-1 rounded text-cyan-300 text-[11px] font-bold border border-cyan-500/50">
                    ✈ {port.name} &bull; {port.role}
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </>
        )}

        {/* 3. Primary Location Markers */}
        {locations.map((loc) => {
          const isActive = activeLocation?.id === loc.id;
          const isInTrail = trailIds.has(loc.id);
          const icon = createGoldenMarkerIcon(loc.order, isActive, isInTrail);
          const content = getLocationContent(loc.id);

          return (
            <Marker
              key={loc.id}
              position={loc.coordinates}
              icon={icon}
              eventHandlers={{
                click: (e) => {
                  onSelectLocation(loc);
                  if (e.target && e.target._map) {
                    e.target._map.flyTo(loc.coordinates, 13, {
                      duration: 1.8,
                      easeLinearity: 0.25,
                    });
                  }
                },
              }}
            >
              <Popup className="ravana-custom-popup" autoPan={false}>
                <MarkerPopupContent
                  loc={loc}
                  isInTrail={isInTrail}
                  content={content}
                  onExploreLocation={onExploreLocation}
                  onToggleTrail={onToggleTrail}
                  t={t}
                  getChapterName={getChapterName}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating 'Show Vimana Flight Network' Toggle Switch (Top-Left of Map) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div
          onClick={toggleVimana}
          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl backdrop-blur-xl border transition-all cursor-pointer shadow-xl ${
            showVimana
              ? 'bg-slate-950/95 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
              : 'bg-slate-950/85 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Plane Icon */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              showVimana
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <Plane
              className={`w-4 h-4 transition-transform duration-300 ${
                showVimana ? 'rotate-45 text-cyan-400 scale-110' : ''
              }`}
            />
          </div>

          {/* Labels */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-bold tracking-wide transition-colors ${
                  showVimana ? 'text-cyan-300' : 'text-slate-300'
                }`}
              >
                {t.vimanaNetwork}
              </span>
              {showVimana && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              {t.vimanaAirfields} (Sigiriya, Wariyapola, Ella, Ussangoda)
            </span>
          </div>

          {/* Toggle Switch */}
          <div
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              showVimana ? 'bg-cyan-500 shadow-[0_0_12px_#06B6D4]' : 'bg-slate-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                showVimana ? 'translate-x-4' : 'translate-x-0 bg-slate-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Floating Map Style Switcher (Top-Right of Map) */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto">
        <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-amber-500/30 shadow-xl backdrop-blur-md">
          <button
            onClick={() => setMapStyle('dark')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              mapStyle === 'dark'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
            title="Cinematic Dark Mode (100% Free, No Watermark)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.styleDark}</span>
          </button>

          <button
            onClick={() => setMapStyle('satellite')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              mapStyle === 'satellite'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
            title="Real Satellite Terrain (100% Free, No Watermark)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.styleSatellite}</span>
          </button>
        </div>
      </div>

      {/* Floating Map Legend (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-10 hidden sm:block pointer-events-auto">
        <div className="p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/25 shadow-2xl text-xs space-y-2 max-w-xs">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5">
            <span className="font-serif font-bold text-amber-400 text-xs tracking-wider">
              {t.mapOverview}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {t.sitesActive(locations.length)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-amber-400"></div>
            <span>{t.legendPolyline}</span>
          </div>

          {/* Dynamic Legend Item for Vimana Network */}
          {showVimana && (
            <div className="flex items-center gap-2 text-cyan-300 text-[11px] font-medium">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-cyan-400 shadow-[0_0_8px_#06B6D4]"></div>
              <span>{t.vimanaNetwork} (Curved Arcs)</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-white flex items-center justify-center text-[8px] font-bold text-slate-950">
              #
            </div>
            <span>{t.legendSites}</span>
          </div>
        </div>
      </div>

      {/* Floating Compass / Reset Button (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-10 pointer-events-auto">
        <button
          onClick={onResetView}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all group"
          title={t.fitSriLanka}
        >
          <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className="hidden sm:inline">{t.fitSriLanka}</span>
        </button>
      </div>
    </div>
  );
};

export default RavanaMap;
