import React from 'react';
import { PortfolioProject } from '../types';
import { X, MapPin, Calendar, Layers, Check, ArrowRight } from 'lucide-react';
import { markdownToHtml } from './RichTextEditor';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onContactClick: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onContactClick }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#111111] text-white border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col clip-angled-corner">
        
        {/* Close Button Header Overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/70 hover:bg-[#FF5500] text-white transition-colors rounded-full cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image View */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900 flex-shrink-0">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-[#FF5500] shrink-0" />
              <span className="font-display text-[10px] font-bold uppercase tracking-widest text-zinc-200">
                {project.category} Showcase
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto font-body text-zinc-300">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-900 border border-zinc-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Location</span>
              <span className="font-display text-xs sm:text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
                {project.location}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Total Footprint</span>
              <span className="font-display text-xs sm:text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-[#FF5500]" />
                {project.area}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Completion</span>
              <span className="font-display text-xs sm:text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF5500]" />
                {project.year}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-2">
              Architectural &amp; Engineering Summary
            </h4>
            <div
              className="rich-text-content text-sm leading-relaxed text-zinc-300 break-words overflow-hidden space-y-2"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(project.detailedScope || project.description) }}
            />
          </div>

          {/* Project Highlights */}
          <div className="p-5 bg-zinc-950 border-l-4 border-[#003399] space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-300">
              Structural & Design Differentiators
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                  <Check className="w-4 h-4 text-[#FF5500] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-zinc-400 block font-medium">Client Profile:</span>
            <span className="font-display text-sm font-semibold text-white">{project.client}</span>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-zinc-400">
            Envisioning a similar high-performance build?
          </span>
          <button
            onClick={() => {
              onClose();
              onContactClick();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003399] hover:bg-[#FF5500] text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors cursor-pointer"
          >
            <span>Discuss Similar Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
