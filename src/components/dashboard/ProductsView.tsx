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
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  RefreshCw,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductsSkeleton from './ProductsSkeleton';

interface ProductsViewProps {
  initialCourses?: any[];
  initialWorkshops?: any[];
  isAdmin?: boolean;
  currentPage?: number;
  totalPages?: number;
}

export default function ProductsView({ 
    initialCourses = [], 
    initialWorkshops = [], 
    isAdmin = false,
    currentPage = 1,
    totalPages = 1
}: ProductsViewProps) {
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [workshops, setWorkshops] = useState<any[]>(initialWorkshops);
  const [loading, setLoading] = useState(initialCourses.length === 0 && initialWorkshops.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    if (initialCourses.length === 0 && initialWorkshops.length === 0) {
        fetchEnrollments();
    }
  }, []);

  const fetchEnrollments = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/user/enrollments');
      const data = await response.json();
      if (data.success) {
        // Normalize as per the component's expectation if needed
        // The API returns 'enrollments' (courses) and 'workshops'
        setCourses(data.enrollments);
        setWorkshops(data.workshops);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/dashboard/products?${params.toString()}`);
  };

  if (loading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Tab Switcher & Sync */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
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
              {courses.length > 0 && activeTab === 'courses' && (
                <span className="ml-1 px-2 py-0.5 rounded-md text-[10px] bg-blue-50 text-blue-600">
                  {courses.length}
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
              {workshops.length > 0 && activeTab === 'workshops' && (
                <span className="ml-1 px-2 py-0.5 rounded-md text-[10px] bg-blue-50 text-blue-600">
                  {workshops.length}
                </span>
              )}
            </button>
          </div>

          <button 
            onClick={() => fetchEnrollments(true)}
            disabled={refreshing}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {refreshing ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <RefreshCw size={16} />}
            {refreshing ? 'Syncing...' : 'Sync Registry'}
          </button>
      </div>

      {/* Content Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {activeTab === 'courses' ? (
          courses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course: any, idx: number) => {
                const meta = course.meta || course.item_meta || {};
                const courseTitle = course.title || meta['mlsd4'] || meta['9789'] || 'Specialized Program';
                const isPaid = meta['2dnu4'] === 'payment_success' || meta['9817'] === 'payment_success' || course.isAdminView;
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
          workshops.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {workshops.map((workshop: any, idx: number) => {
                const meta = workshop.meta || workshop.item_meta || {};
                const workshopName = meta['mlsd4'] || meta['9768'] || meta['9789'] || 'Hands-on Workshop';
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

      {/* Modern Pagination System */}
      {isAdmin && totalPages > 1 && (
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-8 px-8 py-10 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20">
             <div className="text-sm font-bold text-slate-400">
                Displaying Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
             </div>
             
             <div className="flex items-center gap-4">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                >
                    <ChevronLeft size={18} className="stroke-[3]" />
                    Previous
                </button>
                
                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`
                                w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black transition-all
                                ${currentPage === i + 1 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50'}
                            `}
                        >
                            {i + 1}
                        </button>
                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                </div>

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                >
                    Next
                    <ChevronRight size={18} className="stroke-[3]" />
                </button>
             </div>
          </div>
      )}
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
