'use client';

import React from 'react';
import { ComparisonProvider } from '@/context/ComparisonContext';
import MentorCompareBar from '@/components/MentorCompareBar';

export default function ComparisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <ComparisonProvider>
      {children}
      <MentorCompareBar />
    </ComparisonProvider>
  );
}
