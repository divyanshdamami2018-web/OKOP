import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export interface StudyGroup {
  id: string;
  title: string;
  subject: string;
  members: number;
  maxMembers: number;
  location: string;
  time: string;
  department: string;
  tags: string[];
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  hasJoined: boolean;
}

export function useStudyGroups() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      // Fetch events with category 'Study'
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          location,
          start_time,
          max_participants,
          category,
          tags,
          creator:profiles!events_creator_id_fkey (id, full_name, avatar_url),
          registrations:event_registrations (user_id)
        `)
        .eq('category', 'Study')
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedGroups = (data || []).map((event: any) => ({
        id: event.id,
        title: event.title,
        subject: event.description || 'General Study',
        members: event.registrations?.length || 0,
        maxMembers: event.max_participants || 10,
        location: event.location,
        time: new Date(event.start_time).toLocaleString(undefined, {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit'
        }),
        department: 'General',
        tags: event.tags || [],
        creator: {
          id: event.creator?.id,
          name: event.creator?.full_name,
          avatar: event.creator?.avatar_url
        },
        hasJoined: profile ? event.registrations?.some((r: any) => r.user_id === profile.id) : false
      }));

      setGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching study groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('study-groups')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events', filter: "category=eq.Study" }, () => fetchGroups())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, () => fetchGroups())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const joinGroup = async (groupId: string) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({ event_id: groupId, user_id: profile.id });
      if (error) throw error;
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const createGroup = async (groupData: Partial<StudyGroup>) => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: groupData.title,
          description: groupData.subject,
          category: 'Study',
          location: groupData.location,
          start_time: groupData.time,
          max_participants: groupData.maxMembers || 10,
          tags: groupData.tags || [],
          creator_id: profile.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Auto register the creator
      if (data) {
        await supabase
          .from('event_registrations')
          .insert({ event_id: data.id, user_id: profile.id });
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return { groups, loading, joinGroup, createGroup, refresh: fetchGroups };
}
