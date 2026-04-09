'use client';

import { Package, Grid } from 'lucide-react';

export default function ProductsSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 shadow-sm"></div>
            <div className="h-10 w-64 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-4 w-full max-w-xl bg-slate-100 rounded-md"></div>
          <div className="h-4 w-2/3 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-12 w-40 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-slate-100 pb-2">
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
        <div className="h-8 w-32 bg-slate-100 rounded-lg"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-20 h-20 rounded-3xl bg-slate-100"></div>
              <div className="space-y-2">
                <div className="h-6 w-20 bg-slate-200 rounded-xl"></div>
                <div className="h-4 w-16 bg-slate-100 rounded-lg ml-auto"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-8 w-full bg-slate-200 rounded-xl"></div>
              <div className="h-4 w-3/4 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="space-y-3 pt-4">
               <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-100 rounded-full"></div>
                  <div className="h-3 w-12 bg-slate-100 rounded-full"></div>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-200 w-1/3"></div>
               </div>
            </div>
            <div className="h-14 w-full bg-slate-100 rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
