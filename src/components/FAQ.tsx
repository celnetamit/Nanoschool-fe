'use client';

import { useState } from 'react';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQCategory {
    name: string;
    items: FAQItem[];
}

interface FAQProps {
    categories: FAQCategory[];
}

export default function FAQ({ categories }: FAQProps) {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Reset open index when category changes
    const handleCategoryChange = (index: number) => {
        setActiveCategoryIndex(index);
        setOpenIndex(0); // Optional: automatically open first item
    };

    const activeCategory = categories[activeCategoryIndex];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategoryChange(index)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${activeCategoryIndex === index
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-blue-300'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Accordion List */}
            <div className="space-y-4 min-h-[400px]">
                {activeCategory?.items.map((faq, index) => (
                    <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <button
                            onClick={() => toggle(index)}
                            className={`w-full text-left p-6 rounded-2xl flex items-center justify-between transition-all duration-300 ${openIndex === index
                                    ? 'bg-white border-l-4 border-blue-600 shadow-md'
                                    : 'bg-white hover:bg-slate-50 border border-slate-100'
                                }`}
                        >
                            <span className={`font-bold text-lg pr-8 transition-colors ${openIndex === index ? 'text-blue-700' : 'text-slate-800'}`}>
                                {faq.question}
                            </span>
                            <span
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-100 text-slate-400'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-slate-600 leading-relaxed text-base md:text-lg">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
