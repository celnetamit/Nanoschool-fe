import { getPostBySlug, structureWPContent } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import TestimonialSlider from './TestimonialSlider';
import PricingSection from './PricingSection';
import KeyHighlights from './KeyHighlights';
import HallOfFameSection from './HallOfFameSection';

// function formatDate(dateString: string) ... (keeping this)

// Stable date formatter to prevent hydration mismatch
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Helper to extract registration deadline from content
function extractWorkshopDate(content: string): string | undefined {
    // 1. Try to find the hidden sr-only date
    const srOnlyMatch = content.match(/<p id="nsp-target-date"[^>]*>(.*?)<\/p>/);
    if (srOnlyMatch && srOnlyMatch[1]) {
        return srOnlyMatch[1].trim();
    }

    // 2. Try to find "Registration Ends" block
    const regEndsMatch = content.match(/Registration Ends[\s\S]*?<p>([\s\S]*?)<br/);
    if (regEndsMatch && regEndsMatch[1]) {
        return regEndsMatch[1].trim();
    }

    // 3. Try to find "Registration closes" bold text
    const closedMatch = content.match(/Registration closes\s*<strong>(.*?)<\/strong>/i);
    if (closedMatch && closedMatch[1]) {
        return closedMatch[1].trim();
    }

    return undefined;
}

