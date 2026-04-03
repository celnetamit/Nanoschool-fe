export const dynamic = 'force-dynamic';

import { getProducts } from '@/lib/wordpress';
import ProductGrid from '@/components/ProductGrid';

export default async function CoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const categoryId = typeof resolvedParams.category === 'string' ? parseInt(resolvedParams.category) : 0;
    
    // Fetch products (optionally filtered by category)
    const courses = await getProducts({ categoryId });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* New Premium Header */}
            <div className="relative bg-slate-900 py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Professional Courses</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Industry-recognized certification programs designed by experts to fast-track your career in Deep Tech.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
                <ProductGrid products={courses} initialCategoryId={categoryId} />
            </div>
        </div>
    );
}
