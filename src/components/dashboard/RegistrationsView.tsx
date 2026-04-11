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
  Network,
  Award,
  Download,
  ShieldCheck,
  User,
  X,
  ExternalLink,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

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
  formattedAmount?: string;
  currency?: string;
  date: string;
  isLead: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Certificate {
  id: string;
  title: string;
  type: string;
  issueDate: string;
  credentialId: string;
  status: string;
  recipientName: string;
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
  
  // Certificate Preview State
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [certLoading, setCertLoading] = useState(false);

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

  const handleViewCertificate = async (entryId: string) => {
    setCertLoading(true);
    try {
      const res = await fetch(`/api/admin/certificates?entryId=${entryId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCert(data.certificate);
      } else {
        alert(data.error || 'Failed to fetch certificate details');
      }
    } catch (err) {
      alert('Network error while fetching certificate');
    } finally {
      setCertLoading(false);
    }
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
                            <th className="w-[35%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                            <th className="w-[30%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                            <th className="w-[15%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="w-[20%] px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions / Yield</th>
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
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-lg font-black text-slate-950 tracking-tighter">
                                                {reg.formattedAmount && reg.formattedAmount !== '0' ? (
                                                  reg.formattedAmount.includes('₹') || reg.formattedAmount.includes('$') || reg.formattedAmount.match(/[A-Z]{3}/) || reg.formattedAmount.match(/[^0-9.,]/)
                                                    ? reg.formattedAmount 
                                                    : `₹${reg.amount.toLocaleString()}`
                                                ) : (
                                                  reg.amount > 0 ? `₹${reg.amount.toLocaleString()}` : <span className="text-slate-300">--</span>
                                                )}
                                            </span>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Calendar size={10} />
                                                <span className="text-[9px] font-black uppercase tracking-tight">{mounted ? new Date(reg.date).toLocaleDateString() : '...'}</span>
                                            </div>
                                        </div>
                                        
                                        {!reg.isLead && (
                                          <button 
                                            onClick={() => handleViewCertificate(reg.id)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 group/btn"
                                          >
                                            <Award size={10} className="group-hover/btn:rotate-12 transition-transform" />
                                            Certificate
                                          </button>
                                        )}
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

        {/* Global Loading for Certificates */}
        {certLoading && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/20 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4">
                <Loader2 size={24} className="text-blue-600 animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-950">Generating Preview Node...</span>
             </div>
          </div>
        )}
        {/* Certificate Modal */}
        {selectedCert && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
                <div 
                    className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm animate-in fade-in duration-300" 
                    onClick={() => setSelectedCert(null)}
                ></div>
                
                <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-500 flex flex-col border border-slate-200 overflow-hidden max-h-[95vh]">
                    {/* Header Strip */}
                    <div className="h-1 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 w-full"></div>

                    {/* Certificate Content - Textured & Constrained */}
                    <div className="p-8 md:p-12 relative bg-[#fdfdfd] overflow-y-auto overflow-x-hidden">
                        {/* Rich Linen/Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/linen-paper.png')]"></div>
                        
                        {/* Sophisticated Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
                            <Image 
                                src="/home/itb01/.gemini/antigravity/brain/04ed8273-edae-4ccf-8ccc-d5033e0dd672/nanoschool_modern_certificate_bg_1775894502049.png"
                                alt="bg"
                                fill
                                className="object-cover scale-90"
                            />
                        </div>

                        <div className="relative z-10 text-center space-y-6 md:space-y-8">
                            {/* Academic Identity */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-32 h-12">
                                    <Image 
                                        src="https://nanoschool.in/wp-content/uploads/2025/05/NSTC-Logo-2-removebg-preview.png"
                                        alt="NanoSchool Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-[0.2em] uppercase">NanoSchool</h3>
                                <div className="h-[1px] w-12 bg-slate-200"></div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-tight italic">
                                    Certificate of Achievement
                                </h1>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Global Deep-Tech Standards</p>
                            </div>

                            <div className="py-1 space-y-4">
                                <p className="text-[11px] font-medium text-slate-500 italic">This credential recognizes that</p>
                                <h2 className="text-3xl font-serif text-slate-950 capitalize border-b border-slate-100 pb-3 max-w-sm mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
                                    {selectedCert.recipientName}
                                </h2>
                                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                                    Successfully finalized the evaluation phase for
                                    <span className="block mt-1 font-black text-slate-900 text-base uppercase tracking-tight line-clamp-2">{selectedCert.title}</span>
                                </p>
                            </div>

                            {/* Signatures & Seal - Compacted */}
                            <div className="pt-4 flex items-center justify-between px-2 gap-4">
                                <div className="flex-1 text-left space-y-1">
                                    <p className="text-[10px] font-serif italic text-slate-900 border-b border-slate-200 pb-0.5 px-1 truncate">Director</p>
                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">NanoSchool Academy</p>
                                </div>

                                <div className="shrink-0 w-12 h-12 relative">
                                    <Image 
                                        src="/home/itb01/.gemini/antigravity/brain/04ed8273-edae-4ccf-8ccc-d5033e0dd672/nanoschool_luxury_certificate_gold_seal_1775894222515.png"
                                        alt="Seal"
                                        width={48}
                                        height={48}
                                        className="grayscale opacity-70"
                                    />
                                </div>

                                <div className="flex-1 text-right space-y-1">
                                    <p className="text-[10px] font-serif italic text-slate-900 border-b border-slate-200 pb-0.5 px-1 truncate">Controller</p>
                                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Verification Node</p>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-4 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest px-4 border-t border-slate-50">
                                <span>DATE: {mounted ? new Date(selectedCert.issueDate).toLocaleDateString('en-GB') : '...'}</span>
                                <span className="opacity-30">|</span>
                                <span>ID: {selectedCert.credentialId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center">
                        <button 
                            onClick={() => setSelectedCert(null)}
                            className="text-slate-400 hover:text-slate-950 font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <X size={12} /> Close
                        </button>
                        <button className="bg-slate-950 text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-black/5">
                            <Download size={12} /> Export Node
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

