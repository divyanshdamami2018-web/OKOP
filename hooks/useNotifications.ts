'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Notification {
  id: string;
  receiver_id: string;
  type: 'activity_join' | 'message' | 'spot_alert' | 'system' | 'follow' | 'like' | 'comment';
  title: string;
  body: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const channelName = `notifications_${user.id}_${Math.random().toString(36).substring(7)}`;
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiver_id=eq.${user.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) console.error('Error marking notification as read:', error);
    else {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    }
  };

  const registerDeviceToken = async (token: string, type: 'ios' | 'android' | 'web') => {
    if (!user) return;
    const { error } = await supabase
      .from('user_device_tokens')
      .upsert({
        user_id: user.id,
        token,
        device_type: type,
        last_seen: new Date().toISOString()
      }, { onConflict: 'user_id,token' });

    if (error) console.error('Token registration error:', error);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { notifications, loading, unreadCount, markAsRead, registerDeviceToken, refresh: fetchNotifications };
}
