import Link from 'next/link';
import { WordPressPost, sanitizeWPContent } from '@/lib/wordpress';

interface AboutTemplateProps {
    post: WordPressPost;
}

export default function AboutTemplate({ post }: AboutTemplateProps) {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section - More Compact */}
            <section className="relative py-16 md:py-24 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                        {post.title.rendered}
                    </h1>
                    {post.excerpt?.rendered && (
                        <div
                            className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl"
                            dangerouslySetInnerHTML={{ __html: sanitizeWPContent(post.excerpt.rendered, true) }}
                        />
                    )}
                </div>
            </section>

            {/* Main Content - Improved Layout */}
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {post.content?.rendered ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Content Wrapper with Better Typography */}
                            <div className="p-8 md:p-12">
                                <div
                                    className="wordpress-content
                    prose prose-lg max-w-none
                    prose-headings:font-extrabold prose-headings:text-gray-900 prose-headings:mb-6 prose-headings:mt-8 first:prose-headings:mt-0
                    prose-h2:text-3xl prose-h2:border-b prose-h2:border-blue-200 prose-h2:pb-4 
                    prose-h3:text-2xl prose-h3:text-blue-900
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:my-6 prose-ul:space-y-2
                    prose-li:text-gray-700
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
                  "
                                    dangerouslySetInnerHTML={{ __html: sanitizeWPContent(post.content.rendered) }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                            <div className="text-gray-400 text-6xl mb-4">📄</div>
                            <p className="text-gray-500 text-lg">Content coming soon...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section - Less Padding */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Ready to Learn More?
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 mb-8">
                        Explore our programs and start your journey with NanoSchool
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/workshops"
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
                        >
                            View Workshops
                        </Link>
                        <Link
                            href="/contact-us"
                            className="px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white/30 transition-all"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
