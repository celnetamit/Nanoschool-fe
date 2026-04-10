'use client';

import { X, Printer, GraduationCap, CheckCircle2, FileText, Landmark, ShieldCheck, Mail, MapPin, Globe } from 'lucide-react';
import { calculateGST, getStateCode } from '@/lib/tax';

interface InvoiceModalProps {
  payment: {
    id: string;
    name: string;
    email: string;
    course: string;
    status: string;
    amount: number;
    formattedAmount?: string;
    transactionId: string;
    date: string;
    state: string;
    country: string;
  } | null;
  onClose: () => void;
}

export default function InvoiceModal({ payment, onClose }: InvoiceModalProps) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const taxBreakdown = calculateGST(payment.amount, payment.country, payment.state);
  const { baseAmount, cgst, sgst, igst, taxStatus } = taxBreakdown;
  const isIndia = payment.country.toLowerCase() === 'india';
  const stateCode = isIndia ? getStateCode(payment.state) : '';
  
  // Extract symbol from formattedAmount or default to ₹
  const currencySymbol = payment.formattedAmount?.match(/[^0-9.,\s]/)?.[0] || (isIndia ? '₹' : '$');
  
  const invoiceNumber = `${isIndia ? 'TAX' : 'EXP'}-${payment.id}-${new Date(payment.date).getTime().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/40 backdrop-blur-md animate-fade-in print:bg-white print:p-0 print:block">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200/50 print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100 bg-slate-50/50 print:hidden">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest flex items-center gap-3">
                <FileText size={18} className="text-blue-600" />
                {isIndia ? 'Tax Invoice (Domestic)' : 'Export Invoice (International)'}
            </h3>
            <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Printer size={14} /> Print Invoice
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
        <div className="p-16 print:p-10 space-y-10 bg-white relative overflow-hidden" id="printable-invoice">
            {/* Watermark Decoration */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Header Section */}
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-xl">
                            <GraduationCap size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-950 tracking-tighter">IT Break com pvt LTD.</h1>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{isIndia ? 'Tax Invoice' : 'Export Invoice'}</p>
                        </div>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs font-bold text-slate-500 max-w-[280px] leading-relaxed flex flex-col gap-1">
                            <span className="flex items-start gap-2"><MapPin size={12} className="mt-0.5 shrink-0" /> Sec-14, Huda market, Gurgaon, Haryana, 122001</span>
                            <span className="flex items-center gap-2"><Globe size={12} className="shrink-0" /> India</span>
                            <span className="flex items-center gap-2"><Mail size={12} className="shrink-0" /> support@nanoschool.in</span>
                        </p>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-100/50 mb-2 ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        <CheckCircle2 size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{payment.status === 'Paid' ? 'Payment Verified' : 'Payment Awaiting'}</span>
                    </div>
                    
                    <h2 className="text-5xl font-black text-slate-950 tracking-tighter mt-2 italic opacity-5 uppercase select-none pointer-events-none tracking-[0.5em] leading-none mb-4">
                        {isIndia ? 'DOMESTIC' : 'EXPORT'}
                    </h2>
                    
                    <div className="space-y-1.5 pt-4">
                        <div className="text-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Tax ID (GSTIN): </span>
                            <span className="text-slate-950 font-black tracking-widest uppercase">06AAHCN1234F1Z8</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Invoice No: </span>
                            <span className="text-slate-950 font-black tabular-nums">{invoiceNumber}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Date: </span>
                            <span className="text-slate-950 font-black">{new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        </div>
                        {isIndia && stateCode && (
                           <div className="text-sm">
                               <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">State Code: </span>
                               <span className="text-slate-950 font-black tabular-nums">{stateCode}</span>
                           </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-slate-100"></div>

            {/* Billing Grid */}
            <div className="grid grid-cols-2 gap-20">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bill To:</h4>
                    <div className="space-y-1">
                        <p className="text-xl font-black text-slate-950 tracking-tight">{payment.name}</p>
                        <p className="text-sm font-bold text-slate-500">{payment.email}</p>
                        <div className="pt-2 flex flex-col gap-0.5">
                            <p className="text-xs font-bold text-slate-700">{payment.state}, {payment.country}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Place of Supply: {payment.country}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 text-right flex flex-col items-end">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Trace:</h4>
                    <div className="space-y-3">
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Gateway Reference</span>
                            <span className="font-mono text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-950 font-black shadow-sm">{payment.transactionId}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                            <span className="flex items-center gap-2 text-xs font-black text-slate-950 uppercase italic tracking-tighter">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                Secured Digital Payment
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm bg-slate-50/20">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-left">
                            <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description of Service {isIndia ? '(HSN: 9992)' : '(Export HSN: 9992)'}</th>
                            <th className="px-10 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                            <th className="px-10 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Taxable Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-10 py-8">
                                <span className="text-lg font-black text-slate-950 block tracking-tight">{payment.course}</span>
                                <span className="text-[11px] font-bold text-slate-400 leading-none">Professional Technical Training & Digital Learning Resources</span>
                            </td>
                            <td className="px-10 py-8 text-center font-black text-slate-950 italic">01</td>
                            <td className="px-10 py-8 text-right font-black text-slate-950 text-xl tracking-tighter tabular-nums text-sans">
                                {currencySymbol}{baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-10">
                {/* Bank Details Block */}
                <div className="p-8 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Landmark size={14} className="text-slate-400" />
                        Beneficiary Bank Details
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</p>
                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-tighter">ICICI Bank Ltd</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Account Name</p>
                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-tighter">IT Break com pvt LTD.</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Account Number</p>
                            <p className="text-[11px] font-black text-slate-950 tracking-widest">012345678901</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">IFSC / SWIFT</p>
                            <p className="text-[11px] font-black text-slate-950 tracking-widest">ICIC0000123</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pr-4">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Net Amount:</span>
                            <span className="text-slate-950 font-black tabular-nums">{currencySymbol}{baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        
                        {taxStatus === 'Inclusive' ? (
                          <>
                            {cgst > 0 && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">CGST (9.00%):</span>
                                      <span className="text-slate-950 font-black tabular-nums">{currencySymbol}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">SGST (9.00%):</span>
                                      <span className="text-slate-950 font-black tabular-nums">{currencySymbol}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </>
                            )}
                            {igst > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">IGST (18.00%):</span>
                                  <span className="text-slate-950 font-black tabular-nums">{currencySymbol}{igst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            )}
                          </>
                        ) : (
                          <div className="flex justify-between items-center text-sm px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                             <span className="text-emerald-700 font-black uppercase tracking-widest text-[9px]">Export Zero Tax:</span>
                             <span className="text-emerald-700 font-black tabular-nums">{currencySymbol}0.00</span>
                          </div>
                        )}

                        <div className="h-px w-full bg-slate-100"></div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-slate-950 font-black uppercase tracking-[0.2em] text-[10px]">Total Receivable:</span>
                            <span className="text-4xl font-black text-blue-600 tracking-tighter tabular-nums shadow-text">
                                {payment.formattedAmount || `${currencySymbol}${payment.amount.toLocaleString()}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature & Legal */}
            <div className="pt-10 border-t border-slate-100 flex justify-between items-end italic">
                <div className="text-[9px] text-slate-400 max-w-[400px] leading-relaxed font-bold lowercase tracking-wider opacity-60">
                    This computer-generated invoice from IT Break com pvt LTD. documentation platform NS-ENG-9 is legally binding and does not require a physical signature. All fees represent investment in technical training and academic assessment.
                </div>
                <div className="text-right border-t border-slate-950 pt-2 min-w-[200px]">
                    <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest mb-1">Authorised Signatory</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">For IT Break com pvt LTD.</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
