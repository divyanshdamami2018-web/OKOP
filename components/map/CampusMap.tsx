'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MapPin, Navigation, Clock, Loader2 } from 'lucide-react';
import { MeetSpot } from '@/types';
import { useMeetSpots, useCheckIn } from '@/hooks/useMeetSpots';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

export const CampusMap = () => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const { spots, loading: spotsLoading } = useMeetSpots();
  const [isMounted, setIsMounted] = useState(false);

  const selectedSpot = spots.find(s => s.id === selectedSpotId);

  useEffect(() => {
    setIsMounted(true);
    // Leaflet fix for marker icons in Next.js
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  const mapKey = React.useMemo(() => new Date().getTime(), []);

  if (!isMounted || spotsLoading) return (
    <div className="h-[600px] w-full bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        key={mapKey}
        center={[37.4275, -122.1703]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.coordinates.lat, spot.coordinates.lng]}
            eventHandlers={{
              click: () => setSelectedSpotId(spot.id),
            }}
          />
        ))}
      </MapContainer>

      {/* Floating Badges Overlay */}
      <div className="absolute top-4 left-4 z-[500] pointer-events-none">
        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            LIVE CAMPUS PULSE
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
            {spots.reduce((acc, spot) => acc + spot.liveCount, 0)} Students Check-in
          </p>
        </div>
      </div>

      {/* Side Sheet Panel */}
      <AnimatePresence>
        {selectedSpot && (
          <SpotDetailPanel
            spot={selectedSpot}
            onClose={() => setSelectedSpotId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SpotDetailPanel = ({ spot, onClose }: { spot: MeetSpot, onClose: () => void }) => {
  const { isCheckedIn, isLoading: checkInLoading, checkIn } = useCheckIn(spot.id);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsActionLoading(true);
    try {
      await checkIn();
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-full md:w-96 bg-slate-950/95 backdrop-blur-2xl z-[1000] border-l border-slate-800 p-6 flex flex-col shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold">
          {spot.liveCount} ACTIVE NOW
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
        <section>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">{spot.name}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {spot.description}
          </p>
        </section>

        <section>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Live Students</h4>
          <div className="flex -space-x-3 mb-4">
            {[...Array(Math.min(5, spot.liveCount))].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden ring-1 ring-slate-800">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i + spot.id}`} alt="Active student" />
              </div>
            ))}
            {spot.liveCount > 5 && (
              <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400 ring-1 ring-slate-800">
                +{spot.liveCount - 5}
              </div>
            )}
            {spot.liveCount === 0 && <p className="text-slate-600 text-xs italic">Be the first to check in!</p>}
          </div>
        </section>

        <section className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800/50 mt-auto">
          <div className="flex items-center gap-3 mb-4 text-slate-300">
            <Clock size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Check-in lasts for 2 Hours</span>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn || isActionLoading || checkInLoading}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              isCheckedIn
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white text-slate-950 hover:bg-slate-200'
            }`}
          >
            {isActionLoading ? <Loader2 className="animate-spin" size={20} /> : isCheckedIn ? 'Checked In ✓' : 'Mark I\'m Here'}
          </button>
        </section>
      </div>
    </motion.div>
  );
};
