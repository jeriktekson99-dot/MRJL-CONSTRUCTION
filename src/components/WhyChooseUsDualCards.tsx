import React from 'react';
import { Check } from 'lucide-react';

export const WhyChooseUsDualCards: React.FC = () => {
  return (
    <section className="py-24 bg-[#F4F5F7] text-zinc-900 relative overflow-hidden">
      {/* Subtle blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dual Black Containers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          
          {/* Container 1 (Left) */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none h-full">
              {/* Outer decorative geometric corner */}
              <div className="absolute -top-4 -left-4 w-full h-full p-[2.8px] bg-black clip-angled-corner pointer-events-none">
                <div className="w-full h-full bg-white clip-angled-corner" />
              </div>

              {/* Main Container with Deep Blue Outline */}
              <div className="relative bg-[#003399] p-[1.5px] clip-angled-corner shadow-2xl h-full">
                <div className="relative overflow-hidden clip-angled-corner bg-[#111111] text-white flex flex-col justify-between h-full">
                  <div className="p-8 sm:p-10 flex flex-col justify-between flex-1 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#003399]/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute inset-0 blueprint-grid-dark opacity-30 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="inline-flex items-center gap-2.5">
                        <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                        <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                          Our Vision
                        </span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        Setting the Standard in Construction &amp; Development
                      </h3>

                      <p className="font-body text-zinc-300 text-sm sm:text-base leading-relaxed">
                        Our vision is to become one of the country's most trusted and respected names in the construction and development industry by setting the standard for quality, innovation, and customer satisfaction. We aspire to shape thriving communities through sustainable developments, exceptional craftsmanship, and forward-thinking solutions that create lasting value for future generations.
                      </p>

                      <div className="space-y-3 pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-200">
                          <div className="w-5 h-5 rounded-full bg-[#003399]/30 text-[#FF5500] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>Lead with innovation and excellence</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-200">
                          <div className="w-5 h-5 rounded-full bg-[#003399]/30 text-[#FF5500] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>Build sustainable communities that endure</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-200">
                          <div className="w-5 h-5 rounded-full bg-[#003399]/30 text-[#FF5500] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>Create lasting value for clients and future generations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container 2 (Right - Duplicated Black Container) */}
          <div className="relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none h-full">
              {/* Outer decorative geometric corner */}
              <div className="absolute -top-4 -left-4 w-full h-full p-[2.8px] bg-black clip-angled-corner pointer-events-none">
                <div className="w-full h-full bg-white clip-angled-corner" />
              </div>

              {/* Main Container with Deep Blue Outline */}
              <div className="relative bg-[#003399] p-[1.5px] clip-angled-corner shadow-2xl h-full">
                <div className="relative overflow-hidden clip-angled-corner bg-[#111111] text-white flex flex-col justify-between h-full">
                  <div className="p-8 sm:p-10 flex flex-col justify-between flex-1 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#003399]/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute inset-0 blueprint-grid-dark opacity-30 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="inline-flex items-center gap-2.5">
                        <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                        <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                          Our Mission
                        </span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        Bringing Client Visions to Life Through Excellence
                      </h3>

                      <p className="font-body text-zinc-300 text-sm sm:text-base leading-relaxed">
                        Our mission is to deliver innovative, reliable, and high-quality construction, development, and engineering solutions that bring our clients' visions to life. Through professional expertise, integrity, and a commitment to excellence, we strive to build lasting relationships, exceed expectations, and create projects that stand as symbols of quality, functionality, and long-term value for the communities we serve.
                      </p>

                      <div className="space-y-3 pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-200">
                          <div className="w-5 h-5 rounded-full bg-[#003399]/30 text-[#FF5500] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>Deliver exceptional quality in every project</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-200">
                          <div className="w-5 h-5 rounded-full bg-[#003399]/30 text-[#FF5500] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>Build lasting client relationships through integrity</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-200">
                          <div className="w-5 h-5 rounded-full bg-[#003399]/30 text-[#FF5500] flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>Provide innovative and reliable construction solutions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
