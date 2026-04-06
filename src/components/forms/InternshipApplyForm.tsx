'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Internship } from '@/lib/internships';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface InternshipApplyFormProps {
    internship: Internship;
    applicationId: string;
}

export default function InternshipApplyForm({ internship, applicationId }: InternshipApplyFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        internshipId: internship.code,
        applicationId: applicationId,
        projectTitle: internship.title,
        mode: internship.options[0]?.mode || '',
        duration: internship.options[0]?.duration || '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        affiliation: '',
        country: 'India',
        education: '',
        majorCourse: '',
        knowNstcThrough: '',
        declaration: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.declaration) {
            setErrorMessage('Please agree to the Terms & Conditions to proceed.');
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/formidable/internship-apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                // Scroll to top of form
                window.scrollTo({ top: 300, behavior: 'smooth' });
            } else {
                setErrorMessage(result.error || 'Something went wrong. Please try again.');
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            setErrorMessage('Network error. Please check your connection and try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="text-center py-16 px-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-teal-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Application Received!</h2>
                <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto">
                    Your application for the <strong>{internship.title}</strong> has been successfully submitted. Our team will review your details and contact you via email shortly.
                </p>
                <button 
                    onClick={() => router.push('/biotech-internship')}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                    Return to Internship Overview
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3 text-red-700 font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            {/* Read-Only Prefilled Section */}
            <div className="grid md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-12">
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Project ID</label>
                    <div className="text-slate-900 font-bold">{formData.internshipId}</div>
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Registration Ref</label>
                    <div className="text-slate-900 font-bold">{formData.applicationId}</div>
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Internship Name</label>
                    <div className="text-slate-900 font-bold leading-tight">{formData.projectTitle}</div>
                </div>
            </div>

            {/* Mode & Duration */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3">Preferred Learning Mode *</label>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from(new Set(internship.options.map(o => o.mode))).map((mode) => (
                            <label key={mode} className={`
                                flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-bold text-sm
                                ${formData.mode === mode ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}
                            `}>
                                <input 
                                    type="radio" 
                                    name="mode" 
                                    value={mode} 
                                    checked={formData.mode === mode}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                {mode}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-3">Duration *</label>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from(new Set(internship.options.map(o => o.duration))).map((dur) => (
                            <label key={dur} className={`
                                flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer font-bold text-sm
                                ${formData.duration === dur ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}
                            `}>
                                <input 
                                    type="radio" 
                                    name="duration" 
                                    value={dur} 
                                    checked={formData.duration === dur}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                {dur}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                    <input 
                        type="text" id="fullName" name="fullName" required 
                        placeholder="e.g. John Doe"
                        value={formData.fullName} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">Email Address *</label>
                    <input 
                        type="email" id="email" name="email" required 
                        placeholder="john@example.com"
                        value={formData.email} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-900 mb-2">Contact Number *</label>
                    <input 
                        type="tel" id="phone" name="phone" required 
                        placeholder="+91-0000000000"
                        value={formData.phone} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    />
                </div>
                <div>
                    <label htmlFor="affiliation" className="block text-sm font-bold text-slate-900 mb-2">Affiliation / Institution *</label>
                    <input 
                        type="text" id="affiliation" name="affiliation" required 
                        placeholder="e.g. University of Delhi"
                        value={formData.affiliation} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-bold text-slate-900 mb-2">Full Address *</label>
                <textarea 
                    id="address" name="address" required rows={3}
                    placeholder="Provide your complete shipping/communication address"
                    value={formData.address} onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium resize-none"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div>
                    <label htmlFor="country" className="block text-sm font-bold text-slate-900 mb-2">Country *</label>
                    <select 
                        id="country" name="country" required 
                        value={formData.country} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="education" className="block text-sm font-bold text-slate-900 mb-2">Educational Qualification *</label>
                    <select 
                        id="education" name="education" required 
                        value={formData.education} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    >
                        <option value="">Select Qualification</option>
                        <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                        <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="M.Sc.">M.Sc.</option>
                        <option value="PhD">PhD / Researcher</option>
                        <option value="Professional">Working Professional</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="majorCourse" className="block text-sm font-bold text-slate-900 mb-2">Major Course / Dept. *</label>
                    <input 
                        type="text" id="majorCourse" name="majorCourse" required 
                        placeholder="e.g. Biotechnology"
                        value={formData.majorCourse} onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="knowNstcThrough" className="block text-sm font-bold text-slate-900 mb-2">How did you know about NSTC? *</label>
                <select 
                    id="knowNstcThrough" name="knowNstcThrough" required 
                    value={formData.knowNstcThrough} onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium"
                >
                    <option value="">Select Reference</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Social Media">Social Media (LinkedIn/Instagram)</option>
                    <option value="Website / Portal">News / Educational Portal</option>
                    <option value="Friends / Faculty">Faculty / Friends</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="pt-6">
                <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="pt-1">
                        <input 
                            type="checkbox" name="declaration" required 
                            checked={formData.declaration} onChange={handleChange}
                            className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        I hereby declare that the information provided above is true to the best of my knowledge. I agree to the <span className="text-teal-600 font-bold underline">Terms & Conditions</span>.
                    </span>
                </label>
            </div>

            <div className="pt-10">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`
                        w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3
                        ${isSubmitting 
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                            : 'bg-teal-500 text-white hover:bg-teal-600 shadow-xl shadow-teal-500/20 active:scale-[0.98]'
                        }
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing Application...
                        </>
                    ) : 'Complete Application'}
                </button>
            </div>
        </form>
    );
}
