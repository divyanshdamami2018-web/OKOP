'use client';

import React from 'react';
import { Post } from '@/types';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[3rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-premium"
    >
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`}
              className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-900 shadow-xl"
              alt="Avatar"
            />
            <div>
              <h4 className="font-black text-slate-900 dark:text-white leading-tight">
                {post.author?.name || 'Student'}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  @{post.author?.username || 'user'}
                </p>
                {post.location_name && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1 text-brand-primary">
                      <MapPin size={10} />
                      <span className="text-[9px] font-black uppercase tracking-tighter">{post.location_name}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300 font-medium text-lg leading-relaxed">
            {post.content}
          </p>

          {post.media_urls && post.media_urls.length > 0 && (
            <div className="grid grid-cols-1 gap-4 rounded-[2rem] overflow-hidden">
              {post.media_urls.map((url, i) => (
                <img key={i} src={url} className="w-full h-96 object-cover" alt="Post Media" />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onLike}
              className={`flex items-center gap-2 group transition-all ${post.is_liked ? 'text-brand-danger' : 'text-slate-500'}`}
            >
              <div className={`p-3 rounded-2xl transition-all ${post.is_liked ? 'bg-brand-danger/10' : 'bg-slate-100 dark:bg-slate-900 group-hover:bg-brand-danger/5'}`}>
                <Heart size={20} fill={post.is_liked ? 'currentColor' : 'none'} />
              </div>
              <span className="text-sm font-black tracking-widest">{post.likes_count || 0}</span>
            </button>

            <button className="flex items-center gap-2 group text-slate-500 transition-all">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 group-hover:bg-brand-primary/5 transition-all">
                <MessageCircle size={20} />
              </div>
              <span className="text-sm font-black tracking-widest">{post.comments_count || 0}</span>
            </button>
          </div>

          <button className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-brand-primary transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
