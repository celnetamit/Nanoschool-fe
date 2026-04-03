import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Building, Calendar, Sparkles, Ribbon, ArrowUpRight, BookOpen, Globe, Quote, Zap } from 'lucide-react';
import { getMentorById } from '@/lib/mentors';
import MentorStats from '@/components/mentors/MentorStats';
import MentorReviews from '@/components/mentors/MentorReviews';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const mentor = await getMentorById(resolvedParams.id);
  
  if (!mentor) {
    return { title: 'Mentor Not Found | NanoSchool' };
  }
  
  return {
    title: `${mentor.name} | NanoSchool mentors`,
    description: mentor.bio.slice(0, 150) + '...',
  };
}

export default async function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const mentor = await getMentorById(resolvedParams.id);

  if (!mentor) {
    notFound();
  }

  const primaryRole = mentor.designation || mentor.roles[0] || 'Expert Mentor';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-['Plus_Jakarta_Sans',sans-serif] relative pb-32">
      {/* Giant Ambient Background (Created by heavily blurring the mentor's own avatar) */}
      <div className="absolute top-0 inset-x-0 h-[70vh] overflow-hidden pointer-events-none z-0">
        <Image 
          src={mentor.image} 
          fill 
          priority
          sizes="100vw"
          className="object-cover opacity-[0.15] blur-[100px] scale-125 translate-y-[-10%]" 
          alt="Ambient glow" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>
      </div>

      <div className="container relative z-10 max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
        
        {/* Top Navigation */}
        <div className="mb-12">
          <Link href="/mentors" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold text-sm backdrop-blur-md group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Directory
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Sticky Left Sidebar Profile */}
          <div className="lg:w-[35%] flex flex-col relative">
            <div className="sticky top-10 flex flex-col items-center lg:items-start text-center lg:text-left">
               
               {/* Premium Avatar Frame */}
               <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[220px] lg:h-[220px] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl mb-8 group bg-black">
                 <Image 
                   src={mentor.image} 
                   fill 
                   priority
                   sizes="(max-width: 1024px) 160px, 220px"
                   className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
                   alt={mentor.name} 
                 />
                 <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none"></div>
                 {/* Floating Verification Badge */}
                 <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-xl">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                 </div>
               </div>

               {/* Name & Title */}
               <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 lg:mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight">
                 {mentor.name}
               </h1>
               <div className="text-indigo-400 font-extrabold uppercase tracking-widest text-xs md:text-sm mb-8 flex items-center justify-center lg:justify-start gap-2">
                 <Ribbon className="w-4 h-4" />
                 {primaryRole}
               </div>
               
               {/* Quick Stats Card */}
               <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 mb-8 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                 <div className="flex flex-col gap-5">
                   {mentor.organization && (
                     <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Organization</span>
                        <span className="text-sm font-bold text-slate-200">{mentor.organization}</span>
                     </div>
                   )}
                   {mentor.country && (
                     <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                        <span className="text-sm font-bold text-slate-200">{mentor.country}</span>
                     </div>
                   )}
                   {mentor.experience && (
                     <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Experience</span>
                        <span className="text-sm font-bold text-slate-200">{mentor.experience}</span>
                     </div>
                   )}
                 </div>
               </div>

               {/* CTA Button */}
               <button className="w-full relative group overflow-hidden rounded-[1.5rem] p-1">
                 <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[1.5rem] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                 <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-[1.3rem] py-4 px-6 flex items-center justify-center gap-3 transition-transform duration-300 group-hover:scale-[0.98]">
                   <span className="font-extrabold text-[15px] tracking-wide text-white">Book Mentorship</span>
                   <ArrowUpRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </div>
               </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:w-[65%] flex flex-col gap-8 md:gap-10">
             
             {/* NEW: Stats Grid Overlaying the background */}
             <MentorStats stats={mentor.stats} />

             {/* About Module */}
             <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
               
               <h3 className="text-2xl font-extrabold mb-8 text-white flex items-center gap-3">
                 <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                 About {mentor.name.split(' ')[0]}
               </h3>
               
               {mentor.bio ? (
                 <div className="prose prose-invert max-w-none">
                   <p className="text-slate-300 leading-[1.8] font-medium text-[15px] md:text-[16px] whitespace-pre-wrap">
                     {mentor.bio}
                   </p>
                 </div>
               ) : (
                 <p className="text-slate-500 italic">No biography listed.</p>
               )}
             </div>

              {/* Skills Module */}
              <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
                
                <h3 className="text-2xl font-extrabold mb-8 text-white flex items-center gap-3">
                  <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                  Core Expertise
                </h3>
                
                {mentor.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {mentor.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-4 py-2.5 rounded-[12px] bg-white/[0.03] border border-white/10 text-slate-200 text-[13px] md:text-[14px] font-bold hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No specific skills listed.</p>
                )}
              </div>

              {/* NEW: Research & Publications (Shown only if data exists) */}
              {mentor.publications && mentor.publications.length > 0 && (
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-colors duration-700 pointer-events-none"></div>
                  
                  <h3 className="text-2xl font-extrabold mb-8 text-white flex items-center gap-3">
                    <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                    Research & Contributions
                  </h3>

                  <div className="space-y-6 relative z-10">
                    {mentor.publications.map((pub, i) => (
                      <div key={i} className="flex gap-4 group/item">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/item:border-indigo-500/50 transition-colors">
                          <BookOpen size={18} className="text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200 group-hover/item:text-white transition-colors">{pub.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">{pub.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW: Global Collaborations (Shown only if data exists) */}
              {mentor.collaborations && mentor.collaborations.length > 0 && (
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                  <h3 className="text-2xl font-extrabold mb-8 text-white flex items-center gap-3">
                    <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
                    International Reach
                  </h3>
                  
                  <p className="text-sm text-slate-400 font-medium mb-8">Trusted by academic institutions and enterprises worldwide for specialized training and technical consultancy.</p>

                  <div className="flex flex-wrap gap-6 opacity-40 group-hover:opacity-70 transition-opacity duration-700 grayscale group-hover:grayscale-0">
                    {mentor.collaborations.map((org, i) => (
                      <div key={i} className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-black uppercase tracking-widest text-slate-300">
                        {org}
                      </div>
                    ))}
                  </div>
                </div>
              )}

          </div>
        </div>

        {/* Global Reviews Section (Only if present in API) */}
        <MentorReviews reviews={mentor.reviews} />

      </div>
    </div>
  );
}
