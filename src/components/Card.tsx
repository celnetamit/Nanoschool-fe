import { WordPressPost, sanitizeWPContent } from '@/lib/wordpress';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
    post: WordPressPost;
    type: 'courses' | 'course' | 'workshops' | 'programs';
    listView?: boolean;
}

export default function Card({ post, type, listView = false }: CardProps) {
    // Extract media from _embedded (fetched via &embed) to prevent N+1 API calls
    const embeddedMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = embeddedMedia?.source_url || 'https://via.placeholder.com/600x400?text=NanoSchool';


    const sanitizedExcerpt = sanitizeWPContent(post.excerpt.rendered, true);

    if (listView) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 bg-gray-100">
                    <Link href={`/${type}/${post.slug}`} className="block w-full h-full">
                        <Image
                            src={imageUrl}
                            alt={post.title.rendered || 'Course Image'}
                            fill
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                    </Link>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full">
                                {type === 'courses' ? 'COURSE' : type === 'course' ? 'COURSE' : type.endsWith('s') ? type.slice(0, -1) : type}
                            </span>
                            <span className="text-gray-400 text-xs font-medium">
                                {new Date(post.date).toLocaleDateString('en-GB')}
                            </span>
                        </div>
                        <Link href={`/${type}/${post.slug}`}>
                            <h3
                                className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors"
                                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                            />
                        </Link>
                        <div className="text-gray-600 text-sm mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                            {sanitizedExcerpt}
                        </div>
                    </div>
                    <Link
                        href={`/${type}/${post.slug}`}
                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mt-2"
                    >
                        View Program Details
                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
                <Link href={`/${type}/${post.slug}`} className="block w-full h-full">
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors z-10"></div>
                    <Image
                        src={imageUrl}
                        alt={post.title.rendered || 'Course Image'}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                        {type === 'courses' ? 'COURSE' : type === 'course' ? 'COURSE' : type.endsWith('s') ? type.slice(0, -1) : type}
                    </span>

                    {/* Category Pills for Workshops */}
                    {type === 'workshops' && post._embedded?.['wp:term']?.[0] && (
                        <>
                            {post._embedded['wp:term'][0].map((category: any) => {
                                // Only show specific workshop category pills
                                const categoryMap: Record<number, { name: string, color: string, bg: string, border: string }> = {
                                    5088: { name: 'AI', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                                    5059: { name: 'Biotech', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                                    5085: { name: 'Nanotech', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
                                };

                                const catInfo = categoryMap[category.id];
                                if (!catInfo) return null;

                                return (
                                    <span
                                        key={category.id}
                                        className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${catInfo.bg} ${catInfo.color} rounded-full border ${catInfo.border}`}
                                    >
                                        {catInfo.name}
                                    </span>
                                );
                            })}
                        </>
                    )}
                </div>
                <h3
                    className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {sanitizedExcerpt}
                </div>
                <div className="mt-4 mb-4">
                    {post.price && (
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-slate-900">
                                ${post.price}
                            </span>
                            {post.on_sale && post.regular_price && (
                                <span className="text-sm text-slate-400 line-through">
                                    ${post.regular_price}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-GB')}
                    </span>
                    <Link
                        href={`/${type}/${post.slug}`}
                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                        Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
