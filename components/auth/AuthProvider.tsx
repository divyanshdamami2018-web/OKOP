'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { User } from '@supabase/supabase-js';

import { useAuthStore } from '@/store/auth.store';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, setUser, setProfile, setLoading } = useAuthStore();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile({
        id: data.id,
        name: data.full_name,
        username: data.username || 'student',
        avatar: data.avatar_url,
        college: data.college,
        interests: data.interests || [],
        skills: data.skills || [],
        role: data.role || 'student',
        xp_points: data.xp_points || 0,
        daily_streak: data.daily_streak || 0,
        follower_count: data.follower_count || 0,
        following_count: data.following_count || 0,
        post_count: data.post_count || 0,
        is_ghost_mode: data.is_ghost_mode || false,
        onboarding_completed: data.onboarding_completed || false,
        is_profile_public: data.is_profile_public ?? true,
        hide_email: data.hide_email ?? false,
        hide_phone: data.hide_phone ?? false,
        hide_semester: data.hide_semester ?? false,
        created_at: data.created_at,
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async (userId: string) => {
      await fetchProfile(userId);
    };

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (cancelled) return;
      
      setUser(session?.user ?? null);
      setLoading(false); // Unblock AuthGuard INSTANTLY!

      if (session?.user) {
        loadProfile(session.user.id); // Fetch in background
      } else {
        setProfile(null);
        fetchedUserId = null;
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile: () => user ? fetchProfile(user.id) : Promise.resolve() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
