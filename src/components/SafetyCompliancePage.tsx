import React from 'react';
import { HardHat } from 'lucide-react';
import { ContactFooter } from './ContactFooter';

interface SafetyPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigatePage: (page: 'privacy' | 'terms' | 'safety' | 'home' | 'about' | 'services' | 'portfolio') => void;
}

export const SafetyCompliancePage: React.FC<SafetyPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="bg-white text-zinc-900 font-sans min-h-screen">
      
      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#111111] text-white overflow-hidden border-b border-zinc-800">
        {/* Background Grayscale Architectural Image with low visibility */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80"
            alt="Construction engineering site"
            className="w-full h-full object-cover object-center grayscale opacity-20 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Fade gradient: dark/solid on the left fading toward the image on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-[#111111]/30 pointer-events-none" />
          {/* Top/bottom smooth fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#111111] pointer-events-none" />
        </div>

        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="shiny-text-silver">Safety Standard</span> <span className="shiny-text-red">Compliance</span>
          </h1>
        </div>
      </section>

      {/* 2. SAFETY BODY CONTENT */}
      <section className="py-16 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Zero Incident Badge Box */}
          <div className="p-6 bg-zinc-50 border-l-4 border-[#003399] space-y-2">
            <div className="flex items-center gap-2 text-[#FF5500] font-display text-xs font-bold uppercase tracking-widest">
              <HardHat className="w-4 h-4" />
              <span>Zero-Harm Jobsite Mandate</span>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-700 leading-relaxed">
              At MRJL Construction Corporation, safety is an active engineering discipline. Every worker, engineer, subcontractor, and visitor returns home safe every single day — without exception.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                1. Cal/OSHA & Federal Safety Compliance
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              All active job sites operated by MRJL strictly enforce California Division of Occupational Safety and Health (Cal/OSHA) standards. Our Injury and Illness Prevention Program (IIPP) is updated annually and enforced by dedicated, certified Site Safety Officers.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                2. Mandatory Personal Protective Equipment (PPE)
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              100% Personal Protective Equipment (PPE) compliance is strictly enforced across all job site perimeters, material staging areas, and active construction zones:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-body text-xs sm:text-sm text-zinc-600 pl-2">
              <li><strong>Head & Impact Protection:</strong> ANSI Z89.1 certified Type II hard hats required at all times within active construction perimeters.</li>
              <li><strong>High-Visibility Gear:</strong> Class 2 and Class 3 reflective safety vests mandated for all personnel and ground operators.</li>
              <li><strong>Footwear Standards:</strong> Steel-toe or composite-toe OSHA-rated safety boots required on all jobsite grounds.</li>
              <li><strong>Eye & Hearing Protection:</strong> ANSI-approved safety glasses and decibel-rated hearing protection enforced during equipment operations.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                3. Structural Civil Inspection & Materials Testing
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Structural safety starts in the soil and steel. Every foundation pour undergoes third-party slump testing, rebar structural verification, and continuous geotechnical load testing prior to frame erection.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                4. Environmental & Dust Control Protocols
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              We adhere strictly to SCAQMD Rule 403 for dust mitigation, SWPPP water runoff prevention, and non-hazardous construction waste diversion to maintain healthy air quality and eco-friendly site management.
            </p>
          </div>



        </div>
      </section>

      {/* FOOTER */}
      <ContactFooter
        onGetQuote={() => onNavigateHome('hero')}
        onViewServices={() => onNavigateHome('services')}
        onNavigate={(page, sectionId) => {
          if (page === 'privacy' || page === 'terms' || page === 'safety') {
            onNavigatePage(page as any);
          } else {
            onNavigateHome(sectionId || page);
          }
        }}
      />
    </div>
  );
};
