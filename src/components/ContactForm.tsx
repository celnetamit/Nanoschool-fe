'use client';

import React, { useActionState, useEffect } from 'react';
import { submitContactForm } from '../app/actions/contact';
import toast from 'react-hot-toast';
import { 
    User, 
    Mail, 
    Phone, 
    HelpCircle, 
    MessageSquare, 
    Send, 
    Loader2
} from 'lucide-react';
import { useAuthAction } from '@/hooks/useAuthAction';

/**
 * Custom Contact Form component with Pro UI/UX design.
 * Features: Responsive grid, Lucide icons, glassmorphism, and automated page tracking.
 */
export function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContactForm, {
        success: false,
        message: "",
    });

    const { performAction, currentPath } = useAuthAction();

    const [pageUrl, setPageUrl] = React.useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageUrl(window.location.href);
        }
        if (state.message) {
            if (state.success) {
                toast.success(state.message, {
                    duration: 5000,
                    style: {
                        background: '#0f172a',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    },
                });
            } else {
                toast.error(state.message, {
                    duration: 5000,
                    style: {
                        background: '#0f172a',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                    },
                });
            }
        }
    }, [state]);

    const queryOptions = [
        "Mentor Portal",
        "Workshops",
        "Registration",
        "Dashboard",
        "Profile",
        "Other"
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        performAction(() => {
            formAction(formData);
        });
    };


    return (
        <div className="relative group">
            {/* Advanced Glassmorphism Container */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-slate-900/80 backdrop-blur-2xl rounded-2xl p-6 md:p-10 border border-slate-800/50 shadow-2xl overflow-hidden">
                
                {/* Visual Depth Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                <User className="w-3.5 h-3.5 text-cyan-500" />
                                Full Name
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-4 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 text-slate-200 placeholder-slate-600 transition-all outline-none hover:border-slate-700"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                <Mail className="w-3.5 h-3.5 text-cyan-500" />
                                Email Address
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full pl-4 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 text-slate-200 placeholder-slate-600 transition-all outline-none hover:border-slate-700"
                                />
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                <Phone className="w-3.5 h-3.5 text-cyan-500" />
                                Contact Number
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    placeholder="+91 00000 00000"
                                    className="w-full pl-4 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 text-slate-200 placeholder-slate-600 transition-all outline-none hover:border-slate-700"
                                />
                            </div>
                        </div>

                        {/* Query For */}
                        <div className="space-y-2">
                            <label htmlFor="queryFor" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
                                Query For
                            </label>
                            <div className="relative">
                                <select
                                    id="queryFor"
                                    name="queryFor"
                                    required
                                    className="w-full pl-4 pr-10 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 text-slate-200 transition-all outline-none hover:border-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-900">Select an option</option>
                                    {queryOptions.map((opt, idx) => (
                                        <option key={idx} value={opt} className="bg-slate-900">{opt}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Message - Full Width */}
                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="message" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                placeholder="Tell us how we can help you..."
                                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 text-slate-200 placeholder-slate-600 transition-all outline-none resize-none hover:border-slate-700"
                            ></textarea>
                        </div>

                        {/* Hidden Page URL field */}
                        <input type="hidden" name="page" id="7883" value={pageUrl} />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full group/btn relative overflow-hidden py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-900/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Message</span>
                                        <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
