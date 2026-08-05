'use client';

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { useAdmin } from '@/hooks/useAdmin';
import {
  Users,
  ShieldAlert,
  Bell,
  Activity,
  Search,
  MoreVertical,
  Shield,
  UserCheck,
  Ban,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { users, loading, fetchAllUsers, sendGlobalNotification, updateUserRole } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.includes(searchQuery)
  );

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    setSendingBroadcast(true);
    try {
      await sendGlobalNotification(broadcastTitle, broadcastBody);
      setBroadcastTitle('');
      setBroadcastBody('');
      alert('Broadcast sent to all students!');
    } catch (err) {
      console.error('Broadcast failed:', err);
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
        <header className="h-24 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-12 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
              <ShieldAlert className="text-brand-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">Admin <span className="text-brand-primary">Terminal</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global System Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-900 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              System Online: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-12 py-12 space-y-12">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Total Users" value={users.length.toString()} icon={Users} color="brand-primary" />
            <StatCard label="Admins" value={users.filter(u => u.role === 'admin').length.toString()} icon={Shield} color="brand-secondary" />
            <StatCard label="Active Sessions" value="124" icon={Activity} color="brand-success" />
            <StatCard label="Growth" value="+12%" icon={TrendingUp} color="brand-warning" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* User Management Section */}
            <div className="lg:col-span-8 space-y-8">
              <section className="glass-card rounded-[2.5rem] p-8 space-y-8 border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <Users className="text-brand-primary" size={20} />
                    User Directory
                  </h2>
                  <div className="relative group flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search UID, Name or @username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glass-input w-full py-2.5 pl-12 pr-4 text-xs border-white/10"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                        <th className="text-left pb-4">User</th>
                        <th className="text-left pb-4">Role</th>
                        <th className="text-left pb-4">Activity</th>
                        <th className="text-right pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <Loader2 className="animate-spin text-brand-primary mx-auto" size={32} />
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-brand-primary/30 transition-all" />
                                <div>
                                  <p className="text-sm font-black text-slate-100">{user.name}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">@{user.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                                user.role === 'admin'
                                ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                : 'bg-slate-900 text-slate-400 border-white/5'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2 text-brand-success">
                                <Activity size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                              </div>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
                                  <UserCheck size={16} />
                                </button>
                                <button className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-brand-danger hover:bg-brand-danger/10 transition-all">
                                  <Ban size={16} />
                                </button>
                                <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                  <MoreVertical size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Sidebar Tools */}
            <div className="lg:col-span-4 space-y-8">
              {/* Broadcast Tool */}
              <section className="glass-card rounded-[2.5rem] p-8 border-brand-primary/10 bg-brand-primary/[0.02] space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-xl">
                    <Bell className="text-brand-primary" size={20} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight">Global Broadcast</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Send a push notification and system message to every registered user on OKOP.
                </p>
                <form onSubmit={handleBroadcast} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Broadcast Title..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="glass-input w-full py-3 px-4 text-xs"
                  />
                  <textarea
                    placeholder="Global message content..."
                    rows={4}
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    className="glass-input w-full py-3 px-4 text-xs resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sendingBroadcast}
                    className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20 hover:opacity-90 active:scale-95 transition-all"
                  >
                    {sendingBroadcast ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Launch Notification</>}
                  </button>
                </form>
              </section>

              {/* Real-time Activity Tracker */}
              <section className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                    <Activity className="text-brand-success" size={20} />
                    Live Tracker
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-success/10 rounded-md">
                    <div className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-brand-success uppercase">Live</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 group cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500">
                        <MapPin size={16} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black text-slate-300">New Check-in</p>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">2m ago</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1"><span className="text-white">Aryan Shah</span> checked into <span className="text-brand-primary">Main Library</span></p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 bg-slate-900/50 hover:bg-slate-900 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                  Open Activity Map
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className={`glass-card p-6 rounded-[2.5rem] border-white/5 relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 blur-2xl rounded-full -mr-12 -mt-12 transition-all duration-700 group-hover:scale-125`} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-100 tracking-tighter">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color} shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
