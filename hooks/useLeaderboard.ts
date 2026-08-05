'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export function useLeaderboard() {
  const [topStudents, setTopStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp_points', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setTopStudents((data || []).map((p: any) => ({
          id: p.id,
          name: p.full_name,
          username: p.username || 'student',
          avatar: p.avatar_url,
          college: p.college || 'Stanford University',
          interests: p.interests || [],
          skills: p.skills || [],
          status: p.status || 'offline',
          role: p.role || 'student',
          xp_points: p.xp_points || 0,
          daily_streak: p.daily_streak || 0,
          is_ghost_mode: p.is_ghost_mode || false,
          onboarding_completed: true,
          is_profile_public: p.is_profile_public ?? true,
          hide_email: false,
          hide_phone: false,
          hide_semester: false,
          created_at: p.created_at || new Date().toISOString()
        })));
      }
      setLoading(false);
    }

    fetchLeaderboard();

    // Subscribe to profile changes to keep XP live
    const channelName = `leaderboard_updates_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { topStudents, loading };
}
