'use client';

import { Users, GraduationCap, Award, BookOpen } from 'lucide-react';

interface StatsProps {
  stats?: {
    students?: string;
    publications?: string;
    rating?: string;
    domainScore?: string;
  };
}

export default function MentorStats({ stats }: StatsProps) {
  if (!stats) return null;

  const statItems = [
    stats.students && { 
      label: 'Students Mentored', 
      value: stats.students, 
      icon: Users, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/5'
    },
    stats.publications && { 
      label: 'Academic Citations', 
      value: stats.publications, 
      icon: Award, 
      color: 'text-amber-400',
      bg: 'bg-amber-400/5'
    },
    stats.domainScore && { 
      label: 'Project Success', 
      value: stats.domainScore, 
      icon: BookOpen, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/5'
    },
    stats.rating && { 
      label: 'Global Rating', 
      value: `${stats.rating}/5`, 
      icon: GraduationCap, 
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/5'
    },
  ].filter(Boolean) as any[];

  if (statItems.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.06] hover:scale-[1.02] group"
        >
          <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
            <stat.icon size={20} />
          </div>
          <p className="text-2xl font-black text-white mb-0.5 tracking-tight">{stat.value}</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
