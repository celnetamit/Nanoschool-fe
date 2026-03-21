import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getMentors } from '@/lib/mentors';
import MentorCardCompareButton from '@/components/MentorCardCompareButton';

export const metadata = {
  title: 'Our Mentors | NanoSchool',
  description: 'Meet our world-class mentors who lead the way in AI, Biotech, and Nanotech.',
};

const getIndustrialColors = (domain: string) => {
  if (domain.includes('Artificial Intelligence') || domain.includes('AI')) {
    return { accent: 'to-indigo-500', glow: 'bg-indigo-500', badgeText: 'text-indigo-400', badgeBg: 'bg-indigo-500/10', badgeBorder: 'border-indigo-500/20' };
  } else if (domain.includes('Biotechnology') || domain.includes('Biotech')) {
    return { accent: 'to-emerald-500', glow: 'bg-emerald-500', badgeText: 'text-emerald-400', badgeBg: 'bg-emerald-500/10', badgeBorder: 'border-emerald-500/20' };
  } else if (domain.includes('Nanotechnology') || domain.includes('Nanotech')) {
    return { accent: 'to-cyan-500', glow: 'bg-cyan-500', badgeText: 'text-cyan-400', badgeBg: 'bg-cyan-500/10', badgeBorder: 'border-cyan-500/20' };
  }
  return { accent: 'to-blue-500', glow: 'bg-blue-500', badgeText: 'text-blue-400', badgeBg: 'bg-blue-500/10', badgeBorder: 'border-blue-500/20' };
};

const DOMAINS = ['Engineering', 'Biotechnology', 'AI', 'Sustainability', 'Nanotechnology', 'Law', 'Physics', 'Electrical', 'Management', 'Architecture', 'Miscellaneous', 'AI-ML', 'Finance', 'Pharmacy', 'Chemistry', 'Others'];

