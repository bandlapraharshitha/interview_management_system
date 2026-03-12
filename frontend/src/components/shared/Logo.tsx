import React from 'react';
import Link from 'next/link';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'], weight: ['1000', '1000'] });

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* 
        This points directly to the 'public/' folder in your Next.js project.
        By default, the image should be placed at: frontend/public/logo.png 
        You can change the width/hight classes (w-8 h-8) to make it larger or smaller.
      */}
      <img src="/logo.png" alt="WingMann Logo" className="w-8 h-8 object-contain shrink-0" />
      <span className={`text-2xl font-extrabold tracking-tight text-primary ${nunito.className}`} style={{ color: '#563574' }}>
        WingMann
      </span>
    </Link>
  );
}
