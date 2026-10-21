import React from 'react';
import { AboutSection } from './AboutSection';
import { AboutCoreCapabilities } from './AboutCoreCapabilities';
import { WhyChooseUsDualCards } from './WhyChooseUsDualCards';
import { WhyChooseUsAbout } from './WhyChooseUsAbout';
import { ContactFooter } from './ContactFooter';
import { ServiceItem, PortfolioProject } from '../types';
import { ABOUT_HERO_IMAGE } from '../data/siteData';

interface AboutPageProps {
  onSelectService: (service: ServiceItem) => void;
  onSelectProject: (project: PortfolioProject) => void;
  onContactClick: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onSelectService,
  onSelectProject,
  onContactClick,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section for About Page */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#111111] text-white overflow-hidden border-b border-zinc-800">
        {/* Background Grayscale Architectural Image with low visibility */}
        <div className="absolute inset-0 z-0">
          <img
            src={ABOUT_HERO_IMAGE}
            alt="Architectural structure"
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
            <span className="shiny-text-silver">About</span> <span className="shiny-text-red">Us</span>
          </h1>
        </div>
      </section>

      {/* 2. Block 1 & Block 2 (AboutSection) */}
      <AboutSection />

      {/* 3. Our Core Capabilities (4x2 Listed Services) */}
      <AboutCoreCapabilities onSelectService={onSelectService} />

      {/* 4. Why Choose Zeke - First Section (Dual Black Cards) */}
      <WhyChooseUsDualCards />

      {/* 6. Why Choose Zeke - Second Section (About-Specific Core Differentiators) */}
      <WhyChooseUsAbout onContactClick={onContactClick} />

      {/* 6. Contact Footer */}
      <ContactFooter
        onGetQuote={() => onNavigateHome('hero')}
        onViewServices={() => onNavigateHome('services')}
        onNavigate={(page, sec) => onNavigateHome(sec || page)}
      />
    </div>
  );
};
