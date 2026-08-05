'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export function useJoinActivity(activityId: string) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function checkJoinStatus() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', activityId)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsJoined(!!data);
      setIsLoading(false);
    }

    checkJoinStatus();
  }, [activityId, user]);

  const join = async () => {
    if (!user) throw new Error('Auth required');

    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: activityId, user_id: user.id });

    if (error) {
        if (error.code === '23505') {
            setIsJoined(true);
            return;
        }
        throw error;
    }
    setIsJoined(true);
  };

  const leave = async () => {
    if (!user) throw new Error('Auth required');

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', activityId)
      .eq('user_id', user.id);

    if (error) throw error;
    setIsJoined(false);
  };

  return { isJoined, isLoading, join, leave };
}
