'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Loader2, Zap, Quote } from 'lucide-react';
import { MentorData } from '@/lib/mentors';
import { ScoringWeights } from '@/lib/mentor-recommendation';

interface AIComparisonAnalyticsProps {
  mentors: MentorData[];
  onWeightsUpdate?: (weights: Partial<ScoringWeights>) => void;
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (data: { rankings: string[], justification: string, weights: ScoringWeights }) => void;
}

export default function AIComparisonAnalytics({ 
  mentors, 
  onWeightsUpdate,
  onAnalysisStart, 
  onAnalysisComplete 
}: AIComparisonAnalyticsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justification, setJustification] = useState<string | null>(null);

  const generateAnalysis = async () => {
    onAnalysisStart?.();
    setLoading(true);
    setError(null);
    setJustification(null);
    
    let rawText = '';
    
    try {
      const response = await fetch('/api/ai/compare-mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentors }),
      });

      if (!response.ok) throw new Error('Failed to generate analysis');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('Failed to read response stream');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        rawText += chunk;
        
        // Attempt to parse if we have a complete JSON block
        try {
          const data = JSON.parse(rawText);
          if (data.justification) {
            setJustification(data.justification);
          }
          if (data.rankings && data.weights) {
             onWeightsUpdate?.(data.weights);
             onAnalysisComplete?.(data);
          }
        } catch (e) {
          // Partial JSON, continue reading
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12 relative h-full">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-blue-600/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-50"></div>
      
      <div className="relative h-full bg-[#0c0e12]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        {/* Header Ribbon */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
               <BrainCircuit size={18} />
            </div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">AI Intelligence Node</h3>
          </div>
        </div>

        <div className="p-8 md:p-12 flex-grow flex flex-col justify-center items-center">
          {(!justification && !loading) ? (
            <div className="flex flex-col items-center text-center py-6">
               <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 animate-pulse">
                  <Sparkles size={40} />
               </div>
               <h4 className="text-2xl font-black text-white tracking-tight mb-3">Initialize Deep Pattern Analysis?</h4>
               <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-medium italic">
                 "Directly influence the ranking results through qualitative career path modeling."
               </p>
               <button 
                 onClick={generateAnalysis}
                 className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center gap-3 group"
               >
                  <Zap size={16} className="fill-current group-hover:animate-bounce" />
                  Run Intelligence Scan
               </button>
            </div>
          ) : loading && !justification ? (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-8">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin stroke-[1.5]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={20} className="text-amber-400 animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2 text-center">
                    <p className="text-lg font-black text-white tracking-tight animate-pulse uppercase tracking-[0.1em]">Synthesizing Mentorship Data...</p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Optimizing Strategic Winner</p>
                </div>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
                <p className="text-rose-400 text-sm font-bold">{error}</p>
                <button onClick={generateAnalysis} className="mt-4 text-[10px] font-black uppercase text-white hover:underline">Retry Connection</button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000 w-full">
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-grow bg-white/5"></div>
                  <div className="flex items-center gap-2 text-amber-500">
                     <Sparkles size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Winner's Verdict</span>
                  </div>
                  <div className="h-px flex-grow bg-white/5"></div>
               </div>
               
               <div className="relative bg-white/[0.02] rounded-3xl p-10 border border-white/5 overflow-hidden">
                  <Quote size={60} className="absolute -top-2 -left-2 text-white/5 pointer-events-none" />
                  <p className="text-xl md:text-2xl font-black text-slate-100 leading-snug tracking-tight mb-0 relative z-10 italic">
                    {justification}
                  </p>
               </div>
               
               <div className="mt-8 flex items-center justify-center">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">AI-Driven Sort Active</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
