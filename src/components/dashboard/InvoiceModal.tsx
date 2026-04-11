'use client';

import { useState, useEffect } from 'react';
import { X, Printer, GraduationCap, CheckCircle2, FileText, Landmark, ShieldCheck, Mail, MapPin, Globe, Phone, Building2 } from 'lucide-react';
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
    address?: string;
    contactNumber?: string;
    institution?: string;
  } | null;
  onClose: () => void;
}

export default function InvoiceModal({ payment, onClose }: InvoiceModalProps) {
  const [sysConfig, setSysConfig] = useState<any>(null);

  useEffect(() => {
    async function fetchPublicConfig() {
      try {
        const res = await fetch('/api/public/config');
        const data = await res.json();
        if (data.success) {
          setSysConfig(data.config);
        }
      } catch (e) {
        console.error('Failed to load public config');
      }
    }
    fetchPublicConfig();
  }, []);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const taxBreakdown = calculateGST(payment.amount, payment.country, payment.state);
  const { baseAmount, cgst, sgst, igst, taxStatus, totalTax } = taxBreakdown;
  const isIndia = payment.country.toLowerCase() === 'india';
  const stateCode = isIndia ? getStateCode(payment.state) : '';
  
  // Extract symbol from formattedAmount or default to ₹
  const currencySymbol = payment.formattedAmount?.match(/[^0-9.,\s]/)?.[0] || (isIndia ? '₹' : '$');
  
  const invoiceNumber = `${isIndia ? 'TAX' : 'EXP'}-${payment.id.slice(-4)}-${new Date(payment.date).getTime().toString().slice(-6)}`;

  // Dynamic config with safe fallbacks
  const conf = sysConfig?.invoice || {
    companyName: "IT Break Com Private Limited",
    addressLine1: "A-118, Level 1B, Sector 63",
    addressLine2: "Noida, Gautambuddha Nagar",
    addressLine3: "Uttar Pradesh, 201301",
    gstin: "06AAHCN1234F1Z8",
    supportEmail: "support@nanoschool.in",
    website: "nanoschool.in",
    bankName: "ICICI Bank Ltd",
    accountName: "IT Break com pvt LTD.",
    accountNumber: "012345678901",
    ifscCode: "ICIC0000123",
    signatureUrl: "/images/signatures/director.png"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xl animate-fade-in print:bg-white print:p-0 print:block">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 print:shadow-none print:border-none print:rounded-none animate-in zoom-in-95 duration-500">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[110] print:hidden">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={20} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">{isIndia ? 'Official Tax Invoice' : 'Commercial Export Invoice'}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Managed by {conf.companyName}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrint}
                  className="px-6 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-slate-950/10"
                >
                    <Printer size={16} /> Generate Hard Copy
                </button>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-950 border border-transparent hover:border-slate-200"
                >
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Invoice Body */}
        <div className="p-12 sm:p-20 print:p-10 space-y-12 bg-white relative overflow-hidden" id="printable-invoice">
            {/* Background Decoration elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-50/20 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl bg-slate-950 flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transform -rotate-3 group-hover:rotate-0 transition-transform">
                            <GraduationCap size={40} className="stroke-[1.5]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-950 tracking-tighter leading-none mb-2">{conf.companyName}</h1>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.35em] leading-none">Registered Technical Entity</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-2 space-y-1">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                             <MapPin size={12} className="text-blue-500" /> Corporate Headquarters
                        </p>
                        <div className="text-xs font-bold text-slate-600 leading-relaxed max-w-[320px]">
                            <p>{conf.addressLine1}</p>
                            <p>{conf.addressLine2}</p>
                            <p>{conf.addressLine3}</p>
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                                <span className="flex items-center gap-2 italic"><Mail size={12} className="text-slate-400" /> {conf.supportEmail}</span>
                                <span className="flex items-center gap-2 italic"><Globe size={12} className="text-slate-400" /> {conf.website}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right space-y-4">
                    <div className="flex flex-col items-end gap-2">
                         <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-2xl border ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{payment.status === 'Paid' ? 'Transaction Authenticated' : 'Awaiting Confirmation'}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax ID (GSTIN)</span>
                            <span className="text-lg font-black text-slate-950 tracking-widest uppercase">{conf.gstin}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-right">
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Invoice Code</p>
                                <p className="text-sm font-black text-slate-950 tabular-nums">{invoiceNumber}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Generation Date</p>
                                <p className="text-sm font-black text-slate-950">{new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            {isIndia && stateCode && (
                               <div className="col-span-2">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Place of Supply (State Code)</p>
                                   <p className="text-sm font-black text-slate-950 tracking-widest">{payment.state} ({stateCode})</p>
                               </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Separator Line with Micro-details */}
            <div className="relative py-4">
                <div className="h-px w-full bg-slate-100"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white text-[8px] font-black text-slate-300 uppercase tracking-[1em]">Financial Document</div>
            </div>

            {/* Billing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Client Info */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Billing Recipient</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-3xl font-black text-slate-950 tracking-tight leading-none mb-1">{payment.name}</p>
                            <p className="text-sm font-bold text-blue-600">{payment.email}</p>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                            {payment.institution && (
                                <div className="flex items-start gap-3">
                                    <Building2 size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Institution / Org</p>
                                        <p className="text-xs font-bold text-slate-700">{payment.institution}</p>
                                    </div>
                                </div>
                            )}
                            {payment.contactNumber && (
                                <div className="flex items-start gap-3">
                                    <Phone size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact Vector</p>
                                        <p className="text-xs font-bold text-slate-700">{payment.contactNumber}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Registered Address</p>
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed max-w-[280px]">
                                        {payment.address || `${payment.state}, ${payment.country}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit & Audit Trace */}
                <div className="space-y-6 flex flex-col md:items-end">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Traceability</span>
                    </div>
                    <div className="space-y-5 w-full md:max-w-[280px]">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Merchant ID</span>
                                <span className="font-mono text-xs font-black text-slate-950 bg-white border border-slate-200 rounded-lg px-2 py-1 leading-none">RAZORPAY_001</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Trace ID (TXID)</span>
                                <span className="font-mono text-[10px] text-slate-600 break-all">{payment.transactionId}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-right md:justify-end">
                             <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                                 <span className="text-xs font-black text-slate-950 uppercase tracking-tighter">Verified Stream</span>
                             </div>
                             <ShieldCheck size={28} className="text-blue-500 stroke-[1.5]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl bg-white relative">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 text-white">
                            <th className="pl-10 pr-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] w-16">S.No</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Particular / Service Description</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">HSN Code</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Taxable Value</th>
                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">GST</th>
                            <th className="pl-6 pr-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="pl-10 pr-4 py-10 font-black text-slate-300 text-lg italic">01</td>
                            <td className="px-6 py-10">
                                <span className="text-xl font-black text-slate-950 block tracking-tight mb-1">{payment.course}</span>
                                <span className="text-[11px] font-bold text-slate-400 leading-tight block max-w-xs">Professional Certification & Learning Assets Deployment</span>
                            </td>
                            <td className="px-6 py-10 text-center">
                                <span className="px-3 py-1.5 bg-slate-100 rounded-lg font-black text-[11px] text-slate-500 tracking-widest">{isIndia ? '9992' : 'EXPORT'}</span>
                            </td>
                            <td className="px-6 py-10 text-right font-black text-slate-600 tabular-nums">
                                {currencySymbol}{baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-10 text-right font-black text-blue-600/80 tabular-nums">
                                {currencySymbol}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="pl-6 pr-10 py-10 text-right font-black text-slate-950 text-2xl tracking-tighter tabular-nums">
                                {payment.formattedAmount || `${currencySymbol}${payment.amount.toLocaleString()}`}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Bank Details Block */}
                <div className="lg:col-span-7 p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200/60 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <Landmark size={16} className="text-indigo-500" />
                        Remittance Target (Beneficiary Details)
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-10 relative z-10">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Legal Entity</p>
                            <p className="text-xs font-black text-slate-950 uppercase tracking-tight">{conf.accountName}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Banking Partner</p>
                            <p className="text-xs font-black text-slate-950 uppercase tracking-tight">{conf.bankName}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Account Asset ID</p>
                            <p className="text-sm font-bold text-slate-900 tracking-[0.2em]">{conf.accountNumber}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Protocol (IFSC / SWIFT)</p>
                            <p className="text-sm font-bold text-slate-900 tracking-widest">{conf.ifscCode}</p>
                        </div>
                    </div>
                </div>

                {/* Totals Block */}
                <div className="lg:col-span-5 space-y-5 px-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Value (ExTax)</span>
                            <span className="text-sm font-black text-slate-700 tabular-nums">{currencySymbol}{baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        
                        {taxStatus === 'Inclusive' ? (
                          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-3">
                                {cgst > 0 && (
                                    <>
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="text-blue-600/60 font-black uppercase tracking-widest">CGST (9.00%)</span>
                                          <span className="text-blue-900 font-black tabular-nums">{currencySymbol}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="text-blue-600/60 font-black uppercase tracking-widest">SGST (9.00%)</span>
                                          <span className="text-blue-900 font-black tabular-nums">{currencySymbol}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </>
                                )}
                                {igst > 0 && (
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="text-blue-600/60 font-black uppercase tracking-widest">IGST (18.00%)</span>
                                      <span className="text-blue-900 font-black tabular-nums">{currencySymbol}{igst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="h-px w-full bg-blue-200/30 my-2"></div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-blue-600 font-black uppercase tracking-widest">Consolidated GST</span>
                                    <span className="text-blue-900 font-black tabular-nums">{currencySymbol}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex justify-between items-center">
                             <span className="text-emerald-700 font-black uppercase tracking-widest text-[10px]">International Export Tax</span>
                             <span className="text-emerald-700 font-black tabular-nums">0.00%</span>
                          </div>
                        )}

                        <div className="h-0.5 w-full bg-slate-900 rounded-full my-4"></div>
                        <div className="flex justify-between items-center px-2">
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] leading-none mb-1">Final Settlement</span>
                                <span className="text-[9px] font-bold text-blue-600 italic">Total Inclusive of Taxes</span>
                            </div>
                            <span className="text-5xl font-black text-slate-950 tracking-tighter tabular-nums drop-shadow-sm">
                                {payment.formattedAmount || `${currencySymbol}${payment.amount.toLocaleString()}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature & Legal Footer */}
            <div className="pt-16 mt-8 flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="max-w-[480px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full border border-slate-200 p-2 flex items-center justify-center grayscale opacity-50">
                            <GraduationCap size={24} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Compliance Protocol</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Document Ref: NS-SYS-GEN-2024</p>
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-bold tracking-tight lowercase text-justify">
                        This digital document is generated by the {conf.companyName} documentation engine. 
                        it is encrypted and digitally authenticated upon issuance. 
                        all professional training fees are non-refundable and constitute an investment in academic assessment and certification resources. 
                        this invoice remains perfectly valid without a physical signature.
                    </p>
                </div>
                
                <div className="text-right flex flex-col items-end min-w-[240px]">
                    <div className="w-48 h-px bg-slate-950 mb-3 invisible md:visible"></div>
                    <p className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-1">Authorised Controller</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">For {conf.companyName}</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
