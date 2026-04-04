import Link from 'next/link';
import { WordPressPost, sanitizeWPContent } from '@/lib/wordpress';

interface AboutTemplateProps {
    post: WordPressPost;
}

export default function AboutTemplate({ post }: AboutTemplateProps) {
    return (
        <div className="bg-white">
            {/* Hero Section - Matching Home Page Style */}
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
                            🎓 About NanoSchool
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                        {post.title.rendered}
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                        Connecting minds and driving progress. Welcome to NanoSchool, a pioneering ed-tech firm at the forefront of promoting the power and potential of deep tech since 2006.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: '5000+', label: 'Students', icon: '👨‍🎓' },
                            { number: '50+', label: 'Programs', icon: '📚' },
                            { number: '25+', label: 'Awards', icon: '🏆' },
                            { number: '4.9/5', label: 'Rating', icon: '⭐' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-bold mb-4">
                            OUR PURPOSE
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Vision & Mission
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {[
                            {
                                title: 'Our Vision',
                                description: 'To be the global leader in deep-tech education, empowering the next generation of innovators and researchers to solve humanity\'s greatest challenges.',
                                icon: '🎯',
                                gradient: 'from-blue-500 to-indigo-600',
                                bgGradient: 'from-blue-50 to-indigo-50',
                            },
                            {
                                title: 'Our Mission',
                                description: 'Democratize access to cutting-edge technological knowledge through world-class education, hands-on research, and industry partnerships.',
                                icon: '🚀',
                                gradient: 'from-purple-500 to-pink-600',
                                bgGradient: 'from-purple-50 to-pink-50',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative p-8 lg:p-10">
                                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                        {item.icon}
                                    </div>
                                    <h3 className={`text-3xl font-extrabold mb-4 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features/Why Choose Us Section */}
            <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-bold mb-4">
                            WHY CHOOSE US
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            What Makes Us Different
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            17 years of excellence in providing world-class technical education
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '💡',
                                title: 'Innovation First',
                                description: 'Cutting-edge curriculum updated with latest research and industry trends',
                            },
                            {
                                icon: '👨‍🏫',
                                title: 'Expert Mentorship',
                                description: 'Learn from PhDs and industry veterans with 10+ years of experience',
                            },
                            {
                                icon: '🎯',
                                title: 'Hands-on Learning',
                                description: 'Build real-world projects with industry-standard tools and technologies',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WordPress Content Section */}
            {post.content?.rendered && (
                <section className="py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            className="wordpress-content prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: sanitizeWPContent(post.content.rendered) }}
                        />
                    </div>
                </section>
            )}

            {/* CTA Section - Matching Home Page Style */}
            <section className="relative py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 right-0 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join thousands of students who are already advancing their careers with NanoSchool
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/workshops"
                            className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            Browse Workshops
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            href="/contact-us"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                        >
                            Contact Us
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
