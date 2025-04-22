// Default center coordinates (New York City)
export const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];
export const DEFAULT_ZOOM = 13;

// Map tile layers
export const TILE_LAYERS = [
  {
    id: 'standard' as const,
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: 'satellite' as const,
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  {
    id: 'hybrid' as const,
    name: 'Hybrid',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_hybrid/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 20,
  },
];

// Sample markers data
export const SAMPLE_MARKERS = [
  {
    id: '1',
    position: [40.7128, -74.0060] as [number, number],
    title: 'New York City',
    description: 'The Big Apple',
    image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    position: [40.7580, -73.9855] as [number, number],
    title: 'Empire State Building',
    description: 'Iconic skyscraper in Midtown Manhattan',
    image: 'https://images.unsplash.com/photo-1550664890-c5e34a6cad31?q=80&w=1000&auto=format&fit=crop',
  },
]; 