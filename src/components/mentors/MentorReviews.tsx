'use client';

import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

interface MentorReview {
    name: string;
    date: string;
    comment: string;
    rating: number;
}

export default function MentorReviews({ reviews }: { reviews?: MentorReview[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect for infinite marquee
    useEffect(() => {
        if (!reviews || reviews.length === 0) return;
        
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scroll = () => {
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft += 0.8;
            }
        };

        const intervalId = setInterval(scroll, 30);
        return () => clearInterval(intervalId);
    }, [reviews]);

    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-[70rem] mx-auto px-4 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-4">
                            <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                            Client Testimonials
                        </h3>
                        <p className="text-slate-400 max-w-xl font-medium">
                            Real feedback from professionals and researchers who have been mentored by our elite experts across the globe.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-white tracking-widest uppercase">Verified Expert</span>
                    </div>
                </div>
            </div>

            {/* Marquee Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 px-4 scrollbar-hide select-none cursor-default"
                style={{ scrollBehavior: 'auto' }}
            >
                {[...reviews, ...reviews].map((review, index) => (
                    <div 
                        key={index} 
                        className="min-w-[320px] md:min-w-[400px] flex-shrink-0 bg-white/[0.03] border border-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] relative group hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500"
                    >
                        <Quote className="absolute top-6 right-8 w-12 h-12 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors" />
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-100 text-sm">{review.name}</h4>
                                <div className="flex gap-0.5 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={10} 
                                            className={`${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-[14px] leading-relaxed italic relative z-10 font-medium line-clamp-4">
                            &quot;{review.comment}&quot;
                        </p>
                        
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{review.date}</span>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Verified Review</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
