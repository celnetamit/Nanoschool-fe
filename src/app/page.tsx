import { getPostBySlug, getCourses, getWorkshops } from '@/lib/wordpress';
// import PageTemplate from '@/components/templates/PageTemplate';
import Link from 'next/link';
import Card from '@/components/Card';

export default async function Home() {
  // Fetch the specific Home Page
  const post = await getPostBySlug('pages', 'nanoschool-home-v2');

  if (post) {
    // return <PageTemplate post={post} />;
    // Fall through to custom custom design even if post exists
  }

  const courses = await getCourses();
  const workshops = await getWorkshops({ perPage: 6 });

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] -top-40 -left-40 animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] top-1/3 right-0 animate-pulse animation-delay-2000"></div>
          <div className="absolute w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] bottom-0 right-1/4 animate-pulse animation-delay-4000"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 text-sm font-bold mb-10 border border-white/20 shadow-lg">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              17 Years of Excellence in Deep-Tech Education
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              Transform Your Career in
              <span className="block mt-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                AI & Deep Science
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              Join India&apos;s premier learning platform for <strong className="text-white font-semibold">Artificial Intelligence</strong>,
              <strong className="text-white font-semibold">Biotechnology</strong>, and <strong className="text-white font-semibold">Nanotechnology</strong>.
              <br className="hidden md:block" />
              Industry-recognized certifications, expert mentors, hands-on projects.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
              <Link href="/workshops" className="group px-10 py-5 bg-white text-blue-900 font-bold text-lg rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-blue-500/40 hover:scale-105 inline-flex items-center justify-center gap-3">
                Browse Workshops
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/course" className="px-10 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/50 text-white font-bold text-lg rounded-full hover:bg-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-3">
                View Courses
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {[
                { number: '17+', label: 'Years Excellence', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
                { number: '50K+', label: 'Students Trained', icon: '👨‍🎓', color: 'from-blue-500 to-cyan-500' },
                { number: '500+', label: 'Industry Partners', icon: '🤝', color: 'from-green-500 to-emerald-500' },
                { number: '95%', label: 'Placement Rate', icon: '🚀', color: 'from-purple-500 to-pink-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-7 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 group">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${stat.color.includes('yellow') ? '#f59e0b, #f97316' : stat.color.includes('blue') ? '#3b82f6, #06b6d4' : stat.color.includes('green') ? '#22c55e, #10b981' : '#a855f7, #ec4899'})` }}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-blue-100 font-medium tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Domain Cards Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-bold mb-4">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              CHOOSE YOUR PATH
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Explore Our Domains
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Industry-leading programs designed to make you job-ready in cutting-edge technologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Artificial Intelligence',
                description: 'Master machine learning, deep learning, NLP, computer vision and generative AI with hands-on projects from industry experts.',
                icon: '🤖',
                gradient: 'from-blue-500 to-indigo-600',
                bgGradient: 'from-blue-50 to-indigo-50',
                href: '/ai',
                stats: ['100+ Courses', '50+ Mentors', '10K+ Students'],
              },
              {
                title: 'Biotechnology',
                description: 'Dive into genetic engineering, bioinformatics, drug discovery and molecular biology innovations with research-focused curriculum.',
                icon: '🧬',
                gradient: 'from-emerald-500 to-teal-600',
                bgGradient: 'from-emerald-50 to-teal-50',
                href: '/biotech',
                stats: ['80+ Courses', '40+ Mentors', '8K+ Students'],
              },
              {
                title: 'Nanotechnology',
                description: 'Explore nanomaterials, quantum dots, molecular engineering and cutting-edge nanotech applications with virtual lab access.',
                icon: '⚛️',
                gradient: 'from-purple-500 to-pink-600',
                bgGradient: 'from-purple-50 to-pink-50',
                href: '/nano-technology',
                stats: ['60+ Courses', '30+ Mentors', '5K+ Students'],
              },
            ].map((domain, index) => (
              <Link key={index} href={domain.href} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${domain.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative p-10">
                  {/* Icon */}
                  <div className="text-8xl mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    {domain.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-extrabold mb-4 bg-gradient-to-r ${domain.gradient} bg-clip-text text-transparent`}>
                    {domain.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-base">
                    {domain.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {domain.stats.map((stat, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 group-hover:bg-white rounded-full text-xs font-semibold text-gray-700 shadow-sm transition-all">
                        {stat}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className={`flex items-center gap-2 font-bold text-${domain.gradient.split(' ')[1]}-600 group-hover:gap-3 transition-all`}>
                    Explore Programs
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${domain.gradient} opacity-10 rounded-bl-full transform translate-x-20 -translate-y-20 group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-500`}></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-bold mb-4">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              WHY NANOSCHOOL
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Learn from the Best
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              17 years of excellence in providing world-class technical education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '👨‍🏫', title: 'Expert Mentors', description: 'Learn from PhDs and industry veterans with 10+ years of experience', color: 'from-blue-500 to-indigo-500' },
              { icon: '🎯', title: 'Hands-on Projects', description: 'Build real-world projects with industry-standard tools and technologies', color: 'from-emerald-500 to-teal-500' },
              { icon: '🏆', title: 'Industry Recognition', description: 'Certificates valued by top tech companies and research institutions worldwide', color: 'from-purple-500 to-pink-500' },
              { icon: '🚀', title: '95% Placement', description: 'Dedicated career support with interview prep and job placement assistance', color: 'from-orange-500 to-red-500' },
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:shadow-xl border border-gray-100 group">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Professional Certification Programs
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Industry-recognized courses designed to accelerate your career in emerging technologies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course) => (
                <Card key={course.id} post={course} type="course" />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/course" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                View All Courses
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Workshops */}
      {workshops.posts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Hands-On Workshops
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Interactive learning experiences to build practical skills and real-world projects
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.posts.slice(0, 6).map((workshop) => (
                <Card key={workshop.id} post={workshop} type="workshops" />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/workshops" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                View All Workshops
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[400px] h-[400px] bg-white rounded-full blur-[100px] top-0 left-0 animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] bg-white rounded-full blur-[120px] bottom-0 right-0 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join 50,000+ students who&apos;ve already advanced their careers with NanoSchool&apos;s industry-recognized programs
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/workshops" className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 inline-flex items-center justify-center gap-3">
              Start Learning Today
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/contact-us" className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/20 hover:border-white transition-all inline-flex items-center justify-center gap-3">
              Talk to an Expert
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <p className="text-blue-100 text-sm font-bold tracking-wider mb-8 uppercase">Trusted by leading institutions</p>
            <div className="flex flex-wrap justify-center gap-6 opacity-70">
              {['IIT', 'NIT', 'BITS', 'AIIMS', 'DRDO'].map((org) => (
                <div key={org} className="px-8 py-4 bg-white/10 rounded-xl backdrop-blur-sm shadow-lg">
                  <span className="text-white font-extrabold text-lg tracking-wide">{org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-2xl font-bold">NanoSchool</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering the next generation with cutting-edge education in AI, Biotechnology, and Nanotechnology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-blue-500 pb-2">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span>Home</Link></li>
                <li><Link href="/about-us" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span>About Us</Link></li>
                <li><Link href="/course" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span>Courses</Link></li>
                <li><Link href="/workshops" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span>Workshops</Link></li>
                <li><Link href="/corporate" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span>Corporate</Link></li>
              </ul>
            </div>

            {/* Domains */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-emerald-500 pb-2">Domains</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/ai" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span>Artificial Intelligence</Link></li>
                <li><Link href="/biotech" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span>Biotechnology</Link></li>
                <li><Link href="/nano-technology" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span>Nanotechnology</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white relative after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-purple-500 pb-2">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-xl">📧</span>
                  <span>info@nanoschool.in</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 NanoSchool. All rights reserved.</p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
