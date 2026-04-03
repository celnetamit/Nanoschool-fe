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
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 h-full flex flex-col group relative overflow-hidden">
            
            {/* 1. Topic Name at Top (Using 'name' key from API) */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-slate-400">
                    <Bookmark size={10} className="text-blue-500 fill-blue-50" />
                    <span className="text-[8.5px] uppercase tracking-[0.1em]">Student Review Topic</span>
                </div>
                <h4 className="text-[14px] font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                    {workshopName || 'NanoSchool Academic Program'}
                </h4>
            </div>

            {/* 2. Rating */}
            <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={10}
                        className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-100'}`}
                    />
                ))}
            </div>

            {/* 3. The Feedback Message (Compressed) */}
            <div className="flex-grow mb-5 relative">
                <p className="text-[12.5px] font-bold text-slate-500 leading-snug italic border-l border-blue-500/20 pl-3 line-clamp-3">
                    &quot;{comment}&quot;
                </p>
            </div>

            {/* 4. Verified Attribution Footer (Compact) */}
            <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[12.5px] font-black text-slate-900 leading-tight">{name}</span>
                    <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">
                        <span>{date}</span>
                        {time && (
                            <span className="flex items-center gap-1 text-slate-400/60 lowercase">
                                <Clock size={8} />
                                {time}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
