import React from 'react';
import { HERO_IMAGE } from '../data/siteData';
import { PortfolioProject } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';
import { usePortfolioStore } from '../utils/portfolioStore';

interface PortfolioSectionProps {
  onSelectProject: (project: PortfolioProject) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const { projects: allStoreProjects } = usePortfolioStore();
  const completedProjects = allStoreProjects.filter((p) => p.status === 'Completed' && p.status !== 'Draft');

  return (
    <section id="portfolio" className="py-24 bg-[#111111] text-white relative overflow-hidden">
      {/* Background Image with grayscale & top-to-bottom dark fade overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Curated Works Background"
          className="w-full h-full object-cover object-center grayscale opacity-25"
          referrerPolicy="no-referrer"
        />
        {/* Black gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#111111]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent" />
      </div>

      {/* Background blueprint grid overlay */}
      <div className="absolute inset-0 blueprint-grid-dark opacity-15 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
              Curated Works
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Excellence You Can Trust <br />
            <span className="text-[#FF5500]">Featured Projects</span>
          </h2>
        </div>

        {/* Projects Grid: Row 1 (2 Cards), Row 2 (3 Cards) */}
        <div className="space-y-8">
          {/* Row 1: 2 Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {completedProjects.slice(0, 2).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group relative border border-white/25 hover:border-[#FF5500]/60 overflow-hidden cursor-pointer shadow-lg transition-all duration-300"
              >
                <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 flex flex-col justify-end">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-[#FF5500] transition-colors leading-snug break-words">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300 font-medium mt-1.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5500] shrink-0" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 3 Projects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {completedProjects.slice(2, 5).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group relative border border-white/25 hover:border-[#FF5500]/60 overflow-hidden cursor-pointer shadow-lg transition-all duration-300"
              >
                <div className="relative h-80 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end">
                    <h3 className="font-display text-xl font-black text-white group-hover:text-[#FF5500] transition-colors leading-snug break-words">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
