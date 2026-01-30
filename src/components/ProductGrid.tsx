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

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full mb-4">
                <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm font-semibold text-gray-700"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        Filters
                    </span>
                    <span className="text-gray-400 text-sm">{filteredProducts.length} Results</span>
                    <svg className={`w-5 h-5 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`lg:w-64 flex-shrink-0 space-y-8 lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} w-full`}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Category</label>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === 'all'}
                                    onChange={() => setSelectedCategory('all')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className={`text-sm group-hover:text-blue-600 transition-colors ${selectedCategory === 'all' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>All Categories</span>
                            </label>
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === cat.slug}
                                        onChange={() => setSelectedCategory(cat.slug)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className={`text-sm group-hover:text-blue-600 transition-colors ${selectedCategory === cat.slug ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Focus Area (Tags)</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedTag('all')}
                                className={`px-2 py-1 rounded text-xs font-medium border transition-all ${selectedTag === 'all'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            {tags.slice(0, 15).map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => setSelectedTag(tag.slug === selectedTag ? 'all' : tag.slug)}
                                    className={`px-2 py-1 rounded text-xs font-medium border transition-all ${selectedTag === tag.slug
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
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
            <div className="flex-grow w-full">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <p className="text-gray-500 text-sm">
                        Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'az' | 'za')}
                            className="text-sm border-none bg-transparent font-semibold text-gray-900 focus:ring-0 cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="az">Title (A-Z)</option>
                            <option value="za">Title (Z-A)</option>
                        </select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((course) => (
                            <Card key={course.id} post={course} type="courses" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
