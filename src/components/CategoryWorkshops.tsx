import { getWorkshops } from '@/lib/wordpress';
import Card from './Card';
import Link from 'next/link';

export default async function CategoryWorkshops({
    categoryId,
    title,
    limit = 3,
    viewAllLink = '/workshops'
}: {
    categoryId: number,
    title: string,
    limit?: number,
    viewAllLink?: string
}) {
    // Fetch latest workshops for this category
    const { posts: workshops } = await getWorkshops({ category: categoryId, perPage: limit });

    if (workshops.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            {title}
                        </h2>
                        <p className="text-lg text-gray-600">
                            Upcoming hands-on training sessions
                        </p>
                    </div>
                    <Link
                        href={`${viewAllLink}?category=${categoryId}`}
                        className="hidden md:inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All Workshops
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workshops.map((workshop) => (
                        <Card key={workshop.id} post={workshop} type="workshops" />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href={`${viewAllLink}?category=${categoryId}`}
                        className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All Workshops
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
