'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Trophy, 
  Settings2, 
  Building, 
  Sparkles, 
  Award,
  ChevronRight,
  Zap,
  TrendingUp,
  BrainCircuit 
} from 'lucide-react';
import { MentorData } from '@/lib/mentors';
import { ScoringEngine, ScoringWeights, defaultWeights, UserPreferences, ScoreBreakdown } from '@/lib/mentor-recommendation';
import AIComparisonAnalytics from './AIComparisonAnalytics';
import { usePathname } from 'next/navigation';

/**
 * Refined Sublte Radar Chart (120px)
 */
const RadarChart = ({ scores }: { scores: ScoreBreakdown }) => {
  const size = 120;
  const center = size / 2;
  const radius = center - 15;

  const axes = [
    { label: 'Domain', val: scores.domain },
    { label: 'Skills', val: scores.skills },
    { label: 'Exp', val: scores.experience },
    { label: 'Reputation', val: scores.organization },
    { label: 'Quality', val: scores.quality }
  ];

  const getPoint = (idx: number, val: number) => {
    const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
    const r = Math.max(val, 0.1) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = axes.map((a, i) => getPoint(i, a.val));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative w-[120px] h-[120px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity duration-700">
      <svg width={size} height={size} className="overflow-visible">
        {[0.5, 1].map(r => (
          <polygon
            key={r}
            points={axes.map((_, i) => {
              const p = getPoint(i, r);
              return `${p.x},${p.y}`;
            }).join(' ')}
            className="fill-none stroke-white/10"
            strokeWidth="1"
          />
        ))}
        <path
          d={path}
          className="fill-indigo-500/10 stroke-indigo-500/60 transition-all duration-1000 ease-out"
          strokeWidth="1.5"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" className="fill-indigo-400" />
        ))}
      </svg>
    </div>
  );
};

