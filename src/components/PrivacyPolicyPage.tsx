import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ContactFooter } from './ContactFooter';

interface PolicyPageProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigatePage: (page: 'privacy' | 'terms' | 'safety' | 'home' | 'about' | 'services' | 'portfolio') => void;
}

export const PrivacyPolicyPage: React.FC<PolicyPageProps> = ({ onNavigateHome, onNavigatePage }) => {
  return (
    <div className="bg-white text-zinc-900 font-sans min-h-screen">
      
      {/* 1. HERO HEADER */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#111111] text-white overflow-hidden border-b border-zinc-800">
        {/* Background Grayscale Architectural Image with low visibility */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
            alt="Corporate architecture"
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
            <span className="shiny-text-silver">Privacy</span> <span className="shiny-text-red">Policy</span>
          </h1>
        </div>
      </section>

      {/* 2. POLICY BODY CONTENT */}
      <section className="py-16 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Intro Highlights Box */}
          <div className="p-6 bg-zinc-50 border-l-4 border-[#003399] space-y-2">
            <div className="flex items-center gap-2 text-[#FF5500] font-display text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Protection Promise</span>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-700 leading-relaxed">
              We never sell, rent, or commercialize your personal or property data. Information collected is strictly utilized for architectural planning, civil engineering permits, construction execution, and property conveyance.
            </p>
          </div>

          {/* Article 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                1. Information We Collect
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              When engaging MRJL Construction Corporation for general contracting, architectural blueprints, or real estate acquisition, we collect necessary identifying information, including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-body text-xs sm:text-sm text-zinc-600 pl-2">
              <li><strong>Contact Information:</strong> Full legal name, corporate title, email address, phone numbers, and mailing address.</li>
              <li><strong>Property & Terrain Data:</strong> Parcel numbers, land deeds, topographic surveys, soil testing reports, and municipal zoning documentation.</li>
              <li><strong>Financial & Transaction Records:</strong> Escrow details, project funding verification, construction billing preferences, and milestone payment schedules.</li>
              <li><strong>Digital Interactions:</strong> IP addresses, browser specifications, and usage telemetry collected via our client portal and web inquiries.</li>
            </ul>
          </div>

          {/* Article 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                2. How We Utilize Your Data
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Client data is strictly used for legitimate business operations and municipal regulatory compliance, including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-body text-xs sm:text-sm text-zinc-600 pl-2">
              <li>Drafting architectural schematics, structural engineering calculations, and BIM digital twins.</li>
              <li>Submitting building permits, environmental impact assessments, and utility easements to local city and county agencies.</li>
              <li>Managing jobsite material staging, subcontractor clearances, and daily site safety logs.</li>
              <li>Issuing post-occupancy warranties, structural guarantees, and property handover documentation.</li>
            </ul>
          </div>

          {/* Article 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                3. Third-Party Disclosures & Regulatory Submissions
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              We share project and client data only under strict confidentiality agreements with authorized partners involved in project delivery:
            </p>
            <ul className="list-disc list-inside space-y-1.5 font-body text-xs sm:text-sm text-zinc-600 pl-2">
              <li><strong>Governmental Authorities:</strong> Municipal building departments, Cal/OSHA, and environmental protection boards for statutory approvals.</li>
              <li><strong>Engineering Consultants:</strong> Subcontracted geotechnical engineers, MEP designers, and land surveyors bound by NDA requirements.</li>
              <li><strong>Financial Institutions:</strong> Escrow companies, lenders, and title companies necessary for real estate transaction execution.</li>
            </ul>
          </div>

          {/* Article 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                4. Data Security & Encryption Standards
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              We employ enterprise-grade security protocols to safeguard all physical schematics and digital assets. All digital communications are encrypted via SSL/TLS protocols, and BIM models are stored on secure cloud servers with strict role-based access control (RBAC).
            </p>
          </div>

          {/* Article 5 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                5. Your Privacy Rights (CCPA / CPRA)
              </h2>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Under the California Consumer Privacy Act (CCPA) and CPRA, California residents have the right to request access to, deletion of, or restriction of their personal information. To submit a privacy request, contact our Compliance Office below.
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
