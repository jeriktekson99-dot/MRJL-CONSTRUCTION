import { useState, useEffect } from 'react';
import { PortfolioProject } from '../types';
import { isSupabaseConfigured, fetchProjectsFromSupabase, upsertProjectInSupabase } from '../lib/supabase';

export interface ExtendedPortfolioProject extends PortfolioProject {
  assetYear?: string;
  designatedCategory?: string;
  clientLocation?: string;
  liveUrl?: string;
  galleryImages?: string[];
  detailedScope?: string;
  structuralSpecs?: string;
  inverterEquipment?: string;
  roiYield?: string;
  paybackTerm?: string;
  installedCapacity?: string;
  isDraft?: boolean;
  isTrashed?: boolean;
}

export interface TrashItem {
  id: string;
  vaultOrigin: 'Portfolio' | string;
  stampId: string;
  entityDetails: string;
  deletedAt: string;
  originalData?: ExtendedPortfolioProject;
}

const STORAGE_KEY = 'zeke_portfolio_projects_v5';
const TRASH_STORAGE_KEY = 'zeke_portfolio_trash_v3';
const EVENT_NAME = 'zeke_portfolio_updated';

// Unified Default Initial Portfolio combining Admin projects & Site projects
export const DEFAULT_INITIAL_PORTFOLIO: ExtendedPortfolioProject[] = [
  {
    id: 'PRJ-104',
    assetYear: 'ID: #PRJ-104 | Est. 2026',
    title: 'JW Marriott Bonnet Creek',
    category: 'Commercial Construction',
    designatedCategory: 'JW Marriott Bonnet Creek | Commercial Construction',
    location: 'Metro Manila',
    clientLocation: 'Bonnet Creek Development Corp. • Metro Manila',
    status: 'Ongoing',
    year: '2026',
    area: '185,000 sq ft',
    client: 'Bonnet Creek Development Corp.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80',
    description: 'High-density commercial hotel & luxury residence build with post-tensioned concrete structural framing.',
    highlights: ['Reinforced Post-Tension Slabs', 'Commercial Steel Framing', 'Civil Utility Tie-Ins'],
    liveUrl: 'https://zekedevelopment.com/portfolio/jw-marriott'
  },
  {
    id: 'PRJ-103',
    assetYear: 'ID: #PRJ-103 | Est. 2025',
    title: 'Azure Horizon Luxury Towers',
    category: 'Residential Construction',
    designatedCategory: 'Azure Horizon Towers | Residential Construction',
    location: 'Bonifacio Global City',
    clientLocation: 'Avala Land Inc. • Bonifacio Global City',
    status: 'Completed',
    year: '2025',
    area: '240,000 sq ft',
    client: 'Avala Land Inc.',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description: '42-storey luxury condominium with double-glazed acoustic facade and seismic damping system.',
    highlights: ['42-Storey High-Rise', 'Double-Glazed Acoustic Facade', 'Seismic Damping Grid'],
    liveUrl: 'https://zekedevelopment.com/portfolio/azure-horizon'
  },
  {
    id: 'ongoing-1',
    assetYear: 'ID: #PRJ-099 | Est. 2026',
    title: 'PROPOSED SUZUKI CALOOCAN EXTENSION',
    category: 'Additions & Extensions',
    designatedCategory: 'Suzuki Caloocan | Additions & Extensions',
    structureType: 'Commercial Extension & Civil Works',
    location: 'CALOOCAN CITY, PH',
    clientLocation: 'RCD CORP. • CALOOCAN CITY',
    year: '2026',
    area: '14,500 Sq. Ft.',
    status: 'Ongoing',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=1200&q=80',
    description: 'Structural civil works and multi-level commercial extension for the Suzuki Caloocan dealership complex. Features post-tension foundation slabs, heavy steel framing, and exterior glass curtain wall assemblies.',
    highlights: ['Reinforced Post-Tension Slabs', 'Commercial Steel Framing', 'Civil Utility Tie-Ins'],
    client: 'RCD CORP. (GENERAL CONTRACTOR)'
  },
  {
    id: 'ongoing-2',
    assetYear: 'ID: #PRJ-098 | Est. 2026',
    title: 'PROPOSED BALMARI HEIGHTS (RESORT)',
    category: 'Land Development',
    designatedCategory: 'Balmari Heights | Resort Land Development',
    structureType: 'Resort Land Development & Civil Works',
    location: 'BRGY. BALELE, TANAUAN CITY, BATANGAS, PH',
    clientLocation: 'MR. & MRS. ASADON • BATANGAS',
    year: '2026',
    area: '4.8 Hectares',
    status: 'Ongoing',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: 'Master resort land development project encompassing slope protection, heavy earthworks grading, subterranean drainage utility networks, and access roadway construction.',
    highlights: ['Hillside Slope Protection', 'Mass Earthworks & Grading', 'Stormwater Infrastructure'],
    client: 'MR. & MRS. ASADON'
  },
  {
    id: 'proj-1',
    assetYear: 'ID: #PRJ-097 | Est. 2025',
    title: 'The Apex Glass Cantilever Residence',
    category: 'Residential Construction',
    designatedCategory: 'Apex Glass Residence | Residential Construction',
    structureType: 'Modern Glass Villa',
    location: 'Malibu Coast, CA',
    clientLocation: 'Private Executive Estate • Malibu, CA',
    year: '2025',
    area: '8,400 Sq. Ft.',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    description: 'An architectural marvel featuring a 24-foot cantilevered glass pavilion overlooking ocean bluffs, engineered with high-precision 3D BIM modeling, spatial renderings, and load analytics.',
    highlights: ['24ft Suspended Cantilever', 'Integrated Smart Home Automation', 'Custom Terrazzo & Teak Finishes'],
    client: 'Private Executive Estate'
  },
  {
    id: 'proj-2',
    assetYear: 'ID: #PRJ-096 | Est. 2024',
    title: 'Vanguard Corporate Plaza',
    category: 'Commercial Construction',
    designatedCategory: 'Vanguard Plaza | Commercial Construction',
    structureType: 'Commercial Plaza',
    location: 'Financial District, CA',
    clientLocation: 'Vanguard Financial Group • CA',
    year: '2024',
    area: '42,000 Sq. Ft.',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'A 6-story LEED Gold certified commercial headquarters boasting a structural steel exoskeleton, passive solar facade, and subterranean automated parking system.',
    highlights: ['LEED Gold Certification', 'Structural Exoskeleton', 'Triple-Pane Acoustical Curtain Wall'],
    client: 'Vanguard Financial Group'
  },
  {
    id: 'proj-3',
    assetYear: 'ID: #PRJ-095 | Est. 2025',
    title: 'Highland Crest Master Development',
    category: 'Land Development',
    designatedCategory: 'Highland Crest | Master Land Development',
    structureType: 'Master-Planned Land',
    location: 'Oakridge Valley, CA',
    clientLocation: 'Highland Crest Developers • CA',
    year: '2025',
    area: '180 Acres',
    status: 'Ongoing',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: 'Full-scale civil infrastructure development for a 32-lot luxury residential enclave, including underground power grids, stormwater retention basins, and private access roads.',
    highlights: ['32 Luxury Parcels Prepared', 'Subterranean Utility Grid', 'Erosion Prevention Retaining Walls'],
    client: 'Highland Crest Developers'
  },
  {
    id: 'proj-4',
    assetYear: 'ID: #PRJ-094 | Est. 2024',
    title: 'The Monolith Minimalist Villa',
    category: 'Renovation & Retrofitting',
    designatedCategory: 'The Monolith Villa | Renovation & Retrofitting',
    structureType: 'Architectural Estate',
    location: 'Palm Springs, CA',
    clientLocation: 'Private Collector • Palm Springs, CA',
    year: '2024',
    area: '6,200 Sq. Ft.',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Full-gut modernization of a desert architectural estate featuring board-formed concrete walls, load-bearing reconfigurations, central atrium water mirror, and custom steel retrofitting.',
    highlights: ['Board-Formed Concrete Walls', 'Geothermal Cooling System', 'Central Atrium Water Feature'],
    client: 'Private Collector'
  },
  {
    id: 'PRJ-102',
    assetYear: 'ID: #PRJ-102 | Est. 2026',
    title: 'North Logistics & Freight Hub',
    category: 'Commercial Construction',
    designatedCategory: 'North Logistics Hub | Commercial Construction',
    location: 'Clark Freeport Zone',
    clientLocation: 'Clark Logistics Gateway • Pampanga',
    status: 'Ongoing',
    year: '2026',
    area: '320,000 sq ft',
    client: 'Clark Logistics Gateway',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    description: 'Automated distribution hub featuring heavy-duty tilt-up concrete and rooftop solar canopy grid.',
    highlights: ['Tilt-up Concrete Shell', 'Rooftop Solar Grid', 'Automated Logistics Bay'],
    liveUrl: 'https://zekedevelopment.com/portfolio/north-logistics'
  },
  {
    id: 'PRJ-101',
    assetYear: 'ID: #PRJ-101 | Est. 2024',
    title: 'Bel-Air Modernist Hillside Villa',
    category: 'Residential',
    designatedCategory: 'Bel-Air Modernist Estate | Custom Residential',
    location: 'Los Angeles, CA',
    clientLocation: 'Private Client • Los Angeles, CA',
    status: 'Completed',
    year: '2024',
    area: '14,500 sq ft',
    client: 'Private Client',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    description: 'Cantilevered architectural residence engineered over steep hillside terrain with subterranean deep piles.',
    highlights: ['Cantilevered Framework', 'Deep Micropile Anchors', 'Subterranean Suite'],
    liveUrl: 'https://zekedevelopment.com/portfolio/bel-air-estate'
  },
  {
    id: 'PRJ-100',
    assetYear: 'ID: #PRJ-100 | Est. 2026',
    title: 'Subic Bay Deepwater Port Terminal',
    category: 'Infrastructure',
    designatedCategory: 'Subic Port Terminal | Marine Infrastructure',
    location: 'Subic Bay Freeport',
    clientLocation: 'Subic Bay Metropolitan Authority • Subic',
    status: 'Ongoing',
    year: '2026',
    area: '500,000 sq ft',
    client: 'Subic Bay Metropolitan Authority',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    description: 'Deepwater container terminal berthing deck and heavy equipment loading platform.',
    highlights: ['Heavy Berthing Deck', 'Deepwater Marine Piling', 'Terminal Loading Platform'],
    liveUrl: 'https://zekedevelopment.com/portfolio/subic-port'
  }
];