export default function ComparisonDashboard({ mentors }: { mentors: MentorData[] }) {
  const [weights, setWeights] = useState<ScoringWeights>(defaultWeights);
  const [prefs] = useState<UserPreferences>({
    desired_domain: mentors[0].domains[0],
    required_skills: [],
    preferred_location: '',
  });
  const [aiRankings, setAiRankings] = useState<string[] | null>(null);

  const scoringEngine = useMemo(() => new ScoringEngine(weights), [weights]);

  const rankedMentors = useMemo(() => {
    const scored = mentors.map(m => ({
      mentor: m,
      breakdown: scoringEngine.getScore(m, prefs)
    }));

    if (aiRankings) {
      return scored.sort((a, b) => {
        const rankA = aiRankings.indexOf(a.mentor.id);
        const rankB = aiRankings.indexOf(b.mentor.id);
        return (rankA === -1 ? 99 : rankA) - (rankB === -1 ? 99 : rankB);
      });
    }

    return scored.sort((a, b) => b.breakdown.total - a.breakdown.total);
  }, [mentors, prefs, scoringEngine, aiRankings]);

  const handleWeightChange = (key: keyof ScoringWeights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
    // When manually tuning, we should probably clear the AI ranking to let the manual tuning take over
    setAiRankings(null);
  };

  const rowWinners = useMemo(() => ({
    experience: rankedMentors.length > 0 ? rankedMentors.reduce((prev, current) => 
        (parseInt(current.mentor.experience) > parseInt(prev.mentor.experience)) ? current : prev).mentor.id : null,
    rating: rankedMentors.length > 0 ? rankedMentors.reduce((prev, current) => 
        ((current.mentor.mentorship_rating ?? 0) > (prev.mentor.mentorship_rating ?? 0)) ? current : prev).mentor.id : null,
    mentees: rankedMentors.length > 0 ? rankedMentors.reduce((prev, current) => 
        ((current.mentor.total_mentees ?? 0) > (prev.mentor.total_mentees ?? 0)) ? current : prev).mentor.id : null
  }), [rankedMentors]);

  const handleAIWeightsUpdate = (newWeights: Partial<ScoringWeights>) => {
    setWeights(prev => ({ ...prev, ...newWeights }));
  };

  const handleAIAnalysisComplete = (data: { rankings: string[] }) => {
    setAiRankings(data.rankings);
  };

  const handleAIAnalysisStart = () => {
    setAiRankings(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start relative z-20">
      
      {/* Refined Styles */}
      <style jsx global>{`
        .premium-card {
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 18px 36px -18px rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .top-match-glow::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), transparent 70%);
          border-radius: inherit;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      {/* LEFT: Engine Tuning */}
      <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-28">
        <div className="bg-[#0c0e12]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-10">
            <Settings2 size={18} className="text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Engine Tuning</h3>
          </div>

          <div className="space-y-8">
            {(Object.entries(weights) as [keyof ScoringWeights, number][]).map(([key, value]) => (
              <div key={key} className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{key} Weight</span>
                   <span className="text-indigo-400 font-extrabold">{Math.round((value / Object.values(weights).reduce((a, b) => a + b, 0)) * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={value} 
                  onChange={(e) => handleWeightChange(key, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/[0.03] rounded-2xl p-4 border border-white/5">
              <BrainCircuit className="w-5 h-5 text-indigo-400 shrink-0" />
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">Scoring Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Comparison View */}
      <div className="flex-grow space-y-10 min-w-0">
        
        {/* AI Intelligence Block */}
        <AIComparisonAnalytics 
          mentors={mentors} 
          onWeightsUpdate={handleAIWeightsUpdate} 
          onAnalysisComplete={handleAIAnalysisComplete}
          onAnalysisStart={handleAIAnalysisStart}
        />

        {/* REFINED MENTOR CARDS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {rankedMentors.map((item, index) => {
            const isTop = index === 0;
            const m = item.mentor;
            const b = item.breakdown;

            return (
              <div 
                key={m.id} 
                className={`premium-card group relative bg-[#0c0e12]/60 backdrop-blur-2xl border ${isTop ? 'border-indigo-500/20 top-match-glow' : 'border-white/5'} rounded-[2.5rem] p-8 overflow-hidden`}
              >
                {/* Horizontal Header: Identify + Score */}
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-between mb-8 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-5 min-w-0 overflow-hidden">
                       <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shrink-0">
                          <Image src={m.image} alt={m.name} fill sizes="64px" className="object-cover" />
                       </div>
                       <div className="text-center sm:text-left min-w-0">
                          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                             <h4 className="text-white font-black text-xl tracking-tight truncate">{m.name}</h4>
                             {isTop && <Trophy size={16} className="text-indigo-400 shrink-0" />}
                          </div>
                          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest truncate">{m.organization}</p>
                       </div>
                    </div>
                   
                   <div className="text-center sm:text-right shrink-0">
                      <div className={`text-5xl font-black tabular-nums transition-colors ${isTop ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {Math.round(b.total * 100)}<span className="text-xl ml-0.5 opacity-40">%</span>
                      </div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Match Compatibility</div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center">
                   {/* Left: Metadata & Breakdown */}
                   <div className="flex-grow w-full space-y-6 min-w-0">
                      {/* AI Reasoning Strip */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                         <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                         <p className="text-[13px] text-slate-300 font-semibold leading-relaxed">
                            {b.explanation}
                         </p>
                      </div>

                       <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                          {[
                            { label: 'Rating', val: `${m.mentorship_rating}/5`, icon: Award },
                            { label: 'Domain', val: m.domains[0], icon: Zap },
                          ].map(stat => (
                            <div key={stat.label} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex items-center gap-3 min-w-0">
                               <stat.icon size={14} className="text-slate-400 shrink-0" />
                               <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider truncate">{stat.val}</span>
                            </div>
                          ))}
                       </div>
                   </div>

                   {/* Right: Refined Radar Chart */}
                   <div className="shrink-0 flex flex-col items-center gap-4 px-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                      <RadarChart scores={b} />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Score Distribution</span>
                   </div>
                </div>

                <div className="mt-10">
                   <Link 
                      href={`/mentors/${m.id}`}
                      className={`flex items-center justify-between w-full p-5 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${isTop ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/10' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'}`}
                    >
                      <span>Connect with Mentor</span>
                      <ChevronRight size={14} />
                    </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* REFINED TECHNICAL TABLE */}
        <div className="bg-[#0c0e12]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-xl">
           <h3 className="text-xl font-black text-white mb-10 flex items-center gap-4">
              <span className="w-10 h-1 bg-white/10 rounded-full"></span>
              Technical Specification
            </h3>

            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-8 px-8 text-[12px] font-black uppercase tracking-[0.3em] text-slate-500">Metric Matrix</th>
                    {mentors.map(m => (
                      <th key={m.id} className="py-8 px-10">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0 shadow-lg">
                               <Image src={m.image} alt="" width={48} height={48} className="object-cover" />
                            </div>
                            <div>
                               <span className="block text-white font-black text-lg">{m.name.split(' ')[0]}</span>
                               <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-widest">{m.country}</span>
                            </div>
                         </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-bold">
                  {[
                    { label: 'Engineering Depth', icon: BrainCircuit, val: (m: MentorData) => m.experience, highlight: 'experience' },
                    { label: 'Industry Score', icon: Building, val: (m: MentorData) => m.organization },
                    { label: 'Academic Standing', icon: Award, val: (m: MentorData) => `${m.mentorship_rating}/5`, highlight: 'rating' },
                    { label: 'Project Output', icon: TrendingUp, val: (m: MentorData) => `${m.total_mentees} mentees`, highlight: 'mentees' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-7 px-8 flex items-center gap-5">
                        <row.icon size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{row.label}</span>
                      </td>
                      {mentors.map(m => {
                        const isWinner = row.highlight && rowWinners[row.highlight as keyof typeof rowWinners] === m.id;
                        return (
                          <td key={m.id} className="py-7 px-10">
                            <div className="flex items-center gap-3">
                               <span className={`text-[13px] font-black ${isWinner ? 'text-white' : 'text-slate-300'}`}>
                                 {row.val(m)}
                               </span>
                               {isWinner && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

      </div>
    </div>
  );
}
