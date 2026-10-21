import React, { useState, useEffect, useRef } from 'react';
import { markdownToHtml } from './RichTextEditor';
import {
  ArrowLeft,
  Trash2,
  Maximize2,
  X,
  Building2,
  Zap,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface AdminPortfolioItem {
  id: string;
  title: string;
  client?: string;
  clientLocation?: string;
  location?: string;
  category?: string;
  designatedCategory?: string;
  status?: string;
  imageUrl: string;
  galleryImages?: string[];
  description?: string;
  detailedScope?: string;
  structuralSpecs?: string;
  inverterEquipment?: string;
  roiYield?: string;
  paybackTerm?: string;
  installedCapacity?: string;
  assetYear?: string;
  liveUrl?: string;
}

interface AdminPortfolioDetailsViewProps {
  project: AdminPortfolioItem;
  onBack: () => void;
  onDelete: (project: AdminPortfolioItem) => void;
}

export const AdminPortfolioDetailsView: React.FC<AdminPortfolioDetailsViewProps> = ({
  project,
  onBack,
  onDelete
}) => {
  // Gallery thumbnails setup (ensure 4+ photos)
  const galleryList = (project.galleryImages && project.galleryImages.length > 0)
    ? project.galleryImages
    : [project.imageUrl];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      thumbnailScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeHeroImage = galleryList[activeImageIndex] || project.imageUrl;

  // Formatting helpers
  const clientDisplay = project.client || 'Mr. & Mrs. Carvajal';
  const locationDisplay = project.location || project.clientLocation || 'GMA, Cavite';
  const categoryDisplay = project.category || project.designatedCategory || 'Residential Realty / Civil Build';
  const statusDisplay = project.status || 'Completed';
  const projRefNumber = project.id.toUpperCase().startsWith('PROJ')
    ? project.id.toUpperCase()
    : `SPEC-PROJ-${project.id.toUpperCase()}`;

  // Status badge styling helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Under Construction':
      case 'Ongoing':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Planning Phase':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ==================== A. TOP HEADER NAVIGATION BAR (ROUNDED CORNERS) ==================== */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Left Content Group */}
          <div className="flex items-center gap-3.5">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#111111] hover:bg-[#F8FAFC] hover:border-zinc-400 transition-colors cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
              title="Return to Portfolio Manager"
              aria-label="Back to Portfolio Manager"
            >
              <ArrowLeft className="w-5 h-5 text-[#111111]" />
            </button>

            <div>
              <h1 className="font-display font-black text-lg sm:text-xl lg:text-2xl text-[#111111] uppercase tracking-tight leading-tight">
                PROJECT: {project.title}
              </h1>
            </div>
          </div>

          {/* Right Content Group: Actions */}
          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="px-4 py-2.5 rounded-lg border border-[#C8102E] bg-white text-[#C8102E] hover:bg-red-50 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-[#C8102E]" />
              <span>DELETE RECORD</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== B. PROJECT CLIENT METADATA (SINGLE FULL-WIDTH ROW) ==================== */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Spec 1: CLIENT NAME */}
          <div className="space-y-1 border-l-2 border-[#003399] pl-3.5">
            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
              CLIENT NAME
            </span>
            <p className="font-display font-extrabold text-xs sm:text-sm text-[#111111] uppercase">
              {clientDisplay}
            </p>
          </div>

          {/* Spec 2: SERVICE PROVIDED */}
          <div className="space-y-1 border-l-2 border-[#003399] pl-3.5">
            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
              SERVICE PROVIDED
            </span>
            <p className="font-display font-extrabold text-xs sm:text-sm text-[#111111] uppercase">
              {categoryDisplay}
            </p>
          </div>

          {/* Spec 3: LOCATION */}
          <div className="space-y-1 border-l-2 border-[#003399] pl-3.5">
            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
              LOCATION
            </span>
            <p className="font-display font-extrabold text-xs sm:text-sm text-[#111111] uppercase">
              {locationDisplay}
            </p>
          </div>

          {/* Spec 4: STATUS */}
          <div className="space-y-1 border-l-2 border-[#003399] pl-3.5">
            <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
              STATUS
            </span>
            <p className="font-display font-extrabold text-xs sm:text-sm text-[#111111] uppercase">
              {statusDisplay}
            </p>
          </div>
        </div>
      </div>

      {/* ==================== C. MAIN VISUAL ASSETS & SCOPE CONTENT ==================== */}
      <div className="space-y-6">

        {/* CARD 1: MEDIA GALLERY & FEATURED IMAGES */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[#F1F5F9] bg-white flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-base sm:text-lg text-[#111111] uppercase tracking-wider">
                    PROJECT SETUP &amp; ACTUAL PHOTOS
                  </h2>
                  <p className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider mt-1">
                    INTERACTIVE HIGH-RESOLUTION VISUAL ASSETS OF THE COMMISSIONED SETUP.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#FF5500] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md hidden sm:inline-block">
                  {galleryList.length} ASSETS LOADED
                </span>
              </div>

              {/* Showcase Container */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Main Showcase Hero Display */}
                <div className="relative h-[295px] sm:h-[440px] w-full rounded-xl overflow-hidden bg-zinc-950 border border-[#E2E8F0] group shadow-inner flex items-center justify-center">
                  <img
                    src={activeHeroImage}
                    alt={project.title}
                    className="w-full h-full object-contain mx-auto group-hover:scale-102 transition-transform duration-500 ease-out cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  
                  {/* Lightbox prompt in bottom right corner */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <button 
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-2 sm:p-2.5 bg-black/60 hover:bg-[#FF5500] text-white rounded-md border border-white/20 transition-colors flex items-center gap-2 font-mono text-xs cursor-pointer shadow-md backdrop-blur-xs"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                      <span className="hidden sm:inline font-bold">FULLSCREEN LIGHTBOX</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnail Strip Grid / Slideable Carousel */}
                <div className="relative w-full pt-2">
                  {galleryList.length > 4 && (
                    <>
                      <button
                        type="button"
                        onClick={() => scrollThumbnails('left')}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer p-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                        aria-label="Previous photo thumbnails"
                      >
                        <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => scrollThumbnails('right')}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer p-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
                        aria-label="Next photo thumbnails"
                      >
                        <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                      </button>
                    </>
                  )}

                  <div
                    ref={thumbnailScrollRef}
                    className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth scrollbar-none py-1 w-full"
                  >
                    {galleryList.map((thumbUrl, idx) => {
                      const isActive = idx === activeImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative shrink-0 w-[calc((100%-3*0.625rem)/4)] sm:w-[calc((100%-3*0.75rem)/4)] aspect-[25/23] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-zinc-900 ${
                            isActive
                              ? 'border-[#FF5500] opacity-100 shadow-sm'
                              : 'border-zinc-200 opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={thumbUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: DETAILED SCOPE, DATA BREAKDOWN & NARRATIVE */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[#F1F5F9] bg-white">
                <h2 className="font-display font-black text-base sm:text-lg text-[#111111] uppercase tracking-wider">
                  PROJECT SCOPE &amp; NARRATIVE
                </h2>
                <p className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider mt-1">
                  FULL DESCRIPTION AND COMMISSIONING CHALLENGES.
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                
                {/* Narrative Text Area */}
                <div>
                  <div
                    className="rich-text-content text-zinc-700 break-words font-sans space-y-2 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(project.detailedScope || project.description) }}
                  />
                </div>

              </div>
            </div>

          </div>

      {/* ==================== LIGHTBOX FULLSCREEN MODAL ==================== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white border-b border-white/20 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-[#FF5500] uppercase tracking-widest">
                HIGH-RESOLUTION ASSET LIGHTBOX
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-white uppercase">
                {project.title} (PHOTO #{activeImageIndex + 1} OF {galleryList.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-[#FF5500] text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Center Image */}
          <div className="relative max-w-6xl max-h-[75vh] w-full my-auto flex items-center justify-center overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <img
              src={activeHeroImage}
              alt={project.title}
              className="max-h-[75vh] w-auto max-w-full object-contain"
            />
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-xl flex items-center justify-center gap-3 overflow-x-auto pt-2">
            {galleryList.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === activeImageIndex ? 'border-[#FF5500] scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
