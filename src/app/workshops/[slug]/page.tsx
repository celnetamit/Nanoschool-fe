import DetailView from '@/components/DetailView';
import { getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug('workshops', slug);

    if (!post) {
        return {
            title: 'Workshop Not Found | NanoSchool',
        };
    }

    const title = post.title.rendered;
    const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 160);
    const images = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        ? [post._embedded['wp:featuredmedia'][0].source_url]
        : [];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://courses.nanoschool.in';

    return {
        title: `${title} | Live Workshop`,
        description: description,
        alternates: {
            canonical: `${siteUrl}/workshops/${slug}`
        },
        openGraph: {
            title: title,
            description: description,
            images: images,
            type: 'website',
            url: `${siteUrl}/workshops/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: images,
        }
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug('workshops', slug);

    if (!post) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://courses.nanoschool.in';

    const isPastEvent = new Date(post.date).getTime() < Date.now();
    const availability = isPastEvent ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';

    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationEvent',
        'name': post.title.rendered,
        'description': post.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
        'image': post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        'startDate': post.date, 
        'eventStatus': 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
        'location': {
            '@type': 'VirtualLocation',
            'url': `${siteUrl}/workshops/${slug}`
        },
        'organizer': {
            '@type': 'Organization',
            'name': 'NanoSchool',
            'url': siteUrl
        },
        'offers': {
          '@type': 'Offer',
          'url': `${siteUrl}/workshops/${slug}`,
          'availability': availability,
          'category': 'Professional Workshop'
        }
    };

    const workshopName = post.title.rendered.replace(/<[^>]*>?/gm, '');
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': `Will I get a certificate after completing the ${workshopName} workshop?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes, all participants who successfully complete the ${workshopName} workshop will receive a verifiable digital certificate from NanoSchool.`
                }
            },
            {
                '@type': 'Question',
                'name': `Are the sessions for ${workshopName} recorded?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes, registered participants will get access to session recordings for review and future reference.`
                }
            }
        ]
    };

    return (
        <>
            <JsonLd data={eventSchema} />
            <JsonLd data={faqSchema} />
            <DetailView params={params} type="workshops" />
        </>
    );
}
