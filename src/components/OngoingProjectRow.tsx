import React from 'react';
import { PortfolioProject } from '../types';
import { ArrowRight } from 'lucide-react';

interface OngoingProjectRowProps {
  project: PortfolioProject;
  index: number;
  onClick: () => void;
}

export const OngoingProjectRow: React.FC<OngoingProjectRowProps> = ({
  project,
  index,
  onClick,
}) => {
  const formattedIndex = String(index + 1).padStart(2, '0');
  const discipline = project.category ? project.category.toUpperCase() : 'CIVIL WORKS';

  return (
    <div
      onClick={onClick}
      className="group border-b border-zinc-200 py-6 sm:py-8 px-2 sm:px-4 transition-all duration-200 cursor-pointer hover:bg-zinc-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
        {/* Index Number (e.g. 01, 02) */}
        <span className="font-mono font-bold text-xl sm:text-2xl text-zinc-900 group-hover:text-[#FF5500] transition-colors shrink-0 text-center min-w-[2rem] sm:min-w-[2.5rem]">
          {formattedIndex}
        </span>

        {/* Content Details */}
        <div className="flex-1 min-w-0">
          {/* Header Line: ONGOING PROJECT | DISCIPLINE */}
          <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-600 group-hover:text-[#FF5500] transition-colors mb-1 flex items-center gap-2">
            <span>ONGOING PROJECT</span>
            <span className="text-zinc-300">|</span>
            <span>{discipline}</span>
          </div>

          {/* Large Bold Project Title (10% smaller) */}
          <h3 className="font-display font-black text-lg sm:text-xl lg:text-2xl text-zinc-900 group-hover:text-[#FF5500] tracking-tight leading-snug uppercase transition-colors break-words">
            {project.title}
          </h3>

          {/* Sub Metadata: CLIENT • LOCATION */}
          <div className="font-mono text-xs sm:text-sm font-medium text-zinc-600 tracking-wider uppercase mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>CLIENT: {project.client || 'PRIVATE CLIENT'}</span>
            <span className="text-zinc-400 font-bold">•</span>
            <span>LOCATION: {project.location}</span>
          </div>
        </div>
      </div>

      {/* Right Boxed Arrow Button */}
      <div className="self-end sm:self-center shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 border border-zinc-900 group-hover:border-[#FF5500] group-hover:bg-[#FF5500] text-zinc-900 group-hover:text-white transition-all duration-200 flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-zinc-900 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};
