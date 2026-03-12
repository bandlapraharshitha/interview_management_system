'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user?.role !== 'user') {
      router.push(user?.role === 'admin' ? '/admin' : '/interviewer');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b">
          <Logo />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/dashboard' ? 'bg-purple-50 text-[#563574]' : 'hover:bg-gray-100 text-gray-700'}`}>
            <Home className={`w-5 h-5 ${pathname === '/dashboard' ? 'text-[#563574]' : 'text-gray-500'}`} />
            Dashboard
          </Link>
          <Link href="/schedule" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/schedule' ? 'bg-purple-50 text-[#563574]' : 'hover:bg-gray-100 text-gray-700'}`}>
            <Calendar className={`w-5 h-5 ${pathname === '/schedule' ? 'text-[#563574]' : 'text-gray-500'}`} />
            Schedule Interview
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b flex items-center justify-between px-6 md:hidden">
           <Logo />
           <Button variant="ghost" size="icon" onClick={logout}><LogOut className="w-5 h-5" /></Button>
        </header>
        <div className="p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
