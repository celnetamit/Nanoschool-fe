import Link from 'next/link';
import CategoryWorkshops from '../CategoryWorkshops';
import CategoryCourses from '../CategoryCourses';

interface DomainTemplateProps {
    slug: string;
}

// Domain-specific configuration
const DOMAIN_CONFIG: Record<string, {
    icon: string;
    gradient: string;
    tagline: string;
    description: string;
    keyBenefits: string[];
    skills: string[];
    careers: string[];
}> = {
    'ai': {
        icon: '🤖',
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        tagline: 'Master Artificial Intelligence & Machine Learning',
        description: 'Transform your career with industry-recognized AI certifications. Learn from PhD experts and work on real-world projects in machine learning, deep learning, NLP, and computer vision.',
        keyBenefits: [
            'Hands-on projects with real datasets',
            'Expert mentorship from PhD researchers',
            'Industry-recognized certification',
            'Job placement assistance',
            '100+ AI courses and workshops',
            'Lifetime community access',
        ],
        skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch', 'Python', 'Data Science'],
        careers: ['ML Engineer', 'Data Scientist', 'AI Researcher', 'ML Ops Engineer'],
    },
    'artificial-intelligence': {
        icon: '🤖',
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        tagline: 'Master Artificial Intelligence & Machine Learning',
        description: 'Transform your career with industry-recognized AI certifications.',
        keyBenefits: ['Hands-on Projects', 'Expert Mentors', 'Industry Certificates'],
        skills: ['ML', 'DL', 'NLP', 'CV'],
        careers: ['ML Engineer', 'Data Scientist'],
    },
    'biotech': {
        icon: '🧬',
        gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        tagline: 'Innovate Life Sciences with Biotechnology',
        description: 'Excel in biotechnology with expert-led programs in genetic engineering, drug discovery, and bioinformatics. Industry partnerships and research opportunities included.',
        keyBenefits: [
            'Laboratory-style virtual workshops',
            'Expert guidance from biotech professionals',
            'Research project opportunities',
            'Industry internship support',
            '80+ biotech courses',
            'Global biotech community',
        ],
        skills: ['Genetic Engineering', 'Bioinformatics', 'Drug Discovery', 'Molecular Biology', 'CRISPR', 'Proteomics', 'Genomics', 'Bioprocessing'],
        careers: ['Biotech Researcher', 'Bioinformatics Analyst', 'Clinical Research Associate', 'Bioprocess Engineer'],
    },
    'nano-technology': {
        icon: '⚛️',
        gradient: 'from-purple-600 via-pink-600 to-rose-600',
        tagline: 'Engineer the Future at Molecular Scale',
        description: 'Explore cutting-edge nanotechnology with research-focused curriculum in nanomaterials, quantum dots, and molecular-scale engineering.',
        keyBenefits: [
            'Research-oriented curriculum',
            'Access to virtual nanolab tools',
            'Expert PhD mentorship',
            'Publication opportunities',
            '60+ nanotech courses',
            'Research collaborations',
        ],
        skills: ['Nanomaterials', 'Quantum Dots', 'Nanoelectronics', 'Nanomedicine', 'Characterization', 'Synthesis', 'Simulations', 'Microscopy'],
        careers: ['Nanotechnology Researcher', 'Materials Scientist', 'Nanotech Engineer', 'R&D Specialist'],
    },
    'nanotech-4': {
        icon: '⚛️',
        gradient: 'from-purple-600 via-pink-600 to-rose-600',
        tagline: 'Engineer the Future at Molecular Scale',
        description: 'Explore cutting-edge nanotechnology.',
        keyBenefits: ['Research Curriculum', 'Virtual Nanolab', 'PhD Mentors'],
        skills: ['Nanomaterials', 'Quantum Dots'],
        careers: ['Researcher', 'Materials Scientist'],
    },
};

export default function DomainTemplate({ slug }: DomainTemplateProps) {
    const config = DOMAIN_CONFIG[slug] || DOMAIN_CONFIG['ai'];

    // Career opportunities section...

    // Map slugs to workshop category IDs
    const workshopCategoryMap: Record<string, number> = {
        'ai': 5088,
        'artificial-intelligence': 5088,
        'biotech': 5059,
        'nano-technology': 5085,
        'nanotech-4': 5085,
    };

    const workshopCategoryId = workshopCategoryMap[slug];

    // Map slugs to course (product) category IDs
    const courseCategoryMap: Record<string, number> = {
        'ai': 4658,
        'artificial-intelligence': 4658,
        'biotech': 6253,
        'nano-technology': 6260,
    };

    const courseCategoryId = courseCategoryMap[slug];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            {/* ... (existing hero content) ... */}

            <section className={`relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br ${config.gradient}`}>
                {/* Background Animation */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-20 right-20 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-4xl">
                        {/* Badge */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-bold border border-white/20">
                                PROFESSIONAL CERTIFICATION PROGRAM
                            </span>
                        </div>

                        {/* Icon */}
                        <div className="text-8xl mb-6">{config.icon}</div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            {config.tagline}
                        </h1>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl">
                            {config.description}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link
                                href="/workshops"
                                className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2"
                            >
                                Browse Workshops
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                href="/course"
                                className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all"
                            >
                                View Courses
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {[
                                { number: '100+', label: 'Courses' },
                                { number: '50+', label: 'Expert Mentors' },
                                { number: '10K+', label: 'Students' },
                                { number: '95%', label: 'Job Success' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                    <div className="text-3xl font-extrabold text-white">{stat.number}</div>
                                    <div className="text-sm text-white/80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Benefits */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Why Choose Our Program?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to succeed in your career
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {config.keyBenefits.map((benefit, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-6`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* UPCOMING WORKSHOPS SECTION (NEW) */}
            {workshopCategoryId && (
                <CategoryWorkshops
                    categoryId={workshopCategoryId}
                    title="Upcoming Workshops"
                    limit={6}
                />
            )}

            {courseCategoryId && (
                <CategoryCourses
                    categoryId={courseCategoryId}
                    title="Featured Courses"
                    limit={6}
                />
            )}

            {/* Skills You'll Learn */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Skills You&apos;ll Master
                        </h2>
                        <p className="text-xl text-gray-600">
                            Industry-relevant technical expertise
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {config.skills.map((skill, index) => (
                            <div
                                key={index}
                                className={`px-8 py-4 rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform`}
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Paths */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Career Opportunities
                        </h2>
                        <p className="text-xl text-gray-600">
                            Launch your career in high-demand roles
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {config.careers.map((career, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all border border-gray-100">
                                <div className="text-4xl mb-4">💼</div>
                                <h3 className="text-lg font-bold text-gray-900">{career}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-24 bg-gradient-to-r ${config.gradient} text-white`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Start Your Learning Journey
                    </h2>
                    <p className="text-xl text-white/90 mb-10 leading-relaxed">
                        Join thousands of professionals who&apos;ve transformed their careers with NanoSchool
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/workshops"
                            className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Explore Workshops
                        </Link>
                        <Link
                            href="/contact-us"
                            className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all"
                        >
                            Talk to Expert
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