export default async function DetailView({ params, type }: { params: Promise<{ slug: string }>, type: string }) {
    const { slug } = await params;
    const post = await getPostBySlug(type, slug);

    if (!post) {
        notFound();
    }

    // Extract embedded media efficiently (Single API Call)

    const embeddedMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = embeddedMedia?.source_url || 'https://images.unsplash.com/photo-1620712943543-bcc4628c9757?q=80&w=1920&auto=format&fit=crop';

    // Extract real structure from content
    const { overview, modules } = structureWPContent(post.content.rendered);

    // Filter modules to separate Fees, Dates, and Syllabus
    const feeModules = modules.filter(m => {
        const titleLower = m.title.toLowerCase();
        const contentLower = m.content.toLowerCase();

        // Exclude Hall of Fame items even if they have pricing symbols
        const isHallOfFame = titleLower.includes('hall of fame') ||
            titleLower.includes('publication') ||
            titleLower.includes('centre of excellence') ||
            titleLower.includes('networking') ||
            titleLower.includes('global recognition');

        if (isHallOfFame) return false;

        // Check if title contains 'fee' OR if it's a common fee category OR if content has pricing symbols
        return titleLower.includes('fee') ||
            titleLower.includes('student') ||
            titleLower.includes('scholar') ||
            titleLower.includes('ph.d') ||
            titleLower.includes('academician') ||
            titleLower.includes('faculty') ||
            titleLower.includes('professional') ||
            titleLower.includes('researcher') ||
            contentLower.includes('₹') ||
            contentLower.includes('$') ||
            contentLower.includes('rs.') ||
            contentLower.includes('inr');
    });
    const dateModules = modules.filter(m =>
        (m.title.toLowerCase().includes('date') || m.title.toLowerCase().includes('registration')) &&
        !m.title.trim().match(/^Important Dates$/i)
    );
    const syllabusModules = modules.filter(m => {
        const titleLower = m.title.toLowerCase();
        const contentLower = m.content.toLowerCase();
        // Exclude fee-related items
        const isFeeRelated = titleLower.includes('fee') ||
            titleLower.includes('student') ||
            titleLower.includes('scholar') ||
            titleLower.includes('ph.d') ||
            titleLower.includes('academician') ||
            titleLower.includes('faculty') ||
            titleLower.includes('professional') ||
            titleLower.includes('researcher') ||
            contentLower.includes('₹') ||
            contentLower.includes('$');

        return !isFeeRelated &&
            !titleLower.includes('date') &&
            !titleLower.includes('registration') &&
            !titleLower.includes('hall of fame') &&
            !titleLower.includes('publication') &&
            !titleLower.includes('centre of excellence') &&
            !titleLower.includes('networking') &&
            !titleLower.includes('global recognition') &&
            !titleLower.includes('mentor') &&
            !titleLower.includes('instructor');
    });

    // Extract mentor information if available
    const mentorModules = modules.filter(m => {
        const titleLower = m.title.toLowerCase();
        return titleLower.includes('mentor') || titleLower.includes('instructor');
    });

    // Dynamic branding colors based on type
    const branding = {
        courses: {
            accent: 'blue',
            from: 'from-blue-600',
            to: 'to-indigo-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: '🚀',
            shadow: 'shadow-blue-500/30'
        },
        course: {
            accent: 'blue',
            from: 'from-blue-600',
            to: 'to-indigo-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: '🚀',
            shadow: 'shadow-blue-500/30'
        },
        workshops: {
            accent: 'emerald',
            from: 'from-emerald-600',
            to: 'to-teal-700',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            icon: '🛠️',
            shadow: 'shadow-emerald-500/30'
        },
        programs: {
            accent: 'violet',
            from: 'from-violet-600',
            to: 'to-purple-700',
            bg: 'bg-violet-50',
            text: 'text-violet-600',
            icon: '🎓',
            shadow: 'shadow-violet-500/30'
        },
        // Add product branding (same as courses for now, or distinct)
        product: {
            accent: 'blue',
            from: 'from-brand-accent',
            to: 'to-indigo-700',
            bg: 'bg-brand-accent/10',
            text: 'text-brand-accent',
            icon: '📦',
            shadow: 'shadow-blue-500/30'
        }
    }[type as 'courses' | 'workshops' | 'programs' | 'product' | 'course'] || {
        accent: 'slate',
        from: 'from-slate-600',
        to: 'to-slate-700',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        icon: '📄',
        shadow: 'shadow-gray-500/30'
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-brand-accent selection:text-white relative">
            {/* Subtle Grid Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            {/* Immersive Cinematic Hero Section */}
            <div className="relative w-full h-[50vh] md:h-[75vh] overflow-hidden">
                {/* Background Layer with Parallax-like effect */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageUrl}
                        alt={post.title.rendered}
                        fill
                        className="object-cover scale-105 blur-[2px] opacity-90"
                        priority
                        sizes="100vw"
                    />
                    {/* Darker gradient for better text contrast */}
                    <div className={`absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-50`}></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12 md:pb-24">
                    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-end justify-between">
                        <div className="flex-grow max-w-4xl pt-10 md:pt-20">


                            <h1
                                className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4 md:mb-8 drop-shadow-2xl"
                                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                            />

                            {/* Standard Info Bar (Hidden for workshops since we have the big widget, or keep small) */}
                            {type !== 'workshops' && (
                                <div className="hidden md:flex flex-wrap gap-6 md:gap-10 items-center bg-white/10 backdrop-blur-md border border-white/20 p-3 pr-8 rounded-2xl shadow-2xl max-w-fit">
                                    <div className="flex items-center gap-4 pl-2">
                                        <div className={`w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center text-2xl shadow-lg`}>{branding.icon}</div>
                                        <div>
                                            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-0.5">Published</p>
                                            <p className="text-base font-black text-white">{formatDate(post.date)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WORKSHOP COMMAND CENTER WIDGET */}
                        {type === 'workshops' && (
                            <div className="w-full lg:w-auto min-w-[320px] mb-8 lg:mb-0 animate-fade-in-up hidden lg:block">
                                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                    {/* Animated Radar Effect */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)] opacity-50 animate-pulse"></div>
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-full border-l border-b border-red-500/10"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Live Registration</span>
                                            </div>
                                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-300 font-mono border border-white/10">
                                                BATCH #24
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-4xl font-black text-white mb-1 tracking-tight tabular-nums flex gap-1">
                                                <span>03</span>
                                                <span className="text-lg text-slate-400 font-medium self-end mb-1">Seats Left</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[92%] relative">
                                                    <div className="absolute top-0 right-0 h-full w-2 bg-white/50 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 text-right">92% Booked</p>
                                        </div>

                                        <CountdownTimer targetDate={extractWorkshopDate(post.content.rendered)} />

                                        <a
                                            href={`https://nanoschool.in/workshops/${slug}`}
                                            target="_blank"
                                            className="w-full py-4 bg-white text-slate-900 font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2 group-hover:shadow-red-500/20"
                                        >
                                            <span>Secure Seat</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>



            {/* Main Content & Sidebar (Overlapping Layout) */}
            <div className="max-w-7xl mx-auto px-4 relative -mt-10 md:-mt-20 z-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Structured Content */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* 1. Key Highlights Section (Replaces Overview) */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-200">
                            {/* Key Highlights Banner - Scanning full content for data */}
                            <KeyHighlights content={post.content.rendered} />
                        </div>

                        {/* 2. Syllabus Timeline */}
                        {syllabusModules.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 overflow-hidden relative group hover:shadow-2xl transition-all duration-500">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${branding.from} ${branding.to} opacity-5 rounded-bl-[4rem]`}></div>
                                <h2 className="text-3xl font-black text-gray-900 mb-10 relative z-10 flex items-center gap-3">
                                    <span className={`w-10 h-1 bg-gradient-to-r ${branding.from} ${branding.to} rounded-full`}></span>
                                    Program Syllabus
                                </h2>
                                <div className="relative">
                                    {/* Continuous Vertical Line */}
                                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 -translate-x-1/2 z-0 hidden md:block"></div>

                                    <div className="space-y-8">
                                        {syllabusModules.map((item, i) => (
                                            <div key={i} className="relative flex flex-col md:flex-row gap-6 md:gap-8 group">
                                                {/* Number Bubble - Left Column */}
                                                <div className="flex-shrink-0 relative z-10 md:w-12">
                                                    <div className={`w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ${branding.from.replace('from-', 'border-')} mr-auto md:mx-auto`}>
                                                        <span className={`text-lg font-black ${branding.text}`}>{i + 1}</span>
                                                    </div>
                                                </div>

                                                {/* Content - Right Column */}
                                                <div className="flex-grow pb-2">
                                                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 group-hover:border-gray-200 group-hover:shadow-lg transition-all duration-300 relative">
                                                        {/* Mobile connector if needed or just visual tweaks */}
                                                        <div className={`absolute top-6 -left-2 w-4 h-4 bg-gray-50 border-l border-b border-gray-100 transform rotate-45 hidden md:block group-hover:border-gray-200 transition-colors duration-300`}></div>

                                                        <h3 className={`text-xl font-bold text-gray-900 mb-4 group-hover:${branding.text} transition-colors`}>{item.title}</h3>
                                                        <div className="text-gray-600 prose prose-sm max-w-none wordpress-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2.5 Hall of Fame Section */}
                        <HallOfFameSection />

                        {/* 3. Pricing Section (New) */}
                        {feeModules.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-200">
                                <PricingSection modules={feeModules} />
                            </div>
                        )}

                        {/* 4. Instructor Card (Only if mentor data exists) */}
                        {mentorModules.length > 0 && (() => {
                            // Extract image from mentor content if it exists
                            const mentorContent = mentorModules[0].content;
                            const imgMatch = mentorContent.match(/<img[^>]+src="([^">]+)"/);
                            const mentorImageUrl = imgMatch ? imgMatch[1] : null;

                            // Remove image tag from content to avoid duplication
                            const contentWithoutImage = mentorContent.replace(/<img[^>]*>/g, '');

                            return (
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                        {mentorImageUrl && (
                                            <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-600 flex-shrink-0 overflow-hidden">
                                                <Image
                                                    src={mentorImageUrl}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover"
                                                    alt={mentorModules[0].title}
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">Lead Instructor</h2>
                                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-4">{mentorModules[0].title}</h3>
                                            <div className="text-slate-300 leading-relaxed max-w-xl prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: contentWithoutImage }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>


                    {/* Right Column: Premium Sidebar Widget */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            {/* Main Enrollment Card - Premium Glass/Gradient Effect */}
                            <div className={`bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 ring-1 ring-gray-100`}>
                                {/* Soft ambient glow */}
                                <div className={`absolute top-0 right-0 w-56 h-56 bg-gradient-to-br ${branding.from} ${branding.to} opacity-[0.05] blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none`}></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Limited Seats</span>
                                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider">Closing Soon</span>
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-900 mb-2 truncate" title={post.title.rendered} dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                                    <p className="text-sm text-gray-500 font-medium mb-8">Professional Certification Program</p>

                                    <div className="space-y-5 mb-10">
                                        {dateModules.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 group-hover:bg-gray-100 border border-transparent group-hover:border-gray-200 transition-all">
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className={`w-10 h-10 flex-shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg`}>📅</div>
                                                    <div className="flex flex-col w-full">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.title}</span>
                                                        <div className="text-sm font-bold text-gray-900 prose prose-sm max-w-none leading-tight" dangerouslySetInnerHTML={{ __html: item.content.replace(/<[^>]*>?/gm, ' ').trim() }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 group-hover:bg-gray-100 border border-transparent group-hover:border-gray-200 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg`}>📜</div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Certification</span>
                                                    <span className="text-sm font-bold text-green-600">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <a
                                            href={`https://nanoschool.in/${type === 'courses' ? 'course' : type}/${slug}`}
                                            target="_blank"
                                            className={`flex items-center justify-center w-full py-5 bg-gradient-to-r ${branding.from} ${branding.to} text-white font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-brand-accent/20 hover:shadow-2xl hover:shadow-brand-accent/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 text-sm relative overflow-hidden`}
                                        >
                                            <span className="relative z-10">Enroll Now</span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
                                        </a>
                                        <div className="flex items-center justify-center gap-2 opacity-60">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Instant Access</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Support Widget */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-200 relative overflow-hidden group">
                                <div className={`absolute -right-8 -bottom-8 w-40 h-40 ${branding.bg} rounded-full opacity-50 blur-2xl group-hover:scale-125 transition-transform duration-700`}></div>
                                <h4 className="text-lg font-black mb-3 text-gray-900">Need Guidance?</h4>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">Not sure if this course is right for you? Schedule a free 15-minute consultation with our academic advisors.</p>
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all w-full">Book Consultation</button>
                            </div>
                        </div>
                    </div>

                    {/* Student Success Stories */}
                    <div className="lg:col-span-12">
                        <TestimonialSlider />
                    </div>
                </div>
            </div>
        </div>
    );
}
