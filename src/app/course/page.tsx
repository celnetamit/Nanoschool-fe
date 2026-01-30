import { getProducts } from '@/lib/wordpress';
import ProductGrid from '@/components/ProductGrid';
// import Link from 'next/link';

export default async function CoursesPage() {
    const courses = await getProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Professional Courses
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Advanced certification programs designed for industry professionals.
                </p>
            </div>

            <ProductGrid products={courses} />
        </div>
    );
}