export const DEFAULT_INITIAL_TRASH: TrashItem[] = [
  {
    id: '#ARCH-9901',
    vaultOrigin: 'Leads Manager',
    stampId: '#ARCH-9901 | Deleted on: Oct 25, 2026',
    entityDetails: 'Commercial Villa Design - Lead #LD-8020 (Client: Horizon Realty)',
    deletedAt: 'Oct 25, 2026'
  },
  {
    id: '#ARCH-9902',
    vaultOrigin: 'Portfolio',
    stampId: '#ARCH-9902 | Deleted on: Oct 22, 2026',
    entityDetails: 'Old Renderings - Phase 1 Harbor Terminal (#PRJ-098)',
    deletedAt: 'Oct 22, 2026'
  }
];

export function getStoredPortfolioProjects(): ExtendedPortfolioProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item: ExtendedPortfolioProject) => ({
          ...item,
          status: item.status === 'Completed' ? 'Completed' : 'Ongoing'
        }));
      }
    }
  } catch (e) {
    console.error('Error reading stored portfolio:', e);
  }
  return DEFAULT_INITIAL_PORTFOLIO.map((item) => ({
    ...item,
    status: item.status === 'Completed' ? 'Completed' : 'Ongoing'
  }));
}

export function compressImageDataUrl(dataUrl: string, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      resolve(dataUrl);
      return;
    }
    if (dataUrl.length < 150000) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function notifyStoreUpdate() {
  setTimeout(() => {
    window.dispatchEvent(new Event(EVENT_NAME));
  }, 0);
}

