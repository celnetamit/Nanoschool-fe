'use client';

import React from 'react';
import FAQ, { FAQCategory } from '@/components/FAQ';
import Link from 'next/link';

import { FAQ_DATA } from '@/data/faqs';

export default function FaqTemplate() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                        Find answers to common questions about our programs, registration, technical requirements, and mentorship opportunities.
                    </p>
                </div>
            </section>

            {/* FAQ Tabs \u0026 List Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative z-20">
                    <FAQ categories={FAQ_DATA} />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Still have questions?</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Can't find the answer you're looking for? Our team is here to help.
                    </p>
                    <Link
                        href="/contact-us"
                        className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Contact Support
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
