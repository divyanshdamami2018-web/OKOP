'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/SidebarNav';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ActivityCard } from '@/components/ActivityCard';
import { Activity, UserProfile } from '@/types';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MessageSquare,
  UserPlus,
  UserMinus,
  Grid,
  History,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useFollows } from '@/hooks/useFollows';

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMe, setIsMe] = useState(false);
  const { isFollowing, follow, unfollow } = useFollows(id as string);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!id) return;

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.id === id) {
        setIsMe(true);
      }

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name,
          username: profile.username || 'student',
          avatar: profile.avatar_url,
          college: profile.college,
          interests: profile.interests || [],
          skills: profile.skills || [],
          status: profile.status || 'offline',
          xp_points: profile.xp_points || 0,
          daily_streak: profile.daily_streak || 0,
          role: profile.role || 'student',
          is_ghost_mode: profile.is_ghost_mode || false,
          onboarding_completed: profile.onboarding_completed || false,
          is_profile_public: profile.is_profile_public ?? true,
          hide_email: profile.hide_email ?? false,
          hide_phone: profile.hide_phone ?? false,
          hide_semester: profile.hide_semester ?? false,
          created_at: profile.created_at || new Date().toISOString()
        });
      }

      // Fetch Activities created by this user
      const { data: acts } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('creator_id', id)
        .limit(5);

      if (acts) {
        setActivities(acts.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          category: item.category,
          location: item.location,
          startTime: item.start_time,
          maxParticipants: item.max_participants,
          currentParticipants: item.current_count || 0,
          tags: item.tags || [],
          creator: {
            id: item.creator_id,
            name: item.creator_name,
            username: item.creator_username || 'user',
            avatar: item.creator_avatar,
            college: item.college || 'Stanford University',
            interests: [],
            skills: [],
            xp_points: 0,
            daily_streak: 0,
            is_ghost_mode: false,
            onboarding_completed: true,
            is_profile_public: true,
            hide_email: false,
            hide_phone: false,
            hide_semester: false,
            created_at: new Date().toISOString()
          }
        })));
      }

      setLoading(false);
    }

    fetchUserData();
  }, [id]);

  const handleMessage = async () => {
    if (isMe) return;
    setActionLoading(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // Check if conversation already exists
      const { data: existing } = await supabase
        .rpc('get_conversation_between_users', {
          user1: authUser.id,
          user2: id
        });

      if (existing && existing.length > 0) {
        router.push(`/messages?id=${existing[0].id}`);
      } else {
        // Create new conversation
        const { data: conv, error: convErr } = await supabase
          .from('conversations')
          .insert({ is_group: false })
          .select()
          .single();

        if (convErr) throw convErr;

        // Add participants
        await supabase.from('conversation_participants').insert([
          { conversation_id: conv.id, user_id: authUser.id },
          { conversation_id: conv.id, user_id: id }
        ]);

        router.push(`/messages?id=${conv.id}`);
      }
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <button onClick={() => router.push('/explore')} className="text-blue-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <SidebarNav />

      <main className="flex-1 ml-20">
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold uppercase tracking-widest">Back</span>
          </button>

          {!isMe && (
            <div className="flex gap-3">
              <button
                onClick={handleMessage}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                Message
              </button>
              <button
                onClick={() => isFollowing ? unfollow() : follow()}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  isFollowing
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                }`}
              >
                {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </header>

        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard user={user} />

              <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4 text-emerald-500">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Student</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">XP Points</span>
                    <span className="text-sm font-black text-blue-500">{user.xp_points?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, ((user.xp_points || 0) % 1000) / 10)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 text-center uppercase font-bold tracking-tighter">
                    {1000 - ((user.xp_points || 0) % 1000)} XP to next level
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex border-b border-slate-900 mb-8 overflow-x-auto no-scrollbar">
                <button className="px-6 py-4 text-sm font-bold text-blue-500 border-b-2 border-blue-500 whitespace-nowrap flex items-center gap-2">
                  <Grid size={16} /> Activities
                </button>
                <button className="px-6 py-4 text-sm font-bold text-slate-500 hover:text-slate-300 transition-all whitespace-nowrap flex items-center gap-2">
                  <History size={16} /> Past Events
                </button>
              </div>

              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl text-center">
                    <p className="text-slate-500 font-medium">No active activities found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
