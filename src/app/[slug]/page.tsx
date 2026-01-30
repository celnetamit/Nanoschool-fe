import { getPostBySlug } from '@/lib/wordpress';
import { getTemplateForSlug } from '@/lib/templates';
import HomeTemplate from '@/components/templates/HomeTemplate';
import DomainTemplate from '@/components/templates/DomainTemplate';
import AboutTemplate from '@/components/templates/AboutTemplate';
import CorporateTemplate from '@/components/templates/CorporateTemplate';
import { notFound } from 'next/navigation';

export default async function SlugPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Fetch the page from WordPress
    const post = await getPostBySlug('pages', slug);

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

        case 'about':
        case 'contact':
        case 'faqs':
        default:
            return <AboutTemplate post={post} />;
    }
}
