'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WordPressPost, structureWPContent, sanitizeWPContent, StoreProduct } from '@/lib/wordpress';
import { BookOpen, Award, Users, CheckCircle, Clock, Calendar, ChevronDown, ChevronUp, Star, ShieldCheck, PlayCircle, Globe } from 'lucide-react';
import FAQ from '@/components/FAQ';
import { FAQ_DATA } from '@/data/faqs';
import WorkshopEnrollButton from '@/components/payments/WorkshopEnrollButton';

interface CourseTemplateProps {
    post: WordPressPost;
    storeProduct?: StoreProduct | null;
}

export default function CourseTemplate({ post, storeProduct }: CourseTemplateProps) {
    const [activeSection, setActiveSection] = useState('overview');
    const [scrolled, setScrolled] = useState(false);
    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

    // Variations Logic
    // Since API returns simple product, we simulate variations for the UI as per request
    // In a real scenario with Variable products, we would parse storeProduct.variations
    const variations = [
        { id: 'elms', name: 'e-LMS', priceMultiplier: 1 },
        { id: 'video_elms', name: 'Video + e-LMS', priceMultiplier: 1.5 },
        { id: 'live_video_elms', name: 'Live Lectures + Video + e-LMS', priceMultiplier: 2.5 },
    ];
    const [selectedVariation, setSelectedVariation] = useState(variations[0]);

    // Price Calculation
    // Use the real price from WooCommerce (wc/v3) if available on the post object
    const basePriceUSD = post.price ? parseFloat(post.price) : (storeProduct ? parseFloat(storeProduct.prices.price) / 100 : 99);
    const regularPriceUSD = post.regular_price ? parseFloat(post.regular_price) : (storeProduct ? parseFloat(storeProduct.prices.regular_price) / 100 : basePriceUSD * 1.5);

    // Use the real INR price from WooCommerce meta if available
    const basePriceINR = post.prices_inr?.sale ? parseFloat(post.prices_inr.sale) : (basePriceUSD * 84);
    const regularPriceINR = post.prices_inr?.regular ? parseFloat(post.prices_inr.regular) : (regularPriceUSD * 84);

    const currentPrice = currency === 'USD'
        ? basePriceUSD * selectedVariation.priceMultiplier
        : (basePriceINR * selectedVariation.priceMultiplier);

    const originalPrice = currency === 'USD'
        ? regularPriceUSD * selectedVariation.priceMultiplier
        : (regularPriceINR * selectedVariation.priceMultiplier);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Extract structured data
    const { overview, modules } = structureWPContent(post.content.rendered, storeProduct?.description);
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';

    // Extract Learning Mode Fees for Dialog
    const learningModeFeeMap: Record<string, string> = {};
    const feeModules = modules.filter(m => 
        m.title.toLowerCase().includes('fee') || 
        m.title.toLowerCase().includes('lms') || 
        m.title.toLowerCase().includes('video') || 
        m.title.toLowerCase().includes('lectures')
    );

    feeModules.forEach(m => {
        const titleLower = m.title.toLowerCase();
        const rawText = m.content.replace(/<[^>]*>?/gm, '').trim();
        const firstPrice = rawText.split('|')[0].trim();
        if (firstPrice) {
            if (titleLower.includes('live lectures')) {
                learningModeFeeMap['Live Lectures + Video + e-LMS'] = firstPrice;
            } else if (titleLower.includes('video')) {
                learningModeFeeMap['Video + e-LMS'] = firstPrice;
            } else if (titleLower.includes('e-lms')) {
                learningModeFeeMap['e-LMS'] = firstPrice;
            }
        }
    });

    // Fallback if extraction fails and guarantee all variants are populated so forms don't guess
    // Fallback if extraction fails and guarantee all variants are populated so forms don't guess
    const baseCoursePrice = currency === 'USD' ? basePriceUSD : basePriceINR;
    if (!learningModeFeeMap['e-LMS']) learningModeFeeMap['e-LMS'] = formatPrice(baseCoursePrice);
    if (!learningModeFeeMap['Video + e-LMS']) learningModeFeeMap['Video + e-LMS'] = formatPrice(baseCoursePrice * 1.5);
    if (!learningModeFeeMap['Live Lectures + Video + e-LMS']) learningModeFeeMap['Live Lectures + Video + e-LMS'] = formatPrice(baseCoursePrice * 2.5);

    // Smooth scroll handler
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Adjust for sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    // Scroll listener for active tab
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);

            const sections = ['overview', 'curriculum', 'certification', 'reviews', 'faq'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* 1. Immersive Hero Section */}
            <div className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={featuredMedia}
                        alt={post.title.rendered}
                        fill
                        className="object-cover opacity-20 blur-sm scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-48 md:pb-32">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-6">
                            <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Certification Program</span>
                            <span>•</span>
                            <span>NanoSchool Exclusive</span>
                        </div>
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        <div
                            className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: sanitizeWPContent(post.excerpt.rendered, true) }}
                        />

                        <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span>1,200+ Enrolled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span>4.8/5 (240 Reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-400" />
                                <span>Certificate Included</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-400" />
                                <span>Self-Paced / 6 Weeks</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Sticky Navigation Bar */}
            <div className={`sticky top-0 z-40 bg-white border-b border-slate-200 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {['Overview', 'Curriculum', 'Certification', 'Reviews', 'FAQ'].map((item) => {
                            const id = item.toLowerCase();
                            return (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(id)}
                                    className={`
                                        text-sm font-bold uppercase tracking-wider whitespace-nowrap pb-1 border-b-2 transition-colors
                                        ${activeSection === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}
                                    `}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                    {/* Simplified Enroll Button for Nav */}
                    <div className="hidden md:block">
                        <WorkshopEnrollButton
                            itemType="courses"
                            workshopTitle={post.title.rendered.replace(/<[^>]*>?/gm, '')}
                            professionFees={learningModeFeeMap}
                            courseFee={formatPrice(currentPrice)}
                            pricesInr={post.prices_inr}
                            initialCurrency={currency}
                            initialSelection={selectedVariation.name}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Enroll Now
                        </WorkshopEnrollButton>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT CONTENT COLUMN */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* OVERVIEW SECTION */}
                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                                Course Overview
                            </h2>
                            <div className="wordpress-content prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600">
                                <div dangerouslySetInnerHTML={{ __html: overview }} />
                            </div>

                            {/* Key Outcomes / What You'll Learn Box */}
                            <div className="mt-10 bg-blue-50/50 border border-blue-100 rounded-3xl p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">What you{'\''}ll learn</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {['Master core concepts', 'Build real-world projects', 'Industry standard tools', 'Expert-led sessions'].map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* CURRICULUM SECTION */}
                        <section id="curriculum" className="scroll-mt-32">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <PlayCircle className="w-8 h-8 text-blue-600" />
                                Curriculum Breakdown
                            </h2>
                            <div className="space-y-4">
                                {modules.length > 0 ? modules.map((module, index) => (
                                    <CurriculumAccordion key={index} module={module} index={index} />
                                )) : (
                                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                                        Detailed curriculum is being updated. Contact us for the full syllabus.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* CERTIFICATION SECTION */}
                        <section id="certification" className="scroll-mt-32">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <Award className="w-8 h-8 text-purple-600" />
                                Industry Recognized Certificate
                            </h2>
                            <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                                <Image
                                    src="https://nanoschool.in/wp-content/uploads/2024/05/Certificate3_page-0001.jpg"
                                    alt="NanoSchool Certificate of Completion"
                                    width={1000}
                                    height={700}
                                    className="w-full h-auto"
                                    unoptimized // Optional: if external image optimization issues arise, though we added domain to config
                                />
                            </div>
                        </section>

                        {/* REVIEWS SECTION placeholder */}
                        <section id="reviews" className="scroll-mt-32">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <Star className="w-8 h-8 text-yellow-500" />
                                Student Reviews
                            </h2>
                            {/* Placeholder reviews */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                            {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <p className="text-slate-600 mb-4 italic">"This course completely changed my career trajectory. The practical projects were incredibly coherent with industry standards."</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">S{i}</div>
                                            <div>
                                                <div className="font-bold text-slate-900">Student Name</div>
                                                <div className="text-xs text-slate-500">Genomics Analyst</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ SECTION */}
                        <section id="faq" className="scroll-mt-32">
                            <h2 className="text-3xl font-black text-slate-900 mb-8">Frequently Asked Questions</h2>
                            <FAQ categories={FAQ_DATA} />
                        </section>

                    </div>

                    {/* RIGHT SIDEBAR / STICKY ENROLLMENT */}
                    <div className="relative z-10">
                        <div className="sticky top-28 space-y-6">
                            {/* Enrollment Card */}
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">Limited Time Offer</div>

                                {/* Currency Toggle */}
                                <div className="absolute top-4 left-4 flex items-center bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setCurrency('INR')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currency === 'INR' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                                    >
                                        INR
                                    </button>
                                    <button
                                        onClick={() => setCurrency('USD')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currency === 'USD' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                                    >
                                        USD
                                    </button>
                                </div>

                                <div className="mt-8 mb-6">
                                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-1">Total Program Fee</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-slate-900">{formatPrice(currentPrice)}</span>
                                        <span className="text-xl text-slate-400 line-through font-medium">{formatPrice(originalPrice)}</span>
                                    </div>
                                </div>

                                {/* Variation Selector */}
                                <div className="space-y-3 mb-8">
                                    <div className="text-sm font-bold text-slate-900">Choose your learning mode:</div>
                                    {variations.map((v) => (
                                        <div
                                            key={v.id}
                                            onClick={() => setSelectedVariation(v)}
                                            className={`
                                                cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center justify-between
                                                ${selectedVariation.id === v.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedVariation.id === v.id ? 'border-blue-600' : 'border-slate-300'}`}>
                                                    {selectedVariation.id === v.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                </div>
                                                <span className={`font-medium ${selectedVariation.id === v.id ? 'text-blue-900' : 'text-slate-600'}`}>{v.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Use enrollment button instead of direct link */}
                                <WorkshopEnrollButton 
                                    itemType="courses"
                                    workshopTitle={post.title.rendered.replace(/<[^>]*>?/gm, '')}
                                    professionFees={learningModeFeeMap}
                                    courseFee={formatPrice(currentPrice)}
                                    pricesInr={post.prices_inr}
                                    initialCurrency={currency}
                                    initialSelection={selectedVariation.name}
                                    className="block w-full text-center py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all mb-4"
                                >
                                    Enroll Now
                                </WorkshopEnrollButton>

                                <div className="text-center text-xs text-slate-500 mb-6">
                                    30-Day Money-Back Guarantee • Lifetime Access
                                </div>

                                <div className="space-y-4 border-t border-slate-100 pt-6">
                                    <div className="flex items-center gap-3">
                                        <PlayCircle className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-600 font-medium text-sm">24 hours of on-demand video</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-600 font-medium text-sm">Flexible Schedule</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                                        <span className="text-slate-600 font-medium text-sm">Certificate of Completion</span>
                                    </div>
                                </div>
                            </div>

                            {/* Need Help Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                                    💬
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">Have questions?</div>
                                    <div className="text-sm text-slate-500">Chat with our admission counsellors</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                <div>
                    <span className="text-xs text-slate-500 block">Total Fee</span>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(currentPrice)}</span>
                </div>
                <WorkshopEnrollButton 
                    itemType="courses"
                    workshopTitle={post.title.rendered.replace(/<[^>]*>?/gm, '')}
                    professionFees={learningModeFeeMap}
                    courseFee={formatPrice(currentPrice)}
                    pricesInr={post.prices_inr}
                    initialCurrency={currency}
                    initialSelection={selectedVariation.name}
                    className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
                >
                    Enroll Now
                </WorkshopEnrollButton>
            </div>
        </div>
    );
}

function CurriculumAccordion({ module, index }: { module: { title: string, content: string }, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-blue-200 hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                    </div>
                    <span className="text-lg font-bold text-slate-900">{module.title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 border-t border-slate-100">
                    <div className="prose prose-sm prose-slate max-w-none pt-4 text-slate-600" dangerouslySetInnerHTML={{ __html: module.content }} />
                </div>
            </div>
        </div>
    );
}
