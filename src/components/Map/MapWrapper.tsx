'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RavanaLocation } from '@/data/ravanaLocations';
import { Loader2 } from 'lucide-react';

interface MapWrapperProps {
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

// Map Loading Skeleton with cinematic dark & gold aura
const MapLoadingSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-obsidian text-slate-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.08),transparent_70%)]" />
    <div className="relative flex flex-col items-center gap-3 z-10">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-gold-glow animate-pulse">
        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
      </div>
      <p className="font-serif tracking-widest text-sm text-amber-300/90 font-bold uppercase">
        Initializing Sacred Cartography
      </p>
      <p className="text-xs text-slate-500 font-light">
        Plotting 12 ancient coordinates across Sri Lanka...
      </p>
    </div>
  </div>
);

// Dynamically import RavanaMap with SSR disabled
const DynamicRavanaMap = dynamic(() => import('./RavanaMap'), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicRavanaMap {...props} />;
};

export default MapWrapper;
