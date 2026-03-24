import { getPagedProducts } from '@/lib/wordpress';
import Link from 'next/link';
import Card from '@/components/Card';

export default async function FeaturedCourses() {
  const courses = await getPagedProducts(6);

  if (!courses || courses.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Flagship Certification Programs
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Intensive, industry-recognized courses designed to fast-track your career.
            </p>
          </div>
          <Link href="/course" className="hidden md:inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors">
            View Full Catalog <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 6).map((course: any) => (
            <Card key={course.id} post={course} type="course" />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/course" className="inline-block px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">View All Courses</Link>
        </div>
      </div>
    </section>
  );
}
