'use client';

import { useActionState } from 'react';
import { submitContactForm } from '../actions/contact';
import { useState } from 'react';

// Define the initial state type
const initialState = {
    success: false,
    message: '',
};

export default function ContactPage() {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] -top-20 -left-20 animate-pulse"></div>
                <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] bottom-0 right-0 animate-pulse animation-delay-2000"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold mb-6">
                            Connect With Us
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Let's Start a <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Conversation</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                            Have questions about our programs, workshops, or research? We're here to help you navigate your scientific journey.
                        </p>

                        <div className="flex flex-col gap-4 text-blue-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <span className="font-medium">+91 9958161117</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="font-medium">info@nstc.in</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl rotate-2 opacity-50 blur-lg transform scale-105"></div>
                        <div className="relative bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl text-slate-800">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Send us a Message</h3>

                            {state.success ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h4>
                                    <p className="text-slate-600">{state.message}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form action={formAction} className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    {state.message && !state.success && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {state.message}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:scale-98 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map / Info Grid */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">📍</span>
                                Office Address
                            </h3>
                            <p className="text-slate-600 leading-relaxed pl-14">
                                LGF, 40 National Park,<br />
                                Lajpat Nagar IV,<br />
                                New Delhi - 110024
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">📧</span>
                                Email Us
                            </h3>
                            <div className="pl-14 space-y-2">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inquiries</p>
                                    <a href="mailto:info@nstc.in" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">info@nstc.in</a>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Training</p>
                                    <a href="mailto:trainings@nstc.in" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">trainings@nstc.in</a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">⏱️</span>
                                Working Hours
                            </h3>
                            <div className="pl-14">
                                <p className="text-slate-700 font-medium">Monday to Saturday</p>
                                <p className="text-slate-500">9:00 AM - 5:30 PM (IST)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
