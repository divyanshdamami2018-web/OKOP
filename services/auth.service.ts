import { supabase } from '@/lib/supabase';

export const authService = {
  async getSession() {
    return await supabase.auth.getSession();
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
