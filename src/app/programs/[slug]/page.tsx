import DetailView from '@/components/DetailView';
import { getPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug('programs', slug);

    if (!post) {
        notFound();
    }

    return <DetailView params={params} type="programs" initialPost={post} />;
}
