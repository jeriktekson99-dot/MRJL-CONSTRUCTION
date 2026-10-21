import React from 'react';
import { ServiceItem } from '../types';
import { X, CheckCircle2, ArrowRight, Compass, Layers, Building2, Hammer, Maximize2, Home, ShieldCheck, Building, Droplets } from 'lucide-react';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onContactClick: (serviceTitle: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-8 h-8 text-[#003399]" />,
  Layers: <Layers className="w-8 h-8 text-[#003399]" />,
  Building2: <Building2 className="w-8 h-8 text-[#003399]" />,
  Hammer: <Hammer className="w-8 h-8 text-[#003399]" />,
  Maximize2: <Maximize2 className="w-8 h-8 text-[#003399]" />,
  Home: <Home className="w-8 h-8 text-[#003399]" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-[#003399]" />,
  Building: <Building className="w-8 h-8 text-[#003399]" />,
  Droplets: <Droplets className="w-8 h-8 text-[#003399]" />
};

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onContactClick }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border-2 border-zinc-900 shadow-2xl clip-angled-corner overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-6 bg-[#111111] text-white flex items-center justify-between border-b-2 border-[#003399]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800">
              {ICON_MAP[service.iconName] || <Building2 className="w-8 h-8 text-[#003399]" />}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-[#FF5500] shrink-0" />
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[#FF5500]">
                  Core Capability Overview
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                {service.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto font-body text-zinc-800">
          
          <p className="text-base leading-relaxed text-zinc-700 font-normal">
            {service.fullDescription}
          </p>

          {/* Features Grid */}
          <div className="p-5 bg-[#F4F5F7] border-l-4 border-[#003399] space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900">
              Technical Capabilities & Methodologies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#003399] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900">
              Turnkey Deliverables
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.deliverables.map((deliv, idx) => (
                <span key={idx} className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
                  {deliv}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-zinc-500 font-semibold">
            Ready to integrate {service.title} into your next build?
          </span>
          <button
            onClick={() => {
              onClose();
              onContactClick(service.title);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003399] hover:bg-[#FF5500] text-white font-display text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors cursor-pointer"
          >
            <span>Inquire About {service.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
