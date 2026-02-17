'use client';

import { useState, useMemo } from 'react';
import { WordPressPost } from '@/lib/wordpress';
import Card from '@/components/Card';

interface ProductGridProps {
    products: WordPressPost[];
}

interface Term {
    id: number;
    name: string;
    slug: string;
    taxonomy: string;
    count?: number;
}

export default function ProductGrid({ products }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Pagination & View State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // Default 9 items
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Dynamic Filter Extraction
    const { categories, tags } = useMemo(() => {
        const cats = new Map<string, Term>();
        const tgs = new Map<string, Term>();

        products.forEach(product => {
            const terms = product._embedded?.['wp:term'] || [];
            terms.flat().forEach((term: Term) => {
                if (term.taxonomy === 'product_cat') {
                    cats.set(term.slug, term);
                } else if (term.taxonomy === 'product_tag') {
                    tgs.set(term.slug, term);
                }
            });
        });

        // Convert to array and Sort by name
        return {
            categories: Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name)),
            tags: Array.from(tgs.values()).sort((a, b) => a.name.localeCompare(b.name))
        };
    }, [products]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // 1. Search
            const matchesSearch = product.title.rendered.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Category
            let matchesCategory = true;
            if (selectedCategory !== 'all') {
                const terms = (product._embedded?.['wp:term'] || []).flat();
                matchesCategory = terms.some((t: Term) => t.taxonomy === 'product_cat' && t.slug === selectedCategory);
            }

            // 3. Tag
            let matchesTag = true;
            if (selectedTag !== 'all') {
                const terms = (product._embedded?.['wp:term'] || []).flat();
                matchesTag = terms.some((t: Term) => t.taxonomy === 'product_tag' && t.slug === selectedTag);
            }

            return matchesSearch && matchesCategory && matchesTag;
        }).sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sortBy === 'az') return a.title.rendered.localeCompare(b.title.rendered);
            if (sortBy === 'za') return b.title.rendered.localeCompare(a.title.rendered);
            return 0;
        });
    }, [products, searchQuery, selectedCategory, selectedTag, sortBy]);

    // Pagination Logic
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedTag, sortBy, itemsPerPage]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full mb-6">
                <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm font-semibold text-gray-700"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        Filters
                    </span>
                    <span className="text-gray-400 text-sm">{totalItems} Results</span>
                    <svg className={`w-5 h-5 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`lg:w-72 flex-shrink-0 space-y-8 lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} w-full`}>
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 sticky top-32">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <h3 className="font-black text-gray-900 text-xl tracking-tight">Filters</h3>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Search</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent group-hover:border-gray-200 focus:border-blue-500 rounded-xl focus:outline-none focus:bg-white transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Categories</label>
                        <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors -mx-2">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCategory === 'all' ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400 bg-white'}`}>
                                    {selectedCategory === 'all' && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === 'all'}
                                    onChange={() => setSelectedCategory('all')}
                                    className="hidden"
                                />
                                <span className={`text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>All Categories</span>
                            </label>
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors -mx-2">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCategory === cat.slug ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400 bg-white'}`}>
                                        {selectedCategory === cat.slug && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === cat.slug}
                                        onChange={() => setSelectedCategory(cat.slug)}
                                        className="hidden"
                                    />
                                    <span className={`text-sm font-medium transition-colors ${selectedCategory === cat.slug ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Topics</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedTag('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedTag === 'all'
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                All
                            </button>
                            {tags.slice(0, 15).map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => setSelectedTag(tag.slug === selectedTag ? 'all' : tag.slug)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedTag === tag.slug
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Grid */}
            <div className="flex-grow min-w-0 w-full">
                {/* Header Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm">
                        Showing <span className="font-bold text-gray-900">{Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredProducts.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="Grid View"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                aria-label="List View"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>

                        <div className="h-4 w-px bg-gray-300"></div>

                        {/* Items Per Page */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 hidden sm:inline">Show:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="bg-gray-50 border-none rounded-lg text-sm font-semibold focus:ring-0 cursor-pointer py-1.5 pl-3 pr-8"
                            >
                                <option value={9}>9</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                            </select>
                        </div>

                        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 hidden sm:inline">Sort:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'az' | 'za')}
                                className="text-sm border-none bg-transparent font-semibold text-gray-900 focus:ring-0 cursor-pointer p-0"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="az">Name (A-Z)</option>
                                <option value="za">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {paginatedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 max-w-sm">
                            We couldn&apos;t find any courses matching your filters. Try adjusting your search query or filters.
                        </p>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                            {paginatedProducts.map((course) => (
                                <Card key={course.id} post={course} type="course" listView={viewMode === 'list'} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>

                                {(() => {
                                    const getPaginationItems = () => {
                                        const items: (number | string)[] = [];

                                        if (totalPages <= 7) {
                                            for (let i = 1; i <= totalPages; i++) items.push(i);
                                        } else {
                                            if (currentPage <= 4) {
                                                items.push(1, 2, 3, 4, 5, '...', totalPages);
                                            } else if (currentPage >= totalPages - 3) {
                                                items.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                                            } else {
                                                items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                                            }
                                        }
                                        return items;
                                    };

                                    return getPaginationItems().map((item, index) => {
                                        if (item === '...') {
                                            return (
                                                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                                            );
                                        }

                                        return (
                                            <button
                                                key={item}
                                                onClick={() => setCurrentPage(item as number)}
                                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === item ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    });
                                })()}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
