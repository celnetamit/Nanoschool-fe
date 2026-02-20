'use client';

import React, { useEffect, useState, useActionState } from 'react';
import { sendContactEmail } from '../app/actions/email';

interface FieldOptions {
    label: string;
    value: string;
}

interface FieldConfig {
    id: string;
    field_key: string;
    name: string;
    type: string;
    required: string;
    placeholder: string;
    options?: FieldOptions[];
}

interface FormidableFormProps {
    formId: string;
    apiUrl: string;
}

export function FormidableForm({ formId, apiUrl }: FormidableFormProps) {
    const [fields, setFields] = useState<FieldConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [state, formAction, isPending] = useActionState(sendContactEmail, {
        success: false,
        message: "",
    });

    useEffect(() => {
        async function fetchFields() {
            try {
                const response = await fetch(`${apiUrl}/wp-json/frm/v2/forms/${formId}/fields`);
                if (!response.ok) throw new Error('Failed to load form fields');

                const data = await response.json();
                const sortedFields = Object.values(data)
                    .filter((f: any) =>
                        !['submit', 'hidden', 'user_id', 'captcha'].includes(f.type)
                    )
                    // @ts-ignore
                    .sort((a: any, b: any) => Number(a.field_order) - Number(b.field_order));

                setFields(sortedFields as FieldConfig[]);
            } catch (err) {
                console.error(err);
                setError('Unable to load contact form. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchFields();
    }, [formId, apiUrl]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">

            {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <form action={formAction} className="space-y-6 relative z-10">

                {state.message && (
                    <div className={`p-4 rounded-lg text-sm font-medium animate-fade-in ${state.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {state.message}
                    </div>
                )}

                <div className="space-y-5">
                    {fields.map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.field_key} className="block text-sm font-medium text-slate-300 mb-2">
                                {field.name} {field.required === '1' && <span className="text-cyan-500">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.field_key}
                                    name={field.field_key}
                                    required={field.required === '1'}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-200 placeholder-slate-500 transition-all outline-none resize-none hover:border-slate-600"
                                    placeholder={field.placeholder || ''}
                                ></textarea>
                            ) : field.type === 'select' ? (
                                <select
                                    id={field.field_key}
                                    name={field.field_key}
                                    required={field.required === '1'}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-200 transition-all outline-none hover:border-slate-600"
                                >
                                    <option value="">Select an option</option>
                                    {field.options?.map((opt, idx) => (
                                        <option key={idx} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type === 'phone' ? 'tel' : field.type}
                                    id={field.field_key}
                                    name={field.field_key}
                                    required={field.required === '1'}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-200 placeholder-slate-500 transition-all outline-none hover:border-slate-600"
                                    placeholder={field.placeholder || ''}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                        {isPending ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            "Send Message"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
