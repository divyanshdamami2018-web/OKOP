'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useActivityDetail(id: string) {
  const [activity, setActivity] = useState<Activity & { conversation_id?: string } | null>(null);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      setLoading(true);

      const { data: actData, error: actError } = await supabase
        .from('activities')
        .select(`
          *,
          creator:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (actError) {
        console.error('Error fetching activity:', actError);
        setLoading(false);
        return;
      }

      const { data: partData } = await supabase
        .from('activity_participants')
        .select('profiles(*)')
        .eq('activity_id', id);

      const mappedActivity: Activity & { conversation_id?: string } = {
        id: actData.id,
        title: actData.title,
        description: actData.description || '',
        category: actData.category,
        location: actData.location,
        startTime: actData.start_time,
        maxParticipants: actData.max_participants,
        currentParticipants: partData?.length || 0,
        tags: actData.tags || [],
        conversation_id: actData.conversation_id,
        creator: {
          id: actData.creator.id,
          name: actData.creator.full_name,
          username: actData.creator.username || 'user',
          avatar: actData.creator.avatar_url,
          college: actData.creator.college,
          interests: actData.creator.interests || [],
          skills: actData.creator.skills || [],
          xp_points: actData.creator.xp_points || 0,
          daily_streak: actData.creator.daily_streak || 0,
          role: actData.creator.role || 'student',
          is_ghost_mode: actData.creator.is_ghost_mode || false,
          onboarding_completed: true,
          is_profile_public: true,
          hide_email: false,
          hide_phone: false,
          hide_semester: false,
          created_at: actData.creator.created_at || new Date().toISOString()
        }
      };

      setActivity(mappedActivity);
      setParticipants((partData || []).map((p: any) => ({
        id: p.profiles.id,
        name: p.profiles.full_name,
        username: p.profiles.username || 'user',
        avatar: p.profiles.avatar_url,
        college: p.profiles.college,
        interests: p.profiles.interests || [],
        skills: p.profiles.skills || [],
        xp_points: p.profiles.xp_points || 0,
        daily_streak: p.profiles.daily_streak || 0,
        role: p.profiles.role || 'student',
        is_ghost_mode: p.profiles.is_ghost_mode || false,
        onboarding_completed: true,
        is_profile_public: true,
        hide_email: false,
        hide_phone: false,
        hide_semester: false,
        created_at: p.profiles.created_at || new Date().toISOString()
      })));
      setLoading(false);
    }

    fetchDetails();

    const channel = supabase
      .channel(`activity_detail_${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activity_participants',
        filter: `activity_id=eq.${id}`
      }, () => {
        fetchDetails();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { activity, participants, loading };
}
