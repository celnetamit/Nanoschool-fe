'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

interface Workshop {
    id: number;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    featured_media: number;
    date: string;
    _embedded?: any;
}

export default function WorkshopList({
    workshops,
    categories,
    categoryId,
    currentPage,
    totalPages,
    faqs = []
}: {
    workshops: Workshop[],
    categories: any[],
    categoryId: number,
    currentPage: number,
    totalPages: number,
    faqs?: { question: string; answer: string; }[]
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqSchema = faqs && faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
            }
        }))
    } : null;

    // Only show these specific workshop categories
    const ALLOWED_CATEGORY_IDS = [5088, 5059, 5085]; // AI, Biotech, Nanotech

    // The API now handles filtering by allowed categories (AI, Biotech, Nanotech)
    // so we can just use the workshops as-is from the props, but we keep
    // the search filter below.
    const categoryFilteredWorkshops = workshops;

    // Filter workshops based on search query
    const filteredWorkshops = categoryFilteredWorkshops.filter(workshop =>
        workshop.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {faqSchema && <JsonLd data={faqSchema} />}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Hands-on Workshops
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                    Accelerate your career with our intensive, expert-led training sessions. Whether you are exploring <strong>Artificial Intelligence</strong>, diving into <strong>Biotechnology</strong>, or mastering <strong>Nanotechnology</strong>, our workshops are designed to give you practical, real-world experience. Join industry leaders and upskill with cutting-edge tools.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search workshops by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 pl-14 text-gray-900 placeholder-gray-400 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                        />
                        <svg
                            className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="mt-3 text-sm text-gray-500">
                            Found {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/workshops"
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoryId === 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        All
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/workshops?category=${cat.id}`}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoryId === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {cat.name} <span className="opacity-60 text-xs ml-1">({cat.count})</span>
                        </Link>
                    ))}
                </div>
            </div>

            {filteredWorkshops.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-dashed">
                    {searchQuery ? `No workshops found matching "${searchQuery}"` : 'No workshops found in this category.'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {filteredWorkshops.map((workshop) => (
                            <Card key={workshop.id} post={workshop} type="workshops" />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {!searchQuery && totalPages > 1 && (
                        <div className="flex justify-center gap-4">
                            {currentPage > 1 && (
                                <Link
                                    href={`/workshops?page=${currentPage - 1}${categoryId ? `&category=${categoryId}` : ''}`}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    ← Previous
                                </Link>
                            )}
                            <span className="px-4 py-3 text-gray-500 font-mono text-sm self-center">
                                Page {currentPage} of {totalPages}
                            </span>
                            {currentPage < totalPages && (
                                <Link
                                    href={`/workshops?page=${currentPage + 1}${categoryId ? `&category=${categoryId}` : ''}`}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Next →
                                </Link>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* AEO Optimized FAQ Section */}
            {faqs && faqs.length > 0 && (
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 pr-8">{faq.question}</h3>
                                    <span className="text-gray-400 flex-shrink-0">
                                        {openFaq === index ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
