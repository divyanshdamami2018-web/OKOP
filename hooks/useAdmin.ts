'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export function useAdmin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
    } else {
      setUsers((data || []).map((p: any) => ({
        id: p.id,
        name: p.full_name,
        username: p.username || 'student',
        avatar: p.avatar_url,
        college: p.college,
        interests: p.interests || [],
        skills: p.skills || [],
        role: p.role,
        xp_points: p.xp_points || 0,
        daily_streak: p.daily_streak || 0,
        is_ghost_mode: p.is_ghost_mode || false,
        onboarding_completed: p.onboarding_completed,
        is_profile_public: p.is_profile_public,
        hide_email: false,
        hide_phone: false,
        hide_semester: false,
        created_at: p.created_at
      })));
    }
    setLoading(false);
  }, []);

  const sendGlobalNotification = async (title: string, body: string, link?: string) => {
    const { data: allUsers } = await supabase.from('profiles').select('id');
    if (!allUsers) return;

    const notifications = allUsers.map(u => ({
      receiver_id: u.id,
      title,
      body,
      type: 'system',
      link: link || '/notifications'
    }));

    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) throw error;
  };

  const updateUserRole = async (userId: string, role: 'student' | 'moderator' | 'admin') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  return { users, loading, fetchAllUsers, sendGlobalNotification, updateUserRole };
}
