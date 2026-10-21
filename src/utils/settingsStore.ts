import { useState, useEffect } from 'react';

export interface SocialLinks {
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

const SOCIAL_STORAGE_KEY = 'zeke_social_links_v1';
const SOCIAL_EVENT_NAME = 'zeke_social_links_updated';
const ADMIN_PASSWORD_KEY = 'zeke_admin_password';

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebookUrl: 'https://web.facebook.com/zekerealtyconstructiondevelopment',
  instagramUrl: 'https://instagram.com/zekerealty',
  tiktokUrl: 'https://tiktok.com/@zekerealty',
  linkedinUrl: 'https://linkedin.com/company/zekerealty',
  twitterUrl: 'https://twitter.com/zekerealty',
};

export function getStoredSocialLinks(): SocialLinks {
  try {
    const raw = localStorage.getItem(SOCIAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate old placeholder facebook link if present
      if (parsed.facebookUrl === 'https://facebook.com/zekerealty') {
        parsed.facebookUrl = 'https://web.facebook.com/zekerealtyconstructiondevelopment';
      }
      return { ...DEFAULT_SOCIAL_LINKS, ...parsed };
    }
  } catch (e) {
    console.error('Error reading social links from localStorage:', e);
  }
  return DEFAULT_SOCIAL_LINKS;
}

export function saveStoredSocialLinks(links: SocialLinks) {
  try {
    localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new Event(SOCIAL_EVENT_NAME));
  } catch (e) {
    console.error('Error saving social links to localStorage:', e);
  }
}

export function useSocialLinks() {
  const [socialLinks, setSocialLinksState] = useState<SocialLinks>(getStoredSocialLinks);

  useEffect(() => {
    const handleUpdate = () => {
      setSocialLinksState(getStoredSocialLinks());
    };

    window.addEventListener(SOCIAL_EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(SOCIAL_EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateSocialLinks = (newLinks: Partial<SocialLinks>) => {
    const current = getStoredSocialLinks();
    const updated = { ...current, ...newLinks };
    saveStoredSocialLinks(updated);
    setSocialLinksState(updated);
  };

  return { socialLinks, updateSocialLinks };
}

export function getAdminPassword(): string {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || '';
}

export function saveAdminPassword(password: string): void {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
}
