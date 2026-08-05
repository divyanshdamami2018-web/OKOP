import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  posted: string;
  image?: string;
  seller: {
    name: string;
    avatar: string;
  };
}

export function useMarketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          id,
          title,
          description,
          price,
          category,
          location,
          image_url,
          created_at,
          seller:profiles (full_name, avatar_url)
        `)
        .eq('is_sold', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price || 0,
        category: item.category || 'Other',
        location: item.location || 'Campus',
        posted: new Date(item.created_at).toLocaleDateString(),
        image: item.image_url,
        seller: {
          name: item.seller?.full_name || 'Anonymous',
          avatar: item.seller?.avatar_url || ''
        }
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel('marketplace_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_items' }, () => fetchItems())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sellItem = async (itemData: Partial<MarketplaceItem>) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .insert({
          title: itemData.title,
          description: itemData.description,
          price: itemData.price,
          category: itemData.category,
          location: itemData.location,
          image_url: itemData.image,
          seller_id: profile.id
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error selling item:', error);
    }
  };

  return { items, loading, sellItem, refresh: fetchItems };
}
