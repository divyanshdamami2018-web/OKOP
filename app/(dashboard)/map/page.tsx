'use client';

import 'leaflet/dist/leaflet.css'; // Moved here from root layout — only load on map page
import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Info, Layers } from 'lucide-react';

// CampusMap uses Leaflet which requires browser APIs — always SSR:false
const CampusMap = dynamic(() => import('@/components/map/CampusMap').then(m => ({ default: m.CampusMap })), {
  ssr: false,
  loading: () => <div className="flex-1 bg-slate-900 animate-pulse flex items-center justify-center text-slate-600 text-sm font-bold uppercase tracking-widest">Loading Map...</div>
});

export default function MapPage() {
  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <main className="flex-1 ml-20 relative flex flex-col">
        {/* Header Overlay */}
        <header className="absolute top-6 left-6 z-[600] pointer-events-none flex flex-col gap-3">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl shadow-2xl pointer-events-auto max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                <MapPin size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Campus Pulse</h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Stanford University</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time activity density. Click on markers to see live check-ins and join meetups.
            </p>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <button className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 hover:bg-slate-900 transition-all">
              <Layers size={14} /> Layers
            </button>
            <button className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2 hover:bg-slate-900 transition-all">
              <Info size={14} /> Legend
            </button>
          </div>
        </header>

        {/* Bottom Floating Stats */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[600] pointer-events-none w-full max-w-2xl px-6">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl shadow-2xl pointer-events-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Students</span>
                <span className="text-xl font-bold text-blue-500">248</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Spots</span>
                <span className="text-xl font-bold text-purple-500">12</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Events Today</span>
                <span className="text-xl font-bold text-emerald-500">34</span>
              </div>
            </div>

            <button className="bg-white text-slate-950 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 active:scale-95 transition-all">
              <Navigation size={18} />
              Check In
            </button>
          </div>
        </div>

        {/* The Map Component (takes full height/width) */}
        <div className="flex-1">
          <CampusMap />
        </div>
      </main>
    </div>
  );
}
