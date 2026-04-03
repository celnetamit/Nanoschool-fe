import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, GitCompare, Sparkles } from 'lucide-react';
import { getMentorById } from '@/lib/mentors';
import ComparisonDashboard from '@/components/mentors/ComparisonDashboard';

export const metadata = {
  title: 'AI Mentor Comparison | NanoSchool',
  description: 'Intelligent side-by-side mentor comparison and selection engine.',
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const resolvedParams = await searchParams;
  const idsParam = resolvedParams.ids || '';
  const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);

  if (ids.length < 2) {
    notFound();
  }

  // Fetch all mentors in parallel
  const mentors = (await Promise.all(ids.map(id => getMentorById(id)))).filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getMentorById>>>[];

  if (mentors.length < 2) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#05070a] pb-32 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 container max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end gap-8 justify-between">
          <div className="max-w-2xl">
            <Link href="/mentors" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 transition-all group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Directory
            </Link>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border border-indigo-500/30 rounded-[1.5rem] flex items-center justify-center shadow-2xl text-indigo-400">
                <GitCompare className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Mentor Intelligence</h1>
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Comparing {mentors.length} elite mentors using weighted matching algorithms
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-20">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Powered by</p>
                <p className="text-xs font-bold text-indigo-400">NS Prediction Engine</p>
             </div>
             <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
             <Link href="/mentors" className="px-6 py-3.5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 transition-all">
                Add Mentors
             </Link>
          </div>
        </div>

        {/* Intelligence Grid */}
        <ComparisonDashboard mentors={mentors} />

      </div>
    </div>
  );
}
