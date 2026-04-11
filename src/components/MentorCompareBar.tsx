'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';

export default function MentorCompareBar() {
  const { compared, toggle, clear } = useComparison();
  const pathname = usePathname();

  if (compared.length < 2 || pathname === '/mentors/compare') return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] flex justify-center pb-4 px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[800px] bg-[#111418]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_-20px_60px_-10px_rgba(0,0,0,0.8)] p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Compare icon + count */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Comparing</p>
            <p className="text-base text-white font-extrabold leading-none">{compared.length} / 4 Mentors</p>
          </div>
        </div>

        {/* Mentor thumbnails */}
        <div className="flex items-center gap-2 flex-1 overflow-hidden min-w-0">
          {compared.map(mentor => (
            <div key={mentor.id} className="relative shrink-0 group">
              <div className="relative w-10 h-10 rounded-[12px] overflow-hidden border-2 border-white/20 bg-black">
                <Image src={mentor.image} alt={mentor.name} fill sizes="40px" className="object-cover" />
              </div>
              <button
                onClick={() => toggle(mentor)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400 shadow-md"
                title={`Remove ${mentor.name}`}
              >
                <X className="w-3 h-3" />
              </button>
              <p className="text-[8px] text-slate-400 font-bold mt-1 truncate max-w-[40px] text-center leading-tight">{mentor.name.split(' ')[0]}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={clear} 
            className="px-4 py-2.5 rounded-[12px] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Clear
          </button>
          <Link 
            href={`/mentors/compare?ids=${compared.map(m => m.id).join(',')}`}
            className="px-5 py-2.5 rounded-[12px] bg-white text-black text-sm font-extrabold flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:translate-y-0 transform"
          >
            Compare Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
