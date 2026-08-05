import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.full_name,
      username: data.username || 'student',
      avatar: data.avatar_url,
      cover_url: data.cover_url,
      bio: data.bio,
      college: data.college,
      department: data.department,
      semester: data.semester,
      graduation_year: data.graduation_year,
      interests: data.interests || [],
      skills: data.skills || [],
      role: data.role,
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
    };
  },

  async updateProfile(userId: string, updates: Partial<any>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
  }
};
