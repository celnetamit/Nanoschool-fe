'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">N</span>
                            </div>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                NanoSchool
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                            Home
                        </Link>

                        {/* About Dropdown - simplified to main pages */}
                        <Link href="/about-us" className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                            About
                        </Link>

                        {/* Domains */}
                        <div className="relative group">
                            <button className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all flex items-center gap-1">
                                Domains
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                                <div className="py-2">
                                    <Link href="/ai" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-t-lg transition-all">
                                        <span className="text-xl">🤖</span>
                                        <span className="font-medium">Artificial Intelligence</span>
                                    </Link>
                                    <Link href="/biotech" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 transition-all">
                                        <span className="text-xl">🧬</span>
                                        <span className="font-medium">Biotechnology</span>
                                    </Link>
                                    <Link href="/nano-technology" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 rounded-b-lg transition-all">
                                        <span className="text-xl">⚛️</span>
                                        <span className="font-medium">Nanotechnology</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link href="/workshops" className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                            Workshops
                        </Link>

                        <Link href="/course" className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                            Courses
                        </Link>

                        <Link href="/corporate" className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                            Corporate
                        </Link>

                        <Link href="/contact-us" className="ml-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30">
                            Contact Us
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40 animate-fade-in-down">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Home
                        </Link>
                        <Link href="/about-us" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            About
                        </Link>
                        <Link href="/ai" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all pl-6">
                            - AI
                        </Link>
                        <Link href="/biotech" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all pl-6">
                            - Biotech
                        </Link>
                        <Link href="/nano-technology" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all pl-6">
                            - Nanotech
                        </Link>
                        <Link href="/workshops" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Workshops
                        </Link>
                        <Link href="/course" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Courses
                        </Link>
                        <Link href="/corporate" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Corporate
                        </Link>
                        <Link href="/contact-us" onClick={() => setIsOpen(false)} className="block px-3 py-3 mt-4 rounded-lg bg-blue-600 text-white font-bold text-center mx-3 hover:bg-blue-700 shadow-lg">
                            Contact Us
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
