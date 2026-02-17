"use client";

import React from "react";
import { Atom, Orbit, Zap } from "lucide-react";

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                {/* Outer Orbit */}
                <div className="absolute animate-[spin_3s_linear_infinite]">
                    <Orbit className="w-24 h-24 text-blue-200 opacity-50" strokeWidth={1} />
                </div>

                {/* Middle Orbit (Reverse) */}
                <div className="absolute animate-[spin_4s_linear_infinite_reverse]">
                    <Atom className="w-16 h-16 text-indigo-400 opacity-70" strokeWidth={1.5} />
                </div>

                {/* Central Core */}
                <div className="relative z-10 bg-white p-2 rounded-full shadow-lg shadow-blue-500/20 animate-pulse">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-full">
                        <Zap className="w-6 h-6 text-white" fill="currentColor" />
                    </div>
                </div>

                {/* Particle Effects (Simulated with absolute divs) */}
                <div className="absolute w-32 h-32 border border-blue-100 rounded-full animate-ping opacity-20"></div>
                <div className="absolute w-24 h-24 border border-indigo-100 rounded-full animate-ping opacity-30 delay-75"></div>
            </div>

            <div className="mt-8 flex flex-col items-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                    Initializing...
                </h2>
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                </div>
                <p className="text-gray-400 text-sm font-medium">Preparing NanoSchool Environment</p>
            </div>
        </div>
    );
}
