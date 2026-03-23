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

    return {
        title: `${title} | Live Workshop`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: images,
            type: 'article',
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug('workshops', slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
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
            'url': `https://nanoschool.in/workshops/${slug}`
        },
        'organizer': {
            '@type': 'Organization',
            'name': 'NanoSchool',
            'url': 'https://nanoschool.in'
        },
        'offers': {
          '@type': 'Offer',
          'url': `https://nanoschool.in/workshops/${slug}`,
          'availability': 'https://schema.org/InStock',
          'category': 'Professional Workshop'
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <DetailView params={params} type="workshops" />
        </>
    );
}
