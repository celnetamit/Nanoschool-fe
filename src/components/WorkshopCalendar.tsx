'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { WordPressPost, Category } from '@/lib/wordpress';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface WorkshopCalendarProps {
    workshops: WordPressPost[];
    categories: Category[];
}

export default function WorkshopCalendar({ workshops, categories }: WorkshopCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Category color mapping
    const categoryColors: Record<number, { bg: string, border: string, text: string, light: string, name: string }> = {
        5088: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-700', light: 'bg-blue-50', name: 'AI' },
        5059: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50', name: 'Biotech' },
        5085: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-700', light: 'bg-purple-50', name: 'Nanotech' },
    };

    // Helper to get workshop category
    const getWorkshopCategory = (workshop: WordPressPost) => {
        const terms = workshop._embedded?.['wp:term']?.[0] || [];
        for (const term of terms) {
            if (categoryColors[term.id]) {
                return categoryColors[term.id];
            }
        }
        return null;
    };

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getWorkshopsForDate = (day: number) => {
        return workshops.filter((w) => {
            const wDate = new Date(w.date);
            return (
                wDate.getDate() === day &&
                wDate.getMonth() === currentDate.getMonth() &&
                wDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    // Stats
    const upcomingWorkshops = workshops.filter(w => new Date(w.date) >= new Date());
    const thisMonthWorkshops = workshops.filter(w => {
        const wDate = new Date(w.date);
        return wDate.getMonth() === currentDate.getMonth() && wDate.getFullYear() === currentDate.getFullYear();
    });

    const categoryStats = useMemo(() => {
        return Object.entries(categoryColors).map(([id, info]) => {
            const count = workshops.filter(w => {
                const terms = w._embedded?.['wp:term']?.[0] || [];
                return terms.some((t: any) => t.id === parseInt(id));
            }).length;
            return { ...info, count };
        });
    }, [workshops]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-xl shadow-blue-600/20">
                        <CalendarIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Workshop Calendar
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore upcoming training sessions across AI, Biotechnology, and Nanotechnology
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">This Month</div>
                        <div className="text-4xl font-extrabold text-gray-900">{thisMonthWorkshops.length}</div>
                        <div className="text-sm text-gray-500 mt-1">Workshops</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Upcoming</div>
                        <div className="text-4xl font-extrabold text-blue-600">{upcomingWorkshops.length}</div>
                        <div className="text-sm text-gray-500 mt-1">Total</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">All Time</div>
                        <div className="text-4xl font-extrabold text-purple-600">{workshops.length}</div>
                        <div className="text-sm text-gray-500 mt-1">Workshops</div>
                    </div>
                </div>

                {/* Calendar Container */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-extrabold text-white">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={prevMonth}
                                    className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all text-white shadow-lg hover:scale-105"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={goToToday}
                                    className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:scale-105"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all text-white shadow-lg hover:scale-105"
                                    aria-label="Next month"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                            <div key={day} className="py-4 text-center">
                                <div className="hidden md:block text-sm font-bold text-gray-700 uppercase tracking-wider">{day}</div>
                                <div className="md:hidden text-sm font-bold text-gray-700 uppercase tracking-wider">{day.slice(0, 3)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-gray-100">
                        {/* Empty Previous Days */}
                        {Array.from({ length: firstDay }).map((_, index) => (
                            <div key={`prev-${index}`} className="bg-gray-50 min-h-[120px] md:min-h-[140px]" />
                        ))}

                        {/* Current Month Days */}
                        {Array.from({ length: days }).map((_, index) => {
                            const day = index + 1;
                            const dayWorkshops = getWorkshopsForDate(day);
                            const isToday =
                                day === new Date().getDate() &&
                                currentDate.getMonth() === new Date().getMonth() &&
                                currentDate.getFullYear() === new Date().getFullYear();

                            return (
                                <div
                                    key={day}
                                    className={`bg-white min-h-[120px] md:min-h-[140px] p-2 md:p-3 transition-all hover:bg-blue-50/30 cursor-pointer hover:shadow-lg relative group ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                                        }`}
                                >
                                    <div className={`text-right mb-2 font-mono text-sm md:text-base ${isToday
                                            ? 'font-bold text-white bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center ml-auto'
                                            : 'text-gray-500 font-semibold'
                                        }`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1">
                                        {dayWorkshops.slice(0, 2).map((w) => {
                                            const catInfo = getWorkshopCategory(w);
                                            return (
                                                <Link
                                                    key={w.id}
                                                    href={`/workshops/${w.slug}`}
                                                    className={`block text-xs md:text-sm p-1.5 md:p-2 rounded-lg font-medium truncate border-l-4 transition-all hover:scale-105 shadow-sm ${catInfo
                                                            ? `${catInfo.light} ${catInfo.text} ${catInfo.border} hover:shadow-md`
                                                            : 'bg-gray-100 text-gray-700 border-gray-400 hover:bg-gray-200'
                                                        }`}
                                                    title={w.title.rendered}
                                                >
                                                    <span className="hidden md:inline">{w.title.rendered}</span>
                                                    <span className="md:hidden">Workshop</span>
                                                </Link>
                                            );
                                        })}
                                        {dayWorkshops.length > 2 && (
                                            <div className="text-xs text-center font-bold text-blue-600 py-1 bg-blue-50 rounded">
                                                +{dayWorkshops.length - 2} more
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover tooltip for mobile */}
                                    {dayWorkshops.length > 0 && (
                                        <div className="absolute bottom-1 right-1">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Workshop Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {categoryStats.map((cat, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded ${cat.bg} flex-shrink-0`}></div>
                                <span className="font-semibold text-gray-700">{cat.name}</span>
                                <span className="ml-auto text-sm font-bold text-gray-500">({cat.count})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
