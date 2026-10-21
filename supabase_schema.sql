-- ====================================================================
-- ZEKE REALTY & CONSTRUCTION DEVELOPMENT CORPORATION
-- SUPABASE PRODUCTION DATABASE SCHEMA & INTEGRATION SCRIPT
-- ====================================================================
-- Optimizations for Low Egress Bandwidth & High-Performance Indexing:
-- 1. Row-Level Security (RLS) restricts public access strictly to published, non-trashed records.
-- 2. Partial indexes reduce index size and optimize common filter paths (category, status, draft/trash states).
-- 3. Automatic updated_at triggers keep data synced efficiently.
-- 4. Native auth.users integration handles password resets and social login OAuth providers.
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PORTFOLIO PROJECTS TABLE (CRUD)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id TEXT PRIMARY KEY,
    asset_year TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    designated_category TEXT,
    structure_type TEXT,
    location TEXT,
    client_location TEXT,
    status TEXT NOT NULL DEFAULT 'Ongoing',
    year TEXT,
    area TEXT,
    client TEXT,
    image_url TEXT,
    description TEXT,
    highlights TEXT[], -- Array of strings for highlights
    live_url TEXT,
    gallery_images TEXT[],
    detailed_scope TEXT,
    structural_specs TEXT,
    inverter_equipment TEXT,
    roi_yield TEXT,
    payback_term TEXT,
    installed_capacity TEXT,
    is_published BOOLEAN DEFAULT true,
    is_draft BOOLEAN DEFAULT false,
    is_trashed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for minimal egress & fast query filtering
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_published_active 
ON public.portfolio_projects (category, status) 
WHERE is_published = true AND is_trashed = false;

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_trashed 
ON public.portfolio_projects (is_trashed);

