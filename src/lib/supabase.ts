import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExtendedPortfolioProject } from '../utils/portfolioStore';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseUrl.startsWith('https://')
  );
};

// Initialize client conditionally to avoid runtime throws if env variables are empty placeholders
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ====================================================================
// LOW-EGRESS PORTFOLIO CRUD OPERATIONS
// ====================================================================

// Select explicit columns instead of `select('*')` to minimize network egress payload
const PORTFOLIO_SELECT_COLUMNS = `
  id,
  asset_year,
  title,
  category,
  designated_category,
  structure_type,
  location,
  client_location,
  status,
  year,
  area,
  client,
  image_url,
  description,
  highlights,
  live_url,
  gallery_images,
  detailed_scope,
  structural_specs,
  inverter_equipment,
  roi_yield,
  payback_term,
  installed_capacity,
  is_published,
  is_draft,
  is_trashed
`;

export async function fetchProjectsFromSupabase(): Promise<ExtendedPortfolioProject[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(PORTFOLIO_SELECT_COLUMNS)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
        console.info('ℹ️ Supabase setup note: Table "public.portfolio_projects" does not exist yet. Run /supabase/schema.sql in your Supabase SQL Editor to create tables.');
      } else {
        console.warn('Supabase portfolio fetch notice:', error.message);
      }
      return null;
    }

    if (!data) return null;

    // Map database snake_case back to camelCase ExtendedPortfolioProject
    return data.map((item: any) => ({
      id: item.id,
      assetYear: item.asset_year || `ID: #${item.id}`,
      title: item.title,
      category: item.category,
      designatedCategory: item.designated_category || `${item.title} | ${item.category}`,
      structureType: item.structure_type,
      location: item.location,
      clientLocation: item.client_location || `${item.client || 'Client'} • ${item.location || 'Site'}`,
      status: item.status || 'Ongoing',
      year: item.year || '2025',
      area: item.area,
      client: item.client,
      imageUrl: item.image_url,
      description: item.description,
      highlights: item.highlights || [],
      liveUrl: item.live_url,
      galleryImages: item.gallery_images || [],
      detailedScope: item.detailed_scope,
      structuralSpecs: item.structural_specs,
      inverterEquipment: item.inverter_equipment,
      roiYield: item.roi_yield,
      paybackTerm: item.payback_term,
      installedCapacity: item.installed_capacity,
      isDraft: item.is_draft || false,
      isTrashed: item.is_trashed || false
    }));
  } catch (err) {
    console.error('Failed to query Supabase projects:', err);
    return null;
  }
}

export async function upsertProjectInSupabase(project: ExtendedPortfolioProject): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: project.id,
      asset_year: project.assetYear,
      title: project.title,
      category: project.category,
      designated_category: project.designatedCategory,
      structure_type: project.structureType,
      location: project.location,
      client_location: project.clientLocation,
      status: project.status,
      year: project.year,
      area: project.area,
      client: project.client,
      image_url: project.imageUrl,
      description: project.description,
      highlights: project.highlights,
      live_url: project.liveUrl,
      gallery_images: project.galleryImages,
      detailed_scope: project.detailedScope,
      structural_specs: project.structuralSpecs,
      inverter_equipment: project.inverterEquipment,
      roi_yield: project.roiYield,
      payback_term: project.paybackTerm,
      installed_capacity: project.installedCapacity,
      is_draft: project.isDraft || false,
      is_trashed: project.isTrashed || false,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('portfolio_projects').upsert(payload);
    if (error) {
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        console.warn('⚠️ Supabase RLS Notice: Re-run /supabase/schema.sql in Supabase SQL Editor to apply updated RLS policies.');
      } else if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        console.info('ℹ️ Table "portfolio_projects" missing in Supabase. Please run /supabase/schema.sql.');
      } else {
        console.error('Error upserting project to Supabase:', error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase project upsert error:', err);
    return false;
  }
}

export async function deleteProjectFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) {
      console.error('Error deleting project in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase project delete exception:', err);
    return false;
  }
}

// ====================================================================
// SITE SETTINGS & SOCIAL MEDIA INTEGRATION
// ====================================================================

export async function fetchSocialLinksFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'social_links')
      .single();

    if (error || !data) return null;
    return data.value;
  } catch (err) {
    return null;
  }
}

export async function updateSocialLinksInSupabase(socialLinks: Record<string, string>): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'social_links', value: socialLinks, updated_at: new Date().toISOString() });

    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

// ====================================================================
// PASSWORD CHANGE & SOCIAL MEDIA AUTHENTICATION
// ====================================================================

/**
 * Changes current logged in user password in Supabase Auth (Low Egress)
 */
export async function signInWithSupabasePassword(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase is not configured.' };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data?.session || data?.user) {
      return { success: true };
    }

    return { success: false, message: 'Authentication returned no session.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Login failed.' };
  }
}

export async function changePasswordInSupabase(newPassword: string): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to environment variables.' };
  }
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Password changed successfully in Supabase Auth.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Password update failed.' };
  }
}

/**
 * Initiates Social Media OAuth login (Google, Facebook, GitHub, etc.)
 */
export async function signInWithSocialProvider(provider: 'google' | 'facebook' | 'github') {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sends a low-egress password reset email to user
 */
export async function requestPasswordResetInSupabase(email: string): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase is not configured.' };
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Password reset link dispatched via Supabase Auth.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Password reset request failed.' };
  }
}
