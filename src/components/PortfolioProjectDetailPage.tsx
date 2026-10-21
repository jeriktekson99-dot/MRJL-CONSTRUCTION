import React, { useState, useEffect, useRef } from 'react';
import { PortfolioProject } from '../types';
import { usePortfolioStore } from '../utils/portfolioStore';
import { markdownToHtml } from './RichTextEditor';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Building2, 
  Check, 
  Mail, 
  Phone, 
  Clock, 
  Ruler, 
  UserCheck, 
  Layers, 
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ContactFooter } from './ContactFooter';

interface PortfolioProjectDetailPageProps {
  project: PortfolioProject;
  onBackToPortfolio: () => void;
  onSelectProject: (project: PortfolioProject) => void;
  onContactClick: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

export const PortfolioProjectDetailPage: React.FC<PortfolioProjectDetailPageProps> = ({
  project,
  onBackToPortfolio,
  onSelectProject,
  onContactClick,
  onNavigateHome,
}) => {
  const { projects: allStoreProjects } = usePortfolioStore();

  // Gallery thumbnails: reflect posted images first, fallback to imageUrl
  const galleryImages = (project.galleryImages && project.galleryImages.length > 0)
    ? project.galleryImages
    : [project.imageUrl];

  const [activeImage, setActiveImage] = useState<string>(galleryImages[0] || project.imageUrl);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const images = (project.galleryImages && project.galleryImages.length > 0)
      ? project.galleryImages
      : [project.imageUrl];
    setActiveImage(images[0] || project.imageUrl);
  }, [project.id, project.imageUrl, project.galleryImages]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      thumbnailScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Other related projects
  const otherProjects = allStoreProjects.filter((p) => p.id !== project.id && p.status !== 'Draft').slice(0, 2);

  return (
    <div className="min-h-screen bg-white pt-28">
      
      {/* PROJECT HEADER & METADATA GRID (White Background) */}
      <section className="pb-[50px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Project Title Block */}
          <div className="mb-8">
            <span className="block font-display text-[14px] font-extrabold uppercase tracking-widest text-[#FF5500] pt-[25px] pb-[25px]">
              Project Build
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
              {project.title}
            </h1>
          </div>

          {/* Key Specs Metadata: Client, Service Provided, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-2">
            
            {/* Spec 1: Client */}
            <div className="border-l-2 border-[#003399] pl-3.5 py-0.5">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                CLIENT
              </span>
              <span className="block font-display text-base font-black text-zinc-900 uppercase tracking-tight">
                {project.client || 'PRIVATE EXECUTIVE ESTATE'}
              </span>
            </div>

            {/* Spec 2: Service Provided */}
            <div className="border-l-2 border-[#003399] pl-3.5 py-0.5">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                SERVICE PROVIDED
              </span>
              <span className="block font-display text-base font-black text-zinc-900 uppercase tracking-tight">
                {project.category || 'PLANNING AND DESIGN'}
              </span>
            </div>

            {/* Spec 3: Location */}
            <div className="border-l-2 border-[#003399] pl-3.5 py-0.5">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                LOCATION
              </span>
              <span className="block font-display text-base font-black text-zinc-900 uppercase tracking-tight">
                {project.location}
              </span>
            </div>

          </div>

        </div>
      </section>


      {/* 3. CONTENT & SIDEBAR LAYOUT (Asymmetric 2-Column Grid) */}
      <section className="pt-2 pb-12 sm:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN — MAIN CASE STUDY BODY (70% = 8 cols) */}
            <div className="lg:col-span-8 space-y-10 min-w-0">
              
              {/* Interactive Media Gallery */}
              <div className="space-y-4">
                               {/* Main Showcase Image View */}
                <div className="relative overflow-hidden rounded-xl bg-zinc-950 border border-zinc-300 group shadow-md h-[350px] sm:h-[440px] flex items-center justify-center">
                  <img
                    src={activeImage}
                    alt={project.title}
                    className="w-full h-full object-contain mx-auto transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Thumbnail Carousel / Grid: Interactive Thumbnails */}
                <div>
                  <div className="relative w-full pt-1">
                    {galleryImages.length > 4 && (
                      <>
                        <button
                          type="button"
                          onClick={() => scrollThumbnails('left')}
                          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer p-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                          aria-label="Previous photos"
                        >
                          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => scrollThumbnails('right')}
                          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer p-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                          aria-label="Next photos"
                        >
                          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                        </button>
                      </>
                    )}

