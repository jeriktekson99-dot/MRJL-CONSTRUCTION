import React from 'react';
import { HERO_IMAGE } from '../data/siteData';

export const CuratedAchievements: React.FC = () => {
  const stats = [
    {
      id: 'stat-1',
      number: '₱4.8B+',
      title: 'Total Portfolio Value',
    },
    {
      id: 'stat-2',
      number: '100+',
      title: 'Turnkey Units Delivered',
    },
    {
      id: 'stat-3',
      number: '100%',
      title: 'On-Time Schedule Delivery',
    },
    {
      id: 'stat-4',
      number: '28+',
      title: 'Industry Excellence Awards',
    },
    {
      id: 'stat-5',
      number: '15+ Yrs',
      title: 'Integrated Industry Mastery',
    },
    {
      id: 'stat-6',
      number: '99.4%',
      title: 'Client Satisfaction Index',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#111111] text-white relative overflow-hidden border-t border-b border-zinc-800">
      {/* Background Image with grayscale & top-to-bottom dark fade overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Curated Works Background"
          className="w-full h-full object-cover object-center grayscale opacity-25"
          referrerPolicy="no-referrer"
        />
        {/* Black gradient mask: Starts dark at top and slowly reveals image towards bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#111111]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent" />
      </div>

      {/* Background blueprint grid overlay */}
      <div className="absolute inset-0 blueprint-grid-dark opacity-15 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2.5 mb-4 justify-center">
            <span className="w-2.5 h-2.5 bg-[#FF5500] shrink-0" />
            <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-300">
              Curated Works • Proven Achievements
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Curated Works <span className="text-[#FF5500]">&amp; Track Record</span>
          </h2>
        </div>

        {/* Centrally Aligned 2 by 3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
          {stats.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center px-4 pt-[10px] pb-[25px]"
            >
              {/* Big Social Proof Metric Number */}
              <div className="font-display text-5xl sm:text-6xl font-black tracking-tight text-[#FF5500] mb-3">
                {item.number}
              </div>

              {/* Metric Title */}
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

