import { getWorkshops } from '@/lib/wordpress';
import Card from '@/components/Card';

export default async function FeaturedWorkshops() {
  const workshopData = await getWorkshops({ perPage: 6 });
  const workshops = workshopData?.posts || [];

  if (workshops.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Upcoming Workshops
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Short-term, high-impact learning sessions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.slice(0, 6).map((workshop: any) => (
            <Card key={workshop.id} post={workshop} type="workshops" />
          ))}
        </div>
      </div>
    </section>
  );
}
