'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import InvoiceModal from './InvoiceModal';

interface Payment {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'Paid' | 'Unpaid';
  amount: number;
  formattedAmount?: string;
  transactionId: string;
  date: string;
  state: string;
  country: string;
  address?: string;
  contactNumber?: string;
  institution?: string;
}

export default function AdminPaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/admin/payments')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPayments(data.payments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalRevenue = payments.reduce((acc, p) => p.status === 'Paid' ? acc + p.amount : acc, 0);
  const successRate = payments.length > 0 ? (payments.filter(p => p.status === 'Paid').length / payments.length) * 100 : 0;

  if (loading) return (
    <div className="space-y-12">
        <div className="h-24 bg-white/50 backdrop-blur-md rounded-[2rem] border border-slate-200/40 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-44 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>)}
        </div>
        <div className="h-[600px] bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200/40 animate-pulse"></div>
    </div>
  );

  return (
    <div className="space-y-14 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
          <div className="space-y-1">
              <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                      <CreditCard size={22} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Financial Operations</span>
              </div>
              <h1 className="text-5xl font-black text-slate-950 tracking-[-0.05em] leading-tight">
                 Payment <span className="text-slate-400">Ledger</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm tracking-tight flex items-center gap-2">
                 Monitoring transactional integrity across all learning modules
                 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px]">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sync
                 </span>
              </p>
          </div>
          <div className="flex items-center gap-4">
              <button className="px-6 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl flex items-center gap-3">
                 <Download size={16} /> Export Audit
              </button>
          </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Cumulative Revenue (INR Base)</p>
                <h4 className="text-4xl font-black text-slate-950 mb-1.5 tracking-[-0.06em]">₹{mounted ? totalRevenue.toLocaleString() : '...'}</h4>
                <div className="flex items-center gap-2 text-emerald-600">
                    <TrendingUp size={14} />
                    <span className="text-[11px] font-black uppercase tracking-wider">+12.4% vs last period</span>
                </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Success Velocity</p>
                <h4 className="text-4xl font-black text-slate-950 mb-1.5 tracking-[-0.06em]">{successRate.toFixed(1)}%</h4>
                <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 size={14} />
                    <span className="text-[11px] font-black uppercase tracking-wider">Payments Verified</span>
                </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Pending Nodes</p>
                <h4 className="text-4xl font-black text-slate-950 mb-1.5 tracking-[-0.06em]">{payments.filter(p => p.status === 'Unpaid').length}</h4>
                <div className="flex items-center gap-2 text-amber-600">
                    <Clock size={14} />
                    <span className="text-[11px] font-black uppercase tracking-wider">Awaiting Confirmation</span>
                </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[3rem] border border-slate-200/50 shadow-2xl overflow-hidden flex flex-col">
          {/* Controls Bar */}
          <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-50/30">
              <div className="relative w-full lg:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or TXID..."
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="flex bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm">
                      {(['All', 'Paid', 'Unpaid'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-950'}`}
                          >
                            {status}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/20">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">Participant Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">Learning Path</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">Protocol Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">Reference TXID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100 text-right">Value Asset</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-blue-50/[0.15] transition-all group cursor-default">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-blue-500 text-sm shadow-inner group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                            {payment.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-950 text-base tracking-tight">{payment.name}</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-tight">{payment.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                        <span className="inline-block px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-tight group-hover:border-blue-100 transition-colors">
                            {payment.course}
                        </span>
                    </td>
                    <td className="px-10 py-7">
                      <div className={`
                        inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border
                        ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}
                      `}>
                        <div className={`w-2 h-2 rounded-full ${payment.status === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'} relative`}>
                            <div className={`absolute inset-0 rounded-full ${payment.status === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'} animate-ping opacity-60`}></div>
                        </div>
                        {payment.status}
                      </div>
                    </td>
                    <td className="px-10 py-7">
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:text-slate-950 transition-colors">
                            {payment.transactionId}
                        </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <span className="font-black text-slate-950 text-xl tracking-tighter">
                        {payment.formattedAmount && payment.formattedAmount !== '0' ? (
                          payment.formattedAmount.includes('₹') || payment.formattedAmount.includes('$') || payment.formattedAmount.match(/[A-Z]{3}/) || payment.formattedAmount.match(/[^0-9., ]/)
                            ? payment.formattedAmount 
                            : `₹${payment.amount.toLocaleString()}`
                        ) : (
                          payment.amount > 0 ? `₹${payment.amount.toLocaleString()}` : '--'
                        )}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                        <div className="flex justify-center">
                            <button 
                              onClick={() => setSelectedPayment(payment)}
                              className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white rounded-xl border border-slate-100 hover:border-slate-950 transition-all active:scale-95 shadow-sm group/btn"
                              title="Generate Invoice"
                            >
                                <FileText size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing <span className="text-slate-950">{Math.min(paginatedPayments.length, itemsPerPage)}</span> of <span className="text-slate-950">{filteredPayments.length}</span> records
              </p>
              <div className="flex items-center gap-3">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                  >
                      <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-950'}`}
                          >
                            {i + 1}
                          </button>
                      ))}
                  </div>
                  <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                  >
                      <ChevronRight size={18} />
                  </button>
              </div>
          </div>
      </div>

      {/* Invoice Modal Integration */}
      {selectedPayment && (
        <InvoiceModal 
           payment={selectedPayment}
           onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
