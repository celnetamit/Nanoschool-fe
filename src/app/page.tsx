import { getPostBySlug, getProducts, getPagedProducts, getWorkshops } from '@/lib/wordpress';
// import PageTemplate from '@/components/templates/PageTemplate';
import Link from 'next/link';
import Card from '@/components/Card';
import LogoMarquee from '@/components/LogoMarquee';
import TestimonialSlider from '@/components/TestimonialSlider';
import FAQ from '@/components/FAQ';

export default async function Home() {
  // Fetch the specific Home Page
  const post = await getPostBySlug('pages', 'nanoschool-home-v2');

  if (post) {
    // return <PageTemplate post={post} />;
    // Fall through to custom custom design even if post exists
  }

  const courses = await getPagedProducts(6);
  const workshops = await getWorkshops({ perPage: 6 });

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      {/* Hero Section - Professional & Premium */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        {/* Abstract Premium Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4s]"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[7s]"></div>
          {/* Noise Texture for Texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">

          {/* Premium Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-blue-100 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Empowering the Future of Deep Tech</span>
          </div>

          {/* Hero Headline with Modern Gradient */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1] max-w-5xl">
            Master the Science of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
              Tomorrow, Today
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed font-light">
            NanoSchool provides industry-leading certification programs in <span className="text-white font-medium">Artificial Intelligence</span>, <span className="text-white font-medium">Biotechnology</span>, and <span className="text-white font-medium">Nanotechnology</span>. Bridging the gap between academia and industry.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
            <Link href="/course" className="px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
              Explore Courses
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/workshops" className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Join Workshops
            </Link>
          </div>

          {/* Trusted Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/10 pt-12 w-full max-w-5xl">
            {[
              { val: '17+', label: 'Years Legacy' },
              { val: '50K+', label: 'Alumni' },
              { val: '95%', label: 'Placement' },
              { val: '500+', label: 'Partners' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.val}</span>
                <span className="text-slate-400 text-sm uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Section (New) */}
      <LogoMarquee />

      {/* Domain Selection - Modern Cards */}
      <section className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Specialized Tracks</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Choose Your Domain</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Detailed curriculum designed by PhDs and Industry Experts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Artificial Intelligence',
                desc: 'Generative AI, ML, NLP & Computer Vision',
                icon: '🤖',
                color: 'blue',
                href: '/ai'
              },
              {
                title: 'Biotechnology',
                desc: 'Genomics, Drug Discovery & Bioinformatics',
                icon: '🧬',
                color: 'emerald',
                href: '/biotech'
              },
              {
                title: 'Nanotechnology',
                desc: 'Materials Science & Quantum Computing',
                icon: '⚛️',
                color: 'purple',
                href: '/nano-technology'
              }
            ].map((d, i) => (
              <Link key={i} href={d.href} className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 h-full flex flex-col overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${d.color}-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>
                <div className="relative z-10">
                  <span className="text-6xl mb-6 block">{d.icon}</span>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{d.title}</h4>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">{d.desc}</p>
                  <div className={`inline-flex items-center text-${d.color}-600 font-bold group-hover:gap-2 transition-all`}>
                    View Programs <span className="text-xl ml-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Minimal */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Why top universities & companies prefer NanoSchool</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our curriculum is not just theoretical. We focus on industrial application, ensuring that you are ready to contribute to real-world projects from day one.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'PhD Level Mentorship', desc: 'Learn directly from experts with deep research backgrounds.' },
                  { title: 'Live Project Experience', desc: 'Work on actual industry problems, not just toy datasets.' },
                  { title: 'Career Acceleration', desc: 'Dedicated placement support and resume building workshops.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden relative border border-slate-100 shadow-2xl skew-y-3">
                {/* Abstract representation of quality */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl font-black text-slate-900 mb-2">17</div>
                    <div className="text-xl text-slate-500 uppercase tracking-widest">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (New) */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Success Stories</h2>
          <p className="text-lg text-slate-600">Hear from our alumni who are now leading the industry</p>
        </div>
        <TestimonialSlider />
      </section>

      {/* Featured Courses - Premium Grid */}
      {courses.length > 0 && (
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
              {courses.slice(0, 6).map((course) => (
                <Card key={course.id} post={course} type="course" />
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link href="/course" className="inline-block px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">View All Courses</Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Workshops */}
      {workshops.posts.length > 0 && (
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
              {workshops.posts.slice(0, 6).map((workshop) => (
                <Card key={workshop.id} post={workshop} type="workshops" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section (New) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about our programs</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CTA Section - Minimal & Strong */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Ready to define the future?
          </h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join a community of 50,000+ innovators and researchers pushing the boundaries of science and technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us" className="px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
              Get Started Now
            </Link>
            <Link href="/about-us" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
