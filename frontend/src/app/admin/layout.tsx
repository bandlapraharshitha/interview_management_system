'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

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
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Logo className="invert brightness-0" />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            Control Panel
          </Link>
          <Link href="/admin/interviewers" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 font-medium transition-colors">
            <Users className="w-5 h-5 text-slate-400" />
            Interviewers
          </Link>
          <Link href="/admin/interviews" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-slate-300 font-medium transition-colors">
            <CalendarDays className="w-5 h-5 text-slate-400" />
            Interviews
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-3">
            <Badge className="mb-2 bg-indigo-500 hover:bg-indigo-600">Admin</Badge>
            <p className="text-sm font-medium truncate">{user.name}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800" onClick={logout}>
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
