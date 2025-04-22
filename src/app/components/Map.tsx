'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Icon, LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Default center coordinates (Bangkok, Thailand)
const DEFAULT_CENTER = [13.7563, 100.5018];
const DEFAULT_ZOOM = 13;

// Map tile layers
const TILE_LAYERS = [
  {
    id: 'standard',
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_hybrid/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 20,
  },
];

// Sample markers data
const SAMPLE_MARKERS = [
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

// User location component
const LocationMarker = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const map = useMap();

  useEffect(() => {
    // Add event listener for location found
    map.on('locationfound', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    });

    // Add event listener for location error
    map.on('locationerror', () => {
      console.log('Location access denied or not available.');
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map]);

  return position ? (
    <Marker 
      position={position} 
      icon={new Icon({
        iconUrl: '/icons/user-location.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: '/icons/shadow.png',
        shadowSize: [41, 41]
      })}
    >
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
};

// Custom drawing component
const DrawControl = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // We need to dynamically import Leaflet Draw because it's not SSR compatible
    const addDrawControl = async () => {
      try {
        // Remove this line: import 'leaflet-draw/dist/leaflet.draw.css';
        const L = await import('leaflet-draw');
        const LeafletDraw = L.default || L;
        
        // Create a new FeatureGroup using Leaflet directly
        const drawnItems = new window.L.FeatureGroup();
        map.addLayer(drawnItems);
        
        // Set up the Leaflet.Draw controls
        const drawControl = new window.L.Control.Draw({
          draw: {
            polyline: {},
            polygon: {},
            circle: {},
            rectangle: {},
            marker: {}
          },
          edit: {
            featureGroup: drawnItems
          }
        });
        
        map.addControl(drawControl);
        
        // Event handler for when drawing is complete
        map.on('draw:created', (e) => {
          const layer = e.layer;
          drawnItems.addLayer(layer);
        });
      } catch (error) {
        console.error('Failed to load leaflet-draw:', error);
      }
    };
    
    addDrawControl();
    
    return () => {
      // Cleanup
    };
  }, [map]);
  
  return null;
};

const Map = () => {
  const [selectedTileLayer, setSelectedTileLayer] = useState('standard');
  const mapRef = useRef<LeafletMap | null>(null);
  
  // Fix for Leaflet icons in Next.js
  useEffect(() => {
    // This is needed for the markers to show up properly in Next.js
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: '/icons/location.svg',
      iconRetinaUrl: '/icons/location.svg',
      shadowUrl: '/icons/shadow.png',
    });
  }, []);
  
  const handleLocateUser = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16 });
    }
  }, []);

  const currentTileLayer = TILE_LAYERS.find(layer => layer.id === selectedTileLayer) || TILE_LAYERS[0];

  // Handler for map instance
  const MapEvents = () => {
    const map = useMapEvents({
      load: () => {
        mapRef.current = map;
      },
    });
    
    return null;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={DEFAULT_CENTER as [number, number]}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <MapEvents />
        <TileLayer
          url={currentTileLayer.url}
          attribution={currentTileLayer.attribution}
          maxZoom={currentTileLayer.maxZoom}
        />
        
        <LocationMarker />
        <DrawControl />
        
        {SAMPLE_MARKERS.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
          >
            <Popup>
              <div className="max-w-xs">
                <h3 className="font-bold text-lg">{marker.title}</h3>
                <p className="mt-1">{marker.description}</p>
                {marker.image && (
                  <img 
                    src={marker.image} 
                    alt={marker.title} 
                    className="mt-2 w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <button 
          onClick={handleLocateUser}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm"
          aria-label="Find my location"
        >
          📍 My Location
        </button>
        
        <div className="mt-2 bg-white dark:bg-gray-800 p-2 rounded-md">
          <div className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Map Style</div>
          <div className="flex flex-col gap-1">
            {TILE_LAYERS.map(layer => (
              <button
                key={layer.id}
                onClick={() => setSelectedTileLayer(layer.id)}
                className={`text-sm py-1 px-2 rounded-md ${
                  selectedTileLayer === layer.id 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {layer.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map; 