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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error);
        // If profile doesn't exist, we might need to retry or wait for trigger
        return;
      }

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
    } catch (err) {
      console.error('System error fetching profile:', err);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let fetchedUserId: string | null = null;

    const loadProfile = async (userId: string) => {
      if (fetchedUserId === userId) return;
      fetchedUserId = userId;
      await fetchProfile(userId);
    };

    const initAuth = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) throw error;

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await loadProfile(currentUser.id);
      } else {
        setProfile(null);
        fetchedUserId = null;
      }

      setLoading(false);
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
