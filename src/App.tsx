import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PartnerLogosCarousel } from './components/PartnerLogosCarousel';
import { AboutSection } from './components/AboutSection';
import { HomeAboutSection } from './components/HomeAboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactFooter } from './components/ContactFooter';
import { ServiceModal } from './components/ServiceModal';
import { ProjectModal } from './components/ProjectModal';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { PortfolioPage } from './components/PortfolioPage';
import { PortfolioProjectDetailPage } from './components/PortfolioProjectDetailPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfUsePage } from './components/TermsOfUsePage';
import { SafetyCompliancePage } from './components/SafetyCompliancePage';
import { AdminPortalPage } from './components/AdminPortalPage';
import { ServiceItem, PortfolioProject } from './types';
import { SERVICES_DATA } from './data/siteData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'services' | 'portfolio' | 'privacy' | 'terms' | 'safety' | 'admin'>('home');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const handleSelectProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (sectionId: string) => {
    setSelectedProject(null);
    setSelectedService(null);
    setActiveSection(sectionId);

    if (sectionId === 'admin') {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'privacy') {
      setCurrentPage('privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'terms') {
      setCurrentPage('terms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'safety') {
      setCurrentPage('safety');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'about') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if sectionId matches a specific service ID or 'services'
    const isServiceId = SERVICES_DATA.some((s) => s.id === sectionId);

    if (sectionId === 'services' || isServiceId) {
      setCurrentPage('services');
      setActiveSection('services');

      setTimeout(() => {
        if (isServiceId) {
          const el = document.getElementById(sectionId);
          if (el) {
            const yOffset = -90; // Navbar height offset
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (sectionId === 'portfolio') {
      setCurrentPage('portfolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'hero' || sectionId === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // For other sections like contact
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      // If element is on home page, switch to home first
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleOpenContact = () => {
    handleNavigate('contact');
  };

  if (currentPage === 'admin') {
    return (
      <AdminPortalPage
        onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
        onNavigatePage={(page) => handleNavigate(page)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-[#003399] selection:text-white">
      {/* Top Header Navigation */}
      <Navbar
        activeSection={
          selectedProject
            ? 'portfolio'
            : currentPage === 'about'
            ? 'about'
            : currentPage === 'services'
            ? 'services'
            : currentPage === 'portfolio'
            ? 'portfolio'
            : activeSection
        }
        onNavigate={handleNavigate}
        onOpenContact={handleOpenContact}
      />

      {/* Main Content View */}
      {selectedProject ? (
        <main>
          <PortfolioProjectDetailPage
            project={selectedProject}
            onBackToPortfolio={() => setSelectedProject(null)}
            onSelectProject={handleSelectProject}
            onContactClick={handleOpenContact}
            onNavigateHome={(sectionId) => {
              setSelectedProject(null);
              handleNavigate(sectionId || 'hero');
            }}
          />
        </main>
      ) : currentPage === 'about' ? (
        <main>
          <AboutPage
            onSelectService={(service) => handleNavigate(service.id)}
            onSelectProject={handleSelectProject}
            onContactClick={handleOpenContact}
            onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
          />
        </main>
      ) : currentPage === 'services' ? (
        <main>
          <ServicesPage
            onSelectService={(service) => handleNavigate(service.id)}
            onContactClick={handleOpenContact}
            onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
          />
        </main>
      ) : currentPage === 'portfolio' ? (
        <main>
          <PortfolioPage
            onSelectProject={handleSelectProject}
            onContactClick={handleOpenContact}
            onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
          />
        </main>
      ) : currentPage === 'privacy' ? (
        <main>
          <PrivacyPolicyPage
            onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
            onNavigatePage={(page) => handleNavigate(page)}
          />
        </main>
      ) : currentPage === 'terms' ? (
        <main>
          <TermsOfUsePage
            onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
            onNavigatePage={(page) => handleNavigate(page)}
          />
        </main>
      ) : currentPage === 'safety' ? (
        <main>
          <SafetyCompliancePage
            onNavigateHome={(sectionId) => handleNavigate(sectionId || 'hero')}
            onNavigatePage={(page) => handleNavigate(page)}
          />
        </main>
      ) : (
        <main>
          {/* 1. Hero Section (Dark Overlay / High Impact) */}
          <Hero
            onExploreServices={() => handleNavigate('services')}
            onViewProjects={() => handleNavigate('portfolio')}
          />

          {/* 1.5. Industry Partners Logo Carousel */}
          <PartnerLogosCarousel />

          {/* 2. About / Feature Highlights (Home Page Block 01) */}
          <HomeAboutSection />

          {/* 3. Our Services (Light Gray / Clean White Grid with 6 Core Offerings) */}
          <ServicesSection
            onSelectService={(service) => handleNavigate(service.id)}
          />

          {/* 4. Featured Portfolio Gallery (Dark / Black Section Background) */}
          <PortfolioSection
            onSelectProject={handleSelectProject}
          />

          {/* 5. Core Values / Why Choose Us (White Background) */}
          <WhyChooseUs
            onContactClick={handleOpenContact}
          />

          {/* 6. Client Testimonials (Soft Gray Background) */}
          <TestimonialsSection />

          {/* 7. Frequently Asked Questions */}
          <FaqSection />

          {/* 8. Contact & Inquiry Footer CTA (Dark / Black Background) */}
          <ContactFooter
            onGetQuote={() => handleNavigate('hero')}
            onViewServices={() => handleNavigate('services')}
            onNavigate={(page, sectionId) => handleNavigate(sectionId || page)}
          />
        </main>
      )}

      {/* Modals for Interactive Inspection */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onContactClick={() => {
          setSelectedService(null);
          handleOpenContact();
        }}
      />
    </div>
  );
}

