'use client';

import React from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Top Navbar */}
      <Navbar />

      {/* Desktop Sidebar */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-24 transition-all duration-500">
        <main className="flex-1 pt-28 md:pt-32 pb-24 md:pb-10 relative z-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
