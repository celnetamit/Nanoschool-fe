'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, PlayCircle } from 'lucide-react';

interface Module {
    title: string;
    content: string;
}

interface InternshipCurriculumProps {
    overview: string;
    modules: Module[];
}

export default function InternshipCurriculum({ overview, modules }: InternshipCurriculumProps) {
    return (
        <div className="space-y-16">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <BookOpen size={20} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Program Overview</h2>
                </div>
                
                <div 
                    className="wordpress-content prose prose-lg prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-black 
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-strong:text-slate-900 prose-li:text-slate-600
                    prose-hr:border-slate-100"
                    dangerouslySetInnerHTML={{ __html: overview }}
                />
            </section>

            {/* Curriculum Section (Only if modules exist) */}
            {modules.length > 0 && (
                <section id="curriculum" className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <PlayCircle size={20} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Structured Curriculum</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <CurriculumAccordion key={index} module={module} index={index} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function CurriculumAccordion({ module, index }: { module: Module, index: number }) {
    const [isOpen, setIsOpen] = useState(index === 0); // Open first by default

    return (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-teal-200 hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isOpen ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                    </div>
                    <span className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{module.title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                )}
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6 pt-0 border-t border-slate-50">
                    <div 
                        className="prose prose-sm prose-slate max-w-none pt-4 text-slate-600 
                        prose-headings:text-slate-900 prose-headings:font-bold
                        prose-p:leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: module.content }} 
                    />
                </div>
            </div>
        </div>
    );
}
