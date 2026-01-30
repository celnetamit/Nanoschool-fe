import { WordPressPost, sanitizeWPContent } from '@/lib/wordpress';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
    post: WordPressPost;
    type: 'courses' | 'course' | 'workshops' | 'programs';
}

export default function Card({ post, type }: CardProps) {
    // Extract media from _embedded (fetched via &embed) to prevent N+1 API calls
    const embeddedMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = embeddedMedia?.source_url || 'https://via.placeholder.com/600x400?text=NanoSchool';


    const sanitizedExcerpt = sanitizeWPContent(post.excerpt.rendered, true);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col transform hover:-translate-y-1">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
                <Link href={`/${type}/${post.slug}`} className="block w-full h-full">
                    <Image
                        src={imageUrl}
                        alt={post.title.rendered || 'Course Image'}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-sm">
                        {type === 'courses' ? 'COURSE' : type === 'course' ? 'COURSE' : type.endsWith('s') ? type.slice(0, -1) : type}
                    </span>
                    <span className="text-gray-400 text-xs">
                        {new Date(post.date).toLocaleDateString()}
                    </span>
                </div>
                <h3
                    className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {sanitizedExcerpt}
                </div>
                <div className="mt-auto">
                    <Link
                        href={`/${type}/${post.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 group/link"
                    >
                        View Details
                        <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
