export type TimelineCategory = 
  | 'palace' 
  | 'fortress' 
  | 'aviation' 
  | 'healing' 
  | 'water' 
  | 'cave';

export interface RavanaMilestone {
  id: string;
  order: number;
  period: string;
  title: string;
  ancientEvent: string;
  ancientSiteName: string;
  modernSiteName: string;
  district: string;
  province: string;
  coordinates: [number, number]; // [Latitude, Longitude]
  category: TimelineCategory;
  modernStatus: string;
  loreSnippet: string;
  travelTip: string;
  elevation: string;
  zoomLevel?: number;
}
