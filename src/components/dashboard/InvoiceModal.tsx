'use client';

import { useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { calculateGST, numberToWords, getStateCode } from '@/lib/tax';
import { generateInvoiceHTML } from '@/lib/invoice-generator';
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
    category?: string;
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
    // 1. Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // 2. Extract HTML content
    const printableContent = document.getElementById('printable-invoice');
    if (!printableContent || !iframe.contentWindow) return;

    // 3. Construct the print document
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Retail Tax Invoice - ${invoiceNumber}</title>
          <style>
            @page { margin: 0; size: portrait; }
            body { 
              margin: 0; 
              padding: 20px; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              display: flex;
              justify-content: center;
              background: white;
            }
          </style>
        </head>
        <body onload="window.print();">
          ${generateInvoiceHTML(payment, sysConfig)}
        </body>
      </html>
    `);
    doc.close();

    // 4. Trigger print and cleanup
    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 100);
    }, 500);
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
  };

  return (
    <div id="invoice-modal-portal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 scale-[0.95] origin-center flex flex-col max-h-[98vh]">
        
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
        <div className="overflow-y-auto flex-1 bg-slate-50 p-4 md:p-8 print:hidden">
            <div 
                className="mx-auto" 
                id="printable-invoice"
                style={{ maxWidth: '800px', width: '100%' }}
                dangerouslySetInnerHTML={{ __html: generateInvoiceHTML(payment, sysConfig) }}
            />
        </div>
      </div>
    </div>
  );
}
