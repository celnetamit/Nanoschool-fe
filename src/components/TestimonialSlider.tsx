'use client';

import { useState, useEffect, useRef } from 'react';
import ReviewCard from './ReviewCard';
import { FeedbackData } from '@/lib/feedback';

interface TestimonialSliderProps {
    feedbacks?: FeedbackData[];
}

export default function TestimonialSlider({ feedbacks = [] }: TestimonialSliderProps) {
    const [scrolled, setScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scroll = () => {
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft += 1;
            }
        };

        const intervalId = setInterval(scroll, 30);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="w-full py-16 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
                    Student Success Stories
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    What Our Learners Say
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Join thousands of satisfied students who have transformed their careers with our expert-led workshops and courses.
                </p>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 px-4 scrollbar-hide select-none"
                style={{ scrollBehavior: 'auto' }}
            >
                {/* Display Feedbacks only if available */}
                {feedbacks.length > 0 ? (
                    [...feedbacks, ...feedbacks].map((review, index) => (
                        <div key={index} className="min-w-[280px] max-w-[320px] flex-shrink-0">
                            <ReviewCard
                                name={review.name}
                                date={review.date}
                                time={review.time}
                                comment={review.comment}
                                rating={review.rating}
                                workshopName={review.workshopName}
                            />
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-10 opacity-30 font-black text-slate-400 uppercase tracking-widest text-[11px]">
                        Loading success stories...
                    </div>
                )}
            </div>
        </div>
    );
}
