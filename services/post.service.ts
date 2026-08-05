import { supabase } from '@/lib/supabase';
import { Post } from '@/types';

export const postService = {
  async getFeed(userId: string, limit = 10, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey (
          id,
          full_name,
          avatar_url,
          username,
          role
        ),
        likes:post_likes(count),
        comments:post_comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Fetch user's likes for these posts
    const postIds = (data || []).map((p: any) => p.id);
    const { data: userLikes } = await supabase
      .from('post_likes')
      .select('post_id')
      .in('post_id', postIds)
      .eq('user_id', userId);

    const likedIds = new Set((userLikes || []).map((l: any) => l.post_id));

    return (data || []).map((p: any) => ({
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
        username: p.author.username,
        role: p.author.role
      } as any,
      likes_count: p.likes[0]?.count || 0,
      comments_count: p.comments[0]?.count || 0,
      is_liked: likedIds.has(p.id)
    }));
  },

  async createPost(userId: string, content: string, mediaUrls: string[] = [], locationName?: string) {
    const { error } = await supabase
      .from('posts')
      .insert({
        author_id: userId,
        content,
        media_urls: mediaUrls,
        location_name: locationName
      });
    if (error) throw error;
  },

  async toggleLike(userId: string, postId: string, isLiked: boolean) {
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    }
  }
};
