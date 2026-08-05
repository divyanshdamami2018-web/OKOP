import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export function useFollows(targetUserId: string) {
  const { user: authUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const checkFollowStatus = useCallback(async () => {
    if (!targetUserId || !authUser) {
      setLoading(false);
      return;
    }

    try {
      // Check if following
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', authUser.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      setIsFollowing(!!data);

      // Get count
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      setFollowerCount(count || 0);
    } catch (err) {
      console.error('Follow check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, authUser]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  const follow = async () => {
    if (!authUser) return;

    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: authUser.id, following_id: targetUserId });

    if (!error) {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);

      // Notify the user
      await supabase.from('notifications').insert({
        receiver_id: targetUserId,
        type: 'follow',
        title: 'New Follower!',
        body: `${authUser.user_metadata?.full_name || 'Someone'} started following you`,
        link: `/profile/${authUser.id}`
      });
    } else {
      console.error('Follow failed:', error);
    }
  };

  const unfollow = async () => {
    if (!authUser) return;

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', authUser.id)
      .eq('following_id', targetUserId);

    if (!error) {
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, prev - 1));
    } else {
      console.error('Unfollow failed:', error);
    }
  };

  return { isFollowing, followerCount, loading, follow, unfollow, refresh: checkFollowStatus };
}
