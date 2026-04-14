'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Receipt,
  Download,
  Search,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import InvoiceModal from './InvoiceModal';
import WorkshopEnrollmentDialog from '@/components/payments/WorkshopEnrollmentDialog';

interface Payment {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'Paid' | 'Unpaid';
  amount: number;
  formattedAmount: string;
  transactionId: string;
  date: string;
  state: string;
  country: string;
  address?: string;
  contactNumber?: string;
  institution?: string;
  zipCode?: string;
  pid?: string;
  category: string;
}

export default function StudentPaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [resumePaymentModal, setResumePaymentModal] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    
    try {
      const response = await fetch('/api/user/payments');
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-slate-950/5 rounded-[2.5rem]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-950/5 rounded-[2.5rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header Section */}
      <div className="relative rounded-[3rem] bg-slate-950 p-12 overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent opacity-50"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Encrypted Transmission</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">My Payment Ledger</h1>
                <p className="text-slate-400 font-bold max-w-lg leading-relaxed">
                   Track your learning investments and access official IT Break com pvt LTD. documentation for all your enrolled workshops/programs.
                </p>
                
                <button 
                  onClick={() => fetchPayments(true)}
                  disabled={refreshing}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black text-white transition-all active:scale-95 disabled:opacity-50 mt-4"
                >
                  {refreshing ? <Loader2 size={16} className="animate-spin text-blue-400" /> : <RefreshCw size={16} className="text-blue-400" />}
                  {refreshing ? 'Synchronizing...' : 'Sync History'}
                </button>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md min-w-[180px]">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrolled</p>
                        <ArrowUpRight size={14} className="text-blue-400" />
                    </div>
                    <p className="text-3xl font-black text-white tabular-nums">{payments.length}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Total Assets</p>
                </div>
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by course or transaction ID..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all font-bold text-slate-950 placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
      </div>

      {/* Results Grid */}
      {filteredPayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            {filteredPayments.map((payment) => (
                <div 
                    key={payment.id} 
                    className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden hover:scale-[1.02] hover:shadow-2xl transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="p-10 space-y-8 relative z-10">
                        {/* Status & Date */}
                        <div className="flex items-center justify-between">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                payment.status === 'Paid' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                                {payment.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {payment.status}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                <Calendar size={12} />
                                {new Date(payment.date).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Course Name */}
                        <div className="space-y-2">
                             <h3 className="text-2xl font-black text-slate-950 leading-tight tracking-tight min-h-[3.5rem] line-clamp-2">
                                {payment.course}
                             </h3>
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                <Receipt size={12} />
                                ID: {payment.transactionId.slice(0, 15)}...
                             </p>
                        </div>

                        {/* Price Section */}
                        <div className="pt-8 border-t border-slate-50 flex items-end justify-between">
                             <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Value Asset</p>
                                 <p className="text-3xl font-black text-slate-950 tabular-nums tracking-tighter">
                                    {payment.formattedAmount || `₹${payment.amount.toLocaleString()}`}
                                 </p>
                             </div>
                             
                             {payment.status === 'Paid' ? (
                                 <button 
                                    onClick={() => setSelectedPayment(payment)}
                                    className="p-5 rounded-3xl bg-slate-950 text-white hover:bg-blue-600 transition-all shadow-xl active:scale-90 group/btn"
                                 >
                                     <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
                                 </button>
                             ) : (
                                 <button 
                                    onClick={() => setResumePaymentModal(payment)}
                                    className="px-6 py-4 rounded-2xl bg-amber-500 text-white hover:bg-amber-600 font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
                                 >
                                     <RefreshCw size={16} /> Resume Payment
                                 </button>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 border-dashed space-y-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-xl border border-slate-100">
                <CreditCard size={32} />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-950 tracking-tight">No Transactions Found</h3>
                <p className="text-sm font-bold text-slate-500 max-w-sm">
                    You haven't made any payments yet. Explore our courses to start your learning journey!
                </p>
            </div>
        </div>
      )}

      {/* Invoice Modal Integration */}
      {selectedPayment && (
        <InvoiceModal 
           payment={selectedPayment}
           onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Resume Payment Modal Integration */}
      {resumePaymentModal && (
        <WorkshopEnrollmentDialog 
          isOpen={true}
          onClose={() => setResumePaymentModal(null)}
          pid={resumePaymentModal.pid}
          entryId={resumePaymentModal.id}
          workshopTitle={resumePaymentModal.course}
          courseFee={resumePaymentModal.formattedAmount || `₹${resumePaymentModal.amount}`}
          initialData={resumePaymentModal}
          itemType={
            resumePaymentModal.category.toLowerCase() === 'workshop' ? 'workshops' : 
            resumePaymentModal.category.toLowerCase() === 'course' ? 'courses' : 
            'internships'
          }
          initialCurrency={resumePaymentModal.formattedAmount?.includes('$') || resumePaymentModal.formattedAmount?.includes('USD') ? 'USD' : 'INR'}
        />
      )}
    </div>
  );
}
