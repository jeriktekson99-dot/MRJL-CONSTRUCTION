import React from 'react';
import { ABOUT_JOURNEY_GROWTH_IMAGE, ABOUT_LEADERSHIP_IMAGE } from '../data/siteData';

interface AboutSectionProps {
  onLearnMore?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <>
      {/* BLOCK 1: Master Planning (White Background) */}
      <section id="about" className="py-24 bg-white text-zinc-900 relative overflow-hidden">
        {/* Subtle blueprint grid background */}
        <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Block 1 Image in Angled Frame */}
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
                      src={ABOUT_JOURNEY_GROWTH_IMAGE}
                      alt="Excellence in Architectural Craft by MRJL Construction"
                      className="w-full h-[400px] sm:h-[450px] lg:h-[460px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>

              </div>
            </div>

            {/* Right Block 1 Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                    Established Excellence
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900">
                  A Journey of <br />
                  <span className="text-[#FF5500]">Continuous Growth</span>
                </h3>
              </div>

              <div className="space-y-4">
                <p className="font-body text-zinc-600 text-base leading-relaxed">
                  Established with a passion for architectural precision, MRJL Construction Corporation began by providing residential and commercial construction, renovations, retrofitting, and structural improvement services. As our experience and expertise expanded, we broadened our services to include comprehensive planning and design, land development, and turnkey general contracting projects.
                </p>
                <p className="font-body text-zinc-600 text-base leading-relaxed">
                  Today, we continue to build with the same commitment to quality while embracing greater opportunities for innovation and sustainable engineering.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOCK 2: Engineering & Execution (Light Gray Background #F4F5F7) */}
      <section className="py-24 bg-[#F4F5F7] text-zinc-900 relative overflow-hidden border-t border-zinc-200">
        {/* Subtle blueprint grid background */}
        <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Block 2 Content */}
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                    Leadership &amp; Experience
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900">
                  Leadership Built on <br />
                  <span className="text-[#FF5500]">Experience</span>
                </h3>
              </div>

              <div className="space-y-4">
                <p className="font-body text-zinc-600 text-base leading-relaxed">
                  MRJL Construction Corporation is guided by years of hands-on experience in engineering, project management, and construction operations. Our leadership team spans technical engineering, quality assurance, project administration, and field execution across complex projects.
                </p>
                <p className="font-body text-zinc-600 text-base leading-relaxed">
                  With a commitment to continuous learning, innovation, and excellence, MRJL leads the industry in delivering projects that combine quality craftsmanship, practical solutions, and long-term value for every client.
                </p>
              </div>
            </div>

            {/* Right Block 2 Image */}
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
                      src={ABOUT_LEADERSHIP_IMAGE}
                      alt="Precision Steel and Concrete Construction Craft by MRJL"
                      className="w-full h-[400px] sm:h-[450px] lg:h-[460px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
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
    </>
  );
};
