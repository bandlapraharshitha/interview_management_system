import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 flex-1">
      <header className="px-6 h-20 flex items-center border-b bg-white static top-0 w-full z-10">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-gray-400">
        <p>Return to <Link href="/" className="hover:text-primary underline">Home</Link></p>
      </footer>
    </div>
  );
}
