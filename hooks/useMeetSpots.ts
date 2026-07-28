'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MeetSpot } from '@/types';

export function useMeetSpots() {
  const [spots, setSpots] = useState<MeetSpot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpots = async () => {
    try {
      // Fetch spots and join with check-ins count
      const { data, error } = await supabase
        .from('meet_spots')
        .select(`
          *,
          checkins:meet_spot_checkins(count)
        `)
        .filter('meet_spot_checkins.expires_at', 'gt', new Date().toISOString());

      if (error) throw error;

      const mappedSpots: MeetSpot[] = data.map((spot: any) => ({
        id: spot.id,
        name: spot.name,
        description: spot.description,
        coordinates: { lat: spot.lat, lng: spot.lng },
        liveCount: spot.checkins?.[0]?.count || 0,
      }));

      setSpots(mappedSpots);
    } catch (err) {
      console.error('Error fetching meet spots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();

    // Use a unique channel name to prevent "cannot add callbacks after subscribe" error
    const channelName = `meet_spots_realtime_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meet_spot_checkins' }, () => {
        fetchSpots();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { spots, loading, refresh: fetchSpots };
}

export function useCheckIn(spotId: string) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('meet_spot_checkins')
        .select('*')
        .eq('spot_id', spotId)
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      setIsCheckedIn(!!data);
      setIsLoading(false);
    }
    getStatus();
  }, [spotId]);

  const checkIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Check in for 2 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    const { error } = await supabase
      .from('meet_spot_checkins')
      .insert({
        spot_id: spotId,
        user_id: user.id,
        expires_at: expiresAt.toISOString()
      });

    if (error) throw error;
    setIsCheckedIn(true);
  };

  return { isCheckedIn, isLoading, checkIn };
}
