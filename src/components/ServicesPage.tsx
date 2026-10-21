import React from 'react';
import { SERVICES_DATA, SERVICES_HERO_IMAGE } from '../data/siteData';
import { ServiceItem } from '../types';
import { ContactFooter } from './ContactFooter';
import { Check } from 'lucide-react';

interface ServicesPageProps {
  onSelectService: (service: ServiceItem) => void;
  onContactClick: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onSelectService,
  onContactClick,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section for Services Page */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#111111] text-white overflow-hidden border-b border-zinc-800">
        {/* Background Grayscale Architectural Image matching About page styling */}
        <div className="absolute inset-0 z-0">
          <img
            src={SERVICES_HERO_IMAGE}
            alt="MRJL Services Architectural Structure"
            className="w-full h-full object-cover object-center grayscale opacity-20 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Fade gradient: dark/solid on the left fading toward the image on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-[#111111]/30 pointer-events-none" />
          {/* Top/bottom smooth fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#111111] pointer-events-none" />
        </div>

        {/* Subtle blueprint grid background */}
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="shiny-text-silver">Our</span> <span className="text-[#FF5500]">Services</span>
          </h1>
        </div>
      </section>

      {/* 2. Main Content: 6 Alternating Blocks (Block 1 and Block 2 layout) */}
      <div>
        {SERVICES_DATA.map((service, index) => {
          const isEven = index % 2 === 1; // 0 is odd (block 1 format), 1 is even (block 2 format)

          if (!isEven) {
            {/* ODD BLOCKS (1, 3, 5) - White Background, Image on Left, Content on Right */}
            return (
              <section
                key={service.id}
                id={service.id}
                className="py-20 sm:py-24 bg-white text-zinc-900 relative overflow-hidden border-t border-zinc-200 scroll-mt-24 sm:scroll-mt-28"
              >
                {/* Subtle blueprint grid background */}
                <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Image in Angled Frame */}
                    <div className="lg:col-span-6 relative">
                      <div className="relative mx-auto max-w-md lg:max-w-none">
                        
                        {/* Outer decorative geometric corner */}
                        <div className="absolute -top-4 -left-4 w-full h-full p-[2.8px] bg-[#003399]/60 clip-angled-corner pointer-events-none">
                          <div className="w-full h-full bg-white clip-angled-corner" />
                        </div>
                        
                        {/* Image Container with Angled Cut */}
                        <div className="relative p-[4px] bg-black clip-angled-corner shadow-2xl">
                          <div className="relative overflow-hidden clip-angled-corner bg-zinc-900">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="w-full h-[360px] sm:h-[400px] lg:h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Right Content - Natural spacing without awkward gaps */}
                    <div className="lg:col-span-6 space-y-6">
                      <div>
                        <div className="inline-flex items-center gap-2.5 mb-3">
                          <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                            {service.title}
                          </span>
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
                          {service.title}
                        </h2>
                      </div>

                      <p className="font-body text-zinc-600 text-base leading-relaxed">
                        {service.fullDescription}
                      </p>

                      {/* Feature Checklist */}
                      <div className="pt-1">
                        <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-zinc-900 mb-3.5">
                          Key Capabilities &amp; Standards
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-[#003399]/10 text-[#003399] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="font-body text-xs font-semibold text-zinc-700">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            );
          } else {
            {/* EVEN BLOCKS (2, 4, 6) - Light Gray Background, Content on Left, Image on Right */}
            return (
              <section
                key={service.id}
                id={service.id}
                className="py-20 sm:py-24 bg-[#F4F5F7] text-zinc-900 relative overflow-hidden border-t border-zinc-200 scroll-mt-24 sm:scroll-mt-28"
              >
                {/* Subtle blueprint grid background */}
                <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Content - Natural spacing without awkward gaps */}
                    <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
                      <div>
                        <div className="inline-flex items-center gap-2.5 mb-3">
                          <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                            {service.title}
                          </span>
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
                          {service.title}
                        </h2>
                      </div>

                      <p className="font-body text-zinc-600 text-base leading-relaxed">
                        {service.fullDescription}
                      </p>

                      {/* Feature Checklist */}
                      <div className="pt-1">
                        <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-zinc-900 mb-3.5">
                          Key Capabilities &amp; Standards
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-[#003399]/10 text-[#003399] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="font-body text-xs font-semibold text-zinc-700">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:col-span-6 relative order-1 lg:order-2">
                      <div className="relative mx-auto max-w-md lg:max-w-none">
                        
                        {/* Outer decorative framing */}
                        <div className="absolute -bottom-4 -right-4 w-full h-full p-[2.8px] bg-[#003399]/60 clip-angled-corner pointer-events-none">
                          <div className="w-full h-full bg-[#F4F5F7] clip-angled-corner" />
                        </div>

                        {/* Main Image Container */}
                        <div className="relative p-[4px] bg-black clip-angled-corner shadow-2xl">
                          <div className="relative overflow-hidden clip-angled-corner bg-zinc-900">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="w-full h-[360px] sm:h-[400px] lg:h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </section>
            );
          }
        })}
      </div>

      {/* 3. Contact Footer */}
      <ContactFooter
        onGetQuote={() => onNavigateHome('hero')}
        onViewServices={() => onNavigateHome('services')}
        onNavigate={(page, sec) => onNavigateHome(sec || page)}
      />
    </div>
  );
};
