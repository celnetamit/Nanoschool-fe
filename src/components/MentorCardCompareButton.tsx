'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CompareMentor, useComparison } from '@/context/ComparisonContext';

interface MentorCardCompareButtonProps {
  mentor: CompareMentor;
}

export default function MentorCardCompareButton({ mentor }: MentorCardCompareButtonProps) {
  const { toggle, isSelected } = useComparison();
  const selected = isSelected(mentor.id);

  return (
    <label
      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border transition-all duration-300 rounded-[16px] px-2 py-2 sm:py-3 w-[35%] group/comp ${
        selected
          ? 'bg-indigo-500/20 border-indigo-500/50 hover:bg-indigo-500/30'
          : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.08]'
      }`}
      onClick={(e) => {
        e.preventDefault();
        toggle(mentor);
      }}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
          selected ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 bg-black/50'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>
      </div>
      <span className={`transition-colors text-[10px] sm:text-[11px] font-bold leading-none select-none tracking-wide uppercase ${selected ? 'text-indigo-300' : 'text-[#94a3b8] group-hover/comp:text-white'}`}>
        {selected ? 'Added' : 'Compare'}
      </span>
    </label>
  );
}
