'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoadingLogo } from '@/components/layout/LoadingLogo';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/terms', '/privacy'];

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [timedOut, setTimedOut] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = ['/login', '/signup'].includes(pathname);

  // Safety timeout — never spin forever (5s max)
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Redirect logic once auth is resolved
  useEffect(() => {
    if (!loading || timedOut) {
      if (!user && !isPublicRoute) {
        router.push('/login');
      } else if (user && isAuthRoute) {
        router.push('/feed');
      }
    }
  }, [user, loading, timedOut, pathname, router]);

  // Public routes render immediately — no need to wait for auth
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, show loader only briefly
  if (loading && !timedOut) {
    return <LoadingLogo />;
  }

  // If not logged in on a protected route, show loader while redirect happens
  if (!user) {
    return <LoadingLogo />;
  }

  return <>{children}</>;
};
