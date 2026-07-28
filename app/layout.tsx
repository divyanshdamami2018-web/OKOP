import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LazyShells } from "@/components/layout/LazyShells";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "OKOP'S | Your Campus, Amplified",
  description: "The ultimate social pulse for students. Join activities, find study buddies, and discover your campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-primary/20 selection:text-brand-primary overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <AuthGuard>
              <div className="relative flex flex-col min-h-screen">
                <Navbar />
                <BottomNav />
                <LazyShells />

                <main className="flex-1 pt-28 md:pt-36 pb-24 md:pb-10 relative z-10">
                  {children}
                </main>

                {/* Dynamic Background Mesh */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-light-mesh dark:hidden" />
                  <div className="absolute top-0 left-0 w-full h-full bg-dark-mesh hidden dark:block" />

                  <div className="absolute top-[-10%] -left-[10%] w-[50%] h-[50%] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse-gentle" />
                  <div className="absolute bottom-[-10%] -right-[10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[120px] rounded-full animate-pulse-gentle animate-delay-200" />
                </div>
              </div>
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
