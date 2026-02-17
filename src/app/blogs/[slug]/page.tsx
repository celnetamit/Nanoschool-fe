
import { getBlogBySlug, parseBlogContent } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
        return {
            title: 'Blog Not Found | NanoSchool',
        };
    }

    const { title } = parseBlogContent(post.content.rendered);

    return {
        title: `${title || 'Blog Post'} | NanoSchool Insights`,
        description: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 160),
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
        notFound();
    }

    const { title, content } = parseBlogContent(post.content.rendered);
    const displayTitle = title || post.title.rendered || 'Untitled Post';

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-500 selection:text-white">
            {/* Valid HTML Content Render */}
            <article className="max-w-4xl mx-auto px-4 py-20">
                <div className="mb-10 text-center">
                    <Link href="/blogs" className="inline-flex items-center text-blue-600 font-bold uppercase tracking-widest text-xs mb-8 hover:underline">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Blogs
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        {displayTitle}
                    </h1>

                    <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                        <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                        <span>•</span>
                        <span>NSTC Editorial</span>
                    </div>
                </div>

                <div
                    className="prose prose-lg prose-blue max-w-none wordpress-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Scope styles for this specific blog content if needed, though 'prose' handles most */}
                <style>{`
                    .wordpress-content img { border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: 2rem auto; }
                    .wordpress-content iframe { width: 100%; border-radius: 1rem; aspect-ratio: 16/9; }
                    .wordpress-content a { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
                    .wordpress-content h2 { font-size: 2rem; font-weight: 800; margin-top: 3rem; margin-bottom: 1.5rem; color: #111827; }
                    .wordpress-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #1f2937; }
                    .wordpress-content p { margin-bottom: 1.5rem; line-height: 1.8; color: #374151; }
                    .wordpress-content ul, .wordpress-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
                    .wordpress-content li { margin-bottom: 0.5rem; }
                `}</style>
            </article>
        </div>
    );
}
