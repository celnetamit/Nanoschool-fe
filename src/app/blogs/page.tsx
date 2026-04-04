export const revalidate = 3600;

import { getBlogs } from '@/lib/wordpress';
import BlogCard from '@/components/BlogCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Deep Science Blogs | NanoSchool',
    description: 'Explore the latest insights on Nanotechnology, Biotechnology, and Artificial Intelligence.',
};

export default async function BlogsPage() {
    const blogs = await getBlogs();

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-blue-500 selection:text-white pb-20">
            {/* Header Section */}
            <div className="bg-[#0A1F44] text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
                        NSTC Updates
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        Deep Science <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Discover the latest breakthroughs, research, and educational trends at the convergence of Nano, Bio, and AI.
                    </p>
                </div>
            </div>

            {/* Blogs Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No blogs found</h3>
                        <p className="text-gray-500">Check back later for the latest updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="h-full">
                                <BlogCard post={blog} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
