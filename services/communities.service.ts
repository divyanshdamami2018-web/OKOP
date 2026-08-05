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
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Check if slug exists
    const { data: existing } = await supabase
        .from('communities')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

    const finalSlug = existing ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;

    const { data, error } = await supabase
      .from('communities')
      .insert({
        creator_id: userId,
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        category,
        image_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${finalSlug}`,
        member_count: 1
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
