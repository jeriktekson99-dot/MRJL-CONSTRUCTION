import React from 'react';
import { SERVICES_DATA } from '../data/siteData';
import { ServiceItem } from '../types';
import { 
  Compass, 
  Layers, 
  Building2, 
  Hammer, 
  Maximize2, 
  Home, 
  ShieldCheck, 
  Building,
  Droplets,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

interface AboutCoreCapabilitiesProps {
  onSelectService: (service: ServiceItem) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Maximize2: <Maximize2 className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Droplets: <Droplets className="w-5 h-5" />
};

export const AboutCoreCapabilities: React.FC<AboutCoreCapabilitiesProps> = ({ onSelectService }) => {
  const capabilities = SERVICES_DATA.slice(0, 8);

  return (
    <section id="capabilities" className="py-20 sm:py-24 bg-white text-zinc-900 relative overflow-hidden border-t border-zinc-200">
      {/* Subtle blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                Our Core Capabilities
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900">
              End-to-End Capabilities — <br />
              <span className="text-[#FF5500]">Integrated Built Solutions</span>
            </h2>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-[#FF5500] hover:text-[#003399] group border-b-2 border-[#FF5500] pb-1 shrink-0 transition-colors"
          >
            <span>Request Full Technical Specs</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 2x4 Grid (4 Columns x 2 Rows = 8 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative bg-white border border-black shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="h-1.5 bg-[#003399] group-hover:bg-[#FF5500] transition-colors w-full shrink-0" />

              {/* Image Container */}
              {service.imageUrl && (
                <div className="relative h-40 w-full bg-zinc-100 border-b border-black">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute -bottom-5 left-5 p-2.5 bg-zinc-900 text-[#FF5500] border-2 border-white shadow-lg group-hover:bg-[#003399] group-hover:text-white transition-colors duration-300 z-10">
                    {ICON_MAP[service.iconName] || <Building2 className="w-5 h-5" />}
                  </div>
                </div>
              )}

              {/* Card Content Body */}
              <div className="p-5 pt-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-zinc-900 group-hover:text-[#FF5500] transition-colors mb-4 leading-snug">
                    {service.title}
                  </h3>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="font-display text-[11px] font-bold uppercase tracking-wider text-zinc-900 group-hover:text-[#FF5500] transition-colors inline-flex items-center gap-1.5">
                    <span>Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
