'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, Award, Loader2, Download, Printer } from 'lucide-react';
import { isProductMatched } from '@/lib/matchers';
import { generateInvoiceHTML } from '@/lib/invoice-generator';

interface EnrollmentActionsProps {
    workshopTitle: string;
    itemType?: string;
    endDate?: string;
    slug?: string;
}

export default function EnrollmentActions({ 
    workshopTitle, 
    itemType = 'workshops',
    endDate,
    slug 
}: EnrollmentActionsProps) {
    const { data: session } = useSession();
    const [isChecking, setIsChecking] = useState(false);
    const [enrollment, setEnrollment] = useState<any>(null);
    const [certificate, setCertificate] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [sysConfig, setSysConfig] = useState<any>(null);

    useEffect(() => {
        if (session?.user && workshopTitle) {
            setIsChecking(true);
            
            // 1. Fetch payments for invoices
            const p1 = fetch('/api/user/payments')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.payments) {
                        const found = data.payments.find((p: any) => p.status === 'Paid' && isProductMatched(p.course, workshopTitle));
                        setEnrollment(found);
                    }
                });

            // 2. Fetch certificates
            const p2 = fetch('/api/user/certificates')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.certificates) {
                        const found = data.certificates.find((c: any) => isProductMatched(c.title, workshopTitle));
                        setCertificate(found);
                    }
                });

            // 3. Fetch company config for invoice
            const p3 = fetch('/api/public/config')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSysConfig(data.config);
                });

            Promise.all([p1, p2, p3]).finally(() => setIsChecking(false));
        }
    }, [session, workshopTitle]);

    if (!session?.user || !enrollment) {
        return null;
    }

    const now = new Date();
    // Certificate shown ON or AFTER end data
    const canClaimCertificate = endDate ? now >= new Date(endDate) : false;

    // Direct Download Logic (Iframe trick)
    const triggerDirectDownload = (type: 'invoice' | 'certificate') => {
        setIsGenerating(type);
        
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        let content = '';
        if (type === 'invoice') {
            content = generateInvoiceHTML(enrollment, sysConfig);
        } else if (type === 'certificate' && certificate) {
            content = `
                <div style="width: 297mm; height: 210mm; padding: 20mm; background: #fafafa; border: 15px double #2563eb; box-sizing: border-box; font-family: sans-serif; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                    <div style="margin-bottom: 30px;">
                        <h1 style="color: #2563eb; font-size: 36px; margin: 0; text-transform: uppercase; letter-spacing: 5px;">NanoSchool</h1>
                    </div>
                    <h2 style="font-size: 48px; margin: 20px 0; color: #0f172a;">Certificate of Completion</h2>
                    <p style="font-size: 18px; color: #64748b; margin-bottom: 10px;">This credential is presented to</p>
                    <h3 style="font-size: 60px; margin: 20px 0; color: #0f172a;">${certificate.recipientName}</h3>
                    <p style="font-size: 20px; color: #64748b; max-width: 800px; margin: 0 auto;">
                        for the successful completion of the <b>${certificate.title}</b> program.
                    </p>
                    <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px;">
                        <div style="text-align: left;">
                             <p><b>Date:</b> ${new Date(certificate.issueDate).toLocaleDateString()}</p>
                             <p><b>ID:</b> ${certificate.credentialId}</p>
                        </div>
                        <div style="width: 200px; border-top: 2px solid black; padding-top: 10px;">
                            <b>Authorized Signatory</b>
                        </div>
                    </div>
                </div>
            `;
        }

        doc.open();
        doc.write(`
            <html>
                <head>
                    <style>
                        @page { size: ${type === 'invoice' ? 'portrait' : 'landscape'}; margin: 0; }
                        body { margin: 0; padding: 0; }
                    </style>
                </head>
                <body onload="window.print();">
                    ${content}
                </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            document.body.removeChild(iframe);
            setIsGenerating(null);
        }, 1000);
    };

    return (
        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col gap-3 p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Member Protocols</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Invoice Button */}
                    <button
                        onClick={() => triggerDirectDownload('invoice')}
                        disabled={isGenerating === 'invoice'}
                        className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] disabled:opacity-70 group shadow-lg shadow-slate-900/10"
                    >
                        {isGenerating === 'invoice' ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Printer size={16} className="text-blue-400" />
                        )}
                        <span>{isGenerating === 'invoice' ? 'Generating...' : 'Download Invoice'}</span>
                    </button>

                    {/* Certificate Button */}
                    {canClaimCertificate && certificate && (
                        <button
                            onClick={() => triggerDirectDownload('certificate')}
                            disabled={isGenerating === 'certificate'}
                            className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] disabled:opacity-70 group shadow-lg shadow-blue-600/20"
                        >
                            {isGenerating === 'certificate' ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Award size={16} className="text-yellow-300" />
                            )}
                            <span>{isGenerating === 'certificate' ? 'Processing...' : 'Claim Certificate'}</span>
                        </button>
                    )}

                    {!canClaimCertificate && endDate && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-tight rounded-lg border border-slate-100">
                            <Award size={12} />
                            Certificate Available: {new Date(endDate).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
