import { WordPressPost } from '@/lib/wordpress';
import Image from 'next/image';

export default function PageTemplate({ post }: { post: WordPressPost }) {
    return (
        <div className="min-h-screen bg-brand-dark">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <div className="absolute inset-0 opacity-30">
                        <Image
                            src={post._embedded['wp:featuredmedia'][0].source_url}
                            alt={post.title.rendered}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                    <div className="max-w-4xl">
                        <h1
                            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        {post.excerpt?.rendered && (
                            <div
                                className="text-xl md:text-2xl text-blue-100 leading-relaxed prose prose-lg prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                            />
                        )}
                    </div>
                </div>

                {/* Decorative gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-brand-shark rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16">
                    <div
                        className="prose prose-lg prose-invert max-w-none
              prose-headings:font-extrabold prose-headings:text-brand-light
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:bg-gradient-to-r prose-h2:from-brand-accent prose-h2:to-indigo-600 prose-h2:bg-clip-text prose-h2:text-transparent
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-brand-light
              prose-p:text-brand-muted prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-brand-accent prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-brand-light prose-strong:font-bold
              prose-ul:my-6 prose-li:text-brand-muted prose-li:my-2
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-brand-accent prose-blockquote:bg-brand-dark/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />
                </div>
            </div>
        </div>
    );
}
