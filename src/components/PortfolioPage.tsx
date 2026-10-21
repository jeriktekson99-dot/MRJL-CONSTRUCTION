import React, { useState, useRef, useEffect } from 'react';
import { PORTFOLIO_HERO_IMAGE } from '../data/siteData';
import { PortfolioProject } from '../types';
import { ArrowRight, MapPin, Calendar, Layers, ChevronRight, ChevronLeft, Search, Filter, ChevronDown, Check, ArrowUpDown, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { ContactFooter } from './ContactFooter';
import { PortfolioProjectDetailPage } from './PortfolioProjectDetailPage';
import { OngoingProjectRow } from './OngoingProjectRow';
import { usePortfolioStore } from '../utils/portfolioStore';

interface PortfolioPageProps {
  onSelectProject: (project: PortfolioProject) => void;
  onContactClick: () => void;
  onNavigateHome: (sectionId?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onSelectProject,
  onContactClick,
  onNavigateHome,
}) => {
  const { projects: allStoreProjects } = usePortfolioStore();
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<PortfolioProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All Projects');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Ongoing'>('All');
  const [sortOrder, setSortOrder] = useState<'all-status' | 'completed' | 'ongoing'>('all-status');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, statusFilter, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = [
    'All Projects',
    'Residential Construction',
    'Commercial Construction',
    'Renovation & Retrofitting',
    'Interior Fit-Out',
    'Waterproofing',
    'Gate & Fence Construction',
    'Additions & Extensions',
    'Land Development',
  ];

  const sortOptions = [
    { id: 'all-status' as const, label: 'All Projects' },
    { id: 'completed' as const, label: 'Completed Projects' },
    { id: 'ongoing' as const, label: 'Ongoing Projects' },
  ];

  // Helper function to match filter category
  const matchesFilter = (p: PortfolioProject & { designatedCategory?: string }, filter: string) => {
    if (filter === 'All Projects' || filter === 'All') return true;
    const cat = `${p.category || ''} ${p.designatedCategory || ''}`.toLowerCase();
    const filterLower = filter.toLowerCase();

    if (filterLower.includes('residential')) {
      return cat.includes('residential');
    }
    if (filterLower.includes('commercial')) {
      return cat.includes('commercial');
    }
    if (filterLower.includes('planning')) {
      return cat.includes('planning') || cat.includes('design');
    }
    if (filterLower.includes('renovation') || filterLower.includes('retrofitting')) {
      return cat.includes('renovation') || cat.includes('retrofitting');
    }
    if (filterLower.includes('interior')) {
      return cat.includes('interior');
    }
    if (filterLower.includes('waterproofing')) {
      return cat.includes('waterproofing');
    }
    if (filterLower.includes('gate') || filterLower.includes('fence')) {
      return cat.includes('gate') || cat.includes('fence');
    }
    if (filterLower.includes('addition') || filterLower.includes('extension')) {
      return cat.includes('addition') || cat.includes('extension');
    }
    if (filterLower.includes('land')) {
      return cat.includes('land') || cat.includes('development');
    }

    return cat.includes(filterLower);
  };

  // Public projects (exclude Drafts)
  const publicProjects = allStoreProjects.filter((p) => p.status !== 'Draft');

  const filteredProjects = publicProjects.filter((p) => {
    const matchesCat = matchesFilter(p, selectedFilter);
    const normalizedStatus = (p.status === 'Under Construction' || p.status === 'Planning Phase' || p.status === 'Ongoing')
      ? 'Ongoing'
      : (p.status || 'Completed');

    const matchesStatus =
      statusFilter === 'All' ||
      normalizedStatus.toLowerCase() === statusFilter.toLowerCase();
      
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesStatus && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === 'latest') {
      return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
    }
    if (sortOrder === 'oldest') {
      return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
    }
    if (sortOrder === 'a-z') {
      return a.title.localeCompare(b.title);
    }
    if (sortOrder === 'z-a') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // Pagination calculation (2x3 grid = 6 projects per page)
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const filterEl = document.getElementById('project-filter');
      if (filterEl) {
        filterEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Determine if showing ongoing structural list
  const isListView = statusFilter === 'Ongoing' || sortOrder === 'ongoing';

  if (selectedProjectDetail) {
    return (
      <PortfolioProjectDetailPage
        project={selectedProjectDetail}
        onBackToPortfolio={() => setSelectedProjectDetail(null)}
        onSelectProject={(proj) => {
          setSelectedProjectDetail(proj);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onContactClick={onContactClick}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section for Portfolio Page */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-[#111111] text-white overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 z-0">
          <img
            src={PORTFOLIO_HERO_IMAGE}
            alt="Luxury Architectural Portfolio Showcase"
            className="w-full h-full object-cover object-center grayscale opacity-20 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/80 via-transparent to-[#111111]" />
        </div>

        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="shiny-text-silver">Our</span> <span className="text-[#FF5500]">Portfolio</span>
          </h1>
        </div>
      </section>


      {/* 2. SEARCH, QUICK STATUS TABS & FILTER BAR SECTION */}
      <section id="project-filter" className="pt-10 sm:pt-14 pb-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Bar & Category/Sort Dropdowns */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 mb-8">
            {/* Search Input - dynamically minimizes on narrow/shrunk viewports */}
            <div className="relative flex-1 min-w-0">
              <div className="h-11 sm:h-12 flex items-center bg-[#F8F9FA] border border-zinc-300 focus-within:border-[#003399] transition-colors px-2.5 sm:px-3 shadow-2xs">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full bg-transparent px-2 sm:px-3 text-xs sm:text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none truncate"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-zinc-500 hover:text-[#FF5500] px-1.5 py-1 cursor-pointer shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Custom Category Dropdown */}
            <div className="relative w-36 sm:w-56 md:w-64 shrink-0" ref={categoryRef}>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsSortOpen(false);
                }}
                className={`w-full h-11 sm:h-12 bg-[#F8F9FA] border ${
                  isCategoryOpen ? 'border-[#003399]' : 'border-zinc-300'
                } transition-colors px-2 sm:px-3.5 shadow-2xs flex items-center justify-between cursor-pointer`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5 truncate min-w-0">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0" />
                  <span className="font-display text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-900 truncate">
                    {selectedFilter}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-[#003399]' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 sm:w-full bg-white border border-zinc-300 shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
                  {filterOptions.map((option) => {
                    const isSelected = selectedFilter === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(option);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border-b border-zinc-100 last:border-none ${
                          isSelected
                            ? 'bg-[#003399] text-white'
                            : 'text-zinc-800 hover:bg-zinc-100 hover:text-[#FF5500]'
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative w-32 sm:w-52 md:w-64 shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsCategoryOpen(false);
                }}
                className={`w-full h-11 sm:h-12 bg-[#F8F9FA] border ${
                  isSortOpen ? 'border-[#003399]' : 'border-zinc-300'
                } transition-colors px-2 sm:px-3.5 shadow-2xs flex items-center justify-between cursor-pointer`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5 truncate min-w-0">
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0" />
                  <span className="font-display text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-900 truncate">
                    {sortOptions.find((opt) => opt.id === sortOrder)?.label || 'All Projects'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-[#003399]' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-1 w-44 sm:w-full bg-white border border-zinc-300 shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
                  {sortOptions.map((opt) => {
                    const isSelected = sortOrder === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (opt.id === 'completed') {
                            setStatusFilter('Completed');
                            setSortOrder('completed');
                          } else if (opt.id === 'ongoing') {
                            setStatusFilter('Ongoing');
                            setSortOrder('ongoing');
                          } else {
                            setStatusFilter('All');
                            setSortOrder('all-status');
                          }
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer border-b border-zinc-100 last:border-none ${
                          isSelected
                            ? 'bg-[#003399] text-white'
                            : 'text-zinc-800 hover:bg-zinc-100 hover:text-[#FF5500]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>


      {/* 3. PORTFOLIO SHOWCASE SECTION */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {sortedProjects.length === 0 ? (
            <div className="text-center py-16 bg-[#F8F9FA] border border-zinc-200 my-8">
              <p className="font-display text-lg font-bold text-zinc-700 mb-2">
                No projects found matching your search or filters.
              </p>
              <button
                onClick={() => {
                  setSelectedFilter('All Projects');
                  setStatusFilter('All');
                  setSortOrder('all-status');
                  setSearchQuery('');
                }}
                className="text-xs font-bold uppercase text-[#FF5500] hover:underline cursor-pointer"
              >
                Clear Filters &amp; View All Projects
              </button>
            </div>
          ) : isListView ? (
            /* STRUCTURAL LIST VIEW */
            <div className="border-t border-zinc-900 divide-y divide-zinc-200">
              {paginatedProjects.map((project, idx) => (
                <OngoingProjectRow
                  key={project.id}
                  project={project}
                  index={startIndex + idx}
                  onClick={() => {
                    setSelectedProjectDetail(project);
                    onSelectProject(project);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          ) : (
            /* GRID VIEW (2x3 Layout = 2 Columns x 3 Rows = 6 Items per page) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {paginatedProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectDetail(project);
                    onSelectProject(project);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-white border border-zinc-200 hover:border-[#FF5500] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-zinc-900 shrink-0 border-b border-black">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
                          <span className="flex items-center gap-1.5 text-zinc-700 font-bold uppercase tracking-wider text-[11px]">
                            <Building2 className="w-3.5 h-3.5 text-[#003399] shrink-0" />
                            {project.category}
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span className="flex items-center gap-1.5 text-zinc-700">
                            <MapPin className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                            {project.location}
                          </span>
                          <span className="text-zinc-300">•</span>
                          <span className={`flex items-center gap-1.5 ${project.status === 'Ongoing' ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}`}>
                            {project.status === 'Ongoing' ? (
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                            {project.status || 'Completed'}
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-black text-zinc-900 group-hover:text-[#FF5500] transition-colors leading-snug break-words">
                          {project.title}
                        </h3>
                      </div>

                      <div className="w-10 h-10 border border-zinc-900 group-hover:border-[#FF5500] group-hover:bg-[#FF5500] text-zinc-900 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {sortedProjects.length > 0 && totalPages > 1 && (
            <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                Showing <span className="text-zinc-900 font-bold">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, sortedProjects.length)}</span> of <span className="text-zinc-900 font-bold">{sortedProjects.length}</span> Projects
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === activePage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded font-display text-xs font-black uppercase transition-colors cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[#003399] text-white shadow-xs'
                          : 'bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:border-zinc-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="px-3 py-2 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>


      {/* 4. FOOTER */}
      <ContactFooter
        onGetQuote={onContactClick}
        onViewServices={() => onNavigateHome('services')}
        onNavigate={(page, sec) => onNavigateHome(sec || page)}
      />

    </div>
  );
};
