import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * OKOP'S Master Middleware
 * Handles session persistence, cookie synchronization, and campus route protection.
 * Optimized for Next.js 15 stability.
 */

/**
 * Robust cookie synchronization for Next.js 15.
 */
function syncCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    });
  });
}

// Guests can only see these pages
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/forgot-password", "/terms", "/privacy"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 1. Refresh/Get Session (Updates 'res' cookies automatically)
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isAuthenticated = !!session;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = ["/login", "/signup"].includes(pathname);

  // LOGIC A: Root path handling: If logged in, go to feed. If not, STAY on landing page
  if (pathname === "/") {
    if (isAuthenticated) {
      const redirectRes = NextResponse.redirect(new URL("/feed", req.url));
      syncCookies(res, redirectRes);
      return redirectRes;
    }
    return res;
  }

  // LOGIC B: Auth group protection: Prevent logged-in students from seeing login/signup
  if (isAuthenticated && isAuthRoute) {
    const redirectRes = NextResponse.redirect(new URL("/feed", req.url));
    syncCookies(res, redirectRes);
    return redirectRes;
  }

  // LOGIC C: Strict App protection: Redirect guests away from everything except public routes
  if (!isAuthenticated && !isPublicRoute) {
    const redirectRes = NextResponse.redirect(new URL("/login", req.url));
    return redirectRes;
  }

  // LOGIC D: Force Onboarding completion before accessing protected features
  if (isAuthenticated && pathname !== "/onboarding") {
    const onboardingCompleted = session?.user?.user_metadata?.onboarding_completed;

    if (!onboardingCompleted && !isPublicRoute && !pathname.startsWith("/settings")) {
      const redirectRes = NextResponse.redirect(new URL("/onboarding", req.url));
      syncCookies(res, redirectRes);
      return redirectRes;
    }
  }

  // Return the original response (which contains updated cookies from getSession)
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - static assets (png, jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp)).*)",
  ],
};
