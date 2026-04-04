'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate?: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    // Calculate time left function (hoisted or redefined)
    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        let target;

        if (targetDate) {
            target = new Date(targetDate).getTime();
        } else {
            // Fallback: 48 hours from now (rolling urgency)
            target = now + 48 * 60 * 60 * 1000;
        }

        const difference = target - now;

        if (difference < 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false
        };
    };

    // Initialize with null to prevent initial hydration mismatch
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isExpired: boolean;
    } | null>(null);

    useEffect(() => {
        // Update immediately on mount to sync
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetDate]);

    // Format with leading zeros
    const format = (num: number) => num.toString().padStart(2, '0');

    // Return null or a skeleton during hydration
    if (!timeLeft) {
        return (
            <div className="flex gap-2 mb-6 p-3 bg-black/20 rounded-xl border border-white/5 animate-pulse">
                <div className="flex-1 h-10 bg-white/5 rounded-lg"></div>
                <div className="flex-1 h-10 bg-white/5 rounded-lg"></div>
                <div className="flex-1 h-10 bg-white/5 rounded-lg"></div>
                <div className="flex-1 h-10 bg-white/5 rounded-lg"></div>
            </div>
        );
    }

    if (timeLeft.isExpired) {
        return (
            <div className="mb-6 p-4 bg-red-900/20 rounded-xl border border-red-500/20 text-center">
                <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Registration Closed</p>
            </div>
        );
    }

    return (
        <div className="flex gap-2 mb-6 p-3 bg-black/20 rounded-xl border border-white/5">
            {timeLeft.days > 0 && (
                <>
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-white font-mono">{format(timeLeft.days)}</div>
                        <div className="text-[8px] text-slate-500 uppercase">Days</div>
                    </div>
                    <div className="text-lg font-thin text-slate-600">:</div>
                </>
            )}
            <div className="text-center flex-1">
                <div className="text-xl font-bold text-white font-mono">{format(timeLeft.hours)}</div>
                <div className="text-[8px] text-slate-500 uppercase">Hrs</div>
            </div>
            <div className="text-lg font-thin text-slate-600">:</div>
            <div className="text-center flex-1">
                <div className="text-xl font-bold text-white font-mono">{format(timeLeft.minutes)}</div>
                <div className="text-[8px] text-slate-500 uppercase">Min</div>
            </div>
            <div className="text-lg font-thin text-slate-600">:</div>
            <div className="text-center flex-1">
                <div className="text-xl font-bold text-red-400 font-mono">{format(timeLeft.seconds)}</div>
                <div className="text-[8px] text-red-900/80 uppercase">Sec</div>
            </div>
        </div>
    );
}
