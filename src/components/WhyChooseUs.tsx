import React from 'react';
import { CORE_VALUES } from '../data/siteData';

interface WhyChooseUsProps {
  onContactClick?: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = () => {
  return (
    <section id="why-us" className="py-24 bg-[#F4F5F7] text-zinc-900 relative overflow-hidden">
      {/* Subtle blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        


        {/* Split Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Solid Black Container with "Why Choose Zeke" Info */}
          <div className="lg:col-span-5 relative flex flex-col h-full">
            <div className="relative mx-auto max-w-md lg:max-w-none w-full h-full flex flex-col">
              
              {/* Outer decorative geometric corner */}
              <div className="absolute -top-4 -left-4 w-full h-full p-[2.8px] bg-black clip-angled-corner pointer-events-none">
                <div className="w-full h-full bg-white clip-angled-corner" />
              </div>

              {/* Main Container with Deep Blue Outline */}
              <div className="relative bg-[#003399] p-[1.5px] clip-angled-corner shadow-2xl h-full flex flex-col flex-1">
                <div className="relative overflow-hidden clip-angled-corner bg-zinc-950 text-white p-7 sm:p-9 h-full w-full flex flex-col justify-between flex-1">
                  
                  <div className="space-y-6">
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 bg-[#FF5500] shrink-0" />
                      <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                        Why Choose Us
                      </span>
                    </div>

                    {/* Heading */}
                    <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                      Building Confidence <br />
                      <span className="text-[#FF5500]">Through Expertise</span>
                    </h2>

                    {/* Subtitle / Overview */}
                    <p className="font-body text-sm sm:text-base text-zinc-300 leading-relaxed">
                      At MRJL Construction Corporation, we combine years of industry experience, skilled professionals, and comprehensive construction and development solutions to deliver projects with quality, precision, and integrity. From planning and design to project completion, we are committed to exceeding expectations and building lasting value for every client.
                    </p>
                  </div>

                  {/* Bottom Footer Accent */}
                  <div className="pt-6 mt-8 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-display font-bold tracking-widest uppercase">
                    <span>MRJL CORPORATION</span>
                    <span className="text-[#FF5500]">QUALITY &amp; INTEGRITY</span>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Stacked Core Differentiators (3x1 Vertical List) */}
          <div className="lg:col-span-7 flex flex-col gap-4 justify-center">

            {/* List of 01 - 03 Differentiators */}
            <div className="flex flex-col gap-4">
              {CORE_VALUES.map((val, idx) => {
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={val.id}
                    className="p-6 bg-white border border-zinc-200 hover:border-[#FF5500] transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-row items-center gap-6 sm:gap-8 group"
                  >
                    {/* Large Number on Left, Vertically Centered */}
                    <div className="shrink-0 font-display text-4xl sm:text-5xl font-black text-[#003399] group-hover:text-[#FF5500] transition-colors leading-none select-none">
                      {numStr}
                    </div>

                    {/* Content on Right */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-lg font-bold text-zinc-900 group-hover:text-[#FF5500] transition-colors mb-1.5">
                        {val.title}
                      </h4>

                      <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
