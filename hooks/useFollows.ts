'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useFollows(targetUserId: string) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetUserId) return;

    async function checkFollowStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if following
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      setIsFollowing(!!data);

      // Get count
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      setFollowerCount(count || 0);
      setLoading(false);
    }

    checkFollowStatus();
  }, [targetUserId]);

  const follow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: targetUserId });

    if (!error) {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);

      // Notify the user they have a new follower
      await supabase.from('notifications').insert({
        user_id: targetUserId,
        type: 'follow',
        title: 'New Follower!',
        content: `${user.user_metadata.full_name || 'Someone'} started following you`,
        link: `/profile/${user.id}`
      });
    }
  };

  const unfollow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (!error) {
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, prev - 1));
    }
  };

  return { isFollowing, followerCount, loading, follow, unfollow };
}
