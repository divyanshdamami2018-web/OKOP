import { supabase } from '@/lib/supabase';
import { Club } from '@/types';

export const communitiesService = {
  async getCommunities(): Promise<Club[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false });

    if (error) throw error;

    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image_url,
      banner_url: c.banner_url,
      category: c.category,
      membersCount: c.member_count || 0
    }));
  },

  async createCommunity(userId: string, name: string, description: string, category: string) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const { data, error } = await supabase
      .from('communities')
      .insert({
        creator_id: userId,
        name,
        slug,
        description,
        category,
        image_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${slug}`
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as member
    await supabase.from('community_members').insert({
        community_id: data.id,
        user_id: userId,
        role: 'admin'
    });

    return data;
  }
};
