import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy | NanoSchool',
    description: 'Privacy Policy for NanoSchool website and services.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Privacy Policy</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        This Privacy Policy explains how we collect, use, and disclose information about you when you visit our website or use our services.
                    </p>
                    <div className="mt-8 text-sm text-slate-500 uppercase tracking-widest font-semibold">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 mb-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600">

                        <p className="lead text-xl text-slate-700 mb-10 border-l-4 border-blue-500 pl-4 italic">
                            At <strong>NanoSchool.in</strong> (owned by IT BREAK COM PRIVATE LIMITED with NSTC (Nano Science & Technology Consortium) as an academic knowledge partner), we are committed to protecting your privacy and keeping your personal information secure.
                        </p>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">1</span>
                                Information We Collect
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    We collect information from you when you register on our website, place an order, subscribe to our course, training program, workshop or any virtual or physical event, respond to a survey or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number information.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">2</span>
                                How We Use Your Information
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>We use the information we collect from you in the following ways:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>To personalize your experience</li>
                                    <li>To improve our website</li>
                                    <li>To improve customer service</li>
                                    <li>To process transactions</li>
                                    <li>To administer a contest, promotion, survey or other site feature</li>
                                    <li>To send periodic emails regarding your order or other products and services</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">3</span>
                                How We Protect Your Information
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    We take the security of your personal information seriously and use a variety of security technologies and procedures to help protect your personal information from unauthorized access, use or disclosure. We also use secure encryption technology (SSL) to protect your credit card information during transmission.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">4</span>
                                Disclosure of Your Information
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    We may disclose your personal information to third-party service providers who perform services on our behalf, such as payment processing, email marketing, and website analytics. We may also disclose your information in response to a court order or other legal obligation, or to protect our rights, property, or safety, or the rights, property, or safety of others.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">5</span>
                                Your Choices
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    You may opt-out of receiving marketing emails from us at any time by clicking the "unsubscribe" link at the bottom of any email. Please note that even if you opt-out of receiving marketing emails, we may still send you emails regarding your order or other products and services.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">6</span>
                                Updates to This Privacy Policy
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    We may update this Privacy Policy from time to time to reflect changes to our information practices. We encourage you to review this page periodically for the latest information on our privacy practices.
                                </p>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl mb-4 flex items-center group">
                                <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 font-bold">7</span>
                                Contact Us
                            </h2>
                            <div className="pl-14 space-y-4">
                                <p>
                                    If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:info@nstc.in">info@nstc.in</a>.
                                </p>
                            </div>
                        </section>

                        <div className="mt-16 pt-8 border-t border-slate-200">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <Link href="/contact-us" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                    Have questions? Contact Support <span className="ml-2">→</span>
                                </Link>
                                <Link href="/terms-of-service" className="text-slate-500 hover:text-slate-700 font-medium">
                                    Read Terms of Service
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
