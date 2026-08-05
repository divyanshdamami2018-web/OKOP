import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export function useFollows(targetUserId: string) {
  const { profile: currentUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const checkFollowStatus = useCallback(async () => {
    if (!targetUserId || !currentUser) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (!error) setIsFollowing(!!data);

      const { count, error: countErr } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      if (!countErr) setFollowerCount(count || 0);
    } catch (err) {
      console.error('Follow check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, currentUser]);

  useEffect(() => {
    checkFollowStatus();

    // Subscribe to follow changes
    const channelName = `follows_${targetUserId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'follows',
        filter: `following_id=eq.${targetUserId}`
      }, () => checkFollowStatus())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [checkFollowStatus, targetUserId]);

  const follow = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: currentUser.id, following_id: targetUserId });

      if (!error) {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);

        // Notify
        await supabase.from('notifications').insert({
          receiver_id: targetUserId,
          type: 'follow',
          title: 'New Follower!',
          body: `${currentUser.name || 'Someone'} started following you`,
          link: `/profile/${currentUser.id}`
        });
      }
    } catch (err) {
      console.error('Follow failed:', err);
    }
  };

  const unfollow = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', targetUserId);

      if (!error) {
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Unfollow failed:', err);
    }
  };

  return { isFollowing, followerCount, loading, follow, unfollow, refresh: checkFollowStatus };
}
