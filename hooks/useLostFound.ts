import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export interface LostFoundItem {
  id: string;
  title: string;
  desc: string;
  location: string;
  time: string;
  type: 'lost' | 'found';
  category: string;
  image?: string;
  reporter: {
    name: string;
    avatar: string;
  };
}

export function useLostFound() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lost_found')
        .select(`
          id,
          title,
          description,
          type,
          location,
          image_url,
          created_at,
          reporter:profiles (full_name, avatar_url)
        `)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        desc: item.description || '',
        location: item.location || 'Campus',
        time: new Date(item.created_at).toLocaleDateString(),
        type: item.type,
        category: 'Other', // Add category to DB if needed
        image: item.image_url,
        reporter: {
          name: item.reporter?.full_name || 'Anonymous',
          avatar: item.reporter?.avatar_url || ''
        }
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching lost and found items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel('lost_found_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_found' }, () => fetchItems())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const reportItem = async (itemData: Partial<LostFoundItem>) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('lost_found')
        .insert({
          title: itemData.title,
          description: itemData.desc,
          type: itemData.type,
          location: itemData.location,
          image_url: itemData.image,
          user_id: profile.id
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error reporting item:', error);
    }
  };

  return { items, loading, reportItem, refresh: fetchItems };
}
