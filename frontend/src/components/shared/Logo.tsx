import React from 'react';
import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded shrink-0 bg-primary flex items-center justify-center text-primary-foreground font-bold leading-none select-none" style={{ backgroundColor: '#563574' }}>
        ele
      </div>
      <span className="text-xl font-bold tracking-tight text-primary" style={{ color: '#563574' }}>
        WingMann
      </span>
    </Link>
  );
}