                    <div
                      ref={thumbnailScrollRef}
                      className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth scrollbar-none py-1 w-full"
                    >
                      {galleryImages.map((imgUrl, index) => {
                        const isActive = activeImage === imgUrl;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveImage(imgUrl)}
                            className={`relative shrink-0 w-[calc((100%-3*0.625rem)/4)] sm:w-[calc((100%-3*0.75rem)/4)] aspect-[25/23] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-zinc-900 ${
                              isActive
                                ? 'border-[#003399] ring-2 ring-[#FF5500] opacity-100 shadow-sm'
                                : 'border-zinc-200 opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery view ${index + 1}`}
                              className="w-full h-full object-cover object-center"
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>


              {/* Project Narrative / Details Section 1 */}
              <div className="space-y-4 pt-2 min-w-0">
                <div className="border-b border-zinc-200 pb-3">
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-wider text-zinc-900">
                      Project Scope &amp; Details
                    </h2>
                  </div>
                </div>

                {project.detailedScope ? (
                  <div
                    className="rich-text-content font-body text-zinc-700 text-sm leading-relaxed break-words overflow-hidden space-y-2"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(project.detailedScope) }}
                  />
                ) : (
                  <div
                    className="rich-text-content font-body text-zinc-700 text-sm leading-relaxed break-words overflow-hidden space-y-2"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(project.description) }}
                  />
                )}
              </div>




            </div>


            {/* RIGHT COLUMN — STICKY SIDEBAR (30% = 4 cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
              
              {/* WIDGET 1: DIRECT CONTACT CARDS */}
              <div className="bg-[#F8F9FA] border border-[#E5E7EB] p-6 space-y-5">
                
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-zinc-900">
                    Project Contacts &amp; Media
                  </h3>
                </div>

                <div className="space-y-4 pt-1">
                  
                  {/* Block 1: Managing Engineer */}
                  <div>
                    <span className="block font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                      MANAGING ENGINEER
                    </span>
                    <h4 className="font-display text-base sm:text-lg font-black text-zinc-900 tracking-tight uppercase">
                      MRJL ENGINEERING TEAM
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-zinc-500 font-normal mt-0.5">
                      General Management, MRJL Construction Corporation
                    </p>
                  </div>

                  <div className="border-b border-zinc-200/80" />

                  {/* Block 2: General Contractor */}
                  <div>
                    <span className="block font-mono text-[11px] font-bold uppercase tracking-widest text-[#FF5500] mb-1">
                      GENERAL CONTRACTOR
                    </span>
                    <h4 className="font-display text-base sm:text-lg font-black text-zinc-900 tracking-tight uppercase">
                      MRJL CONSTRUCTION TEAM
                    </h4>
                  </div>

                  <div className="border-b border-zinc-200/80" />

                  {/* Block 3: Company Email Address */}
                  <div className="space-y-2">
                    <span className="block font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      COMPANY EMAIL ADDRESS:
                    </span>
                    <a
                      href="mailto:info@mrjlconstruction.com"
                      className="block font-mono text-sm font-bold text-[#003399] hover:text-[#FF5500] hover:underline break-all"
                    >
                      info@mrjlconstruction.com
                    </a>
                    <p className="font-body text-xs text-zinc-500 leading-relaxed pt-1">
                      Professional engineers coordinating architectural finishes, structural components, electrical and plumbing plans.
                    </p>
                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <ContactFooter
        onGetQuote={onContactClick}
        onViewServices={() => onNavigateHome('services')}
        onNavigate={(page, sec) => onNavigateHome(sec || page)}
      />

    </div>
  );
};
