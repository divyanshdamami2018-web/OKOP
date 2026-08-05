'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            id,
            full_name,
            avatar_url,
            username
          ),
          likes:post_likes(count),
          comments:post_comments(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check if current user liked these posts
      let likedPostIds: string[] = [];
      if (user) {
        const { data: likedData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        likedPostIds = (likedData || []).map(l => l.post_id);
      }

      const mappedPosts: Post[] = (data || []).map((p: any) => ({
        id: p.id,
        author_id: p.author_id,
        content: p.content,
        media_urls: p.media_urls || [],
        location_name: p.location_name,
        is_public: p.is_public,
        created_at: p.created_at,
        author: {
           id: p.author.id,
           name: p.author.full_name,
           avatar: p.author.avatar_url,
           username: p.author.username
        } as any,
        likes_count: p.likes[0]?.count || 0,
        comments_count: p.comments[0]?.count || 0,
        is_liked: likedPostIds.includes(p.id)
      }));

      setPosts(mappedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('posts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => fetchPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, () => fetchPosts())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const createPost = async (content: string, mediaUrls: string[] = [], locationName?: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        content,
        media_urls: mediaUrls,
        location_name: locationName
      });
    if (error) throw error;
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });

      // Notify author
      const post = posts.find(p => p.id === postId);
      if (post && post.author_id !== user.id) {
        await supabase.from('notifications').insert({
          receiver_id: post.author_id,
          type: 'like',
          title: 'Post Liked!',
          body: `${user.user_metadata?.full_name || 'Someone'} liked your post`,
          link: `/feed`
        });
      }
    }
    fetchPosts();
  };

  return { posts, loading, createPost, toggleLike, refresh: fetchPosts };
}