export function saveStoredPortfolioProjects(projects: ExtendedPortfolioProject[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    notifyStoreUpdate();
  } catch (e) {
    console.warn('LocalStorage quota limit reached while saving portfolio projects:', e);
    try {
      const slimmedProjects = projects.map((p) => ({
        ...p,
        imageUrl: p.imageUrl && p.imageUrl.startsWith('data:image/') && p.imageUrl.length > 200000
          ? 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80'
          : p.imageUrl,
        galleryImages: p.galleryImages?.map((img) =>
          img && img.startsWith('data:image/') && img.length > 200000
            ? 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80'
            : img
        )
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slimmedProjects));
    } catch (fallbackError) {
      console.warn('Fallback save also failed or storage quota completely full:', fallbackError);
    }
    notifyStoreUpdate();
  }

  // Minimal egress background sync to Supabase when configured
  if (isSupabaseConfigured()) {
    projects.forEach((proj) => {
      upsertProjectInSupabase(proj).catch((err) =>
        console.warn('Background Supabase sync error:', err)
      );
    });
  }
}

export function getStoredTrash(): TrashItem[] {
  try {
    const raw = localStorage.getItem(TRASH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored trash:', e);
  }
  return DEFAULT_INITIAL_TRASH;
}

export function saveStoredTrash(trash: TrashItem[]) {
  try {
    localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(trash));
    notifyStoreUpdate();
  } catch (e) {
    console.error('Error saving stored trash:', e);
  }
}

export function usePortfolioStore() {
  const [projects, setProjectsState] = useState<ExtendedPortfolioProject[]>(getStoredPortfolioProjects);
  const [trash, setTrashState] = useState<TrashItem[]>(getStoredTrash);

  useEffect(() => {
    const handleUpdate = () => {
      setProjectsState(getStoredPortfolioProjects());
      setTrashState(getStoredTrash());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Initial Supabase fetch sync if configured
    if (isSupabaseConfigured()) {
      fetchProjectsFromSupabase().then((remoteProjects) => {
        if (remoteProjects && remoteProjects.length > 0) {
          setProjectsState(remoteProjects);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteProjects));
          } catch (e) {
            // Ignore quota errors
          }
        }
      });
    }

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);


  const setProjects = (action: ExtendedPortfolioProject[] | ((prev: ExtendedPortfolioProject[]) => ExtendedPortfolioProject[])) => {
    setProjectsState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveStoredPortfolioProjects(next);
      return next;
    });
  };

  const setTrash = (action: TrashItem[] | ((prev: TrashItem[]) => TrashItem[])) => {
    setTrashState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      saveStoredTrash(next);
      return next;
    });
  };

  return {
    projects,
    trash,
    setProjects,
    setTrash,
  };
}
