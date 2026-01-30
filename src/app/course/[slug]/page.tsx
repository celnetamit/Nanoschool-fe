import DetailView from '@/components/DetailView';
import { getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug('courses', slug);

    if (!post) {
        return {
            title: 'Course Not Found | NanoSchool',
        };
    }

    const title = post.title.rendered;
    const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 160);
    const images = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        ? [post._embedded['wp:featuredmedia'][0].source_url]
        : [];

    return {
        title: `${title} | NanoSchool Certification`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: images,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: images,
        }
    };
}

export default async function CourseDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug('courses', slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
        provider: {
            '@type': 'Organization',
            name: 'NanoSchool',
            sameAs: 'https://nanoschool.in'
        },
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        datePublished: post.date,
        occupationalCredentialAwarded: 'NanoSchool Certification'
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <DetailView params={params} type="courses" />
        </>
    );
}
