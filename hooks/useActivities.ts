'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchActivities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .order('start_time', { ascending: true })
        .limit(20); // cap results for speed

      if (error) throw error;

      const mapped: Activity[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: item.category,
        location: item.location,
        startTime: item.start_time,
        maxParticipants: item.max_participants,
        currentParticipants: item.current_count || 0,
        tags: item.tags || [],
        creator: {
          id: item.creator_id,
          name: item.creator_name,
          username: item.creator_username || 'user',
          avatar: item.creator_avatar,
          college: item.college || 'Stanford University',
          interests: [],
          skills: [],
          role: 'student',
          xp_points: 0,
          daily_streak: 0,
          is_ghost_mode: false,
          onboarding_completed: true,
          is_profile_public: true,
          hide_email: false,
          hide_phone: false,
          hide_semester: false,
          created_at: new Date().toISOString()
        }
      }));

      setActivities(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();

    const channelName = `activities_realtime_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchActivities)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, fetchActivities)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchActivities]);

  return { activities, loading, error, refresh: fetchActivities };
}

