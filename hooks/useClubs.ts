'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Club } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClubs = async () => {
    // Note: Schema table is 'communities' but hook is named 'useClubs' for backward compatibility
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false });

    if (error) {
      console.error('Error fetching communities:', error);
      return;
    }

    setClubs((data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image_url,
      banner_url: c.banner_url,
      category: c.category,
      membersCount: c.member_count || 0
    })));
    setLoading(false);
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
    setClubs(prev => prev.map(c =>
      c.id === clubId ? { ...c, membersCount: c.membersCount + 1 } : c
    ));
  };

  return { clubs, loading, joinClub, refresh: fetchClubs };
}
