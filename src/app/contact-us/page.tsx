'use client';

import React from "react";
import { ContactForm } from "@/components/ContactForm";
import { Toaster } from 'react-hot-toast';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">

            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Toaster position="top-center" reverseOrder={false} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white mb-6">
                                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Touch</span>
                            </h1>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                                Have questions about our programs or need assistance? 
                                Fill out the form below and our team will get back to you shortly.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm group hover:border-cyan-500/30 transition-all duration-300">
                                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Email Us</h3>
                                    <p className="text-slate-400">info@nstc.in</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm group hover:border-blue-500/30 transition-all duration-300">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Call Us</h3>
                                    <p className="text-slate-400">+91-120-478-1217</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm group hover:border-purple-500/30 transition-all duration-300">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Visit Us</h3>
                                    <p className="text-slate-400">Active via Online Support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ContactForm />
                </div>
            </main>
        </div>
    );
}
