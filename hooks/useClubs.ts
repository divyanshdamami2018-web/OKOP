'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Club } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

import { communitiesService } from '@/services/communities.service';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClubs = async () => {
    try {
      const data = await communitiesService.getCommunities();
      setClubs(data);
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const joinClub = async (clubId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('community_members')
      .insert({ community_id: clubId, user_id: user.id });

    if (error) {
      if (error.code === '23505') {
        console.log('User already a member');
      } else {
        throw error;
      }
    }

    // Update local state
    setClubs(prev => prev.map((c: Club) =>
      c.id === clubId ? { ...c, membersCount: c.membersCount + 1 } : c
    ));
  };

  const createClub = async (name: string, description: string, category: string) => {
    if (!user) return;
    const newClub = await communitiesService.createCommunity(user.id, name, description, category);
    await fetchClubs();
    return newClub;
  };

  return { clubs, loading, joinClub, createClub, refresh: fetchClubs };
}
