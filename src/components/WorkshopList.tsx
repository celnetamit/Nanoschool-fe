'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Link from 'next/link';

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
    totalPages
}: {
    workshops: Workshop[],
    categories: any[],
    categoryId: number,
    currentPage: number,
    totalPages: number
}) {
    const [searchQuery, setSearchQuery] = useState('');

    // Only show these specific workshop categories
    const ALLOWED_CATEGORY_IDS = [5088, 5059, 5085]; // AI, Biotech, Nanotech

    // Filter workshops by allowed categories
    const categoryFilteredWorkshops = workshops.filter(workshop => {
        // If a specific category is selected, show all workshops from that category
        if (categoryId > 0) return true;

        // For "All", only show workshops from allowed categories
        const workshopCategories = workshop._embedded?.['wp:term']?.[0] || [];
        return workshopCategories.some((cat: any) => ALLOWED_CATEGORY_IDS.includes(cat.id));
    });

    // Filter workshops based on search query
    const filteredWorkshops = categoryFilteredWorkshops.filter(workshop =>
        workshop.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Hands-on Workshops
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Intensive training sessions designed to give you practical, real-world experience.
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
        </div>
    );
}
