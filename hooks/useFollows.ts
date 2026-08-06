import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";

export function useFollows(targetUserId: string) {
  const { profile: currentUser } = useAuthStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const refresh = useCallback(async () => {
    if (!targetUserId) {
      setFollowerCount(0);
      setFollowingCount(0);
      setIsFollowing(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const requests = [
        // Count Followers
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", targetUserId),
        // Count Following
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", targetUserId),
      ];

      if (currentUser) {
        requests.push(
          supabase
            .from("follows")
            .select("follower_id")
            .eq("follower_id", currentUser.id)
            .eq("following_id", targetUserId)
            .maybeSingle()
        );
      }

      const [followersResult, followingResult, followStatusResult] = await Promise.all(requests);

      setFollowerCount(followersResult.count ?? 0);
      setFollowingCount(followingResult.count ?? 0);

      if (currentUser && followStatusResult) {
        setIsFollowing(!!followStatusResult.data);
      } else {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Failed loading follow data", error);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, currentUser]);

  useEffect(() => {
    refresh();

    if (!targetUserId) return;

    const channel = supabase
      .channel(`follows-${targetUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "follows",
          filter: `following_id=eq.${targetUserId}`,
        },
        refresh
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh, targetUserId]);

  const follow = useCallback(async () => {
    if (!currentUser) return;

    if (currentUser.id === targetUserId) return;

    if (updating) return;

    setUpdating(true);

    // optimistic update
    setIsFollowing(true);
    setFollowerCount((c) => c + 1);

    try {
      const { error } = await supabase.from("follows").insert({
        follower_id: currentUser.id,
        following_id: targetUserId,
      });

      if (error) throw error;

      await supabase.from("notifications").insert({
        receiver_id: targetUserId,
        type: "follow",
        title: "New Follower!",
        body: `${currentUser.name ?? "Someone"} started following you.`,
        link: `/profile/${currentUser.id}`,
      });
    } catch (error) {
      // rollback
      setIsFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
      console.error(error);
    } finally {
      setUpdating(false);
    }
  }, [currentUser, targetUserId, updating]);

  const unfollow = useCallback(async () => {
    if (!currentUser) return;

    if (updating) return;

    setUpdating(true);

    setIsFollowing(false);
    setFollowerCount((c) => Math.max(0, c - 1));

    try {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUser.id)
        .eq("following_id", targetUserId);

      if (error) throw error;
    } catch (error) {
      // rollback
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  }, [currentUser, targetUserId, updating]);

  return {
    isFollowing,
    followerCount,
    loading,
    updating,
    follow,
    unfollow,
    refresh,
  };
}