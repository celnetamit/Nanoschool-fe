'use client';

import { X, Printer, Download, GraduationCap, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  payment: {
    id: string;
    name: string;
    email: string;
    course: string;
    status: string;
    amount: number;
    transactionId: string;
    date: string;
  } | null;
  onClose: () => void;
}

export default function InvoiceModal({ payment, onClose }: InvoiceModalProps) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = payment.amount / 1.18;
  const gst = payment.amount - subtotal;
  const invoiceNumber = `NS-${payment.id}-${new Date(payment.date).getTime().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/40 backdrop-blur-md animate-fade-in print:bg-white print:p-0 print:block">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/50 print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100 bg-slate-50/50 print:hidden">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest flex items-center gap-3">
                <Printer size={18} className="text-blue-600" />
                Invoice Preview
            </h3>
            <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Printer size={14} /> Print Audit
                </button>
                <button 
                  onClick={onClose}
                  className="p-2.5 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-950"
                >
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Invoice Content */}
        <div className="p-16 print:p-10 space-y-12 bg-white relative overflow-hidden" id="printable-invoice">
            {/* Watermark Decoration */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Header Section */}
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl">
                            <GraduationCap size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-950 tracking-tighter">NanoSchool</h1>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Official Invoice</p>
                        </div>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs font-bold text-slate-500 max-w-[240px] leading-relaxed">
                            Sec-14, Huda market, Gurgaon, Haryana, 122001<br/>
                            India | support@nanoschool.in
                        </p>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50 mb-2">
                        <CheckCircle2 size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{payment.status}</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-950 tracking-tighter mt-2 italic opacity-10 uppercase select-none pointer-events-none">INVOICE</h2>
                    <div className="text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Reference: </span>
                        <span className="text-slate-950 font-black">{invoiceNumber}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Date: </span>
                        <span className="text-slate-950 font-black">{new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-slate-100"></div>

            {/* Address Grid */}
            <div className="grid grid-cols-2 gap-20">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Billed To:</h4>
                    <div className="space-y-1">
                        <p className="text-xl font-black text-slate-950">{payment.name}</p>
                        <p className="text-sm font-bold text-slate-500">{payment.email}</p>
                        <p className="text-xs text-slate-400 pt-2 italic underline underline-offset-4 decoration-slate-200">Registered Participant</p>
                    </div>
                </div>
                <div className="space-y-4 text-right">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Protocol:</h4>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-slate-950 uppercase tracking-tighter">Digital Payment Interface</p>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gateway Reference</span>
                            <span className="font-mono text-[11px] bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-slate-950 font-bold">{payment.transactionId}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description of Service</th>
                            <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        <tr>
                            <td className="px-8 py-8">
                                <span className="text-lg font-black text-slate-950 block">{payment.course}</span>
                                <span className="text-xs font-bold text-slate-400">Professional Certification & Digital Curriculum Access</span>
                            </td>
                            <td className="px-8 py-8 text-center font-black text-slate-950 italic">01</td>
                            <td className="px-8 py-8 text-right font-black text-slate-950 text-xl font-sans tracking-tighter">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Calculated Breakdown */}
            <div className="flex justify-end pt-4">
                <div className="w-80 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Net Service Value:</span>
                        <span className="text-slate-600 font-black tracking-tight">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">IGST / CGST (18%):</span>
                        <span className="text-slate-600 font-black tracking-tight">₹{gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-px w-full bg-slate-100"></div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-950 font-black uppercase tracking-[0.2em] text-xs">Total Amount:</span>
                        <span className="text-3xl font-black text-blue-600 tracking-tighter">₹{payment.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer Legal */}
            <div className="pt-10 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed font-bold italic lowercase tracking-wider opacity-60">
                This is a computer generated invoice and does not require a physical signature. All fees paid to NanoSchool are towards digital course facilitation and academic licensing. Please retain this for your records as proof of enrollment and value transfer.
            </div>

        </div>
      </div>
    </div>
  );
}
