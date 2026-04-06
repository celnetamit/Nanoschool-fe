export const revalidate = 3600;

import DetailView from '@/components/DetailView';
import { getPostBySlug, getWorkshops } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import WorkshopJsonLd from '@/components/seo/WorkshopJsonLd';

export async function generateStaticParams() {
    try {
        const baseUrl = process.env.WP_INTERNAL_URL || 'https://nanoschool.in/wp-json/wp/v2';
        const res = await fetch(`${baseUrl}/posts?per_page=100&_fields=slug&categories=5088,5059,5085`, {
            next: { revalidate: 3600 }
        });
        if (res.ok) {
            const posts = await res.json();
            return posts.map((post: any) => ({
                slug: String(post.slug),
            }));
        }
    } catch (e) {
        console.error("Failed to generate static params for workshops", e);
    }
    
    // Fallback: don't pre-render anything if the server is timing out
    return [];
}

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

    return (
        <>
            <WorkshopJsonLd workshop={post} siteUrl={siteUrl} />
            <DetailView params={params} type="workshops" initialPost={post} />
        </>
    );
}
