'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { calculateFinalPricing, parseLocalizedNumber } from '@/lib/pricing';

interface Stats {
  total: number;
  paid: number;
  unpaid: number;
  revenue: number;
  revenueTarget: number;
  recent: any[];
}

export default function AdminView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDownloadAudit = () => {
    if (!stats || stats.recent.length === 0) return;

    // Define CSV Headers
    const headers = ['Entity Identity', 'Email', 'Module Core', 'Yield (Amount)', 'Registration Date'];
    
    // Convert recent registrations to CSV rows
    const csvRows = stats.recent.map(entry => [
      `"${entry.name}"`,
      `"${entry.email}"`,
      `"${entry.course}"`,
      `"${entry.formattedAmount || entry.amount}"`,
      `"${new Date(entry.date || Date.now()).toLocaleString()}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `nanoschool-throughput-audit-${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="space-y-12">
        <div className="h-24 bg-white/50 backdrop-blur-md rounded-[2rem] border border-slate-200/40 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1,2,3,4].map(i => <div key={i} className="h-44 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 h-[500px] bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>
            <div className="space-y-12">
                <div className="h-[240px] bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>
                <div className="h-[240px] bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>
            </div>
        </div>
    </div>
  );

  if (!stats) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-white/80 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 shadow-2xl p-16 text-center max-w-2xl mx-auto mt-10">
        <div className="relative mb-8">
            <div className="absolute -inset-4 bg-rose-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 shadow-inner">
                <XCircle size={48} className="stroke-[1.5]" />
            </div>
        </div>
        <h3 className="text-3xl font-black text-slate-950 mb-3 tracking-tighter">System Desync Detected</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-base font-medium leading-relaxed">The connection to the WordPress Data Engine was interrupted. Critical metrics are currently unavailable.</p>
        <button onClick={() => window.location.reload()} className="mt-10 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">Reconnect Engine</button>
    </div>
  );

  return (
    <div className="space-y-14 animate-fade-in pb-20">
      {/* Page Title - Ultra-Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
          <div className="space-y-1">
              <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                      <LayoutDashboard size={22} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Operational Metrics</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-[ -0.05em] leading-tight">
                 Intelligence <span className="text-slate-400">Node</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm tracking-tight flex items-center gap-2">
                 Analyzing real-time throughput from 12 edge providers
                 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px]">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    Syncing
                 </span>
              </p>
          </div>
          <div className="flex items-center gap-4">
              <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 flex items-center gap-4 group hover:border-blue-200 transition-all cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                      <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Observation Period</p>
                      <span className="text-xs font-black text-slate-700 tracking-tight">OCT 2026 - PRESENT</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Stats Grid - High-Fidelity Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard 
          icon={<Users size={24} />} 
          label="Total Enrollments" 
          value={stats.total} 
          trend="+14.2%" 
          positive={true}
          color="blue"
        />
        <Link href="/dashboard/payments" className="contents">
          <StatCard 
            icon={<CheckCircle2 size={24} />} 
            label="Verified Payments" 
            value={stats.paid} 
            subValue={`${stats.total > 0 ? Math.round((stats.paid/stats.total)*100) : 0}% Yield Success`}
            color="emerald"
          />
        </Link>
        <StatCard 
          icon={<CreditCard size={24} />} 
          label="Gross Revenue" 
          value={mounted ? `₹${stats.revenue.toLocaleString()}` : '₹...'} 
          trend="+9.5%" 
          positive={true}
          color="indigo"
          subValue={stats.recent.some(r => r.formattedAmount?.includes('$')) ? 'Includes Intl Revenue' : undefined}
        />
        <StatCard 
          icon={<ArrowUpRight size={24} />} 
          label="Average Ticket" 
          value={mounted ? `₹${stats.paid > 0 ? Math.round(stats.revenue/stats.paid).toLocaleString() : 0}` : '₹...'} 
          subValue="Per successful conversion"
          color="amber"
          indicator={stats.recent.some(r => r.formattedAmount?.includes('$')) ? 'Mixed Currencies' : undefined}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Recent Registrations Table - Elite Data View */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-200/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group/table transition-all hover:shadow-2xl hover:shadow-slate-200/30">
          <div className="p-10 border-b border-slate-100/60 flex items-center justify-between bg-slate-50/[0.3] backdrop-blur-sm">
            <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-950 tracking-tighter">Throughput Stream</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Real-time Enrollment Logic</p>
            </div>
            <button 
                onClick={handleDownloadAudit}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 uppercase tracking-widest flex items-center gap-2"
            >
                Download Audit <ArrowUpRight size={14} className="stroke-[3]" />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto text-[13px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/10">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-50/50">Entity Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-50/50 text-center">Module Core</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-50/50 text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/60">
                {stats.recent.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/[0.15] transition-all duration-300 group cursor-default">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-slate-950/5 rounded-2xl blur-sm group-hover:bg-blue-500/10 transition-colors"></div>
                            <div className="relative w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 text-sm shadow-inner group-hover:scale-110 transition-transform duration-500">
                                {entry.name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-950 text-base group-hover:text-blue-700 transition-colors tracking-tight">{entry.name}</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-tight lowercase">{entry.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex justify-center">
                          <div className="bg-slate-50/80 px-5 py-2.5 rounded-xl border border-slate-100 inline-flex items-center gap-2 group-hover:bg-white group-hover:border-blue-100 transition-all duration-300 shadow-sm max-w-[400px]">
                          <span className="text-[11px] font-black text-slate-600 line-clamp-1 block uppercase tracking-tight">{entry.course}</span>
                          </div>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-slate-950 text-sm tracking-tight leading-tight">
                          {entry.formattedAmount && entry.formattedAmount !== '0' ? (
                            entry.formattedAmount.includes('₹') || entry.formattedAmount.includes('$') || entry.formattedAmount.match(/[A-Z]{3}/) || entry.formattedAmount.match(/[^0-9., ]/)
                              ? entry.formattedAmount 
                              : `₹${entry.amount.toLocaleString()}`
                          ) : (
                            entry.amount > 0 ? `₹${entry.amount.toLocaleString()}` : '--'
                          )}
                        </span>
                        {entry.amount > 0 && (
                          <div className="flex flex-col items-end text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-[0.1em] leading-[1.2]">
                             {(() => {
                               // Prioritize stored breakdown, fallback to new deterministic engine
                               const pb = entry.pricingBreakdown || calculateFinalPricing({
                                 basePrice: entry.rawAmount || entry.amount,
                                 country: entry.country || 'India', 
                                 state: entry.state || '',
                                 currency: entry.formattedAmount?.includes('$') ? 'USD' : 'INR',
                                 isInclusive: true
                               });
                               return (
                                 <>
                                   <span className="opacity-70">Base: {pb.currencySymbol}{pb.basePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                   {pb.surchargeAmount > 0 && <span className="text-amber-600/80">Surcharge (3%): {pb.currencySymbol}{pb.surchargeAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>}
                                   <span className="text-emerald-500/80">Tax (18%): {pb.currencySymbol}{pb.taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                   <div className="h-[1px] w-full bg-slate-100 my-0.5 opacity-50"></div>
                                   <span className="text-slate-900 font-black">Total: {pb.currencySymbol}{pb.finalTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                 </>
                               );
                             })()}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-slate-50/[0.2] border-t border-slate-100 flex justify-center">
             <Link href="/dashboard/registrations" className="text-[11px] font-black text-blue-600 hover:text-blue-800 transition-all uppercase tracking-[0.3em] flex items-center gap-3 group/btn">
                Access Audit Engine <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
             </Link>
          </div>
        </div>

        {/* Widgets Column - Professional Depth */}
        <div className="space-y-12">
           {/* Achievement Widget - Immersive Glass */}
           <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/2 opacity-50"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-400 border border-white/10 group-hover:rotate-6 transition-transform duration-500">
                        <TrendingUp size={28} className="stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Node Yield</span>
                </div>
                <h3 className="font-black text-2xl mb-3 tracking-tight">Rev Target Index</h3>
                <p className="text-slate-400 text-[13px] mb-10 font-bold leading-relaxed opacity-80">
                   Operational performance is trending at <span className="text-white underline decoration-blue-500 underline-offset-4">{stats.revenueTarget > 0 ? Math.round((stats.revenue/stats.revenueTarget)*100) : 0}% efficiency</span> relative to fiscal targets.
                </p>
                <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-4xl font-black tracking-tighter">
                            {mounted ? (
                                stats.revenue >= 1000000 
                                    ? `₹${(stats.revenue/1000000).toFixed(1)}M` 
                                    : stats.revenue >= 1000 
                                        ? `₹${(stats.revenue/1000).toFixed(0)}K` 
                                        : `₹${stats.revenue}`
                            ) : '₹...'}
                        </span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">
                            Idx Opt {stats.total > 0 ? ((stats.paid/stats.total)*100).toFixed(1) : 0}%
                        </span>
                    </div>
                    <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] relative transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, Math.round((stats.revenue/stats.revenueTarget)*100))}%` }}
                        >
                             <div className="absolute top-0 right-0 h-full w-4 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
              </div>
           </div>


        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, positive, subValue, indicator, color }: any) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/20',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/20',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/20',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/20'
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 group relative flex flex-col justify-between min-h-[260px] overflow-hidden hover:-translate-y-2">
      {/* Gloss Effect Overlay */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border shadow-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end gap-2">
          {trend && (
            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 border ${positive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
              {trend} <ArrowUpRight size={14} className="stroke-[3]" />
            </div>
          )}
          {indicator && (
            <div className="px-2 py-0.5 rounded-md bg-slate-900/5 text-slate-500 text-[8px] font-black uppercase tracking-tighter border border-slate-200">
               {indicator}
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 transition-all duration-700 group-hover:translate-x-1">
        <h4 className="text-4xl font-black text-slate-950 mb-1.5 tracking-[ -0.06em] tabular-nums leading-none">{value}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</p>
        {subValue && (
            <div className="mt-6 pt-6 border-t border-slate-50/80">
                <div className="text-[11px] font-black text-slate-500 tracking-tight flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                   {subValue}
                </div>
            </div>
        )}
      </div>
      
      {/* Decorative Gradient Background (Hover Only) */}
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : color === 'indigo' ? 'bg-indigo-600' : 'bg-amber-600'}`}></div>
    </div>
  );
}


