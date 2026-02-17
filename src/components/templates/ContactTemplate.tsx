import Link from 'next/link';
import { WordPressPost } from '@/lib/wordpress';

interface ContactTemplateProps {
    post: WordPressPost;
}

export default function ContactTemplate({ post }: ContactTemplateProps) {
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
                            📞 Contact Us
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                        Get in Touch
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                        Have questions? We're here to help you on your learning journey
                    </p>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Office Address Card */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative p-8 lg:p-10">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    📍
                                </div>
                                <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                    Visit Our Office
                                </h3>
                                <div className="text-gray-600 leading-relaxed space-y-2">
                                    <p className="font-medium">LGF, 40 National Park,</p>
                                    <p>Lajpat Nagar IV,</p>
                                    <p>New Delhi - 110024</p>
                                </div>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative p-8 lg:p-10">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    📧
                                </div>
                                <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                                    Email Us
                                </h3>
                                <div className="text-gray-600 leading-relaxed space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Course Enrollment:</p>
                                        <a href="mailto:trainings@nstc.in" className="text-blue-600 hover:text-blue-800 transition-colors">
                                            trainings@nstc.in
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">General & Collaborations:</p>
                                        <a href="mailto:info@nstc.in" className="text-blue-600 hover:text-blue-800 transition-colors">
                                            info@nstc.in
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative p-8 lg:p-10">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    📞
                                </div>
                                <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                                    Call Us
                                </h3>
                                <div className="text-gray-600 leading-relaxed space-y-3">
                                    <div>
                                        <a href="tel:+919958161117" className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors block">
                                            +91 9958161117
                                        </a>
                                    </div>
                                    <div>
                                        <a href="tel:+911204781217" className="text-gray-600 hover:text-blue-600 transition-colors block">
                                            +91120 4781217
                                        </a>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <p className="text-sm text-gray-500">Monday to Saturday</p>
                                        <p className="text-sm font-medium text-gray-700">9:00 AM - 5:30 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Details Section */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Company Details
                        </h3>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div>
                                <span className="font-semibold text-gray-700">CIN:</span> U74899DL2001PTC109327
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">GST:</span> 09AAACI8666D2ZD
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">PAN:</span> AAACI8666D
                            </div>
                        </div>
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
                        Ready to Connect?
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Reach out to us today and let's start your journey together
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="mailto:info@nstc.in"
                            className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email Us
                        </a>
                        <a
                            href="tel:+919958161117"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Now
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
