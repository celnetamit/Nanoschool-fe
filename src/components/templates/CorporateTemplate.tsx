import Link from 'next/link';
// import { WordPressPost } from '@/lib/wordpress'; // Unused

export default function CorporateTemplate() {
    return (
        <div className="bg-white">
            {/* Hero Section - Corporate B2B Focus */}
            <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 text-sm font-bold border border-white/20">
                                CORPORATE TRAINING SOLUTIONS
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                            Upskill Your Workforce in
                            <span className="block mt-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                AI & Deep Tech
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
                            Partner with India&apos;s leading deep-tech education provider. Custom training programs for Fortune 500 companies, startups, and research institutions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact-us"
                                className="px-10 py-4 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2"
                            >
                                Schedule Consultation
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </Link>
                            <Link
                                href="/workshops"
                                className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all"
                            >
                                View Programs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-16 bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-600 font-semibold mb-8">TRUSTED BY LEADING ORGANIZATIONS</p>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        {['IIT', 'DRDO', 'ISRO', 'AIIMS', 'CSIR', 'BARC'].map((org) => (
                            <div key={org} className="px-8 py-4 bg-white rounded-xl shadow-md">
                                <span className="text-2xl font-extrabold text-gray-800">{org}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Corporate Training Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Customized programs designed to meet your organization&apos;s specific needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎓',
                                title: 'Custom Training Programs',
                                description: 'Tailored curriculum designed for your team\'s skill level and business objectives',
                            },
                            {
                                icon: '👥',
                                title: 'Expert Instructors',
                                description: 'PhD-level trainers with industry experience from top tech companies',
                            },
                            {
                                icon: '🏢',
                                title: 'On-site & Remote',
                                description: 'Flexible delivery options - at your office or virtual training sessions',
                            },
                            {
                                icon: '📊',
                                title: 'Progress Tracking',
                                description: 'Detailed analytics and reports on employee learning outcomes',
                            },
                            {
                                icon: '🎯',
                                title: 'Hands-on Projects',
                                description: 'Real-world projects aligned with your business use cases',
                            },
                            {
                                icon: '🏆',
                                title: 'Certification',
                                description: 'Industry-recognized certificates to showcase employee expertise',
                            },
                        ].map((service, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all hover:shadow-xl border border-gray-100">
                                <div className="text-5xl mb-6">{service.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Training Areas */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Training Domains
                        </h2>
                        <p className="text-xl text-gray-600">
                            Comprehensive programs across cutting-edge technologies
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Artificial Intelligence & ML',
                                topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow/PyTorch', 'MLOps'],
                                gradient: 'from-blue-500 to-indigo-600',
                            },
                            {
                                title: 'Biotechnology',
                                topics: ['Genetic Engineering', 'Bioinformatics', 'Drug Discovery', 'Genomics', 'CRISPR', 'Molecular Biology'],
                                gradient: 'from-emerald-500 to-teal-600',
                            },
                            {
                                title: 'Nanotechnology',
                                topics: ['Nanomaterials', 'Quantum Dots', 'Nanoelectronics', 'Characterization', 'Synthesis', 'Applications'],
                                gradient: 'from-purple-500 to-pink-600',
                            },
                        ].map((domain, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100">
                                <h3 className={`text-2xl font-extrabold mb-6 bg-gradient-to-r ${domain.gradient} bg-clip-text text-transparent`}>
                                    {domain.title}
                                </h3>
                                <ul className="space-y-3">
                                    {domain.topics.map((topic, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${domain.gradient} flex items-center justify-center mt-0.5`}>
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Why Partner With Us?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '17+', label: 'Years Experience' },
                            { number: '500+', label: 'Corporate Clients' },
                            { number: '50K+', label: 'Employees Trained' },
                            { number: '95%', label: 'Satisfaction Rate' },
                        ].map((stat, i) => (
                            <div key={i} className="p-8">
                                <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Ready to Upskill Your Team?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        Contact us for a customized training proposal tailored to your organization&apos;s needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact-us"
                            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:scale-105"
                        >
                            Request Proposal
                        </Link>
                        <a
                            href="mailto:corporate@nanoschool.in"
                            className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
