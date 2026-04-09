'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail,
  Calendar,
  Layers,
  Zap,
  BookOpen,
  GraduationCap,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building2,
  Clock,
  Globe,
  Tag,
  Monitor,
  Network
} from 'lucide-react';

interface Registration {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  level: string;
  major: string;
  mode: string;
  duration: string;
  source: string;
  product: string;
  status: string;
  amount: number;
  date: string;
  isLead: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function RegistrationsView() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    filter: 'All' as 'All' | 'Successful' | 'Leads',
    category: 'All' as 'All' | 'Course' | 'Workshop' | 'Internship',
    searchQuery: '',
    page: 1
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/registrations?page=${params.page}&limit=10&filter=${params.filter}&category=${params.category}&query=${params.searchQuery}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.page, params.filter, params.category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(prev => ({ ...prev, page: 1 }));
    fetchData();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Course': return <BookOpen size={14} />;
      case 'Workshop': return <Zap size={14} />;
      case 'Internship': return <FlaskConical size={14} />;
      default: return <GraduationCap size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('course')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (t.includes('workshop')) return 'bg-purple-50 text-purple-600 border-purple-100';
    if (t.includes('internship')) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  if (loading && registrations.length === 0) return (
    <div className="space-y-8 animate-pulse">
        <div className="h-12 w-full bg-slate-100 rounded-3xl mb-10"></div>
        {[1,2,3,4,5].map(i => (
            <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-100"></div>
        ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
        {/* Category Navigation */}
        <div className="flex items-center gap-6 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
            {(['All', 'Course', 'Workshop', 'Internship'] as const).map((cat) => (
                <button
                    key={cat}
                    onClick={() => setParams(prev => ({ ...prev, category: cat, page: 1 }))}
                    className={`pb-4 px-1 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                        params.category === cat 
                        ? 'text-blue-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    {cat === 'All' ? 'Overview' : `${cat}s`}
                    {params.category === cat && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in slide-in-from-bottom-2"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Superior Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/5">
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100 overflow-x-auto no-scrollbar">
                {(['All', 'Successful', 'Leads'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setParams(prev => ({ ...prev, filter: t, page: 1 }))}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            params.filter === t 
                            ? 'bg-white text-slate-950 shadow-md border border-slate-200' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {t === 'Successful' ? 'Enrolled' : t} 
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-3 flex-1 lg:max-w-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input 
                        type="text" 
                        placeholder="Search identities..."
                        value={params.searchQuery}
                        onChange={(e) => setParams(prev => ({ ...prev, searchQuery: e.target.value }))}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                    />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-950/20 whitespace-nowrap">
                    Apply
                </button>
            </form>
        </div>

        {/* Data Stream */}
        <div className="bg-white rounded-[2rem] border border-slate-200/50 shadow-2xl shadow-slate-200/10 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 animate-in fade-in">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <div className="w-full">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="w-[40%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                            <th className="w-[30%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                            <th className="w-[15%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="w-[15%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {registrations.length > 0 ? registrations.map((reg) => (
                            <tr key={reg.id} className="group hover:bg-blue-50/5 transition-colors duration-300">
                                <td className="px-6 py-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105 shrink-0 ${getTypeColor(reg.type)}`}>
                                            {getIcon(reg.type)}
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-slate-950 text-sm tracking-tight truncate">{reg.name}</span>
                                                {reg.level && (
                                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[8px] font-black uppercase shrink-0">{reg.level}</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Mail size={10} />
                                                    <span className="text-[10px] font-bold truncate tracking-tight">{reg.email}</span>
                                                </div>
                                                {reg.phone && (
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Phone size={10} />
                                                        <span className="text-[10px] font-bold tracking-tight">{reg.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {reg.institution && (
                                                <div className="flex items-center gap-1 text-slate-500 mt-1 max-w-full">
                                                    <Building2 size={10} className="shrink-0 text-blue-500" />
                                                    <span className="text-[9px] font-bold uppercase truncate italic">{reg.institution}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col gap-2 min-w-0">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest w-fit">
                                            {reg.type}
                                        </div>
                                        <span className="font-bold text-slate-700 text-[11px] leading-tight line-clamp-2">{reg.product}</span>
                                        
                                        {(reg.mode || reg.duration) && (
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {reg.mode && (
                                                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-tighter flex items-center gap-1">
                                                        <Globe size={8} /> {reg.mode}
                                                    </span>
                                                )}
                                                {reg.duration && (
                                                    <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[8px] font-black uppercase tracking-tighter flex items-center gap-1">
                                                        <Clock size={8} /> {reg.duration}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex justify-center">
                                        <div className={`
                                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                                            ${!reg.isLead ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}
                                        `}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${!reg.isLead ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            {!reg.isLead ? 'Success' : 'Lead'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <div className="flex flex-col items-end gap-0.5">
                                        <span className="text-lg font-black text-slate-950 tracking-tighter">
                                            {reg.amount > 0 ? `₹${reg.amount.toLocaleString()}` : <span className="text-slate-300">--</span>}
                                        </span>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Calendar size={10} />
                                            <span className="text-[9px] font-black uppercase tracking-tight">{mounted ? new Date(reg.date).toLocaleDateString() : '...'}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-32 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                                    No node matches detected in the current range
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Index {pagination.page}/{pagination.totalPages} | Load: {pagination.total}
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                             onClick={() => setParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                             disabled={params.page === 1}
                             className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-20 transition-all shadow-sm"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button 
                             onClick={() => setParams(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                             disabled={params.page === pagination.totalPages}
                             className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-20 transition-all shadow-sm"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
