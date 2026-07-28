'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Moment {
  id: string;
  user_id: string;
  content: string;
  location_name?: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export function useMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMoments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('moments')
        .select(`
          *,
          profiles!moments_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(15); // cap for speed

      if (error) {
        console.error('Database error fetching moments:', error.message, error.details, error.hint);
        setMoments([]);
      } else {
        setMoments(data || []);
      }
    } catch (err: any) {
      console.error('System error fetching moments:', err.message);
      setMoments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoments();

    const channelName = `moments_realtime_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'moments'
      }, () => {
        fetchMoments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createMoment = async (content: string, locationName?: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('moments')
      .insert({
        user_id: user.id,
        content,
        location_name: locationName,
      });

    if (error) throw error;
  };

  return { moments, loading, createMoment, refresh: fetchMoments };
}
