'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ExternalLink, 
  PlayCircle, 
  Award,
  Video,
  MapPin,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface ProductsViewProps {
  initialCourses: any[];
  initialWorkshops: any[];
  isAdmin?: boolean;
}

export default function ProductsView({ initialCourses, initialWorkshops, isAdmin = false }: ProductsViewProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Premium Tab Switcher */}
      <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl w-fit border border-slate-200 shadow-inner">
        <button
          onClick={() => setActiveTab('courses')}
          className={`
            flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-black transition-all duration-500
            ${activeTab === 'courses' 
              ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10 border border-blue-100' 
              : 'text-slate-500 hover:text-slate-900'}
          `}
        >
          <BookOpen size={18} className={activeTab === 'courses' ? 'text-blue-600' : 'text-slate-400'} />
          Technical Courses
          {initialCourses.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'courses' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
              {initialCourses.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('workshops')}
          className={`
            flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-black transition-all duration-500
            ${activeTab === 'workshops' 
              ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10 border border-blue-100' 
              : 'text-slate-500 hover:text-slate-900'}
          `}
        >
          <Calendar size={18} className={activeTab === 'workshops' ? 'text-blue-600' : 'text-slate-400'} />
          Live Workshops
          {initialWorkshops.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'workshops' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
              {initialWorkshops.length}
            </span>
          )}
        </button>
      </div>

      {/* Content Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {activeTab === 'courses' ? (
          initialCourses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {initialCourses.map((course: any, idx: number) => {
                const meta = course.meta || course.item_meta || {};
                const courseTitle = course.title || meta['mlsd4'] || meta['9789'] || 'Specialized Program';
                const isPaid = meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success';
                const date = mounted ? new Date(course.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : '...';

                return (
                  <div key={idx} className="group relative bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 transition-all duration-500 overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                          <Award size={120} />
                      </div>
                      <div className="p-8 flex-grow">
                          <div className="flex items-center justify-between mb-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                                  isPaid 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' 
                                  : 'bg-amber-50 text-amber-600 border-amber-200/50'
                              }`}>
                                  {isPaid ? 'Verified' : 'Pending'}
                              </span>
                              <div className="text-slate-400">
                                  <Clock size={18} />
                              </div>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors h-14 line-clamp-2">
                              {courseTitle}
                          </h3>
                          <div className="space-y-3">
                              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                  <Calendar size={16} className="text-slate-400" />
                                  Enrolled on {date}
                              </div>
                          </div>
                      </div>
                      <div className="p-8 pt-0 mt-auto">
                          {isAdmin ? (
                            <Link 
                                href={`/course/${course.originalPost?.slug || ''}`}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-100 text-slate-900 text-sm font-black hover:bg-slate-200 active:scale-[0.98] transition-all border border-slate-200"
                            >
                                <Eye size={20} />
                                View Details
                            </Link>
                          ) : (
                            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-blue-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-500/20 group-hover:translate-y-[-4px] duration-500">
                                <PlayCircle size={20} />
                                Enter Classroom
                            </button>
                          )}
                      </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon={<BookOpen size={48} />} 
              title="No courses found" 
              description="Explore our specialized programs and advanced technical courses to start your learning journey."
              linkHref="/course"
              linkText="Browse Programs"
            />
          )
        ) : (
          initialWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {initialWorkshops.map((workshop: any, idx: number) => {
                const meta = workshop.meta || workshop.item_meta || {};
                const workshopName = meta['mlsd4'] || meta['9768'] || 'Hands-on Workshop';
                const date = mounted ? new Date(workshop.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : '...';

                return (
                  <div key={idx} className="group relative bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-400/30 transition-all duration-500 overflow-hidden flex flex-col">
                      <div className="absolute top-6 left-6 z-10">
                          <span className="px-4 py-1.5 rounded-full bg-slate-900/10 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-900/5">
                              Live Session
                          </span>
                      </div>
                      <div className="p-8 pt-20 flex-grow">
                          <h3 className="text-xl font-black text-slate-900 mb-6 leading-tight group-hover:text-indigo-600 transition-colors h-14 line-clamp-2">
                              {workshopName}
                          </h3>
                          <div className="space-y-4">
                              <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500">
                                      <Clock size={16} />
                                  </div>
                                  Registered: {date}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500">
                                      <Video size={16} />
                                  </div>
                                  Online Access
                              </div>
                          </div>
                      </div>
                      <div className="p-8 pt-0 mt-auto">
                          {isAdmin ? (
                            <Link 
                                href={`/workshops/${workshop.originalPost?.slug || ''}`}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-100 text-slate-900 text-sm font-black hover:bg-slate-200 active:scale-[0.98] transition-all border border-slate-200"
                            >
                                <Info size={20} />
                                Session Info
                            </Link>
                          ) : (
                              <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 group-hover:translate-y-[-4px] duration-500">
                                Join Session
                                <ExternalLink size={18} />
                            </button>
                          )}
                      </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState 
              icon={<Calendar size={48} />} 
              title="No workshops registered" 
              description="Check out our upcoming masterclasses and hands-on session calendar."
              linkHref="/workshops"
              linkText="View Calendar"
            />
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, linkHref, linkText }: any) {
  return (
    <div className="rounded-[3rem] bg-white border border-dashed border-slate-300 p-20 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
          {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium max-w-sm mb-10 text-lg">
          {description}
      </p>
      <Link 
          href={linkHref} 
          className="group flex items-center gap-3 px-10 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
      >
          {linkText}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
