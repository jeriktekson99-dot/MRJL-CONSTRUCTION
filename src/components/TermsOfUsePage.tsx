import React from 'react';
import { Scale } from 'lucide-react';
import { ContactFooter } from './ContactFooter';

interface TermsPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigatePage: (page: 'privacy' | 'terms' | 'safety' | 'home' | 'about' | 'services' | 'portfolio') => void;
}

export const TermsOfUsePage: React.FC<TermsPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="bg-white text-zinc-900 font-sans min-h-screen">
      
      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#111111] text-white overflow-hidden border-b border-zinc-800">
        {/* Background Grayscale Architectural Image with low visibility */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=2000&q=80"
            alt="Architectural schematics"
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
            <span className="shiny-text-silver">Terms of</span> <span className="shiny-text-red">Use</span>
          </h1>
        </div>
      </section>

      {/* 2. TERMS BODY CONTENT */}
      <section className="py-16 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Intro Box */}
          <div className="p-6 bg-zinc-50 border-l-4 border-[#003399] space-y-2">
            <div className="flex items-center gap-2 text-[#FF5500] font-display text-xs font-bold uppercase tracking-widest">
              <Scale className="w-4 h-4" />
              <span>Binding Legal Agreement</span>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-700 leading-relaxed">
              By accessing our website, reviewing our architectural portfolio, requesting cost estimations, or utilizing our client portal, you agree to comply with and be bound by these Terms of Use.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                1. Intellectual Property & Architectural Ownership
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              All architectural renderings, BIM 3D models, structural drawings, engineering schematics, and text published on this website remain the sole intellectual property of MRJL Construction Corporation. Unauthorized duplication, redistribution, or reuse for building permit applications without a signed Master Service Agreement is strictly prohibited under U.S. copyright laws.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                2. Construction Estimates & Financial Projections
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Cost figures, per-square-foot estimates, and timelines displayed on the website or generated via online quote forms are for preliminary budgetary guidance only. Binding construction budgets require a formal geotechnical site inspection, structural civil engineering audit, and executed Lump-Sum or Cost-Plus General Contracting Contract.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                3. Site Access & Safety Regulations
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Active construction jobsites owned or managed by MRJL are strictly controlled industrial zones under Cal/OSHA jurisdiction. Clients and visitors are granted site entry exclusively during scheduled walkthroughs accompanied by an authorized MRJL Project Manager and equipped with required OSHA PPE. Unescorted site visits are prohibited for liability and safety reasons.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                4. Warranty & Structural Guarantees
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              All completed general contracting works are backed by MRJL’s standard 10-Year Structural Defect Warranty and 1-Year Workmanship Warranty as detailed in individual construction contracts. Web content does not alter or expand statutory warranty obligations.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                5. Governing Law & Dispute Resolution
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              These Terms of Use shall be governed by and construed in accordance with the laws of the State of California. Any legal claims arising from website usage shall be resolved through binding arbitration in Los Angeles County, California.
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
