import React from 'react';
import { Logo } from './Logo';
import { 
  ArrowRight, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  ChevronRight
} from 'lucide-react';
import { CTA_BANNER_IMAGE, SERVICES_DATA } from '../data/siteData';
import { useSocialLinks } from '../utils/settingsStore';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.52z"/>
  </svg>
);

interface ContactFooterProps {
  onGetQuote?: () => void;
  onViewServices?: () => void;
  onNavigate?: (page: string, sectionId?: string) => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ 
  onGetQuote, 
  onViewServices,
  onNavigate 
}) => {
  const { socialLinks } = useSocialLinks();

  const handleGetQuote = () => {
    if (onGetQuote) {
      onGetQuote();
    } else {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewServices = () => {
    if (onViewServices) {
      onViewServices();
    } else {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNav = (sectionId: string) => {
    const isServiceId = SERVICES_DATA.some((s) => s.id === sectionId);
    if (isServiceId && onNavigate) {
      onNavigate('services', sectionId);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('home', sectionId);
    }
  };

  return (
    <>
      {/* Start Your Blueprint CTA Section */}
      <section id="contact" className="bg-[#0A0A0A] text-white relative py-14 sm:py-16 overflow-hidden border-t-2 border-[#003399]">
        {/* Background Image with grayscale & fade overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={CTA_BANNER_IMAGE}
            alt="Construction Crane Background"
            className="w-full h-full object-cover object-center opacity-30"
            referrerPolicy="no-referrer"
          />
          {/* Black gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]" />
        </div>

        {/* Background blueprint grid overlay */}
        <div className="absolute inset-0 blueprint-grid-dark opacity-10 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-left space-y-4">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
                Start Your Blueprint
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Ready To Build Your Dream Project?
            </h2>

            {/* Short Description */}
            <p className="font-body text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Whether you own a raw parcel ready for subdivision or require turnkey general contracting for a custom luxury estate, our master engineering team is ready.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-start gap-3">
              <a
                href="tel:09068374150"
                className="inline-flex items-center gap-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white border border-[#FF5500] font-display text-xs font-bold uppercase tracking-wider px-5 py-3 transition-all duration-200 cursor-pointer group shadow-lg"
              >
                <Phone className="w-3.5 h-3.5 text-white transition-transform group-hover:scale-110" />
                <span>Call 0906 837 4150</span>
              </a>

              <button
                onClick={handleViewServices}
                className="inline-flex items-center gap-2.5 bg-zinc-900 hover:bg-[#003399] text-white border border-zinc-700 hover:border-[#003399] font-display text-xs font-bold uppercase tracking-wider px-5 py-3 transition-all duration-200 cursor-pointer"
              >
                <span>View Services</span>
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Multi-Column Footer */}
      <footer className="bg-[#050505] text-white border-t border-zinc-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-zinc-800/80">
            
            {/* Col 1: Brand, Description & Social Media (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <Logo variant="dark" showSubtitle={true} />
              <p className="font-body text-xs sm:text-sm text-zinc-400 leading-relaxed pr-2">
                MRJL Construction Corporation is a full-service construction and development company specializing in planning and design, residential and commercial construction, land development, and general contracting solutions, delivering quality projects built on expertise, innovation, and reliability.
              </p>
              
              {/* Social Media Links */}
              <div className="pt-2">
                <span className="block font-display text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                  Connect With Us
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    { icon: Facebook, label: 'Facebook', href: socialLinks.facebookUrl },
                    { icon: Instagram, label: 'Instagram', href: socialLinks.instagramUrl },
                    { icon: TikTokIcon, label: 'TikTok', href: socialLinks.tiktokUrl },
                  ].filter(s => Boolean(s.href)).map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="w-9 h-9 bg-zinc-900 border border-zinc-800 hover:border-[#FF5500] hover:bg-[#FF5500] text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center rounded-lg"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 2: Our Services (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white">
                  Our Services
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-zinc-400 font-medium">
                {SERVICES_DATA.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => handleNav(service.id)}
                      className="hover:text-[#FF5500] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <ChevronRight className="w-3 h-3 text-[#FF5500] shrink-0" />
                      <span>{service.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Quick Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white">
                  Quick Links
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
                {[
                  { label: 'Home', action: () => handleNav('hero') },
                  { label: 'About', action: () => handleNav('about') },
                  { label: 'Services', action: () => handleNav('services') },
                  { label: 'Portfolio', action: () => handleNav('portfolio') },
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={link.action}
                      className="hover:text-[#FF5500] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <ChevronRight className="w-3 h-3 text-[#FF5500] shrink-0" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact Details & Offices (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
                <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-white">
                  Contact &amp; Office
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-zinc-400 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-bold mb-0.5">Main Office</span>
                    <span>Block 20 Lot 03, Villas at Dasmarinas Subdivision, Brgy. San Agustin 01, Dasmarinas City, Cavite</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <div>
                    <span className="block text-white font-bold mb-0.5">Direct Line</span>
                    <a href="tel:09068374150" className="hover:text-[#FF5500] transition-colors">
                      0906 837 4150
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <div>
                    <span className="block text-white font-bold mb-0.5">Email Inquiries</span>
                    <a href="mailto:info@mrjlconstruction.com" className="hover:text-[#FF5500] transition-colors">
                      info@mrjlconstruction.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#FF5500] shrink-0" />
                  <div>
                    <span className="block text-white font-bold mb-0.5">Office Hours</span>
                    <span>Mon – Sat: 8:00 AM – 5:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-medium">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} MRJL Construction Corporation. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button 
                onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('admin'); else handleNav('admin'); }} 
                className="hover:text-[#FF5500] transition-colors cursor-pointer text-left"
              >
                Admin Portal
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('privacy'); else handleNav('privacy'); }} 
                className="hover:text-[#FF5500] transition-colors cursor-pointer text-left"
              >
                Privacy Policy
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('terms'); else handleNav('terms'); }} 
                className="hover:text-[#FF5500] transition-colors cursor-pointer text-left"
              >
                Terms of Use
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('safety'); else handleNav('safety'); }} 
                className="hover:text-[#FF5500] transition-colors cursor-pointer text-left"
              >
                Safety Standard Compliance
              </button>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};


