import CourseTemplate from '@/components/templates/CourseTemplate';
import { getPostBySlug, getStoreProduct } from '@/lib/wordpress';
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
    const [post, storeProduct] = await Promise.all([
        getPostBySlug('courses', slug),
        getStoreProduct(slug)
    ]);

    if (!post) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nanoschool.in';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
        provider: {
            '@type': 'Organization',
            name: 'NanoSchool',
            sameAs: siteUrl
        },
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        datePublished: post.date,
        occupationalCredentialAwarded: 'NanoSchool Certification',
        offers: storeProduct ? {
            '@type': 'Offer',
            category: 'Paid',
            priceCurrency: storeProduct.prices.currency_code,
            price: parseFloat(storeProduct.prices.price) / 100,
            availability: 'https://schema.org/InStock',
            url: storeProduct.add_to_cart.url
        } : undefined
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <CourseTemplate post={post} storeProduct={storeProduct} />
        </>
    );
}