export default async function MentorsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const page = parseInt(Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page || '1');
  const search = Array.isArray(resolvedParams.search) ? resolvedParams.search[0] : resolvedParams.search || '';
  const experience = Array.isArray(resolvedParams.experience) ? resolvedParams.experience[0] : resolvedParams.experience || '';
  const domainParams = resolvedParams.domain;
  const activeDomains = Array.isArray(domainParams) ? domainParams : (typeof domainParams === 'string' ? [domainParams] : []);
  
  const pageSize = 12; // Adjusted to evenly fit a 3-column grid
  
  const { mentors, totalCount, totalApprovedCount } = await getMentors(page, pageSize, { search, domains: activeDomains, experience });

  const hasNextPage = mentors.length === pageSize && (page * pageSize < totalCount);
  const hasPrevPage = page > 1;

  // Helper to maintain filter state in pagination links
  const getPaginationLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (experience) params.append('experience', experience);
    activeDomains.forEach(d => params.append('domain', d));
    params.set('page', targetPage.toString());
    return `/mentors?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#05070a] pb-24 relative overflow-x-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-[96rem] pt-32 flex-grow">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.5)] mb-6 text-xs font-bold text-slate-300 tracking-wide uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            NanoSchool Experts
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
             Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Mentor</span>
          </h1>
          <p className="text-base md:text-lg text-[#94a3b8] leading-relaxed max-w-2xl mx-auto font-medium">
            Get personalized guidance and profound insights from industry pioneers actively shaping the future of tech.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] xl:w-[320px] shrink-0 sticky top-24 z-20">
            <form action="/mentors" method="GET" className="bg-[#111418] rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <h2 className="text-xl font-extrabold text-white mb-6">Filter</h2>
              
              {/* Keyword Search */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Search Keyword</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    name="search" 
                    defaultValue={search} 
                    placeholder="Name, role, skills..." 
                    className="w-full bg-black/30 border border-white/10 rounded-[14px] py-3 pl-11 pr-4 text-white text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white/[0.03] transition-colors placeholder:text-slate-600 shadow-inner" 
                  />
                </div>
              </div>

              {/* Domains list */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Expertise Domain</label>
                <div className="max-h-[240px] overflow-y-auto pr-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                  {DOMAINS.map(d => (
                    <label key={d} className="flex items-center gap-3.5 cursor-pointer group">
                      <div className="relative flex items-center justify-center shrink-0">
                        <input 
                          type="checkbox" 
                          name="domain" 
                          value={d} 
                          defaultChecked={activeDomains.includes(d)} 
                          className="peer w-[18px] h-[18px] rounded-[6px] appearance-none border border-white/20 bg-black/50 checked:bg-indigo-500 checked:border-indigo-500 transition-colors cursor-pointer shadow-inner" 
                        />
                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-slate-300 text-[13px] font-medium group-hover:text-white transition-colors">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Experience</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="experience" 
                    defaultValue={experience} 
                    placeholder="e.g. 10 Years, Lead..." 
                    className="w-full bg-black/30 border border-white/10 rounded-[14px] py-3 px-4 text-white text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white/[0.03] transition-colors placeholder:text-slate-600 shadow-inner" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-100 hover:bg-white text-black font-extrabold py-3.5 rounded-[14px] transition-all hover:scale-[1.02] shadow-[0_10px_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
                 Apply Filters
              </button>
              
              {/* Reset link if filters are active */}
              {(search || experience || activeDomains.length > 0) && (
                <Link href="/mentors" className="mt-4 text-center block text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors">
                  Clear All Filters
                </Link>
              )}
            </form>
          </aside>

          {/* Main Grid Area */}
          <div className="flex-1 min-w-0">
            
            {/* Results Metrics Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-1">
              <div className="flex items-center gap-3">
                <span className="text-white text-[15px] font-extrabold tracking-tight">
                  {totalCount} <span className="text-slate-400 font-medium ml-1">mentors found</span>
                </span>
                {totalCount < totalApprovedCount && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-[6px] border border-indigo-500/20">
                      Filtered Result
                    </span>
                  </>
                )}
              </div>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                {totalApprovedCount} Total Verified Experts
              </span>
            </div>

            {mentors.length === 0 ? (
              <div className="text-center py-20 bg-[#111418] rounded-[40px] border border-white/10 shadow-xl max-w-2xl mx-auto flex flex-col items-center">
                <Search className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-xl text-white font-extrabold mb-2">No mentors found</p>
                <p className="text-[#94a3b8] mb-6 font-medium">Try adjusting your keyword or filter options.</p>
                <Link href="/mentors" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold transition-all hover:bg-white/20">
                  <ChevronLeft className="w-4 h-4" /> Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 xl:gap-8">
                {mentors.map((mentor) => {
                  const primaryDomain = mentor.domains[0] || 'Expert';
                  const primaryRole = mentor.roles[0] || 'Mentor';
                  const colors = getIndustrialColors(primaryDomain);

                  return (
                    <div 
                      key={mentor.id} 
                      className="group relative w-full p-6 bg-[#111418] rounded-[32px] overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_60px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_40px_80px_-15px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.1)] flex flex-col"
                    >
                      <div className={`absolute w-[120px] h-[120px] ${colors.glow} blur-[60px] -bottom-[60px] -right-[60px] opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40`}></div>
                      <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

                      {/* Header */}
                      <div className="flex items-center gap-4 mb-5 relative z-10 w-full">
                        <div className={`relative w-[64px] h-[64px] rounded-[18px] p-[2px] bg-gradient-to-br from-white via-transparent ${colors.accent} shrink-0`}>
                          <div className="w-full h-full rounded-[16px] bg-black overflow-hidden relative">
                            <Image
                              src={mentor.image}
                              alt={mentor.name}
                              fill
                              sizes="(max-width: 640px) 100px, 100px"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                           <h2 className="m-0 text-white text-[18px] font-extrabold tracking-[-0.5px] leading-tight break-words max-w-full" title={mentor.name}>
                             {mentor.name}
                           </h2>
                           <div className="mt-1.5 inline-block w-full">
                             <span className={`inline-block ${colors.badgeText} ${colors.badgeBg} border ${colors.badgeBorder} px-2.5 py-1 rounded-[8px] text-[9px] font-bold uppercase tracking-[0.5px] truncate max-w-[100%] align-bottom`} title={mentor.designation || primaryRole}>
                               {mentor.designation || primaryRole}
                             </span>
                           </div>
                        </div>
                      </div>

                      {/* Bento Grid */}
                      <div className="grid grid-cols-2 gap-2.5 mb-3 shrink-0 relative z-10 w-full">
                        <div className="bg-black/20 border border-white/[0.03] rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative overflow-hidden group/module hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                          <span className="text-[9px] font-bold text-[#94a3b8] uppercase block mb-0.5 tracking-wider">Domain</span>
                          <span className="text-white font-bold text-xs truncate block" title={primaryDomain}>
                            {primaryDomain || 'N/A'}
                          </span>
                        </div>
                        <div className="bg-black/20 border border-white/[0.03] rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative overflow-hidden group/module hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                          <span className="text-[9px] font-bold text-[#94a3b8] uppercase block mb-0.5 tracking-wider">Experience</span>
                          <span className="text-white font-bold text-xs truncate block" title={mentor.experience}>
                            {mentor.experience || 'Experienced'}
                          </span>
                        </div>
                        <div className="bg-black/20 border border-white/[0.03] rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative overflow-hidden group/module hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                          <span className="text-[9px] font-bold text-[#94a3b8] uppercase block mb-0.5 tracking-wider">Location</span>
                          <span className="text-white font-bold text-xs truncate block" title={mentor.country}>
                            {mentor.country || 'Global'}
                          </span>
                        </div>
                        <div className="bg-black/20 border border-white/[0.03] rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative overflow-hidden group/module hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col justify-center">
                           <span className="text-[9px] font-bold text-[#94a3b8] uppercase block mb-0.5 tracking-wider">Organization</span>
                           <span className="text-white font-bold text-xs truncate block" title={mentor.organization}>
                             {mentor.organization || 'Independent'}
                           </span>
                        </div>
                      </div>

                      {/* Skills Module */}
                      <div className="bg-black/20 border border-white/[0.03] rounded-3xl p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative flex-grow flex flex-col z-10 hover:bg-white/[0.04] transition-all duration-300">
                        <span className="text-[10px] font-bold text-[#94a3b8] uppercase block mb-2 shrink-0">Skills</span>
                        <div 
                          className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[85px] pr-1 pb-1 w-full relative" 
                          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
                        >
                           {mentor.skills.map((skill, idx) => (
                              <div 
                                key={idx} 
                                className="px-2.5 py-1.5 rounded-[8px] bg-white/[0.05] border border-white/[0.08] text-[11px] sm:text-xs text-white/90 font-bold max-w-full break-words leading-tight"
                              >
                                {skill}
                              </div>
                           ))}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 flex gap-2 w-full shrink-0 z-10">
                        <MentorCardCompareButton mentor={{
                          id: String(mentor.id),
                          name: mentor.name,
                          image: mentor.image,
                          designation: mentor.designation,
                          organization: mentor.organization,
                          country: mentor.country,
                          experience: mentor.experience,
                          domain: mentor.domains[0] || '',
                          skills: mentor.skills,
                        }} />

                        <Link href={`/mentors/${mentor.id}`} className="flex-1 bg-white text-black p-2 sm:p-3 rounded-[16px] font-extrabold text-[12px] sm:text-[13px] flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(255,255,255,0.15)] focus:outline-none">
                          View Profile
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Pagination */}
            {(hasNextPage || hasPrevPage) && (
              <div className="mt-16 flex justify-center pb-8 z-20 relative">
                <div className="inline-flex items-center gap-1.5 p-2 bg-[#111418] rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/[0.08]">
                  <Link 
                    href={hasPrevPage ? getPaginationLink(page - 1) : '#'}
                    className={`flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-300 ${
                      hasPrevPage 
                        ? 'text-white hover:bg-white/10 font-bold active:scale-95 border border-transparent hover:border-white/10' 
                        : 'text-white/20 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>

                  <div className="px-6 py-2.5 text-[13px] font-extrabold text-white bg-white/5 rounded-[14px] min-w-[5rem] text-center border border-white/[0.05]">
                    P {page}
                  </div>

                  <Link 
                    href={hasNextPage ? getPaginationLink(page + 1) : '#'}
                    className={`flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-300 ${
                      hasNextPage 
                        ? 'text-white hover:bg-white/10 font-bold active:scale-95 border border-transparent hover:border-white/10' 
                        : 'text-white/20 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
