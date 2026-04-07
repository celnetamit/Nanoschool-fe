import Link from 'next/link';
import { WordPressPost } from '@/lib/wordpress';
import { Internship } from '@/lib/internships';
import { UpcomingEvent } from '@/lib/events';
import UpcomingEvents from '@/components/UpcomingEvents';

interface InternshipTemplateProps {
    post?: WordPressPost | null;
    internships?: Internship[];
    upcomingEvents?: UpcomingEvent[];
}

interface Project {
    title: string;
    description: string;
    duration?: string;
    mode?: string;
    icon: string;
    detailsLink: string;
    registerLink: string;
    category: 'Dry Lab' | 'Workshop';
}

const PROJECTS: Project[] = [
    // Dry Lab Projects
    {
        title: "Structure-Based In Silico Drug Design",
        description: "Learn to design novel drug candidates using computational methods.",
        duration: "1 Month",
        mode: "Offline / Online",
        icon: "💊",
        detailsLink: "https://nanoschool.in/course/structure-based-in-silico-drug-design/",
        registerLink: "https://nanoschool.in/biotech-internship/projects/application/cvtfk/#apply",
        category: 'Dry Lab'
    },
    {
        title: "siRNA Design Online Training",
        description: "Master the design of small interfering RNA for gene silencing applications.",
        duration: "45 Days",
        mode: "Online",
        icon: "🧬",
        detailsLink: "https://nanoschool.in/course/sirna-design-and-rna-secondary-structure-prediction/",
        registerLink: "https://nanoschool.in/biotech-internship/projects/application/w5cc4/#apply",
        category: 'Dry Lab'
    },
    {
        title: "NGS Data Processing",
        description: "Analyze Next-Generation Sequencing data for genomic insights.",
        duration: "1 Month",
        mode: "Online",
        icon: "💻",
        detailsLink: "https://nanoschool.in/course/ngs-data-processing-and-interpretation/",
        registerLink: "https://nanoschool.in/biotech-internship/projects/application/sv4v7/#apply",
        category: 'Dry Lab'
    },
    // Upcoming Events / Workshops
    {
        title: "E. coli Plasmid Conjugation & Transformation",
        description: "Tracking Gene Transfer Using Antibiotic Markers. Trace Horizontal Gene Transfer in Real Time.",
        icon: "🧫",
        detailsLink: "https://nanoschool.in/biotechnology/btws/e-coli-plasmid-conjugation-and-transformation-tracking-gene-transfer-using-antibiotic-markers/",
        registerLink: "https://nanoschool.in/biotechnology/btws/e-coli-plasmid-conjugation-and-transformation-tracking-gene-transfer-using-antibiotic-markers//#apply",
        category: 'Workshop'
    },
    {
        title: "Antibiotic Resistance Genes (ARGs)",
        description: "Detection and Characterization. Decode Resistance. Analyze Genomes. Advance Public Health.",
        icon: "🛡️",
        detailsLink: "https://nanoschool.in/biotechnology/btws/detection-and-characterization-of-antibiotic-resistance-genes-args/",
        registerLink: "https://nanoschool.in/biotechnology/btws/detection-and-characterization-of-antibiotic-resistance-genes-args//#apply",
        category: 'Workshop'
    },
    {
        title: "Generative AI in Drug Discovery",
        description: "Designing the future of medicine with Generative AI. From Molecules to Medicines.",
        icon: "🤖",
        detailsLink: "https://nanoschool.in/biotechnology/btws/generative-ai-in-drug-discovery-from-molecules-to-medicines/",
        registerLink: "https://nanoschool.in/biotechnology/btws/generative-ai-in-drug-discovery-from-molecules-to-medicines//#apply",
        category: 'Workshop'
    },
    {
        title: "Wastewater & Environmental AMR Surveillance",
        description: "Tracking antimicrobial resistance beyond hospitals — from wastewater to actionable insights.",
        icon: "🌍",
        detailsLink: "https://nanoschool.in/biotechnology/btws/wastewater-environmental-amr-surveillance-using-metagenomics/",
        registerLink: "https://nanoschool.in/biotechnology/btws/wastewater-environmental-amr-surveillance-using-metagenomics//#apply",
        category: 'Workshop'
    }
];

