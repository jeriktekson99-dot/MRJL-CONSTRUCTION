import React from 'react';
import { TESTIMONIALS } from '../data/siteData';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white text-zinc-900 relative overflow-hidden border-t border-zinc-200">
      {/* Subtle blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
              Client Endorsements
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 whitespace-nowrap">
            Client Stories of Proven Excellence
          </h2>
          <p className="mt-4 font-body text-base sm:text-lg text-zinc-600">
            Hear directly from estate owners, commercial executives, and property investors who entrusted their visions to MRJL Construction Corporation.
          </p>
        </div>

        {/* 3-Column Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-black p-[1px] clip-angled-corner shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="bg-white clip-angled-corner flex flex-col justify-between relative overflow-hidden h-full flex-1">
                {/* Top Deep Blue Bar */}
                <div className="h-1.5 bg-[#003399] group-hover:bg-[#FF5500] transition-colors w-full shrink-0" />

                <div className="p-8 flex-1 flex flex-col justify-between relative">
                  {/* Quote Icon Background Accent */}
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-zinc-100 pointer-events-none" />

                  <div>
                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FF5500] text-[#FF5500]" />
                      ))}
                    </div>

                    {/* Full Feedback */}
                    <p className="font-body text-[15px] text-zinc-600 leading-relaxed mb-8">
                      {review.fullFeedback}
                    </p>
                  </div>

                  {/* Client Info Footer */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center gap-3.5">
                    <img
                      src={review.avatarUrl}
                      alt={review.clientName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#003399]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-display text-sm font-bold text-zinc-900">
                        {review.clientName}
                      </h4>
                      <div className="text-[12px] text-[#003399] font-semibold mt-0.5">
                        {review.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
