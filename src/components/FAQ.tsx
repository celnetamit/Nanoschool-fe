
'use client';

import { useState } from 'react';

const FAQS = [
    {
        question: 'Who are the courses designed for?',
        answer: 'Our courses are designed for students, researchers, and professionals in STEM fields who want to specialize in deep-tech domains like AI, Biotech, and Nanotech. We cover everything from fundamentals to advanced industry applications.'
    },
    {
        question: 'Are the certificates recognized by the industry?',
        answer: 'Yes, NanoSchool certificates are recognized by leading companies and research institutions globally. Our curriculum is co-developed with industry partners to ensure relevance and job-readiness.'
    },
    {
        question: 'How do the hands-on projects work remotely?',
        answer: 'We provide access to virtual labs and cloud-based simulation tools. For coding-heavy courses like AI and Bioinformatics, you get access to configured Jupyter environments and massive datasets to work on.'
    },
    {
        question: 'Do you provide placement assistance?',
        answer: 'Absolutely. Our "Career Accelerator" module includes resume building, mock interviews with industry experts, and direct referrals to our hiring partners for top-performing students.'
    },
    {
        question: 'Can I access the course content after completion?',
        answer: 'Yes, you get lifetime access to all course materials, including recorded lectures, notes, and project repositories. You can revisit them anytime to brush up on concepts.'
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {FAQS.map((faq, index) => (
                <div key={index} className="mb-4">
                    <button
                        onClick={() => toggle(index)}
                        className={`w-full text-left p-6 rounded-2xl flex items-center justify-between transition-all duration-300 ${openIndex === index ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <span className="font-bold text-lg pr-8">{faq.question}</span>
                        <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
