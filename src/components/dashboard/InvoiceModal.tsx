'use client';

import { useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { calculateGST, numberToWords, getStateCode } from '@/lib/tax';
import Image from 'next/image';
import React from 'react';

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
    pid?: string;
    zipCode?: string;
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
  const { baseAmount, cgst, sgst, igst, totalTax } = taxBreakdown;
  
  const invoiceDate = new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  const invoiceNumber = `INV-${payment.id.slice(-6).toUpperCase()}`;

  const conf = sysConfig?.invoice || {
    companyName: "IT Break Com Private Limited",
    addressLine1: "A-118, Level 1B, Sector 63",
    addressLine2: "Noida, Gautambuddha Nagar",
    addressLine3: "Uttar Pradesh, 201301",
    gstin: "09AAACI8565D2ZD",
    cinNo: "U74899DL2001PTC109327",
    stateCode: "09",
    panNo: "AAACI8565D"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden print:bg-white print:p-0 print:block">
      <style jsx global>{`
        @media print {
          /* Hide all page content except the invoice */
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          
          /* Position the invoice at the very top left of the printed page */
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 1px solid black !important;
          }
          
          /* Kill any background overlays from the modal */
          .print\:hidden, [class*="backdrop-blur"], [class*="bg-slate-950/40"] {
            display: none !important;
          }
          
          /* Ensure we don't scale/shrink the invoice in the printed output */
          div[class*="relative"][class*="max-w-5xl"] {
            transform: none !important;
            max-width: none !important;
            width: 100% !important;
            box-shadow: none !important;
            position: static !important;
          }
        }
      `}</style>

      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300 print:hidden"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none animate-in zoom-in-95 duration-500 scale-[0.95] origin-center flex flex-col max-h-[98vh]">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100 bg-white sticky top-0 z-[110] print:hidden shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retail Tax Invoice Preview</span>
            <div className="flex items-center gap-3">
                <button 
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                    <Printer size={14} /> Print
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Invoice Scrollable Area */}
        <div className="overflow-y-auto flex-1 bg-slate-50 p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible">
            <div 
                className="bg-white mx-auto print:m-0 print:w-full border-[1.5px] border-black text-black font-serif text-[13px] leading-tight" 
                id="printable-invoice"
                style={{ maxWidth: '800px', width: '100%' }}
            >
                {/* 1. Logo and Company Header */}
                <div className="grid grid-cols-[220px_1fr_180px] items-center border-b-[1.5px] border-black p-4 text-center gap-4">
                    <div className="text-left">
                        <div className="relative w-52 h-14 mb-1">
                             <Image 
                                src="/images/logos/nanoschool-logo.svg" 
                                alt="NanoSchool" 
                                fill 
                                className="object-contain"
                             />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-600 pl-1">The Learning Revolution</p>
                    </div>
                    <div>
                        <h2 className="text-base font-black leading-tight uppercase tracking-tighter">{conf.companyName}</h2>
                        <div className="h-0.5 w-12 bg-black mx-auto my-0.5"></div>
                        <p className="text-[10px] font-bold">
                            {conf.addressLine1}, {conf.addressLine2},<br />
                            {conf.addressLine3}
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <div className="relative w-16 h-16 border border-black p-1 flex items-center justify-center">
                            <Image 
                                src="/images/logos/nstc-logo.svg" 
                                alt="NSTC Logo" 
                                width={60} 
                                height={60} 
                                className="object-contain"
                            />
                            <span className="absolute -bottom-2 right-0 bg-white px-1 text-[8px] font-bold">NSTC</span>
                        </div>
                    </div>
                </div>

                {/* 2. Compliance Row */}
                <div className="grid grid-cols-3 border-b-[1.5px] border-black text-[11px] font-bold bg-slate-50/50">
                    <div className="p-2 border-r border-black">GSTIN No.{conf.gstin}</div>
                    <div className="p-2 border-r border-black text-center">State Code:{conf.stateCode}</div>
                    <div className="p-2 text-right uppercase">CIN NO :{conf.cinNo}</div>
                </div>

                {/* 3. Invoice Title Row */}
                <div className="grid grid-cols-3 border-b-[1.5px] border-black text-[11px] items-center bg-slate-50/30">
                    <div className="p-2 border-r border-black">
                        <span className="text-slate-500">Invoice No:</span> <span className="font-bold ml-1">{invoiceNumber}</span>
                    </div>
                    <div className="p-2 border-r border-black text-center font-bold text-[13px] tracking-widest">RETAIL TAX INVOICE</div>
                    <div className="p-2 text-right">
                        <span className="text-slate-500">Invoice Date:</span> <span className="font-bold ml-1">{invoiceDate}</span>
                    </div>
                </div>

                {/* 4. Client Information Grid */}
                <div className="grid grid-cols-[160px_1fr] border-b-[1.5px] border-black">
                    {[
                        ['Participant ID:', payment.pid || `NSTC-${payment.id.slice(-4).toUpperCase()}`],
                        ['Name:', payment.name],
                        ['Address:', [payment.address, payment.state, payment.country, payment.zipCode].filter(v => v && v !== '').join(', ') || 'N/A'],
                        ['Contact Number:', payment.contactNumber && payment.contactNumber !== 'N/A' ? payment.contactNumber : 'N/A'],
                        ['Email:', payment.email],
                        ['State Code:', getStateCode(payment.state) || '09'],
                        ['Profession / Mode:', payment.institution || 'N/A'],
                        ['Enrollment Category:', 'Course'],
                        ['Reference No:', payment.transactionId || 'N/A']
                    ].map(([label, value], idx) => (
                        <React.Fragment key={idx}>
                            <div className={`p-2 border-r border-black font-bold flex items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>{label}</div>
                            <div className={`p-2 flex items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>{value}</div>
                            {idx < 8 && <div className="col-span-2 border-b border-black/30 w-full h-px"></div>}
                        </React.Fragment>
                    ))}
                </div>

                {/* 5. Main Items Table */}
                <div className="border-b-[1.5px] border-black">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="border-b border-black text-[11px] font-bold">
                                <th className="p-2 border-r border-black w-10">S.No.</th>
                                <th className="p-2 border-r border-black">Particular</th>
                                <th className="p-2 border-r border-black w-20">HSN Code</th>
                                <th className="p-2 border-r border-black w-24">Taxable Value</th>
                                <th className="p-2 border-r border-black w-20">GST</th>
                                <th className="p-2 w-28">Amount (in INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-black/30 align-top min-h-[60px]">
                                <td className="p-2 border-r border-black">1</td>
                                <td className="p-2 border-r border-black text-left font-bold">{payment.course}</td>
                                <td className="p-2 border-r border-black text-[11px]">998439</td>
                                <td className="p-2 border-r border-black tabular-nums font-bold">{baseAmount.toFixed(2)}</td>
                                <td className="p-2 border-r border-black tabular-nums font-bold">{totalTax.toFixed(2)}</td>
                                <td className="p-2 tabular-nums font-bold">{payment.amount}</td>
                            </tr>
                            <tr className="h-4">
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2"></td>
                            </tr>
                        </tbody>
                        <tfoot className="border-t border-black font-bold">
                            <tr>
                                <td colSpan={3} rowSpan={3} className="border-r border-black p-4 text-left align-top bg-slate-50/10">
                                    <div className="text-[10px] uppercase text-slate-500 mb-1">Amount in Words (in INR):</div>
                                    <div className="text-[12px] italic font-bold">
                                        <u>{numberToWords(payment.amount)}</u>
                                    </div>
                                </td>
                                <td className="p-2 border-r border-black text-right border-b border-black">Taxable Value</td>
                                <td colSpan={2} className="p-2 text-right border-b border-black tabular-nums">{baseAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-r border-black text-right border-b border-black">
                                    {igst > 0 ? 'Add: IGST (18%)' : (cgst > 0 ? 'Add: CGST/SGST (9%+9%)' : 'GST (18%)')}
                                </td>
                                <td colSpan={2} className="p-2 text-right border-b border-black tabular-nums">{totalTax.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-r border-black text-right bg-slate-900 text-white">Total Amount After Tax</td>
                                <td colSpan={2} className="p-2 text-right tabular-nums bg-slate-900 text-white text-lg">{payment.amount}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* 6. Legal Footer Notes */}
                <div className="p-4 border-b border-black text-[11px] font-bold">
                    GST HEAD: Other on-line Contents n.e.c
                </div>

                {/* 7. Declaration and Sign-off */}
                <div className="grid grid-cols-2">
                    <div className="p-4 border-r border-black text-[9px] leading-relaxed italic">
                        <p className="font-bold underline mb-1">Terms & Conditions:</p>
                        <ul className="list-disc pl-4">
                            <li>Subject to local jurisdiction.</li>
                            <li>Payment is strictly non-refundable once enrollment is confirmed.</li>
                            <li>Professionally generated digital document.</li>
                        </ul>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-between text-center min-h-[100px]">
                        <p className="text-[10px] font-bold uppercase tracking-tighter">For {conf.companyName}</p>
                        <div className="w-40 h-px bg-black"></div>
                        <p className="text-[9px] font-bold">Authorized Signatory</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
