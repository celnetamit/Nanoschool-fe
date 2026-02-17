import Link from 'next/link';
import Image from 'next/image';
import { BlogPost, parseBlogContent } from '@/lib/wordpress';

export default function BlogCard({ post }: { post: BlogPost }) {
    const { title, content } = parseBlogContent(post.content.rendered);
    const displayTitle = title || post.title.rendered || 'Untitled Post';

    // Extract a brief excerpt from the content if the official excerpt is empty
    const rawExcerpt = post.excerpt.rendered.replace(/<[^>]*>?/gm, '') || content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...';
    const displayExcerpt = rawExcerpt.slice(0, 120) + (rawExcerpt.length > 120 ? '...' : '');

    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=600';

    return (
        <Link href={`/blogs/${post.slug}`} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={displayTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                        Deep Science
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {displayTitle}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                    {displayExcerpt}
                </p>

                <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest mt-auto group-hover:gap-2 transition-all">
                    <span>Read Article</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
            </div>
        </Link>
    );
}
