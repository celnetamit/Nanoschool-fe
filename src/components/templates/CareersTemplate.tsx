import Link from 'next/link';
import { WordPressPost, sanitizeWPContent } from '@/lib/wordpress';

interface CareersTemplateProps {
    post: WordPressPost;
}

export default function CareersTemplate({ post }: CareersTemplateProps) {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
                {/* Animated Background Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl top-40 right-20 animate-pulse animation-delay-2000"></div>
                    <div className="absolute w-96 h-96 bg-pink-400/20 rounded-full blur-3xl bottom-20 left-1/3 animate-pulse animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                    <div className="mb-8">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 text-sm font-semibold mb-6 border border-white/20">
                            💼 Join Our Team
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                        Careers at NanoSchool
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                        Join our mission to shape the future of AI, Nanotechnology, and Biotechnology education
                    </p>
                </div>
            </section>

            {/* Ideal Partner Section */}
            <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-bold mb-4">
                            WHO WE SEEK
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            The Ideal Key Account Partner
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: '👔',
                                title: 'Senior Executives',
                                description: 'Retired senior executives, deans, provosts, and academicians with extensive networks',
                            },
                            {
                                icon: '💼',
                                title: 'Consultants',
                                description: 'Independent consultants and boutique firms seeking partnership opportunities',
                            },
                            {
                                icon: '🤝',
                                title: 'Channel Partners',
                                description: 'Established distributors and dealers with proven track records',
                            },
                            {
                                icon: '🎓',
                                title: 'SME Experts',
                                description: 'Subject-matter experts with strong business acumen and industry knowledge',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Responsibilities & Rewards Section */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-bold mb-4">
                            YOUR ROLE & REWARDS
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            What You'll Do & Earn
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Responsibilities Card */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative p-8 lg:p-10">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    📋
                                </div>
                                <h3 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                    Responsibilities
                                </h3>
                                <ul className="space-y-4 text-gray-600 text-lg">
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 text-xl">•</span>
                                        <span>Lead generation & qualification</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 text-xl">•</span>
                                        <span>Relationship management</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 text-xl">•</span>
                                        <span>End-to-end sales ownership</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 text-xl">•</span>
                                        <span>Market intelligence gathering</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 text-xl">•</span>
                                        <span>Collaborative strategic planning</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Rewards Card */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative p-8 lg:p-10">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    💰
                                </div>
                                <h3 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                                    Rewards
                                </h3>
                                <ul className="space-y-4 text-gray-600 text-lg">
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-600 text-xl">•</span>
                                        <span><strong>15–25%</strong> revenue share</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-600 text-xl">•</span>
                                        <span><strong>Uncapped</strong> earnings potential</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-600 text-xl">•</span>
                                        <span>Performance-based bonuses</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-600 text-xl">•</span>
                                        <span>Recognition & prestige benefits</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-purple-600 text-xl">•</span>
                                        <span>Autonomy & flexibility</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnership Journey Section */}
            <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm font-bold mb-4">
                            THE PROCESS
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            The Partnership Journey
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                phase: 'Phase 1',
                                title: 'Attraction & Identification',
                                description: 'Explore, attend webinars, and submit your application',
                                icon: '🔍',
                            },
                            {
                                phase: 'Phase 2',
                                title: 'Vetting & Selection',
                                description: 'Interviews, business plan review, and due diligence',
                                icon: '✅',
                            },
                            {
                                phase: 'Phase 3',
                                title: 'Onboarding & Enablement',
                                description: 'Comprehensive training, tools, CRM, and partner portal access',
                                icon: '🚀',
                            },
                            {
                                phase: 'Phase 4',
                                title: 'Performance & Growth',
                                description: 'Execute strategies, quarterly reviews, and scale your territory',
                                icon: '📈',
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                                    <div className="text-5xl mb-4">{item.icon}</div>
                                    <div className="text-sm font-bold text-blue-600 mb-2">{item.phase}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                </div>
                                {index < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 right-0 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Ready to Join Us?
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Take the first step towards an exciting career opportunity with NanoSchool
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/contact-us"
                            className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            Contact Us
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <a
                            href="tel:+91-9958161117"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
