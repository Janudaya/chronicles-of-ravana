'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { RavanaLocation } from '@/data/ravanaLocations';

interface MapControllerProps {
  activeLocation: RavanaLocation | null;
  resetViewTrigger: number;
}

export const MapController: React.FC<MapControllerProps> = ({
  activeLocation,
  resetViewTrigger,
}) => {
  const map = useMap();
  const prevTrigger = useRef(resetViewTrigger);

  // Animate map when activeLocation changes with cinematic aerial flyTo
  useEffect(() => {
    if (activeLocation) {
      map.flyTo(activeLocation.coordinates, 13, {
        duration: 2.0,
        easeLinearity: 0.2,
      });
    }
  }, [activeLocation, map]);

  // Handle overview reset
  useEffect(() => {
    if (resetViewTrigger !== prevTrigger.current) {
      prevTrigger.current = resetViewTrigger;
      map.flyTo([7.8731, 80.7718], 8, {
        duration: 1.5,
      });
    }
  }, [resetViewTrigger, map]);

  return null;
};
