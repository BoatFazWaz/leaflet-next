"use client";

import dynamic from "next/dynamic";

// Dynamically import the Map component with no SSR
// This is necessary because Leaflet requires the window object
const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Map...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Leaflet Next Map</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Interactive Map Example
        </div>
      </header>
      
      <main className="flex-1 relative">
        <Map />
      </main>
    </div>
  );
}
