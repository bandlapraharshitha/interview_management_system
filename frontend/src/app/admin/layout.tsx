'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push(user.role === 'interviewer' ? '/interviewer' : '/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b">
          <Logo />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/admin' ? 'bg-purple-50 text-[#563574]' : 'hover:bg-gray-100 text-gray-700'}`}>
            <LayoutDashboard className={`w-5 h-5 ${pathname === '/admin' ? 'text-[#563574]' : 'text-gray-500'}`} />
            Control Panel
          </Link>
          <Link href="/admin/interviewers" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/admin/interviewers' ? 'bg-purple-50 text-[#563574]' : 'hover:bg-gray-100 text-gray-700'}`}>
            <Users className={`w-5 h-5 ${pathname === '/admin/interviewers' ? 'text-[#563574]' : 'text-gray-500'}`} />
            Interviewers
          </Link>
          <Link href="/admin/interviews" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/admin/interviews' ? 'bg-purple-50 text-[#563574]' : 'hover:bg-gray-100 text-gray-700'}`}>
            <CalendarDays className={`w-5 h-5 ${pathname === '/admin/interviews' ? 'text-[#563574]' : 'text-gray-500'}`} />
            Interviews
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-3">
            <Badge className="mb-2 bg-purple-100 text-[#563574] hover:bg-purple-100">Admin</Badge>
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
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
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

// Inline badge for the layout since we haven't imported the shadcn one
function Badge({ children, className }: any) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>
}
