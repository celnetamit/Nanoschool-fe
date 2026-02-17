import React from 'react';

export default function HallOfFameSection() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-blue-100 relative overflow-hidden text-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hall of Fame!</span>
                </h2>
                <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                    Take your research to the next level with NanoSchool.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                            🏆
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Publication Opportunity</h3>
                        <p className="text-sm text-gray-600">Get published in a prestigious open-access journal.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                            🌟
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Centre of Excellence</h3>
                        <p className="text-sm text-gray-600">Become part of an elite research community.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                            🤝
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Networking & Learning</h3>
                        <p className="text-sm text-gray-600">Connect with global researchers and mentors.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                            🌍
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Global Recognition</h3>
                        <p className="text-sm text-gray-600">Worth ₹20,000 / $1,000 in academic value.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
