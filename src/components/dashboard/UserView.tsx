'use client';

import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Calendar, 
  Zap,
  TrendingUp,
  Bookmark
} from 'lucide-react';

interface Enrollment {
  course: string;
  date: string;
  status: string;
}

export default function UserView({ userEmail }: { userEmail: string }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userEnrollments = data.stats.recent.filter((e: any) => e.email === userEmail);
          setEnrollments(userEnrollments);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userEmail]);

  if (loading) return (
    <div className="space-y-12">
        <div className="h-[340px] bg-white/50 backdrop-blur-md rounded-[3rem] border border-slate-200/40 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>)}
        </div>
    </div>
  );

  return (
    <div className="space-y-14 animate-fade-in pb-20 px-2">
      {/* Immersive Student Banner - World Class Peak */}
      <section className="relative overflow-hidden rounded-[3.5rem] bg-slate-950 p-12 lg:p-16 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/5 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 opacity-60"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Student Access Node</span>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
                       Greetings,<br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">{userEmail.split('@')[0]}</span>
                    </h1>
                    <p className="text-slate-400 text-lg lg:text-xl font-bold max-w-md leading-relaxed opacity-80">
                       Ready to continue your trajectory in the <span className="text-white decoration-blue-500 underline underline-offset-8 decoration-2 cursor-pointer hover:text-blue-400 transition-all">NanoScience Architecture</span> track?
                    </p>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                    <div className="flex items-center gap-4 group/stat cursor-default">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-blue-400 group-hover/stat:bg-blue-600 group-hover/stat:text-white transition-all duration-500">
                            <Zap size={24} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tighter leading-none">{enrollments.length}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Blocks</p>
                        </div>
                    </div>
                    <div className="w-px h-12 bg-white/10 self-center hidden sm:block"></div>
                    <div className="flex items-center gap-4 group/stat cursor-default">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-400 group-hover/stat:bg-indigo-600 group-hover/stat:text-white transition-all duration-500">
                            <TrendingUp size={24} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tighter leading-none">84%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Rank</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block relative">
                 <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 p-10 flex items-center justify-center group/card transition-all hover:border-white/20">
                    <div className="text-center space-y-6">
                         <div className="relative inline-block">
                            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                            <Award size={80} className="text-blue-500 relative z-10 group-hover/card:scale-110 transition-transform duration-700" />
                         </div>
                         <div className="space-y-2">
                             <h3 className="text-2xl font-black tracking-tighter">Research Milestone</h3>
                             <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto opacity-70">Complete 2 more modules to reach Senior Researcher status.</p>
                         </div>
                         <button className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-950/20">
                            Resume Last Node <ArrowRight size={16} />
                         </button>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* Course Progress Section - Sapphire Tiles */}
      <section className="space-y-10">
        <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <div>
                   <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Current Enrollment Tracks</h2>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic opacity-80">Synchronizing curriculum data...</p>
                </div>
            </div>
            <button className="hidden sm:flex items-center gap-3 text-[11px] font-black text-blue-600 hover:text-blue-900 transition-all uppercase tracking-widest">
               Sync Registry <Clock size={16} className="stroke-[2.5]" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {enrollments.length > 0 ? (
            enrollments.map((course, idx) => (
              <CourseCard key={idx} course={course} mounted={mounted} />
            ))
          ) : (
            <div className="col-span-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center group cursor-pointer hover:border-blue-200 transition-all">
                <div className="relative mb-8 inline-block">
                    <div className="absolute -inset-4 bg-slate-100 rounded-full blur-xl group-hover:bg-blue-50 transition-colors"></div>
                    <BookOpen size={64} className="text-slate-300 relative z-10 group-hover:text-blue-300 transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 tracking-tighter mb-3">No Active Research Nodes</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed opacity-80">Your dashboard is currently idle. Initialize your professional journey by exploring our 2026 Academic Catalogue.</p>
                <button className="mt-10 px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-2xl">
                    Deploy Learning Track
                </button>
            </div>
          )}
        </div>
      </section>

      {/* Information Grid - Secondary Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-6">
          <div className="xl:col-span-2 space-y-10">
                <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-2xl shadow-slate-200/20 overflow-hidden group">
                    <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/[0.3]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                <Calendar size={22} className="stroke-[2.5]" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-950 tracking-tighter">Academic Timeline</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next 14 Days</span>
                    </div>
                    <div className="p-10 space-y-8">
                        <TimelineItem title="Advanced Nano-Ethics" type="Workshop" time="Today, 14:00" status="Live" />
                        <TimelineItem title="Introduction to Molecular Design" type="Course" time="Tomorrow, 10:00" status="Upcoming" />
                        <TimelineItem title="Lab Safety Protocols" type="Internal" time="Friday, 09:00" status="Required" />
                    </div>
                </div>
          </div>

          <div className="space-y-12">
               <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-950/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 space-y-8">
                          <CheckCircle2 size={40} className="text-white/40" />
                          <div className="space-y-2">
                             <h4 className="text-2xl font-black tracking-tighter">Mentorship Active</h4>
                             <p className="text-indigo-100 text-sm font-bold opacity-80 leading-relaxed">System has allocated Dr. Sarah Chen as your lead supervisor for the current sprint.</p>
                          </div>
                          <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl shadow-black/10">
                             Node Messaging
                          </button>
                    </div>
               </div>
          </div>
      </div>
    </div>
  );
}

function CourseCard({ course, mounted }: { course: Enrollment, mounted: boolean }) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[3rem] border border-slate-200/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-700 group cursor-pointer hover:-translate-y-2 relative overflow-hidden">
        {/* Decorative Internal Glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        
        <div className="p-10 space-y-10 relative z-10">
            <div className="flex justify-between items-start">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:rotate-6 transition-all duration-700 shadow-inner">
                    <BookOpen size={36} className="stroke-[1.5]" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        {course.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 tracking-tighter italic opacity-60">
                        {mounted ? new Date(course.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-blue-700 transition-colors">
                    {course.course}
                </h3>
                <p className="text-sm font-bold text-slate-500 opacity-70">Industrial Nano-Scale Implementation Phase 1</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Node: 04/12</span>
                    <span className="text-xs font-black text-slate-900 tracking-tighter">33% Optimized</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                    <div className="h-full bg-slate-200 group-hover:bg-blue-600 rounded-full w-[33%] transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.2)]"></div>
                </div>
            </div>

            <button className="w-full py-5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-black text-slate-600 uppercase tracking-widest group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-all duration-500 flex items-center justify-center gap-3">
                Initialize Learning <Play size={14} className="fill-current" />
            </button>
        </div>
        
        {/* Ambient Hover Blob */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:opacity-100 opacity-0 transition-opacity duration-1000"></div>
    </div>
  );
}

function TimelineItem({ title, type, time, status }: any) {
    return (
        <div className="flex items-center justify-between group/item cursor-pointer">
            <div className="flex items-center gap-6">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover/item:bg-blue-500 group-hover/item:scale-150 transition-all duration-500 shadow-sm relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover/item:animate-ping opacity-40"></div>
                </div>
                <div className="space-y-1">
                    <h4 className="text-base font-black text-slate-900 group-hover/item:text-blue-700 transition-colors leading-none tracking-tight">{title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type} • {time}</p>
                </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm group-hover/item:border-blue-100 group-hover/item:text-blue-600 transition-all bg-white`}>
                {status}
            </div>
        </div>
    );
}
