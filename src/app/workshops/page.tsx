import { getWorkshops, getCategories } from '@/lib/wordpress';
import Card from '@/components/Card';
import Link from 'next/link';

export default async function WorkshopsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
    const categoryId = typeof resolvedParams.category === 'string' ? parseInt(resolvedParams.category) : 0;

    // Fetch data in parallel
    const [workshopData, categories] = await Promise.all([
        getWorkshops({ page, perPage: 9, category: categoryId }),
        getCategories()
    ]);

    const { posts: workshops, totalPages } = workshopData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Hands-on Workshops
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Intensive training sessions designed to give you practical, real-world experience.
                </p>

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

            {workshops.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-dashed">
                    No workshops found in this category.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {workshops.map((workshop) => (
                            <Card key={workshop.id} post={workshop} type="workshops" />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4">
                            {page > 1 && (
                                <Link
                                    href={`/workshops?page=${page - 1}${categoryId ? `&category=${categoryId}` : ''}`}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    ← Previous
                                </Link>
                            )}
                            <span className="px-4 py-3 text-gray-500 font-mono text-sm self-center">
                                Page {page} of {totalPages}
                            </span>
                            {page < totalPages && (
                                <Link
                                    href={`/workshops?page=${page + 1}${categoryId ? `&category=${categoryId}` : ''}`}
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
