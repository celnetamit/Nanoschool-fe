import { Star, Clock, Bookmark } from 'lucide-react';

interface ReviewProps {
    name: string;
    date: string;
    time?: string;
    comment: string;
    workshopName?: string;
    rating?: number;
}

export default function ReviewCard({ name, date, time, comment, workshopName, rating = 5 }: ReviewProps) {
    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-500/10 transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
            
            {/* 1. Topic Name at Top (Using 'name' key from API) */}
            <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                    <Bookmark size={12} className="text-blue-500 fill-blue-50 shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">Workshop Topic</span>
                </div>
                <h4 className="text-[14px] font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {workshopName || 'NanoSchool Academic Program'}
                </h4>
            </div>

            {/* 2. Rating */}
            <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={12}
                        className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-100'}`}
                    />
                ))}
            </div>

            {/* 3. The Feedback Message (Compressed) */}
            <div className="flex-grow mb-6 relative">
                <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic border-l-2 border-blue-500/10 pl-4 line-clamp-4">
                    &quot;{comment}&quot;
                </p>
            </div>

            {/* 4. Verified Attribution Footer: Small & Precise */}
            <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] font-black text-slate-900 truncate">{name}</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 truncate">
                        <span>{date}</span>
                        <span className="opacity-30">at</span>
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {time}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
