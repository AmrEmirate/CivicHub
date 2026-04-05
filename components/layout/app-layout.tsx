'use client';

import { useAuth } from '@/lib/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Only redirect if auth has completely loaded and the user is definitely unauthenticated
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Handle route change to close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Optional: show a layout skeleton or just nothing while loading auth completely on client side
  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-surface">
        <p className="text-on-surface/60 font-medium tracking-widest">Loading Gateway...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <div className="flex h-[100dvh] w-full bg-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 flex-shrink-0 z-40 relative">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-on-background/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface relative">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-12">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
