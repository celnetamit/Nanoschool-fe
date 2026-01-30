import Link from 'next/link';
// import { WordPressPost } from '@/lib/wordpress'; // Unused

export default function HomeTemplate() {
    return (
        <div className="bg-white">
            {/* Stunning Hero Section with Particle Background */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
                {/* Animated Background Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl top-40 right-20 animate-pulse animation-delay-2000"></div>
                    <div className="absolute w-96 h-96 bg-pink-400/20 rounded-full blur-3xl bottom-20 left-1/3 animate-pulse animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                    {/* Main Headline */}
                    <div className="mb-8">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 text-sm font-semibold mb-6 border border-white/20">
                            🎓 17 Years of Excellence in Deep-Tech Education
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                        Transform Your Career in
                        <span className="block mt-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            AI & Deep Science
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
                        Join India&apos;s premier learning platform for Artificial Intelligence, Biotechnology, and Nanotechnology.
                        Industry-recognized certifications, expert mentors, hands-on projects.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <Link
                            href="/workshops"
                            className="group px-10 py-5 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            Browse Workshops
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            href="/courses"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                        >
                            View Courses
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Animated Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            { number: '17+', label: 'Years Excellence', icon: '🏆' },
                            { number: '50K+', label: 'Students Trained', icon: '👨‍🎓' },
                            { number: '500+', label: 'Industry Partners', icon: '🤝' },
                            { number: '95%', label: 'Placement Rate', icon: '🚀' },
                        ].map((stat, index) => (
                            <div key={index} className="group">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                                    <div className="text-4xl mb-2">{stat.icon}</div>
                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.number}</div>
                                    <div className="text-sm text-blue-100 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Domain Showcase - Premium Cards */}
            <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-bold mb-4">
                            CHOOSE YOUR PATH
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Explore Our Domains
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Industry-leading programs designed to make you job-ready in cutting-edge technologies
                        </p>
                    </div>

                    {/* Domain Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                title: 'Artificial Intelligence',
                                description: 'Master machine learning, deep learning, NLP, computer vision and generative AI with hands-on projects',
                                icon: '🤖',
                                gradient: 'from-blue-500 to-indigo-600',
                                bgGradient: 'from-blue-50 to-indigo-50',
                                href: '/ai',
                                stats: ['100+ Courses', '50+ Mentors', '10K+ Students'],
                            },
                            {
                                title: 'Biotechnology',
                                description: 'Dive into genetic engineering, bioinformatics, drug discovery and molecular biology innovations',
                                icon: '🧬',
                                gradient: 'from-emerald-500 to-teal-600',
                                bgGradient: 'from-emerald-50 to-teal-50',
                                href: '/biotech',
                                stats: ['80+ Courses', '40+ Mentors', '8K+ Students'],
                            },
                            {
                                title: 'Nanotechnology',
                                description: 'Explore nanomaterials, quantum dots, molecular engineering and cutting-edge nanotech applications',
                                icon: '⚛️',
                                gradient: 'from-purple-500 to-pink-600',
                                bgGradient: 'from-purple-50 to-pink-50',
                                href: '/nano-technology',
                                stats: ['60+ Courses', '30+ Mentors', '5K+ Students'],
                            },
                        ].map((domain, index) => (
                            <Link
                                key={index}
                                href={domain.href}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                            >
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${domain.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                {/* Content */}
                                <div className="relative p-8 lg:p-10">
                                    {/* Icon */}
                                    <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                        {domain.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-2xl lg:text-3xl font-extrabold mb-4 bg-gradient-to-r ${domain.gradient} bg-clip-text text-transparent`}>
                                        {domain.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {domain.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {domain.stats.map((stat, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 group-hover:bg-white rounded-full text-sm font-semibold text-gray-700">
                                                {stat}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className={`flex items-center gap-2 font-bold text-${domain.gradient.split(' ')[1]}-600 group-hover:gap-3 transition-all`}>
                                        Explore Programs
                                        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Corner Accent */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${domain.gradient} opacity-10 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500`}></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Feature Grid */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-bold mb-4">
                            WHY NANOSCHOOL
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Learn from the Best
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            17 years of excellence in providing world-class technical education
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: '👨‍🏫',
                                title: 'Expert Mentors',
                                description: 'Learn from PhDs and industry veterans with 10+ years of experience',
                            },
                            {
                                icon: '🎯',
                                title: 'Hands-on Projects',
                                description: 'Build real-world projects with industry-standard tools and technologies',
                            },
                            {
                                icon: '🏆',
                                title: 'Industry Recognition',
                                description: 'Certificates valued by top tech companies and research institutions worldwide',
                            },
                            {
                                icon: '🚀',
                                title: '95% Placement',
                                description: 'Dedicated career support with interview prep and job placement assistance',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA - Conversion Focused */}
            <section className="relative py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 right-0 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Ready to Transform Your Career?
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join 50,000+ students who&apos;ve already advanced their careers with NanoSchool&apos;s industry-recognized programs
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/workshops"
                            className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            Start Learning Today
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            href="/contact-us"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                        >
                            Talk to an Expert
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-16 pt-12 border-t border-white/20">
                        <p className="text-blue-100 text-sm font-semibold mb-6">TRUSTED BY LEADING INSTITUTIONS</p>
                        <div className="flex flex-wrap justify-center gap-8 opacity-60">
                            {['IIT', 'NIT', 'BITS', 'AIIMS', 'DRDO'].map((org) => (
                                <div key={org} className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <span className="text-white font-bold text-lg">{org}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
