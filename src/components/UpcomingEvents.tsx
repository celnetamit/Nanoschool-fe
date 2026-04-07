'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowUpRight, 
  ExternalLink, 
  Tag, 
  MapPin, 
  Clock,
  Sparkles
} from 'lucide-react';
import { UpcomingEvent } from '@/lib/events';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              <Sparkles className="w-3 h-3" />
              Latest Training Programs
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Upcoming Events & <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Specialized Workshops
              </span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Enhance your biotechnology career with our upcoming certifications and hands-on industrial projects. 
            </p>
          </div>
          
          <Link 
            href="/workshops" 
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Explore Workshop Calendar
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              {/* Image / Header */}
              <div className="relative h-48 mb-6 rounded-2xl overflow-hidden bg-gray-100">
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-blue-500/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border border-white/50">
                    <Tag className="w-3 h-3 text-blue-600" />
                    {event.category}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                {event.title}
              </h3>

              <div className="space-y-3 mb-8 text-sm text-gray-500">
                 <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-blue-500" />
                   <span>Year: {event.year || 'Latest Session'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-blue-500" />
                   <span>NanoSchool Center / Online</span>
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                <Link 
                  href={`/workshops/${event.slug}`} 
                  className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                > 
                  Details
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link 
                  href={event.registerLink} 
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                >
                  Register
                </Link>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
