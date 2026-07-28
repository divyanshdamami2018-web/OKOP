'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        xp_points: data.xp_points || 0,
        daily_streak: data.daily_streak || 0,
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
    let fetchedUserId: string | null = null;

    const loadProfile = async (userId: string) => {
      if (fetchedUserId === userId) return; // Prevent duplicate calls
      fetchedUserId = userId;
      await fetchProfile(userId);
    };

    const initAuth = async () => {
      try {
        // Fast timeout for session fetch
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
        const sessionPromise = supabase.auth.getSession();

        const result = await Promise.race([sessionPromise, timeoutPromise]);
        if (cancelled) return;

        if (result && 'data' in result) {
          const session = result.data.session;
          setUser(session?.user ?? null);
          setLoading(false); // Unblock AuthGuard INSTANTLY!
          
          if (session?.user) {
            loadProfile(session.user.id); // Fetch in background
          }
        }
      } catch (e) {
        // Ignore errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
