export const revalidate = 3600;

import { getPostBySlug } from '@/lib/wordpress';
import { getTemplateForSlug } from '@/lib/templates';
import HomeTemplate from '@/components/templates/HomeTemplate';
import DomainTemplate from '@/components/templates/DomainTemplate';
import AboutTemplate from '@/components/templates/AboutTemplate';
import CorporateTemplate from '@/components/templates/CorporateTemplate';
import CareersTemplate from '@/components/templates/CareersTemplate';
import ContactTemplate from '@/components/templates/ContactTemplate';
import InternshipTemplate from '@/components/templates/InternshipTemplate';
import FaqTemplate from '@/components/templates/FaqTemplate';
import JsonLd from '@/components/JsonLd';
import { notFound } from 'next/navigation';
import { getInternships } from '@/lib/internships';
import { Metadata } from 'next';

const DOMAIN_METADATA: Record<string, { title: string, description: string, keywords: string[] }> = {
    'ai': {
        title: 'Master Artificial Intelligence & Machine Learning',
        description: 'Industry-recognized AI certifications and workshops. Learn Machine Learning, Deep Learning, NLP, and Computer Vision from PhD experts.',
        keywords: ['AI certification India', 'Machine Learning workshops', 'NLP training', 'Deep Learning courses']
    },
    'biotech': {
        title: 'Innovate with Biotechnology & Life Sciences',
        description: 'Excel in biotechnology with expert-led programs in genetic engineering, bioinformatics, and drug discovery. Hands-on virtual labs.',
        keywords: ['Biotechnology workshops', 'Bioinformatics courses', 'Genetic engineering training', 'Life sciences certification']
    },
    'nano-technology': {
        title: 'Engineer the Future with Nanotechnology',
        description: 'Explore cutting-edge nanotechnology with research-focused curriculum in nanomaterials, quantum dots, and molecular engineering.',
        keywords: ['Nanotechnology workshops', 'Nanomaterials courses', 'Molecular scaling training', 'Nanoscience certification']
    },
    'about-us': {
        title: 'About NanoSchool - Empowering Next-Gen Scientists',
        description: 'Learn about our mission to provide world-class education in AI, Biotech, and Nanotech through expert mentorship and hands-on learning.',
        keywords: ['NanoSchool mission', 'Deep tech education', 'PhD mentorship', 'advanced technology school']
    }
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://courses.nanoschool.in';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const config = DOMAIN_METADATA[slug];

    if (!config) {
        return {
            title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
        };
    }

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        alternates: {
            canonical: `/${slug}`, // Relative path is fine with metadataBase
        },
        openGraph: {
            title: `${config.title} | NanoSchool`,
            description: config.description,
            url: `${siteUrl}/${slug}`,
        }
    };
}

export default async function SlugPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Fetch the page from WordPress
    let post = await getPostBySlug('pages', slug);

    // If about-us doesn't exist, try 'about' as fallback
    if (!post && slug === 'about-us') {
        post = await getPostBySlug('pages', 'about');
    }

    // For about-us specifically, provide fallback content if still no post
    if (!post && slug === 'about-us') {
        post = {
            id: 0,
            slug: 'about-us',
            title: { rendered: 'About Us' },
            excerpt: { rendered: 'Empowering the next generation through cutting-edge education in nanoscience and technology.' },
            content: { rendered: '' },
            featured_media: 0,
            date: new Date().toISOString()
        };
    }

    if (!post) {
        notFound();
    }

    // Corporate pages get special template
    if (slug === 'corporate' || slug === 'corporate-vv2') {
        return <CorporateTemplate />;
    }

    // Determine which template to use
    const template = getTemplateForSlug(slug);

    // Fetch dynamic content strictly if required by the template
    let internships: any[] = [];
    if (template === 'internship') {
        internships = await getInternships();
    }

    // FAQ Schema for specific domains (AEO/GEO Optimization)
    let faqSchema = null;
    if (slug === 'ai' || slug === 'biotech' || slug === 'nano-technology') {
        const domainName = slug === 'ai' ? 'Artificial Intelligence' : slug === 'biotech' ? 'Biotechnology' : 'Nanotechnology';
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `What will I learn in the ${domainName} program?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Our ${domainName} program covers hands-on projects, expert mentorship from PhD researchers, and industry-recognized certifications in cutting-edge topics.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Is the ${domainName} certification recognized in the industry?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Yes, NanoSchool certifications are highly regarded by industry leaders and research institutions, providing a significant boost to your professional credentials.`
                    }
                }
            ]
        };
    }

    // Render the appropriate template
    const content = (() => {
        switch (template) {
            case 'home':
                return <HomeTemplate />;

            case 'domain':
                return <DomainTemplate slug={slug} />;

            case 'careers':
                return <CareersTemplate post={post} />;

            case 'contact':
                return <ContactTemplate post={post} />;

            case 'internship':
                return <InternshipTemplate post={post} internships={internships} />;

            case 'faqs':
                return <FaqTemplate />;

            case 'about':
            default:
                return <AboutTemplate post={post} />;
        }
    })();

    return (
        <>
            {faqSchema && <JsonLd data={faqSchema} />}
            {content}
        </>
    );
}
