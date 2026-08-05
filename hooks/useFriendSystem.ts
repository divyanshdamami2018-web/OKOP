'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, FriendRequest } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useFriendSystem() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Helper to map DB profile shape to UserProfile
  const mapProfile = (rawProfile: any): UserProfile => ({
    id: rawProfile.id,
    name: rawProfile.full_name,
    avatar: rawProfile.avatar_url,
    username: rawProfile.username,
    college: rawProfile.college,
    interests: rawProfile.interests || [],
    skills: rawProfile.skills || [],
    xp_points: rawProfile.xp_points || 0,
    status: rawProfile.status,
    role: rawProfile.role || 'student',
    daily_streak: rawProfile.daily_streak || 0,
    is_ghost_mode: rawProfile.is_ghost_mode || false,
    onboarding_completed: true,
    is_profile_public: true,
    hide_email: false,
    hide_phone: false,
    hide_semester: false,
    created_at: rawProfile.created_at,
  });

  const fetchFriendsData = useCallback(async (isSilentUpdate = false) => {
    if (!user) return;

    if (!isSilentUpdate) setLoading(true);

    try {
      // 1. Fetch pending friend requests
      const { data: reqData, error: reqError } = await supabase
        .from('friend_requests')
        .select('*, sender:profiles!friend_requests_sender_id_fkey(*)')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (reqError) throw reqError;

      // 2. Fetch user's friends list
      const { data: friendData, error: friendError } = await supabase
        .from('friends')
        .select('friend:profiles!friends_friend_id_fkey(*)')
        .eq('user_id', user.id);

      if (friendError) throw friendError;

      setRequests(reqData || []);
      setFriends((friendData || []).map((f: any) => mapProfile(f.friend)));
    } catch (err) {
      console.error('Error fetching friends data:', err);
    } finally {
      if (!isSilentUpdate) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setFriends([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    fetchFriendsData();

    // Set up real-time subscriptions specifically targeted to this user ID
    const channelName = `friends_system_${user.id}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          if (isMounted) fetchFriendsData(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          if (isMounted) fetchFriendsData(true);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user, fetchFriendsData]);

  const sendRequest = async (receiverId: string) => {
    if (!user) throw new Error('User must be authenticated to send requests.');
    if (receiverId === user.id) throw new Error('Cannot send a friend request to yourself.');

    const { error } = await supabase
      .from('friend_requests')
      .insert({ sender_id: user.id, receiver_id: receiverId, status: 'pending' });

    if (error) throw error;
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    if (!user) throw new Error('User must be authenticated to respond.');

    if (status === 'accepted') {
      // Find request locally to get sender_id
      const requestToAccept = requests.find((r) => r.id === requestId);

      if (!requestToAccept) {
        throw new Error('Request not found.');
      }

      // Update status to accepted
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create standard two-way friendship entry
      const { error: friendInsertError } = await supabase.from('friends').insert([
        { user_id: user.id, friend_id: requestToAccept.sender_id },
        { user_id: requestToAccept.sender_id, friend_id: user.id },
      ]);

      if (friendInsertError) throw friendInsertError;
    } else {
      // Handle rejection
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
    }

    // Refresh state manually following the mutation
    await fetchFriendsData(true);
  };

  return {
    requests,
    friends,
    loading,
    sendRequest,
    respondToRequest,
    refresh: () => fetchFriendsData(false),
  };
}