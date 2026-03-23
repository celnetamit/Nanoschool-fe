import { getProducts } from '@/lib/wordpress';
import Card from './Card';
import Link from 'next/link';

export default async function CategoryCourses({
    categoryId,
    title,
    limit = 6,
    viewAllLink = '/course'
}: {
    categoryId: number,
    title: string,
    limit?: number,
    viewAllLink?: string
}) {
    // Fetch latest courses for this category
    const courses = await getProducts({ categoryId, perPage: limit });

    if (courses.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            {title}
                        </h2>
                        <p className="text-lg text-gray-600">
                            Professional certification programs to fast-track your career
                        </p>
                    </div>
                    <Link
                        href={`${viewAllLink}?category=${categoryId}`}
                        className="hidden md:inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All Courses
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <Card key={course.id} post={course} type="course" />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href={`${viewAllLink}?category=${categoryId}`}
                        className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        View All Courses
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
