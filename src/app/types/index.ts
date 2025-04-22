// Map related types
export interface MapMarker {
  id: string;
  position: [number, number]; // [latitude, longitude]
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

// Tile layer types
export type TileLayerType = 'standard' | 'satellite' | 'hybrid';

export interface TileLayerOption {
  id: TileLayerType;
  name: string;
  url: string;
  attribution: string;
  maxZoom?: number;
} 