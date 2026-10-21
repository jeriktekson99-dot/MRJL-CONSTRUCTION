export const PORTFOLIO_CATEGORIES = [
  'Residential Construction',
  'Commercial Construction',
  'Renovation & Retrofitting',
  'Interior Fit-Out',
  'Waterproofing',
  'Gate & Fence Construction',
  'Additions & Extensions',
  'Land Development',
] as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];

export type ServiceCategory = 
  | 'Planning & Design'
  | 'Residential Construction'
  | 'Commercial Construction'
  | 'Renovation & Retrofitting'
  | 'Interior Fit-Out'
  | 'Waterproofing'
  | 'Gate & Fence Construction'
  | 'Additions & Extensions'
  | 'Land Development'
  | string;

export interface ServiceItem {
  id: string;
  title: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  statsBadge: string;
  deliverables: string[];
  imageUrl?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: ServiceCategory | 'Residential' | 'Commercial' | string;
  structureType?: string;
  location: string;
  year: string;
  area: string;
  status?: 'Completed' | 'Ongoing' | string;
  imageUrl: string;
  description: string;
  highlights?: string[];
  client: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  projectType: string;
  rating: number;
  quoteSnippet: string;
  fullFeedback: string;
  avatarUrl: string;
  location: string;
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
  metric: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  serviceNeeded: ServiceCategory | '';
  message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  imageUrl: string;
  isFeatured?: boolean;
}
