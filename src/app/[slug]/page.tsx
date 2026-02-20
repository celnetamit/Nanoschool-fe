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
import { notFound } from 'next/navigation';

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

    // Render the appropriate template
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
            return <InternshipTemplate post={post} />;

        case 'faqs':
            return <FaqTemplate />;

        case 'about':
        default:
            return <AboutTemplate post={post} />;
    }
}
