export default function CardSkeletonGrid({ count = 3, bgClass = 'bg-slate-50' }: { count?: number, bgClass?: string }) {
  return (
    <section className={`py-24 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse mb-16 max-w-2xl text-center md:text-left mx-auto md:mx-0">
          <div className="h-10 bg-slate-200 rounded-lg w-3/4 mb-4 mx-auto md:mx-0"></div>
          <div className="h-6 bg-slate-100 rounded-lg w-1/2 mx-auto md:mx-0"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col items-center bg-white rounded-2xl border border-slate-100 p-6 shadow-sm min-h-[400px]">
              <div className="w-full aspect-video bg-slate-100/80 rounded-xl mb-6"></div>
              <div className="w-full h-8 bg-slate-200/50 rounded w-full mb-4"></div>
              <div className="w-full h-4 bg-slate-100 rounded w-5/6 mb-4"></div>
              <div className="w-full h-10 bg-slate-100/80 rounded-xl w-full mt-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
