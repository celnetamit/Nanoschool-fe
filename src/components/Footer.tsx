import Link from 'next/link';
import NextImage from 'next/image';
import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block mb-6 relative w-40 h-12">
                            <NextImage
                                src="https://nanoschool.in/wp-content/uploads/2025/05/NSTC-Logo-2-removebg-preview.png"
                                alt="NanoSchool"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                        <p className="leading-relaxed text-sm">
                            Empowering the next generation of scientists and engineers with cutting-edge curriculum and industry mentorship.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link href="/course" className="hover:text-blue-400 transition-colors">All Courses</Link></li>
                            <li><Link href="/workshops" className="hover:text-blue-400 transition-colors">Workshops</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about-us" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact-us" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link href="/corporate" className="hover:text-blue-400 transition-colors">For Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                    <p>© {new Date().getFullYear()} NanoSchool EdTech Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Made with ❤️ for Science</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
