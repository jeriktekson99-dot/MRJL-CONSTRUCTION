import React from 'react';
import { HOME_HERO_IMAGE } from '../data/siteData';
import { ArrowRight, Star } from 'lucide-react';

interface HeroProps {
  onExploreServices: () => void;
  onViewProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onViewProjects }) => {
  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center pt-26 pb-14 bg-[#111111] overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HOME_HERO_IMAGE}
          alt="Modern Architectural Development by MRJL Construction Corporation"
          className="w-full h-full object-cover object-center scale-105 animate-fade-in transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Multi-layered dark architectural overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#111111]/90 to-[#0A0A0A]/80" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]/90" />
        <div className="absolute inset-0 blueprint-grid-dark opacity-30" />
      </div>

      {/* Decorative Architectural Diagonal Lines */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none hidden lg:block overflow-hidden opacity-25">
        <div className="absolute -top-24 -right-24 w-96 h-[150%] border-r-2 border-[#003399] transform rotate-12" />
        <div className="absolute -top-24 -right-12 w-96 h-[150%] border-r border-[#FF5500]/30 transform rotate-12" />
      </div>

      {/* Main Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <div className="max-w-3xl flex flex-col justify-center">
          
          {/* Architectural Subtitle Badge */}
          <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-5">
            <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
            <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-200">
              Integrated Architectural &amp; Construction Corporation
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
            <span className="shiny-text-silver">Building Dreams</span> <br className="hidden sm:inline" />
            <span className="shiny-text-silver">
              Into
            </span>{' '}
            <span className="relative inline-block text-[#FF5500]">
              Reality
              <svg className="absolute -bottom-1.5 left-0 w-full h-1 text-[#FF5500]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 L100,5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="font-body text-base sm:text-lg text-zinc-300 font-normal leading-relaxed mb-7 max-w-2xl">
            We Don't Just Build. <strong className="text-white font-semibold">We Craft Your Reality.</strong> Premium planning, land development, construction, and realty services executed under one cohesive vision.
          </p>

          {/* Social Proof: Client Avatars & 5.0 Rating */}
          <div className="flex flex-wrap items-center gap-4 mb-9">
            {/* Four Client Avatars */}
            <div className="flex -space-x-2.5 overflow-hidden">
              <img
                className="inline-block h-9.5 w-9.5 sm:h-10 sm:w-10 rounded-full ring-2 ring-[#111111] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Client Sarah M."
                referrerPolicy="no-referrer"
              />
              <img
                className="inline-block h-9.5 w-9.5 sm:h-10 sm:w-10 rounded-full ring-2 ring-[#111111] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Client David R."
                referrerPolicy="no-referrer"
              />
              <img
                className="inline-block h-9.5 w-9.5 sm:h-10 sm:w-10 rounded-full ring-2 ring-[#111111] object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Client Elena K."
                referrerPolicy="no-referrer"
              />
              <img
                className="inline-block h-9.5 w-9.5 sm:h-10 sm:w-10 rounded-full ring-2 ring-[#111111] object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Client Marcus T."
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Vertical Line Divider */}
            <div className="h-9 w-px bg-zinc-700/80 hidden sm:block" />

            {/* Rating and Social Proof Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-[#FF5500]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FF5500] text-[#FF5500]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  5.0 Rating
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-0.5">
                Join 100+ homes &amp; businesses.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={onExploreServices}
              className="inline-flex items-center justify-center gap-3 bg-[#003399] hover:bg-[#FF5500] text-white font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-7.5 py-3.5 rounded-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onViewProjects}
              className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-[#003399]/20 text-white border border-white/30 hover:border-[#FF5500] backdrop-blur-xs font-display text-xs sm:text-sm font-bold uppercase tracking-wider px-7.5 py-3.5 rounded-none transition-all duration-300 cursor-pointer"
            >
              <span>View Portfolio Projects</span>
            </button>
          </div>

        </div>
      </div>

      {/* Structural Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003399] via-zinc-800 to-[#003399]" />
    </section>
  );
};
