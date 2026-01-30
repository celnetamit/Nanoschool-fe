export default function Loading() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Animated Skeleton Hero */}
            <div className="relative w-full h-[50vh] overflow-hidden bg-slate-900">
                <div className="absolute inset-0 animate-pulse bg-slate-800"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-24">
                    <div className="h-14 md:h-20 w-1/2 bg-slate-700 rounded-2xl animate-pulse delay-75"></div>
                </div>
            </div>

            {/* Skeleton Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 w-full bg-gray-100 rounded-xl animate-pulse mt-8"></div>
            </div>
        </div>
    );
}
