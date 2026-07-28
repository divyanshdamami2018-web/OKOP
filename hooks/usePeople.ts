'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function usePeople(query: string = '') {
  const [people, setPeople] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function searchPeople() {
      setLoading(true);
      let request = supabase
        .from('profiles')
        .select('*')
        .limit(20);

      if (query) {
        request = request.ilike('full_name', `%${query}%`);
      }

      // Filter out self
      if (currentUser) {
        request = request.neq('id', currentUser.id);
      }

      const { data, error } = await request;

      if (error) {
        console.error('Error searching people:', error);
      } else {
        setPeople((data || []).map(p => ({
          id: p.id,
          name: p.full_name,
          username: p.username || 'student',
          avatar: p.avatar_url,
          college: p.college,
          interests: p.interests || [],
          skills: p.skills || [],
          status: p.status || 'offline',
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

    const timer = setTimeout(() => {
      searchPeople();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUser]);

  return { people, loading };
}
