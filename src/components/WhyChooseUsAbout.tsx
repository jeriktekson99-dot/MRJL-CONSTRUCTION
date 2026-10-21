import React from 'react';
import { CORE_VALUES_ABOUT, ABOUT_CORE_VALUES_IMAGE } from '../data/siteData';

interface WhyChooseUsAboutProps {
  onContactClick?: () => void;
}

export const WhyChooseUsAbout: React.FC<WhyChooseUsAboutProps> = () => {
  return (
    <section id="core-values-about" className="py-24 bg-[#F4F5F7] text-zinc-900 relative overflow-hidden border-t border-zinc-200">
      {/* Subtle blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Image Container (Clean image with red outline frame) */}
          <div className="lg:col-span-5 relative flex flex-col h-full">
            <div className="relative mx-auto max-w-md lg:max-w-none w-full h-full flex flex-col">
              
              {/* Outer decorative geometric corner */}
              <div className="absolute -top-4 -left-4 w-full h-full p-[2.8px] bg-black clip-angled-corner pointer-events-none">
                <div className="w-full h-full bg-white clip-angled-corner" />
              </div>

              {/* Main Container with Deep Blue Outline */}
              <div className="relative bg-[#003399] p-[1.5px] clip-angled-corner shadow-2xl h-full flex flex-col flex-1">
                <div className="relative overflow-hidden clip-angled-corner h-full min-h-[400px] sm:min-h-[480px] w-full">
                  
                  {/* Background Architectural Image */}
                  <img
                    src={ABOUT_CORE_VALUES_IMAGE}
                    alt="Architectural structure & core values"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Core Values & Stacked Cards */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Core Values Header */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#FF5500] shrink-0" />
                <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                  Our Principles
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                Our Core Values
              </h2>

              <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed pt-1">
                At MRJL Construction Corporation, our core values guide every decision and relationship, driving us to deliver construction and development solutions with professionalism, accountability, and lasting excellence.
              </p>
            </div>

            {/* List of 01 - 03 Core Values */}
            <div className="flex flex-col gap-4">
              {CORE_VALUES_ABOUT.map((val, idx) => {
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={val.id}
                    className="p-6 bg-white border border-zinc-200 hover:border-[#FF5500] transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-row items-center gap-6 sm:gap-8 group"
                  >
                    {/* Large Number on Left */}
                    <div className="shrink-0 font-display text-4xl sm:text-5xl font-black text-[#003399] group-hover:text-[#FF5500] transition-colors leading-none select-none">
                      {numStr}
                    </div>

                    {/* Content on Right */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-zinc-900 group-hover:text-[#FF5500] transition-colors mb-1.5">
                        {val.title}
                      </h3>

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
