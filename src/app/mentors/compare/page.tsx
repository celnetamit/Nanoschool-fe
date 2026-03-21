import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, GitCompare, MapPin, Building, Calendar, Sparkles, Check, X } from 'lucide-react';
import { getMentorById } from '@/lib/mentors';

export const metadata = {
  title: 'Compare Mentors | NanoSchool',
  description: 'Compare mentors side by side to find the right one for your needs.',
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const resolvedParams = await searchParams;
  const idsParam = resolvedParams.ids || '';
  const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);

  if (ids.length < 2) {
    notFound();
  }

  // Fetch all mentors in parallel
  const mentors = (await Promise.all(ids.map(id => getMentorById(id)))).filter(Boolean) as NonNullable<Awaited<ReturnType<typeof getMentorById>>>[];

  if (mentors.length < 2) {
    notFound();
  }

  // Collect all unique skills for the skill comparison table
  const allSkillsSet = new Set<string>();
  mentors.forEach(m => m.skills.forEach(s => allSkillsSet.add(s)));
  const allSkills = Array.from(allSkillsSet).sort();

  const rowClass = 'border-b border-white/5 last:border-0';
  const cellClass = 'py-5 px-6 text-sm font-medium text-slate-300 text-center';
  const labelClass = 'py-5 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-left whitespace-nowrap w-[140px] shrink-0';

  return (
    <div className="min-h-screen bg-[#05070a] pb-32 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[30%] w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 container max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <Link href="/mentors" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-bold uppercase tracking-wider mb-4 transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Directory
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
                <GitCompare className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Mentor Comparison</h1>
                <p className="text-slate-500 text-sm font-medium">Comparing {mentors.length} mentors side by side</p>
              </div>
            </div>
          </div>
          <Link href="/mentors" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 rounded-2xl font-bold text-sm transition-all">
            Add More Mentors
          </Link>
        </div>

        {/* Compare Table */}
        <div className="bg-[#111418] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-white/5">
                  {/* Empty corner */}
                  <th className="py-8 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[140px] bg-white/[0.01]">
                    Attribute
                  </th>
                  {mentors.map(mentor => (
                    <th key={mentor.id} className="py-6 px-6 text-center">
                      <div className="flex flex-col items-center gap-4">
                        {/* Avatar */}
                        <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-white/10 bg-black shadow-xl">
                          <Image src={mentor.image} alt={mentor.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-extrabold text-sm leading-tight mb-1">{mentor.name}</p>
                          <p className="text-indigo-400 text-[11px] font-bold uppercase tracking-wider">{mentor.designation || 'Mentor'}</p>
                        </div>
                        {/* View Profile link */}
                        <Link href={`/mentors/${mentor.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                          View Profile
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Organization */}
                <tr className={rowClass}>
                  <td className={labelClass}><Building className="w-4 h-4 inline mr-2 opacity-60" />Organization</td>
                  {mentors.map(m => (
                    <td key={m.id} className={cellClass}>{m.organization || <span className="text-slate-600 italic">—</span>}</td>
                  ))}
                </tr>

                {/* Location */}
                <tr className={`${rowClass} bg-white/[0.01]`}>
                  <td className={labelClass}><MapPin className="w-4 h-4 inline mr-2 opacity-60" />Location</td>
                  {mentors.map(m => (
                    <td key={m.id} className={cellClass}>{m.country || <span className="text-slate-600 italic">—</span>}</td>
                  ))}
                </tr>

                {/* Domain */}
                <tr className={rowClass}>
                  <td className={labelClass}><Sparkles className="w-4 h-4 inline mr-2 opacity-60" />Domain</td>
                  {mentors.map(m => (
                    <td key={m.id} className={cellClass}>{m.domains[0] || <span className="text-slate-600 italic">—</span>}</td>
                  ))}
                </tr>

                {/* Experience */}
                <tr className={`${rowClass} bg-white/[0.01]`}>
                  <td className={labelClass}><Calendar className="w-4 h-4 inline mr-2 opacity-60" />Experience</td>
                  {mentors.map(m => (
                    <td key={m.id} className={cellClass}>{m.experience || <span className="text-slate-600 italic">—</span>}</td>
                  ))}
                </tr>

                {/* Skills header */}
                {allSkills.length > 0 && (
                  <tr className="bg-white/[0.02]">
                    <td colSpan={mentors.length + 1} className="py-4 px-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">— Skills Comparison —</span>
                    </td>
                  </tr>
                )}

                {/* Skill rows */}
                {allSkills.map((skill, i) => (
                  <tr key={skill} className={`${rowClass} ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <td className={`${labelClass} font-medium normal-case tracking-normal text-slate-400 text-[12px]`}>{skill}</td>
                    {mentors.map(m => (
                      <td key={m.id} className={`${cellClass} !py-3`}>
                        {m.skills.includes(skill) ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto">
                            <Check className="w-4 h-4 text-emerald-400" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.02] border border-white/5 mx-auto">
                            <X className="w-3.5 h-3.5 text-slate-700" />
                          </span>
                        )}
                      </td>
                    ))}
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
