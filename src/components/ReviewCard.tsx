import { Star, User } from 'lucide-react';

interface ReviewProps {
    name: string;
    date: string;
    comment: string;
    rating?: number;
}

export default function ReviewCard({ name, date, comment, rating = 5 }: ReviewProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <User size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{name}</h4>
                        <p className="text-xs text-slate-500">{date}</p>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-100'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="relative flex-grow">
                <svg className="absolute -top-2 -left-2 w-8 h-8 text-blue-100 opacity-50 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
                </svg>
                <p className="text-slate-600 text-sm leading-relaxed italic relative z-10 pl-2">
                    &quot;{comment}&quot;
                </p>
            </div>
        </div>
    );
}