export default function InternshipTemplate({ post, internships = [], upcomingEvents = [] }: InternshipTemplateProps) {
    const displayProjects = internships.length > 0 ? internships : PROJECTS;

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-4xl">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-bold border border-white/20">
                                SUMMER / WINTER INTERNSHIP PROGRAM
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            AI in Biomedicine & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-100">
                                Biotech Internship
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl">
                            Explore Real-World Biotechnology Online-Offline Internships with Industry-Relevant Projects & Certifications.
                            Training Programs starting from ₹ 2499/- onwards.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="#projects"
                                className="px-10 py-4 bg-white text-teal-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2"
                            >
                                Explore Programs
                            </Link>
                            <Link
                                href="#contact"
                                className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-all"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section id="projects" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Internship Programs & Projects
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose from our popular dry lab projects and hands-on workshops
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayProjects.map((project, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full group hover:-translate-y-1 relative overflow-hidden">
                                {/* Top colored accent */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-3xl shadow-inner">
                                        {project.icon}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${project.category === 'Dry Lab' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {project.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                    {project.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                    {project.description}
                                </p>

                                {(project.duration || project.mode) && (
                                    <div className="flex flex-wrap gap-2 mb-6 text-xs text-gray-500 font-medium">
                                        {project.duration && (
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                <span>⏱️</span> {project.duration}
                                            </div>
                                        )}
                                        {project.mode && (
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                <span>📍</span> {project.mode}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
                                    <Link
                                        href={(project as any).key ? `/internship/${(project as any).key}` : project.detailsLink}
                                        target={(project as any).key ? "_self" : "_blank"}
                                        rel={(project as any).key ? "" : "noopener noreferrer"}
                                        className="px-4 py-2 rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-1"
                                    >
                                        Details
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </Link>
                                    <Link
                                        href={(project as any).key ? `/internship/apply/${(project as any).key}` : project.registerLink}
                                        target={(project as any).key ? "_self" : "_blank"}
                                        rel={(project as any).key ? "" : "noopener noreferrer"}
                                        className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm text-center transition-colors shadow-lg shadow-teal-500/20"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section (New) */}
            <UpcomingEvents events={upcomingEvents} />

            {/* Program Benefits */}
            <section className="py-24 bg-white" id="contact">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                                Why Join This Internship?
                            </h2>
                            <div className="space-y-6">
                                {[
                                    "Learn from Nano Science and Technology Consortium experts",
                                    "Industry-recognized certification upon completion",
                                    "Hands-on project experience for your portfolio",
                                    "Flexible online and offline learning options",
                                    "Networking opportunities with industry professionals",
                                    "Career guidance and mentorship"
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                                            ✓
                                        </div>
                                        <p className="text-lg text-gray-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-3xl transform rotate-3 opacity-20"></div>
                            <div className="relative bg-gray-900 rounded-3xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Program Details</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-700 pb-2">
                                        <span className="text-gray-400">Duration</span>
                                        <span className="font-semibold">4 - 6 Weeks</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-700 pb-2">
                                        <span className="text-gray-400">Format</span>
                                        <span className="font-semibold">Online / Offline</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-700 pb-2">
                                        <span className="text-gray-400">Eligibility</span>
                                        <span className="font-semibold">B.Tech/M.Tech/M.Sc Students</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-700 pb-2">
                                        <span className="text-gray-400">Starting From</span>
                                        <span className="font-semibold text-teal-400">₹ 2,499/-</span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link href="/contact-us" className="block w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-center rounded-xl transition-colors">
                                        Apply for Internship
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Area Removed as per user request */}
            {/* {post?.content?.rendered && (
                <section className="py-24 bg-gray-50">
                     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-teal">
                        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                    </div>
                </section>
            )} */}
        </div>
    );
}
