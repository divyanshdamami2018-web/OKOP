'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function usePlacementListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('placement_listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      setListings(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { listings, loading };
}

export function useLostFound() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('lost_found')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(3);
      setItems(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { items, loading };
}
