import { getInternships, Internship } from '@/lib/internships';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { structureWPContent } from '@/lib/wordpress';
import InternshipCurriculum from '@/components/InternshipCurriculum';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const internships = await getInternships();
    const internship = internships.find(i => i.key === key);

    if (!internship) {
        return { title: 'Internship Not Found' };
    }

    return {
        title: `${internship.title} - Biotech Internship | NanoSchool`,
        description: internship.description,
    };
}

export default async function InternshipDetailsPage({
    params,
}: {
    params: Promise<{ key: string }>;
}) {
    const { key } = await params;
    const internships = await getInternships();
    const internship = internships.find(i => i.key === key);

    if (!internship) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 pt-32 pb-24">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 to-slate-900"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[120px]"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full uppercase tracking-wider border border-teal-500/30">
                                    {internship.category}
                                </span>
                                <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-bold rounded-full uppercase tracking-wider border border-white/10">
                                    {internship.code}
                                </span>
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                {internship.title}
                            </h1>
                            
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                                {internship.description}
                                {!internship.description.includes('Hands-on') && !internship.description.includes('skill') && (
                                    <span> Upgrade your skills with our intensive {internship.duration || 'flexible'} program.</span>
                                )}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link 
                                    href={`/internship/apply/${internship.key}`}
                                    className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(20,184,166,0.4)] hover:shadow-[0_0_40px_-5px_rgba(20,184,166,0.6)] hover:-translate-y-1"
                                >
                                    Apply Now
                                </Link>
                            </div>
                        </div>

                        {internship.image && (
                            <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src={internship.image}
                                    alt={internship.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Details Bar */}
            <div className="bg-white border-b border-slate-100 sticky top-[72px] z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-8 justify-between items-center text-sm font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                        <span className="opacity-50">Program:</span>
                        <span className="text-slate-900">{internship.shortTitle}</span>
                    </div>
                    {internship.duration && (
                        <div className="flex items-center gap-2">
                            <span className="opacity-50">Duration:</span>
                            <span className="text-slate-900">{internship.duration}</span>
                        </div>
                    )}
                     <div className="flex items-center gap-2">
                        <span className="opacity-50">Modes:</span>
                        <span className="text-slate-900">{Array.from(new Set(internship.options.map(o => o.mode))).join(', ') || internship.mode}</span>
                    </div>
                </div>
            </div>

            {/* Program Overview & Curriculum */}
            {internship.overview && (
                <section className="py-20 bg-white border-b border-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {(() => {
                            const { overview, modules } = structureWPContent(internship.overview);
                            return <InternshipCurriculum overview={overview} modules={modules} />;
                        })()}
                    </div>
                </section>
            )}

            {/* Content & Pricing */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Pricing & Modes of Training</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Choose the track that fits your schedule and learning preferences. Both modes offer identical certification value upon completion.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {internship.options.length > 0 ? internship.options.map((option, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:border-teal-500/30 transition-all flex flex-col relative overflow-hidden group">
                                {option.mode.toLowerCase().includes('offline') && (
                                    <div className="absolute top-5 right-5 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                                        Hands-on Labs
                                    </div>
                                )}
                                {option.mode.toLowerCase().includes('online') && (
                                    <div className="absolute top-5 right-5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                        Live + LMS
                                    </div>
                                )}
                                
                                <h3 className="text-2xl font-black text-slate-900 mb-2">{option.mode || 'Flexible Options'} Tracks</h3>
                                <p className="text-slate-500 font-medium mb-8">Access to expertly curated curriculum and mentorship.</p>
                                
                                <div className="mb-8">
                                    <div className="flex items-end gap-2 mb-1">
                                        <span className="text-4xl font-black text-slate-900">₹{parseFloat(option.priceInr).toLocaleString('en-IN')}</span>
                                        <span className="text-slate-400 font-semibold mb-1">/ INR</span>
                                    </div>
                                    {option.priceUsd && (
                                        <div className="text-sm font-semibold text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded">
                                            Also available for ${option.priceUsd} USD
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8 flex-grow">
                                    {['Expert mentorship and lectures', 'Capstone Project Integration', 'Industry Recognized Certification', 'Access to recorded sessions'].map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 mt-0.5 flex-shrink-0">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-slate-700 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link 
                                    href={`/internship/apply/${internship.key}`}
                                    className="w-full py-4 text-center font-bold rounded-xl transition-all border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                                >
                                    Select {option.mode}
                                </Link>
                            </div>
                        )) : (
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center col-span-2">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Registration Open</h3>
                                <p className="text-slate-600 mb-6">Proceed directly to our partner portal to view options and register.</p>
                                <Link 
                                    href={`/internship/apply/${internship.key}`}
                                    className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl"
                                >
                                    Apply Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
