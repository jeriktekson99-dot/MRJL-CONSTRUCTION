import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-t-2 border-[#003399] ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs py-3.5' 
          : 'bg-white border-b border-zinc-100 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div onClick={() => handleItemClick('hero')} className="cursor-pointer">
            <Logo variant="light" />
          </div>

          {/* Desktop Nav Items (Aligned Right) */}
          <nav className="hidden lg:flex items-center gap-8 ml-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 cursor-pointer ${
                    isActive 
                      ? 'text-[#003399]' 
                      : 'text-zinc-700 hover:text-[#FF5500]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003399] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-zinc-800 hover:text-[#FF5500] hover:bg-orange-50/50 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 shadow-xl px-4 pt-4 pb-6 mt-3 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`text-left px-3 py-2.5 text-base font-semibold rounded-md transition-colors ${
                  activeSection === item.id
                    ? 'text-[#003399] bg-blue-50/60 font-bold border-l-2 border-[#003399]'
                    : 'text-zinc-800 hover:text-[#FF5500] hover:bg-orange-50/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
