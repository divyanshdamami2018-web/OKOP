'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, FriendRequest } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useFriendSystem() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFriendsData = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch incoming pending requests
    const { data: reqData } = await supabase
      .from('friend_requests')
      .select('*, sender:profiles(*)')
      .eq('receiver_id', user.id)
      .eq('status', 'pending');

    // Fetch friends list
    const { data: friendData } = await supabase
      .from('friends')
      .select('friend:profiles(*)')
      .eq('user_id', user.id);

    setRequests(reqData || []);
    setFriends((friendData || []).map((f: any) => ({
      id: f.friend.id,
      name: f.friend.full_name,
      avatar: f.friend.avatar_url,
      username: f.friend.username,
      college: f.friend.college,
      interests: f.friend.interests || [],
      skills: f.friend.skills || [],
      xp_points: f.friend.xp_points || 0,
      status: f.friend.status,
      daily_streak: f.friend.daily_streak || 0,
      is_ghost_mode: f.friend.is_ghost_mode || false,
      onboarding_completed: true,
      is_profile_public: true,
      hide_email: false,
      hide_phone: false,
      hide_semester: false,
      created_at: f.friend.created_at
    } as UserProfile)));

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchFriendsData();

      const channel = supabase
        .channel(`friends_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, () => fetchFriendsData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => fetchFriendsData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const sendRequest = async (receiverId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('friend_requests')
      .insert({ sender_id: user.id, receiver_id: receiverId, status: 'pending' });

    if (error) throw error;
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) throw error;
  };

  return { requests, friends, loading, sendRequest, respondToRequest, refresh: fetchFriendsData };
}
