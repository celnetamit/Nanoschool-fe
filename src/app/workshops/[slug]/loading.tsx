export default function Loading() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Animated Skeleton Hero */}
            <div className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden bg-slate-900">
                <div className="absolute inset-0 animate-pulse bg-slate-800"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-24">
                    <div className="flex flex-col md:flex-row gap-12 items-end">
                        <div className="flex-grow max-w-4xl space-y-8">
                            {/* Breadcrumb Skeleton */}
                            <div className="h-4 w-64 bg-slate-700 rounded-full animate-pulse"></div>

                            {/* Title Skeleton */}
                            <div className="space-y-3">
                                <div className="h-14 md:h-20 w-3/4 bg-slate-700 rounded-2xl animate-pulse"></div>
                                <div className="h-14 md:h-20 w-1/2 bg-slate-700 rounded-2xl animate-pulse delay-75"></div>
                            </div>

                            {/* Info Bar Skeleton */}
                            <div className="flex gap-4 p-3 bg-white/5 border border-white/10 rounded-2xl w-full max-w-xl">
                                <div className="h-12 w-12 bg-slate-700 rounded-xl animate-pulse"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 w-16 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                                </div>
                                <div className="h-12 w-px bg-slate-700"></div>
                                <div className="h-12 w-12 bg-slate-700 rounded-xl animate-pulse"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 w-16 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skeleton Content */}
            <div className="max-w-7xl mx-auto px-4 relative -mt-20 z-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-gray-100 space-y-6">
                            <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 h-96 relative overflow-hidden">
                            <div className="absolute inset-0 animate-pulse bg-gray-50/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