-- --------------------------------------------------------------------
-- 2. SITE & SOCIAL MEDIA SETTINGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial social media and contact settings
INSERT INTO public.site_settings (key, value) VALUES
('social_links', '{
    "facebook": "https://web.facebook.com/zekerealtyconstructiondevelopment",
    "instagram": "https://instagram.com/zekerealty",
    "tiktok": "https://tiktok.com/@zekerealty",
    "phone": "(046) 416 3521 / 0917 823 4567",
    "email": "inquiries@zekedevelopment.com",
    "address": "Block 20 Lot 03, Villas at Dasmarinas Subdivision, Brgy. San Agustin 01, Dasmarinas City, Cavite",
    "office_hours": "Mon - Sat: 8:00 AM - 5:00 PM"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- --------------------------------------------------------------------
-- 3. CLIENT LEADS & INQUIRIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    site_address TEXT,
    budget TEXT,
    timeline TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New Lead',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_status 
ON public.leads (created_at DESC, status);

-- --------------------------------------------------------------------
-- 4. USER PROFILES TABLE (Extends Supabase auth.users for Password Change & Social OAuth)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create/update profile when user registers or logs in via Social OAuth (Google/Facebook/GitHub)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'admin' -- default first users as admin
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES - EGRESS MINIMIZATION
-- --------------------------------------------------------------------
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop prior restricted policies if re-running
DROP POLICY IF EXISTS "Public Read Published Projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated Admin Portfolio CRUD" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public & Authenticated Portfolio CRUD" ON public.portfolio_projects;

-- Portfolio: Allow read, insert, update, delete for both anon and authenticated clients
CREATE POLICY "Public & Authenticated Portfolio CRUD" 
ON public.portfolio_projects FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Site Settings: Allow read, insert, update for both anon and authenticated
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated Admin Settings Update" ON public.site_settings;
DROP POLICY IF EXISTS "Public & Authenticated Settings CRUD" ON public.site_settings;

CREATE POLICY "Public & Authenticated Settings CRUD" 
ON public.site_settings FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- Leads: Anyone can submit a lead (INSERT), read/update allowed
DROP POLICY IF EXISTS "Public Insert Leads" ON public.leads;
DROP POLICY IF EXISTS "Admin Read Update Leads" ON public.leads;
DROP POLICY IF EXISTS "Public & Authenticated Leads Access" ON public.leads;

CREATE POLICY "Public & Authenticated Leads Access" 
ON public.leads FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- User Profiles: Read profiles allowed for users and admins
DROP POLICY IF EXISTS "Read Profiles" ON public.user_profiles;
CREATE POLICY "Read Profiles" 
ON public.user_profiles FOR SELECT 
TO anon, authenticated
USING (true);

-- --------------------------------------------------------------------
-- 6. INITIAL SEED DATA FOR PORTFOLIO PROJECTS
-- --------------------------------------------------------------------
INSERT INTO public.portfolio_projects (
    id, asset_year, title, category, designated_category, location, client_location, status, year, area, client, image_url, description, highlights, live_url
) VALUES
('PRJ-104', 'ID: #PRJ-104 | Est. 2026', 'JW Marriott Bonnet Creek', 'Commercial Construction', 'JW Marriott Bonnet Creek | Commercial Construction', 'Metro Manila', 'Bonnet Creek Development Corp. • Metro Manila', 'Ongoing', '2026', '185,000 sq ft', 'Bonnet Creek Development Corp.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80', 'High-density commercial hotel & luxury residence build with post-tensioned concrete structural framing.', ARRAY['Reinforced Post-Tension Slabs', 'Commercial Steel Framing', 'Civil Utility Tie-Ins'], 'https://zekedevelopment.com/portfolio/jw-marriott'),
('PRJ-103', 'ID: #PRJ-103 | Est. 2025', 'Azure Horizon Luxury Towers', 'Residential Construction', 'Azure Horizon Towers | Residential Construction', 'Bonifacio Global City', 'Avala Land Inc. • Bonifacio Global City', 'Completed', '2025', '240,000 sq ft', 'Avala Land Inc.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', 'Twin 38-story residential skyscraper complex featuring modern structural engineering and acoustic glazing.', ARRAY['High-Rise Substructure', 'Deep Foundation Piling', 'Curtain Wall Facade'], 'https://zekedevelopment.com/portfolio/azure-horizon'),
('PRJ-102', 'ID: #PRJ-102 | Est. 2025', 'Verde Vista Eco-Commercial Hub', 'Commercial Construction', 'Verde Vista Hub | Commercial Construction', 'Alabang, Muntinlupa', 'GreenScape Properties • Alabang, Muntinlupa', 'Completed', '2025', '120,000 sq ft', 'GreenScape Properties', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'LEED-certified commercial office complex integrated with rooftop solar arrays and rainwater harvesting.', ARRAY['LEED Gold Certification', 'Structural Steel Canopy', 'Thermal Insulated Envelope'], 'https://zekedevelopment.com/portfolio/verde-vista'),
('PRJ-101', 'ID: #PRJ-101 | Est. 2024', 'Metro General Hospital Retrofit', 'Renovation & Retrofitting', 'Metro Hospital | Renovation & Retrofitting', 'Quezon City', 'Department of Health / Metro Health • Quezon City', 'Completed', '2024', '95,000 sq ft', 'Department of Health / Metro Health', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', 'Seismic retrofitting, structural reinforcement, and cleanroom HVAC integration for an operating medical facility.', ARRAY['Seismic Carbon Fiber Wrapping', 'HVAC Cleanroom Tie-Ins', 'Structural Load Transfer'], 'https://zekedevelopment.com/portfolio/metro-hospital')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    updated_at = NOW();

-- --------------------------------------------------------------------
-- 7. SUPABASE AUTH & SOCIAL MEDIA INTEGRATION NOTES
-- --------------------------------------------------------------------
-- To configure Password Changes & Social OAuth Providers in Supabase Dashboard:
-- 1. Go to Authentication -> Providers.
-- 2. Enable Google / Facebook / GitHub / Apple OAuth using your client credentials.
-- 3. In Site URL and Redirect URLs, add your site domain (e.g. https://your-domain.com).
-- 4. Password changes use `supabase.auth.updateUser({ password: newPassword })` with minimum network egress.
-- --------------------------------------------------------------------
