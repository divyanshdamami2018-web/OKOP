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
        // Only redirect if not already on login/signup/public
        router.push('/login');
      } else if (user && isAuthRoute) {
        // If user is logged in but on login/signup, go to feed
        router.push('/feed');
      }
    }
  }, [user, loading, timedOut, isPublicRoute, isAuthRoute, router]);

  // Public routes render immediately
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If auth is still resolving, show loader
  if (loading && !timedOut) {
    return <LoadingLogo />;
  }

  // Final check: if we're not loading and have no user on a protected route
  if (!user && !isPublicRoute) {
    return <LoadingLogo />;
  }

  return <>{children}</>;
};
